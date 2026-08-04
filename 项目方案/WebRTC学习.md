### WebRTC简介
WebRTC，名称源自<font style="color:#DF2A3F;">网页实时通信（Web Real-Time Communication）</font>的缩写，是一个支持网页浏览器进行实时语音通话或视频聊天的技术，是谷歌 2010 年以 6820 万美元收购 Global IP Solutions 公司而获得的一项技术。


WebRTC 提供了<font style="color:#DF2A3F;">实时音视频</font>的核心技术，包括音<font style="color:#DF2A3F;">视频的采集、编解码、网络传输、显示</font>等功能，并且还支持跨平台：windows，linux，mac，android。


虽然 WebRTC 的目标是实现跨平台的 Web 端实时音视频通讯，但因为核心层代码的 Native、高品质和内聚性，开发者很容易进行除 Web 平台外的移殖和应用。很长一段时间内 WebRTC 是业界能免费得到的唯一高品质实时音视频通讯技术。

### <font style="color:rgb(79, 79, 79);">1、WebRTC 是什么</font>
<font style="color:rgb(77, 77, 77);">浏览器为音视频获取传输提供的接口</font>

### <font style="color:rgb(79, 79, 79);">2、WebRTC 可以做什么</font>
<font style="color:rgb(77, 77, 77);">浏览器端到端的进行音视频聊天、直播、内容传输</font>

### <font style="color:rgb(79, 79, 79);">3、数据传输需要些什么</font>
+ <font style="color:rgba(0, 0, 0, 0.75);">IP、端口、协议</font>
+ <font style="color:rgba(0, 0, 0, 0.75);">客户端、 服务端</font>

### <font style="color:rgb(79, 79, 79);">4、SDP 协议</font>
sdp 协议：SDP 信息相当于 PC 的名片，主要是协商两个端点在传输数据的时候一些配置

数据格式：key=value


SDP 协商利用的是请求和响应这两个模型（offer、answer），Offerer 发给 Answerer 的请求消息称为请求 offer， 内容包括媒体流类型、各个媒体流使用的编码集，以及将要用于接收媒体流的 IP 和端口。Answerer 收到 offer 之后，回复给 Offerer 的消息称为响应，内容包括要使用的媒体编码，是否接收该媒体流以及告诉 Offerer 其用于接收媒体流的 IP 和端口。


在 WebRTC 连接流程中，在创建 PeerConnectionA 后，就会去创建一个 offerSDP，并设置为 localSDP。通过 signaling 发送 PeerB。peerB 收到 peerA 的 SDP 后，把收到的 SDP 设置为 RemoteSDP。在设置完成后，PeerB 再生成 AnswerSDP，设置为 localSDP，通过 signaling 通道发送给 PeerA，PeerA 收到后 AnswerSDP 后，设置为 RemoteSDP，以上流程完成了 SDP 的交换。


### <font style="color:rgb(79, 79, 79);">5、STUN</font>
<font style="color:rgb(77, 77, 77);">允许应用程序发现自己和公网之间的中间件类型，同时也能允许应用程序发现自己被 NAT 分配的公网 IP，从而替代位于应用层中的私网地址，达到 </font>`<font style="color:rgb(199, 37, 78);background-color:rgb(249, 242, 244);">NAT 穿透</font>`<font style="color:rgb(77, 77, 77);">的目的</font>

<font style="color:rgb(77, 77, 77);"></font>

### <font style="color:rgb(79, 79, 79);">6、TURN</font>
<font style="color:rgb(77, 77, 77);">通过修改应用层中的私网地址达到 NAT 穿透
</font><font style="color:rgb(77, 77, 77);">也是解决内网穿透的，这里是 stun 不能工作的时候采取的办法
</font><font style="color:rgb(77, 77, 77);">相当于一个中转器即 peerA->TURN-PeerB</font>

<font style="color:rgb(77, 77, 77);"></font>

### <font style="color:rgb(79, 79, 79);">7、ICE</font>
<font style="color:rgb(77, 77, 77);">交互式连接的建立
</font><font style="color:rgb(77, 77, 77);">把 STUN 和 TURN 结合在一起的一个标准叫 ICE（不是协议， 是整合了 STUN，TURN 的框架）。利用 STUN 和 TURN 为连接提供正确的路由，然后寻找一系列双方可用地址按顺序测试地址，直到找到双方都可用的组合。</font>

<font style="color:rgb(77, 77, 77);"></font>

