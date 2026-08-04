import { ItemView, Notice, Setting, PluginSettingTab, Modal } from "obsidian"
import { VIEW_TYPE_GIT } from "./constants.js"
import * as Git from "./git.js"
import { generateCommitMessage } from "./ollama.js"

function basename (path) {
  const i = path.lastIndexOf("/")
  return i >= 0 ? path.slice(i + 1) : path
}

function dirname (path) {
  const i = path.lastIndexOf("/")
  return i >= 0 ? path.slice(0, i) : ""
}

export class GitScmView extends ItemView {
  constructor (leaf, plugin) {
    super(leaf)
    this.plugin = plugin
    this._summary = null
    this._busy = false
    this._aiBusy = false
    this._message = ""
    this._filter = ""
    this._diffPath = null
    this._diffStaged = false
    this._diffText = ""
    this._collapsed = { staged: false, unstaged: false, untracked: false }
    this._compact = false
    this._ro = null
  }

  getViewType () {
    return VIEW_TYPE_GIT
  }

  getDisplayText () {
    return "源代码管理"
  }

  getIcon () {
    return "git-branch"
  }

  async onOpen () {
    await this.refresh(true)
    this.plugin.registerScmView(this)
    this._ro = new ResizeObserver(() => this.updateCompact())
    this._ro.observe(this.contentEl)
  }

  async onClose () {
    this.plugin.unregisterScmView(this)
    this._ro?.disconnect()
  }

  updateCompact () {
    const compact = this.contentEl.clientWidth < 520
    if (compact === this._compact) return
    this._compact = compact
    this.contentEl.toggleClass("is-compact", compact)
  }

  setBusy (busy, tip = "") {
    this._busy = busy
    const el = this.contentEl.querySelector(".cg-busy")
    if (el) {
      el.toggleClass("is-on", busy)
      el.setText(tip || (busy ? "处理中…" : ""))
    }
  }

  async refresh (silent = false) {
    if (this._busy && !silent) return
    try {
      if (!silent) this.setBusy(true, "刷新中…")
      this._summary = await Git.getRepoSummary(this.app)
      if (this._diffPath) {
        try {
          this._diffText = await Git.getDiff(this.app, this._diffPath, {
            staged: this._diffStaged,
          })
        } catch {
          this._diffText = ""
        }
      }
      this.render()
      this.updateCompact()
    } catch (err) {
      if (!silent) new Notice(`Git 刷新失败：${err.message}`)
      this._summary = { isRepo: false, error: err.message }
      this.render()
    } finally {
      this.setBusy(false)
    }
  }

  async run (label, fn) {
    if (this._busy) return
    this.setBusy(true, label)
    try {
      await fn()
      await this.refresh(true)
    } catch (err) {
      new Notice(`${label}失败：${err.message}`)
      console.error(err)
      this.render()
    } finally {
      this.setBusy(false)
    }
  }

  render () {
    const root = this.contentEl
    root.empty()
    root.addClass("cg-root")
    root.toggleClass("is-compact", this._compact)

    root.createDiv({ cls: "cg-busy" })

    const s = this._summary
    if (!s) {
      root.createDiv({ cls: "cg-empty", text: "加载中…" })
      return
    }

    if (s.error && !s.isRepo) {
      root.createDiv({ cls: "cg-empty", text: s.error })
      return
    }

    if (!s.isRepo) {
      this.renderNoRepo(root)
      return
    }

    const top = root.createDiv({ cls: "cg-top" })
    this.renderHeader(top, s)
    this.renderCommitBox(top, s)
    this.renderToolbar(top, s)

    const body = root.createDiv({ cls: "cg-body" })
    const changes = body.createDiv({ cls: "cg-changes" })
    this.renderSections(changes, s)

    const diffPane = body.createDiv({ cls: "cg-diff-pane" })
    this.renderDiffPane(diffPane)
  }

  renderNoRepo (root) {
    const box = root.createDiv({ cls: "cg-empty-box" })
    box.createEl("h2", { text: "尚未初始化 Git" })
    box.createEl("p", { text: "在此知识库目录执行 git init，即可开始版本管理。" })
    box.createEl("button", { cls: "mod-cta", text: "初始化仓库" }).onclick = () =>
      this.run("初始化", async () => {
        await Git.initRepo(this.app)
        new Notice("已 git init")
      })
  }

  renderHeader (root, s) {
    const head = root.createDiv({ cls: "cg-header" })
    const brand = head.createDiv({ cls: "cg-brand" })
    brand.createSpan({ cls: "cg-brand-icon", text: "⎇" })
    const col = brand.createDiv({ cls: "cg-brand-col" })
    col.createDiv({ cls: "cg-branch-name", text: s.branch })
    const sub = col.createDiv({ cls: "cg-branch-sub" })
    if (s.upstream) sub.setText(s.upstream)
    else sub.addClass("cg-muted").setText("未设置上游")

    const pills = head.createDiv({ cls: "cg-pills" })
    if (s.ahead > 0) pills.createSpan({ cls: "cg-pill cg-pill-ahead", text: `↑ ${s.ahead}` })
    if (s.behind > 0) pills.createSpan({ cls: "cg-pill cg-pill-behind", text: `↓ ${s.behind}` })
    if (s.upstream && !s.ahead && !s.behind) {
      pills.createSpan({ cls: "cg-pill cg-pill-ok", text: "已同步" })
    }

    const actions = head.createDiv({ cls: "cg-header-actions" })
    actions.createEl("button", {
      cls: "cg-icon-btn",
      attr: { title: "刷新", "aria-label": "刷新" },
      text: "↻",
    }).onclick = () => this.refresh()
  }

  renderCommitBox (root, s) {
    const box = root.createDiv({ cls: "cg-commit" })
    const head = box.createDiv({ cls: "cg-commit-head" })
    head.createSpan({ cls: "cg-commit-label", text: "提交消息" })
    const aiBtn = head.createEl("button", {
      cls: "cg-ai-btn",
      text: this._aiBusy ? "生成中…" : "✨ AI 生成",
      attr: { title: "根据暂存区 diff 调用 Ollama 生成" },
    })
    aiBtn.disabled = this._aiBusy || this._busy
    aiBtn.onclick = () => this.generateAiMessage()

    const ta = box.createEl("textarea", {
      cls: "cg-message",
      attr: {
        placeholder: "描述本次更改…  Ctrl/⌘+Enter 提交",
        rows: "3",
      },
    })
    ta.value = this._message
    ta.addEventListener("input", () => { this._message = ta.value })
    ta.addEventListener("keydown", (ev) => {
      if ((ev.metaKey || ev.ctrlKey) && ev.key === "Enter") {
        ev.preventDefault()
        this.doCommit()
      }
    })
    this._messageEl = ta

    const row = box.createDiv({ cls: "cg-commit-actions" })
    const count = s.staged?.length || 0
    const commitBtn = row.createEl("button", {
      cls: "mod-cta",
      text: count ? `提交 · ${count}` : "提交",
    })
    commitBtn.disabled = !count
    commitBtn.onclick = () => this.doCommit()

    const pushBtn = row.createEl("button", {
      cls: "cg-btn-secondary",
      text: "提交并推送",
    })
    pushBtn.disabled = !count
    pushBtn.onclick = () => this.doCommit(true)
  }

  async generateAiMessage () {
    if (this._aiBusy || this._busy) return
    const s = this._summary
    const staged = s?.staged || []
    const files = staged.length
      ? staged.map((f) => f.path)
      : [...(s?.unstaged || []), ...(s?.untracked || [])].map((f) => f.path)

    if (!files.length) {
      new Notice("没有可分析的变更")
      return
    }

    this._aiBusy = true
    this.render()
    try {
      const diff = await Git.getStagedDiffAll(this.app)
      const cfg = this.plugin.settings
      const message = await generateCommitMessage({
        baseUrl: cfg.ollamaBaseUrl,
        model: cfg.ollamaModel,
        diff,
        files,
        branch: s?.branch,
        lang: cfg.commitMessageLang || "zh",
        timeoutMs: cfg.ollamaTimeoutMs || 120000,
      })
      this._message = message
      new Notice("已生成 commit message")
      this.render()
      this._messageEl?.focus()
    } catch (err) {
      new Notice(`AI 生成失败：${err.message}`)
    } finally {
      this._aiBusy = false
      this.render()
    }
  }

  renderToolbar (root, s) {
    const bar = root.createDiv({ cls: "cg-toolbar" })
    const mk = (label, title, fn) => {
      const b = bar.createEl("button", { cls: "cg-tool-btn", text: label, attr: { title } })
      b.onclick = fn
      return b
    }

    mk("拉取", "git pull --rebase --autostash", () =>
      this.run("拉取", async () => {
        await Git.pull(this.app)
        new Notice("拉取完成")
      }))
    mk("推送", "git push", () =>
      this.run("推送", async () => {
        await Git.push(this.app)
        new Notice("推送完成")
      }))
    mk("同步", "fetch → pull → push", () =>
      this.run("同步", async () => {
        await Git.fetch(this.app)
        await Git.pull(this.app)
        const ab = await Git.getAheadBehind(this.app)
        if (ab.ahead > 0) await Git.push(this.app)
        new Notice("同步完成")
      }))

    bar.createEl("input", {
      cls: "cg-filter",
      attr: { type: "search", placeholder: "筛选文件…" },
    }).addEventListener("input", (ev) => {
      this._filter = ev.target.value.trim().toLowerCase()
      this.render()
      const input = this.contentEl.querySelector(".cg-filter")
      if (input) {
        input.focus()
        input.setSelectionRange(input.value.length, input.value.length)
      }
    })
    const filterEl = bar.querySelector(".cg-filter")
    if (filterEl) filterEl.value = this._filter
  }

  matchFilter (path) {
    if (!this._filter) return true
    return path.toLowerCase().includes(this._filter)
  }

  renderSections (root, s) {
    const staged = (s.staged || []).filter((f) => this.matchFilter(f.path))
    const unstaged = (s.unstaged || []).filter((f) => this.matchFilter(f.path))
    const untracked = this.plugin.settings.showUntracked
      ? (s.untracked || []).filter((f) => this.matchFilter(f.path))
      : []

    this.renderSection(root, {
      id: "staged",
      title: "已暂存",
      files: staged,
      kind: "staged",
      empty: "暂无可提交文件",
      actions: staged.length ? [{
        label: "全部取消暂存",
        run: () => this.run("取消暂存", async () => {
          await Git.unstagePaths(this.app, staged.map((f) => f.path))
        }),
      }] : [],
    })

    this.renderSection(root, {
      id: "unstaged",
      title: "更改",
      files: unstaged,
      kind: "unstaged",
      empty: "工作区干净",
      actions: unstaged.length ? [
        {
          label: "全部暂存",
          run: () => this.run("暂存", async () => {
            await Git.stagePaths(this.app, unstaged.map((f) => f.path))
          }),
        },
        {
          label: "全部丢弃",
          danger: true,
          run: () => this.confirmDiscard(unstaged.map((f) => f.path)),
        },
      ] : [],
    })

    this.renderSection(root, {
      id: "untracked",
      title: "未跟踪",
      files: untracked,
      kind: "untracked",
      empty: "无未跟踪文件",
      actions: untracked.length ? [
        {
          label: "全部暂存",
          run: () => this.run("暂存", async () => {
            await Git.stagePaths(this.app, untracked.map((f) => f.path))
          }),
        },
        {
          label: "全部删除",
          danger: true,
          run: () => this.confirmDiscard(untracked.map((f) => f.path), true),
        },
      ] : [],
    })
  }

  renderSection (root, { id, title, files, kind, empty, actions }) {
    const collapsed = this._collapsed[id]
    const sec = root.createDiv({ cls: `cg-section cg-section-${kind}` })
    if (collapsed) sec.addClass("is-collapsed")

    const head = sec.createDiv({ cls: "cg-section-head" })
    head.createSpan({ cls: "cg-chevron", text: collapsed ? "▸" : "▾" })
    head.createSpan({ cls: "cg-section-title", text: title })
    head.createSpan({ cls: "cg-section-count", text: String(files.length) })

    head.onclick = () => {
      this._collapsed[id] = !this._collapsed[id]
      this.render()
    }

    const acts = head.createDiv({ cls: "cg-section-actions" })
    for (const a of actions) {
      const b = acts.createEl("button", {
        cls: a.danger ? "cg-link-btn is-danger" : "cg-link-btn",
        text: a.label,
      })
      b.onclick = (ev) => {
        ev.stopPropagation()
        a.run()
      }
    }

    if (collapsed) return

    if (!files.length) {
      sec.createDiv({ cls: "cg-section-empty", text: empty })
      return
    }

    const list = sec.createDiv({ cls: "cg-file-list" })
    for (const file of files) {
      this.renderFileRow(list, file, kind)
    }
  }

  renderFileRow (list, file, kind) {
    const active = this._diffPath === file.path && this._diffStaged === (kind === "staged")
    const row = list.createDiv({ cls: "cg-file" })
    if (active) row.addClass("is-active")

    row.createSpan({
      cls: `cg-badge cg-badge-${(file.label || "?").toLowerCase()}`,
      text: file.label || "?",
    })

    const textCol = row.createDiv({ cls: "cg-file-text" })
    textCol.createDiv({ cls: "cg-file-base", text: basename(file.path) })
    const dir = dirname(file.path)
    if (dir) textCol.createDiv({ cls: "cg-file-dir", text: dir })

    row.onclick = async (ev) => {
      if (ev.target.closest(".cg-file-ops")) return
      if (ev.metaKey || ev.ctrlKey) {
        await this.openFile(file.path)
        return
      }
      await this.showDiff(file.path, kind === "staged")
    }

    const ops = row.createDiv({ cls: "cg-file-ops" })
    if (kind === "staged") {
      ops.createEl("button", { cls: "cg-mini-btn", text: "−", attr: { title: "取消暂存" } })
        .onclick = (ev) => {
          ev.stopPropagation()
          this.run("取消暂存", async () => {
            await Git.unstagePaths(this.app, [file.path])
          })
        }
    } else {
      ops.createEl("button", { cls: "cg-mini-btn", text: "+", attr: { title: "暂存" } })
        .onclick = (ev) => {
          ev.stopPropagation()
          this.run("暂存", async () => {
            await Git.stagePaths(this.app, [file.path])
          })
        }
      ops.createEl("button", {
        cls: "cg-mini-btn is-danger",
        text: "↺",
        attr: { title: kind === "untracked" ? "删除" : "丢弃" },
      }).onclick = (ev) => {
        ev.stopPropagation()
        this.confirmDiscard([file.path], kind === "untracked")
      }
    }
    ops.createEl("button", { cls: "cg-mini-btn", text: "↗", attr: { title: "打开文件" } })
      .onclick = (ev) => {
        ev.stopPropagation()
        this.openFile(file.path)
      }
  }

  async showDiff (path, staged) {
    this._diffPath = path
    this._diffStaged = staged
    try {
      this._diffText = await Git.getDiff(this.app, path, { staged })
    } catch (err) {
      this._diffText = `// 无法读取 diff：${err.message}`
    }
    this.render()
  }

  renderDiffPane (root) {
    const head = root.createDiv({ cls: "cg-diff-head" })
    if (this._diffPath) {
      head.createSpan({
        cls: "cg-diff-title",
        text: `${this._diffStaged ? "暂存区" : "工作区"} · ${this._diffPath}`,
      })
      head.createEl("button", { cls: "cg-link-btn", text: "关闭" }).onclick = () => {
        this._diffPath = null
        this._diffText = ""
        this.render()
      }
    } else {
      head.createSpan({ cls: "cg-diff-title cg-muted", text: "差异预览" })
    }

    const body = root.createDiv({ cls: "cg-diff-body" })
    if (!this._diffPath) {
      body.createDiv({
        cls: "cg-diff-placeholder",
        text: "点击左侧文件查看 diff\n⌘/Ctrl+点击 在编辑器中打开",
      })
      return
    }

    const text = this._diffText || "(无差异)"
    for (const line of text.split("\n").slice(0, 1200)) {
      const ln = body.createDiv({ cls: "cg-diff-line" })
      if (line.startsWith("+") && !line.startsWith("+++")) ln.addClass("is-add")
      else if (line.startsWith("-") && !line.startsWith("---")) ln.addClass("is-del")
      else if (line.startsWith("@@")) ln.addClass("is-hunk")
      ln.setText(line || " ")
    }
  }

  async openFile (path) {
    const file = this.app.vault.getAbstractFileByPath(path)
    if (!file) {
      new Notice(`找不到：${path}`)
      return
    }
    const leaf = this.app.workspace.getLeaf(false)
    await leaf.openFile(file)
  }

  confirmDiscard (paths, isDelete = false) {
    if (!paths?.length) return
    new ConfirmModal(
      this.app,
      isDelete ? "删除未跟踪文件？" : "丢弃更改？",
      isDelete
        ? `将永久删除 ${paths.length} 项，无法恢复。`
        : `将丢弃 ${paths.length} 个文件的未提交修改。`,
      () => this.run(isDelete ? "删除" : "丢弃", async () => {
        await Git.discardPaths(this.app, paths)
        new Notice(isDelete ? "已删除" : "已丢弃")
      })
    ).open()
  }

  async doCommit (alsoPush = false) {
    const staged = this._summary?.staged || []
    if (!staged.length) {
      new Notice("请先暂存文件")
      return
    }
    const message = this._message.trim()
    if (!message) {
      new Notice("请填写或 AI 生成提交说明")
      return
    }
    await this.run(alsoPush ? "提交并推送" : "提交", async () => {
      await Git.commit(this.app, message)
      this._message = ""
      new Notice("提交成功")
      if (alsoPush || this.plugin.settings.pushAfterCommit) {
        await Git.push(this.app)
        new Notice("已推送")
      }
    })
  }
}

class ConfirmModal extends Modal {
  constructor (app, title, body, onConfirm) {
    super(app)
    this._title = title
    this._body = body
    this._onConfirm = onConfirm
  }

  onOpen () {
    const { contentEl } = this
    contentEl.empty()
    contentEl.createEl("h3", { text: this._title })
    contentEl.createEl("p", { text: this._body })
    const row = contentEl.createDiv({ cls: "cg-modal-actions" })
    row.createEl("button", { text: "取消" }).onclick = () => this.close()
    row.createEl("button", { cls: "mod-warning", text: "确认" }).onclick = async () => {
      this.close()
      await this._onConfirm()
    }
  }
}

export class GitSettingTab extends PluginSettingTab {
  constructor (app, plugin) {
    super(app, plugin)
    this.plugin = plugin
  }

  display () {
    const { containerEl } = this
    containerEl.empty()
    containerEl.createEl("h2", { text: "Cetide Git" })

    new Setting(containerEl)
      .setName("面板位置")
      .setDesc("点击丝带图标时打开的位置；主区域为 VS Code 式全页")
      .addDropdown((dd) => {
        dd.addOption("main", "主区域（标签页）")
        dd.addOption("left", "左侧栏")
        dd.addOption("right", "右侧栏")
        dd.setValue(this.plugin.settings.panelPlacement || "main")
        dd.onChange(async (v) => {
          this.plugin.settings.panelPlacement = v
          await this.plugin.saveSettings()
        })
      })

    new Setting(containerEl)
      .setName("自动刷新间隔（毫秒）")
      .setDesc("0 = 关闭")
      .addText((text) => {
        text.setValue(String(this.plugin.settings.autoRefreshMs ?? 4000))
        text.onChange(async (v) => {
          const n = Number(v)
          this.plugin.settings.autoRefreshMs = Number.isFinite(n) ? Math.max(0, n) : 4000
          await this.plugin.saveSettings()
          this.plugin.restartAutoRefresh()
        })
      })

    new Setting(containerEl)
      .setName("显示未跟踪文件")
      .addToggle((toggle) => {
        toggle.setValue(this.plugin.settings.showUntracked !== false)
        toggle.onChange(async (v) => {
          this.plugin.settings.showUntracked = v
          await this.plugin.saveSettings()
          this.plugin.refreshViews()
        })
      })

    new Setting(containerEl)
      .setName("提交后自动推送")
      .addToggle((toggle) => {
        toggle.setValue(!!this.plugin.settings.pushAfterCommit)
        toggle.onChange(async (v) => {
          this.plugin.settings.pushAfterCommit = v
          await this.plugin.saveSettings()
        })
      })

    containerEl.createEl("h3", { text: "Ollama · Commit 生成" })

    new Setting(containerEl)
      .setName("Ollama Base URL")
      .addText((t) => {
        t.setValue(this.plugin.settings.ollamaBaseUrl || "http://127.0.0.1:11434")
        t.onChange(async (v) => {
          this.plugin.settings.ollamaBaseUrl = v.trim()
          await this.plugin.saveSettings()
        })
      })

    new Setting(containerEl)
      .setName("模型")
      .addText((t) => {
        t.setValue(this.plugin.settings.ollamaModel || "minimax-m3:cloud")
        t.onChange(async (v) => {
          this.plugin.settings.ollamaModel = v.trim()
          await this.plugin.saveSettings()
        })
      })

    new Setting(containerEl)
      .setName("超时（毫秒）")
      .addText((t) => {
        t.setValue(String(this.plugin.settings.ollamaTimeoutMs || 120000))
        t.onChange(async (v) => {
          const n = Number(v)
          if (Number.isFinite(n) && n > 0) {
            this.plugin.settings.ollamaTimeoutMs = n
            await this.plugin.saveSettings()
          }
        })
      })

    new Setting(containerEl)
      .setName("Commit 语言")
      .addDropdown((dd) => {
        dd.addOption("zh", "中文")
        dd.addOption("en", "English")
        dd.setValue(this.plugin.settings.commitMessageLang || "zh")
        dd.onChange(async (v) => {
          this.plugin.settings.commitMessageLang = v
          await this.plugin.saveSettings()
        })
      })
  }
}