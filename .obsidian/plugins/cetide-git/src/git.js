/** Electron/Node helpers for Obsidian desktop plugins. */

function nodeRequire (id) {
  // Obsidian desktop exposes Electron's require
  const req = (typeof window !== "undefined" && window.require)
    || (typeof require !== "undefined" ? require : null)
  if (!req) throw new Error("当前环境不支持 Node（请使用桌面版 Obsidian）")
  return req(id)
}

function vaultPath (app) {
  const adapter = app?.vault?.adapter
  if (!adapter?.basePath) throw new Error("无法获取库路径")
  return adapter.basePath
}

/**
 * @param {import('obsidian').App} app
 * @param {string[]} args
 * @param {{ timeout?: number, input?: string }} [opts]
 */
export async function git (app, args, opts = {}) {
  const { execFile } = nodeRequire("child_process")
  const nodeProcess = nodeRequire("process")
  const cwd = vaultPath(app)
  const timeout = opts.timeout ?? 60000

  return new Promise((resolve, reject) => {
    const child = execFile(
      "git",
      args,
      {
        cwd,
        timeout,
        maxBuffer: 8 * 1024 * 1024,
        env: {
          ...(nodeProcess.env || {}),
          LANG: "en_US.UTF-8",
          GIT_TERMINAL_PROMPT: "0",
        },
        encoding: "utf8",
      },
      (err, stdout, stderr) => {
        if (err) {
          const msg = String(stderr || err.message || err).trim()
          const e = new Error(msg || `git ${args.join(" ")} failed`)
          e.code = err.code
          e.stdout = stdout
          e.stderr = stderr
          reject(e)
          return
        }
        resolve({ stdout: String(stdout || ""), stderr: String(stderr || "") })
      }
    )
    if (opts.input != null && child.stdin) {
      child.stdin.end(opts.input)
    }
  })
}

export async function isGitRepo (app) {
  try {
    const { stdout } = await git(app, ["rev-parse", "--is-inside-work-tree"])
    return stdout.trim() === "true"
  } catch {
    return false
  }
}

export async function getBranch (app) {
  try {
    const { stdout } = await git(app, ["branch", "--show-current"])
    const name = stdout.trim()
    if (name) return name
  } catch { /* detached */ }
  try {
    const { stdout } = await git(app, ["rev-parse", "--short", "HEAD"])
    return `HEAD (${stdout.trim()})`
  } catch {
    return "—"
  }
}

export async function getUpstream (app) {
  try {
    const { stdout } = await git(app, [
      "rev-parse",
      "--abbrev-ref",
      "--symbolic-full-name",
      "@{u}",
    ])
    return stdout.trim() || null
  } catch {
    return null
  }
}

export async function getAheadBehind (app) {
  try {
    const { stdout } = await git(app, [
      "rev-list",
      "--left-right",
      "--count",
      "HEAD...@{u}",
    ])
    const [ahead, behind] = stdout.trim().split(/\s+/).map((n) => Number(n) || 0)
    return { ahead, behind }
  } catch {
    return { ahead: 0, behind: 0 }
  }
}

/**
 * Parse `git status --porcelain=v1 -uall -z` into file entries.
 * @returns {Promise<{ staged: GitFile[], unstaged: GitFile[], untracked: GitFile[] }>}
 */
export async function getStatus (app) {
  const { stdout } = await git(app, ["status", "--porcelain=v1", "-uall", "-z"])
  const staged = []
  const unstaged = []
  const untracked = []

  const parts = stdout.split("\0").filter(Boolean)
  for (let i = 0; i < parts.length; i++) {
    const entry = parts[i]
    if (entry.length < 3) continue
    const x = entry[0]
    const y = entry[1]
    let path = entry.slice(3)
    let oldPath = null

    // rename/copy: next null-separated field is the old path? 
    // porcelain -z: for rename, format is `R100\0new\0old` wait no —
    // Actually: XY PATH\0 or for rename XY ORIG_PATH\0PATH\0
    // From git docs: for rename/copy, path is ORIG_PATH then NUL then PATH
    if ((x === "R" || x === "C" || y === "R" || y === "C") && i + 1 < parts.length) {
      oldPath = path
      path = parts[++i]
    }

    const file = {
      path,
      oldPath,
      x,
      y,
      statusCode: `${x}${y}`.trim(),
      label: statusLabel(x, y),
    }

    if (x === "?" && y === "?") {
      untracked.push(file)
      continue
    }

    // staged side
    if (x !== " " && x !== "?") {
      staged.push({ ...file, side: "staged", code: x, label: statusLabel(x, " ") })
    }
    // worktree side
    if (y !== " " && y !== "?") {
      unstaged.push({ ...file, side: "unstaged", code: y, label: statusLabel(" ", y) })
    }
  }

  return { staged, unstaged, untracked }
}

function statusLabel (x, y) {
  const code = x !== " " && x !== "?" ? x : y
  switch (code) {
    case "M": return "M"
    case "A": return "A"
    case "D": return "D"
    case "R": return "R"
    case "C": return "C"
    case "U": return "U"
    case "?": return "U"
    case "!": return "!"
    default: return code || "?"
  }
}

export async function stagePaths (app, paths) {
  if (!paths?.length) return
  await git(app, ["add", "--", ...paths])
}

export async function unstagePaths (app, paths) {
  if (!paths?.length) return
  // restore --staged works on modern git; fallback to reset HEAD
  try {
    await git(app, ["restore", "--staged", "--", ...paths])
  } catch {
    await git(app, ["reset", "HEAD", "--", ...paths])
  }
}

export async function discardPaths (app, paths) {
  if (!paths?.length) return
  const tracked = []
  const untracked = []
  for (const p of paths) {
    try {
      await git(app, ["ls-files", "--error-unmatch", "--", p])
      tracked.push(p)
    } catch {
      untracked.push(p)
    }
  }
  if (tracked.length) {
    try {
      await git(app, ["restore", "--worktree", "--", ...tracked])
    } catch {
      await git(app, ["checkout", "--", ...tracked])
    }
  }
  if (untracked.length) {
    const fs = nodeRequire("fs")
    const pathMod = nodeRequire("path")
    const root = vaultPath(app)
    for (const p of untracked) {
      const full = pathMod.join(root, p)
      try {
        fs.rmSync(full, { recursive: true, force: true })
      } catch { /* ignore */ }
    }
  }
}

export async function commit (app, message) {
  const msg = String(message || "").trim()
  if (!msg) throw new Error("请填写提交说明")
  await git(app, ["commit", "-m", msg])
}

export async function pull (app) {
  return git(app, ["pull", "--rebase", "--autostash"], { timeout: 120000 })
}

export async function push (app) {
  return git(app, ["push"], { timeout: 120000 })
}

export async function fetch (app) {
  return git(app, ["fetch", "--prune"], { timeout: 120000 })
}

export async function getDiff (app, path, { staged = false } = {}) {
  const args = staged
    ? ["diff", "--cached", "--", path]
    : ["diff", "--", path]
  try {
    const { stdout } = await git(app, args)
    if (stdout.trim()) return stdout
  } catch { /* fallthrough */ }
  // untracked: show file content as added
  if (!staged) {
    try {
      const { stdout } = await git(app, ["show", `:${path}`])
      return stdout
    } catch {
      try {
        const fs = nodeRequire("fs")
        const pathMod = nodeRequire("path")
        const full = pathMod.join(vaultPath(app), path)
        const text = fs.readFileSync(full, "utf8")
        return text
          .split("\n")
          .map((line) => `+${line}`)
          .join("\n")
      } catch {
        return ""
      }
    }
  }
  return ""
}

export async function initRepo (app) {
  await git(app, ["init"])
}

export async function getStagedDiffAll (app, maxChars = 14000) {
  try {
    const { stdout } = await git(app, ["diff", "--cached", "--no-color"])
    const text = stdout.trim()
    if (text) return text.slice(0, maxChars)
  } catch { /* empty */ }

  // 无暂存时给 AI 参考工作区 diff
  try {
    const { stdout } = await git(app, ["diff", "--no-color"])
    return stdout.trim().slice(0, maxChars)
  } catch {
    return ""
  }
}

export async function getRepoSummary (app) {
  const ok = await isGitRepo(app)
  if (!ok) {
    return {
      isRepo: false,
      branch: "—",
      upstream: null,
      ahead: 0,
      behind: 0,
      staged: [],
      unstaged: [],
      untracked: [],
    }
  }
  const [branch, upstream, ab, status] = await Promise.all([
    getBranch(app),
    getUpstream(app),
    getAheadBehind(app),
    getStatus(app),
  ])
  return {
    isRepo: true,
    branch,
    upstream,
    ahead: ab.ahead,
    behind: ab.behind,
    ...status,
  }
}
