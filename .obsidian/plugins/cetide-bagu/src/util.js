export function hashId(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16);
}

export function todayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function startOfDayMs(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
}

export function addDaysMs(fromMs, days) {
  const d = new Date(fromMs);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + Math.round(days));
  return d.getTime();
}

export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function parseQuestionsFromMarkdown(path, content, excludePatterns, questionsRoot = "") {
  const root = String(questionsRoot || "").replace(/^\/+|\/+$/g, "");
  let relPath = path;
  if (root) {
    const prefix = root + "/";
    if (path !== root && !path.startsWith(prefix)) return [];
    relPath = path === root ? "" : path.slice(prefix.length);
  }

  const base = path.split("/").pop() || path;
  const nameNoExt = base.replace(/\.md$/i, "");
  for (const p of excludePatterns || []) {
    if (!p) continue;
    if (nameNoExt.includes(p) || base.includes(p) || path.includes(p)) {
      return [];
    }
  }

  // 模块名：题库根下的第一级目录（如 八股/JVM/xx.md → JVM）
  const parts = (relPath || path).split("/").filter(Boolean);
  const moduleName = parts.length > 1 ? parts[0] : (parts[0] ? "根目录" : "根目录");
  // 题 ID 用相对路径，搬家后仍能对上旧进度
  const idPath = relPath || path;
  const lines = content.split(/\r?\n/);
  const headingRe = /^###\s+Q(\d+)\s*[\.、．]?\s*(.*)$/;
  const questions = [];
  let current = null;

  const flush = () => {
    if (!current) return;
    const answer = current.answerLines.join("\n").trim();
    const question = current.question.trim();
    if (question) {
      const rawId = `${idPath}#Q${current.num}:${question}`;
      questions.push({
        id: hashId(rawId),
        num: current.num,
        question,
        answer,
        path,
        heading: `Q${current.num}. ${question}`,
        module: moduleName,
      });
    }
    current = null;
  };

  for (const line of lines) {
    const m = line.match(headingRe);
    if (m) {
      flush();
      current = {
        num: m[1],
        question: (m[2] || "").trim(),
        answerLines: [],
      };
      continue;
    }
    if (!current) continue;
    if (/^##\s+/.test(line) && !/^###\s+/.test(line)) {
      flush();
      continue;
    }
    current.answerLines.push(line);
  }
  flush();
  return questions;
}
