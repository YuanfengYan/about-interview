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

+ Promise是一个构造函数，用于解决异步操作产生的回调地狱的问题  

+ Promise 有三种状态，pending（等待状态）、resolve（成功状态）、reject（失败状态）  

+ Promise 有一个then方法有两个参数，一个对应resolve的回调，另一个对应reject的回调，且可以接受他们传入的参数

+ 常用的Promise的方法有刚才说的then、catch、all、race、finally
        catch用来捕获promise的错误函数，与then的第二个参数作用相同
        all用来执行多个promise函数（装在数组里），数组里所有任务的状态变为resolve之后，all的状态才可以变为resolve，只要有一个reject，all的状态就变为reject
        race也是用来执行多个promise函数（装在数组里），只要有一个改变状态（像赛跑一样），race的状态就会随之改变
        finally，不管成功与否，最后都会执行的函数

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
