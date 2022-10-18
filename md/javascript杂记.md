# javascript杂记

## 一 、Es6

### 1. let const var区别

+ 块级作用域 let const
+ 变量提升 var 
+ 给全局添加属性 var
+ 重复声明 var
+ 暂时性死区 let const
+ 初始值设置 (var、let可以不用设置，const 必须设置初始值)
+ 指针指向不可改 const


### 2. 箭头函数和普通函数区别

+ 箭头函数更加简洁
+ 箭头函数没有自己的this （因此也不能作为构造函数使用）
+ 箭头函数继承来的this指向永远不会改变
+ call,apply,bind等方法不能改变箭头函数中this的指向
+ 箭头函数没有prototype （因此也不能作为构造函数）
+ 箭头函数不能用在Generator函数，不能使用yeild关键字

### 3. 如何提取嵌套对象里指定的属性

```javascript
// 注意null进行解构会报错
const school = {
   classes: {
      stu: {
         name: 'Bob',
         age: 24,
      },
        aa:123
   }
}
const { classes: { stu: { name ,age},aa }} = school
       
console.log(name,age,aa)  // 'Bob' 24  123

```


### 通过 requestAnimationFrame 来实现定时器

```javascript
function setInterval(callback, interval) {
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
setInterval(timer => {
  console.log(1)
  a++
  if (a === 3) cancelAnimationFrame(timer)
}, 1000)

```

