一个程序员，在一个文本文件hello.txt文件中写下了Hello CodeForge的文字，并将其放入了浏览器中，展示出了文字，但是单纯的文本文字并不好看，此时可以给文本的前后加上<p></p>,此时放入浏览器中展示，出现的是有特定样式的文字了，而后，为了将这种带标签的文本和txt纯文本文件分隔开，我们给了它新的后缀名：html，而通过html的标签在浏览器中渲染，我们也就有了标题，输入框等丰富的内容了。

但是开发人员打开的是我们电脑本地文件中打开的，但是我们平时在浏览器中访问的其实是从某台远端服务器将文件传到我们电脑的浏览器后打开的，那么是如何实现的呢？

.没有什么是加一层中间层无法解决的，如果无法解决，就加两层！

这里的中间层就是Nginx

  

**HTTP服务器是什么？**

如果想要本机电脑访问到远端服务器的html文件，那么我们可以在远端服务器中开启一个进程用来提供HTTP服务，说白了就是提供了一个URL

![](https://cdn.nlark.com/yuque/0/2025/png/43218187/1744276083883-dfdc6026-9f7d-44a3-98cb-e70882817999.png)

用户在浏览器中输入这个URL，浏览器就会向这个进程发起HTTP请求，进程收到浏览器的请求后，就将HTML文件发给浏览器进行渲染展示。

而像这种根据浏览器请求返回HTML文件的服务进程其实就叫HTTP服务器

  

**反向代理是什么？**

一个完整的产品往往不止有前端页面，还有后端服务，比如商城网站中前端网页需要从后端服务这里获取新的商品数据，一般进入网页后会根据已有的代码逻辑向后端发起请求获取数据。

一般流量小的时候还好，流量大的情况下，后端服务器扛不住的话就需要增加服务的个数，而服务变多了之后，每个都有对应的IP和端口。这也就导致了浏览器不知道该访问哪个服务了。所以我们还需要在这几个后端服务前面加一个进程，对外提供一个URL域名，请求来了，由这个进程均匀转发给背后的几个服务，让每个服务都能处理上请求，也就实现了所谓的负载均衡。

![](https://cdn.nlark.com/yuque/0/2025/png/43218187/1744276547983-34e46cb8-1fe2-483d-8f83-59dda18fb574.png)

像这种屏蔽掉背后具体有哪些服务器的代理方式就是我们常说的反向代理。有了反向代理，我们对外就可以只提供一个URL域名，背后根据需要随时扩缩容服务，而这个反向代理的功能正好可以加到前面放HTML文件的进程上。

那么目前这个进程就同时拥有HTTP服务器和反向代理的功能了。

![](https://cdn.nlark.com/yuque/0/2025/png/43218187/1744276707306-d363e784-03a5-4559-aa36-b02de898bf98.png)

**模块化网关能力：**

既然是中间层，所有网络流量都要经过进程，那么它高低也算一个网关了，于是我们可以在它什么加上一些通用网关能力：

比如加个日志，记录每次调用的结果，方便后续排查问题，

加个对输入输出的内容进行压缩的功能，减小网络带宽消耗，

又或者对某个IP进行限流或封禁，甚至还可以修改输入输出的内容

![](https://cdn.nlark.com/yuque/0/2025/png/43218187/1744276955356-8db39298-cff3-483b-950e-aabd93ad2fab.png)

这一部分能实现的还有很多，因此这里设计了自定义模块，让用户根据需求去实现特定的功能。

比如原先只支持HTTP的，后续我们可以让它支持TCP，UDP，WebSocket，HTTP2

![](https://cdn.nlark.com/yuque/0/2025/png/43218187/1744277053962-ec6aeaa3-29ec-49ee-9a70-d1884c265c24.png)

**配置能力：**

前面的能力用户肯定不会全都用上，所以需要有个地方让人选择使用哪些能力

于是我们可以添加一个配置文件nginx.conf

  

**单线程：**

现在这个网关进程的主要任务就是跟上下游建立网络连接，顺便内部做一下处理。多个客户端请求通过网络进入到一个进程，如果用多线程并发处理，那就需要考虑并发问题影响性能，怎么办？那么无论外部有多少个网络连接，网关进程收到客户端请求后都统一赛道一个线程上，在一个线程上处理客户端请求，这也就避免了并发问题和线程切换开销。

**多Worker进程:**

但单个进程要单线程处理那么多流量，那么再快压力也不小。怎么办呢？既然多线程不行，那么我们就用多进程

![](https://cdn.nlark.com/yuque/0/2025/png/43218187/1744277421578-76ecadd8-acdd-4205-983c-0020cbc38ac7.png)

![](https://cdn.nlark.com/yuque/0/2025/png/43218187/1744277446234-78b49467-6936-44bd-9fe7-ef262f1d28bf.png)

将单个进程改为多个进程，每个进程叫worker进程，进程之间互相独立，一个worker跪了不影响另一个worker的进程，让多个worker进程同时监听一个ip+端口，一有流量进来操作系统就会随机给其中一个进程处理，将进程数量设置为跟操作系统的CPU核数一致，那每个进程都能得到一个核

![](https://cdn.nlark.com/yuque/0/2025/png/43218187/1744277547696-0ae2d99f-aed7-4f3b-b01f-1c71756f5959.png)

思考：为什么多个进程可以同时监听一个端口却没有出现端口冲突呢？

**内存共享：**

但多worker进程的情况下，同一个客户端的多个请求会随机打到某个worker，对于限流这种需要技术的场景，就会被分散到多个worker上单独计数，那还怎么限流，所以还需要给这些worker进程分配一个共享内存区域，方便多个进程之间公用同一份数据做逻辑，确保系统数据一致性。

**ProxyCache：**

![](https://cdn.nlark.com/yuque/0/2025/png/43218187/1744277815561-58a6ff92-1640-4468-9788-cc3466cec3ff.png)

每次前端，后端这边交互的时候，作为网关，如果能每次都能将响应结果缓存起来，这样下次收到同样的请求，直接将缓存的数据返回给前端，从而就能减少响应时间和网络负载，但是缓存的数据放在哪呢？放在共享内存里面吗？内存贵，不合适，我们可以维护一些磁盘文件，用于在前端请求后端的过程中，暂存后端响应结果，后面再有相同的请求就可以将磁盘中的数据返回了，这也就是经典的空间换时间，用廉价的磁盘空间换取网络传输和CPU计算耗时，对于后端请求较慢，或者重复请求过多的场景可以使用。

这些用于缓存响应数据的磁盘文件就是ProxyCache

**加入master进程**

但这还不够，现在每个worker都会分走一部分流量：

![](https://cdn.nlark.com/yuque/0/2025/png/43218187/1744278142459-5433f32e-95ec-428a-89a1-d962e06ec1d3.png)

如果功能更新，所有worker同时一起重启，上面的网络连接就会全部断掉，更好的方式是创建worker和关闭worker挨个陆续执行，这样前端网页连接断开后，还能去连接另外的一个worker，保证任意时间一直有worker在工作，也就是所谓的滚动升级，因此也就需要一个新的进程来安排谁先谁后，这个进程就是所谓的master进程，让master读取前面提到的nginx.conf配置，统一管理多个worker。

所以，Nginx是什么？

支持动态配置，多种通用网关能力和多种网络协议，单master多worker架构，多个进程之间共享内存和proxy cache，对外提供一个ip端口，支持HTTP服务和反向代理的高性能网关服务

但是，如果服务器跪了，Nginx也就跪了，那么，如何解决Nginx的单点问题呢？

### 什么是 Nginx？

**Nginx**（发音为“Engine-X”）是一个开源的、高性能的 HTTP 和反向代理服务器，同时也可以作为**负载均衡器**、**HTTP 缓存**、**Web 服务器**和**邮件代理服务器**。Nginx 最初由 Igor Sysoev 开发，主要目的是为了应对 C10K 问题（即如何有效地处理大量的并发连接）。

Nginx 因其**高效、轻量、可靠**而广泛应用于网站的架构中，尤其是在高并发、高流量的环境中，常常作为反向代理服务器、负载均衡器等角色出现。

### Nginx 的架构

Nginx 使用的是 **事件驱动架构**，不同于传统的基于线程或进程的模型，它采用了异步非阻塞的事件驱动模型。这使得 Nginx 在高并发场景下具有极高的性能。

#### 1. **工作原理**

Nginx 是基于 **事件驱动** 模型的，使用一个主进程和多个工作进程来处理请求。它通过事件通知机制来响应请求，避免了阻塞 I/O 操作，从而能够处理大量的并发请求。

- **主进程**：Nginx 启动时会启动一个主进程，主进程负责管理 Nginx 的全局配置、子进程的管理和控制等。
- **工作进程**：主进程会创建多个工作进程，每个工作进程负责处理客户端的请求。工作进程之间没有共享内存，而是通过共享内存的方式进行必要的通信。
- **事件驱动模型**：每个工作进程通过 **异步 I/O** 方式处理请求。当一个请求到来时，Nginx 会将请求放入一个事件队列，然后通过事件通知机制（如 epoll、kqueue 等）来触发相应的处理程序，从而避免了传统的阻塞 I/O。

#### 2. **Nginx 进程架构**

Nginx 的架构分为多个层次，典型的结构如下：

- **Master 进程**：

- 管理 Nginx 配置文件的加载、工作进程的管理。
- 负责接受外部请求的信号，如重载配置、停止等。
- 仅有一个 Master 进程。

- **Worker 进程**：

- 负责处理实际的客户端请求。
- 每个工作进程是独立的，工作进程之间没有共享内存。
- 通过事件循环和异步 I/O 来高效处理大量并发请求。

- **辅助进程（可选）**：

- **Cache 进程**：如果启用了缓存，Nginx 可能会启动缓存进程来管理缓存。
- **日志进程**：负责管理日志文件（如访问日志、错误日志）。

#### 3. **请求处理流程**

Nginx 的请求处理流程如下：

1. **客户端请求到达**：Nginx 的主进程监听客户端请求。每当有请求到来，主进程会通过事件机制通知一个空闲的工作进程。
2. **请求分发**：工作进程会从事件队列中获取请求，然后根据配置来处理该请求。请求可以是静态文件的读取、反向代理的请求转发，或者是负载均衡。
3. **响应客户端**：工作进程处理完请求后，生成响应并发送给客户端。
4. **异步和非阻塞**：工作进程在处理请求时是异步的，这意味着即使一个请求正在等待 I/O 操作（如访问磁盘），工作进程也不会被阻塞，可以继续处理其他请求。

#### 4. **Nginx 事件模型**

Nginx 的事件驱动架构依赖于操作系统提供的高效的事件通知机制，如：

- **epoll**（Linux）
- **kqueue**（FreeBSD 和 macOS）
- **select**（较旧的实现）

这些机制可以有效地处理大量并发连接，减少了传统模型中由于每个请求分配线程或进程带来的资源消耗。

#### 5. **Nginx 模块化架构**

Nginx 的模块化架构非常灵活，允许用户根据需求加载不同的模块。Nginx 提供了多种模块，常见的包括：

- **HTTP 模块**：用于处理 HTTP 请求，如 `ngx_http_rewrite_module`、`ngx_http_proxy_module` 等。
- **负载均衡模块**：用于将请求分发到多个后端服务器，支持多种负载均衡策略。
- **缓存模块**：用于缓存静态内容或反向代理的内容，提高响应速度。
- **安全模块**：用于限制访问权限，如 `ngx_http_access_module`。

Nginx 模块有两种类型：

- **静态模块**：在编译时加入，不能在运行时加载或卸载。
- **动态模块**：在编译时通过 `--with-compat` 选项加入，允许在运行时加载和卸载。

### Nginx 的优点

1. **高性能**：Nginx 使用异步事件驱动模型，能高效地处理大量并发连接。
2. **低资源消耗**：与传统的多线程或多进程服务器相比，Nginx 的资源消耗极低，适合高并发场景。
3. **反向代理和负载均衡**：Nginx 支持反向代理和负载均衡功能，能将请求转发到多个后端服务器。
4. **模块化扩展**：Nginx 提供丰富的模块，支持各种功能扩展，能够灵活地满足不同的需求。
5. **支持 SSL**：Nginx 支持 SSL 加密，能够很好地处理 HTTPS 请求。

### Nginx 用途总结

1. **反向代理服务器**：可以将客户端请求转发到多个应用服务器，增强系统的伸缩性和可靠性。
2. **负载均衡器**：支持多种负载均衡算法（如轮询、最少连接等），可将请求分发到多台服务器。
3. **静态文件服务器**：Nginx 作为高效的静态文件服务器，用于提供网页、图片、视频等静态内容。
4. **HTTP 缓存**：可以缓存反向代理请求的内容，提高响应速度。
5. **Web 应用防火墙**：通过配置 Nginx 来过滤掉恶意请求，增强系统的安全性。

写一个简化版的Nginx，尤其是作为学习项目，是一个非常有趣的挑战。我们可以尝试编写一个基础的 HTTP 服务器，并实现一些关键功能，比如处理 HTTP 请求、返回静态文件、支持多线程并发处理等。这不会完全覆盖Nginx的所有特性，但可以作为一个简化的版本来进行理解和扩展。

在下面的代码中，我将会使用 Rust 的 `tokio` 异步运行时来处理并发请求，`hyper` 库来实现 HTTP 请求解析和响应生成，`tokio::fs` 来处理静态文件的读取。

### 简化版 Nginx（简化的 HTTP 服务器）

这个版本的 HTTP 服务器将实现以下功能：

1. 处理简单的 HTTP 请求。
2. 提供静态文件服务（如 HTML、CSS、JS 文件）。
3. 支持并发处理多个请求。

#### 依赖项

在 `Cargo.toml` 中添加以下依赖：

```
toml


复制编辑
[dependencies]
tokio = { version = "1", features = ["full"] }
hyper = { version = "0.14", features = ["full"] }
tokio-util = "0.6"
mime = "0.3"
```

#### 代码实现

```
rust


复制编辑
use hyper::{service::{make_service_fn, service_fn}, Body, Request, Response, Server};
use hyper::header::CONTENT_TYPE;
use tokio::fs;
use tokio::io::AsyncReadExt;
use std::convert::Infallible;
use std::path::{Path, PathBuf};
use mime::Mime;

async fn handle_request(req: Request<Body>) -> Result<Response<Body>, Infallible> {
    let path = match req.uri().path() {
        "/" => "index.html",  // 默认请求根路径时返回index.html
        path => path.trim_start_matches('/'),  // 处理路径
    };

    let file_path = Path::new("public").join(path);  // 假设静态文件存放在"public"目录

    match serve_static_file(file_path).await {
        Ok((content, mime)) => Ok(Response::builder()
            .header(CONTENT_TYPE, mime.to_string())
            .body(Body::from(content))
            .unwrap()),
        Err(_) => Ok(Response::builder()
            .status(404)
            .body(Body::from("404 Not Found"))
            .unwrap()),
    }
}

async fn serve_static_file(path: PathBuf) -> Result<(Vec<u8>, Mime), std::io::Error> {
    if !path.exists() {
        return Err(std::io::Error::new(std::io::ErrorKind::NotFound, "File not found"));
    }

    let mut file = fs::File::open(&path).await?;
    let mut content = Vec::new();
    file.read_to_end(&mut content).await?;

    let mime = match path.extension().and_then(|s| s.to_str()) {
        Some("html") => mime::TEXT_HTML,
        Some("css") => mime::TEXT_CSS,
        Some("js") => mime::APPLICATION_JAVASCRIPT,
        Some("png") => mime::IMAGE_PNG,
        Some("jpg") | Some("jpeg") => mime::IMAGE_JPEG,
        _ => mime::APPLICATION_OCTET_STREAM,
    };

    Ok((content, mime))
}

#[tokio::main]
async fn main() {
    let make_svc = make_service_fn(|_conn| async {
        Ok::<_, Infallible>(service_fn(handle_request))
    });

    let addr = ([127, 0, 0, 1], 8080).into();
    let server = Server::bind(&addr).serve(make_svc);

    println!("Server running on http://{}", addr);

    if let Err(e) = server.await {
        eprintln!("Server error: {}", e);
    }
}
```

### 解释代码

1. `**handle_request**`:

- 这是 HTTP 请求的处理函数。它根据请求的 URI 来决定返回哪个文件。如果请求路径是根路径 `/`，它会返回 `index.html`。
- 它调用 `serve_static_file` 函数来读取静态文件并返回文件内容。

2. `**serve_static_file**`:

- 这个函数从磁盘读取静态文件并返回文件内容。如果文件不存在，它会返回一个错误，导致客户端接收到 `404 Not Found`。
- 根据文件扩展名，它会决定文件的 MIME 类型。

3. `**main**`:

- 在 `main` 函数中，我们启动了一个 HTTP 服务器，监听 `127.0.0.1:8080`。使用 `hyper` 的 `Server` 来处理客户端的 HTTP 请求。
- `make_service_fn` 和 `service_fn` 用于生成每个连接的服务函数，它们分别处理客户端的每个请求。

4. **静态文件**:

- 我们假设静态文件存放在项目根目录的 `public` 目录中（可以根据需求修改路径）。例如，如果请求 `/index.html`，服务器会在 `public/index.html` 中查找文件。

### 目录结构

为了让这个简化的服务器工作，你需要有一个 `public` 目录，并放入一些静态文件，如 HTML、CSS、JavaScript 文件等。以下是一个可能的目录结构：

```
css


复制编辑
project/
├── src/
│   └── main.rs
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── Cargo.toml
```

### 运行和测试

1. 将上述代码保存到 `src/main.rs`。
2. 在根目录创建一个 `public` 目录，并放入一些测试文件，例如 `index.html`，`style.css`，`script.js`。
3. 在项目根目录下运行以下命令启动服务器：

```
bash


复制编辑
cargo run
```

4. 打开浏览器，访问 `http://127.0.0.1:8080`，你应该能看到 `public/index.html` 页面被渲染出来。

### 扩展功能

这个简化的 Nginx 版本具有基本的静态文件服务功能，但要达到 Nginx 的所有功能，还需要更多的工作。例如：

1. **多线程处理**：Nginx 是通过多进程/多线程处理多个请求的，虽然我们的代码使用异步方式处理了并发，但还可以通过多进程/线程来进一步提升性能。
2. **反向代理**：Nginx 可以作为反向代理，将请求转发到后端服务。你可以实现类似功能，将 HTTP 请求转发到不同的服务器（比如数据库、应用服务器等）。
3. **负载均衡**：Nginx 支持多种负载均衡算法，可以把流量分发到多个后端服务器。你可以为此实现一个简单的负载均衡器。
4. **TLS/SSL 支持**：你可以集成 HTTPS 支持，通过 `rustls` 或 `openssl` 提供加密传输。

### 总结

这个简化版的 Nginx（HTTP 服务器）项目展示了如何用 Rust 构建一个高性能、异步的 Web 服务器。它支持静态文件服务和基本的请求处理。要构建一个像 Nginx 那样的完整工具，需要更多的功能，如反向代理、负载均衡、TLS 加密等。希望这个示例可以帮助你开始使用 Rust 编写高性能网络应用，并且为你未来的扩展奠定基础。

如果你有更多问题或者想要扩展这个项目的某个部分，随时告诉我！

##### 您说：

public/ │ ├── index.html │ ├── style.css │ └── script.js那这几个帮我写一下

###### ChatGPT 说：

好的！我将为你创建一个简单的 `index.html`、`style.css` 和 `script.js` 文件，这些文件将一起使用，并展示一个简单的网页。你可以将这些文件放入 `public` 目录中。

### 1. `index.html`：基本的 HTML 页面

```
html


复制编辑
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rust HTTP Server</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>Welcome to Rust HTTP Server!</h1>
    </header>

    <section>
        <p>This is a simple page served by a Rust HTTP server.</p>
        <button id="changeColorBtn">Change Background Color</button>
    </section>

    <footer>
        <p>Created with love using Rust & Hyper!</p>
    </footer>

    <script src="script.js"></script>
</body>
</html>
```

### 2. `style.css`：基本的样式

```
css


复制编辑
/* Reset some default styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f9;
    color: #333;
    line-height: 1.6;
}

header {
    background-color: #4CAF50;
    color: white;
    padding: 20px;
    text-align: center;
}

h1 {
    font-size: 2.5em;
}

section {
    padding: 20px;
    text-align: center;
}

footer {
    background-color: #333;
    color: white;
    padding: 10px;
    text-align: center;
    position: fixed;
    bottom: 0;
    width: 100%;
}

button {
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
    font-size: 1em;
}

button:hover {
    background-color: #45a049;
}
```

### 3. `script.js`：简单的 JavaScript 功能

```
javascript


复制编辑
document.getElementById('changeColorBtn').addEventListener('click', function() {
    // Change the background color of the page when the button is clicked
    const colors = ['#f4f4f9', '#ffcccb', '#d3f8e2', '#fff7c2'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    document.body.style.backgroundColor = randomColor;
});
```

### 文件说明

1. `**index.html**`:

- 这是一个简单的 HTML 页面，包含了页面的标题、头部和正文。
- 页面展示了一个标题、一段描述文本以及一个按钮，按钮的功能是更改页面的背景颜色。
- 它链接了 `style.css` 来设置页面的样式，以及 `script.js` 来处理按钮点击事件。

2. `**style.css**`:

- 用于给页面添加一些基本样式。
- 设置了页面背景、字体、按钮样式等，使得页面看起来更美观。
- 使用了`position: fixed;`让页面底部的 `footer` 始终固定在底部。

3. `**script.js**`:

- 这个 JavaScript 文件为按钮添加了点击事件。当按钮被点击时，页面的背景颜色会随机更改。

### 如何使用这些文件

1. 在你的项目目录下创建一个 `public` 文件夹，并将这三个文件 `index.html`、`style.css`、`script.js` 放进去。
2. 当你运行 Rust 服务器时，通过浏览器访问 `http://127.0.0.1:8080`，你应该会看到这个简单的网页。
3. 点击页面上的按钮，背景色会随机变化。

这个简单的静态网页展示了如何通过 Rust 的 HTTP 服务器提供基本的静态文件服务，你可以在这个基础上扩展更多的功能。希望这对你有所帮助！如果你有任何问题或者想进一步扩展，随时告诉我！