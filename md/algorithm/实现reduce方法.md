# 实现reduce方法

## reduce的使用

```javascript
// 语法
arr.reduce(callback(accumulator, currentValue[, index[, array]])[, initialValue])

```

callback接受4个参数

+ Accumulator (acc) (累计器)
+ Current Value (cur) (当前值)
+ Current Index (idx) (当前索引)
+ Source Array (src) (源数组)

initialValue:传递给函数的初始值，当initialValue有值时，将作为accumulator传入回调函数中。

最终返回的是 accumulator

## 实现自己的reduce

```javascript
Array.prototype.myReduce = function(fn,initVal){
   if(this.length>0){
       if(initVal===undefined){
           this.forEach((item,index,arr)=>{
               if(index==0){
                   initVal = this[0]
               }else{
                   initVal = fn.call(this,initVal,item,index,arr)
               }
           })
       }else{
            this.forEach((item,index,arr)=>{
                initVal = fn.call(this,initVal,item,index,arr)
            })
       }
   }
   return initVal
}

```
