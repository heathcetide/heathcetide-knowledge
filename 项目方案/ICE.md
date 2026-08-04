`<font style="color:rgb(0, 0, 0);">ICEServers []webrtc.ICEServer</font>`<font style="color:rgb(0, 0, 0);"> 这个字段用于表示 </font>**<font style="color:rgb(0, 0, 0);">ICE 服务器</font>**<font style="color:rgb(0, 0, 0);">（Interactive Connectivity Establishment）。在 WebRTC（Web Real-Time Communication）中，ICE 是一个用于 </font>**<font style="color:rgb(0, 0, 0);">网络连接建立</font>**<font style="color:rgb(0, 0, 0);"> 的机制，特别是在不同网络环境（如 NAT、防火墙等）下的点对点通信中，ICE 主要帮助 </font>**<font style="color:rgb(0, 0, 0);">穿越网络地址转换（NAT）</font>**<font style="color:rgb(0, 0, 0);"> 和 </font>**<font style="color:rgb(0, 0, 0);">防火墙</font>**<font style="color:rgb(0, 0, 0);">，确保两个设备之间能够顺利建立连接。</font>

### <font style="color:rgb(0, 0, 0);">ICE 服务器的作用：</font>
<font style="color:rgb(0, 0, 0);">ICE 协议的目的是让 WebRTC 客户端（如浏览器）能够在不同的网络环境下找到彼此并建立连接。它结合了多种方法来确保两端设备可以互相通信：</font>

1. **<font style="color:rgb(0, 0, 0);">STUN 服务器</font>**<font style="color:rgb(0, 0, 0);">（Session Traversal Utilities for NAT）：用于获取公共 IP 地址和端口，帮助穿越 NAT。</font>
2. **<font style="color:rgb(0, 0, 0);">TURN 服务器</font>**<font style="color:rgb(0, 0, 0);">（Traversal Using Relays around NAT）：当直接连接无法建立时，使用 TURN 服务器作为中继进行通信。</font>

<font style="color:rgb(0, 0, 0);"></font>

`<font style="color:rgb(0, 0, 0);">ICEServers []webrtc.ICEServer</font>`<font style="color:rgb(0, 0, 0);"> 这个字段用于表示 </font>**<font style="color:rgb(0, 0, 0);">ICE 服务器</font>**<font style="color:rgb(0, 0, 0);">（Interactive Connectivity Establishment）。在 WebRTC（Web Real-Time Communication）中，ICE 是一个用于 </font>**<font style="color:rgb(0, 0, 0);">网络连接建立</font>**<font style="color:rgb(0, 0, 0);"> 的机制，特别是在不同网络环境（如 NAT、防火墙等）下的点对点通信中，ICE 主要帮助 </font>**<font style="color:rgb(0, 0, 0);">穿越网络地址转换（NAT）</font>**<font style="color:rgb(0, 0, 0);"> 和 </font>**<font style="color:rgb(0, 0, 0);">防火墙</font>**<font style="color:rgb(0, 0, 0);">，确保两个设备之间能够顺利建立连接。</font>

```plain
// ICEServer 表示一个 ICE 服务器，通常包含 STUN 或 TURN 服务器的配置。
type ICEServer struct {
	Urls []string `json:"urls"` // 服务器的 URL（STUN 或 TURN 地址）
	Username string `json:"username"` // TURN 服务器的用户名（如果需要）
	Credential string `json:"credential"` // TURN 服务器的凭证（如果需要）
}

// 案例
// 		{
//		Urls: []string{
//			"stun:stun.l.google.com:19302", // Google 提供的公共 STUN 服务器
//		},
//	},
```

**<font style="color:rgb(0, 0, 0);">NAT</font>**<font style="color:rgb(0, 0, 0);">（</font>**<font style="color:rgb(0, 0, 0);">Network Address Translation</font>**<font style="color:rgb(0, 0, 0);">）是</font><font style="color:rgb(0, 0, 0);"> </font>**<font style="color:rgb(0, 0, 0);">网络地址转换</font>**<font style="color:rgb(0, 0, 0);"> </font><font style="color:rgb(0, 0, 0);">的缩写，它是一种允许多个设备共享一个公共 IP 地址的技术。NAT 通常用于家庭或企业网络中，通过路由器让局域网（LAN）内的设备能够使用私有 IP 地址连接到互联网。</font>

#### <font style="color:rgb(0, 0, 0);">为什么需要 NAT？</font>
+ **<font style="color:rgb(0, 0, 0);">私有地址与公共地址</font>**<font style="color:rgb(0, 0, 0);">：在传统的网络架构中，内部网络（如家庭网络）设备使用私有 IP 地址（例如</font><font style="color:rgb(0, 0, 0);"> </font>`<font style="color:rgb(0, 0, 0);">192.168.x.x</font>`<font style="color:rgb(0, 0, 0);"> </font><font style="color:rgb(0, 0, 0);">或</font><font style="color:rgb(0, 0, 0);"> </font>`<font style="color:rgb(0, 0, 0);">10.x.x.x</font>`<font style="color:rgb(0, 0, 0);">），这些地址在互联网上不能直接路由。为了让这些私有设备能够访问互联网，路由器会将它们的私有 IP 地址转换为公共 IP 地址。</font>
+ **<font style="color:rgb(0, 0, 0);">IP 地址短缺</font>**<font style="color:rgb(0, 0, 0);">：IPv4 地址已经接近耗尽，而 NAT 可以让多个设备共享一个公共 IP 地址，从而减少对公共 IP 地址的需求。</font>

### <font style="color:rgb(0, 0, 0);">NAT 的类型：</font>
<font style="color:rgb(0, 0, 0);">NAT 的实现有不同的类型，最常见的有以下几种：</font>

1. **<font style="color:rgb(0, 0, 0);">静态 NAT</font>**<font style="color:rgb(0, 0, 0);">：将一个私有 IP 地址映射到一个固定的公共 IP 地址。</font>
2. **<font style="color:rgb(0, 0, 0);">动态 NAT</font>**<font style="color:rgb(0, 0, 0);">：将私有 IP 地址映射到一个动态的公共 IP 地址池中的某个地址。</font>
3. **<font style="color:rgb(0, 0, 0);">PAT（端口地址转换）</font>**<font style="color:rgb(0, 0, 0);">：也称为</font>**<font style="color:rgb(0, 0, 0);">网络地址端口转换</font>**<font style="color:rgb(0, 0, 0);">（NAPT），是最常见的 NAT 类型，它通过将私有 IP 地址的不同端口映射到公共 IP 地址的端口来实现多个设备共享一个公共 IP 地址。</font>

### <font style="color:rgb(0, 0, 0);">什么是 STUN 和 TURN？</font>
#### **<font style="color:rgb(0, 0, 0);">STUN</font>**<font style="color:rgb(0, 0, 0);">（Session Traversal Utilities for NAT）</font>
<font style="color:rgb(0, 0, 0);">STUN 是一个简单的协议，用于帮助客户端设备发现其公共 IP 地址和端口，以便能够通过 NAT 或防火墙与对等设备建立连接。在 WebRTC 和其他实时通信应用中，STUN 服务器用于帮助客户端设备穿越 NAT，并获得公共 IP 地址和端口。</font>

+ **<font style="color:rgb(0, 0, 0);">工作方式</font>**<font style="color:rgb(0, 0, 0);">：客户端发送请求到 STUN 服务器，STUN 服务器返回客户端的公共 IP 地址和端口。客户端根据这些信息尝试与其他客户端建立直接连接。</font>
+ **<font style="color:rgb(0, 0, 0);">Google 提供的公共 STUN 服务器</font>**<font style="color:rgb(0, 0, 0);">
</font><font style="color:rgb(0, 0, 0);">Google 提供了一个免费的公共 STUN 服务器</font><font style="color:rgb(0, 0, 0);"> </font>`<font style="color:rgb(0, 0, 0);">stun.l.google.com:19302</font>`<font style="color:rgb(0, 0, 0);">，可以用于测试和 WebRTC 应用程序。但它的功能非常简单，主要用于获取公共 IP 地址和端口。</font>

#### **<font style="color:rgb(0, 0, 0);">TURN</font>**<font style="color:rgb(0, 0, 0);">（Traversal Using Relays around NAT）</font>
<font style="color:rgb(0, 0, 0);">TURN 是用于</font><font style="color:rgb(0, 0, 0);"> </font>**<font style="color:rgb(0, 0, 0);">在 NAT 或防火墙无法穿透时</font>**<font style="color:rgb(0, 0, 0);">作为中继的协议。当 STUN 无法穿透 NAT 或防火墙时，TURN 服务器充当一个中继服务器，客户端通过 TURN 服务器转发其音视频流数据，确保即使在最严格的 NAT 或防火墙环境下，通信仍然能够成功。</font>

+ **<font style="color:rgb(0, 0, 0);">何时触发 TURN</font>**<font style="color:rgb(0, 0, 0);">：当 STUN 服务器不能成功穿越 NAT（比如客户端处于严格的 NAT 后，或者存在防火墙限制时），WebRTC 会自动切换到 TURN 服务器进行中继。由于 TURN 服务器会处理数据流，性能和带宽消耗会比 STUN 高，因为 TURN 需要转发所有流量。</font>
+ **<font style="color:rgb(0, 0, 0);">TURN 的作用</font>**<font style="color:rgb(0, 0, 0);">：TURN 主要用于当 STUN 无法穿越 NAT 时，作为最终的回退方案。它确保了 WebRTC 在任何网络环境下都能够成功建立连接。</font>

### <font style="color:rgb(0, 0, 0);">STUN 服务器失效的情况？</font>
<font style="color:rgb(0, 0, 0);">虽然 STUN 协议在大多数情况下非常有效，但也有一些情况可能导致 STUN 服务器无法正常工作：</font>

1. **<font style="color:rgb(0, 0, 0);">严格的防火墙</font>**<font style="color:rgb(0, 0, 0);">：某些网络可能配置了非常严格的防火墙，阻止了 STUN 请求。比如企业内网、政府机构或某些 ISP（互联网服务提供商）的网络环境中，可能会阻止 UDP 数据包或 STUN 请求。</font>
2. **<font style="color:rgb(0, 0, 0);">双重 NAT</font>**<font style="color:rgb(0, 0, 0);">：在一些复杂的 NAT 网络结构中，可能会出现双重 NAT（两个 NAT 设备），这种情况下，STUN 可能无法正确获取公共 IP 地址，或者获取到的公共地址无法通过网络路由回到客户端。</font>
3. **<font style="color:rgb(0, 0, 0);">STUN 服务器故障或不可用</font>**<font style="color:rgb(0, 0, 0);">：如果你依赖公共的 STUN 服务器（如 Google 提供的</font><font style="color:rgb(0, 0, 0);"> </font>`<font style="color:rgb(0, 0, 0);">stun.l.google.com:19302</font>`<font style="color:rgb(0, 0, 0);">），而这个服务器出现故障或不可用，那么你就无法获取到公共 IP 地址。此时需要切换到其他 STUN 或 TURN 服务器。</font>

### <font style="color:rgb(0, 0, 0);">除了 Google，还有哪些 STUN 服务器？</font>
<font style="color:rgb(0, 0, 0);">除了 Google 提供的 STUN 服务器外，还有很多其他公司和组织提供免费的 STUN 服务器。这里列出一些常见的 STUN 服务器地址：</font>

1. **<font style="color:rgb(0, 0, 0);">Google</font>**<font style="color:rgb(0, 0, 0);">：</font>
 - `<font style="color:rgb(0, 0, 0);">stun.l.google.com:19302</font>`<font style="color:rgb(0, 0, 0);">（常用）</font>
 - `<font style="color:rgb(0, 0, 0);">stun1.l.google.com:19302</font>`
 - `<font style="color:rgb(0, 0, 0);">stun2.l.google.com:19302</font>`
2. **<font style="color:rgb(0, 0, 0);">Mozilla</font>**<font style="color:rgb(0, 0, 0);">：</font>
 - `<font style="color:rgb(0, 0, 0);">stun.services.mozilla.com</font>`
3. **<font style="color:rgb(0, 0, 0);">Microsoft</font>**<font style="color:rgb(0, 0, 0);">：</font>
 - `<font style="color:rgb(0, 0, 0);">stun.voip.microsoft.com</font>`
4. **<font style="color:rgb(0, 0, 0);">FreeSTUN</font>**<font style="color:rgb(0, 0, 0);">：</font>
 - `<font style="color:rgb(0, 0, 0);">stun.freeworld.in:3478</font>`
5. **<font style="color:rgb(0, 0, 0);">Twilio</font>**<font style="color:rgb(0, 0, 0);">：</font>
 - `<font style="color:rgb(0, 0, 0);">global.stun.twilio.com:3478</font>`
6. **<font style="color:rgb(0, 0, 0);">NIST</font>**<font style="color:rgb(0, 0, 0);">：</font>
 - `<font style="color:rgb(0, 0, 0);">stun.nist.gov:3478</font>`

<font style="color:rgb(0, 0, 0);">这些 STUN 服务器都可以被 WebRTC 或其他实时通信应用用于获取公共 IP 地址和端口。你可以选择多个 STUN 服务器，以便在某个服务器不可用时，能够切换到其他服务器。</font>

### <font style="color:rgb(0, 0, 0);">总结：</font>
+ **<font style="color:rgb(0, 0, 0);">NAT</font>**<font style="color:rgb(0, 0, 0);"> </font><font style="color:rgb(0, 0, 0);">是网络地址转换，它让多个设备共享一个公共 IP 地址，广泛应用于家庭和企业网络中。</font>
+ **<font style="color:rgb(0, 0, 0);">STUN</font>**<font style="color:rgb(0, 0, 0);"> </font><font style="color:rgb(0, 0, 0);">用于帮助客户端设备获取公共 IP 地址和端口，适用于简单的网络环境。Google 提供了一个免费的 STUN 服务器（</font>`<font style="color:rgb(0, 0, 0);">stun.l.google.com:19302</font>`<font style="color:rgb(0, 0, 0);">）。</font>
+ **<font style="color:rgb(0, 0, 0);">TURN</font>**<font style="color:rgb(0, 0, 0);"> </font><font style="color:rgb(0, 0, 0);">是当 STUN 无法穿越 NAT 时作为中继的协议，确保在更严格的网络环境下仍然能够建立连接。</font>
+ **<font style="color:rgb(0, 0, 0);">STUN 失效</font>**<font style="color:rgb(0, 0, 0);"> </font><font style="color:rgb(0, 0, 0);">的情况通常出现在严格的防火墙、双重 NAT 或 STUN 服务器故障时。</font>
+ <font style="color:rgb(0, 0, 0);">除了 Google 之外，许多其他公司和服务提供免费的 STUN 服务器，常见的还有 Mozilla、Microsoft、Twilio 和 FreeSTUN 等。</font>

