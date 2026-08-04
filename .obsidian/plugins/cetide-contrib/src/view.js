import { ItemView, PluginSettingTab, Setting, Notice } from "obsidian";
import { VIEW_TYPE_CONTRIB } from "./constants.js";
import {
  computeStreak,
  heatmapSeries,
  topActiveFiles,
} from "./store.js";
import { renderContribHeatmap } from "./charts.js";
import { formatNum, todayKey } from "./util.js";

export class ContribView extends ItemView {
  /** @param {import('obsidian').WorkspaceLeaf} leaf @param {import('./main.js').default} plugin */
  constructor (leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType () {
    return VIEW_TYPE_CONTRIB;
  }

  getDisplayText () {
    return "写作贡献";
  }

  getIcon () {
    return "calendar-days";
  }

  async onOpen () {
    this.plugin.registerContribView(this);
    await this.render();
  }

  async onClose () {
    this.plugin.unregisterContribView(this);
  }

  async render () {
    const root = this.contentEl;
    root.empty();
    root.addClass("contrib-root");

    const store = this.plugin.store;
    const settings = this.plugin.settings;
    const snap = store.snapshot || {};
    const today = store.days[todayKey()] || {};
    const streak = computeStreak(store);

    const header = root.createDiv({ cls: "contrib-header" });
    header.createEl("h2", { text: "写作贡献" });
    const actions = header.createDiv({ cls: "contrib-actions" });
    const btnScan = actions.createEl("button", {
      cls: "mod-cta",
      text: "全库扫描",
    });
    btnScan.onclick = async () => {
      btnScan.disabled = true;
      btnScan.setText("扫描中…");
      try {
        await this.plugin.fullScan(true);
        new Notice("全库扫描完成");
        await this.render();
      } catch (e) {
        new Notice(`扫描失败：${e.message || e}`);
      } finally {
        btnScan.disabled = false;
        btnScan.setText("全库扫描");
      }
    };
    const btnGit = actions.createEl("button", { text: "Git 回填" });
    btnGit.onclick = async () => {
      btnGit.disabled = true;
      btnGit.setText("回填中…");
      try {
        const n = await this.plugin.backfillGit(true);
        new Notice(n != null ? `Git 回填完成（${n} 天有记录）` : "非 Git 仓库或回填失败");
        await this.render();
      } catch (e) {
        new Notice(`回填失败：${e.message || e}`);
      } finally {
        btnGit.disabled = false;
        btnGit.setText("Git 回填");
      }
    };
    const btnRefresh = actions.createEl("button", { text: "刷新" });
    btnRefresh.onclick = () => this.render();

    const cards = root.createDiv({ cls: "contrib-cards" });
    const mk = (label, value, sub) => {
      const c = cards.createDiv({ cls: "contrib-card" });
      c.createDiv({ cls: "contrib-card-value", text: String(value) });
      c.createDiv({ cls: "contrib-card-label", text: label });
      if (sub) c.createDiv({ cls: "contrib-card-sub", text: sub });
    };
    mk("文档数", formatNum(snap.docs), snap.scannedAt ? `扫描于 ${snap.scannedAt.slice(0, 16).replace("T", " ")}` : "尚未扫描");
    mk("总字数", formatNum(snap.chars), `约 ${formatNum(snap.words || 0)} 英文词`);
    mk(
      "今日",
      `${Number(today.edits) || 0} 编 / ${Number(today.creates) || 0} 新`,
      `字数 ${(Number(today.charsDelta) || 0) > 0 ? "+" : ""}${Number(today.charsDelta) || 0}`
    );
    mk("连续写作", `${streak} 天`, streak ? "含今日有贡献" : "今天还没写");

    const heat = root.createDiv({ cls: "contrib-section" });
    const series = heatmapSeries(store, settings.heatmapWeeks || 53);
    renderContribHeatmap(heat, series, settings.heatmapWeeks || 53);

    const meta = root.createDiv({ cls: "contrib-meta" });
    if (store.gitBackfilledAt) {
      meta.createSpan({
        text: `Git 回填：${store.gitBackfilledAt.slice(0, 16).replace("T", " ")}`,
      });
    } else {
      meta.createSpan({ text: "尚未 Git 回填 · 图谱从安装后的编辑开始累积" });
    }

    // Folder breakdown
    const folders = Object.entries(snap.byFolder || {}).sort(
      (a, b) => b[1].chars - a[1].chars
    );
    if (folders.length) {
      const sec = root.createDiv({ cls: "contrib-section" });
      sec.createEl("h3", { text: "目录字数分布" });
      const list = sec.createDiv({ cls: "contrib-folder-list" });
      const maxChars = Math.max(1, ...folders.map(([, v]) => v.chars));
      for (const [name, v] of folders.slice(0, 12)) {
        const row = list.createDiv({ cls: "contrib-folder-row" });
        row.createDiv({ cls: "contrib-folder-name", text: name });
        const barWrap = row.createDiv({ cls: "contrib-folder-bar-wrap" });
        const bar = barWrap.createDiv({ cls: "contrib-folder-bar" });
        bar.style.width = `${Math.max(4, (v.chars / maxChars) * 100)}%`;
        row.createDiv({
          cls: "contrib-folder-stat",
          text: `${v.docs} 篇 · ${formatNum(v.chars)} 字`,
        });
      }
    }

    // Top files
    const tops = topActiveFiles(store, settings.topFiles || 10);
    const topSec = root.createDiv({ cls: "contrib-section" });
    topSec.createEl("h3", { text: "活跃文件" });
    if (!tops.length) {
      topSec.createDiv({
        cls: "contrib-empty",
        text: "暂无本地编辑记录。保存 Markdown 或执行 Git 回填后会出现在这里。",
      });
    } else {
      const ul = topSec.createEl("ul", { cls: "contrib-top-list" });
      for (const f of tops) {
        const li = ul.createEl("li");
        const a = li.createEl("a", { text: f.path, cls: "internal-link" });
        a.onclick = (ev) => {
          ev.preventDefault();
          this.app.workspace.openLinkText(f.path, "", false);
        };
        li.createSpan({
          cls: "contrib-top-meta",
          text: `  编辑 ${f.edits}${f.creates ? ` · 新建 ${f.creates}` : ""}`,
        });
      }
    }
  }
}

export class ContribSettingTab extends PluginSettingTab {
  /** @param {import('obsidian').App} app @param {import('./main.js').default} plugin */
  constructor (app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display () {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Cetide Contrib 设置" });

    new Setting(containerEl)
      .setName("热力图周数")
      .setDesc("默认 53 周（约一年）")
      .addText((t) =>
        t
          .setValue(String(this.plugin.settings.heatmapWeeks))
          .onChange(async (v) => {
            const n = Math.max(4, Math.min(104, Number(v) || 53));
            this.plugin.settings.heatmapWeeks = n;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("编辑防抖（秒）")
      .setDesc("同一文件在窗口内多次保存只计 1 次编辑")
      .addText((t) =>
        t
          .setValue(String(this.plugin.settings.editDebounceSec))
          .onChange(async (v) => {
            this.plugin.settings.editDebounceSec = Math.max(5, Number(v) || 30);
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("启动时全库扫描")
      .addToggle((t) =>
        t.setValue(this.plugin.settings.scanOnOpen).onChange(async (v) => {
          this.plugin.settings.scanOnOpen = v;
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName("启动时 Git 回填")
      .addToggle((t) =>
        t.setValue(this.plugin.settings.gitBackfillOnOpen).onChange(async (v) => {
          this.plugin.settings.gitBackfillOnOpen = v;
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName("Git 回填天数")
      .addText((t) =>
        t
          .setValue(String(this.plugin.settings.gitLookbackDays))
          .onChange(async (v) => {
            this.plugin.settings.gitLookbackDays = Math.max(30, Number(v) || 365);
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("忽略路径前缀")
      .setDesc("每行一个，相对库根路径")
      .addTextArea((t) => {
        t.setValue((this.plugin.settings.ignorePrefixes || []).join("\n"));
        t.inputEl.rows = 5;
        t.inputEl.style.width = "100%";
        t.onChange(async (v) => {
          this.plugin.settings.ignorePrefixes = v
            .split(/\n+/)
            .map((s) => s.trim())
            .filter(Boolean);
          await this.plugin.saveSettings();
        });
      });
  }
}
