# Vue3摘要

##  一、Vue3 里为什么要用 Proxy API 替代 defineProperty API？

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


##  二. Vue3.0 编译做了哪些优化？效率提升?（底层，源码）？

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
    
5、动态绑定标记 PatchFlag
  
  在编译阶段，分析模板并提取有用信息，最终体现在 vdom 树上。例如它能够清楚的知道：哪些节点是动态节点，以及为什么它是动态的(是绑定了动态的 class？还是绑定了动态的 style？亦或是其它动态的属性？)
  总之编译器能够提取我们想要的信息，有了这些信息我们就可以在创建 vnode 的过程中为动态的节点打上标记：也就是传说中的 PatchFlags。

  配合Block tree到靶向更新

...

## 三、Vue3新特性？

+ **使用上**

  + **组合式api**

  + **Teleport 挂载到对应的UI DOM节点,并保持创建初期Teleport所作为的逻辑子组件**
        ```html
        <Teleport to="body">
        需要传送到body下面的内容
        </Teleport>
        ```

  + 片段 （鸡肋）

  + **语法糖** 单文件组件 (script setup)

      非兼容变更

  + **v-model 替代 原先的v-model.sync**(v-bind.sync) <==> </input :modelValue="t" @update:modelValue = 't= $event' > 
    + 原先的v-model 等价于  </input :modelValue="t" @input:modelValue = 't= $event' > 
    + 现在v-model等价于原先的v-model.sync等价于  </input :modelValue="t" @update:modelValue = 't= $event' >  
    + [参考链接-Vue3中v-model的使用](https://juejin.cn/post/6914946160037724174)

  + **key** </template v-for> 的 key 应该设置在 < template > 标签上 (而不是设置在它的子节点上)。 

    ``` html
          <!-- Vue 2.x -->
    <template v-for="item in list">
      <div :key="item.id">...</div>
      <span :key="item.id">...</span>
    </template>
    <!-- Vue 3.x -->
    <template v-for="item in list" :key="item.id">
      <div>...</div>
      <span>...</span>
    </template>
    ```

  + **2.x 版本中在一个元素上同时使用 v-if 和 v-for 时，v-for 会优先作用  /  3.x 版本中 v-if 总是优先于 v-for 生效。**

  + **v-bind 合并行为 v-bind 的绑定顺序会影响渲染结果**

  + 新增context.emit，与this.$emit（vue3中只能在方法里使用）作用相同

  + **Vue3中的属性绑定**
  
      + 默认所有属性都绑定到根元素
      + 使用inheritAttrs: false可以取消默认绑定
      + 使用attrs或者context.attrs获取所有属性
      + 使用v-bing="$attrs"批量绑定属性
      + 使用 const {size, level, …rest} = context.attrs 将属性分开
      + props和attrs的区别:
        + 1、props要先声明才能取值，attrs不用先声明
        + 2、props不包含事件，attrs包含
        + 3、props没有声明的属性，会跑到attrs里
        + 4、props支持string以外类型，attrs只有string类型

    + slot具名插槽的使用(v2.6.0开始)[参考链接](https://www.jianshu.com/p/0d54f6a65fda)
      ```html
      vue2
      <!-- 子组件 -->
      <slot name="title">
      <!-- 父组件 -->
      <template slot="title">
      <h1>哈哈哈</h1>
      </template>

      vue3
      <!-- 子组件用法不变 -->
      <!-- 父组件 -->
      <template v-slot:title>
      <h1>哈哈哈</h1>
      </template>
      ```

  + 

+ **本质原理**

    + **响应系统的变动**
      由原来的Object.defineProperty 的getter 和 setter，改变成为了ES2015 Proxy 作为其观察机制。
  Proxy的优势：消除了以前存在的警告，使速度加倍，并节省了一半的内存开销。

    + **虚拟DOM重写（Virtual DOM Rewrite）**
      虚拟 DOM 从头开始重写，我们可以期待更多的编译时提示来减少运行时开销。重写将包括更有效的代码来创建虚拟节点

    + **组件渲染的优化（优化插槽生成）**
      Vue2当中在父组件渲染同时，子组件也会渲染。 Vue3就可以单独渲染父组件、子组件。 

    + **静态树提升（Static Tree Hoisting）**
       使用静态树提升，这意味着 Vue 3 的编译器将能够检测到什么是静态组件，然后将其提升，从而降低了渲染成本。它将能够跳过未整个树结构打补丁的过程。

## 四、 为啥要有组合式api，有啥优点，区别于mixins...等？

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


**局部虚拟dom如何更新到真实dom中??**

  真实 DOM 的对象（HTMLElement 类型）是被记录到虚拟 DOM 对象中的，是它的一个属性（$options.el）。
  sel 元素选择器 
  data 元素属性 ●
  children 元素子节点 ●
  text 元素文本 ●
  elm 对应dom元素 ●
  key
### 5、Vue3 Reactivity响应式

## 六、Vue3

## 参考文档

+ [Justin3go的博客--/汇总分类/前端框架/](https://justin3go.com/%E6%B1%87%E6%80%BB%E5%88%86%E7%B1%BB/%E5%89%8D%E7%AB%AF%E6%A1%86%E6%9E%B6/)
+ [Vue3 Compiler 优化细节，如何手写高性能渲染函数](https://zhuanlan.zhihu.com/p/150732926)