# Vue3设计与实现2/6

## 第二篇：响应系统

## 一、响应系统的设计与实现

### 1.响应式数据与副作用函数

+ **副作用函数：**  是指会产生副作用的函数，直接或间接影响其他函数的执行。//个人理解一般都是对函数外能访问的值进行了修改
+ **响应式数据：**  假设在一个副作用函数中读取到了某个对象的属性，当值变化后，副作用函数自动重新执行。那么这个对象就是响应式对象


### 2. 响应式数据的基本实现

实现思路以下两点：

+ 当副作用函数 effect 执行时，会触发字段 obj.text 的读取操作；
+ 当修改 obj.text 的值时，会触发字段 obj.text 的设置操作。

实现步骤：

1. 当读取字段 obj.text 时，我们可以把副作用函数 effect 存储到一个“桶”里
2. 当设置 obj.text 时，再把副作用函数 effect 从“桶”里取出并执行即可，

proxy代码：

```javascript
// 存储副作用函数的桶
  const bucket = new Set()

  // 原始数据
  const data = { text: 'hello world' }
  // 对原始数据的代理
  const obj = new Proxy(data, {
    // 拦截读取操作
    get(target, key) {
      // 将副作用函数 effect 添加到存储副作用函数的桶中
      bucket.add(effect) //这里是硬编码写入，只是为了演示
      // 返回属性值
      return target[key]
    },
    // 拦截设置操作
    set(target, key, newVal) {
      // 设置属性值
      target[key] = newVal
      // 把副作用函数从桶里取出并执行
      bucket.forEach(fn => fn())
      // 返回 true 代表设置操作成功
      return true
    }
  })
//   测试执行
  // 副作用函数
  function effect() {
    document.body.innerText = obj.text
  }
  // 执行副作用函数，触发读取
  effect()
  // 1 秒后修改响应式数据
  setTimeout(() => {
    obj.text = 'hello vue3'
  }, 1000)
```

### 3. 设计一个完善的响应系统

这一节完善上一节的硬编码effect推入桶的问题
目标：
1. 每个副作用函数都能准确跟踪对应的键值变化，建立明确的联系 
2. 对于被销毁的对象，桶中应该不引用 --- weakmap

```javascript
let activeEffect = null
const bucket = new WeakMap() //弱引用
const obj = new Proxy(data,{
    get(target, key){
        track(track，key) //将副作用函数 activeEffect添加到桶中
        return target[key]
    },
    set(target,key,newVal){
        target[key] = newVal
        trigger(target,key) //把其所有副作用函数提出来一并执行
    }
})
// 在get拦截函数内部调用track 函数来追踪变化
function track(target,key){
    if(!activeEffect) return
    let depsMap = bucket.get(target)
    if(!depsMap){
        depsMap = new Map(targte)
        bucket.set(target,depsMap)
    }
    let deps = depsMap.get(key) //获取key的副作用函数Set集合
    if(!deps){
        deps = new Set()
        depsMap.set(key,deps)
    }
    deps.add(activeEffect)
}
// 在set拦截函数内部调用 trigger函数触发变化
function trigger(target,key){
    const depsMap = bucket.get(target)
    if(!depsMap) return
    const effects = depsMap.get(key)
    effects && effects.forEach(fn=>{fn()})
}
function effect(fn){
    activeEffect = fn
    fn()
}
```

+ 上述代码还存在副作用函数冗余问题。↓进行解决

### 4. 分支切换于cleanup

冗余副作用的问题示例:

```javascript
01 const data = { ok: true, text: 'hello world' }
02 const obj = new Proxy(data, { /* ... */ })
03
04 effect(function effectFn() {
05   document.body.innerText = obj.ok ? obj.text : 'not'
06 })
// obj.ok 的初始值为 true，当我们将其修改为 false 
// 因为首次副作用函数绑定了obj.text,obj.text。
// 所以每次修改text都会执行副作用函数，然而期望的并不是每次都执行，（obj.ok==false）因为无论怎么执行页面都不会变化，没用到text
```

+ 解决这个问题的思路很简单，每次副作用函数执行时，我们可以先把它从所有与之关联的依赖集合中删除

```javascript
 // 用一个全局变量存储被注册的副作用函数
 let activeEffect
 function effect(fn) {
   const effectFn = () => {
    clearup(effectFn) //完成清除工作
     // 当 effectFn 执行时，将其设置为当前激活的副作用函数
     activeEffect = effectFn
     fn() //这个时候会重新执行依赖收集
   }
   // activeEffect.deps 用来存储所有与该副作用函数相关联的依赖集合
   effectFn.deps = []
   // 执行副作用函数
   effectFn()
 }

 function cleanup(effectFn) {
   // 遍历 effectFn.deps 数组
   for (let i = 0; i < effectFn.deps.length; i++) {
     // deps 是依赖集合
     const deps = effectFn.deps[i]
     // 将 effectFn 从依赖集合中移除
     deps.delete(effectFn)
   }
   // 最后需要重置 effectFn.deps 数组
   effectFn.deps.length = 0
 }
function track(target,key){
    ...
    activeEffect.deps.push(deps) // 新增

}
 function trigger(target, key) {
    ...
    // 解决无限循环问题
   const effectsToRun = new Set(effects)  // 新增
   effectsToRun.forEach(effectFn => effectFn())  // 新增
   // effects && effects.forEach(effectFn => effectFn()) // 删除
 }
```

### 5. 嵌套的effect与effect栈

+ 因为effect是可嵌套的，而activeEffects所存储的副作用函数只能有一个，而此时当副作用函数发生嵌套时，内层副作用函数的执行就会覆盖activeEffect的值。这时即使响应式数据在外层副作用函数读取，收集到的也会是内层副作用函数。

`我们需要一个副作用函数栈 effectStack，在副作用函数执行时，将当前副作用函数压入栈中，待副作用函数执行完毕后将其从栈中弹出，并始终让 activeEffect 指向栈顶的副作用函数。这样就能做到一个响应式数据只会收集直接读取其值的副作用函数，而不会出现互相影响的情况`
```javascript
 // 用一个全局变量存储当前激活的 effect 函数
 let activeEffect
 // effect 栈
 const effectStack = []  // 新增
 function effect(fn) {
   const effectFn = () => {
     cleanup(effectFn)
     // 当调用 effect 注册副作用函数时，将副作用函数赋值给 activeEffect
     activeEffect = effectFn
     // 在调用副作用函数之前将当前副作用函数压入栈中
     effectStack.push(effectFn)  // 新增
     fn()
     // 在当前副作用函数执行完毕后，将当前副作用函数弹出栈，并把 activeEffect 还原为之前的值
     effectStack.pop()  // 新增
     activeEffect = effectStack[effectStack.length - 1]  // 新增
   }
   // activeEffect.deps 用来存储所有与该副作用函数相关的依赖集合
   effectFn.deps = []
   // 执行副作用函数
   effectFn()
 }
```

### 6. 避免无限递归循环

```javascript
const data = { foo: 1 }
const obj = new Proxy(data, { /*...*/ })
effect(() => obj.foo++)
// 上面effcet的自增操作会引发栈溢出。

// 因为在这个语句中，既会读取 obj.foo 的值，又会设置 obj.foo 的值，而这就是导致问题的根本原因。我们可以尝试推理一下代码的执行流程：首先读取 obj.foo 的值，这会触发 track 操作，将当前副作用函数收集到“桶”中，接着将其加 1 后再赋值给 obj.foo，此时会触发 trigger 操作，即把“桶”中的副作用函数取出并执行。但问题是该副作用函数正在执行中，还没有执行完毕，就要开始下一次的执行。这样会导致无限递归地调用自己，于是就产生了栈溢出
```

+ 在 trigger 动作发生时增加守卫条件：如果 trigger 触发执行的副作用函数与当前正在执行的副作用函数相同，则不触发执行。

```javascript
 function trigger(target, key) {
   const depsMap = bucket.get(target)
   if (!depsMap) return
   const effects = depsMap.get(key)

   const effectsToRun = new Set()  //新增
    // const effectsToRun = new Set(effects)  // 删除
   effects && effects.forEach(effectFn => {
     // 如果 trigger 触发执行的副作用函数与当前正在执行的副作用函数相同，则不触发执行
     if (effectFn !== activeEffect) {  // 新增
       effectsToRun.add(effectFn)
     }
   })
   effectsToRun.forEach(effectFn => effectFn())
   // effects && effects.forEach(effectFn => effectFn())
 }
```

### 7. 调度执行

    所谓可调度性：有能力决定副作用函数执行的时机，次数以及方式

实现思路：

+ 为 effect 函数设计一个选项参数 options，允许用户指定调度器。并赋值给effectFn.option属性值
+ 在tigger中执行副作用函数effectFn时,根据option.scheduler设定执行时机

```javascript
function effect(fn, options = {}) {
  const effectFn = () => {
    cleanup(effectFn)
    // 当调用 effect 注册副作用函数时，将副作用函数赋值给 activeEffect
    activeEffect = effectFn
    // 在调用副作用函数之前将当前副作用函数压栈
    effectStack.push(effectFn)
    fn()
    // 在当前副作用函数执行完毕后，将当前副作用函数弹出栈，并把 activeEffect 还原为之前的值
    effectStack.pop()
    activeEffect = effectStack[effectStack.length - 1]
  }
  // 将 options 挂载到 effectFn 上
  effectFn.options = options  // 新增
  // activeEffect.deps 用来存储所有与该副作用函数相关的依赖集合
  effectFn.deps = []
  // 执行副作用函数
  effectFn()
}
effect(
  () => {
    console.log(obj.foo)
  },
  // options
  {
    // 调度器 scheduler 是一个函数
    scheduler(fn) {
      // ...
      jobQueue.add(fn) //这是一个定时任务队列
      flushJob() //里面设置了isFlushing,只有在执行任务的时候会设置true
    }
  }
)
function trigger(target, key) {
  const depsMap = bucket.get(target)
  if (!depsMap) return
  const effects = depsMap.get(key)

  const effectsToRun = new Set()
  effects && effects.forEach(effectFn => {
    if (effectFn !== activeEffect) {
      effectsToRun.add(effectFn)
    }
  })
  effectsToRun.forEach(effectFn => {
    // 如果一个副作用函数存在调度器，则调用该调度器，并将副作用函数作为参数传递
    if (effectFn.options.scheduler) {  // 新增
      effectFn.options.scheduler(effectFn)  // 新增
    } else {
      // 否则直接执行副作用函数（之前的默认行为）
      effectFn()  // 新增
    }
  })
}
```

+ 任务队列 能够控制执行次数，保证在连续多次set设置时，不会多次执行tigger的副作用

```javascript
 // 定义一个任务队列
 const jobQueue = new Set()
 // 使用 Promise.resolve() 创建一个 promise 实例，我们用它将一个任务添加到微任务队列
 const p = Promise.resolve()

 // 一个标志代表是否正在刷新队列
 let isFlushing = false
 function flushJob() {
   // 如果队列正在刷新，则什么都不做
   if (isFlushing) return
   // 设置为 true，代表正在刷新
   isFlushing = true
   // 在微任务队列中刷新 jobQueue 队列
   p.then(() => {
     jobQueue.forEach(job => job())
   }).finally(() => {
     // 结束后重置 isFlushing
     isFlushing = false
   })
 }
```

### 计算属性computed和lazy

+ 讲解了计算属性，computed。计算属性实际上是一个懒执行的副作用函数，我们通过lazy选项使得副作用函数可以懒执行。

```javascript
function effect(fn, options = {}) {
  const effectFn = () => {
    cleanup(effectFn)
    activeEffect = effectFn // 当调用 effect 注册副作用函数时，将副作用函数赋值给 activeEffect
    effectStack.push(effectFn) // 在调用副作用函数之前将当前副作用函数压栈
    const res = fn() //新增
    effectStack.pop() // 在当前副作用函数执行完毕后，将当前副作用函数弹出栈，并把 activeEffect 还原为之前的值
    activeEffect = effectStack[effectStack.length - 1]
    return   res
  }
 
  effectFn.options = options  // 将 options 挂载到 effectFn 上
 
  effectFn.deps = [] // // activeEffect.deps 用来存储所有与该副作用函数相关的依赖集合
  // 执行副作用函数
  if(!option.lazy){ 
    effectFn()
  }
  return effectFn
}
function computed(getter){
    let value 
    let dirty = true
    const effectFn = effect(getter,{
        lazy:true,
        scheduler(){ //在下一次修改了值后，进行赋值dirty告诉下一次去计算属性值时，需要重新计算
            dirty = true 
            tirgger(obj,'value') //这里手动触发上面说的下一次获取计算属性值
        }
    })
    const obj = {
        get value(){
            if(dirty){
                value = effectFn()
                dirty = false
            }
            track(obj,'value')//当读取value时，手动调用track 函数进行追踪
            return value
        }
    }
    return obj
}
```

总结： 

- 计算属性实际上就是一个懒执行的副作用函数，我们通过lazy选项使副作用函数可以懒执行。被标记为懒执行的副作用函数可以手动执行，利用这个特点设计计算属性，当读取计算属性时，只需手动执行副作用函数就行
- 当计算属性依赖的响应式数据发生变化时，会通过scheduler将dirty标记设置为true,代表`脏`。这样下次读取计算属性时，会重新计算真正的值

### 9. watch的实现原理

    watch本质：就是观测有一个响应式数据，当数据发生变化时通知并执行响应的回调函数

    实现本质： 就是利用effect以及option.scheduler选项

硬代码实现：

```javascript
//只能观测 source.xxx
function watch(source, cb){
    effect(
        ()=>source.xxx,
        {
            scheduler:(){
                cb()
            }
        }
    )
}
```

升级版1

```javascript
// 在 watch 内部的 effect 中调用 traverse 函数进行递归的读取操作，代替硬编码的方式，这样就能读取一个对象上的任意属性，从而当任意属性发生变化时都能够触发回调函数执行。
01 function watch(source, cb) {
02   effect(
03     // 调用 traverse 递归地读取
04     () => traverse(source),
05     {
06       scheduler() {
07         // 当数据变化时，调用回调函数 cb
08         cb()
09       }
10     }
11   )
12 }
13
14 function traverse(value, seen = new Set()) {
15   // 如果要读取的数据是原始值，或者已经被读取过了，那么什么都不做
16   if (typeof value !== 'object' || value === null || seen.has(value)) return
17   // 将数据添加到 seen 中，代表遍历地读取过了，避免循环引用引起的死循环
18   seen.add(value)
19   // 暂时不考虑数组等其他结构
20   // 假设 value 就是一个对象，使用 for...in 读取对象的每一个值，并递归地调用 traverse 进行处理
21   for (const k in value) {
22     traverse(value[k], seen)
23   }
24
25   return value
26 }

// 同理也可以source 传getter函数

01 function watch(source, cb) {
02   // 定义 getter
03   let getter
04   // 如果 source 是函数，说明用户传递的是 getter，所以直接把 source 赋值给 getter
05   if (typeof source === 'function') {
06     getter = source
07   } else {
08     // 否则按照原来的实现调用 traverse 递归地读取
09     getter = () => traverse(source)
10   }
11
12   effect(
13     // 执行 getter
14     () => getter(),
15     {
16       scheduler() {
17         cb()
18       }
19     }
20   )
21 }
```

+ 实现watch中新旧值

```javascript
01 function watch(source, cb) {
02   let getter
03   if (typeof source === 'function') {
04     getter = source
05   } else {
06     getter = () => traverse(source)
07   }
08   // 定义旧值与新值
09   let oldValue, newValue
10   // 使用 effect 注册副作用函数时，开启 lazy 选项，并把返回值存储到 effectFn 中以便后续手动调用
11   const effectFn = effect(
12     () => getter(),
13     {
14       lazy: true,
15       scheduler() {
16         // 在 scheduler 中重新执行副作用函数，得到的是新值
17         newValue = effectFn()
18         // 将旧值和新值作为回调函数的参数
19         cb(newValue, oldValue)
20         // 更新旧值，不然下一次会得到错误的旧值
21         oldValue = newValue
22       }
23     }
24   )
25   // 手动调用副作用函数，拿到的值就是旧值
26   oldValue = effectFn()
27 }

```
    最核心的改动是使用 lazy 选项创建了一个懒执行的 effect。注意上面代码中最下面的部分，我们手动调用effectFn 函数得到的返回值就是旧值，即第一次执行得到的值。当变化发生并触发 scheduler 调度函数执行时，会重新调用 effectFn 函数并得到新值，这样我们就拿到了旧值与新值，接着将它们作为参数传递给回调函数 cb 就可以了。最后一件非常重要的事情是，不要忘记使用新值更新旧值：oldValue =newValue，否则在下一次变更发生时会得到错误的旧值。

### 10. 立即执行的 watch 与回调执行时机

实现清单：

+ 立即执行的回调函数
+ 回调函数的执行时机 immediate flush

```javascript
01 watch(obj, () => {
02   console.log('变化了')
03 }, {
04   // 回调函数会在 watch 创建时立即执行一次
05   immediate: true
06 })

// 当 immediate 选项存在并且为 true 时，回调函数会在该watch 创建时立刻执行一次。仔细思考就会发现，回调函数的立即执行与后续执行本质上没有任何差别，所以我们可以把scheduler 调度函数封装为一个通用函数，分别在初始化和变更时执行它，

01 function watch(source, cb, options = {}) {
02   let getter
03   if (typeof source === 'function') {
04     getter = source
05   } else {
06     getter = () => traverse(source)
07   }
08
09   let oldValue, newValue
10
11   // 提取 scheduler 调度函数为一个独立的 job 函数
12   const job = () => {
13     newValue = effectFn()
14     cb(newValue, oldValue)
15     oldValue = newValue
16   }
17
18   const effectFn = effect(
19     // 执行 getter
20     () => getter(),
21     {
22       lazy: true,
23       // 使用 job 函数作为调度器函数
24       scheduler: job
25     }
26   )
27
28   if (options.immediate) {
29     // 当 immediate 为 true 时立即执行 job，从而触发回调执行
30     job()
31   } else {
32     oldValue = effectFn()
33   }
34 }
// 这样就实现了回调函数的立即执行功能。由于回调函数是立即执行的，所以第一次回调执行时没有所谓的旧值，因此此时回调函数的 oldValue 值为 undefined，这也是符合预期的。
```

+ flush: pre(指组件更新前触发) post（组件更新后触发）,sync(立即同步执行)

```javascript
01 function watch(source, cb, options = {}) {
02   let getter
03   if (typeof source === 'function') {
04     getter = source
05   } else {
06     getter = () => traverse(source)
07   }
08
09   let oldValue, newValue
10
11   const job = () => {
12     newValue = effectFn()
13     cb(newValue, oldValue)
14     oldValue = newValue
15   }
16
17   const effectFn = effect(
18     // 执行 getter
19     () => getter(),
20     {
21       lazy: true,
22       scheduler: () => {
23         // 在调度函数中判断 flush 是否为 'post'，如果是，将其放到微任务队列中执行
24         if (options.flush === 'post') {
25           const p = Promise.resolve()
26           p.then(job)
27         } else {
28           job()
29         }
30       }
31     }
32   )
33
34   if (options.immediate) {
35     job()
36   } else {
37     oldValue = effectFn()
38   }
39 }
```

#### 11. 过期的副作用

    过期竞态问题

使用：

```javascript
01 watch(obj, async (newValue, oldValue, onInvalidate) => {
02   // 定义一个标志，代表当前副作用函数是否过期，默认为 false，代表没有过期
03   let expired = false
04   // 调用 onInvalidate() 函数注册一个过期回调
05   onInvalidate(() => {
06     // 当过期时，将 expired 设置为 true
07     expired = true
08   })
09
10   // 发送网络请求
11   const res = await fetch('/path/to/request')
12
13   // 只有当该副作用函数的执行没有过期时，才会执行后续操作。
14   if (!expired) {
15     finalData = res
16   }
17 })
// 在发送请求之前，我们定义了 expired 标志变量，用来标识当前副作用函数的执行是否过期；接着调用onInvalidate 函数注册了一个过期回调，当该副作用函数的执行过期时将 expired 标志变量设置为 true；最后只有当没有过期时才采用请求结果
```

实现 onInvalidate

+ 实现原理：其实很简单，在 watch 内部每次检测到变更后，在副作用函数重新执行之前，会先调用我们通过 onInvalidate 函数注册的过期回调

```javascript
01 function watch(source, cb, options = {}) {
02   let getter
03   if (typeof source === 'function') {
04     getter = source
05   } else {
06     getter = () => traverse(source)
07   }
08
09   let oldValue, newValue
10
11   // cleanup 用来存储用户注册的过期回调
12   let cleanup
13   // 定义 onInvalidate 函数
14   function onInvalidate(fn) {
15     // 将过期回调存储到 cleanup 中
16     cleanup = fn
17   }
18
19   const job = () => {
20     newValue = effectFn()
21     // 在调用回调函数 cb 之前，先调用过期回调
22     if (cleanup) {
23       cleanup()
24     }
25     // 将 onInvalidate 作为回调函数的第三个参数，以便用户使用
26     cb(newValue, oldValue, onInvalidate)
27     oldValue = newValue
28   }
29
30   const effectFn = effect(
31     // 执行 getter
32     () => getter(),
33     {
34       lazy: true,
35       scheduler: () => {
36         if (options.flush === 'post') {
37           const p = Promise.resolve()
38           p.then(job)
39         } else {
40           job()
41         }
42       }
43     }
44   )
45
46   if (options.immediate) {
47     job()
48   } else {
49     oldValue = effectFn()
50   }
51 }
```

+ 在这段代码中，我们首先定义了 cleanup 变量，这个变量用来存储用户通过 onInvalidate 函数注册的过期回调。可以看到onInvalidate 函数的实现非常简单，只是把过期回调赋值给了cleanup 变量。这里的关键点在 job 函数内，每次执行回调函数 cb 之前，先检查是否存在过期回调，如果存在，则执行过期回调函数 cleanup。最后我们把 onInvalidate 函数作为回调函数的第三个参数传递给 cb，以便用户使用

## 二、非原始值的响应式方案

    前面描述的是常规的纯拦截set/get的操作，没有对for...in循环、或者Set、Map、Weakmap以及weakset等集合类型进行代理
    要实现完善的响应式数据，需要深入语言规范

### 1. 理解Proxy和Refect

**Proxy 只能代理对象的基本语义**

Proxy 理解关键点：

+ 代理：指对一个对象<font color="red">基本语义</font>的代理，他允许我们<font color="red">拦截</font>并<font color="red">重新定义</font>对一个对象的基本操作

+ 基本语义：给出一个对象obj,可以进行一些基本操作，如：读取属性，设置属性值，函数执行的apply

+ 复合操作： 例如调用对象下的方法（obj.fn()）。先执行基本语义读取对象属性 obj.fn ，再是执行基本语义apply 执行函数

Reflect 理解关键点：

+ Reflect下的方法在Proxy的方法中都能找到
+ 让操作对象的编程变为函数式编程

```javascript
    // 老写法
'assign' in Object // true

// 新写法
Reflect.has(Object, 'assign') // true
```

+ 操作对象时出现报错返回false
  + 比如，Object.defineProperty(obj, name, desc)在无法定义属性时，会抛出一个错误，而Reflect.defineProperty(obj, name, desc)则会返回false。
+ 将object对象一些内部的方法，放到Reflect对象上。


### 2. javascript对象及Proxy的工作原理


    对象的语义就是由对象的内部方法指定的，所谓内部方法指当我们对一个对象操作时在引擎内部调用的方法。

- 必要内部方法
![内部方法](https://qiniu.kananana.cn/other/neibufangfa.jpg)
- 额外必要内部方法 （函数对象）
![额外内部方法](https://qiniu.kananana.cn/other/neibufangfa2.jpg)

在javascript中其实分为2种对象：常规对象和异质对象

+ 常规对象：
  + 1.对于必要的内部方法（第一个图标列出的内部方法），必须使用ECMA规范10.1x节给出的定义实现
  + 2.对于内部方法[[Call]]，必须使用ECMA规范10.2.1节给出的定义实现
  + 3.对于内部方法[[Construct]]，必须使用ECMA规范10.2.2节给出的定义实现

+ 异质对象： 任何不属于常规对象的对象都是异质对象

例如：Proxy就是一个异质对象，内部虽然调用[[Get]],但使用的是ECMA10.5.8的规范，不符合常规对象1的条件，属于异质对象

**Proxy创建代理对象时指定的拦截函数,实际上是用来自定义代理对象本身的内部方法和行为的,而不是用来指定被代理对象的内部方法和行为的。**

### 3. 如何代理Object

响应系统应该拦截一切读取操作，以便当数据变化时能够正确地触发响应，对一个对象可能的读取操作如下：

1. 访问属性：obj.foo
2. 判断对象或原型上是否存在给定的key: key in obj
3. 使用for…in循环遍历对象：for(const key in obj)

第1点之前已经实现过了

第2点：in操作符怎么拦截

根据[ECMA规范13.10.1节](https://tc39.es/ecma262/#sec-relational-operators)可以知道in操作符是通过调用一个叫做HasProperty的抽象方法得到的。根据规范还可以知道HasProperty抽象方法的返回值时通过调用对象的内部方法[[HasProperty]]得到的，而这个内部方法对应的拦截函数为has，因此可以通过has拦截函数实现对in操作符的代理：
![ecma13.10.1](https://qiniu.kananana.cn/other/ecma13.jpg)

```javascript
const obj = {foo:1}
const p = new Proxy(obj, {
	has(target, key){
		track(target, key)
		return Reflect.has(target, key)
	}
})
// 测试
effect(()=>{
	'foo' in p // 将会建立依赖关系
})

```

第3点 ： 再看看如何拦截for…in循环

根据对规范[ECMA14.7.5.6节](https://tc39.es/ecma262/#sec-runtime-semantics-forinofheadevaluation)的研究可知可以使用ownKeys拦截函数来拦截for…in循环中所使用到的Reflect.ownKeys操作

```javascript
// ecma
function* EnumerateObjectProperties(obj) {
  const visited = new Set();
  for (const key of Reflect.ownKeys(obj)) {
    if (typeof key === "symbol") continue;
    const desc = Reflect.getOwnPropertyDescriptor(obj, key);
    if (desc) {
      visited.add(key);
      if (desc.enumerable) yield key;
    }
  }
  const proto = Reflect.getPrototypeOf(obj);
  if (proto === null) return;
  for (const protoKey of EnumerateObjectProperties(proto)) {
    if (!visited.has(protoKey)) yield protoKey;
  }
}
// 第一版
const obj = { foo: 1}
const ITERATE_KEY = Symbol()

const p = new Proxy(obj, {
	ownKeys(target){
		// 将副作用函数与ITERATE_KEY 关联
		track(target, ITERATE_KEY )
		return Reflect.ownKeys(target)
	}
})

```

上面代码中为什么将ITERATE_KEY作为追踪的key。这是因为ownKeys拦截函数与set/get不同，在ownKeys，只能拿到目标对象target。因此只能构造唯一的key作为标识。

既然追踪的是ITERATE_KEY那么在触发响应的时候也应该触发其才对

```javascript
trigger(target, ITERATE_KEY)
```

但是在什么情况下，对数据的操作需要触发与ITERATE_KEY相关联的副作用函数重新执行呢？
如下：

```javascript
const obj = {foo: 1}
const p = new Proxy(obj, {/*...*/})

effect(()=>{
	// for...in循环
	for(const key in p){
		console.log(key)
	}
})

```

副作用函数执行后，会与ITERATE_KEY建立响应联系，接下来为对象p添加额外的属性bar

```javascript
p.bar = 2
```

由于为对象p添加了新的属性bar，所以for…in循环就会由执行一次变成执行两次。也就是说，当为对象添加新属性时会对for…in循环产生影响，所以需要触发与ITERATE_KEY相关联的副作用函数重新执行。可是现在为对象p添加新的属性bar时，并没有触发副作用函数重新执行，这是为什么呢？首先来看现在set拦截函数的实现：

```javascript
const p = new Proxy(obj, {
	// 拦截设置操作
	set(target, key, newVal){
		//设置属性值
		const res = Refelct.set(target, key, newVal, receiver)
		// 把副作用函数从桶里取出并执行
		trigger(target, key)
		return res
	},
	//省略其他

})

```

当为对象p添加新的bar属性时，会触发set拦截函数执行。此时set拦截函数接收到的key就是字符串‘bar’。但还要考虑到如果是修改bar时的情况



```javascript
const p = new Proxy(obj, {
	set(target, key, newVal, receiver){
		// 如果属性不存在，则说明时在添加新属性，否则时设置已有属性
		const type = Object.prototype.hasOwnProperty.call(target,key) ? 'SET' : 'ADD'
		// 设置属性值
		const res = Reflect.set(target, key, newVal, receiver)
		// 将type作为第三个参数传递给trigger函数
		trigger(target, key, type)
	}
	
})
function trigger(target, key, type){
	const depsMap = bucket.get(target)
	if(!depsMap) return
	const effects = depsMap.get(key)
	
	const effectsToRun = new Set()
	effects && effects.forEach(effectFn => {
		if(effectFn != activeEffect){
			effectsToRun.add(effectFn)
		}
	})

	console.log(type, key)
	// 只有当操作类型'ADD'时，才触发与ITERATE_KEY相关联的副作用函数重新执行
	if(type === 'ADD'){
		const iterateEffects = depsMap.get(ITERATE_KEY)
		iterateEffects && iterateEffects .forEach(effectFn => {
			if(effectFn != activeEffect){
				effectsToRun.add(effectFn)
			}
		})
	}
	
	effectsToRun.forEach(effectFn => {
		if(effectFn.options.scheduler){
			effectFn.options.scheduler(effectFn)
		}else{
			effectFn()
		}
	})
	
}

```
- 最后就是删除属性操作的代理。通过规范可以知道delete操作符的行为依赖[[Delete]]内部方法，而该内部方法可以使用deleteProperty拦截
- 且注意要在trigger中区分DELETE类型

```javascript
function trigger(target, key, type){
	const depsMap = bucket.get(target)
	if(!depsMap) return
	const effects = depsMap.get(key)
	
	const effectsToRun = new Set()
	effects && effects.forEach(effectFn => {
		if(effectFn != activeEffect){
			effectsToRun.add(effectFn)
		}
	})

	console.log(type, key)
	if(type === 'ADD' || type==='DELETE'){
		const iterateEffects = depsMap.get(ITERATE_KEY)
		iterateEffects && iterateEffects .forEach(effectFn => {
			if(effectFn != activeEffect){
				effectsToRun.add(effectFn)
			}
		})
	}
	
	effectsToRun.forEach(effectFn => {
		if(effectFn.options.scheduler){
			effectFn.options.scheduler(effectFn)
		}else{
			effectFn()
		}
	})
	
}

```

### 4. 合理地触发响应式

前面我们只能说是简单的实现了功能，但是有很多边际条件我们并没有考虑到。

+ 当值没有发生变化时 （对属性赋予相同的值时，不应该触发响应式）比如这样

```javascript
const p = reactive({a:1})
effect(()=>{
    console.log(p.a)
})
p.a=1
//值没变，但还是会更新
// 修改后
new Proxy(obj,{
 set(target,key,newVal,receivere){
     const oldVal = target[key]
     if(oldVal !== newVal && (oldVal === oldVal && newVal === newVal)){
         // do sth 
     }
 }
})

```

+ 原型链继承问题

```javascript
const obj = {}
const proto = { bar: 1 }
const child = receiver(obj)
const parent = receiver(proto)
// 使用 parent 作为 child 的原型
Object.setPrototypeOf(child, parent)
effect(() => {
  console.log(child.bar)//child.bar parent.bar都会被副作用函数收集
})
child.bar = 2 //会导致副作用函数重新执行2次
```

书中介绍通过proxy的参数receive进行处理，只有receiver是targetd 代理对象时才进行更新

### 5. 浅响应式与深响应

+ reactive和shallowReactive的区别

```javascript
function createReactive(obj, isShallow = false) {
  return new Proxy(obj, {
    get(target, key, reciver) 
      const res = Reflect.get(target, key, reciver)
      track(target, key) 
      // 浅响应式直接返回
      if(isShallow) {
        return res
      }
      // 深响应式继续对对象做深入的响应式
      if(typeof res === 'object' && res !== null) {
        return reactive(res)
      }
      return res
    }
  })
}
// ractive深层响应式方法
function reactive(obj) {
  return createReactive(obj)
}
// shallow浅层响应式方法，传入true
function shallowReactive(obj) {
  return createReactive(obj, true)
}

```

### 6.只读和浅只读

+ 当数据是只读的时候，如果用户尝试去修改或删除时，都应该弹出警告且拒绝该操作。因此需要对set和delete代理进行修改。代码如下：

```javascript
function createReactive(obj, isShallow = false, isReadonly = false) {
  return new Proxy(obj, {
    get(target, key, reciver) {
      const res = Reflect.get(target, key, reciver)
       // 同样当不是只读的情况下才为其添加响应式
      if(!isReadonly) {
        track(target, key)
      }
      // 浅响应式直接返回
      if(isShallow) {
        return res
      }
      // 深响应式继续对对象做深入的响应式
      if(typeof res === 'object' && res !== null) {
         return isReadonly ? readonly(res) : reactive(res)
        // return reactive(res)
      }
      return res
    },
    set(target, key, value, reciver) {
      /* 省略其他操作, 只加入只读的判断 */
      if(isReadonly) {
        console.warn(`属性${key}是只读的`)
        return true
      }
    },
    deleteProperty(targrt, key) {
      /* 省略其他操作, 只加入只读的判断 */
      if(isReadonly) {
        console.warn(`属性${key}是只读的`)
        return true
      }
    }
  })
}
function readonly(obj) {
  return createReactive(obj, false, true)
}
function shallowReadonly(obj) {
  // 因为浅层本身就只有一层，所以不需要深度判断
  return createReactive(obj, true/*shallow*/, true)
}
```

### 7. 代理数组

+ 数组属于异质对象，在前面有讲过异质对象和常规对象的区别。因为数组对象的`[[DefineOwnProperty]]`内部方法和常规对象不同，其他和常规对象的内部方法一致
  因此当实现数组的代理时。用于代理常规对象的大部分代码是可以继续使用的

+ 数组和常规对象读取存在的差异
  + 通过索引访问数组元素：arr[0]
  + 访问数组长度:arr.length
  + 把数组最为对象，使用for...in遍历
  + 使用for...of 迭代遍历
  + 数组的原型方法：concat/join/every/some/finnd/findIndex/includes等，以及其他所有不改变原数组的原型方法

+ 数组和常规对象元素和属性的设置差异
  + 通过索引修改：arr[0] = 1
  + 数组长度:arr.length = 0
  + 数组的栈方法：push/shift/pop/unshift
  + 修改原数组的原型方法：splice/fill/sort等

#### 数组的索引与length

虽然通过索引的方式会执行数组对象所部署的内部方法[[Set]]，但是通过查阅ECMA规范，发现内部[[Set]]其实是依赖于[[DefineOwnProperty]]。规范中声明，当设置的索引值大于数组当前长度时，会将数组的长度设置为索引值+1。所以当通过索引设置属性值的时候，也可能会隐式的修改length的值，因此在触发响应时，也应该触发与length相关联的副作用函数。代码如下：

```javascript
set() {
// 通过原型上的方法判断属性是否存在，如果存在则是修改，不存在则是新增
// 新增对数组类型的判断
const type = Array.isArray(target) ? Number(proxy) < target.length ? 'SET' : 'ADD'                      : Object.prototype.hasOwnProperty.call(target, proxy) ? 'SET' : 'ADD'
}
trigger() {
  // 新增数组判断，添加length属性对应的副作用函数
  if(type === TriggerType.ADD && Array.isArray(target)) {
    const lengthEffectfn = depsMap.get('length')
    lengthEffectfn && lengthEffectfn.forEach(fn => {
      if(fn !== activeEffect) {
        effectsToRun.add(fn)
      }
    })
  }
}

```
这是数据影响数组长度，反过来，数组长度也会影响数据。当把数组的长度设置为小于当前长度时，超出长度的数据就会被删除，这里也需要触发副作用函数。而设置的长度如果大于当前长度，则不会对数据产生影响，进而不需要触发副作用函数。

```javascript
set() {
  // 省略其他代码
  if(receiver.raw === target) {
    if( oldVal !== value && (oldVal === oldVal || value === value)) {
      // 新增第四个参数，要触发响应式的新值
      trigger(target, proxy, type, newVal)
    }
  }
}
trigger(target, proxy, type, newVal) {
    // 省略其他代码
    if(Array.isArray(target) && proxy === 'length') {
    // 对于索引大于或等于新的length的元素
    // 需要把其对应的副作用函数加入到effectsToRun中去执行
    depsMap.forEach((effects, key) => {
      if(key >= newVal) {
        effects.forEach(fn => {
          if(fn !== activeEffect) {
            effectsToRun.add(fn)
          }
        })
      }
    })
  }
}

```

#### 遍历数组

todo

#### 数组的查找方法

todo

#### 隐式修改数组长度的原型方法

todo

### 代理set和map

    set和map的代理不同于普通的对象

+ set结构的方法：size、add、clear、delete、has、keys、values、entries、forEach。
+ map结构的方法：size、clear、delete、has、get、set、keys、values、entries、forEach。

size
因为set的size是访问器属性
```javascript
cosnt s = new Set([1,2,3])
const p = new Proxy(s,{
  get(target,key,receiver){
    if(key=='size'){
      // 如果读取的是size属性
      // 通过指定第三个参数receiver为原始对象， 这样就会访问到的size属性就会存在，this指向的是原始Set,而非代理对象
      return Reflect.get(target,key, target)
    }
  // 其他属性默认
  return Reflect.get(target,key,receiver)
  }
})
console.log(s.size) //3
```

Set的delete方法
size时一个访问器属性，而delete是一个方法

```javascript
// 集合Set的部分功能重写 
const mutableInstrumentations = {
  // 当调用add时要触发响应式，首先要有add函数，这样才能在里面触发，因此需要重写一下add函数
  add(key) {
    // 由于是代理对象调用的add方法，所以this指向代理对象，通过raw属性拿到原始对象
    const target = this.raw
    // 在原始对象上执行add函数操作
    const res = target.add(key)
    // 触发副作用函数，为ADD操作
    trigger(target, key, 'ADD')
    // 返回结果
    return res
  },
  delete(key) {
    // 先获取原对象
    const target = this.raw
    // 判断集合中有没有要删除的元素
    const isHave = target.has(key)
    // 删除
    const res = target.delete(key)
    // 如果有要删除的元素，则触发响应式
    if(isHave) {
      trigger(target, key, 'DELETE')
    }
    // 返回结果
    return res
  }


}

function createReactive(obj, isShallow=false, isReadonly=false) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      if(key === 'raw') {
        return target
      }
      if(key === 'size') {
        // 至于这里为什么建立的是target与ITERATE_KEY的联系，因为任何新增、删除操作都会影响size属性，这里需要与前面的for循环联系一下。
        track(target, ITERATE_KEY)
        return Reflect.get(target, key, target)
      }
      // 返回定义的方法
      return mutableInstrumentations[key]
    }
  })
}

```

### 避免污染原始数据

和上面一样同样是要重写set和get方法

```javascript
mutableInstrumentations= {
  get(key) {
  // 拿原始对象
  const target = this.raw
  // 判断当前的key是否存在
  const isHave = target.has(key)
  // 追踪依赖，建立连接
  track(target, key)
  // 如果存在，先拿到该value
  // 如果value是对象，则需要深度响应式，否则直接返回
  if(isHave) {
    const res = target.get(key)
    return typeof res === 'object' ? reactive(res) : res
  }
},
set(key, value) {
  const target = this.raw
  const isHave = target.has(key)
  // 先拿到旧值
  const oldVal = target.get(key)
  // 添加响应式数据判断
// 在设置之前判断value是不是一个响应式，如果是，则获取其raw属性，也就是响应式的原始数据设置到原始数据上；不是则直接设置上去
// 这里就是避免污染原始数据的操作
  const newVal = value.raw || value
  // 设置新值
  target.set(key, newVal)
  // 如果不存在key，则说明是新增，执行ADD操作
  // 否则说明是修改，且如果新值与旧值不一样才执行，且规避了NAN
  if(!isHave) {
    trigger(target, key, 'ADD')
  } else if(oldVal !== value || (oldVal === oldVal && value === value)) {
    trigger(target, key, 'SET')
  }
}

}
```

### 处理forEach

todu

### 迭代器的方法

tudo

### values和keys的方法
todo

### 第五章总结

介绍了 vue.js3的响应式是基于Proxy实现的，Proxy可以为其对象创建一个代理对象。`所谓代理指的是对一个对象的基本语义的代理。`
允许我们拦截并重新定义对一个对象的基本操作。
并且Reflect可以处理代理过程中遇到访问器属性this的指向问题，指定正确的receiver来解决。

异质对象+常规对象

讨论了对象Object的代理，代理对象的本质就是要查阅规范，找出可拦截的基本操作的方法。有些操作是复合操作，需要找到依赖的基本操作再进行拦截来处理复合操作。

ITERATE_KEY来收集for...in的副总用函数

处理NaN===NaN永远是false，原型链上市属性导致副作用函数2次执行问题

。。。

## 三、原始值的响应式方案

原始值指：Boolean,Number,BigInt,String,Symbol,undefined,null等类型的值（核心就是按值传递，而非按引用传递的值）

### 1.引入ref的概念

+ JavaScript中的Proxy无法提供对原始值的代理。因此想要将原始值变成响应式数据，就必须做一层包裹，也就是ref

```javascript
function ref(val){
	const wrapper = {
		value: val
	}
  // 区分是原始值响应式对象还是非原始值响应对象
	// 使用Object.defineProperty在wrapper对象上定义一个不可枚举的属性_v_isRef，并且值为true
	Object.defineProperty(wrapper,'_v_isRef', {
		value: true
	})
	return reactive(wrapper)
}

```

### 2. 响应丢失问题

- toRef
- toRefs

问题
```javascript
<template>
	<p>{{foo}} / {{bar}}</p>
</template>

export default{
	setup(){
		// 响应式数据
		const obj = reactive({foo:1, bar:2})
		// 将数据暴露到模板中
		return {
			...obj
		}
	}
}

// 展开运算符(…)导致的响应丢失
```

解决

```javascript

function toRef(obj, key){
	const wrapper = {
		get value(){
			return obj[key]
		}
	}
	Object.defineProperty(wrapper, '_v_isRef',{
		value: true
	})
	return wrapper
}

const newObj = {
	foo: toRef(obj,'foo'),
	bar: toRef(obj,'bar')
}


function toRefs(obj){
	const ret = {}
	// 使用for...in循环遍历对象
	for(const key in obj){
		ret[key] = toRef(obj,key)
	}
	return ret
}
const newObj = {...toRefs(obj)}

// 测试
const obj = reactive({foo:1, bar:2})

const newObj = {...toRefs(obj)} 
console.log(newObj.foo.value)  //1
console.log(newObj.bar.value) //2

```

### 3. 自动脱ref
    
    toRefs函数解决了响应丢失的问题，同时也带来新的问题。由于toRefs会把响应式数据的第一层属性值转换为ref，因此必须通过value属性访问值，这样增加了用户的心智负担，因为通常情况下用户是在模板中访问数据的，用户肯定不希望编写下面这样的代码

```javascript
function proxyRefs(target){
	return new Proxy(target,{
		get(target,key,receiver){
			const value = Reflect(target,key,receiver)
			// 自动脱ref实现，如果读取的值是ref,则返回它的value属性值
			return value._v_isRef?value.value:value
		}
		set(target, key, newValue, receiver){
			// 通过target读取真实值
			const value = target[key]
			// 如果值是Ref,则设置其对应的value属性值
			if(value._v_isRef){
				value.value = newValue
				return true
			}
			return Reflect.set(target, key, newValue, receiver)
		}
	})
}


// 调用proxyRefs函数创建代理
const newObj = proxyRefs({...toRefs(obj)})

console.log(newObj.foo) //1
console.log(newObj.bar) //2
```

+ 实际上，在编写Vue.js组件时，组件中的setup函数返回的数据会传递给proxyRefs函数进行处理：


## 参考文档

+ 霍春阳的《vue.js 设计与实现》
