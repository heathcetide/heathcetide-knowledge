import {
  ItemView,
  MarkdownRenderer,
  Notice,
  Setting,
  PluginSettingTab,
  Modal,
} from "obsidian";
import { VIEW_TYPE_BAGU, EBBINGHAUS_DEFAULT } from "./constants.js";
import { ensureDailyPlan, planQueue, planTaskStatus } from "./db.js";
import { scheduleCard, scheduleFromScore } from "./srs.js";
import { scoreWithOllama } from "./ollama.js";
import { renderEbbinghausSvg, renderHeatmapSvg } from "./charts.js";
import { todayKey } from "./util.js";
import {
  asrSupported,
  createRecorder,
  transcribeBlob,
  ASR_PRESETS,
} from "./asr.js";

class LogDetailModal extends Modal {
  constructor(app, log) {
    super(app);
    this.log = log;
  }
  onOpen() {
    const { contentEl, log } = this;
    contentEl.empty();
    contentEl.addClass("bagu-log-modal");
    contentEl.createEl("h2", { text: "复习详情" });
    const meta = contentEl.createDiv({ cls: "bagu-meta" });
    meta.setText(
      `${log.module || "-"} · ${log.path || ""} · ${new Date(
        log.reviewed_at
      ).toLocaleString()}`
    );
    contentEl.createEl("h3", { text: "题目" });
    contentEl.createDiv({ text: log.question || log.card_id || "" });
    contentEl.createEl("h3", { text: "评分" });
    contentEl.createDiv({
      text: `分数 ${log.score != null ? log.score : "-"} · 档位 ${
        log.grade || "-"
      } · 间隔 ${log.scheduled_days != null ? log.scheduled_days : "-"} 天 · 模式 ${
        log.mode || "-"
      }`,
    });
    if (log.feedback) {
      contentEl.createEl("h3", { text: "评语" });
      contentEl.createDiv({ text: log.feedback });
    }
    contentEl.createEl("h3", { text: "我的作答" });
    contentEl.createDiv({
      cls: "bagu-mine",
      text: log.user_answer || "（未记录）",
    });
    contentEl.createEl("h3", { text: "参考答案" });
    const ans = contentEl.createDiv({ cls: "bagu-answer bagu-selectable" });
    ans.createEl("pre", { cls: "bagu-selectable", text: log.answer || "（无）" });
  }
}

export class BaguView extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.tab = "today"; // today | drill | bank | fav | stats | history
    this.mode = "write";
    this.sessionMode = "specialty"; // specialty | quiz | fav | pick
    this.modules = [];
    this.selectedModules = new Set();
    this.quizModules = new Set();
    this.current = null;
    this.revealed = false;
    this.writeDraft = "";
    this.aiResult = null; // { score, feedback, missing, hits, grade }
    this.aiLoading = false;
    this.cooldown = [];
    this.sessionQueue = [];
    this.plan = null;
    this._recorder = null;
    this._asrBusy = false;
    /** 题库筛选 */
    this.bankModule = "";
    this.bankKeyword = "";
    this.bankState = "";
    this.bankFavOnly = false;
    /** 题库多选 id */
    this.bankPicked = new Set();
    this._onKey = this._onKey.bind(this);
  }

  getViewType() {
    return VIEW_TYPE_BAGU;
  }
  getDisplayText() {
    return "秋招八股";
  }
  getIcon() {
    return "calendar-check";
  }

  async onOpen() {
    this.contentEl.empty();
    this.contentEl.addClass("bagu-view");
    await this.plugin.ensureDb();
    await this.plugin.syncIndex(false);
    this.loadModules();
    this.refreshPlan();
    this.render();
    window.addEventListener("keydown", this._onKey);
  }

  async onClose() {
    window.removeEventListener("keydown", this._onKey);
    this.stopAsr(true);
  }

  stopAsr(silent = false) {
    if (this._recorder) {
      try {
        this._recorder.cleanup();
      } catch (_) {}
      this._recorder = null;
    }
    this._asrBusy = false;
    if (!silent) this.render();
  }

  _onKey(e) {
    if (!this.leaf || this.leaf.view !== this) return;
    if (this.tab !== "drill") return;
    const tag = (e.target && e.target.tagName) || "";
    if (tag === "TEXTAREA" || tag === "INPUT") {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        this.runAiScore();
      }
      return;
    }
    // 正在划选文字时不抢快捷键，方便复制参考答案
    const sel = window.getSelection && window.getSelection();
    if (sel && String(sel).length > 0) return;

    if (e.key === " " || e.code === "Space") {
      e.preventDefault();
      if (!this.revealed) this.reveal();
      return;
    }
    if (!this.revealed || this.aiLoading) return;
    if (e.key === "Enter" && this.aiResult) {
      e.preventDefault();
      this.commitAiScore();
      return;
    }
    if (this.plugin.settings.allowManualGrade) {
      if (e.key === "1") this.grade("again");
      if (e.key === "2") this.grade("hard");
      if (e.key === "3") this.grade("good");
      if (e.key === "4") this.grade("easy");
    }
  }

  loadModules() {
    const rows = this.plugin.db.getModules();
    this.modules = rows.map((r) => r.module);
    const pref = this.plugin.settings.preferredModules || [];
    if (!this.selectedModules.size) {
      if (pref.length) pref.forEach((m) => this.selectedModules.add(m));
      else this.modules.forEach((m) => this.selectedModules.add(m));
    }
    const qpref = this.plugin.settings.quizModules || [];
    if (!this.quizModules.size) {
      if (qpref.length) qpref.forEach((m) => this.quizModules.add(m));
      else this.modules.forEach((m) => this.quizModules.add(m));
    }
  }

  moduleSet() {
    return this.selectedModules;
  }

  quizModuleSet() {
    return this.quizModules;
  }

  refreshPlan(force = false) {
    if (force) {
      const dateKey = todayKey();
      this.plugin.db.db.run(`DELETE FROM daily_plans WHERE plan_date = ?`, [
        dateKey,
      ]);
    }
    this.plan = ensureDailyPlan(
      this.plugin.db,
      this.plugin.settings,
      this.moduleSet(),
      this.quizModuleSet()
    );
    this.sessionQueue = planQueue(this.plan, this.sessionMode);
  }

  async render() {
    const root = this.contentEl;
    root.empty();
    root.addClass("bagu-view");

    const header = root.createDiv({ cls: "bagu-header" });
    const titleRow = header.createDiv({ cls: "bagu-header-left" });
    titleRow.createDiv({ cls: "bagu-title", text: "秋招八股复习" });
    const syncTop = titleRow.createEl("button", {
      cls: "bagu-sync-btn",
      text: "同步笔记",
      attr: { title: "从 Markdown 重新导入题目到 SQLite" },
    });
    syncTop.onclick = () => this.syncFromNotes();
    this.statsEl = header.createDiv({ cls: "bagu-stats" });

    const tabs = root.createDiv({ cls: "bagu-tabs" });
    for (const [id, label] of [
      ["today", "今日计划"],
      ["drill", "开始刷题"],
      ["bank", "题库"],
      ["fav", "收藏"],
      ["stats", "统计"],
      ["history", "历史"],
    ]) {
      const b = tabs.createEl("button", {
        cls: "bagu-tab" + (this.tab === id ? " is-on" : ""),
        text: label,
      });
      b.onclick = () => {
        this.tab = id;
        if (id === "drill" && !this.current) this.nextFromPlan();
        this.render();
      };
    }

    this.bodyEl = root.createDiv({ cls: "bagu-body" });
    this.updateHeaderStats();

    if (this.tab === "today") this.renderToday();
    else if (this.tab === "drill") await this.renderDrill();
    else if (this.tab === "bank") this.renderBank();
    else if (this.tab === "fav") this.renderFavorites();
    else if (this.tab === "stats") this.renderStats();
    else this.renderHistory();
  }

  updateHeaderStats() {
    if (!this.statsEl || !this.plan) return;
    const tasks = planTaskStatus(this.plan, this.plugin.settings);
    const ov = this.plugin.db.statsOverview();
    const favN = this.plugin.db.countFavorites();
    const acc =
      tasks.accuracy != null ? `准确率 ${tasks.accuracy}%` : "准确率 -";
    this.statsEl.setText(
      `专题 ${tasks.specialtyDoneCount}/${tasks.specialtyTotal} · 拷问 ${tasks.quizDoneCount}/${tasks.quizTotal} · ${acc} · 收藏 ${favN} · 连续 ${ov.streak} 天`
    );
  }

  renderModuleChips(parent, targetSet, saveKey) {
    const wrap = parent.createDiv({ cls: "bagu-modules" });
    for (const m of this.modules) {
      const row = this.plugin.db.getModules().find((x) => x.module === m);
      const chip = wrap.createSpan({
        cls: "bagu-chip" + (targetSet.has(m) ? " is-on" : ""),
        text: `${m}${row ? ` (${row.cnt})` : ""}`,
      });
      chip.onclick = () => {
        if (targetSet.has(m)) targetSet.delete(m);
        else targetSet.add(m);
        this.plugin.settings[saveKey] = [...targetSet];
        this.plugin.saveSettings();
        chip.toggleClass("is-on", targetSet.has(m));
      };
    }
  }

  renderToday() {
    const el = this.bodyEl;
    el.empty();

    const toolbar = el.createDiv({ cls: "bagu-toolbar" });
    const sync = toolbar.createEl("button", {
      cls: "mod-cta",
      text: "同步笔记",
    });
    sync.onclick = () => this.syncFromNotes();
    const regen = toolbar.createEl("button", { text: "重滚今日计划" });
    regen.onclick = () => {
      this.refreshPlan(true);
      new Notice("已重新生成：整专题 + 限定范围拷问");
      this.render();
    };

    el.createEl("h3", { text: "专题轮换范围（任务一从中选整天专题）" });
    this.renderModuleChips(el, this.selectedModules, "preferredModules");

    el.createEl("h3", { text: "拷问抽题范围（任务二从此范围随机抽 15 题）" });
    this.renderModuleChips(el, this.quizModules, "quizModules");
    el.createDiv({
      cls: "bagu-tip",
      text: "改范围后请点「重滚今日计划」才会按新范围重新抽题。",
    });

    const plan = this.plan;
    const tasks = planTaskStatus(plan, this.plugin.settings);
    const box = el.createDiv({ cls: "bagu-plan-card" });
    box.createEl("h3", { text: `今日双任务 · ${plan.plan_date}` });

    const t1 = box.createDiv({
      cls: "bagu-task" + (tasks.specialtyDone ? " is-done" : ""),
    });
    t1.createDiv({
      cls: "bagu-task-title",
      text: `任务一 · 清完专题「${tasks.focusModule || "-"}」 ${tasks.specialtyDoneCount}/${tasks.specialtyTotal}`,
    });
    t1.createDiv({
      cls: "bagu-tip",
      text: tasks.specialtyDone
        ? "专题已全部复习完"
        : "需复习完该专题下全部题目（非整日额度）",
    });
    const b1 = t1.createEl("button", {
      cls: "mod-cta",
      text: "开始专题复习",
    });
    b1.onclick = () => {
      this.sessionMode = "specialty";
      this.tab = "drill";
      this.nextFromPlan();
      this.render();
    };

    const t2 = box.createDiv({
      cls: "bagu-task" + (tasks.quizComplete ? " is-done" : ""),
    });
    const accText =
      tasks.accuracy != null
        ? `准确率 ${tasks.accuracy}%（≥${tasks.passScore} 分算对）`
        : "准确率待统计";
    const avgText =
      tasks.avgScore != null ? ` · 均分 ${tasks.avgScore}` : "";
    t2.createDiv({
      cls: "bagu-task-title",
      text: `任务二 · 限定范围拷问 ${tasks.quizDoneCount}/${tasks.quizTotal} · ${accText}${avgText}`,
    });
    t2.createDiv({
      cls: "bagu-tip",
      text: `范围：${
        (tasks.quizModules && tasks.quizModules.length
          ? tasks.quizModules.join("、")
          : "全部") || "全部"
      } · 随机抽 ${this.plugin.settings.quizCount || 15} 题测掌握`,
    });
    const b2 = t2.createEl("button", {
      cls: "mod-cta",
      text: "开始拷问抽测",
    });
    b2.onclick = () => {
      this.sessionMode = "quiz";
      this.tab = "drill";
      this.nextFromPlan();
      this.render();
    };

    const bar = box.createDiv({ cls: "bagu-progress" });
    const total =
      tasks.specialtyTotal + tasks.quizTotal || 1;
    const done =
      tasks.specialtyDoneCount + tasks.quizDoneCount;
    const pct = Math.round((done / total) * 100);
    bar.createDiv({
      cls: "bagu-progress-fill",
      attr: { style: `width:${pct}%` },
    });

    const s = this.plugin.settings;
    el.createDiv({
      cls: "bagu-tip",
      text: `调度：${
        s.scheduler === "ebbinghaus" ? "艾宾浩斯" : "SM-2"
      } · 模型 ${s.ollamaModel || "minimax-m3:cloud"}`,
    });

    const charts = el.createDiv({ cls: "bagu-charts" });
    const heat = charts.createDiv({ cls: "bagu-chart-block" });
    renderHeatmapSvg(heat, this.plugin.db.dailyReviewCounts(130), 16);
    const curve = charts.createDiv({ cls: "bagu-chart-block" });
    renderEbbinghausSvg(curve, s.ebbinghausSteps || EBBINGHAUS_DEFAULT);
  }

  async syncFromNotes() {
    const n = await this.plugin.syncIndex(true);
    this.loadModules();
    // 刷新当前题正文（答案/题干若有更新）
    if (this.current && this.current.id) {
      const fresh = this.plugin.db.getCardJoin(this.current.id);
      if (fresh) this.current = fresh;
      else {
        // 题干改写导致 id 变化时，换下一题
        this.nextFromPlan();
      }
    }
    this.aiResult = null;
    this.revealed = false;
    this.writeDraft = "";
    this.render();
    return n;
  }

  nextFromPlan() {
    this.refreshPlan(false);
    if (this.sessionMode === "fav") {
      const favs = this.plugin.db.listFavorites(500).map((r) => r.id);
      this.sessionQueue = favs.filter((id) => !this.cooldown.includes(id));
      if (!this.sessionQueue.length && favs.length) {
        // 全部在冷却里则重置冷却再取
        this.cooldown = [];
        this.sessionQueue = favs.slice();
      }
    } else if (this.sessionMode === "pick") {
      const picked = [...this.bankPicked];
      this.sessionQueue = picked.filter((id) => !this.cooldown.includes(id));
      if (!this.sessionQueue.length && picked.length) {
        this.cooldown = [];
        this.sessionQueue = picked.slice();
      }
    } else {
      this.sessionQueue = planQueue(this.plan, this.sessionMode);
    }
    let id = null;
    for (const x of this.sessionQueue) {
      if (!this.cooldown.includes(x)) {
        id = x;
        break;
      }
    }
    if (!id && this.sessionQueue.length) id = this.sessionQueue[0];
    if (!id) {
      // 当前任务已完成，不强制随机
      this.current = null;
      this.revealed = false;
      this.writeDraft = "";
      this.aiResult = null;
      this.aiLoading = false;
      return;
    }
    this.current = this.plugin.db.getCardJoin(id);
    this.revealed = false;
    this.writeDraft = "";
    this.aiResult = null;
    this.aiLoading = false;
  }

  nextRandom() {
    const rand = this.plugin.db.listRandom(
      this.moduleSet(),
      this.cooldown,
      1
    );
    const id = rand[0];
    this.current = id ? this.plugin.db.getCardJoin(id) : null;
    this.revealed = false;
    this.writeDraft = "";
    this.aiResult = null;
    this.aiLoading = false;
  }

  async renderDrill() {
    const el = this.bodyEl;
    el.empty();

    const toolbar = el.createDiv({ cls: "bagu-toolbar" });
    const taskGroup = toolbar.createDiv({ cls: "bagu-mode-group" });
    const bSpec = taskGroup.createEl("button", {
      cls:
        "bagu-mode-btn" + (this.sessionMode === "specialty" ? " is-on" : ""),
      text: "专题任务",
    });
    const bQuiz = taskGroup.createEl("button", {
      cls: "bagu-mode-btn" + (this.sessionMode === "quiz" ? " is-on" : ""),
      text: "拷问抽测",
    });
    const bFav = taskGroup.createEl("button", {
      cls: "bagu-mode-btn" + (this.sessionMode === "fav" ? " is-on" : ""),
      text: "收藏复习",
    });
    const bPick = taskGroup.createEl("button", {
      cls: "bagu-mode-btn" + (this.sessionMode === "pick" ? " is-on" : ""),
      text: `自选题${this.bankPicked.size ? `(${this.bankPicked.size})` : ""}`,
    });
    bSpec.onclick = () => {
      this.sessionMode = "specialty";
      this.nextFromPlan();
      this.render();
    };
    bQuiz.onclick = () => {
      this.sessionMode = "quiz";
      this.nextFromPlan();
      this.render();
    };
    bFav.onclick = () => {
      this.sessionMode = "fav";
      this.nextFromPlan();
      this.render();
    };
    bPick.onclick = () => {
      if (!this.bankPicked.size) {
        new Notice("请先到「题库」勾选题目");
        this.tab = "bank";
        this.render();
        return;
      }
      this.sessionMode = "pick";
      this.nextFromPlan();
      this.render();
    };

    const modeGroup = toolbar.createDiv({ cls: "bagu-mode-group" });
    const bCard = modeGroup.createEl("button", {
      cls: "bagu-mode-btn" + (this.mode === "card" ? " is-on" : ""),
      text: "闪卡口述",
    });
    const bWrite = modeGroup.createEl("button", {
      cls: "bagu-mode-btn" + (this.mode === "write" ? " is-on" : ""),
      text: "遮挡默写",
    });
    bCard.onclick = () => {
      this.mode = "card";
      this.revealed = false;
      this.aiResult = null;
      this.render();
    };
    bWrite.onclick = () => {
      this.mode = "write";
      this.revealed = false;
      this.aiResult = null;
      this.render();
    };

    toolbar.createEl("button", {
      cls: "mod-cta",
      text: "同步笔记",
    }).onclick = () => this.syncFromNotes();
    toolbar.createEl("button", { text: "计划下一题" }).onclick = () => {
      this.nextFromPlan();
      this.render();
    };
    toolbar.createEl("button", { text: "随机一题" }).onclick = () => {
      this.nextRandom();
      this.render();
    };

    const card = el.createDiv({ cls: "bagu-card" });
    const actions = el.createDiv({ cls: "bagu-actions" });

    if (!this.current) {
      const tasks = planTaskStatus(this.plan, this.plugin.settings);
      let msg;
      if (this.sessionMode === "fav") {
        msg =
          this.plugin.db.countFavorites() === 0
            ? "还没有收藏。刷题时点「☆ 收藏」即可加入。"
            : "收藏队列已刷完（或都在冷却中），可回收藏页查看，或点随机/取消冷却。";
      } else if (this.sessionMode === "pick") {
        msg = this.bankPicked.size
          ? "自选队列已刷完。可回题库继续勾选，或清空后重选。"
          : "还没有自选题，请到「题库」勾选后再开始。";
      } else if (this.sessionMode === "quiz") {
        msg = tasks.quizComplete
          ? `拷问已完成 · 准确率 ${
              tasks.accuracy != null ? tasks.accuracy + "%" : "-"
            } · 均分 ${tasks.avgScore != null ? tasks.avgScore : "-"}`
          : "拷问队列为空，请回今日计划重滚或扩大拷问范围。";
      } else {
        msg = tasks.specialtyDone
          ? `专题「${tasks.focusModule}」已清完`
          : "专题队列为空，请同步笔记或重滚计划。";
      }
      card.createDiv({ cls: "bagu-empty", text: msg });
      return;
    }

    const q = this.current;
    const favOn = !!(q.favorite);
    const taskLabel =
      this.sessionMode === "quiz"
        ? "拷问抽测"
        : this.sessionMode === "fav"
          ? "收藏复习"
          : this.sessionMode === "pick"
            ? "自选题"
            : `专题·${q.module}`;
    const metaRow = card.createDiv({ cls: "bagu-meta-row" });
    metaRow.createDiv({
      cls: "bagu-meta",
      text: `${taskLabel} · ${q.path} · Q${q.num} · ${q.state || "new"} · 间隔 ${
        q.interval_days || 0
      } 天`,
    });
    const favBtn = metaRow.createEl("button", {
      cls: "bagu-fav-btn" + (favOn ? " is-on" : ""),
      text: favOn ? "★ 已收藏" : "☆ 收藏",
      attr: { title: favOn ? "取消收藏" : "收藏本题，便于回头专练" },
    });
    favBtn.onclick = (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      const on = this.plugin.db.toggleFavorite(q.id);
      this.current = this.plugin.db.getCardJoin(q.id);
      new Notice(on ? "已收藏" : "已取消收藏");
      this.render();
    };
    card.createDiv({ cls: "bagu-question", text: q.question });

    // 始终可作答（Ollama 按作答打分）
    if (!this.revealed) {
      this.mountAnswerEditor(card);
    }

    if (!this.revealed) {
      const aiBtn = actions.createEl("button", {
        cls: "mod-cta",
        text: this.aiLoading ? "评分中…" : "Ollama 评分",
      });
      aiBtn.disabled = !!this.aiLoading;
      aiBtn.onclick = () => this.runAiScore();

      const revealBtn = actions.createEl("button", {
        text: "揭晓参考答案",
      });
      revealBtn.onclick = () => this.reveal();
    } else {
      await this.renderAnswerBlock(card, q);
      if (this.aiResult) this.renderAiPanel(card, this.aiResult);

      if (this.aiLoading) {
        actions.createDiv({
          cls: "bagu-hidden-hint",
          text: "正在调用本地 Ollama 评分，请稍候…",
        });
      } else if (this.aiResult) {
        const commit = actions.createEl("button", {
          cls: "mod-cta",
          text: `确认 ${this.aiResult.score} 分并下一题`,
        });
        commit.onclick = () => this.commitAiScore();
        const retry = actions.createEl("button", { text: "重新评分" });
        retry.onclick = () => this.runAiScore();
      } else {
        const aiBtn = actions.createEl("button", {
          cls: "mod-cta",
          text: "Ollama 评分",
        });
        aiBtn.onclick = () => this.runAiScore();
      }

      if (this.plugin.settings.allowManualGrade && !this.aiLoading) {
        const grades = actions.createDiv({ cls: "bagu-grade-group" });
        const mk = (label, g, cta) => {
          const b = grades.createEl("button", {
            cls: cta ? "mod-cta" : "",
            text: label,
          });
          b.onclick = () => this.grade(g);
        };
        mk("手动·不会", "again");
        mk("手动·模糊", "hard");
        mk("手动·会了", "good");
        mk("手动·简单", "easy");
      }
    }

    actions.createEl("button", { text: "跳过" }).onclick = () => {
      if (this.current) this.pushCooldown(this.current.id);
      this.nextFromPlan();
      this.render();
    };
    actions.createEl("button", { text: "打开原文" }).onclick = () =>
      this.openSource();
  }

  renderAiPanel(card, result) {
    const box = card.createDiv({ cls: "bagu-ai-panel" });
    const scoreEl = box.createDiv({ cls: "bagu-ai-score" });
    scoreEl.setText(`${result.score} 分`);
    const band =
      result.score >= (this.plugin.settings.scoreThresholdGood ?? 90)
        ? "优秀"
        : result.score >= (this.plugin.settings.scoreThresholdHard ?? 70)
          ? "良好"
          : result.score >= (this.plugin.settings.scoreThresholdAgain ?? 50)
            ? "勉强"
            : "需加强";
    box.createDiv({
      cls: "bagu-ai-band",
      text: `档位：${band} → 复习按「${result.grade}」调度`,
    });
    if (result.feedback) {
      box.createDiv({ cls: "bagu-ai-feedback", text: result.feedback });
    }
    if (result.hits && result.hits.length) {
      box.createDiv({
        cls: "bagu-tip",
        text: "命中：" + result.hits.join("；"),
      });
    }
    if (result.missing && result.missing.length) {
      box.createDiv({
        cls: "bagu-tip",
        text: "缺漏：" + result.missing.join("；"),
      });
    }
  }

  mountAnswerEditor(parent) {
    const wrap = parent.createDiv({ cls: "bagu-answer-editor" });
    const ta = wrap.createEl("textarea", { cls: "bagu-write-area" });
    ta.placeholder =
      "写出口述要点 / 完整答案…（Ctrl/Cmd+Enter 评分；可点麦克风语音输入）";
    ta.value = this.writeDraft || "";
    ta.addEventListener("input", () => (this.writeDraft = ta.value));

    const row = wrap.createDiv({ cls: "bagu-asr-row" });
    const tip = row.createDiv({ cls: "bagu-tip bagu-asr-tip" });
    const provider = this.plugin.settings.asrProvider || "siliconflow";
    if (provider === "off" || provider === "none") {
      tip.setText("语音输入未启用（设置里推荐「硅基流动」）");
    } else if (!asrSupported()) {
      tip.setText("当前环境不支持麦克风");
    } else {
      const labels = {
        siliconflow: "语音：硅基流动 SenseVoice · 再点结束并转写",
        groq: "语音：Groq Whisper · 再点结束并转写",
        "openai-compatible": "语音：自定义/本地 Whisper · 再点结束并转写",
      };
      tip.setText(labels[provider] || "语音输入 · 再点结束并转写");
    }

    const recording = this._recorder && this._recorder.isRecording();
    const mic = row.createEl("button", {
      cls:
        "bagu-mic-btn" +
        (recording ? " is-recording" : "") +
        (this._asrBusy ? " is-busy" : ""),
      text: this._asrBusy
        ? "转写中…"
        : recording
          ? "⏹ 结束录音"
          : "🎤 语音输入",
      attr: {
        title: "免费 ASR：推荐硅基流动（国内）；Groq 国内常 Forbidden",
      },
    });
    mic.disabled = this._asrBusy || provider === "off" || provider === "none";
    mic.onclick = () => this.toggleAsr(ta);

    return ta;
  }

  async toggleAsr(textarea) {
    if (this._asrBusy) return;
    const s = this.plugin.settings;
    if ((s.asrProvider || "siliconflow") === "off") {
      new Notice("请先在设置启用语音识别（推荐硅基流动）");
      return;
    }
    if (!asrSupported()) {
      new Notice("无法访问麦克风，请在系统设置里允许 Obsidian 使用麦克风");
      return;
    }

    if (this._recorder && this._recorder.isRecording()) {
      this._asrBusy = true;
      this.render();
      try {
        const blob = await this._recorder.stop();
        this._recorder = null;
        if (!blob) {
          new Notice("没有录到音频");
          return;
        }
        new Notice("正在转写…");
        const text = await transcribeBlob(blob, s);
        const mode = s.asrInsertMode || "append";
        if (mode === "replace" || !(this.writeDraft || "").trim()) {
          this.writeDraft = text;
        } else {
          const cur = (this.writeDraft || "").trimEnd();
          this.writeDraft = cur ? `${cur}\n${text}` : text;
        }
        if (textarea && textarea.isConnected) {
          textarea.value = this.writeDraft;
        }
        new Notice("语音已写入答案框");
      } catch (e) {
        console.error(e);
        new Notice(String((e && e.message) || e));
      } finally {
        this._asrBusy = false;
        this.render();
      }
      return;
    }

    try {
      this._recorder = createRecorder();
      await this._recorder.start();
      new Notice("开始录音，再说一遍答案，然后点「结束录音」");
      this.render();
    } catch (e) {
      this._recorder = null;
      console.error(e);
      new Notice(
        "无法打开麦克风：" +
          String((e && e.message) || e) +
          "（macOS：系统设置 → 隐私与安全性 → 麦克风）"
      );
    }
  }

  async renderAnswerBlock(card, q) {
    const stack = card.createDiv({ cls: "bagu-compare-stack" });

    const myBox = stack.createDiv({ cls: "bagu-stack-block" });
    myBox.createDiv({ cls: "bagu-pane-title", text: "我的答案" });
    if (!this.aiResult) {
      this.mountAnswerEditor(myBox);
    } else {
      myBox.createDiv({
        cls: "bagu-mine bagu-selectable",
        text: (this.writeDraft || "").trim() || "（未填写）",
      });
    }

    const refBox = stack.createDiv({ cls: "bagu-stack-block" });
    const refTitle = refBox.createDiv({ cls: "bagu-pane-title-row" });
    refTitle.createDiv({ cls: "bagu-pane-title", text: "参考答案" });
    const copyBtn = refTitle.createEl("button", {
      cls: "bagu-copy-btn",
      text: "复制全文",
      attr: { title: "复制参考答案纯文本到剪贴板" },
    });
    copyBtn.onclick = async (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      const text = q.answer || "";
      try {
        await navigator.clipboard.writeText(text);
        new Notice("参考答案已复制");
      } catch (_) {
        // fallback
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
        new Notice("参考答案已复制");
      }
    };
    const ans = refBox.createDiv({ cls: "bagu-answer bagu-selectable" });
    await this.renderMd(ans, q.answer || "_（无正文）_", q.path);
  }

  openQuestion(id) {
    const card = this.plugin.db.getCardJoin(id);
    if (!card) {
      new Notice("题目不存在，请先同步笔记");
      return;
    }
    this.bankPicked.add(id);
    this.sessionMode = "pick";
    this.tab = "drill";
    this.current = card;
    this.revealed = false;
    this.writeDraft = "";
    this.aiResult = null;
    this.aiLoading = false;
    this.render();
  }

  startPickedDrill() {
    if (!this.bankPicked.size) {
      new Notice("请先勾选至少一道题");
      return;
    }
    this.sessionMode = "pick";
    this.tab = "drill";
    this.cooldown = [];
    this.nextFromPlan();
    this.render();
  }

  renderBank() {
    const el = this.bodyEl;
    el.empty();

    const filter = {
      module: this.bankModule || "",
      keyword: this.bankKeyword || "",
      state: this.bankState || "",
      favoriteOnly: !!this.bankFavOnly,
    };
    const total = this.plugin.db.countQuestions(filter);
    const list = this.plugin.db.listQuestions({ ...filter, limit: 800 });

    el.createEl("h3", { text: `题库 · ${total} 题` });
    el.createDiv({
      cls: "bagu-tip",
      text: "点题目直接刷；勾选后可「刷选中」。支持按模块 / 关键词 / 状态筛选。",
    });

    const bar = el.createDiv({ cls: "bagu-toolbar bagu-bank-bar" });
    const search = bar.createEl("input", {
      cls: "bagu-bank-search",
      type: "search",
      attr: {
        placeholder: "搜索题干 / 路径…",
        value: this.bankKeyword || "",
      },
    });
    search.value = this.bankKeyword || "";
    search.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        this.bankKeyword = search.value.trim();
        this.render();
      }
    });
    bar.createEl("button", { text: "搜索" }).onclick = () => {
      this.bankKeyword = search.value.trim();
      this.render();
    };
    bar.createEl("button", { text: "清空筛选" }).onclick = () => {
      this.bankModule = "";
      this.bankKeyword = "";
      this.bankState = "";
      this.bankFavOnly = false;
      this.render();
    };

    const stateSel = bar.createEl("select", { cls: "bagu-bank-select" });
    for (const [v, label] of [
      ["", "全部状态"],
      ["new", "新题"],
      ["learning", "学习中"],
      ["review", "复习中"],
      ["relearning", "重学"],
    ]) {
      const opt = stateSel.createEl("option", { text: label, attr: { value: v } });
      if (v === (this.bankState || "")) opt.selected = true;
    }
    stateSel.onchange = () => {
      this.bankState = stateSel.value;
      this.render();
    };

    const favChk = bar.createEl("label", { cls: "bagu-bank-check" });
    const favInput = favChk.createEl("input", { type: "checkbox" });
    favInput.checked = !!this.bankFavOnly;
    favChk.createSpan({ text: "仅收藏" });
    favInput.onchange = () => {
      this.bankFavOnly = favInput.checked;
      this.render();
    };

    const act = el.createDiv({ cls: "bagu-toolbar" });
    const pickN = this.bankPicked.size;
    act.createEl("button", {
      cls: "mod-cta bagu-bank-pick-btn",
      text: pickN ? `刷选中（${pickN}）` : "刷选中",
    }).onclick = () => this.startPickedDrill();
    act.createEl("button", { text: "全选当前列表" }).onclick = () => {
      list.forEach((r) => this.bankPicked.add(r.id));
      new Notice(`已选中 ${this.bankPicked.size} 题`);
      this.render();
    };
    act.createEl("button", { text: "清空选中" }).onclick = () => {
      this.bankPicked.clear();
      this.render();
    };
    act.createEl("button", { text: "同步笔记" }).onclick = () =>
      this.syncFromNotes();

    el.createEl("h4", { text: "模块筛选" });
    const chips = el.createDiv({ cls: "bagu-modules" });
    const allChip = chips.createEl("button", {
      cls: "bagu-chip" + (!this.bankModule ? " is-on" : ""),
      text: "全部",
    });
    allChip.onclick = () => {
      this.bankModule = "";
      this.render();
    };
    for (const m of this.modules) {
      const row = this.plugin.db.getModules().find((x) => x.module === m);
      const cnt = row ? row.cnt : 0;
      const chip = chips.createEl("button", {
        cls: "bagu-chip" + (this.bankModule === m ? " is-on" : ""),
        text: `${m} (${cnt})`,
      });
      chip.onclick = () => {
        this.bankModule = this.bankModule === m ? "" : m;
        this.render();
      };
    }

    if (!list.length) {
      el.createDiv({
        cls: "bagu-empty",
        text: total === 0 && !this.bankKeyword && !this.bankModule
          ? "题库为空，请先点「同步笔记」。"
          : "当前筛选无结果，试试换模块或清空筛选。",
      });
      return;
    }

    const table = el.createEl("table", { cls: "bagu-table bagu-table-click" });
    const head = table.createEl("tr");
    for (const h of ["选", "模块", "题号", "题目", "状态", "间隔", "收藏"]) {
      head.createEl("th", { text: h });
    }
    for (const row of list) {
      const tr = table.createEl("tr");
      tr.addClass("bagu-row-click");
      if (this.bankPicked.has(row.id)) tr.addClass("is-picked");

      const tdCheck = tr.createEl("td");
      const cb = tdCheck.createEl("input", { type: "checkbox" });
      cb.checked = this.bankPicked.has(row.id);
      cb.onclick = (ev) => {
        ev.stopPropagation();
        if (cb.checked) this.bankPicked.add(row.id);
        else this.bankPicked.delete(row.id);
        tr.toggleClass("is-picked", cb.checked);
        const btn = el.querySelector(".bagu-bank-pick-btn");
        if (btn) {
          const n = this.bankPicked.size;
          btn.setText(n ? `刷选中（${n}）` : "刷选中");
        }
      };

      tr.createEl("td", { text: row.module || "-" });
      tr.createEl("td", { text: row.num != null ? `Q${row.num}` : "-" });
      tr.createEl("td", {
        text: (row.question || "").slice(0, 56),
        attr: { title: row.question || "" },
      });
      tr.createEl("td", { text: row.state || "-" });
      tr.createEl("td", {
        text: row.interval_days != null ? String(row.interval_days) : "-",
      });
      const tdFav = tr.createEl("td");
      const favBtn = tdFav.createEl("button", {
        cls: "bagu-fav-btn" + (row.favorite ? " is-on" : ""),
        text: row.favorite ? "★" : "☆",
      });
      favBtn.onclick = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        this.plugin.db.toggleFavorite(row.id);
        this.render();
      };

      tr.onclick = () => this.openQuestion(row.id);
    }

    el.createDiv({
      cls: "bagu-tip",
      text: list.length < total
        ? `当前展示 ${list.length} / ${total}（上限 800，请用筛选缩小范围）`
        : `共 ${total} 题`,
    });
  }

  renderFavorites() {
    const el = this.bodyEl;
    el.empty();
    const n = this.plugin.db.countFavorites();
    el.createEl("h3", { text: `收藏夹 · ${n} 题` });
    el.createDiv({
      cls: "bagu-tip",
      text: "刷题页点「☆ 收藏」。点击题目进入刷题；可一键开始收藏复习。",
    });
    const bar = el.createDiv({ cls: "bagu-toolbar" });
    bar.createEl("button", { cls: "mod-cta", text: "开始收藏复习" }).onclick =
      () => {
        this.sessionMode = "fav";
        this.tab = "drill";
        this.cooldown = [];
        this.nextFromPlan();
        this.render();
      };
    const list = this.plugin.db.listFavorites(300);
    if (!list.length) {
      el.createDiv({
        cls: "bagu-empty",
        text: "暂无收藏。在「开始刷题」揭晓前/后均可点收藏。",
      });
      return;
    }
    const table = el.createEl("table", { cls: "bagu-table bagu-table-click" });
    const head = table.createEl("tr");
    for (const h of ["模块", "题目", "状态", "收藏时间", ""]) {
      head.createEl("th", { text: h });
    }
    for (const row of list) {
      const tr = table.createEl("tr");
      tr.addClass("bagu-row-click");
      tr.createEl("td", { text: row.module || "-" });
      tr.createEl("td", { text: (row.question || "").slice(0, 48) });
      tr.createEl("td", { text: row.state || "-" });
      tr.createEl("td", {
        text: row.favorited_at
          ? new Date(row.favorited_at).toLocaleString()
          : "-",
      });
      const tdAct = tr.createEl("td");
      const un = tdAct.createEl("button", {
        cls: "bagu-copy-btn",
        text: "取消",
      });
      un.onclick = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        this.plugin.db.setFavorite(row.id, false);
        new Notice("已取消收藏");
        this.render();
      };
      tr.onclick = () => {
        this.sessionMode = "fav";
        this.tab = "drill";
        this.current = this.plugin.db.getCardJoin(row.id);
        this.revealed = false;
        this.writeDraft = "";
        this.aiResult = null;
        this.render();
      };
    }
  }

  async renderMd(container, src, path) {
    try {
      if (typeof MarkdownRenderer.render === "function") {
        await MarkdownRenderer.render(
          this.app,
          src,
          container,
          path,
          this.plugin
        );
      } else {
        await MarkdownRenderer.renderMarkdown(src, container, path, this.plugin);
      }
    } catch (e) {
      container.createEl("pre", { text: src });
    }
  }

  reveal() {
    this.revealed = true;
    this.render();
  }

  pushCooldown(id) {
    this.cooldown.push(id);
    const max = this.plugin.settings.cooldownSize || 12;
    while (this.cooldown.length > max) this.cooldown.shift();
  }

  async runAiScore() {
    if (!this.current || this.aiLoading) return;
    const answer = (this.writeDraft || "").trim();
    if (!answer) {
      new Notice("请先写下你的答案，再调用 Ollama 评分");
      return;
    }
    this.aiLoading = true;
    this.aiResult = null;
    if (!this.revealed) this.revealed = true;
    this.render();
    try {
      const s = this.plugin.settings;
      const result = await scoreWithOllama({
        baseUrl: s.ollamaBaseUrl,
        model: s.ollamaModel || "minimax-m3:cloud",
        question: this.current.question,
        reference: this.current.answer,
        userAnswer: answer,
        timeoutMs: s.ollamaTimeoutMs || 120000,
      });
      const grade = scheduleFromScore(
        this.plugin.db.getCard(this.current.id) || this.current,
        result.score,
        s
      ).grade;
      this.aiResult = { ...result, grade };
      new Notice(`Ollama 评分：${result.score} 分`);
    } catch (e) {
      console.error(e);
      new Notice(
        `Ollama 评分失败：${e.message || e}（请确认 ollama serve 且已拉取模型）`
      );
    } finally {
      this.aiLoading = false;
      this.render();
    }
  }

  async commitAiScore() {
    if (!this.current || !this.aiResult) return;
    const id = this.current.id;
    const card = this.plugin.db.getCard(id) || this.current;
    const packed = scheduleFromScore(
      card,
      this.aiResult.score,
      this.plugin.settings
    );
    await this.plugin.db.updateCard(id, packed);
    await this.plugin.db.addLog({
      card_id: id,
      grade: packed.grade,
      reviewed_at: Date.now(),
      scheduled_days: packed.interval_days,
      mode: this.sessionMode === "quiz" ? "quiz:ollama" : "specialty:ollama",
      plan_date: todayKey(),
      score: this.aiResult.score,
      feedback: this.aiResult.feedback,
      user_answer: this.writeDraft || "",
    });
    if (this.sessionMode === "quiz") {
      await this.plugin.db.markQuizDone(
        todayKey(),
        id,
        this.aiResult.score
      );
    } else {
      await this.plugin.db.markSpecialtyDone(todayKey(), id);
    }
    this.plan = this.plugin.db.getPlan(todayKey());
    this.pushCooldown(id);
    this.nextFromPlan();
    this.render();
  }

  async grade(level) {
    if (!this.current || !this.revealed) return;
    const id = this.current.id;
    const card = this.plugin.db.getCard(id) || this.current;
    const next = scheduleCard(card, level, this.plugin.settings);
    await this.plugin.db.updateCard(id, next);
    await this.plugin.db.addLog({
      card_id: id,
      grade: level,
      reviewed_at: Date.now(),
      scheduled_days: next.interval_days,
      mode:
        (this.sessionMode === "quiz" ? "quiz" : "specialty") + ":manual",
      plan_date: todayKey(),
      score: null,
      feedback: null,
      user_answer: this.writeDraft || "",
    });
    if (this.sessionMode === "quiz") {
      // 手动评分无分数：按档位映射近似分，便于准确率统计
      const approx =
        level === "easy"
          ? 95
          : level === "good"
            ? 80
            : level === "hard"
              ? 60
              : 30;
      await this.plugin.db.markQuizDone(todayKey(), id, approx);
    } else {
      await this.plugin.db.markSpecialtyDone(todayKey(), id);
    }
    this.plan = this.plugin.db.getPlan(todayKey());
    this.pushCooldown(id);
    this.nextFromPlan();
    this.render();
  }

  async openSource() {
    if (!this.current) return;
    const path = this.current.path;
    try {
      await this.app.workspace.openLinkText(
        `${path}#Q${this.current.num}`,
        path,
        false
      );
    } catch (e) {
      await this.app.workspace.openLinkText(path, "", false);
    }
  }

  renderStats() {
    const el = this.bodyEl;
    el.empty();
    const ov = this.plugin.db.statsOverview();
    const grid = el.createDiv({ cls: "bagu-stat-grid" });
    const cell = (k, v) => {
      const c = grid.createDiv({ cls: "bagu-stat-cell" });
      c.createDiv({ cls: "bagu-stat-v", text: String(v) });
      c.createDiv({ cls: "bagu-stat-k", text: k });
    };
    cell("题库", ov.total);
    cell("新题", ov.newCount);
    cell("到期", ov.dueCount);
    cell("今日复习", ov.todayReviews);
    cell("连续天数", ov.streak);

    const charts = el.createDiv({ cls: "bagu-charts" });
    const heat = charts.createDiv({ cls: "bagu-chart-block" });
    renderHeatmapSvg(heat, this.plugin.db.dailyReviewCounts(130), 16);
    const curve = charts.createDiv({ cls: "bagu-chart-block" });
    renderEbbinghausSvg(
      curve,
      this.plugin.settings.ebbinghausSteps || EBBINGHAUS_DEFAULT
    );

    el.createEl("h3", { text: "分模块掌握" });
    const table = el.createEl("table", { cls: "bagu-table" });
    const head = table.createEl("tr");
    for (const h of ["模块", "总量", "新题", "到期", "均次数"]) {
      head.createEl("th", { text: h });
    }
    for (const m of ov.modules) {
      const tr = table.createEl("tr");
      tr.createEl("td", { text: m.module });
      tr.createEl("td", { text: String(m.total) });
      tr.createEl("td", { text: String(m.new_cnt) });
      tr.createEl("td", { text: String(m.due_cnt) });
      tr.createEl("td", {
        text: m.avg_reps != null ? Number(m.avg_reps).toFixed(1) : "-",
      });
    }
  }

  renderHistory() {
    const el = this.bodyEl;
    el.empty();
    el.createEl("h3", { text: "最近复习记录" });
    el.createDiv({
      cls: "bagu-tip",
      text: "点击某一行查看作答、评语与参考答案详情。",
    });
    const logs = this.plugin.db.recentLogs(80);
    if (!logs.length) {
      el.createDiv({ cls: "bagu-empty", text: "暂无记录，去刷几道题吧。" });
      return;
    }
    const table = el.createEl("table", { cls: "bagu-table bagu-table-click" });
    const head = table.createEl("tr");
    for (const h of ["时间", "模块", "题目", "分数", "档位", "间隔"]) {
      head.createEl("th", { text: h });
    }
    for (const l of logs) {
      const tr = table.createEl("tr");
      tr.addClass("bagu-row-click");
      tr.onclick = () => {
        const full = this.plugin.db.getLog(l.id) || l;
        new LogDetailModal(this.app, full).open();
      };
      const t = new Date(l.reviewed_at).toLocaleString();
      tr.createEl("td", { text: t });
      tr.createEl("td", { text: l.module || "-" });
      tr.createEl("td", {
        text: (l.question || l.card_id || "").slice(0, 36),
      });
      tr.createEl("td", {
        text: l.score != null ? String(l.score) : "-",
      });
      tr.createEl("td", { text: l.grade || "" });
      tr.createEl("td", {
        text: l.scheduled_days != null ? String(l.scheduled_days) : "",
      });
    }
  }
}

export class BaguSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "秋招八股复习 · 设置" });

    containerEl.createEl("h3", { text: "Ollama 评分" });

    new Setting(containerEl)
      .setName("Ollama Base URL")
      .setDesc("本地默认 http://127.0.0.1:11434")
      .addText((t) =>
        t
          .setValue(this.plugin.settings.ollamaBaseUrl || "http://127.0.0.1:11434")
          .onChange(async (v) => {
            this.plugin.settings.ollamaBaseUrl = v.trim();
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("模型名")
      .setDesc("例如 minimax-m3:cloud")
      .addText((t) =>
        t
          .setValue(this.plugin.settings.ollamaModel || "minimax-m3:cloud")
          .onChange(async (v) => {
            this.plugin.settings.ollamaModel = v.trim();
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("评分超时（毫秒）")
      .addText((t) =>
        t
          .setValue(String(this.plugin.settings.ollamaTimeoutMs || 120000))
          .onChange(async (v) => {
            const n = parseInt(v, 10);
            if (!Number.isNaN(n) && n > 0) {
              this.plugin.settings.ollamaTimeoutMs = n;
              await this.plugin.saveSettings();
            }
          })
      );

    containerEl.createEl("h3", { text: "语音输入（免费 ASR）" });
    containerEl.createDiv({
      cls: "setting-item-description",
      text: "本地推荐：在终端运行插件目录 asr-server/start.sh（faster-whisper）。Groq 国内常 Forbidden；硅基流动也可。",
    });

    new Setting(containerEl)
      .setName("ASR 提供方")
      .setDesc("本地选「自定义/本地 Whisper」；需先 ./start.sh 起服务")
      .addDropdown((d) =>
        d
          .addOption("openai-compatible", "自定义 / 本地 Whisper（推荐本机）")
          .addOption("siliconflow", "硅基流动 SenseVoice（云端免费额度）")
          .addOption("groq", "Groq Whisper（海外）")
          .addOption("off", "关闭")
          .setValue(this.plugin.settings.asrProvider || "openai-compatible")
          .onChange(async (v) => {
            this.plugin.settings.asrProvider = v;
            const preset = ASR_PRESETS[v];
            if (preset) {
              this.plugin.settings.asrBaseUrl = preset.baseUrl;
              this.plugin.settings.asrModel = preset.model;
            }
            await this.plugin.saveSettings();
            this.display();
          })
      );

    new Setting(containerEl)
      .setName("ASR API Key")
      .setDesc("本地留空。硅基/Groq 才需要 Key。")
      .addText((t) => {
        t.inputEl.type = "password";
        t.inputEl.autocomplete = "off";
        t
          .setPlaceholder("本地可空")
          .setValue(this.plugin.settings.asrApiKey || "")
          .onChange(async (v) => {
            this.plugin.settings.asrApiKey = v.trim();
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName("ASR Base URL")
      .setDesc("本地默认 http://127.0.0.1:9000")
      .addText((t) =>
        t
          .setValue(
            this.plugin.settings.asrBaseUrl || "http://127.0.0.1:9000"
          )
          .onChange(async (v) => {
            this.plugin.settings.asrBaseUrl = v.trim();
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("ASR 模型")
      .setDesc("本地：tiny/base/small/medium（与 start.sh 的 WHISPER_MODEL 一致更清晰）")
      .addText((t) =>
        t
          .setValue(this.plugin.settings.asrModel || "small")
          .onChange(async (v) => {
            this.plugin.settings.asrModel = v.trim();
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("识别语言")
      .setDesc("zh / en / auto")
      .addText((t) =>
        t
          .setValue(this.plugin.settings.asrLang || "zh")
          .onChange(async (v) => {
            this.plugin.settings.asrLang = v.trim() || "zh";
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("写入方式")
      .addDropdown((d) =>
        d
          .addOption("append", "追加到已有内容")
          .addOption("replace", "覆盖草稿")
          .setValue(this.plugin.settings.asrInsertMode || "append")
          .onChange(async (v) => {
            this.plugin.settings.asrInsertMode = v;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("分数档位：不及格 <")
      .setDesc("低于此分 → 不会（当天再练）")
      .addSlider((s) =>
        s
          .setLimits(0, 100, 1)
          .setValue(this.plugin.settings.scoreThresholdAgain ?? 50)
          .setDynamicTooltip()
          .onChange(async (v) => {
            this.plugin.settings.scoreThresholdAgain = v;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("分数档位：模糊 <")
      .setDesc("低于此分且 ≥ 不及格线 → 模糊")
      .addSlider((s) =>
        s
          .setLimits(0, 100, 1)
          .setValue(this.plugin.settings.scoreThresholdHard ?? 70)
          .setDynamicTooltip()
          .onChange(async (v) => {
            this.plugin.settings.scoreThresholdHard = v;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("分数档位：会了 <")
      .setDesc("低于此分且 ≥ 模糊线 → 会了；否则简单")
      .addSlider((s) =>
        s
          .setLimits(0, 100, 1)
          .setValue(this.plugin.settings.scoreThresholdGood ?? 90)
          .setDynamicTooltip()
          .onChange(async (v) => {
            this.plugin.settings.scoreThresholdGood = v;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("允许手动档位评分")
      .setDesc("Ollama 不可用时的兜底")
      .addToggle((t) =>
        t
          .setValue(this.plugin.settings.allowManualGrade !== false)
          .onChange(async (v) => {
            this.plugin.settings.allowManualGrade = v;
            await this.plugin.saveSettings();
          })
      );

    containerEl.createEl("h3", { text: "题库与计划" });

    new Setting(containerEl)
      .setName("题库根目录")
      .setDesc("只扫描该文件夹下的 Markdown（相对库根，例如「八股」）。空=扫描整个库。")
      .addText((t) =>
        t
          .setPlaceholder("八股")
          .setValue(this.plugin.settings.questionsRoot || "")
          .onChange(async (v) => {
            this.plugin.settings.questionsRoot = v.trim().replace(/^\/+|\/+$/g, "");
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("排除文件名包含")
      .addText((t) =>
        t
          .setValue((this.plugin.settings.excludePatterns || []).join(", "))
          .onChange(async (v) => {
            this.plugin.settings.excludePatterns = v
              .split(/[,，]/)
              .map((s) => s.trim())
              .filter(Boolean);
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("调度算法")
      .setDesc("SM-2 自适应；艾宾浩斯为固定 1/2/4/7/15/30/60 天阶梯。")
      .addDropdown((d) =>
        d
          .addOption("sm2", "SM-2")
          .addOption("ebbinghaus", "艾宾浩斯阶梯")
          .setValue(this.plugin.settings.scheduler || "sm2")
          .onChange(async (v) => {
            this.plugin.settings.scheduler = v;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("拷问抽题数量")
      .setDesc("任务二：在限定范围内随机抽取的题目数（默认 15）")
      .addSlider((s) =>
        s
          .setLimits(5, 40, 1)
          .setValue(this.plugin.settings.quizCount ?? 15)
          .setDynamicTooltip()
          .onChange(async (v) => {
            this.plugin.settings.quizCount = v;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("拷问及格分（准确率）")
      .setDesc("达到该分及以上计为答对")
      .addSlider((s) =>
        s
          .setLimits(50, 95, 5)
          .setValue(this.plugin.settings.quizPassScore ?? 70)
          .setDynamicTooltip()
          .onChange(async (v) => {
            this.plugin.settings.quizPassScore = v;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("打开库时提醒未完成每日计划")
      .addToggle((t) =>
        t
          .setValue(this.plugin.settings.remindOnOpen !== false)
          .onChange(async (v) => {
            this.plugin.settings.remindOnOpen = v;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("默写必须非空才能评分")
      .addToggle((t) =>
        t
          .setValue(!!this.plugin.settings.writeRequireText)
          .onChange(async (v) => {
            this.plugin.settings.writeRequireText = v;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("随机冷却题数")
      .addSlider((s) =>
        s
          .setLimits(3, 40, 1)
          .setValue(this.plugin.settings.cooldownSize || 12)
          .setDynamicTooltip()
          .onChange(async (v) => {
            this.plugin.settings.cooldownSize = v;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("艾宾浩斯阶梯（天，逗号分隔）")
      .addText((t) =>
        t
          .setValue(
            (this.plugin.settings.ebbinghausSteps || EBBINGHAUS_DEFAULT).join(
              ","
            )
          )
          .onChange(async (v) => {
            this.plugin.settings.ebbinghausSteps = v
              .split(/[,，]/)
              .map((x) => parseInt(x.trim(), 10))
              .filter((n) => !Number.isNaN(n) && n >= 0);
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("SQLite 路径")
      .setDesc("数据文件相对库根：.bagu/qiuzhao-bagu.db（可随库备份）")
      .addButton((b) =>
        b.setButtonText("立即落盘").onClick(async () => {
          await this.plugin.db.persist(true);
          new Notice("已保存 SQLite");
        })
      );
  }
}

export { VIEW_TYPE_BAGU };
