#!/usr/bin/env node
/**
 * 把阅读器 + 仓库 Markdown/图片打成静态站，并生成知识图谱 graph.json。
 * 用法（仓库根目录）: node web/build.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "_site");
const CONTENT = path.join(OUT, "content");

const IGNORE_PREFIXES = [
  ".obsidian/",
  "web/",
  ".bagu/",
  ".github/",
  "_site/",
  "node_modules/",
];

const ASSET_EXT = new Set([
  ".md",
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".svg",
  ".pdf",
]);

const WEB_COPY = [
  "index.html",
  "app.js",
  "config.js",
  "styles.css",
  "graph.js",
];

function shouldIgnore(relPosix) {
  return IGNORE_PREFIXES.some(
    (p) => relPosix === p.slice(0, -1) || relPosix.startsWith(p)
  );
}

function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name === ".git" || name === "node_modules") continue;
    const abs = path.join(dir, name);
    const rel = path.relative(ROOT, abs).split(path.sep).join("/");
    if (shouldIgnore(rel)) continue;
    const st = fs.statSync(abs);
    if (st.isDirectory()) walk(abs, acc);
    else if (ASSET_EXT.has(path.extname(name).toLowerCase())) acc.push(rel);
  }
  return acc;
}

function rmrf(p) {
  fs.rmSync(p, { recursive: true, force: true });
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function stripExt(p) {
  return p.replace(/\.md$/i, "");
}

function basenameNoExt(p) {
  return path.posix.basename(stripExt(p));
}

/** @param {string[]} mdPaths */
function buildResolver(mdPaths) {
  const byExact = new Map();
  const byBase = new Map();
  for (const p of mdPaths) {
    byExact.set(p, p);
    byExact.set(stripExt(p), p);
    const base = basenameNoExt(p);
    if (!byBase.has(base)) byBase.set(base, []);
    byBase.get(base).push(p);
  }

  /**
   * @param {string} target raw wiki / relative target (no #)
   * @param {string} fromPath
   */
  function resolve(target, fromPath) {
    let t = target.trim().replace(/\\/g, "/");
    if (!t) return null;
    t = t.replace(/\.md$/i, "");
    if (t.startsWith("/")) t = t.slice(1);

    if (byExact.has(t)) return byExact.get(t);
    if (byExact.has(t + ".md")) return byExact.get(t + ".md");

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
    if (byExact.has(joined)) return byExact.get(joined);
    if (byExact.has(joined + ".md")) return byExact.get(joined + ".md");

    const base = basenameNoExt(t);
    const hits = byBase.get(base) || [];
    if (hits.length === 1) return hits[0];
    if (hits.length > 1 && dir) {
      const sameDir = hits.filter((h) => h.startsWith(dir + "/"));
      if (sameDir.length === 1) return sameDir[0];
      const pref = hits.filter((h) => h.includes("/" + t) || h.endsWith("/" + t + ".md"));
      if (pref.length === 1) return pref[0];
    }
    return null;
  }

  return resolve;
}

function extractLinks(md) {
  const links = [];
  const wiki = /\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|[^\]]+)?\]\]/g;
  let m;
  while ((m = wiki.exec(md))) links.push(m[1].trim());

  const mdLink = /\[[^\]]*\]\(([^)]+)\)/g;
  while ((m = mdLink.exec(md))) {
    let href = m[1].trim().replace(/^<|>$/g, "").split("#")[0].split("?")[0];
    if (!href || /^(https?:|mailto:|data:)/i.test(href)) continue;
    if (!/\.md$/i.test(href) && href.includes(".")) continue;
    links.push(href.replace(/^\.\//, ""));
  }
  return links;
}

function folderOf(p) {
  const i = p.indexOf("/");
  return i === -1 ? "(root)" : p.slice(0, i);
}

rmrf(OUT);
ensureDir(OUT);
ensureDir(CONTENT);

for (const file of WEB_COPY) {
  const src = path.join(__dirname, file);
  if (!fs.existsSync(src)) {
    console.warn(`[web/build] skip missing ${file}`);
    continue;
  }
  copyFile(src, path.join(OUT, file));
}

const files = walk(ROOT).sort((a, b) => a.localeCompare(b, "zh"));
const mdPaths = files.filter((f) => f.toLowerCase().endsWith(".md"));
const resolve = buildResolver(mdPaths);

for (const rel of files) {
  copyFile(path.join(ROOT, rel), path.join(CONTENT, rel));
}

const edgeSet = new Set();
const links = [];
let unresolved = 0;

for (const from of mdPaths) {
  const text = fs.readFileSync(path.join(ROOT, from), "utf8");
  for (const raw of extractLinks(text)) {
    const to = resolve(raw, from);
    if (!to || to === from) {
      if (!to) unresolved++;
      continue;
    }
    const key = from < to ? `${from}\0${to}` : `${to}\0${from}`;
    if (edgeSet.has(key)) continue;
    edgeSet.add(key);
    links.push({ source: from, target: to });
  }
}

const nodes = mdPaths.map((id) => ({
  id,
  label: basenameNoExt(id),
  folder: folderOf(id),
}));

const graph = {
  generatedAt: new Date().toISOString(),
  nodeCount: nodes.length,
  linkCount: links.length,
  unresolved,
  nodes,
  links,
};

const manifest = {
  generatedAt: new Date().toISOString(),
  branch: "main",
  count: mdPaths.length,
  paths: mdPaths,
};

for (const [name, data] of [
  ["manifest.json", manifest],
  ["graph.json", graph],
]) {
  const json = JSON.stringify(data, null, 2) + "\n";
  fs.writeFileSync(path.join(OUT, name), json, "utf8");
  fs.writeFileSync(path.join(__dirname, name), json, "utf8");
}

console.log(
  `[web/build] ${mdPaths.length} md, graph ${links.length} edges (unresolved ${unresolved}) → ${path.relative(ROOT, OUT)}`
);
