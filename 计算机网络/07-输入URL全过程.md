# 07 · 从输入网址到页面显示

> 节点目标：综合串讲题。把 DNS / TCP / TLS / HTTP / 渲染串成一条可口述的时间线。

---

## 面试题

### Q1. 从网络角度来看，用户从输入网址到网页显示，期间发生了什么？

以访问 `https://www.example.com/` 为例。

#### 总览（先背这个）

```mermaid
flowchart TB
  A["1. 解析 URL"] --> B["2. 查缓存 / DNS 解析得 IP"]
  B --> C["3. 建立 TCP 连接（三次握手）"]
  C --> D["4. TLS 握手（HTTPS）"]
  D --> E["5. 发送 HTTP 请求"]
  E --> F["6. 服务器处理并响应"]
  F --> G["7. 浏览器解析 HTML，请求子资源"]
  G --> H["8. 渲染页面"]
  H --> I["9. 连接复用或挥手关闭"]
```

#### 分步详解

**① 解析 URL**

- 协议：`https` → 端口默认 443  
- 主机：`www.example.com`  
- 路径：`/`；`#hash` 一般不发给服务器  

**② DNS 解析得到 IP**

浏览器缓存 → 系统缓存 / hosts → 本地 DNS →（未命中则）根 / 顶级 / 权威。  
若用了 CDN，拿到的可能是**边缘节点 IP**。详见 [[06-DNS与应用层]]。

**③ 建立 TCP 连接**

四元组确定连接；三次握手。同网段 ARP 解析下一跳 MAC；跨网段先找网关。详见 [[03-TCP与UDP]]、[[02-IP与网络层]]。

**④ TLS 握手（仅 HTTPS）**

校验证书、协商会话密钥，之后 HTTP 在加密通道中传输。详见 [[05-HTTPS与安全]]。

**⑤ 发 HTTP 请求**

```text
GET / HTTP/1.1
Host: www.example.com
...
```

**⑥ 服务端响应**

状态码 + 头 + HTML 正文（或 301/302 重定向，则可能重新 DNS/连接）。

**⑦ 加载子资源**

解析 HTML 时遇到 CSS/JS/图片，再发请求：

- HTTP/1.1：可能多条 TCP  
- HTTP/2：同连接多路复用  
- HTTP/3：走 QUIC  

**⑧ 渲染（前端向，点到即可）**

```mermaid
flowchart LR
  HTML["解析 HTML → DOM"] --> Tree["Render Tree"]
  CSS["解析 CSS → CSSOM"] --> Tree
  Tree --> Layout["布局 Layout"]
  Layout --> Paint["绘制 Paint"]
  Paint --> Comp["合成 Composite"]
  JS["执行 JS"] -.->|"可能改 DOM/CSS"| HTML
  JS -.-> CSS
```

**⑨ 连接结束**

Keep-Alive 则复用；否则四次挥手关闭。

#### 带时序的网络视角

```mermaid
sequenceDiagram
  participant U as 用户/浏览器
  participant DNS as DNS
  participant S as 服务器

  U->>DNS: 解析 www.example.com
  DNS-->>U: 返回 IP
  U->>S: TCP SYN
  S-->>U: SYN+ACK
  U->>S: ACK
  U->>S: TLS ClientHello ...
  S-->>U: 证书 + ServerHello ...
  Note over U,S: 协商出会话密钥
  U->>S: 加密的 HTTP GET /
  S-->>U: 加密的 HTTP 200 + HTML
  U->>S: 请求 CSS/JS/图片...
  S-->>U: 返回子资源
  Note over U: 解析并渲染页面
```

#### 面试加分追问怎么接

| 追问 | 答法方向 |
| --- | --- |
| 哪一步最慢 | 看情况：DNS、建连+TLS、首字节 TTFB、大资源、渲染阻塞 |
| 如何加速 | DNS 预解析、CDN、HTTP/2/3、缓存、连接复用、SSR、资源压缩 |
| 为什么要 HTTPS | 防窃听篡改、身份认证、SEO/浏览器策略 |
| 重定向会怎样 | 再走一轮（可能再次 DNS），注意 301/302 差异 |

---

## 关联

- [[01-网络分层模型]] · [[02-IP与网络层]] · [[03-TCP与UDP]]
- [[04-HTTP]] · [[05-HTTPS与安全]] · [[06-DNS与应用层]]
