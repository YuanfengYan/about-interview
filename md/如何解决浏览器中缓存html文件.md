<!--
 * @Description: 
 * @Author: yanyuanfeng
 * @Date: 2022-06-16 10:59:21
 * @LastEditors: yanyuanfeng
 * @LastEditTime: 2022-06-16 11:32:43
-->
# 如何解决浏览器中缓存html文件

## 一、前景介绍

在h5版本更新时，防止浏览器对资源的缓存。常规操作都是会为没每个打包的文件添加hash或contentHash作为文件名的一部分。然而对于html模板文件一般不会最hash处理。在没有做特殊处理情况下，html文件一直会被浏览器缓存。由于缓存的html文件中对资源的引用并未更新。所以导致发布更新的版本并没有及时生效。
这种场景主要存在于hybird混合应用中，因为在pc上可以手动刷新页面进行处理

## 二、 如何浏览器中的解决

- http缓存分为强缓存和协商缓存，缓存配置只能通过服务端设置，前端无法控制。


了解了http的缓存机制后就能找到解决方案了，也就是配置协商缓存或强缓存两种基本方案，以nginx服务器为例。


### 方案1：协商缓存方案

Etag 和 Last-Modified 选择一种即可，都设置也行，推荐Etag，也就是在服务端开启etag。

```javascript
http {
    etag: on;
}
// 注意不要同时开启强缓存，否则会覆盖协商缓存配置。
```

### 方案2：强缓存方案

理论上来说配置协商缓存后html缓存问题就能解决，实际上浏览器环境比较复杂，不同环境表现并不一致。
特别是app或小程序的webview，页面缓存比较顽固，有时候协商缓存不起效果，可以考虑配置强缓存方案，即强制不缓存。

Cache-Control 或 Expires 选择一种即可，推荐Cache-Control。

```javascript
// nginx配置
location / {
    if ($request_filename ~* .*\.html$) {
        add_header Cache-Control "no-cache, no-store";
    }
}
// （这里Cache-Control只配置no-store也行）
```
### 方案3： 利用访问index.php进行重定向最新的更新目录下的html

理由：php是服务端处理内容，不会有缓存问题。

实现：每次打包在dist目录下的一个时间戳命名的文件夹，并把这个时间戳作为变量打包写入对应的php文件(使用fs.write等）。这样每次访问php,就会指向最新的时间戳目录下的html文件

```php
// index.php
include 'env.php';
//当前域名
$host =  $_SERVER['HTTP_HOST'];
//当前url,不包含域名
$url = $_SERVER['REQUEST_URI'];
//转换url
$arr = parse_url($url);
$queryStr = isset($arr['query']) ? $arr['query'] : '';
$targetHost = $cdnHost;
// $version = $currentVersion;
$timetamp = $versionTimestamp;
$targetUrl = $targetHost.'/'.$timetamp.'/index.html#/?'.$queryStr;
if($targetUrl)
{
	header("Location: $targetUrl");
    exit;
}
```

``` javascript
// webpack.config.js
var fs = require("fs");
//异步写入文件
// currentVersion可以删除，项目中是为了版本跟随app
fs.writeFile(
  "./dist/"+currentVersion +"/env.php",
  "<?php $cdnHost = '" +
    process.env.VUE_APP_CDN_HOST +
    "'; $currentVersion = '" +
    currentVersion +
    "';$versionTimestamp = '"+
    versionTimestamp + 
    "';",
  function(err) {
    fs.copyFileSync("./externals/index.php", "./dist/"+currentVersion +"/index.php");
  }
);

module.exports = {
  // ...
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, "dist/"+ currentVersion+ '/' + versionTimestamp)
  }
}

```

## 三、 参考文档

[spa单页面应用html缓存问题](https://blog.csdn.net/u010059669/article/details/120822527)