# websocket基础

## 一、websocket 简介

  WebSocket 协议在2008年诞生，2011年成为国际标准。所有浏览器都已经支持了

  它的最大特点就是，服务器可以主动向客户端推送信息，客户端也可以主动向服务器发送信息，是真正的双向平等对话

## 二、 特点

+ （1）建立在 TCP 协议之上，服务器端的实现比较容易。

+ （2）与 HTTP 协议有着良好的兼容性。默认端口也是80和443，并且握手阶段采用 HTTP 协议，因此握手时不容易屏蔽，能通过各种 HTTP 代理服务器。

+ （3）数据格式比较轻量，性能开销小，通信高效。

+ （4）可以发送文本，也可以发送二进制数据。

+ （5）没有同源限制，客户端可以与任意服务器通信。

+ （6）协议标识符是ws（如果加密，则为wss），服务器网址就是 URL。


## 三 、 示例

```javascript
var ws = new WebSocket("wss://echo.websocket.org");

ws.onopen = function(evt) { 
  console.log("Connection open ..."); 
  ws.send("Hello WebSockets!");
};

ws.onmessage = function(evt) {
  console.log( "Received Message: " + evt.data);
  ws.close();
};

ws.onclose = function(evt) {
  console.log("Connection closed.");
};      
```

## 四 、 websocket 重连

```javascript 
import EventPubSub from '@/tools/EventPubSub.js'
let pubSub =  EventPubSub.getInstance();
let webSocket, url = 'wss://ytbapi.ahaschool.com.cn/ws'
export default class Socket {
     /**
     * 单例
     */
      static instance = null;
      static getInstance() {
          if (!this.instance) {
              this.instance = new Socket()
          };
          return this.instance;
      };
    constructor() {
        this.poivsBuffer = []
        this.isShoutFlag = false //是否正在截图
      }
    startConnect(){
        webSocket = new WebSocket(url);
        this.initEventHandle()
       
    }
    /**
     * 初始化事件
     */
    initEventHandle() {
        let heartCheck = {
            timeout: 60000,//60ms
            timeoutObj: null,
            serverTimeoutObj: null,
            reset: function(){
                clearTimeout(this.timeoutObj);
                clearTimeout(this.serverTimeoutObj);
        　　　　 this.start();
            },
            start: function(){
                var self = this;
                this.timeoutObj = setTimeout(function(){
                    webSocket.send("hello");
                    self.serverTimeoutObj = setTimeout(function(){
                        webSocket.close();//如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
                    }, self.timeout)
                }, this.timeout)
            },
        }
        webSocket.onerror = function(event) {
            console.log("Connection onerror ..."); 
            this.reconnect()
        }.bind(this)
        webSocket.onclose = function(event) {
            console.log('onclose')
            this.reconnect()
        }.bind(this)
        webSocket.onopen = function(event) {
            console.log('onopen,websocket连接成功')
            // pubSub.emit('WEBSOCKET_CONNECT_SUCC')
            heartCheck.start();
        }
        webSocket.onmessage = function(event) {
            console.log("Connection onmessage ...",event); 
            if(event.data=='hello'){//心跳数据
                heartCheck.reset();
                console.log('连接心跳')
                return 
            }
            console.log('data',JSON.parse(event.data))
            try{
                this.poivsBuffer.push(JSON.parse(event.data))
            }catch(err){
                console.warn('Websocket收到的JSON数据解析错误',err)
            }
            if(!this.isShoutFlag){
                pubSub.emit('WEBSOCKET_SHOT')
            }
        }.bind(this)
    }
    // 重连
     reconnect(url) {
        setTimeout(()=>{     //没连接上会一直重连，设置延迟避免请求过多
            this.startConnect(url);
        }, 2000);
    }
    /**
     * 获取缓存区的待处理的数组数组
     */
    getPoivsBuffer(){
        if(this.poivsBuffer.length>0){
            this.isShoutFlag = true
        }else{
            this.isShoutFlag = false
        }
        let arr = this.poivsBuffer
        this.poivsBuffer = []
        return arr
    }
    checkHasBuffer(){
        if(!this.isShoutFlag&&this.poivsBuffer.length>0){
            pubSub.emit('WEBSOCKET_SHOT')
        }
    }
}

```


## 参考文档

+ [阮一峰 WebSocket 教程](https://www.ruanyifeng.com/blog/2017/05/websocket.html)

+ [websocket 心跳重连](https://www.cnblogs.com/1wen/p/5808276.html)
