#!/usr/bin/env node
/**
 * 把阅读器 + 仓库 Markdown/图片打成静态站，部署后不再请求 GitHub API。
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

const WEB_COPY = ["index.html", "app.js", "config.js", "styles.css"];

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

rmrf(OUT);
ensureDir(OUT);
ensureDir(CONTENT);

for (const file of WEB_COPY) {
  copyFile(path.join(__dirname, file), path.join(OUT, file));
}

const files = walk(ROOT).sort((a, b) => a.localeCompare(b, "zh"));
const mdPaths = files.filter((f) => f.toLowerCase().endsWith(".md"));

for (const rel of files) {
  copyFile(path.join(ROOT, rel), path.join(CONTENT, rel));
}

const manifest = {
  generatedAt: new Date().toISOString(),
  branch: "main",
  count: mdPaths.length,
  paths: mdPaths,
};

fs.writeFileSync(
  path.join(OUT, "manifest.json"),
  JSON.stringify(manifest, null, 2) + "\n",
  "utf8"
);

// 方便本地直接 serve web/ 时也能读到目录（不含正文副本）
fs.writeFileSync(
  path.join(__dirname, "manifest.json"),
  JSON.stringify(manifest, null, 2) + "\n",
  "utf8"
);

console.log(
  `[web/build] ${mdPaths.length} md + ${files.length - mdPaths.length} assets → ${path.relative(ROOT, OUT)}`
);
