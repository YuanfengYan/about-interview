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

1、静态提升

    Vue2.x : 无论元素是否参与更新，每次都会重新创建。
    Vue3.0 : 对不参与更新的元素，只会被创建一次，之后会在每次渲染时候被不停的复用

```javascript

<div class="user">
      {{userInfo.name}}
</div>
// 这里div是动态的；但是div的class属性是静态的 vue3这里直接是把他定义出来
**const histed={class:"user"}**
function render(){
    createVNode('div',**histed**,userInfo.name);
    //...
```

2、预字符串化

    vue3：当编译器遇到大量连续的静态内容，绘制节将其编译为一个普通字符串节点
    vue2会重新渲染虚拟节点，不管你是改变和不改变的都给你重新渲染 而vue3则是只重新创建动态的节点，而静态的改变数据时不会重新再去渲染，大大节省性能消耗 SSR(服务端渲染)里最明显

3、缓存事件处理

    vue3编译 【_cache缓存对象，编译的时候看一下这个缓存对象里面有没有这个函数，有的化就直接拿就不用再去创建，没有的化创建函数在赋值给缓存对象，大大节省性能消耗】

4、Block tree

    vue2在对比新旧树的时候，并不知道那些节点是静态的，那些是动态的，因此只能一层一层比较，这就浪费了大部分事件在对比静态节点上
    vue3在对比的时候可以标记那些是动态节点，然后把这些动态节点放到根节点中，用一个数组记录这些动态节点，然后循环数组重新渲染这些，
    
5、PatchFlag

...


##  三、 Vue3新特性

+  组合式api

+  Teleport 挂载到对应的UI DOM节点,并保持创建初期Teleport所作为的逻辑子组件

+ 片段 （鸡肋）

+ 语法糖 单文件组件<script setup>

    非兼容变更

+ v-model 替代 原先的v-model.sync(v-bind.sync) <==> <input :modelValue="t" @update:modelValue = 't= $event' > 

+ key <template v-for> 的 key 应该设置在 <template> 标签上 (而不是设置在它的子节点上)。 

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