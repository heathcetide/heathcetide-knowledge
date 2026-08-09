import { CONFIG } from "./config.js";

const FILE_CACHE_PREFIX = `hk-file:v2:${CONFIG.owner}/${CONFIG.repo}:`;

const els = {
  tree: document.getElementById("tree"),
  reader: document.getElementById("reader"),
  searchInput: document.getElementById("searchInput"),
  fileCount: document.getElementById("fileCount"),
  refreshBtn: document.getElementById("refreshBtn"),
  menuBtn: document.getElementById("menuBtn"),
  backdrop: document.getElementById("backdrop"),
  repoLink: document.getElementById("repoLink"),
  syncHint: document.getElementById("syncHint"),
};

/** @type {string[]} */
let allPaths = [];
/** @type {string | null} */
let currentPath = null;
/** @type {string | null} */
let generatedAt = null;

function encodePath(path) {
  return path
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/");
}

/** 部署站：同域 /content；本地只开 web/ 时回退 raw（可能限流） */
function contentUrl(path) {
  return new URL(`./content/${encodePath(path)}`, location.href).href;
}

function rawUrl(path) {
  return `https://raw.githubusercontent.com/${CONFIG.owner}/${CONFIG.repo}/${CONFIG.branch}/${encodePath(path)}`;
}

function getHashPath() {
  const raw = location.hash.replace(/^#/, "");
  if (!raw) return null;
  const params = new URLSearchParams(raw.includes("=") ? raw : `path=${raw}`);
  const p = params.get("path");
  return p ? decodeURIComponent(p) : null;
}

function setHashPath(path) {
  const next = path ? `#path=${encodeURIComponent(path)}` : "";
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

/**
 * @param {string[]} paths
 * @returns {object}
 */
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

/**
 * @param {object} node
 * @param {string} prefix
 * @param {string} filter
 * @returns {HTMLElement | null}
 */
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
      `目录加载失败 (${res.status})：缺少 manifest.json。请在仓库根目录执行 node web/build.mjs 后访问 _site/，或等待 Pages 重新部署。`
    );
  }
  const json = await res.json();
  if (!Array.isArray(json.paths)) {
    throw new Error("manifest.json 格式异常");
  }
  generatedAt = json.generatedAt || null;
  return json.paths;
}

async function fetchMarkdown(path) {
  const key = FILE_CACHE_PREFIX + path;
  const cached = sessionStorage.getItem(key);
  if (cached != null) return cached;

  let res = await fetch(contentUrl(path));
  if (res.status === 404) {
    // 本地只 serve 了 web/、尚未打包 content 时的兜底
    res = await fetch(rawUrl(path));
  }
  if (!res.ok) {
    throw new Error(`正文拉取失败 (${res.status}): ${path}`);
  }
  const text = await res.text();
  sessionStorage.setItem(key, text);
  return text;
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
  const resolved = parts.join("/");
  // 优先同域 content；浏览器对 404 图片会失败，再靠部署包带上资源
  return contentUrl(resolved);
}

function renderMarkdown(md, path) {
  const html = marked.parse(md, { breaks: true });
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
    const href = a.getAttribute("href");
    if (!href) return;
    if (href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto:")) {
      if (href.startsWith("http")) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      }
      return;
    }
    let target = href.replace(/^\.\//, "").split("#")[0];
    if (!target || !target.endsWith(".md")) return;
    const dir = path.includes("/") ? path.slice(0, path.lastIndexOf("/")) : "";
    const abs = target.startsWith("/")
      ? target.slice(1)
      : dir
        ? `${dir}/${target}`
        : target;
    const parts = [];
    for (const seg of abs.split("/")) {
      if (!seg || seg === ".") continue;
      if (seg === "..") parts.pop();
      else parts.push(seg);
    }
    const resolved = parts.join("/");
    a.href = `#path=${encodeURIComponent(resolved)}`;
    a.addEventListener("click", (e) => {
      e.preventDefault();
      openFile(resolved);
    });
  });

  els.reader.replaceChildren(pathEl, body);
}

async function openFile(path) {
  currentPath = path;
  setHashPath(path);
  renderTree(els.searchInput.value);

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
  setHashPath(null);
  const when = generatedAt
    ? `<br />快照时间：<code>${generatedAt}</code>`
    : "";
  els.reader.innerHTML = `
    <p class="empty">
      从左侧选择一篇 Markdown 笔记。<br />
      内容随 Pages 部署打包（只读，不请求 GitHub API，也不写回）。${when}
    </p>
  `;
  renderTree(els.searchInput.value);
}

function clearCaches() {
  const keys = [];
  for (let i = 0; i < sessionStorage.length; i++) {
    const k = sessionStorage.key(i);
    if (k && k.startsWith(FILE_CACHE_PREFIX)) keys.push(k);
  }
  keys.forEach((k) => sessionStorage.removeItem(k));
}

async function boot() {
  els.repoLink.href = `https://github.com/${CONFIG.owner}/${CONFIG.repo}`;

  try {
    allPaths = await fetchTreePaths();
    els.fileCount.textContent = `${allPaths.length} 篇`;
    if (els.syncHint) els.syncHint.textContent = "静态快照";
    const fromHash = getHashPath();
    if (fromHash && allPaths.includes(fromHash)) {
      await openFile(fromHash);
    } else {
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
  els.reader.innerHTML = `<p class="status">重新加载本地快照…</p>`;
  const keep = currentPath;
  await boot();
  if (keep && allPaths.includes(keep)) await openFile(keep);
});

els.menuBtn.addEventListener("click", () => {
  if (document.body.classList.contains("sidebar-open")) closeSidebar();
  else openSidebar();
});

els.backdrop.addEventListener("click", closeSidebar);

window.addEventListener("hashchange", () => {
  const p = getHashPath();
  if (p && p !== currentPath) openFile(p);
  if (!p && currentPath) showWelcome();
});

boot();
