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
  default: () => CetideGitPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian2 = require("obsidian");

// src/constants.js
var VIEW_TYPE_GIT = "cetide-git-scm";
var DEFAULT_SETTINGS = {
  autoRefreshMs: 4e3,
  showUntracked: true,
  pushAfterCommit: false,
  panelPlacement: "main",
  ollamaBaseUrl: "http://127.0.0.1:11434",
  ollamaModel: "minimax-m3:cloud",
  ollamaTimeoutMs: 12e4,
  commitMessageLang: "zh"
};

// src/view.js
var import_obsidian = require("obsidian");

// src/git.js
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
  const timeout = opts.timeout ?? 6e4;
  return new Promise((resolve, reject) => {
    const child = execFile(
      "git",
      args,
      {
        cwd,
        timeout,
        maxBuffer: 8 * 1024 * 1024,
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
          e.stdout = stdout;
          e.stderr = stderr;
          reject(e);
          return;
        }
        resolve({ stdout: String(stdout || ""), stderr: String(stderr || "") });
      }
    );
    if (opts.input != null && child.stdin) {
      child.stdin.end(opts.input);
    }
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
async function getBranch(app) {
  try {
    const { stdout } = await git(app, ["branch", "--show-current"]);
    const name = stdout.trim();
    if (name) return name;
  } catch {
  }
  try {
    const { stdout } = await git(app, ["rev-parse", "--short", "HEAD"]);
    return `HEAD (${stdout.trim()})`;
  } catch {
    return "\u2014";
  }
}
async function getUpstream(app) {
  try {
    const { stdout } = await git(app, [
      "rev-parse",
      "--abbrev-ref",
      "--symbolic-full-name",
      "@{u}"
    ]);
    return stdout.trim() || null;
  } catch {
    return null;
  }
}
async function getAheadBehind(app) {
  try {
    const { stdout } = await git(app, [
      "rev-list",
      "--left-right",
      "--count",
      "HEAD...@{u}"
    ]);
    const [ahead, behind] = stdout.trim().split(/\s+/).map((n) => Number(n) || 0);
    return { ahead, behind };
  } catch {
    return { ahead: 0, behind: 0 };
  }
}
async function getStatus(app) {
  const { stdout } = await git(app, ["status", "--porcelain=v1", "-uall", "-z"]);
  const staged = [];
  const unstaged = [];
  const untracked = [];
  const parts = stdout.split("\0").filter(Boolean);
  for (let i = 0; i < parts.length; i++) {
    const entry = parts[i];
    if (entry.length < 3) continue;
    const x = entry[0];
    const y = entry[1];
    let path = entry.slice(3);
    let oldPath = null;
    if ((x === "R" || x === "C" || y === "R" || y === "C") && i + 1 < parts.length) {
      oldPath = path;
      path = parts[++i];
    }
    const file = {
      path,
      oldPath,
      x,
      y,
      statusCode: `${x}${y}`.trim(),
      label: statusLabel(x, y)
    };
    if (x === "?" && y === "?") {
      untracked.push(file);
      continue;
    }
    if (x !== " " && x !== "?") {
      staged.push({ ...file, side: "staged", code: x, label: statusLabel(x, " ") });
    }
    if (y !== " " && y !== "?") {
      unstaged.push({ ...file, side: "unstaged", code: y, label: statusLabel(" ", y) });
    }
  }
  return { staged, unstaged, untracked };
}
function statusLabel(x, y) {
  const code = x !== " " && x !== "?" ? x : y;
  switch (code) {
    case "M":
      return "M";
    case "A":
      return "A";
    case "D":
      return "D";
    case "R":
      return "R";
    case "C":
      return "C";
    case "U":
      return "U";
    case "?":
      return "U";
    case "!":
      return "!";
    default:
      return code || "?";
  }
}
async function stagePaths(app, paths) {
  if (!paths?.length) return;
  await git(app, ["add", "--", ...paths]);
}
async function unstagePaths(app, paths) {
  if (!paths?.length) return;
  try {
    await git(app, ["restore", "--staged", "--", ...paths]);
  } catch {
    await git(app, ["reset", "HEAD", "--", ...paths]);
  }
}
async function discardPaths(app, paths) {
  if (!paths?.length) return;
  const tracked = [];
  const untracked = [];
  for (const p of paths) {
    try {
      await git(app, ["ls-files", "--error-unmatch", "--", p]);
      tracked.push(p);
    } catch {
      untracked.push(p);
    }
  }
  if (tracked.length) {
    try {
      await git(app, ["restore", "--worktree", "--", ...tracked]);
    } catch {
      await git(app, ["checkout", "--", ...tracked]);
    }
  }
  if (untracked.length) {
    const fs = nodeRequire("fs");
    const pathMod = nodeRequire("path");
    const root = vaultPath(app);
    for (const p of untracked) {
      const full = pathMod.join(root, p);
      try {
        fs.rmSync(full, { recursive: true, force: true });
      } catch {
      }
    }
  }
}
async function commit(app, message) {
  const msg = String(message || "").trim();
  if (!msg) throw new Error("\u8BF7\u586B\u5199\u63D0\u4EA4\u8BF4\u660E");
  await git(app, ["commit", "-m", msg]);
}
async function pull(app) {
  return git(app, ["pull", "--rebase", "--autostash"], { timeout: 12e4 });
}
async function push(app) {
  return git(app, ["push"], { timeout: 12e4 });
}
async function fetch2(app) {
  return git(app, ["fetch", "--prune"], { timeout: 12e4 });
}
async function getDiff(app, path, { staged = false } = {}) {
  const args = staged ? ["diff", "--cached", "--", path] : ["diff", "--", path];
  try {
    const { stdout } = await git(app, args);
    if (stdout.trim()) return stdout;
  } catch {
  }
  if (!staged) {
    try {
      const { stdout } = await git(app, ["show", `:${path}`]);
      return stdout;
    } catch {
      try {
        const fs = nodeRequire("fs");
        const pathMod = nodeRequire("path");
        const full = pathMod.join(vaultPath(app), path);
        const text = fs.readFileSync(full, "utf8");
        return text.split("\n").map((line) => `+${line}`).join("\n");
      } catch {
        return "";
      }
    }
  }
  return "";
}
async function initRepo(app) {
  await git(app, ["init"]);
}
async function getStagedDiffAll(app, maxChars = 14e3) {
  try {
    const { stdout } = await git(app, ["diff", "--cached", "--no-color"]);
    const text = stdout.trim();
    if (text) return text.slice(0, maxChars);
  } catch {
  }
  try {
    const { stdout } = await git(app, ["diff", "--no-color"]);
    return stdout.trim().slice(0, maxChars);
  } catch {
    return "";
  }
}
async function getRepoSummary(app) {
  const ok = await isGitRepo(app);
  if (!ok) {
    return {
      isRepo: false,
      branch: "\u2014",
      upstream: null,
      ahead: 0,
      behind: 0,
      staged: [],
      unstaged: [],
      untracked: []
    };
  }
  const [branch, upstream, ab, status] = await Promise.all([
    getBranch(app),
    getUpstream(app),
    getAheadBehind(app),
    getStatus(app)
  ]);
  return {
    isRepo: true,
    branch,
    upstream,
    ahead: ab.ahead,
    behind: ab.behind,
    ...status
  };
}

// src/ollama.js
var SYSTEM_ZH = `\u4F60\u662F\u4E13\u4E1A\u7684 Git \u63D0\u4EA4\u4FE1\u606F\u52A9\u624B\u3002\u6839\u636E\u6682\u5B58\u533A diff \u751F\u6210 commit message\u3002

\u8981\u6C42\uFF1A
- \u4F7F\u7528\u4E2D\u6587\uFF0C\u7B80\u6D01\u51C6\u786E\uFF0C\u8BF4\u660E\u300C\u505A\u4E86\u4EC0\u4E48\u300D\u548C\u300C\u4E3A\u4EC0\u4E48\u300D\uFF08\u82E5\u80FD\u4ECE diff \u63A8\u65AD\uFF09
- \u7B2C\u4E00\u884C\u4E3A\u4E3B\u9898\uFF0C\u226472 \u5B57\u7B26\uFF0C\u4E0D\u7528\u53E5\u53F7\u7ED3\u5C3E
- \u82E5\u6709\u591A\u4E2A\u72EC\u7ACB\u6539\u52A8\uFF0C\u4E3B\u9898\u540E\u7A7A\u4E00\u884C\uFF0C\u7528 - \u5217\u51FA\u8981\u70B9\uFF08\u6BCF\u6761\u4E00\u884C\uFF09
- \u9075\u5FAA Conventional Commits \u98CE\u683C\u524D\u7F00\u53EF\u9009\uFF1Afeat/fix/docs/chore/refactor \u7B49
- \u53EA\u8F93\u51FA commit message \u6B63\u6587\uFF0C\u4E0D\u8981 Markdown \u4EE3\u7801\u5757\uFF0C\u4E0D\u8981\u89E3\u91CA`;
var SYSTEM_EN = `You write Git commit messages from staged diffs.
- First line \u226472 chars, imperative mood
- Blank line then bullet list if multiple changes
- Output only the commit message, no fences or explanation`;
async function generateCommitMessage({
  baseUrl,
  model,
  diff,
  files = [],
  branch = "",
  lang = "zh",
  timeoutMs = 12e4
}) {
  const root = (baseUrl || "http://127.0.0.1:11434").replace(/\/$/, "");
  const fileList = files.slice(0, 40).join("\n");
  const diffText = String(diff || "").trim().slice(0, 14e3) || "(\u65E0 diff \u5185\u5BB9)";
  const userContent = [
    branch ? `\u5F53\u524D\u5206\u652F\uFF1A${branch}` : "",
    files.length ? `\u53D8\u66F4\u6587\u4EF6\uFF08${files.length}\uFF09\uFF1A
${fileList}` : "",
    `
\u6682\u5B58\u533A diff\uFF1A
${diffText}`,
    "\n\u8BF7\u751F\u6210 commit message\u3002"
  ].filter(Boolean).join("\n\n");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${root}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: model || "minimax-m3:cloud",
        stream: false,
        messages: [
          { role: "system", content: lang === "en" ? SYSTEM_EN : SYSTEM_ZH },
          { role: "user", content: userContent }
        ],
        options: { temperature: 0.25 }
      })
    });
    if (!res.ok) {
      const text2 = await res.text().catch(() => "");
      throw new Error(`Ollama HTTP ${res.status}: ${text2.slice(0, 200)}`);
    }
    const data = await res.json();
    let text = String(
      data.message && data.message.content || data.response || ""
    ).trim();
    const fence = text.match(/```(?:\w*)?\s*([\s\S]*?)```/);
    if (fence) text = fence[1].trim();
    text = text.replace(/^commit message[：:]\s*/i, "").trim();
    if (!text) throw new Error("\u6A21\u578B\u8FD4\u56DE\u4E3A\u7A7A");
    return text;
  } finally {
    clearTimeout(timer);
  }
}

// src/view.js
function basename(path) {
  const i = path.lastIndexOf("/");
  return i >= 0 ? path.slice(i + 1) : path;
}
function dirname(path) {
  const i = path.lastIndexOf("/");
  return i >= 0 ? path.slice(0, i) : "";
}
var GitScmView = class extends import_obsidian.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this._summary = null;
    this._busy = false;
    this._aiBusy = false;
    this._message = "";
    this._filter = "";
    this._diffPath = null;
    this._diffStaged = false;
    this._diffText = "";
    this._collapsed = { staged: false, unstaged: false, untracked: false };
    this._compact = false;
    this._ro = null;
  }
  getViewType() {
    return VIEW_TYPE_GIT;
  }
  getDisplayText() {
    return "\u6E90\u4EE3\u7801\u7BA1\u7406";
  }
  getIcon() {
    return "git-branch";
  }
  async onOpen() {
    await this.refresh(true);
    this.plugin.registerScmView(this);
    this._ro = new ResizeObserver(() => this.updateCompact());
    this._ro.observe(this.contentEl);
  }
  async onClose() {
    this.plugin.unregisterScmView(this);
    this._ro?.disconnect();
  }
  updateCompact() {
    const compact = this.contentEl.clientWidth < 520;
    if (compact === this._compact) return;
    this._compact = compact;
    this.contentEl.toggleClass("is-compact", compact);
  }
  setBusy(busy, tip = "") {
    this._busy = busy;
    const el = this.contentEl.querySelector(".cg-busy");
    if (el) {
      el.toggleClass("is-on", busy);
      el.setText(tip || (busy ? "\u5904\u7406\u4E2D\u2026" : ""));
    }
  }
  async refresh(silent = false) {
    if (this._busy && !silent) return;
    try {
      if (!silent) this.setBusy(true, "\u5237\u65B0\u4E2D\u2026");
      this._summary = await getRepoSummary(this.app);
      if (this._diffPath) {
        try {
          this._diffText = await getDiff(this.app, this._diffPath, {
            staged: this._diffStaged
          });
        } catch {
          this._diffText = "";
        }
      }
      this.render();
      this.updateCompact();
    } catch (err) {
      if (!silent) new import_obsidian.Notice(`Git \u5237\u65B0\u5931\u8D25\uFF1A${err.message}`);
      this._summary = { isRepo: false, error: err.message };
      this.render();
    } finally {
      this.setBusy(false);
    }
  }
  async run(label, fn) {
    if (this._busy) return;
    this.setBusy(true, label);
    try {
      await fn();
      await this.refresh(true);
    } catch (err) {
      new import_obsidian.Notice(`${label}\u5931\u8D25\uFF1A${err.message}`);
      console.error(err);
      this.render();
    } finally {
      this.setBusy(false);
    }
  }
  render() {
    const root = this.contentEl;
    root.empty();
    root.addClass("cg-root");
    root.toggleClass("is-compact", this._compact);
    root.createDiv({ cls: "cg-busy" });
    const s = this._summary;
    if (!s) {
      root.createDiv({ cls: "cg-empty", text: "\u52A0\u8F7D\u4E2D\u2026" });
      return;
    }
    if (s.error && !s.isRepo) {
      root.createDiv({ cls: "cg-empty", text: s.error });
      return;
    }
    if (!s.isRepo) {
      this.renderNoRepo(root);
      return;
    }
    const top = root.createDiv({ cls: "cg-top" });
    this.renderHeader(top, s);
    this.renderCommitBox(top, s);
    this.renderToolbar(top, s);
    const body = root.createDiv({ cls: "cg-body" });
    const changes = body.createDiv({ cls: "cg-changes" });
    this.renderSections(changes, s);
    const diffPane = body.createDiv({ cls: "cg-diff-pane" });
    this.renderDiffPane(diffPane);
  }
  renderNoRepo(root) {
    const box = root.createDiv({ cls: "cg-empty-box" });
    box.createEl("h2", { text: "\u5C1A\u672A\u521D\u59CB\u5316 Git" });
    box.createEl("p", { text: "\u5728\u6B64\u77E5\u8BC6\u5E93\u76EE\u5F55\u6267\u884C git init\uFF0C\u5373\u53EF\u5F00\u59CB\u7248\u672C\u7BA1\u7406\u3002" });
    box.createEl("button", { cls: "mod-cta", text: "\u521D\u59CB\u5316\u4ED3\u5E93" }).onclick = () => this.run("\u521D\u59CB\u5316", async () => {
      await initRepo(this.app);
      new import_obsidian.Notice("\u5DF2 git init");
    });
  }
  renderHeader(root, s) {
    const head = root.createDiv({ cls: "cg-header" });
    const brand = head.createDiv({ cls: "cg-brand" });
    brand.createSpan({ cls: "cg-brand-icon", text: "\u2387" });
    const col = brand.createDiv({ cls: "cg-brand-col" });
    col.createDiv({ cls: "cg-branch-name", text: s.branch });
    const sub = col.createDiv({ cls: "cg-branch-sub" });
    if (s.upstream) sub.setText(s.upstream);
    else sub.addClass("cg-muted").setText("\u672A\u8BBE\u7F6E\u4E0A\u6E38");
    const pills = head.createDiv({ cls: "cg-pills" });
    if (s.ahead > 0) pills.createSpan({ cls: "cg-pill cg-pill-ahead", text: `\u2191 ${s.ahead}` });
    if (s.behind > 0) pills.createSpan({ cls: "cg-pill cg-pill-behind", text: `\u2193 ${s.behind}` });
    if (s.upstream && !s.ahead && !s.behind) {
      pills.createSpan({ cls: "cg-pill cg-pill-ok", text: "\u5DF2\u540C\u6B65" });
    }
    const actions = head.createDiv({ cls: "cg-header-actions" });
    actions.createEl("button", {
      cls: "cg-icon-btn",
      attr: { title: "\u5237\u65B0", "aria-label": "\u5237\u65B0" },
      text: "\u21BB"
    }).onclick = () => this.refresh();
  }
  renderCommitBox(root, s) {
    const box = root.createDiv({ cls: "cg-commit" });
    const head = box.createDiv({ cls: "cg-commit-head" });
    head.createSpan({ cls: "cg-commit-label", text: "\u63D0\u4EA4\u6D88\u606F" });
    const aiBtn = head.createEl("button", {
      cls: "cg-ai-btn",
      text: this._aiBusy ? "\u751F\u6210\u4E2D\u2026" : "\u2728 AI \u751F\u6210",
      attr: { title: "\u6839\u636E\u6682\u5B58\u533A diff \u8C03\u7528 Ollama \u751F\u6210" }
    });
    aiBtn.disabled = this._aiBusy || this._busy;
    aiBtn.onclick = () => this.generateAiMessage();
    const ta = box.createEl("textarea", {
      cls: "cg-message",
      attr: {
        placeholder: "\u63CF\u8FF0\u672C\u6B21\u66F4\u6539\u2026  Ctrl/\u2318+Enter \u63D0\u4EA4",
        rows: "3"
      }
    });
    ta.value = this._message;
    ta.addEventListener("input", () => {
      this._message = ta.value;
    });
    ta.addEventListener("keydown", (ev) => {
      if ((ev.metaKey || ev.ctrlKey) && ev.key === "Enter") {
        ev.preventDefault();
        this.doCommit();
      }
    });
    this._messageEl = ta;
    const row = box.createDiv({ cls: "cg-commit-actions" });
    const count = s.staged?.length || 0;
    const commitBtn = row.createEl("button", {
      cls: "mod-cta",
      text: count ? `\u63D0\u4EA4 \xB7 ${count}` : "\u63D0\u4EA4"
    });
    commitBtn.disabled = !count;
    commitBtn.onclick = () => this.doCommit();
    const pushBtn = row.createEl("button", {
      cls: "cg-btn-secondary",
      text: "\u63D0\u4EA4\u5E76\u63A8\u9001"
    });
    pushBtn.disabled = !count;
    pushBtn.onclick = () => this.doCommit(true);
  }
  async generateAiMessage() {
    if (this._aiBusy || this._busy) return;
    const s = this._summary;
    const staged = s?.staged || [];
    const files = staged.length ? staged.map((f) => f.path) : [...s?.unstaged || [], ...s?.untracked || []].map((f) => f.path);
    if (!files.length) {
      new import_obsidian.Notice("\u6CA1\u6709\u53EF\u5206\u6790\u7684\u53D8\u66F4");
      return;
    }
    this._aiBusy = true;
    this.render();
    try {
      const diff = await getStagedDiffAll(this.app);
      const cfg = this.plugin.settings;
      const message = await generateCommitMessage({
        baseUrl: cfg.ollamaBaseUrl,
        model: cfg.ollamaModel,
        diff,
        files,
        branch: s?.branch,
        lang: cfg.commitMessageLang || "zh",
        timeoutMs: cfg.ollamaTimeoutMs || 12e4
      });
      this._message = message;
      new import_obsidian.Notice("\u5DF2\u751F\u6210 commit message");
      this.render();
      this._messageEl?.focus();
    } catch (err) {
      new import_obsidian.Notice(`AI \u751F\u6210\u5931\u8D25\uFF1A${err.message}`);
    } finally {
      this._aiBusy = false;
      this.render();
    }
  }
  renderToolbar(root, s) {
    const bar = root.createDiv({ cls: "cg-toolbar" });
    const mk = (label, title, fn) => {
      const b = bar.createEl("button", { cls: "cg-tool-btn", text: label, attr: { title } });
      b.onclick = fn;
      return b;
    };
    mk("\u62C9\u53D6", "git pull --rebase --autostash", () => this.run("\u62C9\u53D6", async () => {
      await pull(this.app);
      new import_obsidian.Notice("\u62C9\u53D6\u5B8C\u6210");
    }));
    mk("\u63A8\u9001", "git push", () => this.run("\u63A8\u9001", async () => {
      await push(this.app);
      new import_obsidian.Notice("\u63A8\u9001\u5B8C\u6210");
    }));
    mk("\u540C\u6B65", "fetch \u2192 pull \u2192 push", () => this.run("\u540C\u6B65", async () => {
      await fetch2(this.app);
      await pull(this.app);
      const ab = await getAheadBehind(this.app);
      if (ab.ahead > 0) await push(this.app);
      new import_obsidian.Notice("\u540C\u6B65\u5B8C\u6210");
    }));
    bar.createEl("input", {
      cls: "cg-filter",
      attr: { type: "search", placeholder: "\u7B5B\u9009\u6587\u4EF6\u2026" }
    }).addEventListener("input", (ev) => {
      this._filter = ev.target.value.trim().toLowerCase();
      this.render();
      const input = this.contentEl.querySelector(".cg-filter");
      if (input) {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      }
    });
    const filterEl = bar.querySelector(".cg-filter");
    if (filterEl) filterEl.value = this._filter;
  }
  matchFilter(path) {
    if (!this._filter) return true;
    return path.toLowerCase().includes(this._filter);
  }
  renderSections(root, s) {
    const staged = (s.staged || []).filter((f) => this.matchFilter(f.path));
    const unstaged = (s.unstaged || []).filter((f) => this.matchFilter(f.path));
    const untracked = this.plugin.settings.showUntracked ? (s.untracked || []).filter((f) => this.matchFilter(f.path)) : [];
    this.renderSection(root, {
      id: "staged",
      title: "\u5DF2\u6682\u5B58",
      files: staged,
      kind: "staged",
      empty: "\u6682\u65E0\u53EF\u63D0\u4EA4\u6587\u4EF6",
      actions: staged.length ? [{
        label: "\u5168\u90E8\u53D6\u6D88\u6682\u5B58",
        run: () => this.run("\u53D6\u6D88\u6682\u5B58", async () => {
          await unstagePaths(this.app, staged.map((f) => f.path));
        })
      }] : []
    });
    this.renderSection(root, {
      id: "unstaged",
      title: "\u66F4\u6539",
      files: unstaged,
      kind: "unstaged",
      empty: "\u5DE5\u4F5C\u533A\u5E72\u51C0",
      actions: unstaged.length ? [
        {
          label: "\u5168\u90E8\u6682\u5B58",
          run: () => this.run("\u6682\u5B58", async () => {
            await stagePaths(this.app, unstaged.map((f) => f.path));
          })
        },
        {
          label: "\u5168\u90E8\u4E22\u5F03",
          danger: true,
          run: () => this.confirmDiscard(unstaged.map((f) => f.path))
        }
      ] : []
    });
    this.renderSection(root, {
      id: "untracked",
      title: "\u672A\u8DDF\u8E2A",
      files: untracked,
      kind: "untracked",
      empty: "\u65E0\u672A\u8DDF\u8E2A\u6587\u4EF6",
      actions: untracked.length ? [
        {
          label: "\u5168\u90E8\u6682\u5B58",
          run: () => this.run("\u6682\u5B58", async () => {
            await stagePaths(this.app, untracked.map((f) => f.path));
          })
        },
        {
          label: "\u5168\u90E8\u5220\u9664",
          danger: true,
          run: () => this.confirmDiscard(untracked.map((f) => f.path), true)
        }
      ] : []
    });
  }
  renderSection(root, { id, title, files, kind, empty, actions }) {
    const collapsed = this._collapsed[id];
    const sec = root.createDiv({ cls: `cg-section cg-section-${kind}` });
    if (collapsed) sec.addClass("is-collapsed");
    const head = sec.createDiv({ cls: "cg-section-head" });
    head.createSpan({ cls: "cg-chevron", text: collapsed ? "\u25B8" : "\u25BE" });
    head.createSpan({ cls: "cg-section-title", text: title });
    head.createSpan({ cls: "cg-section-count", text: String(files.length) });
    head.onclick = () => {
      this._collapsed[id] = !this._collapsed[id];
      this.render();
    };
    const acts = head.createDiv({ cls: "cg-section-actions" });
    for (const a of actions) {
      const b = acts.createEl("button", {
        cls: a.danger ? "cg-link-btn is-danger" : "cg-link-btn",
        text: a.label
      });
      b.onclick = (ev) => {
        ev.stopPropagation();
        a.run();
      };
    }
    if (collapsed) return;
    if (!files.length) {
      sec.createDiv({ cls: "cg-section-empty", text: empty });
      return;
    }
    const list = sec.createDiv({ cls: "cg-file-list" });
    for (const file of files) {
      this.renderFileRow(list, file, kind);
    }
  }
  renderFileRow(list, file, kind) {
    const active = this._diffPath === file.path && this._diffStaged === (kind === "staged");
    const row = list.createDiv({ cls: "cg-file" });
    if (active) row.addClass("is-active");
    row.createSpan({
      cls: `cg-badge cg-badge-${(file.label || "?").toLowerCase()}`,
      text: file.label || "?"
    });
    const textCol = row.createDiv({ cls: "cg-file-text" });
    textCol.createDiv({ cls: "cg-file-base", text: basename(file.path) });
    const dir = dirname(file.path);
    if (dir) textCol.createDiv({ cls: "cg-file-dir", text: dir });
    row.onclick = async (ev) => {
      if (ev.target.closest(".cg-file-ops")) return;
      if (ev.metaKey || ev.ctrlKey) {
        await this.openFile(file.path);
        return;
      }
      await this.showDiff(file.path, kind === "staged");
    };
    const ops = row.createDiv({ cls: "cg-file-ops" });
    if (kind === "staged") {
      ops.createEl("button", { cls: "cg-mini-btn", text: "\u2212", attr: { title: "\u53D6\u6D88\u6682\u5B58" } }).onclick = (ev) => {
        ev.stopPropagation();
        this.run("\u53D6\u6D88\u6682\u5B58", async () => {
          await unstagePaths(this.app, [file.path]);
        });
      };
    } else {
      ops.createEl("button", { cls: "cg-mini-btn", text: "+", attr: { title: "\u6682\u5B58" } }).onclick = (ev) => {
        ev.stopPropagation();
        this.run("\u6682\u5B58", async () => {
          await stagePaths(this.app, [file.path]);
        });
      };
      ops.createEl("button", {
        cls: "cg-mini-btn is-danger",
        text: "\u21BA",
        attr: { title: kind === "untracked" ? "\u5220\u9664" : "\u4E22\u5F03" }
      }).onclick = (ev) => {
        ev.stopPropagation();
        this.confirmDiscard([file.path], kind === "untracked");
      };
    }
    ops.createEl("button", { cls: "cg-mini-btn", text: "\u2197", attr: { title: "\u6253\u5F00\u6587\u4EF6" } }).onclick = (ev) => {
      ev.stopPropagation();
      this.openFile(file.path);
    };
  }
  async showDiff(path, staged) {
    this._diffPath = path;
    this._diffStaged = staged;
    try {
      this._diffText = await getDiff(this.app, path, { staged });
    } catch (err) {
      this._diffText = `// \u65E0\u6CD5\u8BFB\u53D6 diff\uFF1A${err.message}`;
    }
    this.render();
  }
  renderDiffPane(root) {
    const head = root.createDiv({ cls: "cg-diff-head" });
    if (this._diffPath) {
      head.createSpan({
        cls: "cg-diff-title",
        text: `${this._diffStaged ? "\u6682\u5B58\u533A" : "\u5DE5\u4F5C\u533A"} \xB7 ${this._diffPath}`
      });
      head.createEl("button", { cls: "cg-link-btn", text: "\u5173\u95ED" }).onclick = () => {
        this._diffPath = null;
        this._diffText = "";
        this.render();
      };
    } else {
      head.createSpan({ cls: "cg-diff-title cg-muted", text: "\u5DEE\u5F02\u9884\u89C8" });
    }
    const body = root.createDiv({ cls: "cg-diff-body" });
    if (!this._diffPath) {
      body.createDiv({
        cls: "cg-diff-placeholder",
        text: "\u70B9\u51FB\u5DE6\u4FA7\u6587\u4EF6\u67E5\u770B diff\n\u2318/Ctrl+\u70B9\u51FB \u5728\u7F16\u8F91\u5668\u4E2D\u6253\u5F00"
      });
      return;
    }
    const text = this._diffText || "(\u65E0\u5DEE\u5F02)";
    for (const line of text.split("\n").slice(0, 1200)) {
      const ln = body.createDiv({ cls: "cg-diff-line" });
      if (line.startsWith("+") && !line.startsWith("+++")) ln.addClass("is-add");
      else if (line.startsWith("-") && !line.startsWith("---")) ln.addClass("is-del");
      else if (line.startsWith("@@")) ln.addClass("is-hunk");
      ln.setText(line || " ");
    }
  }
  async openFile(path) {
    const file = this.app.vault.getAbstractFileByPath(path);
    if (!file) {
      new import_obsidian.Notice(`\u627E\u4E0D\u5230\uFF1A${path}`);
      return;
    }
    const leaf = this.app.workspace.getLeaf(false);
    await leaf.openFile(file);
  }
  confirmDiscard(paths, isDelete = false) {
    if (!paths?.length) return;
    new ConfirmModal(
      this.app,
      isDelete ? "\u5220\u9664\u672A\u8DDF\u8E2A\u6587\u4EF6\uFF1F" : "\u4E22\u5F03\u66F4\u6539\uFF1F",
      isDelete ? `\u5C06\u6C38\u4E45\u5220\u9664 ${paths.length} \u9879\uFF0C\u65E0\u6CD5\u6062\u590D\u3002` : `\u5C06\u4E22\u5F03 ${paths.length} \u4E2A\u6587\u4EF6\u7684\u672A\u63D0\u4EA4\u4FEE\u6539\u3002`,
      () => this.run(isDelete ? "\u5220\u9664" : "\u4E22\u5F03", async () => {
        await discardPaths(this.app, paths);
        new import_obsidian.Notice(isDelete ? "\u5DF2\u5220\u9664" : "\u5DF2\u4E22\u5F03");
      })
    ).open();
  }
  async doCommit(alsoPush = false) {
    const staged = this._summary?.staged || [];
    if (!staged.length) {
      new import_obsidian.Notice("\u8BF7\u5148\u6682\u5B58\u6587\u4EF6");
      return;
    }
    const message = this._message.trim();
    if (!message) {
      new import_obsidian.Notice("\u8BF7\u586B\u5199\u6216 AI \u751F\u6210\u63D0\u4EA4\u8BF4\u660E");
      return;
    }
    await this.run(alsoPush ? "\u63D0\u4EA4\u5E76\u63A8\u9001" : "\u63D0\u4EA4", async () => {
      await commit(this.app, message);
      this._message = "";
      new import_obsidian.Notice("\u63D0\u4EA4\u6210\u529F");
      if (alsoPush || this.plugin.settings.pushAfterCommit) {
        await push(this.app);
        new import_obsidian.Notice("\u5DF2\u63A8\u9001");
      }
    });
  }
};
var ConfirmModal = class extends import_obsidian.Modal {
  constructor(app, title, body, onConfirm) {
    super(app);
    this._title = title;
    this._body = body;
    this._onConfirm = onConfirm;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h3", { text: this._title });
    contentEl.createEl("p", { text: this._body });
    const row = contentEl.createDiv({ cls: "cg-modal-actions" });
    row.createEl("button", { text: "\u53D6\u6D88" }).onclick = () => this.close();
    row.createEl("button", { cls: "mod-warning", text: "\u786E\u8BA4" }).onclick = async () => {
      this.close();
      await this._onConfirm();
    };
  }
};
var GitSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Cetide Git" });
    new import_obsidian.Setting(containerEl).setName("\u9762\u677F\u4F4D\u7F6E").setDesc("\u70B9\u51FB\u4E1D\u5E26\u56FE\u6807\u65F6\u6253\u5F00\u7684\u4F4D\u7F6E\uFF1B\u4E3B\u533A\u57DF\u4E3A VS Code \u5F0F\u5168\u9875").addDropdown((dd) => {
      dd.addOption("main", "\u4E3B\u533A\u57DF\uFF08\u6807\u7B7E\u9875\uFF09");
      dd.addOption("left", "\u5DE6\u4FA7\u680F");
      dd.addOption("right", "\u53F3\u4FA7\u680F");
      dd.setValue(this.plugin.settings.panelPlacement || "main");
      dd.onChange(async (v) => {
        this.plugin.settings.panelPlacement = v;
        await this.plugin.saveSettings();
      });
    });
    new import_obsidian.Setting(containerEl).setName("\u81EA\u52A8\u5237\u65B0\u95F4\u9694\uFF08\u6BEB\u79D2\uFF09").setDesc("0 = \u5173\u95ED").addText((text) => {
      text.setValue(String(this.plugin.settings.autoRefreshMs ?? 4e3));
      text.onChange(async (v) => {
        const n = Number(v);
        this.plugin.settings.autoRefreshMs = Number.isFinite(n) ? Math.max(0, n) : 4e3;
        await this.plugin.saveSettings();
        this.plugin.restartAutoRefresh();
      });
    });
    new import_obsidian.Setting(containerEl).setName("\u663E\u793A\u672A\u8DDF\u8E2A\u6587\u4EF6").addToggle((toggle) => {
      toggle.setValue(this.plugin.settings.showUntracked !== false);
      toggle.onChange(async (v) => {
        this.plugin.settings.showUntracked = v;
        await this.plugin.saveSettings();
        this.plugin.refreshViews();
      });
    });
    new import_obsidian.Setting(containerEl).setName("\u63D0\u4EA4\u540E\u81EA\u52A8\u63A8\u9001").addToggle((toggle) => {
      toggle.setValue(!!this.plugin.settings.pushAfterCommit);
      toggle.onChange(async (v) => {
        this.plugin.settings.pushAfterCommit = v;
        await this.plugin.saveSettings();
      });
    });
    containerEl.createEl("h3", { text: "Ollama \xB7 Commit \u751F\u6210" });
    new import_obsidian.Setting(containerEl).setName("Ollama Base URL").addText((t) => {
      t.setValue(this.plugin.settings.ollamaBaseUrl || "http://127.0.0.1:11434");
      t.onChange(async (v) => {
        this.plugin.settings.ollamaBaseUrl = v.trim();
        await this.plugin.saveSettings();
      });
    });
    new import_obsidian.Setting(containerEl).setName("\u6A21\u578B").addText((t) => {
      t.setValue(this.plugin.settings.ollamaModel || "minimax-m3:cloud");
      t.onChange(async (v) => {
        this.plugin.settings.ollamaModel = v.trim();
        await this.plugin.saveSettings();
      });
    });
    new import_obsidian.Setting(containerEl).setName("\u8D85\u65F6\uFF08\u6BEB\u79D2\uFF09").addText((t) => {
      t.setValue(String(this.plugin.settings.ollamaTimeoutMs || 12e4));
      t.onChange(async (v) => {
        const n = Number(v);
        if (Number.isFinite(n) && n > 0) {
          this.plugin.settings.ollamaTimeoutMs = n;
          await this.plugin.saveSettings();
        }
      });
    });
    new import_obsidian.Setting(containerEl).setName("Commit \u8BED\u8A00").addDropdown((dd) => {
      dd.addOption("zh", "\u4E2D\u6587");
      dd.addOption("en", "English");
      dd.setValue(this.plugin.settings.commitMessageLang || "zh");
      dd.onChange(async (v) => {
        this.plugin.settings.commitMessageLang = v;
        await this.plugin.saveSettings();
      });
    });
  }
};

// src/main.js
var CetideGitPlugin = class extends import_obsidian2.Plugin {
  async onload() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() || {});
    this._scmViews = /* @__PURE__ */ new Set();
    this._timer = null;
    this.registerView(VIEW_TYPE_GIT, (leaf) => new GitScmView(leaf, this));
    this.addRibbonIcon("git-branch", "\u6E90\u4EE3\u7801\u7BA1\u7406", () => this.activateView());
    this.addCommand({
      id: "open-scm",
      name: "\u6253\u5F00\u6E90\u4EE3\u7801\u7BA1\u7406\uFF08\u4E3B\u533A\u57DF\uFF09",
      callback: () => this.activateView("main")
    });
    this.addCommand({
      id: "open-scm-left",
      name: "\u6253\u5F00\u6E90\u4EE3\u7801\u7BA1\u7406\uFF08\u5DE6\u4FA7\u680F\uFF09",
      callback: () => this.activateView("left")
    });
    this.addCommand({
      id: "refresh-scm",
      name: "\u5237\u65B0 Git \u72B6\u6001",
      callback: () => this.refreshViews()
    });
    this.addSettingTab(new GitSettingTab(this.app, this));
    this.registerEvent(this.app.vault.on("modify", () => this.scheduleRefresh()));
    this.registerEvent(this.app.vault.on("create", () => this.scheduleRefresh()));
    this.registerEvent(this.app.vault.on("delete", () => this.scheduleRefresh()));
    this.registerEvent(this.app.vault.on("rename", () => this.scheduleRefresh()));
    this.app.workspace.onLayoutReady(() => {
      this.restartAutoRefresh();
    });
  }
  onunload() {
    this.clearAutoRefresh();
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_GIT);
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
  registerScmView(view) {
    this._scmViews.add(view);
  }
  unregisterScmView(view) {
    this._scmViews.delete(view);
  }
  scheduleRefresh() {
    if (this._debounce) window.clearTimeout(this._debounce);
    this._debounce = window.setTimeout(() => this.refreshViews(true), 800);
  }
  refreshViews(silent = false) {
    for (const view of this._scmViews) {
      view.refresh(silent);
    }
  }
  restartAutoRefresh() {
    this.clearAutoRefresh();
    const ms = Number(this.settings.autoRefreshMs) || 0;
    if (ms <= 0) return;
    this._timer = window.setInterval(() => this.refreshViews(true), ms);
  }
  clearAutoRefresh() {
    if (this._timer) {
      window.clearInterval(this._timer);
      this._timer = null;
    }
  }
  /**
   * @param {'main'|'left'|'right'|undefined} placement
   */
  async activateView(placement) {
    const mode = placement || this.settings.panelPlacement || "main";
    const { workspace } = this.app;
    const existing = workspace.getLeavesOfType(VIEW_TYPE_GIT);
    if (existing.length > 1) {
      for (let i = 1; i < existing.length; i++) {
        existing[i].detach();
      }
    }
    let leaf = existing[0];
    if (!leaf) {
      if (mode === "left") {
        await workspace.getLeftLeaf(false).setViewState({
          type: VIEW_TYPE_GIT,
          active: true
        });
        leaf = workspace.getLeavesOfType(VIEW_TYPE_GIT)[0];
      } else if (mode === "right") {
        await workspace.getRightLeaf(false).setViewState({
          type: VIEW_TYPE_GIT,
          active: true
        });
        leaf = workspace.getLeavesOfType(VIEW_TYPE_GIT)[0];
      } else {
        leaf = workspace.getLeaf("tab");
        await leaf.setViewState({ type: VIEW_TYPE_GIT, active: true });
      }
    }
    workspace.revealLeaf(leaf);
  }
};
if(module.exports.default) module.exports = module.exports.default;
