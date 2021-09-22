<!--
 * @Description: 记录每天学习一个知识点
 * @Author: yanyuanfeng
 * @Date: 2021-09-08 15:07:58
 * @LastEditors: yanyuanfeng
 * @LastEditTime: 2021-09-22 19:08:59
-->
# 2021

## 09/07 移动端适配 -- 淘宝flexible原理

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

