export const VIEW_TYPE_GIT = "cetide-git-scm";

/** left | main | right — 默认主区域全页 */
export const PANEL_PLACEMENTS = ["main", "left", "right"];

export const DEFAULT_SETTINGS = {
  autoRefreshMs: 4000,
  showUntracked: true,
  pushAfterCommit: false,
  panelPlacement: "main",
  ollamaBaseUrl: "http://127.0.0.1:11434",
  ollamaModel: "minimax-m3:cloud",
  ollamaTimeoutMs: 120000,
  commitMessageLang: "zh",
};
