/** Git history → per-day contribution (desktop Obsidian). */

function nodeRequire (id) {
  const req =
    (typeof window !== "undefined" && window.require) ||
    (typeof require !== "undefined" ? require : null);
  if (!req) throw new Error("当前环境不支持 Node（请使用桌面版 Obsidian）");
  return req(id);
}

function vaultPath (app) {
  const adapter = app?.vault?.adapter;
  if (!adapter?.basePath) throw new Error("无法获取库路径");
  return adapter.basePath;
}

async function git (app, args, opts = {}) {
  const { execFile } = nodeRequire("child_process");
  const nodeProcess = nodeRequire("process");
  const cwd = vaultPath(app);
  const timeout = opts.timeout ?? 120000;

  return new Promise((resolve, reject) => {
    execFile(
      "git",
      args,
      {
        cwd,
        timeout,
        maxBuffer: 32 * 1024 * 1024,
        env: {
          ...(nodeProcess.env || {}),
          LANG: "en_US.UTF-8",
          GIT_TERMINAL_PROMPT: "0",
        },
        encoding: "utf8",
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

export async function isGitRepo (app) {
  try {
    const { stdout } = await git(app, ["rev-parse", "--is-inside-work-tree"]);
    return stdout.trim() === "true";
  } catch {
    return false;
  }
}

/**
 * Backfill last N days of markdown commits.
 * Uses: git log --numstat --date=short
 *
 * @returns {Record<string, {
 *   gitTouches: number,
 *   gitCommits: number,
 *   gitInsertions: number,
 *   gitDeletions: number,
 * }>}
 */
export async function loadGitDayStats (app, lookbackDays = 365, ignorePrefixes = []) {
  if (!(await isGitRepo(app))) return {};

  const since = new Date();
  since.setDate(since.getDate() - lookbackDays);
  const sinceStr = since.toISOString().slice(0, 10);

  const { stdout } = await git(app, [
    "log",
    `--since=${sinceStr}`,
    "--date=short",
    "--pretty=format:COMMIT\t%ad\t%H",
    "--numstat",
    "--",
    "*.md",
  ]);

  const days = {};
  let curDate = null;
  let curFiles = new Set();
  let curIns = 0;
  let curDel = 0;

  const flush = () => {
    if (!curDate) return;
    if (!days[curDate]) {
      days[curDate] = {
        gitTouches: 0,
        gitCommits: 0,
        gitInsertions: 0,
        gitDeletions: 0,
      };
    }
    const d = days[curDate];
    d.gitCommits += 1;
    d.gitTouches += curFiles.size;
    d.gitInsertions += curIns;
    d.gitDeletions += curDel;
    curFiles = new Set();
    curIns = 0;
    curDel = 0;
  };

  const lines = stdout.split(/\r?\n/);
  for (const line of lines) {
    if (!line) continue;
    if (line.startsWith("COMMIT\t")) {
      flush();
      const parts = line.split("\t");
      curDate = parts[1] || null;
      continue;
    }
    // numstat: additions deletions path  (binary: - - path)
    const m = line.match(/^(\d+|-)\t(\d+|-)\t(.+)$/);
    if (!m || !curDate) continue;
    let path = m[3].trim();
    // renames: old => new
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
