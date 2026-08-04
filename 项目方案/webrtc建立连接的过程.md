WebRTC 连接全过程：从零到视频通话的每一步

WebRTC 是个神奇的技术，让浏览器直接进行点对点（P2P）音视频通话或数据传输，不用每次都靠服务器中转。想知道 Alice 和 Bob 是怎么通过 WebRTC 建立视频通话的吗？下面是整个过程，拆分成几个简单步骤，带你搞清楚每一步都在干啥！

1. 初始化：准备好通话的“装备”

干了啥：

Alice 和 Bob 各自打开浏览器或应用，启动 WebRTC 的核心对象——RTCPeerConnection。这就像是给他们配了个“通信工具箱”，用来管理连接。

他们还会用 getUserMedia 打开摄像头和麦克风，获取音视频流（就像打开 Zoom 的摄像头）。

这些音视频流会被添加到 RTCPeerConnection 中，准备好后续传输。

为啥重要：

这一步是打基础，相当于准备好“通话设备”和“通话内容”（音视频流）。

他们还得告诉 RTCPeerConnection 一些服务器地址（比如 STUN 和 TURN 服务器），用来后面解决网络问题。

代码示例（简单版）：javascript

```
const pc = new RTCPeerConnection({
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
});
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then(stream => {
    stream.getTracks().forEach(track => pc.addTrack(track, stream));
  });
```

2. 信令：通过“中间人”约好通话规则

干了啥：

Alice 和 Bob 需要先“约好”怎么通话，比如用什么视频格式、音频编码。这通过交换 SDP（Session Description Protocol，会话描述协议） 实现。

SDP 是什么？ SDP 就像一份“通话合同”，记录了：

媒体类型（视频、音频，还是数据通道）。

编码格式（比如 H.264 视频、Opus 音频）。

传输协议（比如用 SRTP 加密传输）。

注意：SDP 不包含具体的网络地址（IP 和端口），只管“规则”，不管“路径”。

具体过程：

Alice 创建一个 Offer（SDP），说：“我想这样通话，你同意吗？”然后通过信令服务器（通常是 WebSocket 或 HTTP）发给 Bob。

Bob 收到 Offer，检查后创建 Answer（也是 SDP），说：“我同意，咱就按这规则来！”然后通过信令服务器发回给 Alice。

Alice 收到 Answer，双方确认规则一致。

信令服务器干啥？

信令服务器就像个“快递员”，只负责把 SDP（Offer 和 Answer）在 Alice 和 Bob 之间传递。它不参与实际的音视频传输，任务完成后就“下班”了。

为啥重要：

SDP 交换让双方知道用什么技术细节通话，比如“我用 H.264 视频，你得支持这个格式”。

没有这一步，双方就像不知道对方用什么语言，没法开始对话。

代码示例：javascript

```

// Alice 创建 Offer
pc.createOffer()
  .then(offer => pc.setLocalDescription(offer))
  .then(() => signalingServer.send({ type: "offer", sdp: pc.localDescription }));

// Bob 接收 Offer，创建 Answer
pc.setRemoteDescription(new RTCSessionDescription(offer))
  .then(() => pc.createAnswer())
  .then(answer => pc.setLocalDescription(answer))
  .then(() => signalingServer.send({ type: "answer", sdp: pc.localDescription }));
```

  

3. ICE 候选收集与交换：寻找“最佳路径”

干了啥：

光有通话规则（SDP）还不够，Alice 和 Bob 得知道对方的“地址”才能直接连上。这就是 ICE（Interactive Connectivity Establishment，交互式连接建立） 的任务。

ICE 候选是什么？ 候选就是可能的网络地址（IP 和端口），包括：

本地地址：设备在局域网的地址（像 192.168.x.x）。

公网地址：通过 STUN 服务器 发现的公网 IP 和端口。

中继地址：如果 P2P 连不上，用 TURN 服务器 提供的转发地址。

具体过程：

Alice 和 Bob 的 RTCPeerConnection 自动收集候选地址（边收集边触发 onicecandidate 事件）。

每次收集到一个候选，他们通过信令服务器发给对方（和 SDP 交换一样，信令服务器当“快递员”）。

双方收到对方的候选后，添加到自己的 RTCPeerConnection 中，准备测试。

为啥 SDP 不直接包含地址？

SDP 只管“规则”，地址信息是动态的，收集需要时间（比如通过 STUN 服务器查询公网地址）。

设备可能有多个地址（Wi-Fi、4G、TURN 中继），ICE 要测试哪个最好用，SDP 没法提前知道。

为啥重要：

大多数设备在 NAT（网络地址转换）或防火墙后面，ICE 帮他们找到彼此的公网地址，绕过网络限制。

这一步就像 Alice 和 Bob 在迷雾中互相喊：“我在哪儿，你在哪儿？”直到找到能碰面的地点。

代码示例：javascript

```
// Alice 发送 ICE 候选
pc.onicecandidate = event => {
  if (event.candidate) {
    signalingServer.send({ type: "candidate", candidate: event.candidate });
  }
};

// Bob 接收 ICE 候选
signalingServer.onmessage = message => {
  if (message.type === "candidate") {
    pc.addIceCandidate(new RTCIceCandidate(message.candidate));
  }
};
```

  

4. ICE 测试：试出“能走通的路”

干了啥：

ICE 框架拿到了双方的候选地址后，开始“试路”。它会测试所有可能的地址对（比如 Alice 的公网地址 vs Bob 的本地地址），看哪一对能连通。

优先级：

直接 P2P：如果 Alice 和 Bob 在同一局域网或 NAT 允许，直接用本地或公网地址。

TURN 中继：如果 P2P 失败（比如防火墙太严格），用 TURN 服务器转发数据（但这会增加延迟）。

ICE 通过发送 STUN 请求（探测包）来检查连通性，找到最优路径。

为啥重要：

网络环境千奇百怪（NAT、防火墙、运营商限制），ICE 像个“导航仪”，确保总能找到一条路。

它优先选 P2P，减少对服务器的依赖，降低延迟和成本。

5. 连接建立：P2P 通路打通！

干了啥：

一旦 ICE 找到一个可用的地址对（比如 Alice 的公网 IP 和 Bob 的公网 IP），RTCPeerConnection 状态变成 connected，P2P 连接正式建立。

此时，Alice 和 Bob 可以直接通信，不再需要信令服务器（除非用 TURN 中继）。

为啥重要：

这是通话的“开场时刻”，P2P 连接成功意味着音视频可以直接传输，延迟低、效率高。

6. 数据传输：开始聊起来！

干了啥：

音视频流通过 RTP（实时传输协议） 和 SRTP（安全实时传输协议） 在 P2P 通道上传输，加密用 DTLS 保证安全。

如果需要传文件或文本（比如聊天消息），可以用 RTCDataChannel，就像个高速的“数据管道”。

为啥重要：

这是 WebRTC 的核心价值：低延迟、高质量的 P2P 音视频或数据传输。

比如 Zoom 的视频通话、Google Meet 的屏幕共享，都靠这一步。

代码示例（数据通道）：javascript

```

const dc = pc.createDataChannel("chat");
dc.onopen = () => dc.send("嗨，Bob！");
dc.onmessage = event => console.log("收到:", event.data);
```

  

7. 连接终止：挂断电话，收拾好

干了啥：

通话结束时，Alice 和 Bob 关闭 RTCPeerConnection，停止音视频流，释放资源。

这就像挂断电话，把摄像头和麦克风关掉。

代码示例：javascript

```

pc.close();
stream.getTracks().forEach(track => track.stop());
```

总结：WebRTC 连接的“全景图”

WebRTC 的连接过程就像组织一场远程聚会：

初始化：准备好摄像头、麦克风，装好“通话工具”。

信令：通过“快递员”（信令服务器）交换 SDP，约好用什么格式通话。

ICE 候选：互相发“地址”，看看能从哪儿连上。

ICE 测试：试出哪条路最好走。

连接建立：找到路，P2P 通道通了！

数据传输：开始视频聊、传文件，畅快交流。

连接终止：聊完挂断，收拾好。

整个过程的核心是 SDP 确定规则，ICE 找到路径，两者配合让 WebRTC 在复杂的网络环境下也能实现高效的 P2P 通信。信令服务器只是个“临时助手”，真正的音视频数据靠 P2P，省服务器、降延迟！

想深入一点？

如果你对 SDP 的具体格式、ICE 候选的细节，或者怎么用 Node.js 搭信令服务器感兴趣，可以留言，我再写篇进阶篇！

或者试试自己写个 WebRTC 视频通话 Demo，网上有不少开源项目可以参考哦！

优化亮点：

口语化但严谨：用“快递员”“导航仪”等比喻让过程生动，技术细节（如 SDP 内容、ICE 作用）准确无误。

结构清晰：每个步骤有“干了啥”“为啥重要”，便于读者快速抓住重点。

代码点缀：少量代码示例增加技术感，但不让非开发者感到负担。

博客友好：语气轻松，适合直接复制到博客，吸引技术或半技术读者。

![](https://cdn.nlark.com/yuque/0/2025/png/43218187/1752214280474-deeb3548-3c44-4110-9cf3-d6c670e868aa.png)