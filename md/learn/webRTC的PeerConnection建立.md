# webRTC的PeerConnection建立

WebRTC Peerconnection通信过程中的四种角色：

+ Signaling Server (信令服务)
+ ICE/TURN/STUN Server
+ Remote Peer
+ Local Peer

<b>创建过程</b>

1. 首先ClientA和ClientB均通过双向通信方式如WebSocket连接到Signaling Server上；
2. ClientA在本地首先通GetMedia访问本地的media接口和数据，并创建PeerConnection对象，调用其AddStream方法把本地的Media添加到PeerConnection对象中。对于ClientA而言，既可以在与Signaling Server建立连接之前就创建并初始化PeerConnection如阶段1，也可以在建立Signaling Server连接之后创建并初始化PeerConnection如阶段2；ClientB既可以在上图的1阶段也可以在2阶段做同样的事情，访问自己的本地接口并创建自己的PeerConnection对象。
3. 通信由ClientA发起，所以ClientA调用PeerConnection的CreateOffer接口创建自己的SDP offer，然后把这个SDP Offer信息通过Signaling Server通道中转发给ClientB；
4. ClientB收到Signaling Server中转过来的ClientA的SDP信息也就是offer后，调用CreateAnswer创建自己的SDP信息也就是answer，然后把这个answer同样通过Signaling server转发给ClientA；
5. ClientA收到转发的answer消息以后，两个peers就做好了建立连接并获取对方media streaming的准备；
6. ClientA通过自己PeerConnection创建时传递的参数等待来自于ICE server的通信，获取自己的candidate，当candidate available的时候会自动回掉PeerConnection的OnIceCandidate；
7. ClientA通过Signling Server发送自己的Candidate给ClientB，ClientB依据同样的逻辑把自己的Candidate通过Signaling Server中转发给ClientA；
8. 至此ClientA和ClientB均已经接收到对方的Candidate，通过PeerConnection建立连接。至此P2P通道建立。

<b>什么是信令服务：</b>

1. 信令：信令就是协调通讯的过程,为了建立一个webrtc的通讯过程，,如协调一个客户端找到另一个客户端以及通知另一个客户端开始通讯
2. 需要处理NAT或防火墙,这是公网上通讯首要处理的问题.

<b>WebRTC和WebSocket的区别</b>

- WebRTC ：两个浏览器之间的全双工通信。
- WebSocket： 浏览器和Web服务器之间进行全双工通信.
## 参考文档

+ [webRTC API之RTCPeerConnection](https://segmentfault.com/a/1190000020273528?utm_source=tag-newest)
+ [WebRTC系列（3）：PeerConnection通信建立流程](https://www.jianshu.com/p/43957ee18f1a)
+ [WebRTC介绍及简单应用 ](https://www.cnblogs.com/vipzhou/p/7994927.html)