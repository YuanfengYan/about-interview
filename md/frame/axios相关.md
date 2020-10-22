# axios相关

## 如何取消请求

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
