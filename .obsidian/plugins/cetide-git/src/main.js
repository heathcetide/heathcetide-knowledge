import { Plugin } from "obsidian"
import { VIEW_TYPE_GIT, DEFAULT_SETTINGS } from "./constants.js"
import { GitScmView, GitSettingTab } from "./view.js"

export default class CetideGitPlugin extends Plugin {
  async onload () {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, (await this.loadData()) || {})
    this._scmViews = new Set()
    this._timer = null

    this.registerView(VIEW_TYPE_GIT, (leaf) => new GitScmView(leaf, this))

    this.addRibbonIcon("git-branch", "源代码管理", () => this.activateView())

    this.addCommand({
      id: "open-scm",
      name: "打开源代码管理（主区域）",
      callback: () => this.activateView("main"),
    })

    this.addCommand({
      id: "open-scm-left",
      name: "打开源代码管理（左侧栏）",
      callback: () => this.activateView("left"),
    })

    this.addCommand({
      id: "refresh-scm",
      name: "刷新 Git 状态",
      callback: () => this.refreshViews(),
    })

    this.addSettingTab(new GitSettingTab(this.app, this))

    this.registerEvent(this.app.vault.on("modify", () => this.scheduleRefresh()))
    this.registerEvent(this.app.vault.on("create", () => this.scheduleRefresh()))
    this.registerEvent(this.app.vault.on("delete", () => this.scheduleRefresh()))
    this.registerEvent(this.app.vault.on("rename", () => this.scheduleRefresh()))

    this.app.workspace.onLayoutReady(() => {
      this.restartAutoRefresh()
    })
  }

  onunload () {
    this.clearAutoRefresh()
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_GIT)
  }

  async saveSettings () {
    await this.saveData(this.settings)
  }

  registerScmView (view) {
    this._scmViews.add(view)
  }

  unregisterScmView (view) {
    this._scmViews.delete(view)
  }

  scheduleRefresh () {
    if (this._debounce) window.clearTimeout(this._debounce)
    this._debounce = window.setTimeout(() => this.refreshViews(true), 800)
  }

  refreshViews (silent = false) {
    for (const view of this._scmViews) {
      view.refresh(silent)
    }
  }

  restartAutoRefresh () {
    this.clearAutoRefresh()
    const ms = Number(this.settings.autoRefreshMs) || 0
    if (ms <= 0) return
    this._timer = window.setInterval(() => this.refreshViews(true), ms)
  }

  clearAutoRefresh () {
    if (this._timer) {
      window.clearInterval(this._timer)
      this._timer = null
    }
  }

  /**
   * @param {'main'|'left'|'right'|undefined} placement
   */
  async activateView (placement) {
    const mode = placement || this.settings.panelPlacement || "main"
    const { workspace } = this.app

    // 已有视图：若位置不对则迁移
    const existing = workspace.getLeavesOfType(VIEW_TYPE_GIT)
    if (existing.length > 1) {
      for (let i = 1; i < existing.length; i++) {
        existing[i].detach()
      }
    }

    let leaf = existing[0]
    if (!leaf) {
      if (mode === "left") {
        await workspace.getLeftLeaf(false).setViewState({
          type: VIEW_TYPE_GIT,
          active: true,
        })
        leaf = workspace.getLeavesOfType(VIEW_TYPE_GIT)[0]
      } else if (mode === "right") {
        await workspace.getRightLeaf(false).setViewState({
          type: VIEW_TYPE_GIT,
          active: true,
        })
        leaf = workspace.getLeavesOfType(VIEW_TYPE_GIT)[0]
      } else {
        // 主区域新标签页（VS Code 打开 SCM 的体验）
        leaf = workspace.getLeaf("tab")
        await leaf.setViewState({ type: VIEW_TYPE_GIT, active: true })
      }
    }

    workspace.revealLeaf(leaf)
  }
}
