# 小程序微软TTS接入

## 一、 注册微软 创建服务

[微软地址](https://azure.microsoft.com/zh-cn/free/)

创建订阅、资源包、语音服务

最后语音服务会提供秘钥 用来获取 Authorization


+ [微软官方体验](https://azure.microsoft.com/zh-cn/products/cognitive-services/text-to-speech/#overview)
+ [微软https方式官方文档](https://learn.microsoft.com/zh-cn/azure/cognitive-services/speech-service/rest-text-to-speech?tabs=streaming)
+ [微软websocket相关博客参考](https://zhuanlan.zhihu.com/p/593737214)


## 二、了解流式处理和非流式处理

微软官方文档提供说明：提供了流式处理和非流式处理的格式，简单的理解就是：
非流式处理的格式必须全部下载完成才能播放。 
流式处理格式就是可以实现边下载边播放

**值得注意的是，**目前看来微信小程序不支持流式播放。必须完全下载完成并提供一个地址才能实现播放。即使你选择的格式是流式处理的格式，也是需要完全下载完成才能进行播放。

## 三、 代码实现

### 1. http方式
  
```javascript
import { getMicroToken } from "../api/index" //获取 Authorization //这个接口由服务端进行了10分钟的缓存
import { hexMD5_16 } from "../utils/md5";
/**
 * 将num左补0为len长度的字符串
 * @param num
 * @param len
 * @returns
 */
function _lpadNum(num: string | number, len: number): string {
  num = num + "";
  var l = num.toString().length;
  while (l < len) {
    num = "0" + num;
    l++;
  }
  return num;
}
/**
 * http方式请求
 * @param text 需要转的文字
 * @returns
 */
export async function getHttpMicroTts(text: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let dateNow = Date.now();
    const fs = wx.getFileSystemManager();
    let pathTemp = `${wx.env.USER_DATA_PATH}/${dateNow}.wav`;
    const data = new Date();
    let key =
      "" +
      data.getFullYear() +
      "-" +
      _lpadNum(data.getMonth() + 1, 2) +
      "-" +
      _lpadNum(data.getDate(), 2);
    getMicroToken({
      source: "azure",
      key: hexMD5_16("和后端约定的秘钥" + key),
    }).then((res) => {
      let Authorization = `Bearer ${res}`;
      app.globalData.requestTask = wx.request({
        url: "https://eastasia.tts.speech.microsoft.com/cognitiveservices/v1",
        method: "POST",
        // 这里是重点，折腾了好久，不加的话写入文件会损坏，无法播放
        responseType: 'arraybuffer',
        header:{
          'Authorization':Authorization,
          'X-Microsoft-OutputFormat': 'riff-44100hz-16bit-mono-pcm',
          'Content-Type':'application/ssml+xml',
          'Ocp-Apim-Subscription-Key':'微软提供的秘钥',
          'User-Agent':'/'
        },
        timeout: 10000,
        data:
          "<speak xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='http://www.w3.org/2001/mstts' xmlns:emo='http://www.w3.org/2009/10/emotionml' version='1.0' xml:lang='en-US'><voice name='zh-CN-XiaoshuangNeural'><mstts:express-as style='chat' ><prosody rate='0%' pitch='-10%'>" +
          text +
          "</prosody></mstts:express-as></voice></speak>",

        success: (res) => {
          fs.writeFile({
            filePath: pathTemp,
            data: res.data,
            encoding: "binary",
            success: (res) => {
              // self._createPlayInnerAudioContent(pathTemp,text)
              resolve(pathTemp);
            },
          });
        },
        fail: (err) => {
          resolve("timeout");
        },
      });
    });
  });
}
// 使用方式
getHttpMicroTts('需要和成语音的文本内容').then(url=>{
  // url 本地语音文件地址
})

```

### 2. webscoket 方式实现的TTS


```javascript
import { getMicroToken } from "../api/index" //获取 Authorization //这个接口由服务端进行了10分钟的缓存
import { hexMD5_16 } from "../utils/md5";
const app = getApp();
interface MicroConfig {
  onError?(message: any): void,
  onClose?(message: any): void,
}
let ttsWS:WechatMiniprogram.SocketTask
let wssurl= 'wss://eastasia.tts.speech.microsoft.com/cognitiveservices/websocket/v1'

/**
 * 微软socket方式获取tts
 */
let ttsWS:WechatMiniprogram.SocketTask
let wssurl= 'wss://eastasia.tts.speech.microsoft.com/cognitiveservices/websocket/v1'
/**
 * 微软socket方式获取tts
 */
export class MicroTTSSocket {
  audio:WechatMiniprogram.InnerAudioContext
  arrryBufferCache:ArrayBuffer[];
  [param:string]: any;
  constructor(config?:MicroConfig) {
    this.config = config
    this.arrryBufferCache =[]
    this.audio = wx.createInnerAudioContext()
    this.audioText=''
    this.targetUrls=[]
  }
  
  // 连接websocket 并返回 本地url
  async getTTsAudioUrl(text:string):Promise<{url:string}> {
    this.text = text
    this.arrryBufferCache = []
    this.targetUrls=[]
    let self = this
    const data = new Date();
    let key =
      "" +
      data.getFullYear() +
      "-" +
      _lpadNum(data.getMonth() + 1, 2) +
      "-" +
      _lpadNum(data.getDate(), 2);
   
    return  getMicroToken({
      source: "azure",
      key: hexMD5_16("后端约定秘钥" + key),
    }).then((auth:string) => {
      return new Promise((resolve,reject)=>{
        let XConnectionId= uuidv4()
        let url = `${wssurl}?TrafficType=ahakid&Authorization=${encodeURIComponent('bearer '+ auth)}&X-ConnectionId=${XConnectionId}`
        console.log(url)
        ttsWS&&ttsWS.close({code:1000,success:()=>{
          console.log('ttsws close')
        }})
        ttsWS = wx.connectSocket({
          url,
          success: function (res) {
            console.log('success',res)
          },
          fail: function (err) {
            console.log(err)
          }
        })
        this.ttsWS = ttsWS
        // 连接成功
        ttsWS.onOpen((res) => {
          console.log('micro链接成功')
          const params1 =`Path: speech.config\r\nX-RequestId: ${XConnectionId}\r\nX-Timestamp: ${new Date().toISOString()}\r\nContent-Type: application/json\r\n\r\n{"context":{"system":{"name":"SpeechSDK","version":"1.19.0","build":"JavaScript","lang":"JavaScript","os":{"platform":"Browser/Linux x86_64","name":"Mozilla/5.0 (X11; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0","version":"5.0 (X11)"}}}}`;
  
          ttsWS.send({
            //向服务器发送消息
            data: params1,
            success: function (res) {
              console.log(res, '发送成功了1')
            },
            fail: function (err) {
              console.log(err, '发送失败了1')
            }
          })
          const params2 = `Path: synthesis.context\r\nX-RequestId: ${XConnectionId}\r\nX-Timestamp: ${new Date().toISOString()}\r\nContent-Type: application/json\r\n\r\n{"synthesis":{"audio":{"metadataOptions":{"sentenceBoundaryEnabled":false,"wordBoundaryEnabled":false},"outputFormat":"audio-16khz-32kbitrate-mono-mp3"}}}`;
          ttsWS.send({
            //向服务器发送消息
            data: params2,
            success: function (res) {
              console.log(res, '发送成功了2')
            },
            fail: function (err) {
              console.log(err, '发送失败了2')
            }
          })
          const SSML = `<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="en-US">
          <voice name="zh-CN-XiaoshuangNeural"><mstts:express-as style="chat" ><prosody rate="0%" pitch="-10%">${self.text}
          </prosody></mstts:express-as></voice></speak>`
  
        const params3 = `Path: ssml\r\nX-RequestId: ${XConnectionId}\r\nX-Timestamp: ${new Date().toISOString()}\r\nContent-Type: application/ssml+xml\r\n\r\n${SSML}`
          ttsWS.send({
            //向服务器发送消息
            data: params3,
            success: function (res) {
              console.log(res, '发送成功了3')
            },
            fail: function (err) {
              console.log(err, '发送失败了3')
            }
          })
  
        })
       
        // 收到消息
        ttsWS.onMessage((res) => {
          //监听 WebSocket 接受到服务器的消息事件
          try {
            
            if(typeof(res.data)=='string'&& res.data.indexOf('Path:turn.end')>-1){
              let buffers = mergeArrayBuffer(...this.arrryBufferCache)
              let dateNow = Date.now()
              let tempUrl = `${wx.env.USER_DATA_PATH}/${dateNow}.mp3`
              console.log(buffers,'buffers')
              const fs = wx.getFileSystemManager()
              fs.writeFile({
                filePath: tempUrl,
                data: buffers,//view.buffer,buffers
                success: (res) => {
                  console.log('tempUrl',tempUrl)
                  self.targetUrls.push(tempUrl)
                  Promise.resolve().then(()=>{
                      ttsWS.close({code:1000,success:()=>{
                        console.log('ttsws close')
                      }})

                  })
                  // setTimeout(()=>{
                  // })
                  resolve({ url: tempUrl})
                  
              }
            })
            }else if(typeof(res.data)=='object'){
              let temp = ab2str(res.data)
              let index  = temp.indexOf("Path:audio")+10
              this.arrryBufferCache.push((res.data as ArrayBuffer).slice(index+2))
            }else{
              // console.log(res.data)
            }
          } catch (error) {
            console.log('onMessage operateError',error)
            // self.config.onError&&self.config.onError(e)
            reject(e)
          }
        })
        // 连接失败
        ttsWS.onError = e => {
          console.log('onError',e)
          // self.config.onError&&self.config.onError(e)
          reject(e)
        }
        // 关闭连接
        ttsWS.onClose = e => {
          console.log('关闭onclose',e)
          // self.config.onClose&&self.config.onClose(e)
          reject(e)
        }
  
      })
      })
  }
  /**
   * 
   * @param text 
   * @param config{onStartPlay:开始播放的回调}
   * 
   */
   async playlongTextAudio(text:string,config:{ onStartPlay?(audio:WechatMiniprogram.InnerAudioContext): void}):Promise<void>{
    let audioInfo:WechatMiniprogram.InnerAudioContext=wx.createInnerAudioContext()
    let arr = text.split(/。|;|!|！|；/).filter((item)=>item!=='')
    // if(this.text === text&&arr.length===this.targetUrls.length){//播放缓存音频

    // }
    return  new Promise(async (resolve,reject)=>{
      this.text = text
      let audioArr:string[] =[]
      console.log(arr)
      if(arr.length==0){
        resolve()
      }
      let {url} = await this.getTTsAudioUrl(arr.shift() as string)
      // audioInfo = wx.createInnerAudioContext()
      audioInfo.src = url
      audioInfo.autoplay = true
      audioInfo.onEnded(()=>{
        if(audioArr.length>0){//有准备好的下一条语音
          audioInfo.src = audioArr.shift() as string
        }else if(arr.length>0){ //当没有下一条语音时，且还有没有和成的语音的文字时
          let count = 0
          let timer = setInterval(()=>{
            if(count>20){
              clearInterval(timer)
              reject('wait next url timeout')
            }
            count++
            if(audioArr.length>0){
              audioInfo.src = audioArr.shift() as string
              clearInterval(timer)
            }
         },300)
        }else{//所有语音结束了
          resolve()
        }
      })
      // 通知开始播放事件
      config.onStartPlay&&config.onStartPlay(audioInfo)
        
      while(arr.length>0){
        try {
          let {url}  = await this.getTTsAudioUrl(arr.shift() as string)
          audioArr.push(url)
        } catch (error) {
          reject(error)
        }
      }
    })
  }
  rePlay(){
    
  }

}

function ab2str(buf:ArrayBuffer) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}
/**
 * 将num左补0为len长度的字符串
 * @param num
 * @param len
 * @returns
 */
function _lpadNum(num: string | number, len: number): string {
  num = num + "";
  var l = num.toString().length;
  while (l < len) {
    num = "0" + num;
    l++;
  }
  return num;
}
/**
 * 
 * @returns 随机的uuid v4值
 */
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
}
//arrays成员类型可以是 ArrayBuffer 或 TypeArray
function mergeArrayBuffer(...arrays) {
  let totalLen = 0
  for (let i = 0; i < arrays.length; i++) {
      arrays[i] = new Uint8Array(arrays[i]) //全部转成Uint8Array
      totalLen += arrays[i].length
  }

  let res = new Uint8Array(totalLen)

  let offset = 0
  for(let arr of arrays) {
      res.set(arr, offset)
      offset += arr.length
  }

  return res.buffer
}


// 实例调用

import {MicroTTSSocket} from '../../utils/micortts'

let tts: MicroTTSSocket = new MicroTTSSocket()


// 调用播放
tts.playlongTextAudio(text,(audio)=>{
      // audio 为音频实例
      // 这里是开始播放时的回调
    }).then(()=>{
      // 这里是完成音频播放完成的回调
    }).catch(err=>{
      // 这里执行报错处理// socket，语音等信息的报错 
    })
    
```

## 四、 总结

在微信小程序接入过程中的坑和总结

1. 问题1： 小程序不支持流式播放（边下载边播）。需要下载完进行播放。对于文本比较长的需要的时间比较久（上述代码只是进行简单的对长文本进行分割请求。但和流式播放还是有差距）
2. 问题2： 小程序本地下载最多支持10M，需要及时进行清理 （FileSystemManager.readdir =>（FileSystemManager.unlink ）
3. 问题3： 免费版的微软tts 并发只有一路，如上生产至少升级 到基础版 100路并发


微软官方没找到websocket 的文档，我参考的是网上爬取官方调参示例的参数的方式进行试验的。

参考文档 

+ [微软websocket相关博客参考](https://zhuanlan.zhihu.com/p/593737214)
+ [微软websocket相关博客参考](https://blog.csdn.net/ezshine/article/details/125016822)
