export const VIEW_TYPE_CONTRIB = "cetide-contrib-view";

export const DEFAULT_SETTINGS = {
  /** 热力图周数（约一年） */
  heatmapWeeks: 53,
  /** 同一文件修改合并为一次编辑的防抖（秒） */
  editDebounceSec: 30,
  /** 启动时自动全库扫描 */
  scanOnOpen: true,
  /** 启动时用 Git 回填历史 */
  gitBackfillOnOpen: true,
  /** Git 回填天数 */
  gitLookbackDays: 365,
  /** 忽略路径前缀（相对 vault） */
  ignorePrefixes: [
    ".obsidian/",
    ".bagu/",
    ".contrib/",
    "node_modules/",
  ],
  /** Top 活跃文件数量 */
  topFiles: 10,
};
