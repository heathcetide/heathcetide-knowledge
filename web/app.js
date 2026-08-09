import { CONFIG } from "./config.js";
import { KnowledgeGraph } from "./graph.js";

const FILE_CACHE_PREFIX = `hk-file:v3:${CONFIG.owner}/${CONFIG.repo}:`;

const els = {
  tree: document.getElementById("tree"),
  reader: document.getElementById("reader"),
  readerScroll: document.getElementById("readerScroll"),
  searchInput: document.getElementById("searchInput"),
  fileCount: document.getElementById("fileCount"),
  refreshBtn: document.getElementById("refreshBtn"),
  menuBtn: document.getElementById("menuBtn"),
  backdrop: document.getElementById("backdrop"),
  repoLink: document.getElementById("repoLink"),
  syncHint: document.getElementById("syncHint"),
  panelRead: document.getElementById("panelRead"),
  panelGraph: document.getElementById("panelGraph"),
  graphStage: document.getElementById("graphStage"),
  graphMeta: document.getElementById("graphMeta"),
  graphTools: document.getElementById("graphTools"),
  viewRead: document.getElementById("viewRead"),
  viewGraph: document.getElementById("viewGraph"),
  gGlobal: document.getElementById("gGlobal"),
  gLocal: document.getElementById("gLocal"),
};

/** @type {string[]} */
let allPaths = [];
/** @type {Map<string, string>} */
let exactIndex = new Map();
/** @type {Map<string, string[]>} */
let baseIndex = new Map();
/** @type {string | null} */
let currentPath = null;
/** @type {string | null} */
let generatedAt = null;
/** @type {'read' | 'graph'} */
let currentView = "read";
/** @type {KnowledgeGraph | null} */
let kg = null;

function encodePath(path) {
  return path
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/");
}

function contentUrl(path) {
  return new URL(`./content/${encodePath(path)}`, location.href).href;
}

function rawUrl(path) {
  return `https://raw.githubusercontent.com/${CONFIG.owner}/${CONFIG.repo}/${CONFIG.branch}/${encodePath(path)}`;
}

function stripExt(p) {
  return p.replace(/\.md$/i, "");
}

function basenameNoExt(p) {
  const s = stripExt(p);
  const i = s.lastIndexOf("/");
  return i === -1 ? s : s.slice(i + 1);
}

function buildIndexes(paths) {
  exactIndex = new Map();
  baseIndex = new Map();
  for (const p of paths) {
    exactIndex.set(p, p);
    exactIndex.set(stripExt(p), p);
    const base = basenameNoExt(p);
    if (!baseIndex.has(base)) baseIndex.set(base, []);
    baseIndex.get(base).push(p);
  }
}

function resolveWiki(target, fromPath) {
  let t = String(target || "")
    .trim()
    .replace(/\\/g, "/")
    .split("#")[0]
    .split("|")[0]
    .trim();
  if (!t) return null;
  t = t.replace(/\.md$/i, "");
  if (t.startsWith("/")) t = t.slice(1);

  if (exactIndex.has(t)) return exactIndex.get(t);
  if (exactIndex.has(t + ".md")) return exactIndex.get(t + ".md");

  const dir = fromPath.includes("/")
    ? fromPath.slice(0, fromPath.lastIndexOf("/"))
    : "";
  const parts = [];
  for (const seg of (dir ? `${dir}/${t}` : t).split("/")) {
    if (!seg || seg === ".") continue;
    if (seg === "..") parts.pop();
    else parts.push(seg);
  }
  const joined = parts.join("/");
  if (exactIndex.has(joined)) return exactIndex.get(joined);
  if (exactIndex.has(joined + ".md")) return exactIndex.get(joined + ".md");

  const base = basenameNoExt(t);
  const hits = baseIndex.get(base) || [];
  if (hits.length === 1) return hits[0];
  if (hits.length > 1 && dir) {
    const sameDir = hits.filter((h) => h.startsWith(dir + "/"));
    if (sameDir.length === 1) return sameDir[0];
  }
  return null;
}

function getHashState() {
  const raw = location.hash.replace(/^#/, "");
  if (!raw) return { view: "read", path: null };
  const params = new URLSearchParams(raw.includes("=") ? raw : `path=${raw}`);
  const view = params.get("view") === "graph" ? "graph" : "read";
  const path = params.get("path") ? decodeURIComponent(params.get("path")) : null;
  return { view, path };
}

function setHashState({ view = currentView, path = currentPath } = {}) {
  const params = new URLSearchParams();
  if (view === "graph") params.set("view", "graph");
  if (path) params.set("path", path);
  const next = params.toString() ? `#${params.toString()}` : "";
  if (location.hash === next) return;
  history.replaceState(null, "", next || location.pathname + location.search);
}

function closeSidebar() {
  document.body.classList.remove("sidebar-open");
  els.backdrop.hidden = true;
}

function openSidebar() {
  document.body.classList.add("sidebar-open");
  els.backdrop.hidden = false;
}

function buildTree(paths) {
  const root = { children: new Map(), files: [] };
  for (const path of paths) {
    const parts = path.split("/");
    let node = root;
    for (let i = 0; i < parts.length - 1; i++) {
      const name = parts[i];
      if (!node.children.has(name)) {
        node.children.set(name, { children: new Map(), files: [] });
      }
      node = node.children.get(name);
    }
    node.files.push(parts[parts.length - 1]);
  }
  return root;
}

function renderNode(node, prefix, filter) {
  const frag = document.createDocumentFragment();
  const q = filter.trim().toLowerCase();

  const dirNames = [...node.children.keys()].sort((a, b) =>
    a.localeCompare(b, "zh")
  );
  for (const name of dirNames) {
    const child = node.children.get(name);
    const childPrefix = prefix ? `${prefix}/${name}` : name;
    const childEl = renderNode(child, childPrefix, filter);
    if (!childEl) continue;
    const details = document.createElement("details");
    details.open = Boolean(q);
    const summary = document.createElement("summary");
    summary.textContent = name;
    details.appendChild(summary);
    details.appendChild(childEl);
    frag.appendChild(details);
  }

  const files = [...node.files].sort((a, b) => a.localeCompare(b, "zh"));
  const ul = document.createElement("ul");
  let fileHits = 0;
  for (const name of files) {
    const path = prefix ? `${prefix}/${name}` : name;
    if (q && !path.toLowerCase().includes(q)) continue;
    fileHits++;
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = `#path=${encodeURIComponent(path)}`;
    a.textContent = name.replace(/\.md$/i, "");
    a.dataset.path = path;
    if (path === currentPath) a.classList.add("active");
    a.addEventListener("click", (e) => {
      e.preventDefault();
      openFile(path);
      closeSidebar();
    });
    li.appendChild(a);
    ul.appendChild(li);
  }

  if (fileHits) frag.appendChild(ul);
  if (!frag.childNodes.length) return null;

  const wrap = document.createElement("div");
  wrap.appendChild(frag);
  return wrap;
}

function renderTree(filter = "") {
  els.tree.replaceChildren();
  const tree = buildTree(allPaths);
  const el = renderNode(tree, "", filter);
  if (!el) {
    const p = document.createElement("p");
    p.className = "empty";
    p.textContent = filter ? "没有匹配的笔记" : "仓库里没有可展示的 Markdown";
    els.tree.appendChild(p);
    return;
  }
  els.tree.appendChild(el);
}

async function fetchTreePaths() {
  const res = await fetch(new URL("./manifest.json", location.href).href, {
    cache: "no-cache",
  });
  if (!res.ok) {
    throw new Error(
      `目录加载失败 (${res.status})：请执行 node web/build.mjs 后访问 _site/`
    );
  }
  const json = await res.json();
  if (!Array.isArray(json.paths)) throw new Error("manifest.json 格式异常");
  generatedAt = json.generatedAt || null;
  return json.paths;
}

async function fetchMarkdown(path) {
  const key = FILE_CACHE_PREFIX + path;
  const cached = sessionStorage.getItem(key);
  if (cached != null) return cached;

  let res = await fetch(contentUrl(path));
  if (res.status === 404) res = await fetch(rawUrl(path));
  if (!res.ok) throw new Error(`正文拉取失败 (${res.status}): ${path}`);
  const text = await res.text();
  sessionStorage.setItem(key, text);
  return text;
}

function preprocessWikiLinks(md, fromPath) {
  return md.replace(
    /\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|([^\]]+))?\]\]/g,
    (_, target, alias) => {
      const resolved = resolveWiki(target, fromPath);
      const label = (alias || target).trim().replace(/[\[\]]/g, "");
      if (!resolved) return `[${label}](#wiki-missing)`;
      return `[${label}](#wikilink:${encodeURIComponent(resolved)})`;
    }
  );
}

function resolveAssetSrc(src, mdPath) {
  if (!src || /^(https?:|data:|\/\/)/i.test(src)) return src;
  const dir = mdPath.includes("/") ? mdPath.slice(0, mdPath.lastIndexOf("/")) : "";
  const cleaned = src.replace(/^\.\//, "");
  const joined = cleaned.startsWith("/")
    ? cleaned.slice(1)
    : dir
      ? `${dir}/${cleaned}`
      : cleaned;
  const parts = [];
  for (const seg of joined.split("/")) {
    if (!seg || seg === ".") continue;
    if (seg === "..") parts.pop();
    else parts.push(seg);
  }
  return contentUrl(parts.join("/"));
}

function renderMarkdown(md, path) {
  const prepared = preprocessWikiLinks(md, path);
  const html = marked.parse(prepared, { breaks: true });
  const pathEl = document.createElement("p");
  pathEl.className = "doc-path";
  pathEl.textContent = path;

  const body = document.createElement("div");
  body.className = "markdown-body";
  body.innerHTML = html;

  body.querySelectorAll("img").forEach((img) => {
    const src = img.getAttribute("src");
    if (src) img.setAttribute("src", resolveAssetSrc(src, path));
  });

  body.querySelectorAll("a").forEach((a) => {
    const href = a.getAttribute("href") || "";
    if (href === "#wiki-missing") {
      a.classList.add("wiki-missing");
      a.addEventListener("click", (e) => e.preventDefault());
      return;
    }
    if (href.startsWith("#wikilink:")) {
      const target = decodeURIComponent(href.slice("#wikilink:".length));
      a.href = `#path=${encodeURIComponent(target)}`;
      a.addEventListener("click", (e) => {
        e.preventDefault();
        openFile(target);
      });
      return;
    }
    if (href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto:")) {
      if (href.startsWith("http")) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      }
      return;
    }
    let target = href.replace(/^\.\//, "").split("#")[0];
    if (!target || !target.endsWith(".md")) return;
    const resolved = resolveWiki(target, path) || target;
    a.href = `#path=${encodeURIComponent(resolved)}`;
    a.addEventListener("click", (e) => {
      e.preventDefault();
      openFile(resolved);
    });
  });

  els.reader.replaceChildren(pathEl, body);
  els.readerScroll.scrollTop = 0;
}

async function openFile(path, { switchToRead = true } = {}) {
  currentPath = path;
  if (switchToRead && currentView !== "read") {
    await setView("read", { skipHash: true });
  }
  setHashState({ view: currentView, path });
  renderTree(els.searchInput.value);
  kg?.setFocus(path);

  if (currentView === "graph") {
    updateGraphMeta();
    return;
  }

  els.reader.replaceChildren();
  const status = document.createElement("p");
  status.className = "status";
  status.textContent = `加载 ${path}…`;
  els.reader.appendChild(status);

  try {
    const md = await fetchMarkdown(path);
    renderMarkdown(md, path);
  } catch (err) {
    const error = document.createElement("p");
    error.className = "error";
    error.textContent = err instanceof Error ? err.message : String(err);
    els.reader.replaceChildren(error);
  }
}

function showWelcome() {
  currentPath = null;
  setHashState({ view: currentView, path: null });
  const when = generatedAt
    ? `<br />快照：<code>${generatedAt}</code>`
    : "";
  els.reader.innerHTML = `
    <p class="empty">
      从左侧选择笔记，滚轮阅读正文。<br />
      顶栏可切换 <strong>图谱</strong>，点击节点打开笔记。${when}
    </p>
  `;
  renderTree(els.searchInput.value);
}

function clearCaches() {
  const keys = [];
  for (let i = 0; i < sessionStorage.length; i++) {
    const k = sessionStorage.key(i);
    if (k && k.startsWith("hk-file:")) keys.push(k);
  }
  keys.forEach((k) => sessionStorage.removeItem(k));
}

function updateGraphMeta() {
  if (!kg?.raw) {
    els.graphMeta.textContent = "";
    return;
  }
  const modeLabel = kg.mode === "local" ? "局部（当前笔记一跳邻居）" : "全库";
  const focus = currentPath ? basenameNoExt(currentPath) : "未选中";
  const folders = [...kg.folderColors.entries()]
    .sort((a, b) => a[0].localeCompare(b[0], "zh"))
    .slice(0, 10)
    .map(
      ([name, color]) =>
        `<span><i style="background:${color}"></i>${name}</span>`
    )
    .join("");

  els.graphMeta.innerHTML = `
    <span><strong>${kg.raw.nodeCount}</strong> 节点 · <strong>${kg.raw.linkCount}</strong> 边 · ${modeLabel}</span>
    <span>焦点：<strong>${focus}</strong></span>
    <div class="graph-legend">${folders}</div>
  `;
}

async function ensureGraph() {
  if (!kg) {
    els.graphStage.innerHTML = `<p class="status">正在构建知识图谱…</p>`;
    kg = new KnowledgeGraph(els.graphStage, {
      onOpen: (path) => openFile(path, { switchToRead: true }),
    });
    await kg.load();
  }
  if (!kg.mounted) {
    kg.mount();
    if (currentPath) kg.setFocus(currentPath);
  } else {
    // 面板刚显示时尺寸可能为 0，下一帧再量一次
    requestAnimationFrame(() => {
      kg.resize();
      kg.render();
    });
  }
  updateGraphMeta();
}

async function setView(view, { skipHash = false } = {}) {
  currentView = view === "graph" ? "graph" : "read";
  const isGraph = currentView === "graph";

  els.panelRead.classList.toggle("is-active", !isGraph);
  els.panelGraph.classList.toggle("is-active", isGraph);
  els.graphTools.hidden = !isGraph;
  els.viewRead.classList.toggle("active", !isGraph);
  els.viewGraph.classList.toggle("active", isGraph);

  if (!skipHash) setHashState({ view: currentView, path: currentPath });

  if (isGraph) {
    try {
      await ensureGraph();
      requestAnimationFrame(() => kg?.resize());
    } catch (err) {
      els.graphStage.innerHTML = `<p class="error">${
        err instanceof Error ? err.message : String(err)
      }</p>`;
      kg = null;
    }
  }
}

function setGraphMode(mode) {
  const m = mode === "local" ? "local" : "global";
  els.gGlobal.classList.toggle("active", m === "global");
  els.gLocal.classList.toggle("active", m === "local");
  if (!kg) return;
  if (m === "local" && !currentPath) {
    els.graphMeta.innerHTML =
      "<span>局部图谱需要先在左侧选中一篇笔记</span>";
    return;
  }
  kg.setMode(m);
  updateGraphMeta();
}

async function boot() {
  els.repoLink.href = `https://github.com/${CONFIG.owner}/${CONFIG.repo}`;

  try {
    allPaths = await fetchTreePaths();
    buildIndexes(allPaths);
    els.fileCount.textContent = `${allPaths.length} 篇`;
    if (els.syncHint) els.syncHint.textContent = "静态快照";

    const state = getHashState();
    if (state.path && allPaths.includes(state.path)) {
      currentPath = state.path;
    }

    if (state.view === "graph") {
      await setView("graph");
      renderTree(els.searchInput.value);
      if (currentPath) kg?.setFocus(currentPath);
    } else if (currentPath) {
      await setView("read");
      await openFile(currentPath);
    } else {
      await setView("read");
      showWelcome();
    }
  } catch (err) {
    els.fileCount.textContent = "失败";
    const error = document.createElement("p");
    error.className = "error";
    error.textContent = err instanceof Error ? err.message : String(err);
    els.reader.replaceChildren(error);
    els.tree.replaceChildren();
  }
}

els.searchInput.addEventListener("input", () => {
  renderTree(els.searchInput.value);
});

els.refreshBtn.addEventListener("click", async () => {
  clearCaches();
  els.fileCount.textContent = "刷新中…";
  if (kg) {
    kg.destroy();
    kg = null;
  }
  const keepView = currentView;
  const keep = currentPath;
  await boot();
  if (keepView === "graph") await setView("graph");
  if (keep && allPaths.includes(keep)) {
    currentPath = keep;
    kg?.setFocus(keep);
    if (currentView === "read") await openFile(keep);
  }
});

els.menuBtn.addEventListener("click", () => {
  if (document.body.classList.contains("sidebar-open")) closeSidebar();
  else openSidebar();
});
els.backdrop.addEventListener("click", closeSidebar);

els.viewRead.addEventListener("click", () => setView("read"));
els.viewGraph.addEventListener("click", () => setView("graph"));
els.gGlobal.addEventListener("click", () => setGraphMode("global"));
els.gLocal.addEventListener("click", () => setGraphMode("local"));

window.addEventListener("hashchange", async () => {
  const state = getHashState();
  if (state.view !== currentView) await setView(state.view, { skipHash: true });
  if (state.path && state.path !== currentPath) {
    await openFile(state.path, { switchToRead: state.view === "read" });
  }
  if (!state.path && currentPath && state.view === "read") showWelcome();
});

boot();
