通过本章课程，您将了解：

- SIP协议的基本概念和作用
- SIP协议的工作原理
- SIP协议在语音通话中的角色
- SIP协议与其他协议的关系

## 🤔 什么是SIP？

##### SIP（Session Initiation Protocol，会话发起协议），主要是用来操作多媒体会话的应用层协议。可以进行A与B之间的通信。

### 生活中的类比

想象一下传统的电话系统：

- 你拿起电话，拨号
- 电话公司找到对方的位置
- 建立连接，双方可以通话
- 通话结束后，断开连接

特点:

- 采用客户端 + 服务器的 CS架构进行
- 每个请求都独立，无状态协议，类似于http
- 类似于Http的文本传输格式

```
INVITE sip:bob@example.com SIP/2.0
Via: SIP/2.0/UDP alice.example.com:5060
From: Alice <sip:alice@example.com>
To: Bob <sip:bob@example.com>
Call-ID: 12345@alice.example.com
CSeq: 1 INVITE
Content-Type: application/sdp
Content-Length: 142
```

![](https://cdn.nlark.com/yuque/0/2025/png/43218187/1759115266656-d5919665-a538-4f79-b8d0-9cfa13dac541.png)

SIP核心实体类型：

1. 用户代理，发起或者接受SIP请求的端点
2. 代理服务器，用来转发SIP请求和想要
3. 注册服务器，处理用户注册请求和维护用户地址信息
4. 重定向服务器，返回用户的新位置信息，不转发请求，只提供重定向

![](https://cdn.nlark.com/yuque/0/2025/png/43218187/1759115801286-d96eb5a1-3dce-47d9-854c-7c63e8627423.png)

### 详细步骤说明

1. **INVITE**: Alice发起通话请求
2. **100 Trying**: 服务器确认收到请求
3. **180 Ringing**: Bob的电话开始响铃
4. **200 OK**: Bob接听电话
5. **ACK**: Alice确认收到响应
6. **RTP媒体流**: 开始音频传输
7. **BYE**: 结束通话
8. **200 OK**: 确认通话结束

## SIP与媒体传输

### SDP协议

SIP使用SDP（Session Description Protocol）来描述媒体会话：

```
v=0
o=alice 2890844526 2890844527 IN IP4 alice.example.com
s=Session SDP
c=IN IP4 alice.example.com
t=0 0
m=audio 49170 RTP/AVP 0
a=rtpmap:0 PCMU/8000
```

### RTP协议

实际的音频数据通过RTP（Real-time Transport Protocol 实时传输协议）传输：

- 提供时间戳和序列号
- 支持多种音频编解码器
- 保证实时传输质量

## SIP消息详细解析

### SIP消息结构

每个SIP消息都由以下部分组成：

```
SIP消息 = 起始行 + 头部字段 + 空行 + 消息体
```

#### 1. 起始行 (Start Line)

**请求消息的起始行：**

```
INVITE sip:bob@example.com SIP/2.0
方法 SP 请求URI SP SIP版本
```

**响应消息的起始行：**

```
SIP版本 SP 状态码 SP 原因短语
```

#### 2. 头部字段 (Header Fields)

格式：`字段名: 字段值`

**必选头部字段：**

- `Via`: 请求路径，用于响应路由 —— Via: SIP/2.0/UDP alice.example.com:5060
- `From`: 发起方标识 —— From: Alice <sip:alice@example.com>
- `To`: 接收方标识 —— To: Bob <sip:bob@example.com>
- `Call-ID`: 呼叫标识符 —— Call-ID: 12345@alice.example.com
- `CSeq`: 命令序列号 —— CSeq: 1 INVITE
- `Max-Forwards`: 最大转发次数

**可选头部字段：**

- `Contact`: 联系地址
- `Content-Type`: 消息体类型 —— Content-Type: application/sdp
- `Content-Length`: 消息体长度 —— Content-Length: 142
- `Subject`: 主题
- `User-Agent`: 用户代理信息

#### 3. 消息体 (Message Body)

通常包含SDP（Session Description Protocol）信息，描述媒体会话。

### 详细消息解析示例

#### INVITE请求消息解析

```
起始行 
INVITE sip:bob@example.com SIP/2.0   

头部字段 
Via: SIP/2.0/UDP alice.example.com:5060;branch=z9hG4bK776asdhds  
Max-Forwards: 70
From: Alice <sip:alice@example.com>;tag=1928301774
To: Bob <sip:bob@example.com>
Call-ID: a84b4c76e66710@alice.example.com
CSeq: 314159 INVITE
Contact: <sip:alice@alice.example.com>
Content-Type: application/sdp
Content-Length: 142

消息体
v=0  
o=alice 2890844526 2890844527 IN IP4 alice.example.com
s=Session SDP
c=IN IP4 alice.example.com
t=0 0
m=audio 49170 RTP/AVP 0
a=rtpmap:0 PCMU/8000
```

**逐行解析：**

1. **起始行：** `INVITE sip:bob@example.com SIP/2.0`

- 方法：INVITE（发起会话）
- 请求URI：sip:bob@example.com（目标地址）
- 版本：SIP/2.0

2. **Via头部：** `Via: SIP/2.0/UDP alice.example.com:5060;branch=z9hG4bK776asdhds`

- 协议版本：SIP/2.0
- 传输协议：UDP
- 发送地址：alice.example.com:5060
- 分支标识：z9hG4bK776asdhds（用于匹配请求和响应）

3. **From头部：** `From: Alice <sip:alice@example.com>;tag=1928301774`

- 显示名：Alice
- URI：sip:alice@example.com
- 标签：1928301774（用于对话标识）

4. **To头部：** `To: Bob <sip:bob@example.com>`

- 显示名：Bob
- URI：sip:bob@example.com

5. **Call-ID头部：** `Call-ID: a84b4c76e66710@alice.example.com`

- 全局唯一标识符
- 格式：随机字符串@主机名

6. **CSeq头部：** `CSeq: 314159 INVITE`

- 序列号：314159
- 方法：INVITE

7. **Content-Type头部：** `Content-Type: application/sdp`

- 消息体类型：SDP

8. **Content-Length头部：** `Content-Length: 142`

- 消息体长度：142字节

#### 响应消息解析

```
SIP/2.0 200 OK
Via: SIP/2.0/UDP alice.example.com:5060;branch=z9hG4bK776asdhds
From: Alice <sip:alice@example.com>;tag=1928301774
To: Bob <sip:bob@example.com>;tag=456789
Call-ID: a84b4c76e66710@alice.example.com
CSeq: 314159 INVITE
Contact: <sip:bob@bob.example.com>
Content-Type: application/sdp
Content-Length: 131

v=0
o=bob 2890844527 2890844528 IN IP4 bob.example.com
s=Session SDP
c=IN IP4 bob.example.com
t=0 0
m=audio 49172 RTP/AVP 0
a=rtpmap:0 PCMU/8000
```

**关键差异：**

- 起始行：`SIP/2.0 200 OK`（状态码和原因短语）
- To头部增加了标签：`tag=456789`
- 其他头部基本保持原样

### SIP消息类型详解

#### 请求消息类型

|   |   |   |   |
|---|---|---|---|
|方法|用途|说明|示例场景|
|INVITE|发起会话|建立新的通话|拨打电话|
|ACK|确认响应|确认收到最终响应|确认接听|
|BYE|结束会话|终止通话|挂断电话|
|CANCEL|取消请求|取消未完成的请求|取消拨号|
|OPTIONS|查询能力|查询服务器能力|检查服务状态|
|REGISTER|用户注册|注册用户位置|登录系统|
|INFO|发送信息|发送DTMF等信令|按键音|
|PRACK|临时响应确认|确认临时响应|确认振铃|
|UPDATE|更新会话|修改会话参数|修改媒体|
|REFER|转接|转接到其他用户|呼叫转移|
|NOTIFY|通知|发送事件通知|状态通知|
|SUBSCRIBE|订阅|订阅事件通知|订阅状态|
|MESSAGE|即时消息|发送文本消息|发送短信|

#### 响应消息类型

|               |                                 |           |          |
| ------------- | ------------------------------- | --------- | -------- |
| 状态码           | 含义                              | 说明        | 常见场景     |
| **1xx 信息响应**  |                                 |           |          |
| 100           | Trying                          | 正在尝试      | 服务器收到请求  |
| 180           | Ringing                         | 振铃中       | 对方电话响铃   |
| 181           | Call Is Being Forwarded         | 呼叫被转发     | 呼叫转移中    |
| 182           | Queued                          | 排队中       | 等待接听     |
| 183           | Session Progress                | 会话进行中     | 媒体协商中    |
| **2xx 成功响应**  |                                 |           |          |
| 200           | OK                              | 成功        | 请求成功完成   |
| 202           | Accepted                        | 已接受       | 请求被接受    |
| **3xx 重定向响应** |                                 |           |          |
| 300           | Multiple Choices                | 多种选择      | 多个地址可选   |
| 301           | Moved Permanently               | 永久移动      | 地址已更改    |
| 302           | Moved Temporarily               | 临时移动      | 临时重定向    |
| 305           | Use Proxy                       | 使用代理      | 必须通过代理   |
| 380           | Alternative Service             | 替代服务      | 提供替代方案   |
| **4xx 客户端错误** |                                 |           |          |
| 400           | Bad Request                     | 错误请求      | 请求格式错误   |
| 401           | Unauthorized                    | 未授权       | 需要身份验证   |
| 402           | Payment Required                | 需要付费      | 需要付费     |
| 403           | Forbidden                       | 禁止        | 拒绝访问     |
| 404           | Not Found                       | 未找到       | 用户不存在    |
| 405           | Method Not Allowed              | 方法不允许     | 不支持该方法   |
| 406           | Not Acceptable                  | 不可接受      | 参数不可接受   |
| 407           | Proxy Authentication Required   | 需要代理认证    | 代理需要认证   |
| 408           | Request Timeout                 | 请求超时      | 请求超时     |
| 410           | Gone                            | 已离开       | 用户已离开    |
| 413           | Request Entity Too Large        | 请求实体过大    | 消息体过大    |
| 414           | Request-URI Too Long            | 请求URI过长   | URI过长    |
| 415           | Unsupported Media Type          | 不支持的媒体类型  | 媒体类型不支持  |
| 416           | Unsupported URI Scheme          | 不支持的URI方案 | URI方案不支持 |
| 420           | Bad Extension                   | 错误扩展      | 扩展不支持    |
| 421           | Extension Required              | 需要扩展      | 必须使用扩展   |
| 423           | Interval Too Brief              | 间隔太短      | 注册间隔太短   |
| 480           | Temporarily Unavailable         | 暂时不可用     | 用户暂时不可用  |
| 481           | Call/Transaction Does Not Exist | 呼叫/事务不存在  | 事务不存在    |
| 482           | Loop Detected                   | 检测到循环     | 检测到循环    |
| 483           | Too Many Hops                   | 跳数过多      | 转发次数过多   |
| 484           | Address Incomplete              | 地址不完整     | 地址信息不完整  |
| 485           | Ambiguous                       | 模糊        | 地址模糊     |
| 486           | Busy Here                       | 这里忙       | 用户忙      |
| 487           | Request Terminated              | 请求终止      | 请求被终止    |
| 488           | Not Acceptable Here             | 这里不可接受    | 参数不可接受   |
| 491           | Request Pending                 | 请求待处理     | 有未完成的请求  |
| 493           | Undecipherable                  | 不可理解      | 消息不可理解   |
| **5xx 服务器错误** |                                 |           |          |
| 500           | Internal Server Error           | 内部服务器错误   | 服务器内部错误  |
| 501           | Not Implemented                 | 未实现       | 功能未实现    |
| 502           | Bad Gateway                     | 错误网关      | 网关错误     |
| 503           | Service Unavailable             | 服务不可用     | 服务不可用    |
| 504           | Server Time-out                 | 服务器超时     | 服务器超时    |
| 505           | Version Not Supported           | 版本不支持     | SIP版本不支持 |
| 513           | Message Too Large               | 消息过大      | 消息过大     |
| **6xx 全局错误**  |                                 |           |          |
| 600           | Busy Everywhere                 | 到处忙       | 所有终端都忙   |
| 603           | Decline                         | 拒绝        | 用户拒绝     |
| 604           | Does Not Exist Anywhere         | 任何地方都不存在  | 用户不存在    |
| 606           | Not Acceptable                  | 不可接受      | 媒体参数不可接受 |

## 🌐 SIP URI格式

SIP使用URI来标识用户和资源：

```
sip:user@domain:port;parameters?headers
```

### 示例

- `sip:alice@example.com`
- `sip:alice@example.com:5060`
- `sip:alice@example.com;transport=udp`
- `sip:+1234567890@example.com;user=phone`

## SIP连接完整通信过程

#### 场景：Alice呼叫Bob

假设Alice (192.168.1.100) 要呼叫Bob (192.168.1.200)，通过代理服务器 (192.168.1.1) 进行通话。

#### 步骤1：Alice发送INVITE请求

**Alice → Proxy (192.168.1.1:5060)**

```
INVITE sip:bob@192.168.1.200:5060 SIP/2.0
Via: SIP/2.0/UDP 192.168.1.100:5060;branch=z9hG4bK776asdhds
Max-Forwards: 70
From: Alice <sip:alice@192.168.1.100>;tag=1928301774
To: Bob <sip:bob@192.168.1.200>
Call-ID: a84b4c76e66710@192.168.1.100
CSeq: 314159 INVITE
Contact: <sip:alice@192.168.1.100:5060>
Content-Type: application/sdp
Content-Length: 142

v=0
o=alice 2890844526 2890844527 IN IP4 192.168.1.100
s=Session SDP
c=IN IP4 192.168.1.100
t=0 0
m=audio 49170 RTP/AVP 0
a=rtpmap:0 PCMU/8000
a=sendrecv
```

**关键信息解析：**

- **Via**: 显示请求路径，用于响应路由
- **From/To**: 通话双方标识
- **Call-ID**: 全局唯一标识符
- **CSeq**: 命令序列号，用于匹配请求和响应
- **SDP内容**: 告诉Bob在192.168.1.100:49170接收RTP音频流，使用PCMU编解码器

#### 步骤2：Proxy转发INVITE并发送100 Trying

**Proxy → Alice (192.168.1.100:5060)**

```
SIP/2.0 100 Trying
Via: SIP/2.0/UDP 192.168.1.100:5060;branch=z9hG4bK776asdhds
From: Alice <sip:alice@192.168.1.100>;tag=1928301774
To: Bob <sip:bob@192.168.1.200>
Call-ID: a84b4c76e66710@192.168.1.100
CSeq: 314159 INVITE
Content-Length: 0
```

**Proxy → Bob (192.168.1.200:5060)**

```
INVITE sip:bob@192.168.1.200:5060 SIP/2.0
Via: SIP/2.0/UDP 192.168.1.1:5060;branch=z9hG4bK998877
Via: SIP/2.0/UDP 192.168.1.100:5060;branch=z9hG4bK776asdhds
Max-Forwards: 69
From: Alice <sip:alice@192.168.1.100>;tag=1928301774
To: Bob <sip:bob@192.168.1.200>
Call-ID: a84b4c76e66710@192.168.1.100
CSeq: 314159 INVITE
Contact: <sip:alice@192.168.1.100:5060>
Content-Type: application/sdp
Content-Length: 142

v=0
o=alice 2890844526 2890844527 IN IP4 192.168.1.100
s=Session SDP
c=IN IP4 192.168.1.100
t=0 0
m=audio 49170 RTP/AVP 0
a=rtpmap:0 PCMU/8000
a=sendrecv
```

#### **步骤3：Bob发送180 Ringing**

**Bob → Proxy (192.168.1.1:5060)**

```
SIP/2.0 180 Ringing
Via: SIP/2.0/UDP 192.168.1.1:5060;branch=z9hG4bK998877
Via: SIP/2.0/UDP 192.168.1.100:5060;branch=z9hG4bK776asdhds
From: Alice <sip:alice@192.168.1.100>;tag=1928301774
To: Bob <sip:bob@192.168.1.200>;tag=456789
Call-ID: a84b4c76e66710@192.168.1.100
CSeq: 314159 INVITE
Contact: <sip:bob@192.168.1.200:5060>
Content-Length: 0
```

**Proxy → Alice (192.168.1.100:5060)**

```
SIP/2.0 180 Ringing
Via: SIP/2.0/UDP 192.168.1.100:5060;branch=z9hG4bK776asdhds
From: Alice <sip:alice@192.168.1.100>;tag=1928301774
To: Bob <sip:bob@192.168.1.200>;tag=456789
Call-ID: a84b4c76e66710@192.168.1.100
CSeq: 314159 INVITE
Contact: <sip:bob@192.168.1.200:5060>
Content-Length: 0
```

#### **步骤4：Bob接听，发送200 OK**

**Bob → Proxy (192.168.1.1:5060)**

```
SIP/2.0 200 OK
Via: SIP/2.0/UDP 192.168.1.1:5060;branch=z9hG4bK998877
Via: SIP/2.0/UDP 192.168.1.100:5060;branch=z9hG4bK776asdhds
From: Alice <sip:alice@192.168.1.100>;tag=1928301774
To: Bob <sip:bob@192.168.1.200>;tag=456789
Call-ID: a84b4c76e66710@192.168.1.100
CSeq: 314159 INVITE
Contact: <sip:bob@192.168.1.200:5060>
Content-Type: application/sdp
Content-Length: 131

v=0
o=bob 2890844527 2890844528 IN IP4 192.168.1.200
s=Session SDP
c=IN IP4 192.168.1.200
t=0 0
m=audio 49172 RTP/AVP 0
a=rtpmap:0 PCMU/8000
a=sendrecv
```

**关键信息解析：**

- **To标签****: 现在有了tag=456789，表示对话已建立**
- **SDP内容****: Bob告诉Alice在192.168.1.200:49172接收RTP音频流**
- **编解码器****: 双方都支持PCMU/8000，协商成功**

**Proxy → Alice (192.168.1.100:5060)**

```
SIP/2.0 200 OK
Via: SIP/2.0/UDP 192.168.1.100:5060;branch=z9hG4bK776asdhds
From: Alice <sip:alice@192.168.1.100>;tag=1928301774
To: Bob <sip:bob@192.168.1.200>;tag=456789
Call-ID: a84b4c76e66710@192.168.1.100
CSeq: 314159 INVITE
Contact: <sip:bob@192.168.1.200:5060>
Content-Type: application/sdp
Content-Length: 131

v=0
o=bob 2890844527 2890844528 IN IP4 192.168.1.200
s=Session SDP
c=IN IP4 192.168.1.200
t=0 0
m=audio 49172 RTP/AVP 0
a=rtpmap:0 PCMU/8000
a=sendrecv
```

#### **步骤5：Alice发送ACK确认**

**Alice → Proxy (192.168.1.1:5060)**

```
ACK sip:bob@192.168.1.200:5060 SIP/2.0
Via: SIP/2.0/UDP 192.168.1.100:5060;branch=z9hG4bK776asdhds
From: Alice <sip:alice@192.168.1.100>;tag=1928301774
To: Bob <sip:bob@192.168.1.200>;tag=456789
Call-ID: a84b4c76e66710@192.168.1.100
CSeq: 314159 ACK
Contact: <sip:alice@192.168.1.100:5060>
Content-Length: 0
```

**Proxy → Bob (192.168.1.200:5060)**

```
ACK sip:bob@192.168.1.200:5060 SIP/2.0
Via: SIP/2.0/UDP 192.168.1.1:5060;branch=z9hG4bK998877
Via: SIP/2.0/UDP 192.168.1.100:5060;branch=z9hG4bK776asdhds
From: Alice <sip:alice@192.168.1.100>;tag=1928301774
To: Bob <sip:bob@192.168.1.200>;tag=456789
Call-ID: a84b4c76e66710@192.168.1.100
CSeq: 314159 ACK
Contact: <sip:alice@192.168.1.100:5060>
Content-Length: 0
```

#### **步骤6：RTP媒体流传输**

**现在Alice和Bob开始直接传输RTP音频流：**

**Alice → Bob (192.168.1.200:49172) - RTP包**

```
RTP Header:
  Version: 2
  Padding: 0
  Extension: 0
  CSRC Count: 0
  Marker: 0
  Payload Type: 0 (PCMU)
  Sequence Number: 1
  Timestamp: 160
  SSRC: 12345

RTP Payload: [PCMU编码的音频数据]
```

**Bob → Alice (192.168.1.100:49170) - RTP包**

```
RTP Header:
  Version: 2
  Padding: 0
  Extension: 0
  CSRC Count: 0
  Marker: 0
  Payload Type: 0 (PCMU)
  Sequence Number: 1
  Timestamp: 160
  SSRC: 67890

RTP Payload: [PCMU编码的音频数据]
```

#### **步骤7：通话结束 - BYE**

**Alice → Proxy (192.168.1.1:5060)**

```
BYE sip:bob@192.168.1.200:5060 SIP/2.0
Via: SIP/2.0/UDP 192.168.1.100:5060;branch=z9hG4bK776asdhds
From: Alice <sip:alice@192.168.1.100>;tag=1928301774
To: Bob <sip:bob@192.168.1.200>;tag=456789
Call-ID: a84b4c76e66710@192.168.1.100
CSeq: 314160 BYE
Contact: <sip:alice@192.168.1.100:5060>
Content-Length: 0
```

**Proxy → Bob (192.168.1.200:5060)**

```
BYE sip:bob@192.168.1.200:5060 SIP/2.0
Via: SIP/2.0/UDP 192.168.1.1:5060;branch=z9hG4bK998877
Via: SIP/2.0/UDP 192.168.1.100:5060;branch=z9hG4bK776asdhds
From: Alice <sip:alice@192.168.1.100>;tag=1928301774
To: Bob <sip:bob@192.168.1.200>;tag=456789
Call-ID: a84b4c76e66710@192.168.1.100
CSeq: 314160 BYE
Contact: <sip:alice@192.168.1.100:5060>
Content-Length: 0
```

**Bob → Proxy (192.168.1.1:5060)**

```
SIP/2.0 200 OK
Via: SIP/2.0/UDP 192.168.1.1:5060;branch=z9hG4bK998877
Via: SIP/2.0/UDP 192.168.1.100:5060;branch=z9hG4bK776asdhds
From: Alice <sip:alice@192.168.1.100>;tag=1928301774
To: Bob <sip:bob@192.168.1.200>;tag=456789
Call-ID: a84b4c76e66710@192.168.1.100
CSeq: 314160 BYE
Content-Length: 0
```

**Proxy → Alice (192.168.1.100:5060)**

```
SIP/2.0 200 OK
Via: SIP/2.0/UDP 192.168.1.100:5060;branch=z9hG4bK776asdhds
From: Alice <sip:alice@192.168.1.100>;tag=1928301774
To: Bob <sip:bob@192.168.1.200>;tag=456789
Call-ID: a84b4c76e66710@192.168.1.100
CSeq: 314160 BYE
Content-Length: 0
```

### **关键要点总结**

1. **SIP信令****：通过代理服务器传输，用于建立、修改、终止通话**
2. **SDP协商****：在INVITE和200 OK中交换，确定媒体参数**
3. **RTP媒体****：直接点对点传输，不经过代理服务器**
4. **端口分离****：SIP信令使用5060端口，RTP媒体使用其他端口**
5. **编解码器协商：双方必须支持相同的编解码器才能通话**

## **SIP与媒体传输**

### **SDP协议详解**

**SDP（Session Description Protocol）是SIP中用于描述媒体会话的协议。它告诉对方：**

- **要传输什么类型的媒体（音频、视频等）**
- **使用什么编解码器**
- **在哪个IP地址和端口接收媒体**
- **媒体流的特性（采样率、声道数等）**

#### **SDP消息结构**

```
SDP消息 = 会话描述 + 媒体描述
```

**会话描述部分：**

- `**v=**` **- SDP版本**
- `**o=**` **- 会话发起者信息**
- `**s=**` **- 会话名称**
- `**c=**` **- 连接信息（IP地址）**
- `**t=**` **- 时间信息**

**媒体描述部分：**

- `**m=**` **- 媒体信息（类型、端口、协议、格式）**
- `**a=**` **- 媒体属性（编解码器、方向等）**

#### **详细SDP示例解析**

```
v=0
o=alice 2890844526 2890844527 IN IP4 alice.example.com
s=Session SDP
c=IN IP4 alice.example.com
t=0 0
m=audio 49170 RTP/AVP 0
a=rtpmap:0 PCMU/8000
a=sendrecv
```

**逐行解析：**

1. `**v=0**` **- SDP版本号，目前固定为0**
2. `**o=alice 2890844526 2890844527 IN IP4 alice.example.com**`

- `**alice**` **- 用户名**
- `**2890844526**` **- 会话ID（唯一标识）**
- `**2890844527**` **- 会话版本（每次修改递增）**
- `**IN IP4**` **- 网络类型和地址类型**
- `**alice.example.com**` **- 发起者地址**

3. `**s=Session SDP**` **- 会话名称**
4. `**c=IN IP4 alice.example.com**` **- 连接信息**

- `**IN**` **- 网络类型（Internet）**
- `**IP4**` **- 地址类型（IPv4）**
- `**alice.example.com**` **- 连接地址**

5. `**t=0 0**` **- 时间信息**

- `**0**` **- 开始时间（0表示立即开始）**
- `**0**` **- 结束时间（0表示不限制）**

6. `**m=audio 49170 RTP/AVP 0**` **- 媒体信息**

- `**audio**` **- 媒体类型（音频）**
- `**49170**` **- 端口号**
- `**RTP/AVP**` **- 传输协议（RTP over UDP）**
- `**0**` **- 载荷类型（PCMU）**

7. `**a=rtpmap:0 PCMU/8000**` **- 载荷类型映射**

- `**0**` **- 载荷类型**
- `**PCMU**` **- 编解码器名称**
- `**8000**` **- 采样率**

8. `**a=sendrecv**` **- 媒体方向（双向）**

### **SIP如何使用SDP**

**SIP使用SDP进行媒体协商，过程如下：**

1. **INVITE请求****：包含SDP Offer（提供媒体能力）**
2. **200 OK响应****：包含SDP Answer（接受媒体能力）**
3. **媒体传输****：根据协商结果传输RTP媒体流**

### **RTP协议详解**

**RTP（Real-time Transport Protocol）负责实际的媒体数据传输：**

**RTP包结构：**

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|V=2|P|X|  CC   |M|     PT      |       sequence number         |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                           timestamp                           |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|           synchronization source (SSRC) identifier            |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|            contributing source (CSRC) identifiers             |
|                             ....                              |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                            payload                            |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

**字段说明：**

- **V (2位)****：版本号，通常为2**
- **P (1位)****：填充位**
- **X (1位)****：扩展位**
- **CC (4位)****：CSRC计数**
- **M (1位)****：标记位（帧边界）**
- **PT (7位)****：载荷类型**
- **序列号 (16位)****：包序列号，用于检测丢包**
- **时间戳 (32位)****：采样时间，用于同步**
- **SSRC (32位)****：同步源标识符**
- **载荷：实际的音频数据**

## **课后练习**

### **练习1：SIP消息解析实战**

#### **练习1.1：识别消息类型**

**阅读以下SIP消息，判断是请求还是响应，并识别具体类型：**

**消息A：**

```
BYE sip:alice@example.com SIP/2.0
Via: SIP/2.0/UDP bob.example.com:5060;branch=z9hG4bK998877
From: Bob <sip:bob@example.com>;tag=456789
To: Alice <sip:alice@example.com>;tag=1928301774
Call-ID: a84b4c76e66710@alice.example.com
CSeq: 2 BYE
Content-Length: 0
```

**消息B：**

```
SIP/2.0 180 Ringing
Via: SIP/2.0/UDP alice.example.com:5060;branch=z9hG4bK776asdhds
From: Alice <sip:alice@example.com>;tag=1928301774
To: Bob <sip:bob@example.com>;tag=456789
Call-ID: a84b4c76e66710@alice.example.com
CSeq: 314159 INVITE
Content-Length: 0
```

**答案：**

- **消息A：请求消息，BYE方法（结束通话）**
- **消息B：响应消息，180状态码（振铃中）**

#### **练习1.2：头部字段分析**

**分析以下INVITE消息的头部字段：**

```
INVITE sip:bob@example.com SIP/2.0
Via: SIP/2.0/UDP alice.example.com:5060;branch=z9hG4bK776asdhds
Max-Forwards: 70
From: Alice <sip:alice@example.com>;tag=1928301774
To: Bob <sip:bob@example.com>
Call-ID: a84b4c76e66710@alice.example.com
CSeq: 314159 INVITE
Contact: <sip:alice@alice.example.com>
Content-Type: application/sdp
Content-Length: 142
```

**分析要点：**

1. **Via头部中的branch参数作用是什么？**
2. **From和To头部的tag参数何时出现？**
3. **Call-ID在整个通话过程中是否保持不变？**
4. **CSeq中的数字和方法的含义？**

#### **练习1.3：SIP消息解析代码实现**

**让我们用Go语言实现一个简单的SIP消息解析器：**

```
package main

import (
    "fmt"
    "strings"
)

type SIPMessage struct {
    Type        string            // "request" or "response"
    Method      string            // 请求方法
    URI         string            // 请求URI
    Version     string            // SIP版本
    StatusCode  int               // 状态码（仅响应）
    Reason      string            // 原因短语（仅响应）
    Headers     map[string]string // 头部字段
    Body        string            // 消息体
}

func ParseSIPMessage(rawMessage string) (*SIPMessage, error) {
    lines := strings.Split(rawMessage, "\r\n")
    if len(lines) == 0 {
        return nil, fmt.Errorf("empty message")
    }
    
    msg := &SIPMessage{
        Headers: make(map[string]string),
    }
    
    // 解析起始行
    firstLine := lines[0]
    parts := strings.Split(firstLine, " ")
    if len(parts) < 3 {
        return nil, fmt.Errorf("invalid message format")
    }
    
    // 判断消息类型：如果第一个字段是"SIP/"，则是响应；否则是请求
    if parts[0] == "SIP/2.0" {
        // 这是响应消息
        msg.Type = "response"
        msg.Version = parts[0]
        fmt.Sscanf(parts[1], "%d", &msg.StatusCode)
        msg.Reason = strings.Join(parts[2:], " ")
    } else {
        // 这是请求消息
        msg.Type = "request"
        msg.Method = parts[0]
        msg.URI = parts[1]
        msg.Version = parts[2]
    }
    
    // 解析头部字段
    bodyStart := 0
    for i := 1; i < len(lines); i++ {
        line := lines[i]
        if line == "" {
            bodyStart = i + 1
            break
        }
        if idx := strings.Index(line, ":"); idx > 0 {
            key := strings.TrimSpace(line[:idx])
            value := strings.TrimSpace(line[idx+1:])
            msg.Headers[key] = value
        }
    }
    
    // 解析消息体
    if bodyStart > 0 && bodyStart < len(lines) {
        msg.Body = strings.Join(lines[bodyStart:], "\r\n")
    }
    
    return msg, nil
}

func (msg *SIPMessage) Print() {
    fmt.Printf("消息类型: %s\n", msg.Type)
    if msg.Type == "request" {
        fmt.Printf("方法: %s\n", msg.Method)
        fmt.Printf("URI: %s\n", msg.URI)
    } else {
        fmt.Printf("状态码: %d\n", msg.StatusCode)
        fmt.Printf("原因: %s\n", msg.Reason)
    }
    fmt.Printf("版本: %s\n", msg.Version)
    fmt.Println("头部字段:")
    for key, value := range msg.Headers {
        fmt.Printf("  %s: %s\n", key, value)
    }
    if msg.Body != "" {
        fmt.Printf("消息体:\n%s\n", msg.Body)
    }
}

func main() {
    // 测试INVITE请求
    inviteMsg := `INVITE sip:bob@example.com SIP/2.0
Via: SIP/2.0/UDP alice.example.com:5060;branch=z9hG4bK776asdhds
From: Alice <sip:alice@example.com>;tag=1928301774
To: Bob <sip:bob@example.com>
Call-ID: a84b4c76e66710@alice.example.com
CSeq: 314159 INVITE
Content-Type: application/sdp
Content-Length: 142

v=0
o=alice 2890844526 2890844527 IN IP4 alice.example.com
s=Session SDP
c=IN IP4 alice.example.com
t=0 0
m=audio 49170 RTP/AVP 0
a=rtpmap:0 PCMU/8000`
    
    msg, err := ParseSIPMessage(inviteMsg)
    if err != nil {
        fmt.Printf("解析错误: %v\n", err)
        return
    }
    
    msg.Print()
}
```

### **练习2：通话流程分析**

#### **练习2.1：完整通话流程**

**根据以下通话日志，分析每个步骤的作用：**

```
1. Alice -> Proxy: INVITE sip:bob@example.com SIP/2.0
2. Proxy -> Alice: SIP/2.0 100 Trying
3. Proxy -> Bob: INVITE sip:bob@example.com SIP/2.0
4. Bob -> Proxy: SIP/2.0 180 Ringing
5. Proxy -> Alice: SIP/2.0 180 Ringing
6. Bob -> Proxy: SIP/2.0 200 OK
7. Proxy -> Alice: SIP/2.0 200 OK
8. Alice -> Proxy: ACK sip:bob@example.com SIP/2.0
9. Proxy -> Bob: ACK sip:bob@example.com SIP/2.0
10. Alice <-> Bob: RTP媒体流传输
11. Alice -> Proxy: BYE sip:bob@example.com SIP/2.0
12. Proxy -> Bob: BYE sip:bob@example.com SIP/2.0
13. Bob -> Proxy: SIP/2.0 200 OK
14. Proxy -> Alice: SIP/2.0 200 OK
```

**分析问题：**

1. **为什么需要100 Trying响应？**
2. **180 Ringing响应的作用是什么？**
3. **为什么ACK消息不需要响应？**
4. **媒体流传输在哪个步骤开始？**

#### **练习2.2：错误处理流程**

**分析以下错误场景的处理：**

**场景1：用户忙线**

```
Alice -> Proxy: INVITE sip:bob@example.com SIP/2.0
Proxy -> Alice: SIP/2.0 100 Trying
Proxy -> Bob: INVITE sip:bob@example.com SIP/2.0
Bob -> Proxy: SIP/2.0 486 Busy Here
Proxy -> Alice: SIP/2.0 486 Busy Here
```

**场景2：用户不存在**

```
Alice -> Proxy: INVITE sip:unknown@example.com SIP/2.0
Proxy -> Alice: SIP/2.0 100 Trying
Proxy -> Alice: SIP/2.0 404 Not Found
```

**问题：**

1. **486和404状态码的区别是什么？**
2. **客户端收到这些错误后应该如何处理？**

### **练习3：SIP URI解析**

#### **练习3.1：URI格式识别**

**识别以下SIP URI的各个组成部分：**

```
sip:alice@example.com:5060;transport=udp;user=phone?subject=test&priority=urgent
```

**组成部分：**

- **方案：sip**
- **用户：alice**
- **主机：example.com**
- **端口：5060**
- **参数：transport=udp;user=phone**
- **查询：subject=test&priority=urgent**

#### **练习3.2：URI解析代码**

**实现SIP URI解析函数：**

```
type SIPURI struct {
    Scheme   string
    User     string
    Host     string
    Port     int
    Params   map[string]string
    Query    map[string]string
}

func ParseSIPURI(uri string) (*SIPURI, error) {
    // 实现URI解析逻辑
    // 提示：使用strings.Split和strings.Index
}
```

### **练习4：SDP解析**

#### **练习4.1：SDP字段识别**

**解析以下SDP内容，识别各个字段：**

```
v=0
o=alice 2890844526 2890844527 IN IP4 alice.example.com
s=Session SDP
c=IN IP4 alice.example.com
t=0 0
m=audio 49170 RTP/AVP 0
a=rtpmap:0 PCMU/8000
a=sendrecv
```

**字段含义：**

- **v: SDP版本**
- **o: 会话发起者信息**
- **s: 会话名称**
- **c: 连接信息**
- **t: 时间信息**
- **m: 媒体信息**
- **a: 属性信息**

### **练习5：综合实战**

#### **练习5.1：构建INVITE消息**

**根据以下信息，构建完整的INVITE消息：**

- **发起方：Alice** [**sip:alice@example.com**](sip:alice@example.com)
- **接收方：Bob** [**sip:bob@example.com**](sip:bob@example.com)
- **代理服务器：proxy.example.com:5060**
- **音频端口：49170**
- **编解码器：PCMU/8000**

#### **练习5.2：实现简单SIP客户端**

**实现一个简单的SIP客户端，能够：**

1. **发送INVITE请求**
2. **处理响应消息**
3. **发送ACK确认**
4. **发送BYE结束通话**

## ❓ **常见问题**

**Q: SIP和VoIP有什么区别？****A: SIP是协议，VoIP是技术概念。SIP是VoIP的一种实现方式。**

**Q: 为什么SIP使用UDP而不是TCP？****A: UDP延迟更低，适合实时通信。SIP有自己的可靠性机制。**

**Q: SIP可以传输视频吗？****A: 可以。SIP支持音频、视频、文本等多种媒体类型。**

**Q: 学习SIP需要什么基础？****A: 需要了解基本的网络协议概念，熟悉HTTP协议会有帮助。**

## 🔗 **延伸阅读**

- [**RFC 3261 - SIP规范**](https://tools.ietf.org/html/rfc3261)
- [**RFC 4566 - SDP规范**](https://tools.ietf.org/html/rfc4566)
- [**RFC 3550 - RTP规范**](https://tools.ietf.org/html/rfc3550)