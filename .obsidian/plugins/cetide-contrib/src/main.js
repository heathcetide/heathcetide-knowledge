import { Plugin, Notice } from "obsidian";
import { VIEW_TYPE_CONTRIB, DEFAULT_SETTINGS } from "./constants.js";
import { emptyStore, ensureDay, mergeGitDays } from "./store.js";
import { scanVault, recountFile } from "./scan.js";
import { loadGitDayStats } from "./git-history.js";
import { ContribView, ContribSettingTab } from "./view.js";
import {
  isMarkdownPath,
  shouldIgnore,
  todayKey,
  topFolder,
} from "./util.js";

export default class CetideContribPlugin extends Plugin {
  async onload () {
    const raw = (await this.loadData()) || {};
    this.settings = Object.assign({}, DEFAULT_SETTINGS, raw.settings || {});
    this.store = Object.assign(emptyStore(), raw.store || {});
    if (!this.store.days) this.store.days = {};
    if (!this.store.fileChars) this.store.fileChars = {};
    if (!this.store.snapshot) this.store.snapshot = emptyStore().snapshot;

    this._views = new Set();
    /** @type {Map<string, number>} path → timeout id */
    this._editTimers = new Map();
    this._saveTimer = null;
    this._ready = false;

    this.registerView(VIEW_TYPE_CONTRIB, (leaf) => new ContribView(leaf, this));

    this.addRibbonIcon("calendar-days", "写作贡献图谱", () => this.activateView());

    this.addCommand({
      id: "open-contrib",
      name: "打开写作贡献图谱",
      callback: () => this.activateView(),
    });

    this.addCommand({
      id: "contrib-full-scan",
      name: "全库扫描文档数与字数",
      callback: async () => {
        await this.fullScan(true);
        new Notice("全库扫描完成");
        this.refreshViews();
      },
    });

    this.addCommand({
      id: "contrib-git-backfill",
      name: "从 Git 回填贡献历史",
      callback: async () => {
        const n = await this.backfillGit(true);
        new Notice(
          n != null ? `Git 回填完成（${n} 天有记录）` : "非 Git 仓库或无可回填数据"
        );
        this.refreshViews();
      },
    });

    this.addSettingTab(new ContribSettingTab(this.app, this));

    this.registerEvent(
      this.app.vault.on("create", (f) => this.onCreate(f))
    );
    this.registerEvent(
      this.app.vault.on("modify", (f) => this.onModify(f))
    );
    this.registerEvent(
      this.app.vault.on("delete", (f) => this.onDelete(f))
    );
    this.registerEvent(
      this.app.vault.on("rename", (f, oldPath) => this.onRename(f, oldPath))
    );

    this.app.workspace.onLayoutReady(async () => {
      this._ready = true;
      try {
        if (this.settings.scanOnOpen) await this.fullScan(false);
        if (this.settings.gitBackfillOnOpen) await this.backfillGit(false);
      } catch (e) {
        console.warn("[cetide-contrib] init", e);
      }
      this.refreshViews();
    });
  }

  onunload () {
    for (const t of this._editTimers.values()) window.clearTimeout(t);
    this._editTimers.clear();
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_CONTRIB);
  }

  async saveAll () {
    await this.saveData({
      settings: this.settings,
      store: this.store,
    });
  }

  async saveSettings () {
    await this.saveAll();
  }

  scheduleSave () {
    if (this._saveTimer) window.clearTimeout(this._saveTimer);
    this._saveTimer = window.setTimeout(() => {
      this.saveAll().catch((e) => console.warn("[cetide-contrib] save", e));
    }, 1200);
  }

  registerContribView (view) {
    this._views.add(view);
  }

  unregisterContribView (view) {
    this._views.delete(view);
  }

  refreshViews () {
    for (const v of this._views) {
      v.render?.().catch?.(() => {});
    }
  }

  async activateView () {
    const { workspace } = this.app;
    const existing = workspace.getLeavesOfType(VIEW_TYPE_CONTRIB);
    if (existing.length) {
      workspace.revealLeaf(existing[0]);
      return;
    }
    const leaf = workspace.getLeaf("tab");
    await leaf.setViewState({ type: VIEW_TYPE_CONTRIB, active: true });
    workspace.revealLeaf(leaf);
  }

  trackable (path) {
    return (
      isMarkdownPath(path) &&
      !shouldIgnore(path, this.settings.ignorePrefixes)
    );
  }

  async fullScan (forceNotice = false) {
    const { snapshot, fileChars } = await scanVault(
      this.app,
      this.settings.ignorePrefixes
    );
    this.store.snapshot = snapshot;
    this.store.fileChars = fileChars;
    await this.saveAll();
    if (forceNotice) this.refreshViews();
    return snapshot;
  }

  /**
   * @returns {Promise<number|null>} days with git activity
   */
  async backfillGit (force = false) {
    if (!force && this.store.gitBackfilledAt) {
      // Refresh at most once per day automatically
      const last = this.store.gitBackfilledAt.slice(0, 10);
      if (last === todayKey()) return Object.keys(this.store.days).length;
    }
    try {
      const gitDays = await loadGitDayStats(
        this.app,
        this.settings.gitLookbackDays || 365,
        this.settings.ignorePrefixes
      );
      mergeGitDays(this.store, gitDays);
      this.store.gitBackfilledAt = new Date().toISOString();
      await this.saveAll();
      return Object.keys(gitDays).length;
    } catch (e) {
      console.warn("[cetide-contrib] git backfill", e);
      return null;
    }
  }

  async onCreate (file) {
    if (!this._ready || !file?.path || !this.trackable(file.path)) return;
    const day = ensureDay(this.store);
    day.creates = (Number(day.creates) || 0) + 1;
    if (!day.files[file.path]) day.files[file.path] = { edits: 0, creates: 0 };
    day.files[file.path].creates = (day.files[file.path].creates || 0) + 1;

    const chars = await recountFile(
      this.app,
      file.path,
      this.settings.ignorePrefixes
    );
    if (chars != null) {
      this.store.fileChars[file.path] = chars;
      day.charsDelta = (Number(day.charsDelta) || 0) + chars;
      this.bumpSnapshot(file.path, chars, 1);
    }
    this.scheduleSave();
    this.refreshViews();
  }

  onModify (file) {
    if (!this._ready || !file?.path || !this.trackable(file.path)) return;
    const path = file.path;
    const sec = Math.max(5, Number(this.settings.editDebounceSec) || 30);
    const prev = this._editTimers.get(path);
    if (prev) window.clearTimeout(prev);
    const tid = window.setTimeout(() => {
      this._editTimers.delete(path);
      this.commitEdit(path).catch((e) =>
        console.warn("[cetide-contrib] edit", e)
      );
    }, sec * 1000);
    this._editTimers.set(path, tid);
  }

  async commitEdit (path) {
    const day = ensureDay(this.store);
    day.edits = (Number(day.edits) || 0) + 1;
    if (!day.files[path]) day.files[path] = { edits: 0, creates: 0 };
    day.files[path].edits = (day.files[path].edits || 0) + 1;

    const chars = await recountFile(
      this.app,
      path,
      this.settings.ignorePrefixes
    );
    if (chars != null) {
      const old = Number(this.store.fileChars[path]) || 0;
      const delta = chars - old;
      this.store.fileChars[path] = chars;
      if (delta) {
        day.charsDelta = (Number(day.charsDelta) || 0) + delta;
        if (this.store.snapshot) {
          this.store.snapshot.chars =
            (Number(this.store.snapshot.chars) || 0) + delta;
          const folder = topFolder(path);
          const bf = this.store.snapshot.byFolder || (this.store.snapshot.byFolder = {});
          if (!bf[folder]) bf[folder] = { docs: 0, chars: 0 };
          bf[folder].chars = (Number(bf[folder].chars) || 0) + delta;
        }
      }
    }
    this.scheduleSave();
    this.refreshViews();
  }

  async onDelete (file) {
    if (!this._ready || !file?.path || !this.trackable(file.path)) return;
    const path = file.path;
    const day = ensureDay(this.store);
    day.deletes = (Number(day.deletes) || 0) + 1;
    const old = Number(this.store.fileChars[path]) || 0;
    delete this.store.fileChars[path];
    if (old) {
      day.charsDelta = (Number(day.charsDelta) || 0) - old;
      this.bumpSnapshot(path, -old, -1);
    }
    this.scheduleSave();
    this.refreshViews();
  }

  async onRename (file, oldPath) {
    if (!this._ready) return;
    const next = file?.path;
    if (!next) return;
    if (this.store.fileChars[oldPath] != null) {
      this.store.fileChars[next] = this.store.fileChars[oldPath];
      delete this.store.fileChars[oldPath];
    }
    // Rewrite today's file keys if present
    const day = this.store.days[todayKey()];
    if (day?.files?.[oldPath]) {
      day.files[next] = day.files[oldPath];
      delete day.files[oldPath];
    }
    this.scheduleSave();
  }

  bumpSnapshot (path, charsDelta, docsDelta) {
    const snap = this.store.snapshot || (this.store.snapshot = emptyStore().snapshot);
    snap.chars = Math.max(0, (Number(snap.chars) || 0) + charsDelta);
    snap.docs = Math.max(0, (Number(snap.docs) || 0) + docsDelta);
    const folder = topFolder(path);
    if (!snap.byFolder) snap.byFolder = {};
    if (!snap.byFolder[folder]) snap.byFolder[folder] = { docs: 0, chars: 0 };
    snap.byFolder[folder].docs = Math.max(
      0,
      (Number(snap.byFolder[folder].docs) || 0) + docsDelta
    );
    snap.byFolder[folder].chars = Math.max(
      0,
      (Number(snap.byFolder[folder].chars) || 0) + charsDelta
    );
  }
}
