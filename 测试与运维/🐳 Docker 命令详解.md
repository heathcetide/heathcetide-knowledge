## 什么是Docker容器？
Docker容器是Docker镜像的运行实例，它是一个轻量级、可移植的软件包，包含了运行应用程序所需的所有内容。容器可以启动、停止、移动和删除。

## 容器生命周期
```plain
         创建  → 启动  →  运行  →  停止  → 删除
          ↓      ↓        ↓        ↓      ↓
docker create → start → running → stop → rm
```

## 容器创建和启动
### 1. 创建容器
```bash
# 创建容器但不启动
docker create --name my-container nginx:alpine

# 创建并启动容器
docker run -d --name my-nginx nginx:alpine

# 创建交互式容器
docker run -it --name my-ubuntu ubuntu:20.04 /bin/bash
```

### 2. 常用运行选项
```bash
docker run [选项] 镜像 [命令]

# 常用选项说明
-d          # 后台运行（分离模式）
-it         # 交互式终端
--name      # 指定容器名称
-p          # 端口映射
-v          # 挂载数据卷
-e          # 设置环境变量
--rm        # 容器停止后自动删除
--restart   # 重启策略
--network   # 指定网络
--memory    # 内存限制
--cpus      # CPU限制
```

### 3. 端口映射
```bash
# 基本端口映射
docker run -p 8080:80 nginx:alpine

# 指定主机IP
docker run -p 127.0.0.1:8080:80 nginx:alpine

# 随机端口映射
docker run -P nginx:alpine

# 多个端口映射
docker run -p 8080:80 -p 8443:443 nginx:alpine
```

### 4. 数据卷挂载
```bash
# 挂载主机目录
docker run -v /host/path:/container/path nginx:alpine

# 挂载数据卷
docker run -v my-volume:/app/data nginx:alpine

# 只读挂载
docker run -v /host/path:/container/path:ro nginx:alpine

# 挂载单个文件
docker run -v /host/file.txt:/container/file.txt nginx:alpine
```

## 📊 容器状态管理
### 1. 查看容器状态
```bash
# 查看运行中的容器
docker ps

# 查看所有容器（包括停止的）
docker ps -a

# 查看容器详细信息
docker inspect my-container

# 查看容器日志
docker logs my-container
docker logs -f my-container  # 实时跟踪
docker logs --tail 100 my-container  # 最后100行
```

### 2. 容器操作命令
```bash
# 启动容器
docker start my-container

# 停止容器
docker stop my-container
docker kill my-container  # 强制停止

# 重启容器
docker restart my-container

# 暂停/恢复容器
docker pause my-container
docker unpause my-container

# 删除容器
docker rm my-container
docker rm -f my-container  # 强制删除
```

### 3. 容器资源监控
```bash
# 查看容器资源使用情况
docker stats

# 查看特定容器
docker stats my-container

# 实时监控
docker stats --no-stream

# 查看容器进程
docker top my-container
```

## 🔧 容器交互和调试
### 1. 进入运行中的容器
```bash
# 进入容器bash
docker exec -it my-container /bin/bash

# 进入容器sh
docker exec -it my-container /bin/sh

# 以特定用户身份进入
docker exec -it -u root my-container /bin/bash

# 执行单条命令
docker exec my-container ls /app
docker exec my-container cat /etc/hosts
```

### 2. 文件操作
```bash
# 从容器复制文件到主机
docker cp my-container:/app/file.txt ./file.txt

# 从主机复制文件到容器
docker cp ./file.txt my-container:/app/file.txt

# 复制目录
docker cp my-container:/app/config ./config
```

### 3. 容器调试技巧
```bash
# 查看容器日志
docker logs -f --tail 100 my-container

# 查看容器配置
docker inspect my-container | grep -A 10 "Config"

# 查看容器网络配置
docker inspect my-container | grep -A 20 "NetworkSettings"

# 查看容器挂载点
docker inspect my-container | grep -A 10 "Mounts"
```

## 🌐 容器网络管理
### 1. 网络模式
```bash
# 桥接模式（默认）
docker run --network bridge nginx:alpine

# 主机模式
docker run --network host nginx:alpine

# 无网络模式
docker run --network none nginx:alpine

# 自定义网络
docker run --network my-network nginx:alpine
```

### 2. 网络连接
```bash
# 连接到网络
docker network connect my-network my-container

# 断开网络连接
docker network disconnect my-network my-container

# 查看容器网络
docker network inspect bridge
```

## 容器数据管理
### 1. 数据卷操作
```bash
# 创建数据卷
docker volume create my-data

# 查看数据卷
docker volume ls
docker volume inspect my-data

# 删除数据卷
docker volume rm my-data
docker volume prune  # 删除未使用的数据卷
```

### 2. 数据持久化策略
```bash
# 命名卷（推荐）
docker run -v my-data:/app/data nginx:alpine

# 绑定挂载
docker run -v $(pwd):/app nginx:alpine

# 临时文件系统
docker run --tmpfs /tmp nginx:alpine
```

## 容器安全配置
### 1. 用户权限
```bash
# 以非root用户运行
docker run -u 1000:1000 nginx:alpine

# 设置用户和组
docker run -u user:group nginx:alpine

# 只读文件系统
docker run --read-only nginx:alpine
```

### 2. 资源限制
```bash
# 内存限制
docker run --memory 512m nginx:alpine
docker run --memory 1g --memory-swap 2g nginx:alpine

# CPU限制
docker run --cpus 2.0 nginx:alpine
docker run --cpuset-cpus 0,1 nginx:alpine

# 磁盘I/O限制
docker run --device-read-bps /dev/sda:1mb nginx:alpine
```

### 3. 安全选项
```bash
# 禁用特权模式
docker run --security-opt no-new-privileges nginx:alpine

# 设置安全策略
docker run --cap-drop ALL --cap-add NET_BIND_SERVICE nginx:alpine

# 设置SELinux标签
docker run --security-opt label=type:container_runtime_t nginx:alpine
```

## 高级容器操作
### 1. 容器更新和迁移
```bash
# 更新容器配置
docker update --memory 1g my-container

# 重命名容器
docker rename old-name new-name

# 导出容器
docker export my-container > container.tar

# 导入容器
cat container.tar | docker import - my-image:tag
```

### 2. 容器快照
```bash
# 创建容器快照
docker commit my-container my-image:snapshot

# 从快照恢复
docker run -it my-image:snapshot /bin/bash
```

### 3. 批量操作
```bash
# 停止所有容器
docker stop $(docker ps -q)

# 删除所有停止的容器
docker container prune

# 删除所有容器
docker rm -f $(docker ps -aq)

# 清理所有未使用的资源
docker system prune -a
```

