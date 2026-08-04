# Docker 基本命令
## 系统信息命令
```bash
# 查看Docker版本和信息
docker --version
docker info
docker --help
```

## 镜像管理命令
```bash
# 拉取镜像
docker pull nginx:alpine
docker pull ubuntu:20.04

# 列出本地镜像
docker images
docker image ls

# 删除镜像
docker rmi nginx:alpine
docker image prune -a
```



## 容器管理命令
```bash
# 运行容器
docker run -d -p 8080:80 --name my-nginx nginx:alpine

# 常用选项
-d          # 后台运行
-p host:container  # 端口映射
--name      # 指定容器名称
-v          # 挂载数据卷
-it         # 交互式终端

# 容器生命周期
docker start my-nginx
docker stop my-nginx
docker restart my-nginx
docker rm my-nginx

# 查看容器状态
docker ps
docker ps -a
docker logs my-nginx
docker stats
```



## 容器交互
```bash
docker exec -it my-nginx /bin/bash
docker exec -it my-nginx sh

# 执行命令
docker exec my-nginx ls /var/www

# 复制文件
docker cp ./index.html my-nginx:/var/www/html/
```

## 网络管理
```bash
# 网络操作
docker network ls
docker network create my-network
docker network connect my-network my-nginx
```



## 数据卷管理
```bash
# 数据卷操作
docker volume ls
docker volume create my-data
docker volume prune
```



## 系统管理
```bash
# 系统清理
docker system df
docker system prune -a

# 批量操作
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)
```



## 实用命令组合
```bash
# 开发环境
docker run -d -p 3000:3000 -v $(pwd):/app --name dev-app node:16
docker exec -it dev-app bash
docker logs -f dev-app
```



### 使用 Docker 部署简单的静态网页
我们将通过以下步骤使用Docker创建一个简单的静态网页，并展示如何使用Docker命令管理镜像、容器、数据卷等。

## 1. 拉取 Nginx 镜像
我们将使用 `nginx` 镜像作为网页的服务器。首先，我们需要拉取最新的 Nginx 镜像。

```bash
# 拉取 nginx 镜像（alpine版本轻量化）
docker pull nginx:alpine
```

**命令说明：**

+ `docker pull nginx:alpine`：从Docker Hub拉取nginx镜像，选择alpine版本，体积更小。

## 2. 创建一个简单的网页文件
接下来，我们将在本地创建一个简单的HTML文件，内容可以是任意静态网页。

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to CodeOneZeroZero!</title>
  </head>
  <body>
    <h1>Hello, Docker World!</h1>
    <p>Visit us at: <a href="https://codeonezerozero.cn/">https://codeonezerozero.cn/</a></p>
  </body>
</html>
```

将上述内容保存为 `index.html` 文件。

## 3. 运行 Nginx 容器并挂载网页文件
使用 `docker run` 命令启动一个Nginx容器，并将我们本地的 `index.html` 文件挂载到容器中的 `/usr/share/nginx/html` 目录，以便在容器启动时能够提供该网页。

```html
# 运行 nginx 容器并挂载本地文件夹到容器内
docker run -d -p 8080:80 -v $(pwd)/index.html:/usr/share/nginx/html/index.html --name my-nginx nginx:alpine
```

**命令说明：**

+ `docker run -d -p 8080:80`：后台运行容器，并将本地的8080端口映射到容器的80端口。
+ `-v $(pwd)/index.html:/usr/share/nginx/html/index.html`：将当前目录的 `index.html` 文件挂载到容器内的 Nginx 默认网页目录。
+ `--name my-nginx`：为容器指定名称为 `my-nginx`。
+ `nginx:alpine`：指定使用的镜像是 `nginx:alpine`。

现在，你可以在浏览器中访问 `http://localhost:8080` 查看你部署的网页。

## 4. 查看和管理容器
你可以使用 `docker ps` 命令查看容器状态，确认容器正在运行。

```plain
# 查看当前运行的容器
docker ps
```

**命令说明：**

+ `docker ps`：列出所有正在运行的容器。

如果需要查看所有容器（包括已停止的容器），可以使用 `docker ps -a`。

```plain
docker ps -a
```

## 5. 容器日志和状态监控
你可以查看容器的日志输出，了解容器的运行情况。

```plain
# 查看 my-nginx 容器的日志
docker logs my-nginx
```

**命令说明：**

+ `docker logs my-nginx`：查看 `my-nginx` 容器的日志。

还可以使用 `docker stats` 来查看容器的资源使用情况。

```plain
docker stats my-nginx
```

**命令说明：**

+ `docker stats`：实时显示容器的 CPU、内存、网络等资源使用情况。

如果你只想查看一次性数据而不进行持续更新，可以使用 `--no-stream` 选项：

```html
docker stats --no-stream my-nginx
```

## 6. 容器交互
你可以进入容器内部进行调试或修改网页内容。

```plain
# 进入容器的交互式bash终端
docker exec -it my-nginx sh
```

**命令说明：**

+ `docker exec -it my-nginx /bin/bash`：以交互式方式进入名为 `my-nginx` 的容器。

在容器内部，你可以修改网页文件，或者进行其他操作。

## 7. 停止、重启和删除容器
当你不再需要容器时，可以停止、重启或删除它。

```plain
# 停止容器
docker stop my-nginx

# 重启容器
docker restart my-nginx

# 删除容器
docker rm my-nginx
```

**命令说明：**

+ `docker stop my-nginx`：停止运行的容器。
+ `docker restart my-nginx`：重启容器。
+ `docker rm my-nginx`：删除容器。

## 8. 清理未使用的镜像和容器
当你不再使用某些镜像或容器时，可以使用以下命令进行清理。

```plain
# 删除未使用的镜像
docker image prune -a

# 删除所有停止的容器
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)
```

**命令说明：**

+ `docker image prune -a`：删除所有未被使用的镜像。
+ `docker stop $(docker ps -aq)`：停止所有容器。
+ `docker rm $(docker ps -aq)`：删除所有停止的容器。

## 9. 使用数据卷持久化数据
如果你的网页文件需要保留在容器之间，最好使用数据卷来持久化数据

#### 1. 创建数据卷
首先，创建一个数据卷。数据卷是 Docker 用来存储和持久化数据的机制，可以跨容器共享数据。

```plain
docker volume create my-data
```

**命令说明：**

+ `docker volume create my-data`：创建名为 `my-data` 的数据卷。

#### 2. 使用数据卷启动容器
接下来，我们启动一个 Nginx 容器并挂载数据卷，将数据卷挂载到容器的 `/usr/share/nginx/html` 目录。这样，当你在容器中修改网页文件时，数据会被保存在数据卷中。

```plain
docker run -d -p 8080:80 -v my-data:/usr/share/nginx/html --name my-nginx nginx:alpine
```

**命令说明：**

+ `docker run -d -p 8080:80`：后台运行容器，并将本地的8080端口映射到容器的80端口。
+ `-v my-data:/usr/share/nginx/html`：将创建的 `my-data` 数据卷挂载到容器中的 Nginx 默认网页目录 `/usr/share/nginx/html`。网页文件会保存在这个数据卷中。
+ `--name my-nginx`：为容器指定名称为 `my-nginx`。
+ `nginx:alpine`：指定使用的镜像是 `nginx:alpine`。

#### 3. 查看和修改网页文件
如果你现在在浏览器中访问 `http://localhost:8080`，你会看到默认的 Nginx 欢迎页面。你可以进入容器并修改网页内容。

```plain
docker exec -it my-nginx sh
```

然后进入网页目录并编辑文件：

```plain
cd /usr/share/nginx/html
echo "Hello, Docker World!" > index.html
```

**命令说明：**

+ 进入容器，进入 `/usr/share/nginx/html` 目录。
+ 修改 `index.html` 文件的内容。

此时，你再次访问 `http://localhost:8080` 时，会看到新的网页内容。

#### 4. 停止并删除容器
假设你现在停止并删除容器，但数据卷中的数据会保留。

```plain
docker stop my-nginx
docker rm my-nginx
```

**命令说明：**

+ `docker stop my-nginx`：停止运行的容器。
+ `docker rm my-nginx`：删除容器。

#### 5. 重新启动容器并挂载相同的数据卷
重新启动一个容器，并使用同样的数据卷 `my-data`。由于数据卷中的网页文件被保留，容器会再次提供你修改过的网页内容。

```plain
docker run -d -p 8080:80 -v my-data:/usr/share/nginx/html --name my-nginx nginx:alpine
```

再次访问 `http://localhost:8080`，你会看到之前修改过的网页内容。

### 总结
使用数据卷的作用在于：

1. 数据卷能够确保容器停止或删除后，数据（如网页文件）不会丢失。
2. 数据卷可以跨容器共享数据，因此多个容器可以访问相同的文件。
3. 数据卷提供了持久化存储，避免了容器生命周期带来的数据丢失问题

