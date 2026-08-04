/**
 * Free ASR for 口述作答（Obsidian/Electron 无 Web Speech）：
 * - siliconflow: 硅基流动 SenseVoice（国内可用，有免费额度）https://cloud.siliconflow.cn
 * - groq: Whisper（海外免费；国内常 Forbidden）
 * - openai-compatible: 任意 OpenAI 兼容 / 本地 Whisper HTTP
 */

export function asrSupported() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

/** 各提供方预设 */
export const ASR_PRESETS = {
  siliconflow: {
    label: "硅基流动 SenseVoice（推荐·国内免费额度）",
    baseUrl: "https://api.siliconflow.cn",
    model: "FunAudioLLM/SenseVoiceSmall",
    keyUrl: "https://cloud.siliconflow.cn/account/ak",
  },
  groq: {
    label: "Groq Whisper（海外；国内易 Forbidden）",
    baseUrl: "https://api.groq.com/openai",
    model: "whisper-large-v3-turbo",
    keyUrl: "https://console.groq.com/keys",
  },
  "openai-compatible": {
    label: "自定义 / 本地 Whisper",
    baseUrl: "http://127.0.0.1:9000",
    model: "small",
    keyUrl: "",
  },
};

export function createRecorder() {
  let stream = null;
  let recorder = null;
  let chunks = [];
  let mimeType = "audio/webm";

  async function start() {
    if (recorder && recorder.state === "recording") return;
    chunks = [];
    stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
      },
    });
    const candidates = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/mp4",
      "audio/ogg;codecs=opus",
    ];
    mimeType =
      candidates.find(
        (t) => window.MediaRecorder && MediaRecorder.isTypeSupported(t)
      ) || "";
    recorder = mimeType
      ? new MediaRecorder(stream, { mimeType })
      : new MediaRecorder(stream);
    mimeType = recorder.mimeType || mimeType || "audio/webm";
    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunks.push(e.data);
    };
    recorder.start(250);
  }

  function stop() {
    return new Promise((resolve, reject) => {
      if (!recorder) {
        cleanup();
        resolve(null);
        return;
      }
      const rec = recorder;
      rec.onstop = () => {
        try {
          const blob = new Blob(chunks, { type: mimeType || "audio/webm" });
          cleanup();
          resolve(blob.size ? blob : null);
        } catch (e) {
          cleanup();
          reject(e);
        }
      };
      rec.onerror = (e) => {
        cleanup();
        reject(e.error || new Error("录音失败"));
      };
      if (rec.state !== "inactive") rec.stop();
      else {
        cleanup();
        resolve(null);
      }
    });
  }

  function cleanup() {
    if (recorder && recorder.state !== "inactive") {
      try {
        recorder.stop();
      } catch (_) {}
    }
    recorder = null;
    chunks = [];
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      stream = null;
    }
  }

  function isRecording() {
    return !!(recorder && recorder.state === "recording");
  }

  return { start, stop, cleanup, isRecording, getMimeType: () => mimeType };
}

function extForMime(mime) {
  if (!mime) return "webm";
  if (mime.includes("mp4")) return "mp4";
  if (mime.includes("ogg")) return "ogg";
  if (mime.includes("mpeg") || mime.includes("mp3")) return "mp3";
  if (mime.includes("wav")) return "wav";
  return "webm";
}

function resolveEndpoint(settings) {
  const provider = settings.asrProvider || "siliconflow";
  const preset = ASR_PRESETS[provider];
  let base =
    (settings.asrBaseUrl || "").trim() ||
    (preset && preset.baseUrl) ||
    "https://api.siliconflow.cn";
  base = base.replace(/\/$/, "");
  // 允许用户填带 /v1 或不带
  if (!base.endsWith("/v1") && !base.endsWith("/openai")) {
    // siliconflow / 多数兼容服务：.../v1/audio/transcriptions
    // groq: https://api.groq.com/openai/v1/...
  }
  let url;
  if (provider === "groq") {
    url = "https://api.groq.com/openai/v1/audio/transcriptions";
  } else if (base.includes("/v1")) {
    url = `${base.replace(/\/$/, "")}/audio/transcriptions`;
  } else {
    url = `${base}/v1/audio/transcriptions`;
  }
  const model =
    (settings.asrModel || "").trim() ||
    (preset && preset.model) ||
    "FunAudioLLM/SenseVoiceSmall";
  return { provider, url, model, preset };
}

/**
 * @param {Blob} blob
 * @param {object} settings
 */
export async function transcribeBlob(blob, settings) {
  const provider = settings.asrProvider || "siliconflow";
  if (provider === "off" || provider === "none") {
    throw new Error("请先在设置里启用语音识别（推荐硅基流动）");
  }
  const { url, model, preset } = resolveEndpoint(settings);
  const key = (settings.asrApiKey || "").trim();
  if (!key && provider !== "openai-compatible") {
    const hint = (preset && preset.keyUrl) || "";
    throw new Error(
      `未配置 API Key。${hint ? "申请：" + hint + " ，" : ""}填到插件设置「ASR API Key」`
    );
  }

  const lang = settings.asrLang || "zh";
  const form = new FormData();
  const ext = extForMime(blob.type);
  form.append("file", blob, `answer.${ext}`);
  form.append("model", model);
  // SenseVoice 等国内模型通常不需要 / 不支持 language；Whisper 可带
  if (
    lang &&
    lang !== "auto" &&
    (provider === "groq" ||
      /whisper/i.test(model) ||
      provider === "openai-compatible")
  ) {
    form.append("language", lang);
  }
  form.append("response_format", "json");

  const headers = {};
  if (key) headers.Authorization = `Bearer ${key}`;

  const controller = new AbortController();
  const ms = settings.asrTimeoutMs || 120000;
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: form,
      signal: controller.signal,
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      if (
        res.status === 403 ||
        /forbidden/i.test(t) ||
        /Forbidden/.test(t)
      ) {
        throw new Error(
          `${provider} 返回 Forbidden（${res.status}）。Groq 在国内常被墙/拒；请改用「硅基流动」：https://cloud.siliconflow.cn 申请 Key，设置里选 siliconflow。原文：${t.slice(0, 120)}`
        );
      }
      throw new Error(`ASR HTTP ${res.status}: ${t.slice(0, 240)}`);
    }
    const data = await res.json();
    const text = String(data.text || data.transcription || "").trim();
    if (!text) throw new Error("未识别到有效语音，请靠近麦克风再说一遍");
    return text;
  } finally {
    clearTimeout(timer);
  }
}
