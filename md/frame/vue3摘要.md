# Vue3摘要

##  一、Vue3 里为什么要用 Proxy API 替代 defineProperty API

defineProperty :

    1、它只能针对单例属性做监听。
    2、对 data 中的属性做了遍历 + 递归，为每个属性设置了 getter、setter ---- 对于深层对象需要深度遍历比较消耗性能
    3、Vue 只能对 data 中预定义过的属性做出响应的原因   ---- 添加一个预先不存在的对象属性是无法做到setter监听
    4、因为defineProperty自身的缺陷(数组的length属性是不能添加getter和setter,)，导致Vue2在实现响应式过程需要实现其他的方法辅助（如重写数组方法、增加额外set、delete方法）

Proxy :

    1、监听是针对一个对象的
    2、代理一个对象，就能监听这个对象的所以属性变化（并不能监听到对象内部深层次的属性变化） 
    3、因为第2点：在 getter 中去递归响应式 这样的好处是真正访问到的内部属性才会变成响应式，------ 按需实现响应式，减少性能消耗。
    4、Proxy可以直接监听数组的变化


##  二. Vue3.0 编译做了哪些优化？效率提升?（底层，源码） 

[Vue3 编译中的优化](https://www.jianshu.com/p/b87d532afeba)

1、静态提升

    Vue2.x : 无论元素是否参与更新，每次都会重新创建。
    Vue3.0 : 对不参与更新的元素，只会被创建一次，之后会在每次渲染时候被不停的复用。避免重新创建对象，然后扔掉（垃圾回收相关的知识）

包含 ： 静态节点提升，静态属性提升， 预字符串话
```javascript

<div class="user">
      {{userInfo.name}}
</div>
// 这里div是动态的；但是div的class属性是静态的 vue3这里直接是把他定义出来
const histed={class:"user"}
function render(){
    createVNode('div',histed,userInfo.name);
    //...
```

2、预字符串化 属于（静态优化）

    vue3：当编译器遇到大量连续的静态内容，绘制节将其编译为一个普通字符串节点
    vue2会重新渲染虚拟节点，不管你是改变和不改变的都给你重新渲染 而vue3则是只重新创建动态的节点，而静态的改变数据时不会重新再去渲染，大大节省性能消耗 SSR(服务端渲染)里最明显


3、缓存事件处理

    vue3编译 【_cache缓存对象，编译的时候看一下这个缓存对象里面有没有这个函数，有的化就直接拿就不用再去创建，没有的化创建函数在赋值给缓存对象，大大节省性能消耗】

4、Block tree

    vue2在对比新旧树的时候，并不知道那些节点是静态的，那些是动态的，因此只能一层一层比较，这就浪费了大部分事件在对比静态节点上
    vue3在对比的时候可以标记那些是动态节点，然后把这些动态节点放到根节点中，用一个数组记录这些动态节点，然后循环数组重新渲染这些，
    
5、PatchFlag

...

## 三、Vue3新特性

+ 组合式api

+ Teleport 挂载到对应的UI DOM节点,并保持创建初期Teleport所作为的逻辑子组件

+ 片段 （鸡肋）

+ 语法糖 单文件组件 (script setup)

    非兼容变更

+ v-model 替代 原先的v-model.sync(v-bind.sync) <==> </input :modelValue="t" @update:modelValue = 't= $event' > 

+ key </template v-for> 的 key 应该设置在 </template> 标签上 (而不是设置在它的子节点上)。 

+ 2.x 版本中在一个元素上同时使用 v-if 和 v-for 时，v-for 会优先作用  /  3.x 版本中 v-if 总是优先于 v-for 生效。

+ v-bind 合并行为 v-bind 的绑定顺序会影响渲染结果

## 四、 为啥要有组合式api，有啥优点，区别于mixins...等

### 1、使用组合式api原因 及优点

+ 代码复用代码的抽离到单独的js

+ 能把逻辑关注点，集中到一个文件中进行抽离

+ 抽离代码的同时，代码不碎片化，可以将变量，函数集中在一起，减少分离掩盖的潜在逻辑问题

### 2、使用组合式api区别于mixins

- mixins其实只是option API(选项式API)混入，容易导致命名冲突覆盖，vs 组合API不用担心命名冲突

- mixin所有的选项都会被暴露 vs 组合API可以选择性的暴露方法，变量

### 3、主要事项

+ 执行setup函数的时候，还没有执行beforeCreate生命周期方法，所以无法使用data,methods，所以this指向的是undefined

+ setup函数只能是同步的，不能是异步的

+ 可以和option API(选项式API)混用，因为Compositon API（组合式API）本质只是注入API

+ Vue3中清空Reactive定义的数组 必须通过arr.length = 0的方式清空数组或者arr.splice(0, arr.length)，不能直接让它等于[]或重新声明
  

## 五、Vue3是如何运行的？

### 1、三个核心模块

+ **Reactive Module**

    跟踪、观察变化并作出相应的改变

+ **Compiler Module**

    获取HTML模板并将它们编译成渲染函数
    浏览器可以只接收渲染函数

+ **Render Module**

    Render Phase 渲染阶段
    Mount Phase 挂载阶段
    Patch Phase 比较阶段

### 2、运行流程

1. 编译模块---将HTML编译转化为 render渲染函数
2. 响应式模块---初始化响应式对象
3. 执行render渲染函数（返回虚拟DOM），同时在执行render中引用响应式对象，进行观察后续响应对象的变化
4. 挂载阶段将上一步拿到的虚拟DOM节点创建web界面
5. 后续当观察到第三步引用的响应对象发生变化，会执行对应的render函数。创建一个新的虚拟DOM节点，并将新旧的虚拟DOM节点发送到补丁函数中，按需更新web界面


### 3、编译器模块

**Vue3 编译模块的优化**  前面已经提到↑

### 4、虚拟DOM

 **虚拟DOM层的一些好处**

- 它让组件的渲染逻辑完全从真实DOM中解耦
- 更直接地去重用框架的运行在其他环境中
- Vue运行第三方开发人员创建自定义渲染解决方案，目标不仅仅是浏览器，也包括IOS和Android等原生环境
- 也可以使用API创建自定义渲染器直接渲染到WebGL,而不是DOM节点
- 提供了以编程方式构造、检查、克隆以及操作所需的DOM操作的能力

### 5、Vue3 Reactivity响应式



## 参考文档

+ [Justin3go的博客--/汇总分类/前端框架/](https://justin3go.com/%E6%B1%87%E6%80%BB%E5%88%86%E7%B1%BB/%E5%89%8D%E7%AB%AF%E6%A1%86%E6%9E%B6/)