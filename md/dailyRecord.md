<!--
 * @Description: 记录每天学习一个知识点
 * @Author: yanyuanfeng
 * @Date: 2021-09-08 15:07:58
 * @LastEditors: yanyuanfeng
 * @LastEditTime: 2021-09-28 17:28:49
-->
# 2021

## 09/07 移动端适配 -- 淘宝flexible原理 [源码链接](https://github.com/amfe/lib-flexible/tree/master)

```javascript
;(function(win, lib) {
    var doc = win.document;
    var docEl = doc.documentElement;
    var metaEl = doc.querySelector('meta[name="viewport"]');
    var flexibleEl = doc.querySelector('meta[name="flexible"]');
    var dpr = 0;
    var scale = 0;
    var tid;
    var flexible = lib.flexible || (lib.flexible = {});
    
    if (metaEl) {
        console.warn('将根据已有的meta标签来设置缩放比例');
        var match = metaEl.getAttribute('content').match(/initial\-scale=([\d\.]+)/);
        if (match) {
            scale = parseFloat(match[1]);
            dpr = parseInt(1 / scale);
        }
    } else if (flexibleEl) {
        var content = flexibleEl.getAttribute('content');
        if (content) {
            var initialDpr = content.match(/initial\-dpr=([\d\.]+)/);
            var maximumDpr = content.match(/maximum\-dpr=([\d\.]+)/);
            if (initialDpr) {
                dpr = parseFloat(initialDpr[1]);
                scale = parseFloat((1 / dpr).toFixed(2));    
            }
            if (maximumDpr) {
                dpr = parseFloat(maximumDpr[1]);
                scale = parseFloat((1 / dpr).toFixed(2));    
            }
        }
    }

    if (!dpr && !scale) {
        var isAndroid = win.navigator.appVersion.match(/android/gi);
        var isIPhone = win.navigator.appVersion.match(/iphone/gi);
        var devicePixelRatio = win.devicePixelRatio;
        if (isIPhone) {
            // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
            if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {                
                dpr = 3;
            } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)){
                dpr = 2;
            } else {
                dpr = 1;
            }
        } else {
            // 其他设备下，仍旧使用1倍的方案
            dpr = 1;
        }
        scale = 1 / dpr;
    }

    docEl.setAttribute('data-dpr', dpr);
    if (!metaEl) {
        metaEl = doc.createElement('meta');
        metaEl.setAttribute('name', 'viewport');
        metaEl.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
        if (docEl.firstElementChild) {
            docEl.firstElementChild.appendChild(metaEl);
        } else {
            var wrap = doc.createElement('div');
            wrap.appendChild(metaEl);
            doc.write(wrap.innerHTML);
        }
    }

    function refreshRem(){
        // 这里用getBoundingClientRect原因:
        // getBoundingClientRect().width获取到的其实是父级的右边距离浏览器原点(0,0)左边距离浏览器原点(0,0)的距离,即父级的宽度+2padding+2border。
        // 此时的clientWidth等于父级的宽度+2*padding,不包括边框的宽度。
        // 当不隐藏子级内容,即overflow为auto时，前者的宽度依然为这个数字,因为父级并没有改编盒模型。后者的宽度为上述得到的宽度-滚动条的宽度(17px);
        var width = docEl.getBoundingClientRect().width;
        if (width / dpr > 540) {
            //这里当屏幕宽度大于540时，宽度写死为540了，所以要想电脑端也能通过rem自适应,替换成 width = width * dpr;
            width = 540 * dpr;
        }
        var rem = width / 10;
        docEl.style.fontSize = rem + 'px';
        flexible.rem = win.rem = rem;
    }

    win.addEventListener('resize', function() {
        clearTimeout(tid);
        tid = setTimeout(refreshRem, 300);
    }, false);
    win.addEventListener('pageshow', function(e) {
        if (e.persisted) {
            clearTimeout(tid);
            tid = setTimeout(refreshRem, 300);
        }
    }, false);

    if (doc.readyState === 'complete') {
        doc.body.style.fontSize = 12 * dpr + 'px';
    } else {
        doc.addEventListener('DOMContentLoaded', function(e) {
            doc.body.style.fontSize = 12 * dpr + 'px';
        }, false);
    }
    

    refreshRem();

    flexible.dpr = win.dpr = dpr;
    flexible.refreshRem = refreshRem;
    flexible.rem2px = function(d) {
        var val = parseFloat(d) * this.rem;
        if (typeof d === 'string' && d.match(/rem$/)) {
            val += 'px';
        }
        return val;
    }
    flexible.px2rem = function(d) {
        var val = parseFloat(d) / this.rem;
        if (typeof d === 'string' && d.match(/px$/)) {
            val += 'rem';
        }
        return val;
    }

})(window, window['lib'] || (window['lib'] = {}));



//

(function flexible (window, document) {
  var docEl = document.documentElement
  var dpr = window.devicePixelRatio || 1

  // adjust body font size
  function setBodyFontSize () {
    if (document.body) {
      document.body.style.fontSize = (12 * dpr) + 'px'
    }
    else {
      document.addEventListener('DOMContentLoaded', setBodyFontSize)
    }
  }
  setBodyFontSize();

  // set 1rem = viewWidth / 10
  function setRemUnit () {
    var rem = docEl.clientWidth / 10
    docEl.style.fontSize = rem + 'px'
  }

  setRemUnit()

  // reset rem unit on page resize
  window.addEventListener('resize', setRemUnit)
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      setRemUnit()
    }
  })

  // detect 0.5px supports
  if (dpr >= 2) {
    var fakeBody = document.createElement('body')
    var testElement = document.createElement('div')
    testElement.style.border = '.5px solid transparent'
    fakeBody.appendChild(testElement)
    docEl.appendChild(fakeBody)
    if (testElement.offsetHeight === 1) {
      docEl.classList.add('hairlines')
    }
    docEl.removeChild(fakeBody)
  }
}(window, document))


```

## 09/08 

### 1、前端cookie要点

[前端须知的 Cookie 知识小结](https://www.jianshu.com/p/daad7181f3a3)



### 2、asycn await 中优雅的处理promise中的reject

方案一：

```javascript
try{
	let res = await axios.get('/api/xxx')
    /**
    * .....
    */
}catch(err){
	handelErr(err)
}
```

方案二：
假如我们先捕获 Promise 的 Error ，然后将此 Error 和正常的数据都放进另一个 Promise 的 resolve 中，再传递给 await ，这样，后一个 Promise 的 await 就有了正常数据和 Error 两个状态。
```javascript
export handlerPromise = (promise) => promise.then(data => [null, data]).catch(err => [err])

```

### 3、项目中多域名请求问题



场景一：个别请求域名与前端部署不是同一个服务

    1、在请求拦截上正则判断接口前缀=》动态修改config.baseURL
    另外服务端需要进行配置跨域允许，详情见跨域解决方案篇

场景二：个别的请求接口依赖于另一个系统的登录

    1、新增登录页面 /（已存在另一个系统登录页面且主域名一样)跳转登录，并在后续相关的接口请求中带上登录的cookie信息



## 09/15 公私钥SSH

1.ssh-keygen 是公钥私钥的非对称加密方式：

    1.1公钥：用于向外发布，任何人都能获取。
    1.2.私钥：要自己保存，切勿给别人
2.公钥私钥加解密的原理

    2.1.客户端把自己的公钥存放到要链接的远程主机上（相当于我们把自己的 id_rsa.pub 存放到 git 服务器上）
    2.2.客户端要链接远程主机的时候，远程主机会向客户的发送一条随机的字符串，客户的收到字符串之后使用自己的私钥对字符串加密然后发送到远程主机，远程主机根据自己存放的公钥对这个字符串进行解密，如果解密成功证明客户端是可信的，直接允许登录，不在要求登录

+ 参考链接：

    [阮一峰 SSH原理与运用](http://www.ruanyifeng.com/blog/2011/12/ssh_remote_login.html);

    [多个ssh配置config](https://www.cnblogs.com/newalan/p/9290150.html);

    [GitHub如何配置SSH Key](https://blog.csdn.net/u013778905/article/details/83501204);

    [ssh-keygen命令详解](https://blog.csdn.net/qq_40932679/article/details/117487540)

## 09/22 前端技术调研流程 【参考】(https://juejin.cn/post/6901845776880795662)

### 一、了解需求

    最重要的一步，首先得足够了解项目需求，明白了真正需要什么，才能准确分析出所需要的技术点。

### 二、判断是否需要调研

常见的场景：
    1、新技术，资料较少，社区不完备
    2、足够成熟，但不确定细节实现
    3、想做 xxx 功能，但不确定能不能实现

### 三、调研方向

#### 1 现存方案的罗列

#### 2 方案对比

- 以下几点对比角度

1、原理

2、活跃度

3、生产环境可用性

4、功能

5、兼容性

6、性能

7、可维护性

8、缺陷及隐患

9、其他

### 四、产出文档

这份调研文档应当包括以下四个方面：

    需求背景

    一句话结论

    现存方案对比记录

    参考文档链接


## 09/28 Vue3

