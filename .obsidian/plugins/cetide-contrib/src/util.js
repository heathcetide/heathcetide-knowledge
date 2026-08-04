/** Date / path / text helpers */

export function todayKey (d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseDateKey (key) {
  const [y, m, d] = String(key).split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDaysKey (key, delta) {
  const d = parseDateKey(key);
  d.setDate(d.getDate() + delta);
  return todayKey(d);
}

export function isMarkdownPath (path) {
  return /\.md$/i.test(path || "");
}

/**
 * @param {string} path
 * @param {string[]} prefixes
 */
export function shouldIgnore (path, prefixes = []) {
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

/** Top-level folder label for a vault path */
export function topFolder (path) {
  const p = String(path || "").replace(/\\/g, "/");
  const i = p.indexOf("/");
  if (i < 0) return "(根目录)";
  return p.slice(0, i);
}

/**
 * Count Chinese-friendly "字数"：去掉空白后的字符数；另返回英文单词约数。
 * @param {string} text
 * @returns {{ chars: number, words: number, rawLen: number }}
 */
export function countText (text) {
  const s = String(text ?? "");
  const noWs = s.replace(/\s+/g, "");
  const chars = noWs.length;
  const words = (s.match(/[A-Za-z0-9]+(?:'[A-Za-z0-9]+)?/g) || []).length;
  return { chars, words, rawLen: s.length };
}

export function formatNum (n) {
  const x = Number(n) || 0;
  if (x >= 10000) {
    const w = x / 10000;
    return `${w >= 100 ? Math.round(w) : w.toFixed(1).replace(/\.0$/, "")}万`;
  }
  return String(Math.round(x));
}

export function emptyDay () {
  return {
    edits: 0,
    creates: 0,
    deletes: 0,
    charsDelta: 0,
    gitTouches: 0,
    gitCommits: 0,
    gitInsertions: 0,
    gitDeletions: 0,
    files: {},
  };
}
