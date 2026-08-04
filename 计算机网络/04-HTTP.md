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

| 类别 | 例子 | 作用 |
| --- | --- | --- |
| 主机与连接 | `Host`、`Connection` | 虚拟主机、keep-alive |
| 内容相关 | `Content-Type`、`Content-Length`、`Transfer-Encoding` | 体类型与长度 |
| 协商与缓存 | `Accept`、`Accept-Encoding`、`If-None-Match`、`Cache-Control` | 内容协商、缓存 |
| 认证与状态 | `Cookie`、`Authorization` | 登录态 |
| 来源与安全 | `Origin`、`Referer`、`User-Agent` | CORS、统计、风控 |

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

| 码 | 含义 | 面试一句话 |
| --- | --- | --- |
| 200 | OK | 成功 |
| 201 | Created | 创建成功 |
| 204 | No Content | 成功但无正文 |
| 301 | Moved Permanently | 永久重定向，SEO/缓存会记新地址 |
| 302 | Found | 临时重定向 |
| 304 | Not Modified | 协商缓存命中 |
| 400 | Bad Request | 请求格式错 |
| 401 | Unauthorized | 未认证 |
| 403 | Forbidden | 已认证但无权限 |
| 404 | Not Found | 资源不存在 |
| 405 | Method Not Allowed | 方法不允许 |
| 429 | Too Many Requests | 限流 |
| 500 | Internal Server Error | 服务端异常 |
| 502 | Bad Gateway | 网关/代理上游异常 |
| 503 | Service Unavailable | 过载或维护 |
| 504 | Gateway Timeout | 网关等上游超时 |

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

### Q5. HTTP 1.0 和 2.0 有什么区别？

| | HTTP/1.0 | HTTP/2 |
| --- | --- | --- |
| 连接 | 默认短连接 | 通常长连接 + 多路复用 |
| 格式 | 纯文本 | **二进制分帧** |
| 并行 | 多开 TCP 连接 | **一连接多流** |
| 头部 | 冗余大 | **HPACK 压缩** |
| 队头阻塞 | 严重（同连接） | 缓解应用层队头阻塞 |
| 推送 | 无 | 可 Server Push（用得少） |

HTTP/1.1 介于两者之间：默认 keep-alive，但仍是文本、易队头阻塞。

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
    S1 -.-> Conn["同一 TCP 连接上交错帧"]
    S2 -.-> Conn
    S3 -.-> Conn
  end
```

---

### Q6. HTTP 2.0 和 3.0 有什么区别？

| | HTTP/2 | HTTP/3 |
| --- | --- | --- |
| 底层 | TCP + TLS | **QUIC（基于 UDP）** |
| 队头阻塞 | 应用层改善了，**TCP 丢包仍堵整连接** | 流之间更独立，减轻队头阻塞 |
| 握手 | TCP + TLS 多轮 | QUIC 把传输与加密结合，**建连更快** |
| 连接迁移 | IP 变了连接通常断 | 支持**连接迁移**（换 Wi-Fi/4G 更稳） |
| 部署 | 已很普及 | 在增长，需 UDP/基础设施支持 |

```mermaid
flowchart TB
  H2["HTTP/2"] --> TCP["TCP"]
  TCP --> TLS1["TLS"]
  H3["HTTP/3"] --> QUIC["QUIC"]
  QUIC --> UDP["UDP"]
  QUIC --> TLS13["内置 TLS1.3 思想"]
```

---

### Q7. WebSocket 与 HTTP 有什么区别？

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

### Q8. Cookie、Session、Token 之间有什么区别？

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

### Q9. HTTP 长连接和短连接有什么区别？

| | 短连接 | 长连接（Keep-Alive） |
| --- | --- | --- |
| 行为 | 一次请求响应后关闭 TCP | 同一 TCP 上多次请求 |
| 开销 | 反复握手/挥手/TLS，贵 | 摊薄建连成本 |
| 适用 | 极低频请求 | Web、RPC、常规 API |

HTTP/1.0 默认短连接；HTTP/1.1 默认长连接；HTTP/2 更是长时间复用。

---

### Q10. 说说 HTTP 缓存机制（强缓存 / 协商缓存）？

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

### Q11. 什么是跨域？CORS 怎么解决？

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

### Q12. 301、302、307、308 有什么区别？

| 码 | 含义 | 方法是否允许变 |
| --- | --- | --- |
| 301 | 永久重定向 | 很多客户端会把 POST 改成 GET |
| 302 | 临时重定向 | 历史上也常改成 GET |
| 307 | 临时重定向 | **不允许改方法** |
| 308 | 永久重定向 | **不允许改方法** |

SEO：永久迁移用 301/308；临时跳转用 302/307。

---

### Q13. 什么是分块传输 chunked？

不知道正文总长度时（边生成边发），用 `Transfer-Encoding: chunked`：按块发送 `长度 + 数据`，最后 `0` 长度块结束。  
HTTP/2 用帧承载，不再依赖 HTTP/1.1 的 chunked 文本机制。

---

### Q14. HTTP 幂等性是什么？哪些方法幂等？

**幂等**：同一请求执行多次，对资源的副作用与执行一次相同。

| 方法 | 安全（不改资源） | 幂等 |
| --- | --- | --- |
| GET / HEAD | 是 | 是 |
| PUT / DELETE | 否 | 是 |
| POST / PATCH | 否 | 一般否 |

支付等业务要自己做幂等键，不能只靠 HTTP 方法语义。

---

### Q15. 长轮询、WebSocket、SSE 怎么选？

| | 长轮询 | WebSocket | SSE |
| --- | --- | --- | --- |
| 方向 | 模拟推送 | 全双工 | **服务端→客户端** 单向流 |
| 基于 | 普通 HTTP | 升级后的长连接 | HTTP |
| 复杂度 | 低 | 中 | 较低 |
| 场景 | 兼容差环境 | 聊天、协作、游戏 | 通知、简单推送 |

---

### Q16. 什么是 RESTful？和 HTTP 什么关系？

REST 是架构风格：资源用 URL 标识，用 HTTP 方法表达动作，用状态码表达结果，无状态交互。  
不等于「用了 JSON 就是 REST」；重点是资源建模与语义化方法。

---

## 关联

- [[05-HTTPS与安全]] · [[03-TCP与UDP]] · [[06-DNS与应用层]] · [[08-高频对比与场景题]] · [[09-代理负载与网络IO]]
