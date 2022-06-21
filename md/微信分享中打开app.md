<!--
 * @Description: 
 * @Author: yanyuanfeng
 * @Date: 2022-06-21 18:31:03
 * @LastEditors: yanyuanfeng
 * @LastEditTime: 2022-06-21 19:01:32
-->
# 微信分享中打开app

##  一、 [官方文档介绍](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_Open_Tag.html#%E8%B7%B3%E8%BD%ACAPP%EF%BC%9Awx-open-launch-app)

### 1、微信公众平台和开放平台的配置需要注意的点

+ 开放平台和服务号主体应该一样不然关联应用会保存失败
+ 一个服务号只能关联一个App(具体没研究，当时配置的时候没有添加选项)


### 2、 前端h5配置需要注意的点

+ 需要引入微信sdk 1.6.0版本
+ 配置appid，为在开放平台关联app时所填写的appid
+ 微信注册时添加  openTagList: ['wx-open-launch-app'],

### 3、 客户端

+ 客户端需要接入wxSDK 
+ 如果需要对参数解析 接入微信的OpenSDK [官方介绍](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/APP_GET_EXTINF.html)
+ 
  

## 二、 前端代码

```html
<script src="//res.wx.qq.com/open/js/jweixin-1.6.0.js"></script>

 <div class="button">
        打开好奇地球，探索更多奇妙之旅
        <wx-open-launch-app class="wx-launch"  appid="wxec65efcb1cfd3f5c" ms-attr-extinfo="id={{poivInfo.id}}">
            <template>
                <style>
                    .wx-btn {
                        opacity: 0
                    }
                </style>
                <button class="wx-btn"></button>
            </template>
        </wx-open-launch-app>
    
    </div>
```
<!-- js -->
```javascript
// 此处只做示例
wx.config({
          beta: true,
            debug: debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            openTagList: ['wx-open-launch-app'],
           appId : appid,
           timestamp : timestamp,
           nonceStr : noncestr,
           signature : signature,
            jsApiList: [
                'getInstallState',
                'launch3rdApp',
                'checkJsApi',
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'onMenuShareQZone',
                'hideMenuItems',
                'showMenuItems',
                'hideAllNonBaseMenuItem',
                'showAllNonBaseMenuItem',
                'translateVoice',
                'startRecord',
                'stopRecord',
                'onRecordEnd',
                'playVoice',
                'pauseVoice',
                'stopVoice',
                'uploadVoice',
                'downloadVoice',
                'chooseImage',
                'previewImage',
                'uploadImage',
                'downloadImage',
                'getNetworkType',
                'openLocation',
                'getLocation',
                'hideOptionMenu',
                'showOptionMenu',
                'closeWindow',
                'scanQRCode',
                'chooseWXPay',
                'openProductSpecificView',
                'addCard',
                'chooseCard',
                'openCard'
            ]
})
// 等dom挂载完成执行
 document.querySelectorAll('.wx-launch').forEach(btn=>{
      btn.addEventListener('launch', (e)=> {
          console.log('success',e);//这里可以理解 已经是进行打开app
      });
      btn.addEventListener('error', (e)=> {
            console.log('fail', e);
            main._toNewDownload() //这里可以理解为手机中没有装对应的应用，去跳转到下载页面
      });
  })
```
<!-- 样式 -->
```scss
 .button{
        width: 616px;
        height: 100px;
        background: #5A9DF1;
        border-radius: 50px;
        position: fixed;
        bottom: 40px;
        margin: 0 auto;
        text-align: center;
        line-height: 100px;
        color: #fff;
        font-size: 34px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #FFFFFF;
        letter-spacing: 1px;
        left: 0 ;
        right: 0;
        .wx-launch{
            position:absolute;
            width:100%;
            height:100%;
            background-color: rgba(0, 0, 0, 0.1);
            left: 0;
            top: 0;
        }
    }

```

## 三、 配置示例

+ js安全域名 n.ahaschool.com
+ appid：wx1111111111
+ 移动应用：好奇地球






