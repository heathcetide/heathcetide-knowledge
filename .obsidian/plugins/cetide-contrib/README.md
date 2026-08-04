# Cetide Contrib

Obsidian 写作贡献图谱：文档数、字数、每日编辑/新建热力图，支持 Git 历史回填。

## 功能

- **总览**：当前 Markdown 文档数、总字数、今日编辑/新建/字数变化、连续写作天数
- **贡献图谱**：GitHub 风格热力图（主色=编辑次数；无编辑时回退 Git 触及文件数）
- **Hover**：编辑次数、新建数、字数增量、Git commits
- **目录分布** / **活跃文件 Top N**
- **混合数据源**：Vault 实时事件 + Git log 回填

## 使用

1. 设置 → 第三方插件 → 启用 **Cetide Contrib**
2. 点击丝带日历图标，或命令面板：`打开写作贡献图谱`
3. 首次打开会自动全库扫描 + Git 回填（可在设置关闭）

## 开发

```bash
cd .obsidian/plugins/cetide-contrib
npm install && npm run build
```
