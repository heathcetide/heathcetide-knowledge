/**
 * 调用本地 Ollama 生成 Git commit message。
 */

const SYSTEM_ZH = `你是专业的 Git 提交信息助手。根据暂存区 diff 生成 commit message。

要求：
- 使用中文，简洁准确，说明「做了什么」和「为什么」（若能从 diff 推断）
- 第一行为主题，≤72 字符，不用句号结尾
- 若有多个独立改动，主题后空一行，用 - 列出要点（每条一行）
- 遵循 Conventional Commits 风格前缀可选：feat/fix/docs/chore/refactor 等
- 只输出 commit message 正文，不要 Markdown 代码块，不要解释`;

const SYSTEM_EN = `You write Git commit messages from staged diffs.
- First line ≤72 chars, imperative mood
- Blank line then bullet list if multiple changes
- Output only the commit message, no fences or explanation`;

export async function generateCommitMessage ({
  baseUrl,
  model,
  diff,
  files = [],
  branch = "",
  lang = "zh",
  timeoutMs = 120000,
}) {
  const root = (baseUrl || "http://127.0.0.1:11434").replace(/\/$/, "");
  const fileList = files.slice(0, 40).join("\n");
  const diffText = String(diff || "").trim().slice(0, 14000) || "(无 diff 内容)";

  const userContent = [
    branch ? `当前分支：${branch}` : "",
    files.length ? `变更文件（${files.length}）：\n${fileList}` : "",
    `\n暂存区 diff：\n${diffText}`,
    "\n请生成 commit message。",
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
          { role: "user", content: userContent },
        ],
        options: { temperature: 0.25 },
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Ollama HTTP ${res.status}: ${text.slice(0, 200)}`);
    }

    const data = await res.json();
    let text = String(
      (data.message && data.message.content) || data.response || ""
    ).trim();

    const fence = text.match(/```(?:\w*)?\s*([\s\S]*?)```/);
    if (fence) text = fence[1].trim();
    text = text.replace(/^commit message[：:]\s*/i, "").trim();

    if (!text) throw new Error("模型返回为空");
    return text;
  } finally {
    clearTimeout(timer);
  }
}
