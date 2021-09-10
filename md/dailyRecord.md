<!--
 * @Description: 记录每天学习一个知识点
 * @Author: yanyuanfeng
 * @Date: 2021-09-08 15:07:58
 * @LastEditors: yanyuanfeng
 * @LastEditTime: 2021-09-08 17:45:14
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


