# heathcetide Knowledge

<p align="center">
  <strong>heathcetide 个人学习文档</strong><br/>
  后端 / 面试八股 / 工程实践 · 基于 Obsidian 持续沉淀
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License"></a>
  <img src="https://img.shields.io/badge/Obsidian-Vault-7C3AED?logo=obsidian&logoColor=white" alt="Obsidian">
  <img src="https://img.shields.io/badge/Focus-Java%20Backend-orange" alt="Focus">
  <img src="https://img.shields.io/badge/八股-11%20Modules-success" alt="Modules">
  <a href="https://github.com/heathcetide"><img src="https://img.shields.io/badge/Author-heathcetide-black?logo=github" alt="Author"></a>
</p>

---

## 简介

本仓库是 [heathcetide](https://github.com/heathcetide) 的个人技术知识库，记录：

- **八股面试**：按模块拆分的问答笔记（Java / JVM / 并发 / 集合 / MySQL / Redis / 网络 / MQ 等）
- **项目与工程实践**：方案设计、中间件、CI/CD、运维部署
- **前端 / 客户端 / 微服务**：补充技术栈学习记录
- **日志与面经**：实习与面试过程中的复盘

适合作为 Obsidian Vault 打开，边写边复习。

---

## 学习路线

按面试与工程能力递进，建议顺序如下（可按缺口跳读）：

```text
① 语言与基础
   Java基础 → Java集合 → Java并发 → JVM
        ↓
② 存储与中间件
   MySQL → Redis → MyBatis → 消息队列
        ↓
③ 网络与分布式
   计算机网络 → 微服务 → 测试与运维（Docker / K8s）
        ↓
④ 工程与延伸
   项目方案 / DevOps → Agent 开发 → Go / 前端 / 客户端（按需）
```

| 阶段 | 目录 | 目标 |
|------|------|------|
| 语言与基础 | `八股/Java*`、`八股/JVM` | 扎实回答面试高频点 |
| 存储与中间件 | `八股/MySQL`、`Redis`、`消息队列` | 能讲清原理与选型 |
| 网络与分布式 | `八股/计算机网络`、`微服务/` | 链路、注册中心、网关 |
| 工程落地 | `项目方案/`、`测试与运维/` | 部署、压测、方案设计 |
| 复盘沉淀 | `日志/` | 面经、实习与设计复盘 |

**八股模块一览**

| 模块 | 笔记量（约） | 模块 | 笔记量（约） |
|------|-------------|------|-------------|
| Java基础 | 15 | MySQL | 14 |
| Java并发 | 11 | Redis | 18 |
| Java集合 | 10 | MyBatis | 12 |
| JVM | 13 | 计算机网络 | 15 |
| 消息队列 | 7 | Go基础 | 21 |

---

## 目录结构

```text
.
├── 八股/              # 面试八股（模块化问答）
│   ├── Java基础 / Java并发 / Java集合 / JVM
│   ├── MySQL / Redis / MyBatis / 消息队列
│   ├── 计算机网络 / Go基础 / …
├── 项目方案/          # 工程方案、中间件、DevOps
├── 前端/              # 前端学习笔记
├── 客户端开发/        # Flutter / Dart
├── 微服务/            # Spring Cloud 等
├── 测试与运维/        # Docker / K8s / 压测
├── Agent开发/         # AI Agent / RAG
└── 日志/              # 实习日志、面经、设计复盘
```

---

## 使用方式

### 本机写作（Git 双向同步）

1. Clone 本仓库，用 [Obsidian](https://obsidian.md/) 打开根目录作为 Vault  
2. 从 `八股/` 按上表路线复习；笔记多为「问题 + 参考答案」，便于默写对照  
3. 工程与部署类内容见 `项目方案/`、`测试与运维/`  
4. （可选）本地插件：`cetide-bagu` 刷题复习；`cetide-contrib` 写作贡献图谱；`cetide-git` 源码管理（commit / push / pull）  

```bash
git clone git@github.com:heathcetide/heathcetide-knowledge.git
# 用 Obsidian → Open folder as vault → 选择本仓库根目录
```

### 网页只读（Pages 静态快照）

多端浏览不必装 Obsidian：阅读器在部署时打包 Markdown，**运行时不打 GitHub API**。单页布局（左侧目录 + 右侧滚轮阅读），并支持按 `[[wiki 链接]]` 生成的知识图谱。

- 在线地址：[https://heathcetide.github.io/heathcetide-knowledge/](https://heathcetide.github.io/heathcetide-knowledge/)
- 源码：[`web/`](web/)，构建：`node web/build.mjs` → `_site/`（含 `manifest.json` / `graph.json` / `content/`）
- 本地预览：

```bash
node web/build.mjs
npx serve _site
```

- 顶栏 **阅读 / 图谱**；图谱支持全库与当前笔记局部一跳邻居  
- Pages：Source 选 **GitHub Actions**，Custom domain 留空

分工：**本机 git push → Pages 重新构建快照 → 网页只读浏览。**
---

## 更新日志

### 2026-08

- 新增根目录 README（仓库说明、学习路线、徽章）
- 新增 Obsidian 插件 `cetide-contrib`：写作贡献图谱（文档数/字数/热力图/Git 回填）
- 新增 `web/` GitHub 只读网页阅读器 + Pages 部署工作流
- 持续加厚 Java 并发、JVM、Java 基础等八股模块
- 八股题库收拢至 `八股/`，配合本地刷题工作流

### 2026-07

- 补充多领域技术学习笔记与项目方案文档
- 导入个人 Obsidian 知识库，启用工作区与插件配置
- 新增测试与运维、微服务、前端等相关笔记

### 更早

- 仓库初始化，建立个人学习文档骨架

> 日常细碎更新以 commit 为准；重大整理会同步记在本节。

---

## License

[MIT](./LICENSE) © 2026 heathcetide
