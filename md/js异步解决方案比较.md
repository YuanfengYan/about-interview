# js异步解决方案比较

## 回调函数 CallBack

```javascript
function A(callback) {
    setTimeout(()=>{
        callback();  
    }，1000)
    console.log('我是主函数');
}
function B(){
    console.log('我是回调函数')
}
A(B)
```

>### 优点

+ 简单，容易理解和 部署

>### 缺点

+ 不利于代码的阅读，和维护，各部分之间高度耦合，流程会很混乱，而且每一个任务只能指定一个回调函数。
+ 不能try catch捕获错误 ，不能return

## Promise

>### 优点

+ 链式调用，解决回调地狱
+ 易读

>### 缺点

+ 无法取消promise
>解决方法：①触发catch ②什么都不做，返回new Promise(()=>{}) padding状态  

+ 如果不设置回调函数，promise内部抛出的错误，不会反应到外部

### promise面试题集

[45道Promise面试题](https://juejin.im/post/6844904077537574919#heading-1)

## async await

异步的终极解决方案

>### 优点

+ 代码清晰，不用写一堆then链式处理
+ 解决了回调地狱的问题
+ 性能不promise好（不用创建多余的堆栈）[从JS引擎理解Await b()与Promise.then(b)的堆栈处理](https://blog.csdn.net/fundebug/article/details/81127760)
+ 可以用try catch处理JSON.prase错误
