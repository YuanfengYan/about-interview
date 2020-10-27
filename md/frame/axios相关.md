# axios相关

## 一、如何取消请求

    Axios 提供了一个 CancelToken的函数，这是一个构造函数，该函数的作用就是用来取消接口请求的
[axios取消接口请求](https://www.jianshu.com/p/22b49e6ad819)

```javascript
getMsg () {
        let CancelToken = axios.CancelToken
        let self = this
        axios.get('http://jsonplaceholder.typicode.com/comments', {
          cancelToken: new CancelToken(function executor(c) {
            self.cancel = c
            console.log(c)
            // 这个参数 c 就是CancelToken构造函数里面自带的取消请求的函数，这里把该函数当参数用
          })
        }).then(res => {
          this.items = res.data
        }).catch(err => {
          console.log(err)
        })


        //手速够快就不用写这个定时器了，点击取消获取就可以看到效果了
        setTimeout(function () {
          //只要我们去调用了这个cancel()方法，没有完成请求的接口便会停止请求
          self.cancel()
        }, 100)
      },
      //cancelGetMsg 方法跟上面的setTimeout函数是一样的效果，因为手速不够快，哦不，是因为网速太快，导致我来不及点取消获取按钮，数据就获取成功了
      cancelGetMsg () {
        // 在这里去判断你的id 1 2 3，你默认是展示的tab1，点击的时候不管你上一个请求有没有执行完都去调用这个cancel()，
        this.cancel()
      }
```

## 二、如何实现拦截器

    Axios.protoType.request 方法是请求开始的入口，分别处理了请求的 config，以及链式处理请求拦截器 、请求、响应拦截器,并返回 Proimse 的格式方便我们处理回调

1. 代码开始构建了一个config配置对象，用于第一次执行Promise返回一个成功的promise

2. 最核心的数组chain，这个数据中保存了请求拦截器函数，响应拦截器函数和默认就有的发送请求的函数，第一步返回的成功的promise对象，将遍历这个数组逐一执行里面的函数，并返回新的Promise对象

3. 往数组中添加请求拦截器函数，依照axios请求的执行顺序，请求拦截器应该在发送请求之前执行，故应该添加在发送请求函数的前面，所以使用的是数组的unshift方法，这个方法意思是头部添加，即后面添加的元素总是在头部

4. 往数组中添加请求拦截器函数，依照axios请求的执行顺序，响应拦截器应该在发送请求之后执行，故应该添加在发送请求函数的后面，所以使用的是数组的push方法，这个方法意思是尾部添加，即后面添加的元素总是在尾部

5. promise遍历执行，使用的while循序，使用数组的shift方法每次从中取出两个函数执行(成功回调，失败回调)

6. 返回Promise对象，用于执行我们指定的响应数据的回调

## 参考文档

- [深入浅出 axios 源码](https://zhuanlan.zhihu.com/p/37962469)

- [（Ajax）axios源码简析（二）——Axios类与拦截器](https://segmentfault.com/a/1190000016170014)