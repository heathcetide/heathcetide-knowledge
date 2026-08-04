# jinkens简介
 Jenkins 是一个开源的自动化服务器，广泛应用于持续集成（CI）和持续交付（CD）流程中。你提到你的项目是一个 Spring Boot 项目，并托管在 GitHub 上，下面我将帮你简明介绍 Jenkins、它的使用场景，以及如何结合 GitHub、Maven 等工具部署 Spring Boot 项目。


## 🔧 Jenkins 简介
### 🌐 官网
[Jenkins 官方网站](https://www.jenkins.io/)

### 🧠 基本概念及使用场景
+ **持续集成（CI）**：每次代码提交后自动构建、测试。
+ **持续交付/部署（CD）**：将构建好的应用自动部署到服务器。
+ **多语言支持**：包括 Java、Python、Node.js 等。
+ **任务调度**：可按需或定时运行构建任务。

### 📦 Jenkins 的基本功能
+ 自动从 GitHub/GitLab 拉取代码。
+ 使用 Maven/Gradle 构建项目。
+ 自动执行单元测试。
+ 构建后上传产物到远程服务器或制品库。
+ 支持邮件/Slack/企业微信通知。
+ 通过插件扩展几乎任何 CI/CD 功能。

---

## 🔌 常见插件介绍
### 1. **Publish Over SSH**
+ 用于将构建产物通过 SSH 上传到远程服务器，实现自动部署。

### 2. **Locale Plugin**
+ 允许你强制 Jenkins 使用特定的语言（如中文）。

### 3. **Localization: Chinese (Simplified)**
+ 提供简体中文界面翻译。

### 4. **Localization Support**
+ 支持其他本地化翻译资源。

---

## 🛠 Jenkins Pipeline 简介
Jenkins Pipeline 是使用代码定义的持续集成/部署流程，通常写在项目根目录的 `Jenkinsfile` 中。

一个简单的 Spring Boot 项目 Jenkinsfile 示例
```plain
groovy


复制代码
pipeline {
 agent any
 tools {
 maven 'Maven3'
 jdk 'JDK11'
 }
 stages {
 stage('Clone') {
 steps {
 git 'https://github.com/yourname/your-springboot-repo.git'
 }
 }
 stage('Build') {
 steps {
 sh 'mvn clean package'
 }
 }
 stage('Deploy') {
 steps {
 sshPublisher(
 publishers: [
 sshPublisherDesc(
 configName: 'your-server',
 transfers: [
 sshTransfer(
 sourceFiles: '**/target/*.jar',
 removePrefix: 'target/',
 remoteDirectory: '/path/to/remote',
 execCommand: 'bash deploy.sh'
 )
 ]
 )
 ]
 )
 }
 }
 }
}
```

---

## 🧪 实践专题参考
+ [Jenkins 学习资源博文汇总1](https://www.cnblogs.com/shenh/p/8963688.html)
+ [Jenkins + GitLab + Maven 构建 SpringBoot 项目案例](https://www.cnblogs.com/shenh/p/8963688.html)

---

## 🧩 使用 Jenkins 部署 Spring Boot 项目（GitHub + Maven）
1. **安装 Jenkins**
 - 推荐使用 Docker 或 war 包安装。
2. **安装插件**
 - Git Plugin、Maven Integration、Publish Over SSH、Pipeline
3. **配置工具**
 - 配置 JDK、Maven 路径
 - 添加 GitHub 凭据（SSH Key 或 Token）
4. **创建 Pipeline 项目**
 - 使用 `Jenkinsfile` 自动拉取代码、构建并部署
5. **部署目标**
 - 通常部署到一台远程 Linux 服务器
 - 可通过脚本如 `scp + ssh` 或 `Publish Over SSH` 插件完成部署


[Jenkins官网](https://www.jenkins.io/)

**1 基本概念及使用场景**
[Jenkisn的基本功能介绍](https://www.jianshu.com/p/cfdf0d90185e)


jinkens实践专题参考:
[Jinkens学习资源(博文汇总)1](https://blog.csdn.net/qq_43437874/category_9842628.html)
[jinkens学习资源(博文汇总)2](https://blog.csdn.net/qq_34125999/category_10342521.html)
[jinkens学习资源(博文汇总)3](https://blog.csdn.net/redrose2100/category_11498745.html)


# Jenkins 插件介绍

**1 jenkins的一些常见的插件**
** 1.1 ****<font style="color:rgb(64, 64, 64);">Publish Over SSH</font>**


** 1.2 locale**
 介绍
<font style="color:rgb(77, 77, 77);">Jenkins中可以通过使用locale插件来支持中文的界面显示，实际上不只是中文，其他一些语言可以进行国际化/本地化的支持，这篇文章将对locale插件以及使用进行介绍。</font>
[安装](https://blog.csdn.net/weixin_42713970/article/details/86737555)

**<font style="color:rgb(38, 38, 38);"> 1.3 </font>**[Localization: Chinese (Simplified)](https://plugins.jenkins.io/localization-zh-cn)


**<font style="color:rgb(38, 38, 38);"> 1.4 </font>**[Localization Support](https://plugins.jenkins.io/localization-support)


<!-- 这是一张图片，ocr 内容为： -->
!


# Jenkins的Pipeline


参考
[https://www.cnblogs.com/shenh/p/8963688.html](https://www.cnblogs.com/shenh/p/8963688.html)


若有收获，就点个赞吧


# jenkins+gitlab+Maven部署SpringBoot应用
<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">参考：</font><font style="color:rgb(38, 38, 38);">
</font>[使用 Jenkins 部署码云上的 Spring Boot 项目](https://mp.weixin.qq.com/s/-jDdr10TzGVqGCpZzQiBaQ)<font style="color:rgb(38, 38, 38);">
</font>[基于CentOS8，从0开始搭建Jenkins+GitLab+Maven持续集成，自动构建SpringBoot项目案例](https://blog.csdn.net/qq_43509535/article/details/120601681)<font style="color:rgb(38, 38, 38);">
</font>


## ✅ Jenkins 是不是要部署在你服务器上？
是的，**Jenkins 通常需要部署在你自己的服务器上**，除非你使用云服务（比如 GitHub Actions、GitLab CI/CD、Jenkins Cloud 等）。部署 Jenkins 的方式有三种主流选择
### ✅ Jenkins 部署方式
| 部署方式 | 特点 |
| --- | --- |
| **直接安装**（war包或系统包） | 适合传统 Linux 服务器，操作灵活，但配置略繁琐。 |
| **Docker 运行 Jenkins** | 推荐 ✅：快速、便于隔离和迁移，支持挂载数据卷。 |
| **使用 Jenkins 云服务** | 如 AWS Jenkins 或 Azure DevOps，适合企业或团队使用。 |


---

## 🧾 如何使用 Jenkinsfile？
### 💡 Jenkinsfile 是“代码化构建流程”的脚本，必须配合 Jenkins 的“Pipeline 项目”使用。
## 👣 使用 Jenkinsfile 的完整步骤
### 🔧 第一步：部署 Jenkins
最简单的方式是用 Docker
```plain
docker run -d --name jenkins \
 -p 8080:8080 -p 50000:50000 \
 -v jenkins_home:/var/jenkins_home \
 -v /var/run/docker.sock:/var/run/docker.sock \
 jenkins/jenkins:lts
```

然后访问你的服务器
`http://<你的服务器IP>:8080`

按照提示完成初始化。

---

### 🔨 第二步：安装必需插件
在 Jenkins 的“插件管理”中安装
+ **Pipeline**
+ **Git**
+ **Docker Pipeline**
+ **Publish Over SSH**
+ **Maven Integration Plugin**

---

### 🧪 第三步：配置工具链
在“系统管理” > “Global Tool Configuration”中
+ 配置 JDK、Maven 路径（根据你系统安装的位置）
+ 配置 Docker 服务器（如果你用 Docker 构建）
+ 添加 Docker Hub 凭据（类型：用户名密码）
+ 添加 SSH 凭据（如果远程部署）

---

### 🧬 第四步：创建 Jenkins Pipeline 项目
1. 回到 Jenkins 首页，点击 **“新建任务”**
2. 输入任务名称
3. 选择 **Pipeline**
4. 在配置界面，勾选 **“从 SCM 获取 Jenkinsfile”**（若你已提交到 GitHub），或者手动写 Pipeline 脚本。

#### 选项 1：Jenkinsfile 在 GitHub 中
配置你的 GitHub 仓库地址，分支，以及 `Jenkinsfile` 路径（一般是根目录）。

#### 选项 2：直接写 Jenkinsfile 脚本
在“Pipeline”区域粘贴 Jenkinsfile 脚本。

---

### 🚀 第五步：运行构建
点击 **“立即构建”**
构建完成后，你可以看到各个阶段（构建、打包、推镜像、部署）清晰展示在 Jenkins UI 上。

---

## ✅ 总结一下
| 你要做的事 | 说明 |
| --- | --- |
| 在服务器上部署 Jenkins | 可以用 Docker 一键运行 |
| 安装插件和配置工具链 | Maven、JDK、Docker、SSH 凭据等 |
| 编写 Jenkinsfile 脚本 | 放在 GitHub 项目中或手动输入 |
| 创建一个 Pipeline 项目 | 连接你的代码仓库 |
| 执行构建 + 部署 | 自动拉取、打包、部署 Spring Boot 项目 |


## 🤔 Jenkins 是干嘛的？
简单一句话
**Jenkins 是一个自动化服务器，用来自动执行你平时手动干的“开发后期操作”。**

它的核心用途是：**持续集成（CI）和持续部署（CD）**。

---

## 🧱 什么叫 CI/CD？
| 缩写 | 全称 | 作用 |
| --- | --- | --- |
| CI | Continuous Integration | 自动拉代码 + 自动编译/测试（代码合并验证） |
| CD | Continuous Deployment/Delivery | 自动部署应用（发布到测试环境/服务器） |


---

## 🛠️ 你平时开发流程是这样的
1. 你写代码（在 GitHub 上）
2. 手动拉取代码到测试服务器
3. 编译、打包、测试、运行（Java/Maven、Node、Docker…）
4. 再手动部署上线

---

## 🤖 而 Jenkins 可以帮你自动干这些
例如
+ **自动克隆你的仓库**
+ 发现你提交新代码后
+ 自动执行
 - 单元测试
 - 打包编译（Maven/Node/Nuxt/Go）
 - 构建 Docker 镜像
 - 推送到服务器/阿里云/容器平台
 - 发送钉钉/邮件通知结果

---

## 🧪 举个例子：假设你是开发一个 Java 后端
你可以让 Jenkins
1. 每次你 push 到 GitHub
2. 自动 clone 代码
3. 执行
```plain
bash


复制编辑
mvn clean package
```

4. 如果构建成功，自动复制 JAR 包到服务器某路径
5. 自动重启后端服务容器
6. 同时发个通知到你的邮箱或钉钉群

**这就是持续交付的流程，完全自动，无需人工干预。**

---

## 🔍 所以 Jenkins 克隆仓库不是目的，是起点！
代码只是第一步，之后你定义构建、测试、部署、监控……整个自动化流程。

---

## ✅ 如果你告诉我这些，我可以给你实用的 Jenkins 示例
+ 你的项目语言（Java / Node / Python / Docker / Go 等）
+ 你希望自动做哪些事（测试 / 构建 / 上传 / 部署）
+ 你服务器环境是怎样的（Linux？用 Docker？部署在哪里？）

我可以一步步帮你构建一个真正“自动化上线”的流程 💡

你现在的 Jenkins 可以远不止 clone 仓库这么简单。现在我们就可以开始搭建一个真正有用的工作流。是否继续？

##### 您说
哦哦，也就是类似于腾讯云提供的coding嘛，就是我写了代码然后上传到了github，然后呢jenkins就可以git clone 代码然后运行bash命令把后端部署到服务器上是吧

###### ChatGPT 说
完全正确！你理解得很到位 🎯

---

## ✅ 是的，Jenkins 的作用就和 **腾讯云 CODING 的持续集成功能** 类似
你提交代码，Jenkins 自动拉取 → 自动执行构建脚本 → 自动部署到你的服务器上。

---

### 🧩 简化一下整个流程
你平时
1. **写完代码 → push 到 GitHub**
2. **远程登录服务器**
3. `git pull`
4. `npm install` 或 `mvn package`
5. 启动服务：`pm2 restart` / `java -jar xxx.jar` / `docker-compose up`...

---

Jenkins 来了之后
✅ **你只需要 push 到 GitHub，剩下的它全自动干！**

---

## 🔧 Jenkins 常见的自动任务有
| 场景 | Jenkins 操作 |
| --- | --- |
| Node 项目 | `npm install && npm run build && pm2 restart` |
| Java 后端 | `mvn clean package && java -jar target/*.jar` |
| Python 服务 | `pip install -r requirements.txt && python app.py` |
| Docker 项目 | `docker build . && docker run ...` |
| Vue/Nuxt 前端 | `npm run build && 上传到 Nginx 目录` |
| 自动部署 | 复制构建产物到生产目录 / 上传阿里云 OSS |
| 通知 | 构建失败/成功后自动发邮件、钉钉/企业微信通知 |


---

## 🧠 Jenkins 比 Coding 的好处是
| Jenkins | Coding |
| --- | --- |
| **你完全掌控**，自己写构建脚本 | 基于平台封装，灵活性有限 |
| 支持所有你想干的事（脚本、docker、k8s、GitOps） | UI 方便，但复杂部署限制多 |
| 可部署在你自己的服务器上 | 不受平台限制 |


---

## 🚀 下一步建议
如果你想让 Jenkins
+ 自动部署你这个 `InkwaveDocNet-backend` 项目
+ 每次你更新代码，它就自动构建并重启后端服务

我可以帮你写一份 **Jenkins Shell 脚本** 或 **Pipeline 脚本（Jenkinsfile）**。

只需要你告诉我
1. 项目是啥语言？（Node / Java / Python？）
2. 有没有用 Docker？怎么部署？
3. 构建命令是啥？
4. 服务是如何启动的？

你说出这几项，我就能立即帮你写一个能跑起来的 Jenkins 自动化部署流程 💡

##### 您说
那这个岂不是一个自动化脚本的一个集成应用？，那么这个jenkins岂不是还内置了maven，gradle，以及其他语言开发的比如nodejs等众多环境？

###### ChatGPT 说
你说得很对，Jenkins 本质上就是一个 **“自动化脚本的集成调度平台”**，也可以理解为
一个会帮你定时、触发、执行你写的脚本，并把结果记录下来、可视化展示，还能自动通知你的人。

不过你提到的一个很关键的问题
---

## ❓ Jenkins 是不是自带 Maven、Node.js、Gradle 等开发环境？
### ⚠️ 答案是：**不是默认内置的**。你需要 **手动安装或配置**。
---

### ✅ Jenkins 的逻辑是这样设计的
Jenkins 不自带构建工具，而是让你“告诉它用什么工具”，你可以通过以下几种方式告诉 Jenkins
---

## 🧰 方式一：在主机上（或容器中）提前安装环境
比如你在运行 Jenkins 的服务器里
+ 安装了 Java 和 Maven
+ 安装了 Node.js 和 npm
+ 安装了 Docker

那么 Jenkins 的 shell 脚本就可以直接执行这些命令，比如
```plain
bash


复制编辑
mvn clean package
npm run build
docker build -t your-image .
```

---

## 🔌 方式二：Jenkins 插件（支持配置环境）
Jenkins 可以通过插件，**集中管理工具版本**，包括
+ Maven Integration Plugin
+ Gradle Plugin
+ NodeJS Plugin
+ Python Plugin
+ Docker Plugin

安装这些插件后，你可以在 Jenkins 的“全局工具配置”中
+ 选择下载 Maven/Gradle 的指定版本
+ 自动安装 Node.js
+ 给这些工具设置别名，在 Job 中勾选使用

---

## 🧪 方式三：用 Docker 运行构建环境（更干净）
你可以让 Jenkins 在运行构建任务时，直接拉取一个含构建工具的 Docker 镜像
比如你要构建 Node 项目，可以让它跑在 `node:20` 镜像里执行
```plain
groovy


复制编辑
pipeline {
 agent {
 docker {
 image 'node:20'
 }
 }
 stages {
 stage('Build') {
 steps {
 sh 'npm install && npm run build'
 }
 }
 }
}
```

这就是 Jenkins 的 **Pipeline + Docker** 模式，非常干净、跨平台、版本固定。

---

## ✅ 总结你的理解
| 你的说法 | 实际情况 |
| --- | --- |
| Jenkins 是自动化脚本的集成平台 | ✅ 完全正确 |
| Jenkins 自带 Maven、Node 等环境 | ❌ 默认不带，但可以配置/插件/容器安装 |
| Jenkins 能自动部署项目 | ✅ 是它最核心的能力之一 |
| Jenkins 能适配多语言 | ✅ 几乎支持任何你能用脚本完成的事 |


---

📌 你可以选择
+ **直接在 Jenkins 宿主机安装工具**（简单直接）
+ **用 Jenkins 插件集中管理构建工具**（更清晰）
+ **用 Docker 镜像构建环境**（更标准化、可复制）

