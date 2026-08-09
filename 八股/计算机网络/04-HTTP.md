# 04 · HTTP

> 节点目标：HTTP 结构与解析、方法、状态码、版本差异、WebSocket、Cookie/Session/Token。

---

## 面试题

### Q1. HTTP 请求包含哪些内容？请求头和请求体有哪些类型？

一个 HTTP 报文由四部分组成：

```text
请求行
请求头（若干行）
空行
请求体（可选）
```

**请求行：** `方法 + URL + 协议版本`  
例：`GET /api/user?id=1 HTTP/1.1`

**常见请求头类型（按用途记）：**

| 类别    | 例子                                                         | 作用              |
| ----- | ---------------------------------------------------------- | --------------- |
| 主机与连接 | `Host`、`Connection`                                        | 虚拟主机、keep-alive |
| 内容相关  | `Content-Type`、`Content-Length`、`Transfer-Encoding`        | 体类型与长度          |
| 协商与缓存 | `Accept`、`Accept-Encoding`、`If-None-Match`、`Cache-Control` | 内容协商、缓存         |
| 认证与状态 | `Cookie`、`Authorization`                                   | 登录态             |
| 来源与安全 | `Origin`、`Referer`、`User-Agent`                            | CORS、统计、风控      |

**请求体常见类型（`Content-Type`）：**

| Content-Type | 场景 |
| --- | --- |
| `application/json` | 接口 JSON |
| `application/x-www-form-urlencoded` | 表单默认 |
| `multipart/form-data` | 文件上传 |
| `text/plain` / `text/xml` | 文本、XML |
| `application/octet-stream` | 二进制 |

GET 通常无 body；POST/PUT/PATCH 常有 body。

```mermaid
flowchart TB
  Req["HTTP 请求"]
  Req --> Line["请求行<br/>METHOD URL VERSION"]
  Req --> Headers["请求头<br/>Host / Content-Type / Cookie ..."]
  Req --> Blank["空行（分隔）"]
  Req --> Body["请求体（可选）"]
```

---

### Q2. 服务端是如何解析 HTTP 请求的数据的？

本质是**按协议状态机读字节流**（TCP 无消息边界，靠 HTTP 规则切包）：

```mermaid
flowchart TB
  TCP["从 TCP 连接读字节"] --> RL["读到第一行换行 → 解析请求行<br/>method / path / version"]
  RL --> HD["逐行读取 Header<br/>直到空行"]
  HD --> Len{"如何确定 Body 长度？"}
  Len -->|"Content-Length"| CL["读固定 N 字节"]
  Len -->|"Transfer-Encoding: chunked"| CK["按 chunk 长度循环读"]
  Len -->|"无 Body（如 GET）"| Done["解析完成"]
  CL --> Done
  CK --> Done
  Done --> App["路由到业务 Handler"]
```

要点：

1. **请求行** → 方法、路径、版本  
2. **头部** → 键值对，空行结束  
3. **Body** → 看 `Content-Length` 或 `chunked`；HTTP/2 则是二进制帧里的 DATA 帧  
4. Web 容器（Tomcat、Nginx、Netty 编解码器）都实现了这套解析  

粘包场景下，服务端必须严格按长度/chunk 规则读，不能「一次 read 当一个请求」。

---

### Q3. HTTP 中 GET 和 POST 的区别是什么？

| 维度 | GET | POST |
| --- | --- | --- |
| 语义 | 获取资源，应安全、幂等 | 提交/创建，可能改服务器状态 |
| 参数位置 | 多在 URL Query | 多在 Body |
| 缓存 | 可被缓存、可收藏 | 一般不缓存 |
| 长度 | 受 URL 长度限制 | Body 可更大 |
| 编码 | 参数在 URL 中可见 | Body 不进地址栏 |
| 历史记录 | 完整 URL 可能留下 | Body 通常不进历史 |

注意：

- **安全性**：GET/POST 都是明文（除非 HTTPS），不是「POST 就安全」  
- REST 里还会用 PUT/DELETE/PATCH，别只会死记 GET/POST  

---

### Q4. 常见的 HTTP 状态码有哪些？

| 段 | 含义 |
| --- | --- |
| 1xx | 信息（少见，如 100 Continue） |
| 2xx | 成功 |
| 3xx | 重定向 / 缓存 |
| 4xx | 客户端错误 |
| 5xx | 服务端错误 |

**高频具体码：**

| 码   | 含义                    | 面试一句话             |
| --- | --------------------- | ----------------- |
| 200 | OK                    | 成功                |
| 201 | Created               | 创建成功              |
| 204 | No Content            | 成功但无正文            |
| 206 | Partial Content       | 永久重定向，SEO/缓存会记新地址 |
| 301 | Moved Permanently     | 永久重定向，SEO/缓存会记新地址 |
| 302 | Found                 | 临时重定向             |
| 304 | Not Modified          | 协商缓存命中            |
| 400 | Bad Request           | 请求格式错             |
| 401 | Unauthorized          | 未认证               |
| 403 | Forbidden             | 已认证但无权限           |
| 404 | Not Found             | 资源不存在             |
| 405 | Method Not Allowed    | 方法不允许             |
| 408 | Request Timeout       | 服务端等待客户端上传数据超时    |
| 429 | Too Many Requests     | 限流                |
| 499 | Client Closed Request | 客户端主动断开连接         |
| 500 | Internal Server Error | 服务端异常             |
| 501 | Not Implemented       | 服务器不支持当前请求所需功能    |
| 502 | Bad Gateway           | 网关/代理上游异常         |
| 503 | Service Unavailable   | 过载或维护             |
| 504 | Gateway Timeout       | 网关等上游超时           |

```mermaid
flowchart TB
  Code["状态码"] --> A["2xx 成功"]
  Code --> B["3xx 换地方 / 用缓存"]
  Code --> C["4xx 你的问题"]
  Code --> D["5xx 我的问题"]
  C --> C1["401 没登录"]
  C --> C2["403 没权限"]
  D --> D1["502 上游挂了"]
  D --> D2["504 上游太慢"]
```

---

### Q5. HTTP/1.x、HTTP/2、HTTP/3 有什么区别？怎么演进的？

HTTP 几个版本主要围绕两个核心痛点演进：

1. **连接成本**：TCP 连接多、建连慢  
2. **传输效率**：头部冗余、队头阻塞  

| | HTTP/1.0 | HTTP/1.1 | HTTP/2 | HTTP/3 |
| --- | --- | --- | --- | --- |
| 连接 | 默认短连接 | 默认 keep-alive | 长连接 + **多路复用** | 同上，但跑在 **QUIC** |
| 格式 | 纯文本 | 纯文本 | **二进制分帧** | 二进制（基于 QUIC 流） |
| 并行 | 多开 TCP | 仍常多连接 / Pipeline 少用 | **一连接多流** | 多流，流更独立 |
| 头部 | 冗余大 | 冗余大 | **HPACK 压缩** | **QPACK**（思路类似） |
| 队头阻塞 | 严重 | 同连接仍严重 | 缓解**应用层**阻塞；**TCP 丢包仍堵整连接** | 流之间更独立，减轻队头阻塞 |
| 底层 | TCP | TCP | TCP + TLS | **QUIC（UDP）+ 内置加密** |
| 建连 | 每次新建贵 | 可复用连接 | 仍要 TCP+TLS 多轮 | 传输与加密结合，**往往更快** |
| 连接迁移 | IP 变通常断 | 同左 | 同左 | **支持连接迁移**（切 Wi-Fi/4G） |
| 推送 | 无 | 无 | Server Push（用得少） | 亦有，实践仍谨慎 |
| 部署 | 历史 | 仍广泛 | 已很普及 | 在增长，需 UDP/基础设施支持 |

##### HTTP1.0
在这个阶段遇到的问题是每一个请求都要新建一个连接
请求1 ──TCP连接── 响应1 ──关闭──
请求2 ──TCP连接── 响应2 ──关闭──
请求3 ──TCP连接── 响应3 ──关闭──

每个请求都要建立新连接（三次握手）
每个请求都要关闭连接（四次挥手）
大量时间浪费在连接建立和关闭上

##### HTTP/1.1
这个阶段，进行了改进了连接复用 KeepAlive
也就是一个TCP连接对应了多个请求和响应
请求1 ──┐
请求2 ──┼─ 同一个TCP连接 ─┬─ 响应1
请求3 ──┤                                    ├─ 响应2
请求4 ──┘                                    ├─ 响应3
                            └─ 响应4
                                        
解决的问题
一个TCP连接可以发送多个请求
减少连接建立/关闭的开销
性能提升明显

还有的问题:
1. 队头阻塞（Head-of-Line Blocking）
请求1 ──┐
请求2 ──┼─ 同一个TCP连接
请求3 ──┘

响应顺序必须是：响应1 → 响应2 → 响应3

如果响应1很大，响应2和3就要等着：
|--响应1(很大)--|--响应2--|--响应3--|
                 ↑
              被阻塞了
2. 请求必须按顺序发送
客户端想同时发送请求1、2、3
但HTTP/1.1要求：
  发送请求1 → 等待响应1 → 发送请求2 → 等待响应2 → 发送请求3

不能同时发送多个请求

3. Header重复
请求1: Host: baidu.com, User-Agent: Chrome, Cookie: xxx
请求2: Host: baidu.com, User-Agent: Chrome, Cookie: xxx
请求3: Host: baidu.com, User-Agent: Chrome, Cookie: xxx
每个请求都要重复发送相同的Header


##### HTTP/2（2015年）
这里主要是为了解决队头阻塞, 请求顺序问题,请求头Header重复问题
引入了多路复用来进行优化

关键：可以同时发送多个请求，响应可以乱序返回！

时间轴：
|--请求1,2,3,4同时发送--|--响应可以乱序返回--|

HTTP/2的架构：
HTTP/2 Stream（流）
  ├─ Stream 1: 请求1 → 响应1
  ├─ Stream 2: 请求2 → 响应2
  ├─ Stream 3: 请求3 → 响应3
  └─ Stream 4: 请求4 → 响应4
所有Stream共享一个TCP连接

解决的问题

1. 解决队头阻塞
请求1 ──┐
请求2 ──┼─ 同一个TCP连接
请求3 ──┘

响应1很大，但响应2、3可以先返回：
|--响应2--|--响应3--|--响应1(很大)--|


2. 解决请求必须按顺序发送
可以同时发送请求1、2、3、4
不用等待响应

3. Header压缩
使用HPACK算法压缩Header
相同的Header只发送一次，后续请求只发送差异部分

4. 二进制分帧
HTTP/1.1: 文本格式
GET / HTTP/1.1\r\nHost: baidu.com\r\n...

HTTP/2: 二进制格式
[帧头][帧体][帧头][帧体]...
更高效，更容易解析

还有的问题:
TCP是有序的，如果一个包丢失：
|--包1--|--包2(丢失)--|--包3--|--包4--|

TCP要等包2重传，包3、4才能被应用层使用
即使HTTP/2可以乱序，TCP也要等

这是TCP的特性，HTTP/2无法解决

##### HTTP/3（2022年）
核心改进：基于QUIC协议（替代TCP）
HTTP/1.1: HTTP → TCP → IP
HTTP/2:   HTTP → TCP → IP
HTTP/3:   HTTP → QUIC → UDP → IP
                ↑
            不再用TCP！
为什么要替换TCP？

因为TCP的问题：

TCP队头阻塞（即使HTTP/2也解决不了）
TCP握手慢（三次握手）
TCP是内核实现，改进困难


口述抓两条线即可：

- **1.x → 2**：同一 TCP 上二进制分帧 + 多路复用 + 头部压缩，解决「连接多、头冗余、应用层排队」  
- **2 → 3**：换 QUIC，解决「TCP 层队头阻塞 + 建连/切网」  

```mermaid
flowchart LR
  subgraph H1["HTTP/1.x"]
    R1["请求1"] --> W1["等响应1"]
    W1 --> R2["请求2"]
  end
  subgraph H2["HTTP/2"]
    S1["流1"]
    S2["流2"]
    S3["流3"]
    S1 -.-> Conn["同一 TCP 上交错帧"]
    S2 -.-> Conn
    S3 -.-> Conn
  end
```

```mermaid
flowchart TB
  H2["HTTP/2"] --> TCP["TCP"]
  TCP --> TLS1["TLS"]
  H3["HTTP/3"] --> QUIC["QUIC"]
  QUIC --> UDP["UDP"]
  QUIC --> TLS13["内置 TLS1.3 思想"]
```

细节（帧/流、QUIC、0-RTT）见 [[10-HTTP2与QUIC]]。

![](https://pic.code-nav.cn/mianshiya/question_picture/1783388929455529986/Salglgtq_image_mianshiya.webp)

这里详细描述下HTTP2和HTTP3的差距

**核心区别主要有五点**:
基于的传输层协议不同:
1. HTTP/2:依然基于TCP。虽然它在应用层实现了多路复用,但底层还得听TCP的指挥。
   HTTP/3:基于UDP,使用Google研发的QUIC协议。它在UDI之上自己实现了一套可靠传输机制,甩掉了TCP的
历史包袱。
2. 彻底解决队头阻塞:
HTTP/2的问题:虽然它把请求拆成了流(Stream),但TCP不知道这些流的存在。一旦丢了一个数据包,TCP就会暂
停所有流的数据,等待重传。这就是TCP层的队头阻塞。
HTTP/3的解法:QUIC是真正独立的。StreamA丢包了,只会阿且塞StreamA,StreamB、C照样跑,互不影响。这
在弱网环境下(丢包率高)性能提升巨大。
3. 建连速度(0-RTT):
HTTP/2:需要TCP三次握手+TLS握手,最快也要2-3个RT「才能发数据。
HTTP/3:QUIC把传输层握手和加密握手合并了(QUIC握手过程包含了TLS1.3)。如果是老用户(之前连过),可以直接0-RTT发送数据,也就是打招呼的同时就把事办了。
4. 连接迁移:
HTTP/2:基于TCP,靠四元组(IP:Port)识别连接。你从Wi-Fi切到4G,IP变了,连接就断了,必须重连。
HTTP/3:基于Connection ID。不管你 IP怎么变,只要ID沙没变,连接就一直在线,视频通话、下载都不会断。
5. 头部压缩算法升级
HTTP/2使用HPACK,它依赖TCP的有序传输。如果包乱序了,HPACK的动态字典就会错乱
HTTP/3升级为QPACK,允许头部帧乱序到达,真正契合了UDP的特性。

---

### Q6. WebSocket 与 HTTP 有什么区别？

| | HTTP | WebSocket |
| --- | --- | --- |
| 模式 | 请求-响应，客户端主动拉 | **全双工**，双方都可主动推 |
| 连接 | 短或 keep-alive 复用请求 | 升级后**长连接**持续帧通信 |
| 开销 | 每请求大量头 | 握手后帧头很小 |
| 场景 | 普通网页、REST | 聊天、行情、协作、通知 |

握手仍从 HTTP 开始：

```mermaid
sequenceDiagram
  participant C as 客户端
  participant S as 服务端
  C->>S: HTTP 请求<br/>Upgrade: websocket<br/>Connection: Upgrade
  S-->>C: 101 Switching Protocols
  Note over C,S: 之后走 WebSocket 二进制/文本帧<br/>可双向推送
  C->>S: 消息
  S->>C: 推送
```

> 更深的握手细节、帧结构、心跳重连、集群推送、鉴权安全等，见专题 **[[14-WebSocket]]**（25 题）。

---

### Q7. Cookie、Session、Token 之间有什么区别？

| | Cookie | Session | Token（如 JWT） |
| --- | --- | --- | --- |
| 存哪 | 浏览器 | 服务端（SessionId 常放 Cookie） | 客户端（Header/本地存储） |
| 内容 | 小段键值 | 服务端会话数据 | 自包含声明或引用凭证 |
| 状态 | 本身只是存储机制 | **有状态**（服务端要存） | 常做成**无状态** |
| 跨域/扩展 | 受域限制 | 集群要共享 Session | 易水平扩展 |
| 典型用途 | 存偏好、存 SessionId | 登录态 | API 鉴权、SSO |

```mermaid
sequenceDiagram
  participant B as 浏览器
  participant S as 服务端
  Note over B,S: Session 模式
  B->>S: 登录
  S-->>B: Set-Cookie: sessionId=xxx
  B->>S: 请求带 Cookie
  S->>S: 查 Session 存储
  S-->>B: 业务数据

  Note over B,S: Token 模式
  B->>S: 登录
  S-->>B: 返回 JWT
  B->>S: Authorization: Bearer JWT
  S->>S: 校验签名/过期（可不查库）
  S-->>B: 业务数据
```

Cookie 关键属性：`HttpOnly`（防 XSS 读）、`Secure`（仅 HTTPS）、`SameSite`（缓解 CSRF）。

---

### Q8. HTTP 长连接和短连接有什么区别？

| | 短连接 | 长连接（Keep-Alive） |
| --- | --- | --- |
| 行为 | 一次请求响应后关闭 TCP | 同一 TCP 上多次请求 |
| 开销 | 反复握手/挥手/TLS，贵 | 摊薄建连成本 |
| 适用 | 极低频请求 | Web、RPC、常规 API |

HTTP/1.0 默认短连接；HTTP/1.1 默认长连接；HTTP/2 更是长时间复用。

---

### Q9. 说说 HTTP 缓存机制（强缓存 / 协商缓存）？

```mermaid
flowchart TB
  Req["发起请求"] --> Strong{"强缓存未过期？<br/>Cache-Control max-age / Expires"}
  Strong -->|是| Local["直接用本地，可 200 from cache"]
  Strong -->|否| Neg["带条件请求<br/>If-None-Match / If-Modified-Since"]
  Neg --> S["服务器"]
  S -->|未改| R304["304 Not Modified"]
  S -->|已改| R200["200 + 新正文"]
```

| 类型 | 关键头 | 结果 |
| --- | --- | --- |
| 强缓存 | `Cache-Control`、`Expires` | 不发或可直接本地命中 |
| 协商缓存 | `ETag` / `Last-Modified` | 可能 304，省带宽 |

`Cache-Control: no-store / no-cache / private / public / max-age` 面试常问含义。

---

### Q10. 什么是跨域？CORS 怎么解决？

浏览器**同源策略**：协议 + 域名 + 端口都相同才算同源。跨域请求读响应会被浏览器拦截（服务器其实可能已返回）。

**CORS**：服务端通过响应头声明允许谁访问，如：

- `Access-Control-Allow-Origin`
- `Access-Control-Allow-Methods`
- `Access-Control-Allow-Headers`
- 带 Cookie 时还要 `Allow-Credentials` 且 Origin 不能是 `*`

```mermaid
sequenceDiagram
  participant B as 浏览器
  participant S as 跨域服务器
  Note over B,S: 简单请求直接发
  B->>S: GET + Origin
  S-->>B: 数据 + ACAO 头
  Note over B: 浏览器检查 ACAO 是否放行

  Note over B,S: 复杂请求先预检
  B->>S: OPTIONS 预检
  S-->>B: 允许的方法/头
  B->>S: 真实请求
```

其他方案：同源网关反向代理、JSONP（仅老 GET，不推荐）。

---

### Q11. 301、302、307、308 有什么区别？

| 码 | 含义 | 方法是否允许变 |
| --- | --- | --- |
| 301 | 永久重定向 | 很多客户端会把 POST 改成 GET |
| 302 | 临时重定向 | 历史上也常改成 GET |
| 307 | 临时重定向 | **不允许改方法** |
| 308 | 永久重定向 | **不允许改方法** |

SEO：永久迁移用 301/308；临时跳转用 302/307。

---

### Q12. 什么是分块传输 chunked？

不知道正文总长度时（边生成边发），用 `Transfer-Encoding: chunked`：按块发送 `长度 + 数据`，最后 `0` 长度块结束。  
HTTP/2 用帧承载，不再依赖 HTTP/1.1 的 chunked 文本机制。

---

### Q13. HTTP 幂等性是什么？哪些方法幂等？

**幂等**：同一请求执行多次，对资源的副作用与执行一次相同。

| 方法 | 安全（不改资源） | 幂等 |
| --- | --- | --- |
| GET / HEAD | 是 | 是 |
| PUT / DELETE | 否 | 是 |
| POST / PATCH | 否 | 一般否 |

支付等业务要自己做幂等键，不能只靠 HTTP 方法语义。

---

### Q14. 长轮询、WebSocket、SSE 怎么选？

| | 长轮询 | WebSocket | SSE |
| --- | --- | --- | --- |
| 方向 | 模拟推送 | 全双工 | **服务端→客户端** 单向流 |
| 基于 | 普通 HTTP | 升级后的长连接 | HTTP |
| 复杂度 | 低 | 中 | 较低 |
| 场景 | 兼容差环境 | 聊天、协作、游戏 | 通知、简单推送 |

---

### Q15. 什么是 RESTful？和 HTTP 什么关系？

REST 是架构风格：资源用 URL 标识，用 HTTP 方法表达动作，用状态码表达结果，无状态交互。  
不等于「用了 JSON 就是 REST」；重点是资源建模与语义化方法。

---

### Q16. Cookie 有哪些关键属性？和安全有什么关系？

| 属性 | 作用 |
| --- | --- |
| `Domain` / `Path` | 哪些主机/路径会带上 |
| `Expires` / `Max-Age` | 持久化 vs 会话 Cookie |
| `Secure` | 只在 HTTPS 发送 |
| `HttpOnly` | JS 读不到，缓解 XSS 偷 Cookie |
| `SameSite` | `Strict/Lax/None`，缓解 CSRF |
| `Partitioned` 等 | 新隐私相关（了解即可） |

口诀：**敏感会话 Cookie 尽量 Secure + HttpOnly + SameSite。**

---

### Q17. ETag / Last-Modified 协商缓存细节？

1. 首次响应带 `ETag` 或 `Last-Modified`  
2. 再请求带 `If-None-Match` / `If-Modified-Since`  
3. 未变 → **304**，省流量；变了 → 200 + 新正文  

强缓存（`Cache-Control: max-age`）未过期**根本不发请求**；过期后才走协商。  
`ETag` 分强/弱校验；内容哈希做 ETag 常见。

---

### Q18. 什么是 HTTP Range 请求？断点续传怎么做？

客户端头：`Range: bytes=0-1023`  
服务端：`206 Partial Content` + `Content-Range`  

用途：断点续传、多线程下载、视频拖拽。  
条件：资源支持范围；注意鉴权与缓存。

---

### Q19. HTTP Pipeline 是什么？为什么少用？

HTTP/1.1 允许一条连接上连续发多个请求不等响应（流水线）。  
现实：队头阻塞、实现 buggy、代理不友好 → **基本被弃用**；改用并发连接或 HTTP/2 多路复用。

---

### Q20. Content-Length 和 Transfer-Encoding 能同时出现吗？

规范上 chunked 时不应再依赖 Content-Length 定界；实现若两者都有容易歧义，安全上曾有「请求走私」利用。  
网关/代理要统一归一化报文边界。详见 [[15-拓展知识与场景题]] 请求走私。

---

### Q21. 401、403、404、429、502、504 怎么向面试官区分？

| 码 | 一句话 |
| --- | --- |
| 401 | 未认证（没登录/Token 无效） |
| 403 | 已认证但没权限 / 拒绝 |
| 404 | 资源不存在（或故意隐藏） |
| 429 | 限流太快 |
| 502 | 网关上游无效响应 |
| 504 | 网关等上游超时 |

---

### Q22. 什么是幂等键？POST 如何做成可重试？

客户端生成唯一 `Idempotency-Key`，服务端对同一键只执行一次业务副作用。  
网络超时重试 POST 时靠它避免重复下单——**业务幂等**补 HTTP 语义不足。

---

### Q23. HTTP 内容协商 Accept 系列怎么工作？

客户端声明能力：`Accept` / `Accept-Language` / `Accept-Encoding`  
服务端选表示，可用 `Vary` 告诉缓存「按哪些头区分变体」。  
`Accept-Encoding: gzip, br` → 压缩传输，浏览器自动解。

---

### Q24. 浏览器同源下 Cookie 自动携带，跨站呢？

- 同站请求：按 Domain/Path/SameSite 规则带 Cookie  
- 跨站：受 **SameSite** 与第三方 Cookie 策略限制越来越严  
- CORS 带 Cookie 需 `credentials` + 服务端 `Access-Control-Allow-Credentials`，且 `Allow-Origin` 不能是 `*`

---

## 拓展知识

### Q25. 什么是 HTTP 请求走私（Request Smuggling）？（拓展）

前端（CDN/反代）与后端对「请求边界」解析不一致（CL/TE 歧义）时，攻击者可把下一个请求「藏」进当前请求，污染队列。  
防：统一用 HTTP/2 到源、规范化头、升级代理、拒绝歧义报文。

---

### Q26. GraphQL / gRPC-Web 和「纯 REST」在 HTTP 上的差异？（拓展）

- GraphQL：常一个 POST 端点，语义在 body；缓存/网关要另做  
- gRPC-Web：浏览器侧借 HTTP/1.1 或 H2 封装，与原生 gRPC 有代理转换  

选型别只比「好不好看」，要比**缓存、调试、流式、多语言、网关生态**。

---

### Q27. 提问:HTTP/2的多路复用解决了HTTP层的队头阻塞,为什么还会有TCP层的队头阻塞?
回答:HTTP/2的多路复用是在应用层把多个请求打散成帧乱/序发送,但底下跑的还是一条TCP连接。TCP是有序传输的,
假设帧1、2、3发过去,帧2丢了,TCP会卡在那等帧2重传成功才会把帧3交给上层,哪怕帧3早就到了。这就导致一
个流丢包,所有流都得等着,这是TCP协议本身的特性决定的为,HTTP/2在应用层搞不定。

### Q28. 提问:HPACK和QPACK都提到了静态表和动态表,能说说了它们的区别和作用吗?
回答:静态表是预定义好的、协议规定的常见Header,比如:method:GET、content-type:text/html这些,客户端和服务
端都内置了,直接用索引号代替,省得每次发全文。动态表是运行时建立的,遇到新Header就往里加,下次再遇到同样的
Header直接发索引。HPACK的动态表要求严格有序,必须等前面的都到了才能更新;QPACK改进了这点,动态表的更新走
单独的单向流,解码端收到更新再用,避免了因为乱序到达导致的阻塞。

### Q29. 提问:HTTP/2的服务端推送为什么在HTTP/3被废弃了?实际用的时候有什么问题?
回答:主要是实际效果没想象的好,还带来一堆麻烦。服务端很难精准判断客户端到底需要什么,推过去的资源可能客户端缓存里已经有了,白白浪费带宽。
还有就是控制粒度太粗,服务端推了一堆东西,客户端想取消也麻烦。加上CDN这类中间层
处理起来也复杂,最后大家发现还不如让客户端自己发请求来得靠谱。


### Q30. QUIC用Connection ID来标识连接,那切换网络后怎么保证请求能路由到正确的服务器?
回答:这个问题在实际部署时确实要考虑。如果后端是单机还好,但生产环境一般都是负载均衡加集群。传统四元组做哈希,
IP变了就飘到别的机器去了。解决办法是让负载均衡器能识别QUIC的Connection ID,用Connection ID做一致性哈希,
或者把连接状态同步到共享存储。云厂商的LB现在基本都支特QUIC的这种路由方式了。
 
## 关联

- [[05-HTTPS与安全]] · [[03-TCP与UDP]] · [[06-DNS与应用层]] · [[10-HTTP2与QUIC]] · [[15-拓展知识与场景题]]
