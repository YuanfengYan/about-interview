# Promise实现


## [Promise/A+规范](https://promisesaplus.com/)

## 代码实现

### promise的一些规范定义 

1. 每个then方法都返回一个新的Promise对象（原理的核心）
2. 如果then方法中显示地返回了一个Promise对象就以此对象为准，返回它的结果
3. 如果then方法中返回的是一个普通值（如Number、String等）就使用此值包装成一个新的Promise对象返回。
4. 如果then方法中没有return语句，就视为返回一个用Undefined包装的Promise对象
5. 若then方法中出现异常，则调用失败态方法（reject）跳转到下一个then的onRejected
6. 如果then方法没有传入任何回调，则继续向下传递（值的传递特性）。

### 代码
```javascript

// 首先，我们声明它的三种状态
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

function MyPromise(fn) {
    this.status = PENDING
    let failCallBack = ''
    let successCallback = ''
    
    
    let reject = (err) => {
        this.status = REJECTED
        this.reason = err||'err'
        failCallBack&&failCallBack(this.reason)//执行原先保存的回调，从而保证原先的promise状态改变
        
    }
    let resolve = (data)=>{
        this.status = FULFILLED
        this.value = data
        successCallback&&successCallback(this.value)

    }
    this.value = ''
    this.reason = ''
    this.then = (infulfilled,inrejected = function (err) {console.log('?,',err)})=>{
        let promise = null
        switch(this.status){
            case PENDING: 
                promise = new MyPromise((resolve,reject)=>{
                    failCallBack = ()=>{
                        let x = inrejected(this.reason)
                        resolvePromise(promise, x, resolve, reject)
                        // reject(x)//暂且假设返回的是值
                    }
                     successCallback = ()=>{
                        let x = infulfilled(this.value)
                       resolvePromise(promise, x, resolve, reject)
                        // resolve(x)//暂且假设返回的是值
                    }
                })
                
                
                break;
            case FULFILLED://成功
                promise = new MyPromise((resolve,reject)=>{
                    setTimeout(()=>{
                        let x = infulfilled(this.value)
                        // 这里需要判断 回调返回的类型，
                        resolve(x)//暂且假设返回的是值
                        
                    })
                })
                
                
                 break;
            case REJECTED://失败
                this.status = REJECTED
                promise = new MyPromise((resolve,reject)=>{
                    setTimeout(()=>{
                        let x = inrejected(this.reason)
                        resolve(x)//暂且假设返回的是值
                        
                    })
                })
                 break;
        }
        return promise
    }
    
    fn(resolve,reject)
    
}
function resolvePromise(p2, x, resolve, reject) {
  if (p2 === x && x != undefined) {
    reject(new TypeError('类型错误'))
  }
  //可能是promise,看下对象中是否有then方法，如果有~那就是个promise
  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    try {//为了防止出现 {then:11}这种情况,需要判断then是不是一个函数
      let then = x.then
      if (typeof then === 'function') {
        then.call(x, function (y) {
          //y 可能还是一个promise,那就再去解析，知道返回一个普通值为止
          resolvePromise(p2, y, resolve, reject)
        }, function (err) {
          reject(err)
        })
      } else {//如果then不是function 那可能是对象或常量
        resolve(x)
      }
    } catch (e) {
      reject(e)
    }
  } else {//说明是一个普通值
    resolve(x)
  }
}
let p1= new MyPromise((resolve,reject)=>{
    setTimeout(()=>{
        resolve("执行成功")
    },1000)
})
p1.then(res=>{
    console.log('res',res)
    return new MyPromise((resolve,reject)=>{
      setTimeout(()=>{
        resolve('succ2')
      },3000)
    })
}).then(res=>{
    console.log('res2',res)
}).then((res)=>{
   console.log('res3',res)
})

```

## 参考文档

+ [JS探索-手写Promise](https://zhuanlan.zhihu.com/p/103651968)