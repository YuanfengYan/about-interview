# requestAnimationFrame理解

## 一、requestAnimationFrame介绍

+ 它是一个浏览器的宏任务，请求动画帧
+ requestAnimationFrame是由浏览器专门为动画提供的API
+ 与settimeout相似，只是时间间隔不一样。requestAnimationFrame只有一个回调函数参数，且回调函数会在浏览器重绘之前调用。返回一个整数，可以传递给cancelAnimationFrame进行取消。
+ requestAnimationFrame的执行是随着系统的绘制频率执行。它能保证回调函数在屏幕每一次的绘制间隔中只被执行一次，保证不会丢帧和卡顿（比如60hz=>16.7ms执行一次）
+ requestAnimationFrame回调函数中第一个参数会传入一个时间，performance.now()方法返回当前网页自从performance.timing.navigationStart到当前时间之间的毫秒数。


## 二、 requestAnimationFrame比较settimeout 、setInterval

+ setTimeout和setInterval是基于时间 容易收队列其他事件执行时长影响
+ requestAnimationFrame是基于系统绘制频率，不会因为间隔太长卡顿，也不会因为间隔太短造成性能浪费

- IE9-浏览器不支持该方法 兼容实现

```javascript
//严格兼容 ， 因为setTimeout内部运行也需要时间，以及需要给回调的第一个参数返回时间戳
if(!window.requestAnimationFrame){
    var lastTime = 0;
    window.requestAnimationFrame = function(callback){
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0,16.7-(currTime - lastTime));
        var id  = window.setTimeout(function(){
            callback(currTime + timeToCall);
        },timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    }
}

```

- 通过 requestAnimationFrame 来实现定时器

在项目中遇到h5页面在浏览器切回到后台时定时器会继续在执行，导致重新切回浏览器时，会堆积后台执行的很多事件。（比如项目中的弹幕会扎堆出现）。而requestAnimationFrame是基于浏览器绘制频率，在浏览器切回后台时，浏览器绘制也会暂停，不会导致上面的问题。

```javascript
function mySetInterval(callback, interval) {
  let timer
  const now = Date.now
  let startTime = now()
  let endTime = startTime
  const loop = () => {
    timer = window.requestAnimationFrame(loop)
    endTime = now()
    if (endTime - startTime >= interval) {
      startTime = endTime = now()
      callback(timer)
    }
  }
  timer = window.requestAnimationFrame(loop)
  return timer
}

let a = 0
mySetInterval(timer => {
  console.log(1)
  a++
  if (a === 3) cancelAnimationFrame(timer)
}, 1000)

```

## 三、 应用场景

1. 监控卡顿方法

```javascript

// performance.now()方法返回当前网页自从performance.timing.navigationStart到当前时间之间的毫秒数。
var lastTime = performance.now()
var frame = 0
var lastFameTime = performance.now()
var loop = function (time) {
    // console.log(time,'time')
  var now = performance.now()
  var fs = now - lastFameTime
  lastFameTime = now
  var fps = Math.round(1000 / fs)
  frame++
  if (now > 1000 + lastTime) {
    var fps = Math.round((frame * 1000) / (now - lastTime))
    frame = 0
    lastTime = now
      console.log(fps)
  }
  window.requestAnimationFrame(loop)
}
loop()
```

2. 定时器封装
3. 大量数据渲染
4. 监听 scroll 函数

```javascript
// 页面滚动事件（scroll）的监听函数,推迟到下一次重新渲染
$(window).on('scroll', function () {
  window.requestAnimationFrame(scrollHandler)
})
// 平滑滚动到页面顶部
const scrollToTop = () => { 
  const c = document.documentElement.scrollTop || document.body.scrollTop 
  if (c > 0) {  
    window.requestAnimationFrame(scrollToTop) 
    window.scrollTo(0, c - c / 8) 
  }
}

scrollToTop()
```

## 参考文档

[requestAnimationFrame，读懂这篇文章就够了](https://blog.csdn.net/weixin_44730897/article/details/116532510)
