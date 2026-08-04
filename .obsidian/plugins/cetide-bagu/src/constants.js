export const VIEW_TYPE_BAGU = "cetide-bagu-view";
export const DB_PATH = ".bagu/qiuzhao-bagu.db";

export const EBBINGHAUS_DEFAULT = [1, 2, 4, 7, 15, 30, 60];

export const DEFAULT_SETTINGS = {
  /** 只扫描该目录下的 Markdown 作为面试题（相对库根） */
  questionsRoot: "八股",
  excludePatterns: ["00-知识总览", "题单总索引"],
  writeRequireText: true,
  cooldownSize: 12,
  dailyTotalLimit: 15,
  /** 拷问任务抽题数 */
  quizCount: 15,
  /** 拷问及格线（计入准确率） */
  quizPassScore: 70,
  preferredModules: [],
  /** 拷问范围模块，空=全部 */
  quizModules: [],
  scheduler: "sm2",
  ebbinghausSteps: EBBINGHAUS_DEFAULT.slice(),
  remindOnOpen: true,
  ollamaBaseUrl: "http://127.0.0.1:11434",
  ollamaModel: "minimax-m3:cloud",
  ollamaTimeoutMs: 120000,
  scoreThresholdAgain: 50,
  scoreThresholdHard: 70,
  scoreThresholdGood: 90,
  allowManualGrade: true,
  /** 语音识别：siliconflow | groq | openai-compatible | off */
  asrProvider: "openai-compatible",
  asrApiKey: "",
  asrBaseUrl: "http://127.0.0.1:9000",
  asrModel: "small",
  asrLang: "zh",
  asrTimeoutMs: 180000,
  /** append=追加到已有草稿；replace=覆盖 */
  asrInsertMode: "append",
};
