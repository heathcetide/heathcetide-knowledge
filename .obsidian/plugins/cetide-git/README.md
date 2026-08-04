# Cetide Git

Obsidian 桌面版 Git 源码管理，布局参考 VS Code。

## 功能

- **主区域标签页**（默认）：左侧变更列表 + 右侧 diff 预览（不再堆在页面最底部）
- **左侧栏 / 右侧栏**：设置里可切换面板位置
- **Ollama AI**：根据暂存区 diff 一键生成 commit message
- 暂存 / 取消暂存 / 提交 / 推送 / 拉取 / 同步

## 使用

1. 设置 → 第三方插件 → 启用 **Cetide Git**
2. 点击丝带 **git-branch** → 在主区域打开源码管理
3. 命令面板：`打开源代码管理（主区域）` 或 `（左侧栏）`
4. 暂存文件 → **✨ AI 生成** → `Ctrl/⌘+Enter` 提交

## Ollama

需本地 `ollama serve`，默认 `http://127.0.0.1:11434`，模型与 bagu 插件相同可在设置里改。

## 开发

```bash
cd .obsidian/plugins/cetide-git
npm install && npm run build
```
