import { Plugin, Notice } from "obsidian";
import { VIEW_TYPE_BAGU, DEFAULT_SETTINGS } from "./constants.js";
import { BaguDb, ensureDailyPlan, planQueue, planTaskStatus } from "./db.js";
import { BaguView, BaguSettingTab } from "./view.js";
import { parseQuestionsFromMarkdown, todayKey } from "./util.js";

export default class CetideBaguPlugin extends Plugin {
  async onload() {
    const raw = (await this.loadData()) || {};
    this.settings = Object.assign({}, DEFAULT_SETTINGS, raw.settings || {});
    this.db = new BaguDb(this.app, this.manifest.dir);
    this._dbReady = null;

    this.registerView(VIEW_TYPE_BAGU, (leaf) => new BaguView(leaf, this));

    this.addRibbonIcon("calendar-check", "秋招八股复习", () =>
      this.activateView()
    );

    this.addCommand({
      id: "open-bagu",
      name: "打开秋招八股复习",
      callback: () => this.activateView(),
    });

    this.addCommand({
      id: "refresh-bagu-index",
      name: "同步八股题目到 SQLite",
      callback: async () => {
        await this.ensureDb();
        await this.syncIndex(true);
      },
    });

    this.addCommand({
      id: "regen-daily-plan",
      name: "重新生成今日八股计划",
      callback: async () => {
        await this.ensureDb();
        await this.syncIndex(false);
        this.db.db.run(`DELETE FROM daily_plans WHERE plan_date = ?`, [
          todayKey(),
        ]);
        const mods = new Set(
          (this.settings.preferredModules || []).length
            ? this.settings.preferredModules
            : this.db.getModules().map((m) => m.module)
        );
        const qmods = new Set(
          (this.settings.quizModules || []).length
            ? this.settings.quizModules
            : this.db.getModules().map((m) => m.module)
        );
        const plan = ensureDailyPlan(this.db, this.settings, mods, qmods);
        new Notice(
          `专题「${plan.focus_module}」${plan.specialty_ids.length} 题 · 拷问 ${plan.quiz_ids.length} 题`
        );
      },
    });

    this.addSettingTab(new BaguSettingTab(this.app, this));

    this.app.workspace.onLayoutReady(async () => {
      try {
        await this.ensureDb();
        await this.syncIndex(false);
        if (this.settings.remindOnOpen === false) return;
        const mods = new Set(
          (this.settings.preferredModules || []).length
            ? this.settings.preferredModules
            : this.db.getModules().map((m) => m.module)
        );
        const qmods = new Set(
          (this.settings.quizModules || []).length
            ? this.settings.quizModules
            : this.db.getModules().map((m) => m.module)
        );
        const plan = ensureDailyPlan(this.db, this.settings, mods, qmods);
        const tasks = planTaskStatus(plan, this.settings);
        const leftSpec = planQueue(plan, "specialty").length;
        const leftQuiz = planQueue(plan, "quiz").length;
        if (leftSpec > 0 || leftQuiz > 0) {
          new Notice(
            `秋招八股：专题剩 ${leftSpec} · 拷问剩 ${leftQuiz}${
              tasks.accuracy != null ? ` · 准确率 ${tasks.accuracy}%` : ""
            }`,
            6000
          );
        }
      } catch (e) {
        console.error(e);
      }
    });
  }

  async onunload() {
    if (this.db) await this.db.persist(true);
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_BAGU);
  }

  ensureDb() {
    if (!this._dbReady) {
      this._dbReady = this.db.init();
    }
    return this._dbReady;
  }

  async saveSettings() {
    await this.saveData({ settings: this.settings });
  }

  async syncIndex(notice) {
    await this.ensureDb();
    const files = this.app.vault.getMarkdownFiles();
    const exclude = this.settings.excludePatterns || [];
    const all = [];
    for (const f of files) {
      if (f.path.startsWith(".obsidian/") || f.path.startsWith(".bagu/"))
        continue;
      try {
        // 用 read 而非 cachedRead，避免改完笔记仍读到旧缓存
        const content = await this.app.vault.read(f);
        all.push(
          ...parseQuestionsFromMarkdown(f.path, content, exclude)
        );
      } catch (_) {}
    }
    await this.db.upsertQuestions(all);
    await this.db.persist(true);
    if (notice) new Notice(`已同步 ${all.length} 题到 SQLite`);
    return all.length;
  }

  async activateView() {
    await this.ensureDb();
    const { workspace } = this.app;
    let leaf = workspace.getLeavesOfType(VIEW_TYPE_BAGU)[0];
    if (!leaf) {
      leaf = workspace.getRightLeaf(false);
      await leaf.setViewState({ type: VIEW_TYPE_BAGU, active: true });
    }
    workspace.revealLeaf(leaf);
  }
}
