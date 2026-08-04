var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.js
var main_exports = {};
__export(main_exports, {
  default: () => CetideContribPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian2 = require("obsidian");

// src/constants.js
var VIEW_TYPE_CONTRIB = "cetide-contrib-view";
var DEFAULT_SETTINGS = {
  /** 热力图周数（约一年） */
  heatmapWeeks: 53,
  /** 同一文件修改合并为一次编辑的防抖（秒） */
  editDebounceSec: 30,
  /** 启动时自动全库扫描 */
  scanOnOpen: true,
  /** 启动时用 Git 回填历史 */
  gitBackfillOnOpen: true,
  /** Git 回填天数 */
  gitLookbackDays: 365,
  /** 忽略路径前缀（相对 vault） */
  ignorePrefixes: [
    ".obsidian/",
    ".bagu/",
    ".contrib/",
    "node_modules/"
  ],
  /** Top 活跃文件数量 */
  topFiles: 10
};

// src/util.js
function todayKey(d = /* @__PURE__ */ new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function isMarkdownPath(path) {
  return /\.md$/i.test(path || "");
}
function shouldIgnore(path, prefixes = []) {
  if (!path) return true;
  const p = path.replace(/\\/g, "/");
  if (p.startsWith(".") && !p.includes("/")) return true;
  for (const raw of prefixes || []) {
    const pref = String(raw || "").replace(/\\/g, "/");
    if (!pref) continue;
    if (p === pref.replace(/\/$/, "") || p.startsWith(pref)) return true;
  }
  return false;
}
function topFolder(path) {
  const p = String(path || "").replace(/\\/g, "/");
  const i = p.indexOf("/");
  if (i < 0) return "(\u6839\u76EE\u5F55)";
  return p.slice(0, i);
}
function countText(text) {
  const s = String(text ?? "");
  const noWs = s.replace(/\s+/g, "");
  const chars = noWs.length;
  const words = (s.match(/[A-Za-z0-9]+(?:'[A-Za-z0-9]+)?/g) || []).length;
  return { chars, words, rawLen: s.length };
}
function formatNum(n) {
  const x = Number(n) || 0;
  if (x >= 1e4) {
    const w = x / 1e4;
    return `${w >= 100 ? Math.round(w) : w.toFixed(1).replace(/\.0$/, "")}\u4E07`;
  }
  return String(Math.round(x));
}
function emptyDay() {
  return {
    edits: 0,
    creates: 0,
    deletes: 0,
    charsDelta: 0,
    gitTouches: 0,
    gitCommits: 0,
    gitInsertions: 0,
    gitDeletions: 0,
    files: {}
  };
}

// src/store.js
function emptyStore() {
  return {
    version: 1,
    days: {},
    fileChars: {},
    snapshot: {
      docs: 0,
      chars: 0,
      words: 0,
      scannedAt: null,
      byFolder: {}
    },
    gitBackfilledAt: null
  };
}
function ensureDay(store, key = todayKey()) {
  if (!store.days[key]) store.days[key] = emptyDay();
  const d = store.days[key];
  if (!d.files) d.files = {};
  return d;
}
function dayIntensity(day) {
  if (!day) return 0;
  const edits = Number(day.edits) || 0;
  if (edits > 0) return edits;
  return Number(day.gitTouches) || 0;
}
function mergeGitDays(store, gitDays) {
  for (const [key, g] of Object.entries(gitDays || {})) {
    const d = ensureDay(store, key);
    d.gitTouches = Math.max(Number(d.gitTouches) || 0, Number(g.gitTouches) || 0);
    d.gitCommits = Math.max(Number(d.gitCommits) || 0, Number(g.gitCommits) || 0);
    d.gitInsertions = Math.max(Number(d.gitInsertions) || 0, Number(g.gitInsertions) || 0);
    d.gitDeletions = Math.max(Number(d.gitDeletions) || 0, Number(g.gitDeletions) || 0);
    if (!(Number(d.edits) > 0) && !(Number(d.charsDelta) > 0)) {
      const net = (Number(g.gitInsertions) || 0) - (Number(g.gitDeletions) || 0);
      if (net) d.charsDelta = net;
    }
  }
}
function computeStreak(store, endKey = todayKey()) {
  let streak = 0;
  let key = endKey;
  for (let i = 0; i < 400; i++) {
    const day = store.days[key];
    if (dayIntensity(day) > 0) {
      streak++;
      const d = /* @__PURE__ */ new Date(key + "T12:00:00");
      d.setDate(d.getDate() - 1);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      key = `${y}-${m}-${dd}`;
    } else {
      break;
    }
  }
  return streak;
}
function topActiveFiles(store, limit = 10) {
  const map = /* @__PURE__ */ new Map();
  for (const day of Object.values(store.days || {})) {
    for (const [path, info] of Object.entries(day.files || {})) {
      const cur = map.get(path) || { path, edits: 0, creates: 0 };
      cur.edits += Number(info.edits) || 0;
      cur.creates += Number(info.creates) || 0;
      map.set(path, cur);
    }
  }
  return [...map.values()].sort((a, b) => b.edits + b.creates * 2 - (a.edits + a.creates * 2)).slice(0, limit);
}
function heatmapSeries(store, weeks = 53) {
  const out = [];
  const today = /* @__PURE__ */ new Date();
  today.setHours(12, 0, 0, 0);
  const days = weeks * 7;
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const key = `${y}-${m}-${dd}`;
    const day = store.days[key] || null;
    out.push({ date: key, count: dayIntensity(day), day });
  }
  return out;
}

// src/scan.js
async function scanVault(app, ignorePrefixes = []) {
  const files = app.vault.getMarkdownFiles();
  const fileChars = {};
  const byFolder = {};
  let docs = 0;
  let chars = 0;
  let words = 0;
  for (const file of files) {
    const path = file.path;
    if (!isMarkdownPath(path) || shouldIgnore(path, ignorePrefixes)) continue;
    let text = "";
    try {
      text = await app.vault.cachedRead(file);
    } catch {
      continue;
    }
    const c = countText(text);
    fileChars[path] = c.chars;
    docs++;
    chars += c.chars;
    words += c.words;
    const folder = topFolder(path);
    if (!byFolder[folder]) byFolder[folder] = { docs: 0, chars: 0 };
    byFolder[folder].docs++;
    byFolder[folder].chars += c.chars;
  }
  return {
    snapshot: {
      docs,
      chars,
      words,
      scannedAt: (/* @__PURE__ */ new Date()).toISOString(),
      byFolder
    },
    fileChars
  };
}
async function recountFile(app, path, ignorePrefixes = []) {
  if (!isMarkdownPath(path) || shouldIgnore(path, ignorePrefixes)) return null;
  const file = app.vault.getAbstractFileByPath(path);
  if (!file || !("extension" in file)) return null;
  try {
    const text = await app.vault.cachedRead(file);
    return countText(text).chars;
  } catch {
    return null;
  }
}

// src/git-history.js
function nodeRequire(id) {
  const req = typeof window !== "undefined" && window.require || (typeof require !== "undefined" ? require : null);
  if (!req) throw new Error("\u5F53\u524D\u73AF\u5883\u4E0D\u652F\u6301 Node\uFF08\u8BF7\u4F7F\u7528\u684C\u9762\u7248 Obsidian\uFF09");
  return req(id);
}
function vaultPath(app) {
  const adapter = app?.vault?.adapter;
  if (!adapter?.basePath) throw new Error("\u65E0\u6CD5\u83B7\u53D6\u5E93\u8DEF\u5F84");
  return adapter.basePath;
}
async function git(app, args, opts = {}) {
  const { execFile } = nodeRequire("child_process");
  const nodeProcess = nodeRequire("process");
  const cwd = vaultPath(app);
  const timeout = opts.timeout ?? 12e4;
  return new Promise((resolve, reject) => {
    execFile(
      "git",
      args,
      {
        cwd,
        timeout,
        maxBuffer: 32 * 1024 * 1024,
        env: {
          ...nodeProcess.env || {},
          LANG: "en_US.UTF-8",
          GIT_TERMINAL_PROMPT: "0"
        },
        encoding: "utf8"
      },
      (err, stdout, stderr) => {
        if (err) {
          const msg = String(stderr || err.message || err).trim();
          const e = new Error(msg || `git ${args.join(" ")} failed`);
          e.code = err.code;
          reject(e);
          return;
        }
        resolve({ stdout: String(stdout || ""), stderr: String(stderr || "") });
      }
    );
  });
}
async function isGitRepo(app) {
  try {
    const { stdout } = await git(app, ["rev-parse", "--is-inside-work-tree"]);
    return stdout.trim() === "true";
  } catch {
    return false;
  }
}
async function loadGitDayStats(app, lookbackDays = 365, ignorePrefixes = []) {
  if (!await isGitRepo(app)) return {};
  const since = /* @__PURE__ */ new Date();
  since.setDate(since.getDate() - lookbackDays);
  const sinceStr = since.toISOString().slice(0, 10);
  const { stdout } = await git(app, [
    "log",
    `--since=${sinceStr}`,
    "--date=short",
    "--pretty=format:COMMIT	%ad	%H",
    "--numstat",
    "--",
    "*.md"
  ]);
  const days = {};
  let curDate = null;
  let curFiles = /* @__PURE__ */ new Set();
  let curIns = 0;
  let curDel = 0;
  const flush = () => {
    if (!curDate) return;
    if (!days[curDate]) {
      days[curDate] = {
        gitTouches: 0,
        gitCommits: 0,
        gitInsertions: 0,
        gitDeletions: 0
      };
    }
    const d = days[curDate];
    d.gitCommits += 1;
    d.gitTouches += curFiles.size;
    d.gitInsertions += curIns;
    d.gitDeletions += curDel;
    curFiles = /* @__PURE__ */ new Set();
    curIns = 0;
    curDel = 0;
  };
  const lines = stdout.split(/\r?\n/);
  for (const line of lines) {
    if (!line) continue;
    if (line.startsWith("COMMIT	")) {
      flush();
      const parts = line.split("	");
      curDate = parts[1] || null;
      continue;
    }
    const m = line.match(/^(\d+|-)\t(\d+|-)\t(.+)$/);
    if (!m || !curDate) continue;
    let path = m[3].trim();
    if (path.includes(" => ")) {
      path = path.split(" => ").pop().trim();
    }
    path = path.replace(/\{|\}/g, "");
    const ignored = (ignorePrefixes || []).some((pref) => {
      const p = String(pref || "");
      return p && (path === p.replace(/\/$/, "") || path.startsWith(p));
    });
    if (ignored) continue;
    curFiles.add(path);
    if (m[1] !== "-") curIns += Number(m[1]) || 0;
    if (m[2] !== "-") curDel += Number(m[2]) || 0;
  }
  flush();
  return days;
}

// src/view.js
var import_obsidian = require("obsidian");

// src/charts.js
function renderContribHeatmap(container, dayCounts, weeks = 53, tooltipFn) {
  container.empty();
  container.createDiv({ cls: "contrib-chart-title", text: "\u5199\u4F5C\u8D21\u732E\u56FE\u8C31" });
  const wrap = container.createDiv({ cls: "contrib-heatmap-wrap" });
  const tip = container.createDiv({ cls: "contrib-heat-tooltip" });
  tip.style.display = "none";
  const map = new Map((dayCounts || []).map((d) => [d.date, d]));
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(start.getDate() - (weeks * 7 - 1));
  start.setDate(start.getDate() - start.getDay());
  const cell = 11;
  const gap = 3;
  const labelW = 28;
  const monthsH = 16;
  const cols = Math.ceil((today - start) / 864e5 / 7) + 1;
  const W = labelW + cols * (cell + gap) + 8;
  const H = monthsH + 7 * (cell + gap) + 22;
  const max = Math.max(1, ...[...map.values()].map((d) => d.count || 0));
  const levels = (n) => {
    if (!n) return 0;
    const r = n / max;
    if (r <= 0.15) return 1;
    if (r <= 0.35) return 2;
    if (r <= 0.65) return 3;
    return 4;
  };
  const defaultTip = (item) => {
    const day = item.day;
    if (!item.count) return `${item.date} \xB7 \u65E0\u8BB0\u5F55`;
    const edits = day?.edits || 0;
    const creates = day?.creates || 0;
    const delta = day?.charsDelta || 0;
    const git2 = day?.gitTouches || 0;
    const parts = [`${item.date}`];
    if (edits) parts.push(`\u7F16\u8F91 ${edits} \u6B21`);
    if (creates) parts.push(`\u65B0\u5EFA ${creates}`);
    if (delta) parts.push(`\u5B57\u6570 ${delta > 0 ? "+" : ""}${delta}`);
    if (!edits && git2) parts.push(`Git \u89E6\u53CA ${git2} \u6587\u4EF6`);
    if (day?.gitCommits) parts.push(`${day.gitCommits} commits`);
    return parts.join(" \xB7 ");
  };
  const tipText = tooltipFn || defaultTip;
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.setAttribute("class", "contrib-svg contrib-heatmap");
  svg.style.overflow = "visible";
  const weekdays = ["\u65E5", "\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D"];
  for (let r = 0; r < 7; r++) {
    if (r % 2 === 1) {
      const t = document.createElementNS(ns, "text");
      t.setAttribute("x", "0");
      t.setAttribute("y", String(monthsH + r * (cell + gap) + cell - 1));
      t.setAttribute("font-size", "9");
      t.setAttribute("fill", "currentColor");
      t.setAttribute("opacity", "0.45");
      t.textContent = weekdays[r];
      svg.appendChild(t);
    }
  }
  let col = 0;
  const cursor = new Date(start);
  let lastMonth = -1;
  let started = false;
  while (cursor <= today) {
    const y = cursor.getFullYear();
    const m = String(cursor.getMonth() + 1).padStart(2, "0");
    const day = String(cursor.getDate()).padStart(2, "0");
    const key = `${y}-${m}-${day}`;
    const dow = cursor.getDay();
    if (dow === 0) {
      if (started) col++;
      started = true;
    }
    if (cursor.getMonth() !== lastMonth && (dow === 0 || col === 0)) {
      lastMonth = cursor.getMonth();
      const mt = document.createElementNS(ns, "text");
      mt.setAttribute("x", String(labelW + col * (cell + gap)));
      mt.setAttribute("y", "10");
      mt.setAttribute("font-size", "9");
      mt.setAttribute("fill", "currentColor");
      mt.setAttribute("opacity", "0.55");
      mt.textContent = `${cursor.getMonth() + 1}\u6708`;
      svg.appendChild(mt);
    }
    const item = map.get(key) || { date: key, count: 0, day: null };
    const cnt = item.count || 0;
    const lv = levels(cnt);
    const x = labelW + col * (cell + gap);
    const yy = monthsH + dow * (cell + gap);
    const rect = document.createElementNS(ns, "rect");
    rect.setAttribute("class", `contrib-heat-lv${lv}`);
    rect.setAttribute("x", String(x));
    rect.setAttribute("y", String(yy));
    rect.setAttribute("width", String(cell));
    rect.setAttribute("height", String(cell));
    rect.setAttribute("rx", "2");
    rect.style.cursor = "pointer";
    rect.addEventListener("mouseenter", (ev) => {
      tip.style.display = "block";
      tip.setText(tipText(item));
      const wr = wrap.getBoundingClientRect();
      tip.style.left = `${ev.clientX - wr.left + 12}px`;
      tip.style.top = `${ev.clientY - wr.top - 28}px`;
    });
    rect.addEventListener("mousemove", (ev) => {
      const wr = wrap.getBoundingClientRect();
      tip.style.left = `${ev.clientX - wr.left + 12}px`;
      tip.style.top = `${ev.clientY - wr.top - 28}px`;
    });
    rect.addEventListener("mouseleave", () => {
      tip.style.display = "none";
    });
    svg.appendChild(rect);
    cursor.setDate(cursor.getDate() + 1);
  }
  const legendY = H - 6;
  const legend = document.createElementNS(ns, "g");
  const lt = document.createElementNS(ns, "text");
  lt.setAttribute("x", String(labelW));
  lt.setAttribute("y", String(legendY));
  lt.setAttribute("font-size", "9");
  lt.setAttribute("fill", "currentColor");
  lt.setAttribute("opacity", "0.5");
  lt.textContent = "\u5C11";
  legend.appendChild(lt);
  for (let i = 0; i <= 4; i++) {
    const r = document.createElementNS(ns, "rect");
    r.setAttribute("class", `contrib-heat-lv${i}`);
    r.setAttribute("x", String(labelW + 18 + i * 14));
    r.setAttribute("y", String(legendY - 9));
    r.setAttribute("width", "11");
    r.setAttribute("height", "11");
    r.setAttribute("rx", "2");
    legend.appendChild(r);
  }
  const lt2 = document.createElementNS(ns, "text");
  lt2.setAttribute("x", String(labelW + 18 + 5 * 14));
  lt2.setAttribute("y", String(legendY));
  lt2.setAttribute("font-size", "9");
  lt2.setAttribute("fill", "currentColor");
  lt2.setAttribute("opacity", "0.5");
  lt2.textContent = "\u591A";
  legend.appendChild(lt2);
  svg.appendChild(legend);
  wrap.appendChild(svg);
}

// src/view.js
var ContribView = class extends import_obsidian.ItemView {
  /** @param {import('obsidian').WorkspaceLeaf} leaf @param {import('./main.js').default} plugin */
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
  }
  getViewType() {
    return VIEW_TYPE_CONTRIB;
  }
  getDisplayText() {
    return "\u5199\u4F5C\u8D21\u732E";
  }
  getIcon() {
    return "calendar-days";
  }
  async onOpen() {
    this.plugin.registerContribView(this);
    await this.render();
  }
  async onClose() {
    this.plugin.unregisterContribView(this);
  }
  async render() {
    const root = this.contentEl;
    root.empty();
    root.addClass("contrib-root");
    const store = this.plugin.store;
    const settings = this.plugin.settings;
    const snap = store.snapshot || {};
    const today = store.days[todayKey()] || {};
    const streak = computeStreak(store);
    const header = root.createDiv({ cls: "contrib-header" });
    header.createEl("h2", { text: "\u5199\u4F5C\u8D21\u732E" });
    const actions = header.createDiv({ cls: "contrib-actions" });
    const btnScan = actions.createEl("button", {
      cls: "mod-cta",
      text: "\u5168\u5E93\u626B\u63CF"
    });
    btnScan.onclick = async () => {
      btnScan.disabled = true;
      btnScan.setText("\u626B\u63CF\u4E2D\u2026");
      try {
        await this.plugin.fullScan(true);
        new import_obsidian.Notice("\u5168\u5E93\u626B\u63CF\u5B8C\u6210");
        await this.render();
      } catch (e) {
        new import_obsidian.Notice(`\u626B\u63CF\u5931\u8D25\uFF1A${e.message || e}`);
      } finally {
        btnScan.disabled = false;
        btnScan.setText("\u5168\u5E93\u626B\u63CF");
      }
    };
    const btnGit = actions.createEl("button", { text: "Git \u56DE\u586B" });
    btnGit.onclick = async () => {
      btnGit.disabled = true;
      btnGit.setText("\u56DE\u586B\u4E2D\u2026");
      try {
        const n = await this.plugin.backfillGit(true);
        new import_obsidian.Notice(n != null ? `Git \u56DE\u586B\u5B8C\u6210\uFF08${n} \u5929\u6709\u8BB0\u5F55\uFF09` : "\u975E Git \u4ED3\u5E93\u6216\u56DE\u586B\u5931\u8D25");
        await this.render();
      } catch (e) {
        new import_obsidian.Notice(`\u56DE\u586B\u5931\u8D25\uFF1A${e.message || e}`);
      } finally {
        btnGit.disabled = false;
        btnGit.setText("Git \u56DE\u586B");
      }
    };
    const btnRefresh = actions.createEl("button", { text: "\u5237\u65B0" });
    btnRefresh.onclick = () => this.render();
    const cards = root.createDiv({ cls: "contrib-cards" });
    const mk = (label, value, sub) => {
      const c = cards.createDiv({ cls: "contrib-card" });
      c.createDiv({ cls: "contrib-card-value", text: String(value) });
      c.createDiv({ cls: "contrib-card-label", text: label });
      if (sub) c.createDiv({ cls: "contrib-card-sub", text: sub });
    };
    mk("\u6587\u6863\u6570", formatNum(snap.docs), snap.scannedAt ? `\u626B\u63CF\u4E8E ${snap.scannedAt.slice(0, 16).replace("T", " ")}` : "\u5C1A\u672A\u626B\u63CF");
    mk("\u603B\u5B57\u6570", formatNum(snap.chars), `\u7EA6 ${formatNum(snap.words || 0)} \u82F1\u6587\u8BCD`);
    mk(
      "\u4ECA\u65E5",
      `${Number(today.edits) || 0} \u7F16 / ${Number(today.creates) || 0} \u65B0`,
      `\u5B57\u6570 ${(Number(today.charsDelta) || 0) > 0 ? "+" : ""}${Number(today.charsDelta) || 0}`
    );
    mk("\u8FDE\u7EED\u5199\u4F5C", `${streak} \u5929`, streak ? "\u542B\u4ECA\u65E5\u6709\u8D21\u732E" : "\u4ECA\u5929\u8FD8\u6CA1\u5199");
    const heat = root.createDiv({ cls: "contrib-section" });
    const series = heatmapSeries(store, settings.heatmapWeeks || 53);
    renderContribHeatmap(heat, series, settings.heatmapWeeks || 53);
    const meta = root.createDiv({ cls: "contrib-meta" });
    if (store.gitBackfilledAt) {
      meta.createSpan({
        text: `Git \u56DE\u586B\uFF1A${store.gitBackfilledAt.slice(0, 16).replace("T", " ")}`
      });
    } else {
      meta.createSpan({ text: "\u5C1A\u672A Git \u56DE\u586B \xB7 \u56FE\u8C31\u4ECE\u5B89\u88C5\u540E\u7684\u7F16\u8F91\u5F00\u59CB\u7D2F\u79EF" });
    }
    const folders = Object.entries(snap.byFolder || {}).sort(
      (a, b) => b[1].chars - a[1].chars
    );
    if (folders.length) {
      const sec = root.createDiv({ cls: "contrib-section" });
      sec.createEl("h3", { text: "\u76EE\u5F55\u5B57\u6570\u5206\u5E03" });
      const list = sec.createDiv({ cls: "contrib-folder-list" });
      const maxChars = Math.max(1, ...folders.map(([, v]) => v.chars));
      for (const [name, v] of folders.slice(0, 12)) {
        const row = list.createDiv({ cls: "contrib-folder-row" });
        row.createDiv({ cls: "contrib-folder-name", text: name });
        const barWrap = row.createDiv({ cls: "contrib-folder-bar-wrap" });
        const bar = barWrap.createDiv({ cls: "contrib-folder-bar" });
        bar.style.width = `${Math.max(4, v.chars / maxChars * 100)}%`;
        row.createDiv({
          cls: "contrib-folder-stat",
          text: `${v.docs} \u7BC7 \xB7 ${formatNum(v.chars)} \u5B57`
        });
      }
    }
    const tops = topActiveFiles(store, settings.topFiles || 10);
    const topSec = root.createDiv({ cls: "contrib-section" });
    topSec.createEl("h3", { text: "\u6D3B\u8DC3\u6587\u4EF6" });
    if (!tops.length) {
      topSec.createDiv({
        cls: "contrib-empty",
        text: "\u6682\u65E0\u672C\u5730\u7F16\u8F91\u8BB0\u5F55\u3002\u4FDD\u5B58 Markdown \u6216\u6267\u884C Git \u56DE\u586B\u540E\u4F1A\u51FA\u73B0\u5728\u8FD9\u91CC\u3002"
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
          text: `  \u7F16\u8F91 ${f.edits}${f.creates ? ` \xB7 \u65B0\u5EFA ${f.creates}` : ""}`
        });
      }
    }
  }
};
var ContribSettingTab = class extends import_obsidian.PluginSettingTab {
  /** @param {import('obsidian').App} app @param {import('./main.js').default} plugin */
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Cetide Contrib \u8BBE\u7F6E" });
    new import_obsidian.Setting(containerEl).setName("\u70ED\u529B\u56FE\u5468\u6570").setDesc("\u9ED8\u8BA4 53 \u5468\uFF08\u7EA6\u4E00\u5E74\uFF09").addText(
      (t) => t.setValue(String(this.plugin.settings.heatmapWeeks)).onChange(async (v) => {
        const n = Math.max(4, Math.min(104, Number(v) || 53));
        this.plugin.settings.heatmapWeeks = n;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("\u7F16\u8F91\u9632\u6296\uFF08\u79D2\uFF09").setDesc("\u540C\u4E00\u6587\u4EF6\u5728\u7A97\u53E3\u5185\u591A\u6B21\u4FDD\u5B58\u53EA\u8BA1 1 \u6B21\u7F16\u8F91").addText(
      (t) => t.setValue(String(this.plugin.settings.editDebounceSec)).onChange(async (v) => {
        this.plugin.settings.editDebounceSec = Math.max(5, Number(v) || 30);
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("\u542F\u52A8\u65F6\u5168\u5E93\u626B\u63CF").addToggle(
      (t) => t.setValue(this.plugin.settings.scanOnOpen).onChange(async (v) => {
        this.plugin.settings.scanOnOpen = v;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("\u542F\u52A8\u65F6 Git \u56DE\u586B").addToggle(
      (t) => t.setValue(this.plugin.settings.gitBackfillOnOpen).onChange(async (v) => {
        this.plugin.settings.gitBackfillOnOpen = v;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Git \u56DE\u586B\u5929\u6570").addText(
      (t) => t.setValue(String(this.plugin.settings.gitLookbackDays)).onChange(async (v) => {
        this.plugin.settings.gitLookbackDays = Math.max(30, Number(v) || 365);
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("\u5FFD\u7565\u8DEF\u5F84\u524D\u7F00").setDesc("\u6BCF\u884C\u4E00\u4E2A\uFF0C\u76F8\u5BF9\u5E93\u6839\u8DEF\u5F84").addTextArea((t) => {
      t.setValue((this.plugin.settings.ignorePrefixes || []).join("\n"));
      t.inputEl.rows = 5;
      t.inputEl.style.width = "100%";
      t.onChange(async (v) => {
        this.plugin.settings.ignorePrefixes = v.split(/\n+/).map((s) => s.trim()).filter(Boolean);
        await this.plugin.saveSettings();
      });
    });
  }
};

// src/main.js
var CetideContribPlugin = class extends import_obsidian2.Plugin {
  async onload() {
    const raw = await this.loadData() || {};
    this.settings = Object.assign({}, DEFAULT_SETTINGS, raw.settings || {});
    this.store = Object.assign(emptyStore(), raw.store || {});
    if (!this.store.days) this.store.days = {};
    if (!this.store.fileChars) this.store.fileChars = {};
    if (!this.store.snapshot) this.store.snapshot = emptyStore().snapshot;
    this._views = /* @__PURE__ */ new Set();
    this._editTimers = /* @__PURE__ */ new Map();
    this._saveTimer = null;
    this._ready = false;
    this.registerView(VIEW_TYPE_CONTRIB, (leaf) => new ContribView(leaf, this));
    this.addRibbonIcon("calendar-days", "\u5199\u4F5C\u8D21\u732E\u56FE\u8C31", () => this.activateView());
    this.addCommand({
      id: "open-contrib",
      name: "\u6253\u5F00\u5199\u4F5C\u8D21\u732E\u56FE\u8C31",
      callback: () => this.activateView()
    });
    this.addCommand({
      id: "contrib-full-scan",
      name: "\u5168\u5E93\u626B\u63CF\u6587\u6863\u6570\u4E0E\u5B57\u6570",
      callback: async () => {
        await this.fullScan(true);
        new import_obsidian2.Notice("\u5168\u5E93\u626B\u63CF\u5B8C\u6210");
        this.refreshViews();
      }
    });
    this.addCommand({
      id: "contrib-git-backfill",
      name: "\u4ECE Git \u56DE\u586B\u8D21\u732E\u5386\u53F2",
      callback: async () => {
        const n = await this.backfillGit(true);
        new import_obsidian2.Notice(
          n != null ? `Git \u56DE\u586B\u5B8C\u6210\uFF08${n} \u5929\u6709\u8BB0\u5F55\uFF09` : "\u975E Git \u4ED3\u5E93\u6216\u65E0\u53EF\u56DE\u586B\u6570\u636E"
        );
        this.refreshViews();
      }
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
  onunload() {
    for (const t of this._editTimers.values()) window.clearTimeout(t);
    this._editTimers.clear();
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_CONTRIB);
  }
  async saveAll() {
    await this.saveData({
      settings: this.settings,
      store: this.store
    });
  }
  async saveSettings() {
    await this.saveAll();
  }
  scheduleSave() {
    if (this._saveTimer) window.clearTimeout(this._saveTimer);
    this._saveTimer = window.setTimeout(() => {
      this.saveAll().catch((e) => console.warn("[cetide-contrib] save", e));
    }, 1200);
  }
  registerContribView(view) {
    this._views.add(view);
  }
  unregisterContribView(view) {
    this._views.delete(view);
  }
  refreshViews() {
    for (const v of this._views) {
      v.render?.().catch?.(() => {
      });
    }
  }
  async activateView() {
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
  trackable(path) {
    return isMarkdownPath(path) && !shouldIgnore(path, this.settings.ignorePrefixes);
  }
  async fullScan(forceNotice = false) {
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
  async backfillGit(force = false) {
    if (!force && this.store.gitBackfilledAt) {
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
      this.store.gitBackfilledAt = (/* @__PURE__ */ new Date()).toISOString();
      await this.saveAll();
      return Object.keys(gitDays).length;
    } catch (e) {
      console.warn("[cetide-contrib] git backfill", e);
      return null;
    }
  }
  async onCreate(file) {
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
  onModify(file) {
    if (!this._ready || !file?.path || !this.trackable(file.path)) return;
    const path = file.path;
    const sec = Math.max(5, Number(this.settings.editDebounceSec) || 30);
    const prev = this._editTimers.get(path);
    if (prev) window.clearTimeout(prev);
    const tid = window.setTimeout(() => {
      this._editTimers.delete(path);
      this.commitEdit(path).catch(
        (e) => console.warn("[cetide-contrib] edit", e)
      );
    }, sec * 1e3);
    this._editTimers.set(path, tid);
  }
  async commitEdit(path) {
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
          this.store.snapshot.chars = (Number(this.store.snapshot.chars) || 0) + delta;
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
  async onDelete(file) {
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
  async onRename(file, oldPath) {
    if (!this._ready) return;
    const next = file?.path;
    if (!next) return;
    if (this.store.fileChars[oldPath] != null) {
      this.store.fileChars[next] = this.store.fileChars[oldPath];
      delete this.store.fileChars[oldPath];
    }
    const day = this.store.days[todayKey()];
    if (day?.files?.[oldPath]) {
      day.files[next] = day.files[oldPath];
      delete day.files[oldPath];
    }
    this.scheduleSave();
  }
  bumpSnapshot(path, charsDelta, docsDelta) {
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
};
if(module.exports.default) module.exports = module.exports.default;
