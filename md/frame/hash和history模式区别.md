# hash和history模式区别

## 一、hash模式

原因：  

+ 因为hash发生变化的url都会被浏览器记录下来

+ onhashchange可以监听hash的变化

```javascript
window.onhashchange = function(event){
  console.log(event.oldURL, event.newURL);
  let hash = location.hash.slice(1);
  document.body.style.color = hash;
}

```

## 二、history路由

+ 通过back()、forward()、go()等方法，我们可以读取浏览器历史记录栈的信息，进行各种跳转操作

+ pushState()、replaceState() 使得我们可以对浏览器历史记录栈进行修改：
    　  window.history.pushState(stateObject,title,url)
    　　window.history.replaceState(stateObject,title,url)

+ history监听地址变化 window.onpopstate

## 比较

两种模式的比较：

　　　　　　1、history设置的新URL可以是同源的任意URL，而hash模式只能够修改#后面的部分，故只可设置与当前同文档的URL；

　　　　　　2、history可以添加任意类型的数据到记录当中，hash模式只能够添加短字符串；

　　　　　　3、history模式可以额外添加title属性，提供后续使用；

　　　　　　4、history模式则会将URL修改得就和正常请求后端的URL一样,如后端没有配置对应/user/id的路由处理，则会返回404错误。
