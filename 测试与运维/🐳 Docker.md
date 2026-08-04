# Docker 基础概念 
## 什么是Docker？
<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/png/43218187/1759542646251-d88c350b-312a-4076-8f8f-4881db3d65d4.png)

Docker是一个开源的容器化平台，是目前最成熟高效的软件部署技术，它允许开发者将应用程序和其依赖项打包到一个称为"容器"的标准化单元中。

简单来说Docker就是给应用程序封装了独立的运行环境，每一个运行环境就是一个容器，运行容器的计算机被称为宿主机。

### 需要**学习Docker的群体**
需要学习Docker的群体包括：

+ **前后端开发者**：了解如何快速构建、部署和管理应用。
+ **运维工程师**：掌握如何在生产环境中利用Docker容器进行服务部署与管理。
+ **系统架构师**：设计和优化容器化微服务架构的解决方案。
+ **测试人员**：使用Docker为自动化测试提供一致的环境。

## Docker的核心价值
+ **一致性**: 开发、测试、生产环境完全一致
+ **隔离性**: 每个容器都有独立的运行环境
+ **可移植性**: 一次构建，到处运行
+ **轻量级**: 比传统虚拟机更轻量

## 容器 vs 虚拟机
| 特性 | 容器 | 虚拟机 |
| --- | --- | --- |
| 启动时间 | 秒级 | 分钟级 |
| 资源占用 | 很少 | 较多 |
| 隔离级别 | 进程级 | 系统级 |


<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/png/43218187/1759543603617-33d1cb22-197e-4322-8cf4-f75d5bb1eef8.png)                               <!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2025/png/43218187/1759543763170-1db1a811-46f8-4123-a9a9-2aceffa3ed82.png)

Docker与虚拟机最大的区别就是Docker容器之间共用一套系统内核，而虚拟机每一个都包含了一个操作系统的完整内核，所以Docker容器比起虚拟机更轻量，更小，启动的速度也更快

## Docker架构组成
1. **Docker Daemon**: 后台服务进程
2. **Docker Client**: 命令行工具
3. **Docker Registry**: 镜像仓库
4. **Docker Images**: 容器模板
5. **Docker Containers**: 运行实例

<!-- 这是一个文本绘图，源码为：graph TD
    A[用户] --> B[Docker Client]
    B --> C[Docker Daemon]
    C --> D[Docker Images]
    C --> E[Docker Registry]
    C --> F[Docker Containers]
    F --> C[管理容器状态]
    E --> C[推送/拉取镜像]
    D --> C[获取镜像] -->
![](https://cdn.nlark.com/yuque/__mermaid_v3/9d89d0b38cb99b3d93363edf83ad8606.svg)

这里我们讲一下**镜像、容器、镜像仓库**的概念，

+ **镜像**可以看作是一个软件的安装包，可以看作是一个模具
+ **容器**是安装出来的软件，可以看作是模具压出来的月饼
+ Docker**镜像仓库**是用来分享和存储镜像的地方，每个人都可以上传自己的镜像然后供给自己和其他人进行拉取和使用
+ Docker的官方仓库就是DockerHub（hub.docker.com）

## Docker工作流程
1. 编写Dockerfile
2. 构建镜像
3. 推送镜像到仓库
4. 拉取镜像到目标机器
5. 运行容器

---

**下一步**: 学习Docker的安装与配置！🐳✨

<!-- 这是一个文本绘图，源码为：graph TD
    A[Docker学习起点] --> B[基础概念理解]
    B --> C[环境搭建]
    C --> D[基本操作]
    D --> E[镜像管理]
    E --> F[容器管理]
    F --> G[网络配置]
    G --> H[数据持久化]
    H --> I[Dockerfile编写]
    I --> J[Docker Compose]
    J --> K[容器编排]
    K --> L[安全最佳实践]
    L --> M[生产环境部署]
    M --> N[Docker专家] -->
![](https://cdn.nlark.com/yuque/__mermaid_v3/742fdbf857393ac94595f7d492f16c88.svg)





# Docker 安装与配置
## 系统要求
+ **Linux**: Ubuntu 18.04+, CentOS 7+
+ **Windows**: Windows 10/11 专业版+
+ **macOS**: macOS 10.15+
+ **硬件**: 4GB+ RAM, 20GB+ 存储空间

## Linux 安装
### Ubuntu/Debian
```bash
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io
sudo systemctl start docker
sudo systemctl enable docker
```

### CentOS/RHEL
```bash
sudo yum install docker-ce docker-ce-cli containerd.io
sudo systemctl start docker
sudo systemctl enable docker
```

## Windows 安装
1. 下载 [Docker Desktop for Windows](https://docs.docker.com/desktop/windows/install/)
2. 启用Hyper-V和WSL2
3. 运行安装程序并重启
4. 启动Docker Desktop

## macOS 安装
1. 下载 [Docker Desktop for Mac](https://docs.docker.com/desktop/mac/install/)
2. 双击.dmg文件安装
3. 启动Docker Desktop

## 基础配置
### 用户权限配置
```bash
sudo usermod -aG docker $USER
newgrp docker
```

### 镜像加速器配置
```json
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com"
  ]
}
```

## 验证安装
```bash
docker --version
docker run hello-world
```

## 常见问题
+ **权限问题**: 将用户添加到docker组
+ **服务启动失败**: 检查系统日志
+ **镜像拉取失败**: 配置镜像加速器

---

**下一步**: 学习Docker基本命令！🐳✨







