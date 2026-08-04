/**
 * Call local Ollama to score a 八股 answer (0–100).
 */

const DEFAULT_SYSTEM = `你是宽松、务实的秋招八股面试官。目标是鼓励表达、按「理解程度」给分，而不是按参考答案逐条抠字。

【总原则】
- 考生用自己的话答对大意即可，不要求措辞与参考答案一致。
- 宁可略偏高，也不要因漏掉次要点就打到不及格。
- 参考答案往往很长、很细；考生答到「主干框架 + 关键结论」就应给到良好及以上。
- 只有：空白/完全跑题/关键概念严重错误，才给低分。

【给分锚点（必须遵守）】
- 90–100：主干齐全，表述清楚，可有小遗漏或表述不严谨
- 75–89：大方向正确，覆盖大部分核心点，缺一些展开/例子
- 60–74：说到了关键概念，但缺一半左右要点，或条理一般
- 45–59：仅有零星正确点，或概念含糊但仍沾边
- 0–44：空白、明显跑题、或核心结论完全错误

【扣分纪律】
- 漏 1～2 个次要点：最多扣 5～10 分，不要腰斩。
- 没写例子/没画层次/没提版本差异：通常不扣到档，或只扣很少。
- 不要因为「没背出参考答案里的全部子弹」就给 40 分以下。
- 有明显正确 hits 时，分数通常不应低于 60（除非同时有严重错误）。

【输出】
只输出 JSON，不要 Markdown 围栏，不要其它解释。
字段：
- score: 整数 0-100（按上述锚点）
- feedback: 一两句中文评语，先肯定再说补强
- missing: 字符串数组，真正关键的缺漏（次要点可省略，可空）
- hits: 字符串数组，答对的关键点（可空）`;

export async function scoreWithOllama({
  baseUrl,
  model,
  question,
  reference,
  userAnswer,
  timeoutMs = 120000,
}) {
  const root = (baseUrl || "http://127.0.0.1:11434").replace(/\/$/, "");
  const userContent = [
    `题目：\n${question || ""}`,
    `\n参考答案（仅作要点对照，勿要求考生复述全文）：\n${(reference || "").slice(0, 12000)}`,
    `\n考生作答：\n${(userAnswer || "").trim() || "（空白）"}`,
    `\n评分要求：抓住主干给分；缺次要点不要大幅扣分；有理解就往 75+ 靠。`,
    `\n请输出 JSON：{"score":0-100,"feedback":"...","missing":[],"hits":[]}`,
  ].join("\n");

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
        format: "json",
        messages: [
          { role: "system", content: DEFAULT_SYSTEM },
          { role: "user", content: userContent },
        ],
        options: {
          temperature: 0.35,
        },
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Ollama HTTP ${res.status}: ${text.slice(0, 200)}`);
    }

    const data = await res.json();
    const raw =
      (data.message && data.message.content) ||
      data.response ||
      "";
    return parseScorePayload(raw);
  } finally {
    clearTimeout(timer);
  }
}

export function parseScorePayload(raw) {
  let text = String(raw || "").trim();
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) text = fence[1].trim();

  let obj;
  try {
    obj = JSON.parse(text);
  } catch (_) {
    const m = text.match(/\{[\s\S]*\}/);
    if (!m) throw new Error("模型未返回可解析 JSON");
    obj = JSON.parse(m[0]);
  }

  let score = Number(obj.score);
  if (Number.isNaN(score)) score = 0;
  score = Math.max(0, Math.min(100, Math.round(score)));

  const hits = Array.isArray(obj.hits) ? obj.hits.map(String) : [];
  const missing = Array.isArray(obj.missing) ? obj.missing.map(String) : [];

  // 软校正：有命中要点却被打太低时，抬一档，避免「差一点点就崩盘」
  if (hits.length >= 2 && score < 60) {
    score = Math.max(score, 62);
  } else if (hits.length >= 1 && score < 50 && score > 0) {
    score = Math.max(score, 55);
  }
  // 缺漏不多却分很低：再抬一点
  if (missing.length > 0 && missing.length <= 2 && hits.length >= 1 && score < 70) {
    score = Math.max(score, 72);
  }

  return {
    score,
    feedback: String(obj.feedback || obj.comment || "").trim(),
    missing,
    hits,
    raw: text,
  };
}

/** Map 0–100 score → SM-2 grade bucket */
export function scoreToGrade(score, thresholds) {
  const t = Object.assign(
    { again: 50, hard: 70, good: 90 },
    thresholds || {}
  );
  if (score < t.again) return "again";
  if (score < t.hard) return "hard";
  if (score < t.good) return "good";
  return "easy";
}
