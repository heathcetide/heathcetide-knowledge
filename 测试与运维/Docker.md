### Docker 简介(快速构建，运行，管理应用的工具)

Docker 是一个开源平台，允许开发人员构建、测试和部署应用程序。它使用容器技术来将应用程序及其依赖项打包在一个可移植的容器中。与虚拟机相比，Docker 容器更加轻量级，启动速度更快，可以在任何环境中一致地运行。这里可以距离，比如在Centos系统下安装这个mysql，又要先卸载MySQL,又要下载一大堆的MySQL配置和配置字符集的操作，这就非常麻烦了，而docker这种一条龙服务将会非常的快。如果后期需要布置微服务项目的话，可能还需要用到K8s这种容器编排技术(更高阶的运维技术)

#### Docker 的核心概念：

- **镜像（Image）**：一个只读的模板，用于创建容器，通常包含应用程序及其依赖。
- **容器（Container）**：镜像的可运行实例，具有自己的文件系统和网络。
- **Dockerfile**：一种文本文件，包含构建 Docker 镜像所需的指令。
- **Docker Hub**：一个公共的镜像仓库，可以分享和存储 Docker 镜像。

我们利用Docker安装应用时，Docker会自动搜索并且下载应用**镜像**，镜像不仅包含应用本身，还包含应用运行所需要的环境，配置，系统函数库，Docker会在运行镜像时创建一个隔离环境，称为**容器**。

**镜像仓库**：存储和管理镜像的平台，Docker官方维护了一个公共仓库：DockerHub。

```
hub.docker.com
```

### 命令的解读：

```
	sudo docker run -itd -p 3306:3306  \
		-e MYSQL_ALLOW_EMPTY_PASSWORD="root" \
		--name mysql \
		-d registry.cn-hangzhou.aliyuncs.com/ykd_project/mysql:8.0 \
		--character-set-server=utf8 \
		--collation-server=utf8_general_ci \
		--default-authentication-plugin=mysql_native_password \
		--lower-case-table-names=1

  sudo docker run -d \
    --name mysql \
    -p 3306:3306 \
    -e MYSQL_ROOT_PASSWORD= 1234 \
    mysql
```

**docker run** ： 创建兵运行一个容器，**-d**是让容器在后台运行。

**--name mysql**： 给容器起一个名字，必须唯一

**-p 3306:3306** : 是端口映射,前者是宿主机端口，后者是容器内端口（容器内端口取决于进程，这个是不需要改变的）

**-e KEY=VALUE** : 配置环境变量(去官方查询即可)

**mysql** ： 指定运行的镜像的名字

### 镜像命名规范：

镜像名称一般分为两个部分： [repository] : [tag].

其中repository就是镜像名字

tag是镜像的版本

也就是： mysql:5.7,当然，如果冒号后面的tag没有写的话就会默认为latest最新版

#### Docker常见命令

主要就是用来操作镜像和容器的命令

**1.单独下载镜像的命令**： docker pull

**2.查看镜像是否真的下载下来了**： docker images

**3.删除镜像**： docker rmi

**4.自己构建镜像**： 先自己定义一个DockerFile，然后基于DockerFile进行Docker Build来完成构建

**5.保存项目变成压缩包**： docker save

**6.把项目加载到镜像中**： docker load

**7.前面的方式用的比较少**，大多数情况下只需要使用docker push命令推送到镜像仓库即可

**8.创建容器并且允许**： docker run （每次都会创建一个新的）

**9.停止容器的进程**： docker stop

**10.启动容器进程**： docker start

**11.查看进程状态**：docker ps

**12.删除容器：** docker rm

**13.查看docker运行的日志**： docker logs

**14.执行一些命令进入容器的内部**： docker exec

![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1731831782598-8ca9de0a-7efc-4e74-a79a-230ceb22bf10.png)

![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1731832047250-f2e273a5-4cea-4a81-9453-9caf43bcf4a3.png)

尝试练习：

```
docker pull nginx

docker images

(保存到本地变成压缩文件 docker save --help)docker save -o nginx.tar nginx:latest文件名称

docker rmi nginx:latest(删除镜像)

docker images

（加载镜像）docker load -i nginx.tar 

docker images

docker run -d --name nginx -p 80:80 nginx

docker ps

docker stop nginx

docker start nginx

docker ps

docker logs nginx

strl + c 停止

（进入容器内部）dockers exec -it nginx bash (-it 提供一个可交互的终端)

（退出容器内部）exec

比如使用mysql的情况下：
docker exec -it mysql bash
mysql -uroot -p
exec
```

linux的使用技巧

docker ps --format "table {{.ID}}\t{{.Image}}\t{{.Ports}}\t{{.Status}}\t{{.Names}}"

#### 数据卷

![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1731833176554-45a0e05c-e5de-4126-a9d9-f286ecc808f0.png)

在user/share/nginx/html#目录下

![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1731833253849-a42332c9-f064-40a6-bfb5-5667fdabb650.png)

在容器内修改非常麻烦，很多命令都没有

**数据卷**是一个虚拟目录，是容器内目录与宿主机目录之间映射的桥梁，可以简化对镜像中的文件的修改

![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1731833464582-e8954ed9-30ae-4d72-846e-5240135ead34.png)

使用docker volumn --help即可看到所有关于数据卷的命令

![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1731833609139-18702d2d-e150-4a9d-894d-a7930eb910ae.png)

提示：

在执行docker run命令的时候，使用-v 数据卷：容器内目录，可以完成数据卷挂载

当创建容器的时候，如果挂载了数据卷且数据卷不存在，会自动创建数据卷

```
例子：
docker run -d --name nginx -p 80:80 -v html:/usr/share/nginx/html nginx
docker volumn ls
docker volumn inspect html

cd ......
```

**什么是数据卷？**

数据卷是一个虚拟目录，它将宿主机目录映射到容器内目录，方便我们操作容器内文件，或者迁移容器产生的数据

如何挂载数据卷？

在创建容器时，利用-v 数据卷 ： 容器内目录完成挂载

容器创建时，如果发现挂载的数据卷不存在时，会自动创建

数据卷的常见命令有哪些？

docker volumn ls 查看数据卷

docker volumn rm 删除数据卷

docker volumn inspect 查看数据卷详细

docker volumn prune 删除未使用的数据卷

![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1731834202787-ec9fa404-3255-4c38-87af-226c3caec555.png)

**自定义镜像：**

镜像就是包含了应用程序，程序运行的系统函数库，运行配置等文件的文件包。构建镜像的过程其实就是把上述文件打包的过程.

![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1731835282217-623b68bd-b871-46b3-8512-627704f5f1bc.png)

编写一个可以直接运行的java程序需要这些东西，很多个压缩包合并起来，也就是层

分层打包好处：

1.可以共享基础的层（基础镜像：应用依赖的系统函数库，环境，配置，文件等）

![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1731848509208-6fc85290-a12f-4eb3-acaa-681148300f79.png)

构建Dockerfile：

![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1731848546202-eb3f5651-16c6-4548-972c-eec22ec041ff.png)

使用Dockerfile

```
#指定基础镜像
FROM ubuntu:16.04
#配置环境变量，JDK的安装目录，容器内时区
ENV JAVA_DIR = /usr/local
#拷贝JDK和java项目的包
COPY ./jdk8.tar.gz $JAVA_DIR/
COPY ./docker-demo.jar /tmp/app.jar
#安装JDK
RUN cd $JAVA_DIR \ && tar -xf ./jdk8.tar.gz \
    && mv ./jdk1.8.0_144 ./java8 \
#配置环境变量 \
ENV JAVA_HOME = $JAVA_DIR/java8
ENV PATH= $PATH:$JAVA_HOME/bin
#入口，java项目的启动命令
ENTRYPOINT ["java","-jar","/tmp/app.jar"]



#我们可以基础Ubuntu基础镜像，利用Dockerfile描述和镜像结构，也可以直接基于JDK为基础镜像，省略前面的步骤
#基础镜像
FROM openjdk:11.0-jre-buster
#拷贝jar包到镜像
COPY ./docker-demo.jar /tmp/app.jar
#入口·
ENTRYPOINT ["java","-jar","/tmp/app.jar"]
```

标准项目（go语言的）

```
FROM golang:1.22-bookworm as builder
RUN mkdir /build
ADD . /build/
WORKDIR /build
ENV CGO_ENABLED=1 GO111MODULE=on GOPROXY=https://goproxy.cn
RUN ln -fs /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN go mod tidy && go mod download
RUN go test ./...
RUN cd cmd && \
    GIT_COMMIT=$(git rev-list -1 HEAD) && \
    BUILD_TIME=$(date "+%Y-%m-%d_%H:%M:%S") && \
    go build -ldflags "-X main.GitCommit=$GIT_COMMIT -X main.BuildTime=$BUILD_TIME" \
    -o /build/piaojuhe .

FROM debian:bookworm
LABEL maintainer="admin@ruzhila.cn"
RUN sed -i 's/deb.debian.org/mirrors.aliyun.com/g' /etc/apt/sources.list.d/debian.sources
RUN apt-get update && apt-get install -y ca-certificates tzdata
ENV DEBIAN_FRONTEND noninteractive
ENV LANG C.UTF-8

RUN ln -fs /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

WORKDIR /app
COPY --from=builder /build/piaojuhe /app/

EXPOSE 8000
ENTRYPOINT ["/app/piaojuhe"]%
```

我们可以基础Ubuntu基础镜像，利用Dockerfile描述镜像结构，也可以直接基于JDK为基础镜像，省略前面的步骤：

当编写好了Dockerfile，可以利用下面的命令来构建镜像

```
docker build -t myImage:1.0 .
```

-t 是给镜像起名字，格式依旧是repository:tag的格式，不指定tag的时候，默认为latest

. :是指定Dockerfile所在目录，如果就在当前目录，则指定为"."

运行命令：

![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1731849955930-524d9658-3f90-40bc-9f52-57bfed454852.png)

使用dps命令查看运行状态

然后使用docker log -f dd即可

#### 镜像的结构是怎样的？

镜像中包含了应用程序所需要的运行环境，函数库，配置，以及应用本身等各种文件，这些文件分层打包而成。

#### Dockerfile是做什么的？

Dockerfile就是利用固定的指令来描述镜像的结构和构建过程，这样Docker才可以一次来构建镜像

#### 构建镜像的命令是什么？

docker build -t 镜像名 Dockerfile 目录

### Docker网络

容器之间能不能相互访问呢？每个容器都有自己的网络配置和ip地址，每个容器之间是在同一网段的，他们是可以相互访问的，默认情况下，所有容器都是以bridge方式连接到Docker的一个虚拟网桥上：  
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1731850438103-1aa8d608-392c-4a66-b4bc-7af3b612276c.png)

Docker网络操作命令:

![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1731850565170-8ee5254e-0167-4aef-a84e-e6edc41465da.png)

### DockerCompose:

手动部署比较麻烦，需要手动构建为镜像，并且没有体现项目的整体性。

DockerCompose 通过一个单独的docker-compose.yml模板文件（yaml格式）来定义一组相关联的应用容器，帮助我们实现多个相互关联的Docker容器的快速部署

![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1731851145246-ab959dd8-2c8a-4a0b-9402-d60bf13fa07b.png)

![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1731851242991-d78154f5-90e3-4e28-a64a-d9a289e0a894.png)

![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1731851383600-39b5812e-87ce-468c-a43b-0e21a9fcc79a.png)

Docker Compose的命令格式如下：

![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1731851443979-9f806ab9-4e3c-46ab-a1ac-3c88692aa67d.png)

### 在Ubuntu中安装Docker

在 Ubuntu 中安装 Docker 可以通过以下步骤完成：

更新软件包索引：

```
   sudo apt-get update
```

安装必要的依赖包：

```
   sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
```

添加 Docker 的官方 GPG 密钥：

```
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
```

设置 Docker 稳定版仓库：

```
   echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

再次更新软件包索引：

```
   sudo apt-get update
```

安装 Docker Engine：

```
   sudo apt-get install -y docker-ce docker-ce-cli containerd.io
```

验证 Docker 是否安装成功：

```
   sudo docker run hello-world
```

以上步骤完成后，Docker 应该已经成功安装在你的 Ubuntu 系统上。如果需要将当前用户添加到 docker 用户组以便无需使用 sudo 运行 Docker 命令，可以执行以下命令：

```
sudo usermod -aG docker ${USER}
```

然后注销并重新登录，使更改生效。

### 如何使用 Docker

#### 1. 安装 Docker

在 Linux、Windows 或 macOS 上安装 Docker。你可以访问 [Docker官方网站](https://www.docker.com/) 获取安装包和安装说明。

#### 2. 验证安装

打开终端，输入以下命令验证 Docker 是否成功安装：

```
docker --version
或者使用
docker -v
```

使用docker images没有效果：

需要启动进程

![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1731817268020-a6bb5e0d-4d1d-4287-9e60-85dc88842c01.png)

```
#启动docker
systemctl start docker

#停止docker
systemctl stop docker

#重启
systemctl restart docker

#设置开机自启
systemctl enable docker

#执行docker ps 命令，如果不报错，说明安装启动成功
docker ps
```

#### 3. 使用 Docker 命令

- **拉取镜像**：

```
docker pull ubuntu
```

- **查看本地镜像**：

```
docker images
```

- **运行容器**：

```
bash


复制代码
docker run -it ubuntu /bin/bash
```

- **查看运行中的容器**：

```
docker ps
```

- **停止容器**：

```
bash


复制代码
docker stop <container_id>
```

- **删除容器**：

```

docker rm <container_id>
```

- **删除镜像**：

```

docker rmi <image_id>
```

**分析docker安装MySQL**

```
	sudo docker run -itd -p 3306:3306  \
		-e MYSQL_ALLOW_EMPTY_PASSWORD="root" \
		--name mysql \
		-d registry.cn-hangzhou.aliyuncs.com/ykd_project/mysql:8.0 \
		--character-set-server=utf8 \
		--collation-server=utf8_general_ci \
		--default-authentication-plugin=mysql_native_password \
		--lower-case-table-names=1
```

### 在 Java 后端中使用 Docker

#### 1. 创建一个简单的 Java 应用

首先，创建一个简单的 Java 应用，例如一个 RESTful 服务，使用 Spring Boot 框架。

**pom.xml** 示例：

```
xml


复制代码
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>
```

**主应用类**：

```
java


复制代码
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class DemoApplication {

    @GetMapping("/hello")
    public String hello() {
        return "Hello, Docker!";
    }

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
```

#### 2. 创建 Dockerfile

在项目根目录下创建 `Dockerfile`：

```
Dockerfile


复制代码
# 使用 OpenJDK 作为基础镜像
FROM openjdk:11-jre-slim

# 将构建的 JAR 文件复制到容器中
COPY target/demo-0.0.1-SNAPSHOT.jar app.jar

# 运行 Java 应用
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

#### 3. 构建 Docker 镜像

在项目根目录下运行以下命令：

```
bash


复制代码
mvn clean package
docker build -t demo-app .
```

#### 4. 运行 Docker 容器

```
bash


复制代码
docker run -p 8080:8080 demo-app
```

访问 `http://localhost:8080/hello` 查看应用是否正常运行。

### 在云服务器上使用 Docker

如果您在云服务器上（如 AWS、Azure 或其他提供商）使用 Docker，可以按照以下步骤操作：

1. **登录云服务器**：使用 SSH 登录到您的云服务器。
2. **安装 Docker**：按照之前提到的安装步骤在云服务器上安装 Docker。
3. **部署应用**：

- 将构建好的 Docker 镜像推送到 Docker Hub：

```
bash


复制代码
docker login
docker tag demo-app <your-dockerhub-username>/demo-app
docker push <your-dockerhub-username>/demo-app
```

- 在云服务器上拉取镜像并运行：

```

docker pull <your-dockerhub-username>/demo-app
docker run -d -p 8080:8080 <your-dockerhub-username>/demo-app
```

4. **访问应用**：通过云服务器的 IP 地址和端口（如 `http://your-server-ip:8080/hello`）访问应用。

### 总结

Docker 是一个强大的工具，可以帮助开发者轻松构建、部署和管理应用。通过将 Java 应用容器化，您可以确保在不同环境中的一致性和可移植性。如果在使用 Docker 过程中有任何具体问题，欢迎随时询问！

对于前端项目，使用 Docker 的步骤与后端项目类似，但您需要处理的是前端构建和服务的配置。以下是使用 Docker 部署前端项目的步骤：

### 1. 创建一个前端项目

假设您使用 **React** 或 **Vue.js** 创建一个前端应用。以下示例将使用 **React**。

#### 创建一个 React 项目

首先，使用 Create React App 创建一个新的项目：

```
bash


复制代码
npx create-react-app my-app
cd my-app
```

### 2. 创建 Dockerfile

在项目的根目录下创建一个名为 `Dockerfile` 的文件，并添加以下内容：

```
Dockerfile


复制代码
# 使用 Node.js 作为基础镜像
FROM node:14 AS build

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制项目文件
COPY . .

# 构建应用
RUN npm run build

# 使用 Nginx 作为生产环境的服务器
FROM nginx:alpine

# 复制构建结果到 Nginx 的默认目录
COPY --from=build /app/build /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
```

### 3. 构建 Docker 镜像

在项目根目录下运行以下命令构建 Docker 镜像：

```

docker build -t my-react-app .
```

### 4. 运行 Docker 容器

使用以下命令运行 Docker 容器：

```

docker run -p 80:80 my-react-app
```

### 5. 访问应用

打开浏览器并访问 `http://localhost`，您应该能够看到您的 React 应用运行在 Nginx 服务器上。

### 在云服务器上部署前端项目

如果您在云服务器上使用 Docker 部署前端项目，可以按照以下步骤操作：

1. **登录云服务器**：使用 SSH 登录到您的云服务器。
2. **安装 Docker**：如果尚未安装 Docker，请参考前面提到的安装步骤。
3. **推送镜像到 Docker Hub**：

- 登录到 Docker Hub：

```
bash


复制代码
docker login
```

- 将镜像标记并推送到 Docker Hub：

```
bash


复制代码
docker tag my-react-app <your-dockerhub-username>/my-react-app
docker push <your-dockerhub-username>/my-react-app
```

4. **在云服务器上拉取镜像并运行**：

- 拉取镜像：

```
bash


复制代码
docker pull <your-dockerhub-username>/my-react-app
```

- 运行容器：

```
bash


复制代码
docker run -d -p 80:80 <your-dockerhub-username>/my-react-app
```

5. **访问应用**：通过云服务器的 IP 地址访问应用，例如 `http://your-server-ip`。

### 总结

使用 Docker 部署前端项目可以简化构建和部署流程，并确保环境的一致性。如果在使用 Docker 过程中有任何具体问题，欢迎随时询问！

当然，Docker 还有很多高阶的知识和最佳实践，可以帮助您更高效地管理和部署应用。以下是一些高级主题和概念：

### 1. Docker Compose

**Docker Compose** 是一个工具，用于定义和运行多容器 Docker 应用。通过 `docker-compose.yml` 文件，您可以描述应用的服务、网络和卷。

#### 示例：Docker Compose 文件

```
yaml


复制代码
version: '3'
services:
  web:
    build: .
    ports:
      - "80:80"
    volumes:
      - ./app:/usr/share/nginx/html
  db:
    image: postgres
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
```

您可以使用以下命令启动和停止应用：

```
bash


复制代码
docker-compose up
docker-compose down
```

### 2. Docker 网络

Docker 支持多种网络模式，例如 `bridge`、`host` 和 `overlay`。了解这些网络模式可以帮助您优化容器之间的通信和访问。

#### 创建自定义网络

```
bash


复制代码
docker network create my-network
```

在启动容器时指定网络：

```
bash


复制代码
docker run --network my-network my-app
```

### 3. 持久化数据

使用 Docker 卷（Volumes）来持久化数据，以确保数据在容器重启或删除后仍然存在。

#### 创建卷

```
bash


复制代码
docker volume create my-volume
```

#### 使用卷

```
bash


复制代码
docker run -v my-volume:/data my-app
```

### 4. Dockerfile 优化

通过合理的 Dockerfile 编写，可以减少镜像大小和构建时间。以下是一些优化技巧：

- **合并 RUN 指令**：将多个 `RUN` 指令合并为一个，以减少图层数量。

```
Dockerfile


复制代码
RUN apt-get update && apt-get install -y package1 package2
```

- **使用 .dockerignore 文件**：指定不需要复制到镜像中的文件，减少构建上下文。

### 5. CI/CD 集成

将 Docker 与持续集成/持续部署（CI/CD）流程结合，自动化构建和部署流程。例如，可以使用 GitHub Actions、GitLab CI 或 Jenkins 来构建和推送 Docker 镜像。

### 6. 安全最佳实践

确保 Docker 的安全性是至关重要的。以下是一些最佳实践：

- **最小化镜像**：使用轻量级基础镜像，如 `alpine`，以减少攻击面。
- **定期更新镜像**：保持镜像和容器的更新，以修复已知漏洞。
- **使用非特权用户**：在容器中以非 root 用户运行应用程序。

### 7. 监控和日志管理

监控 Docker 容器的运行状态和日志信息可以帮助您快速识别和解决问题。可以使用工具如 Prometheus、Grafana、ELK Stack（Elasticsearch, Logstash, Kibana）等来实现监控和日志管理。

### 8. 运行在 Kubernetes 上

了解如何在 Kubernetes 上运行和管理 Docker 容器。Kubernetes 是一个用于容器编排的开源平台，支持自动化部署、扩展和管理容器化应用。

### 9. Docker Swarm

Docker Swarm 是 Docker 自带的容器编排工具，适合用于管理 Docker 集群。您可以创建 Swarm 集群以实现负载均衡和服务发现。

### 总结

这些高级主题和概念将有助于您深入理解 Docker，优化应用部署和管理流程。学习这些内容将使您在开发和运维中更加高效和灵活。如果您对某个主题有更深入的兴趣，欢迎进一步讨论！

## 1 Docker实战

[详细的docker学习手册, 偏实战](https://mp.weixin.qq.com/s/5EulbB2Yr0iOY-HLT_kJhg)

参考

[Docker学习资源汇总(一)](https://blog.csdn.net/qq_38225558/category_8647512.html)

[Docker学习资源汇总(二)](https://blog.csdn.net/carefree31441/category_11412136.html)

# 1 Docker简介

  
[Docker官网](https://docs.docker.com/)  
**1 Docker的简介**  
Docker作为开源的应用容器引擎，可以把应用程序和其相关依赖打包生成一个Image镜像文件，是一个标准的运行环境，提供可持续交付的能力，通过镜像文件可以创建多个Docker容器。  
  
  
  
  
  
**2：关于虚拟机和容器的对比**  
虚拟机(vm)：是一种虚拟硬件的概念,通常被用来提供虚拟环境以满足软件的需求。简单来说，就是在一台服务器上虚拟出多个操作系统。  
虚拟机基于虚拟机器管理程序，管理的程序可以在主机系统（如Linux windows）上运行的应用程序，也可以直接基于硬件的系统级应用程序（即是不运行在某一操作系统上）。  
  
容器：软件行业的容器是一种轻量级，可执行的独立软件包，这里面包含所需要的所有内容：业务代码 ，运行时环境 ，系统工具，系统库等设置。软件项目容器化的设计目的是为了使开发 ，交付和部署变得更加容易。  
  
CI (持续集成):Jenkins  
CD(持续部署):Mesos,Kubernetes(K8S)  
  
  
  
  
  
  
  
  

# 2 Docker的基础

  
**1 Docker是什么**  
Docker 是一个开源项目，诞生于 2013 年初，最初是 dotCloud 公司内部的一个业余项目。它基于 Google 公司推出的 Go 语言实现。 项目后来加入了 Linux 基金会，遵从了 Apache 2.0 协议  
  
**2 docker的优势**  
通过对应用组件的封装、分发、部署、运行等生命周期的管理，达到应用级别的一次封装，到处运行。  
**环境隔离：**  
通过cgroups和namesapce进行实现资源隔离，实现一台机器运行多个容器互不影响。  
**更快速地部署和交付：**  
使用docker，开发人员可以利用镜像快速构建一套标准的研发环境；开发完成后，测试和运维人员可以直接通 过使用相同的环境来部署代码。  
**更易迁移扩展：**  
docker容器几乎可以在任意的平台上运行，包括虚拟机、公有云、私有云、个人电脑、服务器等，这种 兼容性让用户可以在不同平台之间轻松的迁移应用。  
**更高效的资源利用：**  
docker容器的运行不需要额外的虚拟化管理程序的支持，它是内核级的虚拟化，同时对资源的额外需求 很低。  
  
**3 虚拟机和Docker的对比**  
虚拟机：虚拟机在本质上就是在模拟一台真实的计算机设备，每台虚拟机都需要有自己的操作系统。  
Docker: 使用 Linux 内核中的 namespaces 和 cgroups 实现进程组之间的隔离。是用内核技术实现的隔 离，所以它是一个共享内核的虚拟化技术;与虚拟机相比，Docker隔离性更弱，Docker属于进程之间的 隔离，虚拟机可实现系统级别隔离  
  
  
**4 Docker的核心概念**  
**镜像：**  
Docker镜像是一个只读的模板。包含了容器运行时所需要的文件系统和一些参数。镜像是无状态的，也 不会改变。镜像是用来创建容器的。你可以使用docker pull命令获取一个别人已创建好的镜像。  
**容器：**  
Docker 利用容器来运行应用，容器就像是一个文件夹，容器中包含了应用运行所需的一切。每个容器 都是一个隔离的和安全的应用平台。容器是镜像的一个实例，它是有状态的，而且随时会改变，容器 一般是短暂的；  
容器是从镜像创建的运行实例，它可以被启动、开始、停止、删除。每个容器都是相互隔离的、保证 安全的平台；  
可以把容器看做是一个简易版的 Linux 环境（包括root用户权限、进程空间、用户空间和网络空间 等)和运行在其中的应用程序。  
**仓库：**  
仓库是集中存放镜像文件的场所。  
  
  
  
  
  
  
  
[参考:虚拟机和Docker的对比](https://blog.csdn.net/xzwspy/article/details/81154945)  
[Docker：从入门到实战过程全记录](https://mp.weixin.qq.com/s/NUEHF6tGp2sJxE2iXziKKw)  
[史上讲解最好的 Docker 教程，从入门到精通](https://mp.weixin.qq.com/s/vhLZ_KUa5kdMYDhURQtGPw)  
[Docker容器部署，这怎么玩？](https://mp.weixin.qq.com/s/EZnRAWOE3eG-1v5e5ww9tw)  
[Docker实战基础](https://gitee.com/zhengqingya/docker-compose/tree/master/Docker/%E5%9F%BA%E7%A1%80)  
[Docker基础简介](https://juejin.cn/post/7198754825654255672)  
  

# 3 Docker的安装

  
**1 查看Centos的版本**  
cat /etc/redhat-release  
  
**2 安装yum**  
yum install libdevmapper* -y  
  
**3 安装Docker**  
yum install docker  
  
**4 检查安装是否成功**  
docker version  
若输出了 Docker 的版本号，说明安装成功了，可通过以下命令启动 Docker 服务。  
  
**5 启动或退出docker**  
systemctl start docker  
一旦docker服务启动就可以开始使用Docker了。  
  
systemctl stop docker  
关闭docker  
  
**6 查看docker的运行状态**  
systemctl status docker  
  
  
**7 重启docker服务**  
systemctl restart docker  
  
  
  
  
**8 运行Hello world镜像**  
报错  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1637314282432-7cbdf3be-6e37-4f84-89cb-30e3d91271b6.png?x-oss-process=image%2Fformat%2Cwebp)

  
报错的原因：  
docker在本地没有找到hello-world镜像，也没有从docker仓库中拉取镜像，出项这个问题的原因：是应为docker服务器再国外，我们在国内 无法正常拉取镜像，所以就需要我们为docker设置国内阿里云的镜像加速器；  
  
**配置阿里云镜像加速器**  
cd /etc/docker  
sudo touch daemon.json  
sudo chmod 777 daemon.json  
vim daemon.json 进入文件编辑  
在这个文件设置阿里云的镜像  
{ "registry-mirrors": ["https://alzgoonw.mirror.aliyuncs.com"] }  
  
systemctl restart docker 重启docker  
  
systemctl status docker 查看docker服务的运行状态  
  
docker run hello-world 再次运行hello-world镜像  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1637316481696-a3d3893b-8c2b-42f9-80e7-a3e49277f107.png?x-oss-process=image%2Fformat%2Cwebp)

  
  
**9 卸载docker**  
**查看安装包**  
yum list installed | grep docker  
**移除安装包**  
sudo yum -y remove docker-engine.x86_64 （是root账号的话不需要加sudo, 普通账号需要加sudo命令）  
**清楚所有的docker依赖文件**  
rm -rf /var/lib/docker参考:  
[Centos 安装Docker](https://blog.csdn.net/weixin_42176087/article/details/121609294)  
[Docker实战基础](https://gitee.com/zhengqingya/docker-compose/tree/master/Docker/%E5%9F%BA%E7%A1%80)  
[Docker的安装及操作](https://www.kongzid.com/archives/docker1)  
  

# 1 Docker部署企业级GitLab

  
  
  
  
参考  
[Docker部署企业级GitLab](https://gblfy.blog.csdn.net/article/details/126287409)

# 2 Docker部署企业级Maven私服仓库 nexus3

  
  
  
  
参考  
[Docker部署企业级Maven私服仓库 nexus3](https://gblfy.blog.csdn.net/article/details/126274964)  
  

若有收获，就点个赞吧

  

# Docker的镜像常用操作命令

  
  
**1 获取镜像**  
镜像是Docker运行容器的前提，用户可以使用docker pull 命令从网络上下载镜像。对于镜像来说，如果不显式地指定tag,则默认会选择latest标签，即下载仓库中最新版本的镜像。  
  
命令  
docker pull <域名>/<namespace>/<repo>:<tag>  
**以ubuntu的镜像为例子**  
  
拉取Ubuntu的镜像  
docker pull ubuntu  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1637318630335-ca44f990-933f-4017-b9c6-2865934d45c3.png?x-oss-process=image%2Fformat%2Cwebp)

  
  
  
**2 查看镜像列表**  
使用docker images命令可以列出本地主机上已有的镜像。  
信息含义：来自于哪个仓库、镜像的标签信息、镜像的ID号（唯一）、创建时间、镜像大小。  
命令：  
docker images  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1637318898991-a39f887d-b453-489e-9644-ee7b38a02973.png?x-oss-process=image%2Fformat%2Cwebp)

z  
  
**3 查看镜像的详细信息**  
docker inspect命令返回的是一个JSON的格式消息，如果我们只要其中的一项内容时，可以通过-f参数来指定。  
  
命令：  
docker inspect <image_id>  
  
**以ubuntu为例：**  
docker inspect ba6acccedd29  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1637319171677-a015355b-df60-435d-b1ac-ab2003e56fe5.png?x-oss-process=image%2Fformat%2Cwebp)

  
  
  
**4 查找镜像**  
使用docker search命令可以搜索远端仓库中共享的镜像，默认搜索Docker hub官方仓库中的镜像。  
命令：  
docker search <image_name>  
**以ubuntu为例：**  
docker search ubuntu  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1637319377117-b43e4cd3-fd32-41e2-9779-718197c7b287.png?x-oss-process=image%2Fformat%2Cwebp)

  
  
**5 删除镜像**  
使用docker rmi命令可以删除镜像，其中image可以为标签或ID。  
当同一个镜像拥有多个标签，docker rmi只是删除该镜像多个标签中的指定标签而已，而不影响镜像文件。  
当有该镜像创建的容器存在时，镜像文件默认是无法被删除的。  
命令：  
docker rmi <image>:<tag>  
**以ubuntu为例：**  
  
根据tag删除  
docker rmi ubuntu:latest （latest为tag）  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1637319807131-a595b8ab-1ef2-4cc4-9d98-f1dd87214f59.png?x-oss-process=image%2Fformat%2Cwebp)

  
根据id删除  
docker rmi -f feb5d9fea6a5 (删除hello-world镜像)  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1637320060660-8ecab179-e85a-4ab4-b788-e0cfa7b19c6f.png?x-oss-process=image%2Fformat%2Cwebp)

  
  
删除所有镜像：  
docker rm -f $(docker images)  
  
**6. 创建镜像**  
基于已有的镜像的容器的创建。  
命令：  
docker commit <options> <container_id> <repository:tag>  
  
参数说明：  
-a , --author : 作者信息  
-m , --meassage : 提交消息  
-p , --pause=true : 提交时暂停容器运行  
  
**7. 迁出镜像**  
可以使用docker save命令来迁出镜像，其中image可以为标签或ID。  
命令：  
docker save -o <image>.tar <image>:<tag>  
  
参数说明：  
-o:设置存储压缩后的文件名称  
  
  
**8. 载入镜像**  
使用docker load命令可以载入镜像，其中image可以为标签或ID。  
这将导入镜像及相关的元数据信息（包括标签等），可以使用docker images命令进行查看。  
  
命令：  
docker load --input <image>.tar 或 docker load < <image>.tar  
  
  
**9. 上传镜像至云端仓库**  
可以使用docker push命令上传镜像到仓库，默认上传到DockerHub官方仓库（需要登录）。  
  
命令：  
docker push <域名>/<namespace>/<repo>:<tag>  
  
  
  
  

# Docker容器操作常用的命令

  
**1 操作容器的基本命令**  
**1.1 新建容器并启动**  
以Centos为例  
新拉取镜像  
docker pull centos  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1637576169166-100d55c9-4be5-4ca0-bb94-1f42060fecdc.png?x-oss-process=image%2Fformat%2Cwebp)

  
查看所有的镜像  
docker images  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1637576204512-c59a8f2b-1425-417b-89fd-3408cf8937e4.png?x-oss-process=image%2Fformat%2Cwebp)

  
新建容器并启动  
docker run -d -i -t imageId /bin/bash (为什么docker run imageId这个命令不从)  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1637577125100-7235cb29-ce64-41a3-afe8-a4d7df0e0f5e.png?x-oss-process=image%2Fformat%2Cwebp)

  
列出所有运行的容器  
docker ps  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1637577232537-56bd0ef4-4c67-47cc-9d1c-eec9e2b60aa2.png?x-oss-process=image%2Fformat%2Cwebp)

  
列出所有的容器  
docker ps -a  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1637577300812-2f4c8e03-07db-4bdf-a6df-143f8d511773.png?x-oss-process=image%2Fformat%2Cwebp)

  
  
**1.2 停止容器**  
查看正在运行的容器  
docker ps  
停止容器  
docker stop 容器Id  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1637577511916-091f1984-f490-48b3-bf62-cbb5b2890eb4.png?x-oss-process=image%2Fformat%2Cwebp)

  
再查看正在运行的容器：  
docker ps  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1637577547751-fd6ecacb-cde7-405f-81bb-5c47e000855c.png?x-oss-process=image%2Fformat%2Cwebp)

  
  
**1.3 启动容器**  
查看正在运行的容器  
docker ps  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1637577678240-ef071a70-2512-4109-aad7-532ddfbd1145.png?x-oss-process=image%2Fformat%2Cwebp)

  
查看所有的容器  
docker ps -a  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1637577722206-11933fd0-5a14-40cf-a9e7-2f5b11e4fe86.png?x-oss-process=image%2Fformat%2Cwebp)

  
根据容器Id启动容器  
docker start 容器Id  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1637577792907-5760f363-a0fa-4644-9c33-275eea9083a5.png?x-oss-process=image%2Fformat%2Cwebp)

  
查看正在运行的容器  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1637577826035-7252c565-a383-4fc3-9425-de783f816981.png?x-oss-process=image%2Fformat%2Cwebp)

  
  
**1.4 重启容器**  
docker restart 容器Id  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1637577942733-31ed32b5-d4a4-4da2-be24-bfb9092f9b05.png?x-oss-process=image%2Fformat%2Cwebp)

  
  
**1.5 强制停止当前的容器**  
docker kill 容器Id  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1637578050584-318a4787-c60b-4a20-8440-6fb475dcedc8.png?x-oss-process=image%2Fformat%2Cwebp)

  
  
**1.6 退出容器**  
exit  
  
**1.7 删除容器**  
docker rm 容器Id 根据容器Id删除容器  
docker rm -f $(docker ps -aq) 删除全部容器  
  
**1.8 查看镜像的元数据**  
docker inspect 容器Id  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1637578975428-16018ac1-2497-4fbb-9afb-18d588b53f6f.png?x-oss-process=image%2Fformat%2Cwebp)

  
  
**1.9 进入容器**  
docker attach 容器Id  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1637579169221-956982bf-6090-4d73-9aaa-c0362881962a.png?x-oss-process=image%2Fformat%2Cwebp)

  
  
**2 重要的命令**  
**2.1 容器内的目录复制到宿主机目录**  
  
docker cp 容器id:容器内路径 主机目的路径 ？？？？ （是不是不是交互模式开启的呢）  
  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1637579942617-04cea587-cfbd-4e57-aa05-5cef044f7806.png?x-oss-process=image%2Fformat%2Cwebp)

  
  
**2.2 以交互的模式开启容器**  
  
docker exec -it 容器Id /bin/bash （这个也失败了）  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1637580227577-e3d3c4e6-6779-476a-92eb-92df57e1888a.png?x-oss-process=image%2Fformat%2Cwebp)

  
  
**2.3 后台启动**  
docker run -d 镜像名  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1637580476637-b653b0c9-3615-4efb-bea6-12c53aaa58a9.png?x-oss-process=image%2Fformat%2Cwebp)

  
问题docker ps. 发现centos 停止了,这是为什么呢？  
常见的坑，docker容器使用后台运行，docker发现没有应用，就会自动停止  
  
**2.4 查看日志：**  
docker logs -t --tail n 容器id #查看n行日志  
  
docker logs -t --tail 10 bd8b1523223e  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1637580720360-3a42e51f-3dd1-4d02-99a7-c1c614868c40.png?x-oss-process=image%2Fformat%2Cwebp)

  
docker logs -ft 容器id #跟着日志 （详细的日志）  
  
docker logs -ft bd8b1523223e  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1637580838030-a76d94ab-721d-44c8-822b-0f4739f6b96e.png?x-oss-process=image%2Fformat%2Cwebp)

  
  
**2.5 查看容器中进程的信息**  
docker top 容器Id （是没有程序在跑吗？？？？）  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1637580983901-ae815e59-2159-4270-9977-9f386a9d9eb5.png?x-oss-process=image%2Fformat%2Cwebp)

  
**2.6 启动并进入容器**  
docker run -it centos /bin/bash  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1637581503568-261d7917-acd0-4bf4-87b2-b2e63cee2f0f.png?x-oss-process=image%2Fformat%2Cwebp)

  
  
  
**2.7 新建容器并启动，和宿主机映射端口**  
  
docker run [可选参数] image  
#参书说明  
--name="Name" #容器名字 tomcat01 tomcat02 用来区分容器  
-d #后台方式运行  
-it #使用交互方式运行，进入容器查看内容  
-p #指定容器的端口 -p 8080(宿主机):8080(容器)  
-p 主机端口:容器端口(常用)  
-P(大写) 随机指定端口  
  
  
  

# Docker 安装常用的软件

  
**1 docker 安装Ngnix**  
  
**1.1 搜索镜像**  
dockers search ngnix  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1637634864477-dfbbd337-b819-404c-93a7-94f32fe52821.png?x-oss-process=image%2Fformat%2Cwebp)

  
**1.2 拉去镜像**  
docker pull ngnix (这个Ngnix的镜像拉取不下来，我也不知道是为什么？)  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1637634982109-f2ca62a7-b94b-4fe6-9ee0-4cd6c0fad14f.png?x-oss-process=image%2Fformat%2Cwebp)

  
**1.3 查看镜像是否下载成功**  
docker images  
  
**1.4 后台运行容器**  
docker run 参数说明  
-d 后台运行  
--name 给容器命名  
-p 宿主机端口：容器内部端口  
docker run -d --name nginx01 -p 3344:80 nginx （由于上一步的镜像没有拉取成功，所以启动失败）  
  
**1.5 查看正在运行的容器**  
docker ps  
  
**1.6 进入容器给**  
进入容器以终端窗口的页面  
docker exec -it nginx01 /bin/bash #进入  
  
**1.7 退出容器**  
exit  
  
**1.8 停止容器**  
查看正在运行的容器  
docker ps  
docker stop 容器Id  
  
  
**2 Dcoker 安装Tomcat**  
**2.1 下载Tomcat的最新镜像**  
docker pull tomcat  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1638711370240-2453ee92-8a3e-404e-86be-a269d3c38fb4.png?x-oss-process=image%2Fformat%2Cwebp)

  
  
**2.2 查看下载好的Docker镜像：**  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1638711423986-1ae30ad8-f7fc-477f-afe4-608592df6b9b.png?x-oss-process=image%2Fformat%2Cwebp)

  
  
**2.3 以后台的方式启动Tomcat**  
docker run -d p 8080:8080 --name tomcat01 tomcat  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1638711614275-5c10ce12-2804-4cf0-9c7b-008a9e6adf07.png?x-oss-process=image%2Fformat%2Cwebp)

  
  
**2.4 启动之后访问Tomcat不成功,因为官方的镜像是阉割版本，需要进入容器**  
curl localhost:8080  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1638712141262-342f2bdd-08cd-42d7-a165-61d6933c7888.png?x-oss-process=image%2Fformat%2Cwebp)

  
进入容器:  
docker exec -it 3c1ce3cea026 /bin/bash  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1638712414862-480fa27a-59e9-4c9a-b6c8-a974107c6482.png?x-oss-process=image%2Fformat%2Cwebp)

  
查看Tomcat的目录：  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1638712495474-e233f32d-b6ab-4e59-b5df-59a047690d85.png?x-oss-process=image%2Fformat%2Cwebp)

  
进入Tomcat的webapps目录：  
cd webapps  
发现这个目录是个空目录，需要将tomcat目录下的webapps.dist目录全部复制到webapps目录下面  
问题：发现webapps目录是个空目录，需要进入到容器将tomcat目录下的webapps.dist目录复制到webapps目录下，这样每次都需要进入到容器比较麻烦，解决办法：在容器外提供一个映射路径，在外部修改后自动同步到内部。  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1638712571756-3de91f8d-45a5-4135-97a4-3cce9875c9b6.png?x-oss-process=image%2Fformat%2Cwebp)

  
将tomcat目录下的webapps.dist目录全部复制到webapps目录下：  
cp -r webapps.dist/* webapps  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1638712980843-5f1b7291-9c4c-4dad-8b0e-59f801d83450.png?x-oss-process=image%2Fformat%2Cwebp)

  
  
**2.5 再次访问Tomcat**  
还是不行到时要再看下  
  
  
**3 docker 安装elasticsearch+kibana**  
**3.1 安装elasticserach的问题**  
es十分占用内存  
es需要暴露的端口非常多  
es的数据一般需要放在安全的目录下，可以通过后期的挂载实现。  
**3.2 启动elasticsearch(从官网复制过来的命令):**  
docker run -d --name elasticsearch -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" elasticsearch:7.6.2  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1638715268477-141d13c2-0f26-4af5-bef4-0fd579962a60.png?x-oss-process=image%2Fformat%2Cwebp)

  
  
**3.3 测试下启动好的elasticsearch**  
curl localhost:9200  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1638715402107-a0a785fc-0d87-4d32-b8de-b08133c3affd.png?x-oss-process=image%2Fformat%2Cwebp)

  
  
**ES启动超级占用内存：**  
Es启动超级占用内存，可以通过设置参数来启动,查看docker容器内存的使用情况  
docker stats 容器Id  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1638715683487-c0ca1c99-2347-4a59-8be5-0d4df6fc2981.png?x-oss-process=image%2Fformat%2Cwebp)

  
可以看到占用了接近45%的内存。  
  
**停止原来启动的es容器：**  
docker stop 容器Id  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1638715843994-99bcb61a-edf0-448b-a09a-a30247b43b4c.png?x-oss-process=image%2Fformat%2Cwebp)

  
  
**设置参数的形式来启动Elasticsearch**  
-e 指定配置  
docker run -d --name elasticsearch -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" -e ES_JAVA_OPTS="-Xms64m -Xmx512m" elasticsearch:7.6.2  
  
docker stats 容器Id  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1638716287376-32b3ce35-5696-4dd3-aca0-1a579cccbd1f.png?x-oss-process=image%2Fformat%2Cwebp)

  
可以看出指定参数配置之后，Es占用内存明显小了好多。  
  
  
  
**3.4 容器间通信的问题(网络问题)**  
docker 运行Elasticsearch容器之后， 还需要运行kibana容器，但是这个kibana是需要连接Elasticsearch容器的， 这就涉及到容器间的通信问题  
  
  
  

# Docker的数据卷

  
**1 容器数据卷**  
场景：将应用和环境打包成一个镜像，如果数据也在容器中，那么删除容器的话，数据也会丢失？比如,使用Docker部署Mysql，如果删除容器的话，数据也会被删除，这样肯定是不行的？那么怎么样解决这个问题呢，这就需要用到Docker的数据卷的技术。  
目录挂载，我们将容器内的目录，挂载到容器外的Linux的目录，这样当容器内长生数据的时候可以同步到容器外。也就是容器的持久化和同步操作。  
  
**卷相关的命令**  
查看所有的volume(卷)的情况  
  
具名挂载 -P:表示随机映射端口  
docker run -d -P --name nginx02 -v juming-tomcat:/etc/tomcat tomcat  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1639240380313-0c4fe486-3957-4b8d-81a7-3cf5db059332.png?x-oss-process=image%2Fformat%2Cwebp)

  
  
docker volume ls  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1639240435261-59615a45-6e75-40a8-bde6-355f1d0a07ed.png?x-oss-process=image%2Fformat%2Cwebp)

  
DRIVER VOLUME NAME # 容器内的卷名(匿名卷挂载)  
local juming-tomcat #多了一个名字  
  
  
docker volume inspect juming-tomcat  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1639240568296-d276076d-44ff-4e24-8c22-8c5f36bf86bd.png?x-oss-process=image%2Fformat%2Cwebp)

  
所有的docker容器内的卷，没有指定目录的情况下都是在**/var/lib/docker/volumes/自定义的卷名/_data**下，**如果指定了目录，docker volume ls 是查看不到的**。  
  
**挂载的命令**  
-v 容器内路径 #匿名挂载  
-v 卷名：容器内路径 #具名挂载 -  
-v /宿主机路径：容器内路径 #指定路径挂载 （docker volume ls 是查看不到的）  
**拓展：**  
通过 -v 容器内路径： ro rw 改变读写权限  
ro 表示readonly 只读  
rw readwrite 可读可写  
docker run -d -P --name nginx05 -v juming:/etc/nginx:ro nginx  
docker run -d -P --name nginx05 -v juming:/etc/nginx:rw nginx  
  
只要看到这个ro，则表示，只能通过宿主机来操作，容器内部时不能操作的。  
  
**2 使用方式**  
直接使用命令挂载：-v  
docker run -it -v 主机目录:容器内目录 --privileged=true -p 主机端口:容器内端口  
  
/home/ceshi 主机home目录下的ceshi文件夹 映射 centos容器中的/home  
  
**1 启动并进入容器：**  
docker run -it -v /home/cheshi:/home --privileged=true centos /bin/bash  
  
**2 在容器的 /home的目录下创建test.java文件**  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1639237069360-0714b49f-b458-46d3-ba9a-1f247f4fdfa1.png?x-oss-process=image%2Fformat%2Cwebp)

  
**3 我们看下Linux的 /home/cheshi的目录：**  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1639237144905-4249076e-da21-4379-a606-23390f9473d7.png?x-oss-process=image%2Fformat%2Cwebp)

  
  
**4 停止容器，在Linux的 /home/cheshi目录中新加文件，看能不能同步到新启动的额容器**  
发现重新启动容器，发现在Linux目录中新加的文件同步到了容器。  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1639238590522-4c3311ac-f524-4de5-889e-c3dc33638fd0.png?x-oss-process=image%2Fformat%2Cwebp)

  
  
**3 安装Mysql**  
**1 获取Mysql的镜像**  
docker pull mysql:5pull  
**2 启动容器**  
我们回顾下docke启动容器的命令：  
启动参数：  
-d 后台运行  
-p 端口映射  
-v 卷挂载  
-e 环境配置  
-- name 容器名字  
docker run -d -p 3310:3306 -v /home/mysql/conf:/etc/mysql/conf.d -v /home/mysql/data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 --name mysql03 mysql:5.7  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1639239518633-5d1a0773-17ef-4f02-95c4-694b5319f644.png?x-oss-process=image%2Fformat%2Cwebp)

  
测试启动的mydql：  
用DBserver连接时，测试没有成功？  
  
**4 容器间实现数据同步**  
通过Dockerfile构建的镜像，启动三个，这样三个容器就有相同的目录的匿名挂载volume01和volume02  
1 启动docker01 的 wanghang/centos镜像  
docker run -it --name docker01 wanghang/centos:latest  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1639289570486-487f90a2-cd73-494c-9fc2-4023edf5364f.png?x-oss-process=image%2Fformat%2Cwebp)

  
_2 不关闭退出容器：_  
ctrl + q + p  
  
3 启动docker02 的 wanghang/centos镜像，并且让docker02继承docker01  
docker run -it --name docker02 --volumes-from docker01 wanghang/centos:latest  
  
并在docker01的容器中volume01的目录中创建 docker01_volume01_test.java  
  
4 进入docker02的容器的volume01目录下看有没有docker01_volume01_test.java这个文件  
docker exec -it 容器Id /bin/bash 进入容器以交互模式  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1639291371517-bd3bde08-676f-432e-8633-acb777976afc.png?x-oss-process=image%2Fformat%2Cwebp)

  
测试结果是成功的。  
  
5 再新建一个docker03同样继承docker01  
docker run -it --name docker03 --volumes-from docker01 wanghang/centos:latest  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1639291605598-150c9646-32e5-492c-b404-62036031c26f.png?x-oss-process=image%2Fformat%2Cwebp)

  
发现新启动的docker03，继承docker01，在docker03容器的volume01目录下，也同步过来了docker01_volume01_test.java文件。  
  
6 删除docker01，看docker02和docker03是否能够同步。  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1639291856903-05f9792e-7a05-4eab-890a-78a22b10d10e.png?x-oss-process=image%2Fformat%2Cwebp)

  
在docker02的volume01的目录下创建docker02_volume01_test.java  
  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1639291966880-a01bcd1d-2031-4521-9973-cbd9ba5d9452.png?x-oss-process=image%2Fformat%2Cwebp)

  
测试结果是：删除docker01容器，在docker02容器的volume01的目录下新建docker02_volume01_test.java，在docker03的volume01目录下能狗同步。  
  
7 在重启docker01，看volume01这个目录下有没有这个文件？  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1639292338845-43dd6ce5-d7e7-40b1-81ca-ac4449ea94a0.png?x-oss-process=image%2Fformat%2Cwebp)

  
  
结果：没有，容器在的时候有，但是容器删除之后再重启就没有了，这是为什么？  
  
  
  
**5 多个mysql容器之间实现数据共享**  
  
1 启动mysql01容器：  
docker run -d -p 3306:3306 -v /home/mysql/conf:/etc/mysql/conf.d -v /home/mysql/data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 --name mysql01 mysql:5.7  
  
2 启动mysql02容器，并继承mysql01  
docker run -d -p 3310:3306 -e MYSQL_ROOT_PASSWORD=123456 --name mysql02 --volumes-from mysql01 mysql:5.7  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

# DockerFile

  
**1 初识Dockerfile**  
Dockerfile 就是用来构建docker镜像的构建文件。  
  
1 在home目录下编写简单的文件Dockerfile，文件的内容如下：  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1639275619080-ada5d28f-1f8f-4128-bdb9-b3395dbb68de.png?x-oss-process=image%2Fformat%2Cwebp)

  
  
2 将这个Dockerfield通过脚本命令运行生成镜像：  
docker build -f Dockerfile -t wanghang/centos .  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1639275925063-6ae88828-492c-49ba-909e-2a9572c45362.png?x-oss-process=image%2Fformat%2Cwebp)

  
会按照Dockerfile上的命令执行，并成成一个 wanghnag/centos的镜像  
  
3 启动自己的镜像：  
docker run -it 7f7968981375 /bin/bash  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1639288385761-10bc2daf-36eb-4ec4-b4d0-7e42b01642c4.png?x-oss-process=image%2Fformat%2Cwebp)

  
这样我们就能开到Dockerfile里的 VOlUME里命令里的两个目录。  
  
4 查看容器的详细信息：  
docker inpect 容器Id  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1639288887390-f4c8a6d2-849c-4705-b71a-f8088138ab7a.png?x-oss-process=image%2Fformat%2Cwebp)

  
具体的挂载的目录倒是没有看到是在哪？  
  
**2 Dockerfile的简介：**  
**dockerfile是用来构建docker的文件，构建的主要****步骤：**  
1 编写一个dockerfile文件;  
2 docker build 构建成一个镜像;  
3 docker run 运行镜像；  
4 docker push发布镜像（DockerHub、阿里云仓库）。  
  
**DockerFile的构建要点：**  
1 每个指令都必须是大写字母；  
2 执行从上到下执行；  
3 #表示注解；  
4 每个指令都会创建提交一个新的镜像层，并提交。  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1639299421874-542c1b88-12e2-42c2-9cb4-160a3b02b849.png?x-oss-process=image%2Fformat%2Cwebp)

  
Dockerfile是面向开发的，开发人员编写好镜像。  
Docker镜像逐渐成企业交付的标准，必须要掌握！  
Docker容器：容器就是镜像运行起来提供服务。  
  
**Dockerfile的常用命令：**  
FROM # from:基础镜像，一切从这里开始构建  
MAINTAINER # maintainer:镜像是谁写的， 姓名+邮箱  
RUN # run:镜像构建的时候需要运行的命令  
ADD # add:步骤，tomcat镜像，这个tomcat压缩包！添加内容 添加同目录  
WORKDIR # workdir:镜像的工作目录  
VOLUME # volume:挂载的目录  
EXPOSE # expose:保留端口配置  
CMD # cmd:指定这个容器启动的时候要运行的命令，只有最后一个会生效，可被替代  
ENTRYPOINT # entrypoint:指定这个容器启动的时候要运行的命令，可以追加命令  
ONBUILD # onbuild:当构建一个被继承DockerFile这个时候就会运行onbuild的指令，触发指令  
COPY # copy:类似ADD，将我们文件拷贝到镜像中  
ENV # env:构建的时候设置环境变量！  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1639299869376-f8e0328d-a98d-4f4c-b0a4-0f352169a87a.png?x-oss-process=image%2Fformat%2Cwebp)

  
  
**3 DockerFile实战**  
**1 编写自己的Centos**  
  
1 /home 目录下新建dockerfile目录  
mkdir dockerfile  
  
2 新建Dockerfile文件，并编写文件的内容  
  
FROM centos #基础镜像是官方原生的centos  
MAINTAINER wang<wanghang712@qq.com> #作者  
ENV MYPATH /usr/local #设置环境变量  
WORKIR $MYPATH  
  
RUN yun -y install vim #给官方原生的centos增加vim的命令  
RUN yum -y install net-tools #给官方原生的centos增加ifconfig命令  
  
EXPOSE 80 #暴露端口为 80  
  
CMD echo $MYPATH # 输出下MYPATH的路径  
CMD echo "----end---"  
CMD /bin/bash #启动后进入 /bin/bash  
  
3 通过命令构建这个镜像：  
命令: docker build -f 文件路径 -t 镜像名:[tag] . (注意：一定不要忘记那个 . )  
  
docker build -f mydockerfile-centos -t mycentos:0.1 .  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1640566920612-9da5b128-b7ba-420a-bd6e-85aa3e971cba.png?x-oss-process=image%2Fformat%2Cwebp)

  
这个 mydocker-centos的文件，build是成功了,但是没有看到启动的容器,这一点后面再研究吧！  
  
**2 实战tomcat镜像**  
1 在home这一层目录下新建一个目录  
/home/dockerfile/tomcatdockerfile  
  
2 将tomcat的压缩包和jdk的压缩包传到这个目录下  
wget命令下载tomcat8  
wget [https://archive.apache.org/dist/tomcat/tomcat-8/v8.0.23/bin/apache-tomcat-8.0.23.tar.gz](https://archive.apache.org/dist/tomcat/tomcat-8/v8.0.23/bin/apache-tomcat-8.0.23.tar.gz)  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1640653718489-e30d771e-c083-4ef5-a1fa-b74ec4fe1a00.png?x-oss-process=image%2Fformat%2Cwebp)

  
  
wget命令下载jdk8（这个格式到时候需要在NodePad++上整理下）  
wget --no-cookies --no-check-certificate --header "Cookie: gpw_e24=http%3A%2F%2Fwww.oracle.com%2F; oraclelicense=accept-securebackup-cookie" "[http://download.oracle.com/otn-pub/java/jdk/8u141- b15/336fa29ff2bb4ef291e347e091f7f4a7/jdk-8u141-linux-x64.tar.gz"](http://download.oracle.com/otn-pub/java/jdk/8u141-b15/336fa29ff2bb4ef291e347e091f7f4a7/jdk-8u141-linux-x64.tar.gz%22)  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1640653672083-7ccfa511-55c6-4f0e-a63e-d673b330afb3.png?x-oss-process=image%2Fformat%2Cwebp)

  
下好之后的：  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1640653778054-f4df5000-bbd0-4ad3-bdbd-c3b255212556.png?x-oss-process=image%2Fformat%2Cwebp)

  
  
3 编写Dockerfile的文件:  
FROM centos  
MAINTAINER cheng<wanghang712@qq.com>  
COPY readme.txt /usr/local/readme.txt #复制文件  
  
ADD jdk-8u141-linux-x64.tar.gz /usr/local #复制解压  
ADD apache-tomcat-8.0.23.tar.gz /usr/local #复制解压  
  
RUN yun -y install  
ENV MYPATH /usr/local  
  
WORKDIR $MYPATH  
  
ENV JAVA_HOME /usr/local/jdk1.8.0_141  
ENV CATALINA_HOME /usr/local/apache-tomcat-8.0.23  
  
ENV PATH $PATH:$JAVA_HOME/bin:$CATALINA_HOME/lib  
  
EXPOSE 8080  
  
CMD /usr/local/apache-tomcat-8.0.23/bin/startup.sh && tail -F /usr/local/apache-tomcat-8.0.23/logs/catalina.out # 设置默认命令  
  
4 执行bulid命令构建镜像(后面有个点)：  
docker build -t mytomcat:0.1 .  
构建镜像的时候没有成功,到时候再看下吧  
  

![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1640912724868-b5afcdbc-aed9-4c84-9a64-43a4835ded99.png?x-oss-process=image%2Fformat%2Cwebp)

  
  
5 将构建的镜像启动起来（有挂载和暴露端口）：  
docker run -d -p 8080:8080 --name tomcat01 -v /home/wanghang/build/tomcat/test:/usr/local/apache-tomcat-8.0.23/webapps/test -v /home/kuangshen/build/tomcat/tomcatlogs/:/usr/local/apache-tomcat-8.0.23/logs mytomcat:0.1  
  
6 经镜像发布到远程仓库  
docker login -u 用户名  
docker push 镜像名  
  
  
  
参考  
[DockerFile详解](https://www.jianshu.com/p/1aed40d82c62)  
[全面详解 Dockerfile 文件！](https://mp.weixin.qq.com/s/3YwRusLjT2w6tfbISoCAHw)  
[DockerFile命令介绍及DockerFile文件实战](https://blog.csdn.net/redrose2100/article/details/121025256)  
  
  

# docker-compose

通过docker-compose编排一系列环境进行一键快速部署运行，小白运维神器。  
  
  
  
  
  
参考  
[docker-compose容器编排](https://gitee.com/zhengqingya/docker-compose)  
[Docker实战基础](https://gitee.com/zhengqingya/docker-compose/tree/master/Docker/%E5%9F%BA%E7%A1%80)  
  
  
  
  

# 企业DockerFile实践

  
现在服务都流行使用CI/CD，基于阿里云或者自建K8s平台，这秀需要我们将SpringBoot的项目构建成镜像，这就离不来DockerFile文件， 我们来看下这两个DockerFile文件吧  
  
**1 DockerFile文件参考**  
**1.1)居然之家的电子签章网关的DockerFile**  
  
这里唯一有疑惑的地方是 /home/admin/ 目录下的这个start.sh， 这是一个启动脚本吗？

```
FROM registry.cn-beijing.aliyuncs.com/juran-public/openjdk:8-jdk-alpine
MAINTAINER huizhuo.liu@capgemini.com

ENV ADMIN_HOME="/home/admin"
ENV APP_NAME=REP_APP_NAME
ENV ENV_NAME=REP_ENV_NAME
ENV JAVA_OPTS="REP_JAVA_OPTS"

RUN mkdir -p ${ADMIN_HOME}/app

ADD target/${APP_NAME}.jar ${ADMIN_HOME}/app/${APP_NAME}.jar

RUN wget https://arthas.aliyun.com/arthas-boot.jar
RUN mv arthas-boot.jar  ${ADMIN_HOME}
RUN rm -rf arthas-boot.jar

RUN echo '/usr/bin/java ${JAVA_OPTS} -jar  ${CATALINA_OPTS} -Dspring.profiles.active=${ENV_NAME} ${ADMIN_HOME}/app/${APP_NAME}.jar'> ${ADMIN_HOME}/start.sh && chmod +x ${ADMIN_HOME}/start.sh

WORKDIR ${ADMIN_HOME}

#CMD ["/bin/bash", "/home/admin/start.sh"]
ENTRYPOINT /home/admin/start.sh && tail -f /dev/null
```

  
  

### 1.2)电子签章合同服务的DockerFile

合同服务涉及到文件的处理，比如:通过工具将Word转成Pdf，就可能涉及到编码的问题，因此里面加了字体和设置了编码， 紧当参考，不过奇怪的是这个没有网关里的start.sh 脚本，直接java -jar 还是比较好懂的。

```
FROM registry.cn-beijing.aliyuncs.com/juran-jiagou/easyhome-baic:easyhome-basic
MAINTAINER huizhuo.liu@capgemini.com

ENV ADMIN_HOME="/home/admin"
ENV APP_NAME=REP_APP_NAME
ENV ENV_NAME=REP_ENV_NAME
ENV JAVA_OPTS="REP_JAVA_OPTS"
ENV FONT_HOME=/usr/share/fonts/win

ENV LANG zh_CN.UTF-8
ENV LC_CTYPE zh_CN.UTF-8


RUN locale
RUN localedef -i zh_CN -c -f UTF-8 zh_CN.UTF-8
RUN echo "export LC_ALL=zh_CN.UTF-8" >> /etc/profile && source /etc/profile




RUN mkdir -p ${ADMIN_HOME}/app
RUN mkdir -p ${FONT_HOME}
ADD target/${APP_NAME}.jar ${ADMIN_HOME}/app/${APP_NAME}.jar
ADD font/* ${FONT_HOME}
RUN chmod 777 -R ${FONT_HOME}
RUN cd ${FONT_HOME}

WORKDIR ${ADMIN_HOME}

ENTRYPOINT [ "sh", "-c", "/usr/bin/java ${JAVA_OPTS} -jar  ${CATALINA_OPTS} -Dspring.profiles.active=${ENV_NAME} ${ADMIN_HOME}/app/${APP_NAME}.jar" ]
```

  
  

### 1.3)居然之家电子签章平台用户服务的DockerFile

用户服务的DockerFile由于不涉及到，编码、字体等问题，就很直观得多，也是直接 java -jar 命令

```
FROM registry.cn-beijing.aliyuncs.com/juran-public/openjdk:8-jdk-alpine
MAINTAINER huizhuo.liu@capgemini.com

ENV ADMIN_HOME="/home/admin"
ENV APP_NAME=REP_APP_NAME
ENV ENV_NAME=REP_ENV_NAME
ENV JAVA_OPTS="REP_JAVA_OPTS"

RUN mkdir -p ${ADMIN_HOME}/app

ADD target/${APP_NAME}.jar ${ADMIN_HOME}/app/${APP_NAME}.jar

WORKDIR ${ADMIN_HOME}

ENTRYPOINT [ "sh", "-c", "/usr/bin/java ${JAVA_OPTS} -jar  ${CATALINA_OPTS} -Dspring.profiles.active=${ENV_NAME} ${ADMIN_HOME}/app/${APP_NAME}.jar" ]
```

  
  

### 1.4)宜家PSC项目DockerFile

宜家使用的 阿里云 容器服务ACK 然后再去集成GitHub上的代码

```
# First stage: complete build environment
FROM maven:3.5.0-jdk-8-alpine AS builder

ARG ARTIFACTORY_TOKEN

# add pom.xml and source code
COPY . .

# package jar
RUN mvn clean package -Drepo.user=DPS-CCoeCN -Drepo.pass=${ARTIFACTORY_TOKEN} --settings ./mvnSettings.xml

# Second stage: minimal runtime environment
From openjdk:8-jre-alpine

# copy jar from the first stage
COPY --from=builder psc-core/target/psc-core-1.0.0-RELEASE.jar psc-core-1.0.0-RELEASE.jar

EXPOSE 8080

CMD ["java", "-jar", "psc-core-1.0.0-RELEASE.jar", "--spring.profiles.active=dev"]
```

  
  
  

# Docker网络

  
  
  
  
  
  
参考：  
[Docker网络](https://www.jianshu.com/p/75c58213a7c3)  
[深入理解 Docker 网络原理](https://mp.weixin.qq.com/s/H8Q10JR4UvJXAnxjo592OQ)  
[6 张图详解 Docker 容器网络配置](https://mp.weixin.qq.com/s/saivLvkF0watg2nHxrO5-Q)  
  

若有收获，就点个赞吧

  
  
  

# Docker网络之容器间通信

  
**1 Docker 容器间通信的几种方案**  
**1.1** **通过容器ip访问**  
容器重启后，ip会发生变化。通过容器ip访问不是一个好的方案。  
**1.2 通过宿主机的ip:port访问**  
通过宿主机的ip:port访问，只能依靠监听在暴露出的端口的进程来进行有限的通信。  
**1.3 通过link建立连接****（官方不推荐使用）**  
运行容器时，指定参数link，使得源容器与被链接的容器可以进行相互通信，并且接受的容器可以获得 源容器的一些数据，比如：环境变量。  
**1.4 通过 User-defined networks****（推荐）**  
docker network来创建一个桥接网络，在docker run的时候将容器指定到新创建的桥接网络中，这样 同一桥接网络中的容器就可以通过互相访问。  
  
  
**2 为什么Docker容器间通信不推荐使用link ？**  
**1 通过link建立连接的容器，被链接的容器能 ping 通源容器，反过来不行。**  
  

Shell运行代码复制代码

1

2

3

4

5

6

7

# 源容器：mysql

docker run -itd--name test-mysql -eMYSQL_ROOT_PASSWORD=root mysql:5.7

#被链接容器 centos

docker run -itd--name test-centos --link test-mysql:mysql centos /bin/bash

#进入test-centos

docker exec -it test-centos /bin/bash

进入Centos容器，直接通过 link的名字或者link时候取的别名就能进入：  
通过link的名字在Centos的容器中连接mysql  
  

![](https://cdn.nlark.com/yuque/0/2022/png/22822197/1644634645835-a43949e5-227b-400e-80aa-1eef27fc2e5d.png?x-oss-process=image%2Fformat%2Cwebp)

  
通过link的别名在Centos容器中连接mysql  
  

![](https://cdn.nlark.com/yuque/0/2022/png/22822197/1644634774307-b596c966-478c-4fb5-935d-74b48d4023fe.png?x-oss-process=image%2Fformat%2Cwebp)

  
  
  
  
  
  
  
  
**3 Docker容器间进行通信使用networks方式**  
**1 创建网络**  
  

_d__oc__k__er__n__e__tw__or__k__cre__a__t__e__t__es__t_−_n__e__tw__or__k_

  
**2** **启动容器时，加入创建的网络**  
  

_d__oc__k__err__u__n_−_i__t_−−_n__e__tw__or__k__t__es__t_−_n__e__tw__or__k_−−_n__e__tw__or__k_−_a__l__ia__s__m__ys__ql_−_e__M__Y__SQ__L__R__OO__T__P__A__SS__W__OR__D_=123_m__ys__ql_:5.7

  
**3** **启动被链接的容器**  
  

_d__oc__k__err__u__n_−_i__t_−−_n__e__tw__or__k__t__es__t_−_n__e__tw__or__k_−−_n__e__tw__or__k_−_a__l__ia__sce__n__t__osce__n__t__os_/_bin_/_ba__s__h_

  
  
  

![](https://cdn.nlark.com/yuque/0/2022/png/22822197/1644634346036-e0efbb23-e5f7-4a9e-80d4-20c8a224f80c.png?x-oss-process=image%2Fformat%2Cwebp)

  
  
  
  
  
  
  
参考：  
[https://blog.csdn.net/u013355826/article/details/84987233](https://blog.csdn.net/u013355826/article/details/84987233)  
[Docker网络和容器间通信](https://www.cnblogs.com/whych/p/9595671.html)

# Docker主机与容器间实现通信

  
  
  
  
  
  
  
  
  
  
  
  
  
参考：  
[docker+openvswitch实现主机与容器的网络通信](https://www.cnblogs.com/whych/p/9601889.html)  
  

若有收获，就点个赞吧

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
参考:狂神docker学习基础  
[https://blog.csdn.net/weixin_43591980/article/details/106272050](https://blog.csdn.net/weixin_43591980/article/details/106272050)