import { emptyDay, todayKey } from "./util.js";

/**
 * Persistent stats blob (via Plugin.loadData / saveData).
 *
 * Shape:
 * {
 *   version: 1,
 *   days: { "YYYY-MM-DD": DayStat },
 *   fileChars: { path: number },
 *   snapshot: { docs, chars, words, scannedAt, byFolder },
 *   gitBackfilledAt: string|null,
 * }
 */

export function emptyStore () {
  return {
    version: 1,
    days: {},
    fileChars: {},
    snapshot: {
      docs: 0,
      chars: 0,
      words: 0,
      scannedAt: null,
      byFolder: {},
    },
    gitBackfilledAt: null,
  };
}

export function ensureDay (store, key = todayKey()) {
  if (!store.days[key]) store.days[key] = emptyDay();
  const d = store.days[key];
  if (!d.files) d.files = {};
  return d;
}

export function dayIntensity (day) {
  if (!day) return 0;
  // Prefer live edit counts; fall back to git file touches
  const edits = Number(day.edits) || 0;
  if (edits > 0) return edits;
  return Number(day.gitTouches) || 0;
}

/**
 * Merge git day stats into store without wiping vault-tracked edits.
 * @param {ReturnType<typeof emptyStore>} store
 * @param {Record<string, Partial<ReturnType<typeof emptyDay>>>} gitDays
 */
export function mergeGitDays (store, gitDays) {
  for (const [key, g] of Object.entries(gitDays || {})) {
    const d = ensureDay(store, key);
    d.gitTouches = Math.max(Number(d.gitTouches) || 0, Number(g.gitTouches) || 0);
    d.gitCommits = Math.max(Number(d.gitCommits) || 0, Number(g.gitCommits) || 0);
    d.gitInsertions = Math.max(Number(d.gitInsertions) || 0, Number(g.gitInsertions) || 0);
    d.gitDeletions = Math.max(Number(d.gitDeletions) || 0, Number(g.gitDeletions) || 0);
    // If no vault edits yet, seed charsDelta from git net insertions for hover
    if (!(Number(d.edits) > 0) && !(Number(d.charsDelta) > 0)) {
      const net = (Number(g.gitInsertions) || 0) - (Number(g.gitDeletions) || 0);
      if (net) d.charsDelta = net;
    }
  }
}

/** Consecutive days ending today with intensity > 0 */
export function computeStreak (store, endKey = todayKey()) {
  let streak = 0;
  let key = endKey;
  // Walk back up to 400 days
  for (let i = 0; i < 400; i++) {
    const day = store.days[key];
    if (dayIntensity(day) > 0) {
      streak++;
      const d = new Date(key + "T12:00:00");
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

/**
 * Aggregate file edit counts across days (recent first weight optional).
 * @returns {Array<{ path: string, edits: number, creates: number }>}
 */
export function topActiveFiles (store, limit = 10) {
  const map = new Map();
  for (const day of Object.values(store.days || {})) {
    for (const [path, info] of Object.entries(day.files || {})) {
      const cur = map.get(path) || { path, edits: 0, creates: 0 };
      cur.edits += Number(info.edits) || 0;
      cur.creates += Number(info.creates) || 0;
      map.set(path, cur);
    }
  }
  return [...map.values()]
    .sort((a, b) => b.edits + b.creates * 2 - (a.edits + a.creates * 2))
    .slice(0, limit);
}

/**
 * @param {ReturnType<typeof emptyStore>} store
 * @param {number} weeks
 * @returns {Array<{ date: string, count: number, day: object|null }>}
 */
export function heatmapSeries (store, weeks = 53) {
  const out = [];
  const today = new Date();
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
