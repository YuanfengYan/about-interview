# Vue2，Vue3面试

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
    + 原先的v-model 等价于  </input :value="t" @input:value = 't= $event' > 
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

    ```javascript
      ///vue 2 无论怎样独立的attribute 覆盖 v-bind绑定的attribute属性
        <div class="A" :v-bind="{class: 'B'}"></div>
      =><div class="A"></div>
      //vue3 无论怎样后面的覆盖前面的同名属性
       <div class="A" :v-bind="{class: 'B'}"></div>
       =><div class="B"></div>
       <div :v-bind="{class: 'B'}" class="A" ></div>
       <div class="A"></div>

    ```

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

    - 带有插槽的组件在父组件中使用，如何拿到该组件里的值==》例如：在改组件中的slot标签定义属性值 item="xxx"，在父组件中使用时 <template v-slot:default="defaultSlot" / > 然后在对应template标签下使用defaultSlot.item这个值

    - 上一条中defaultSlot也可以解构slot中的属性值 <template v-slot:default="{item}" / > 或者别名 <template v-slot:default="{item:todo}" / > 或者缩写 <template #default="{item}" / >



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

## 六、 如何制作vue插件？ 以及vue2和3有什么写法区别？
    首先vue插件功能分类：

  - 添加全局方法或者 property。如：vue-custom-element

  - 添加全局资源：指令/过渡等。如：vue-touch）

  - 通过全局 mixin 来添加一些组件选项。(如vue-router)

  - 添加全局实例方法，通过把它们添加到 config.globalProperties 上实现。

  - 一个库，提供自己的 API，同时提供上面提到的一个或多个功能。如 vue-router

区别：

    use(plugin)自动调用install函数时
    vue2: 自动传入Vue实例
    vue3: 自动传入App应用实例

    定义全局访问
    vue2: Vue.prototype.$plugin
    vue3: app.config.globalProperties.$plugin

    挂载组件
    vue2: Vue.extend(plugin) + 构造器实例化 + 挂载
    vue3: createApp(plugin) + 挂载



vue2

```javascript
MyPlugin.install = function (Vue, options) {
  // 1. 添加全局方法或属性
  Vue.myGlobalMethod = function () {
    // 逻辑...
  }

  // 2. 添加全局资源
  Vue.directive('my-directive', {
    bind (el, binding, vnode, oldVnode) {
      // 逻辑...
    }
    ...
  })

  // 3. 注入组件
  Vue.mixin({
    created: function () {
      // 逻辑...
    }
    ...
  })

  // 4. 添加实例方法
  Vue.prototype.$myMethod = function (methodOptions) {
    // 逻辑...
  }
}
// 调用 `MyPlugin.install(Vue)`
Vue.use(MyPlugin)

new Vue({
  //... options
})

```

vue3

```javascript
MyPlugin.install = function (app, options) {
  // 2. 添加全局资源 指令
  app.directive('my-directive', {
    // 在绑定元素的 attribute 或事件监听器被应用之前调用
    created(...arg) {
      console.log(arg)
    },
    // 在绑定元素的父组件挂载之前调用
    beforeMount() {},
    // 在绑定元素的父组件挂载之后调用
    mounted(el,binding,vnode) {
    },
    // 在包含组件的 VNode 更新之前调用
    beforeUpdate() {},
    // 在包含组件的 VNode 及其子组件的 VNode 更新之后调用
    updated() {},
    // 在绑定元素的父组件卸载之前调用
    beforeUnmount() {},
    // 在绑定元素的父组件卸载之后调用
    unmounted() {}
    })
  })
  //3、定义全局
  app.config.globalProperties.$plugin = instance;
}

```

## 七、VUE的生命周期及理解？

  总共分为8个阶段，具体为：创建前/后，载入前/后，更新前/后，销毁前/后。

  - 创建前/后： 在beforeCreated阶段：vue实例的挂载元素$el和数据对象data都为undefined，还未初始化；在created阶段，vue实例的数据对象data有了，$el还没有。
  - 载入前/后：在beforeMount阶段，vue实例的$el和data都初始化了，但还是挂载之前为虚拟的dom节点，data.message还未替换；在mounted阶段，vue实例挂载完成，data.message成功渲染。
  - 更新前/后：当data变化时，会触发beforeUpdate和updated方法。
  - 销毁前/后：在执行destroy方法后，对data的改变不会再触发周期函数，说明此时vue实例已经解除了事件监听以及和dom的绑定，但是dom结构依然存在。


## 八、性能优化方案？

- v-memo v-once
- v-if/ v-show
- keep-alive 使常用组件进行缓存，减少组件创建与卸载，提高响应速度与资源利用

```javascript
<KeepAlive :include="/a|b/"> <!-- 表示仅缓存name为a或b的组件 -->
  <component :is="view" />
</KeepAlive>

```
- provide和inject 如果可以 代替 Vuex
- 善用异步加载 defineAsyncComponent

```javascript
import { defineAsyncComponent } from 'vue'

export default {
  // ...
  components: {
    AsyncComponent: defineAsyncComponent(() =>
      import('./components/AsyncComponent.vue')
    )
  }
}

```

- 列表虚拟化 [vue-virtual-scroller](https://github.com/Akryum/vue-virtual-scroller)、[vue-virtual-scroll-grid](https://github.com/rocwang/vue-virtual-scroll-grid)。

- toRaw 做一些不想被监听的事情(提升性能)

- 仅传递必要的数据

- 减少大型不可变结构的反应性开销，灵活运用shallowRef()和shallowReactive()来创建浅反应式数据。

- 避免内存泄漏
  - 避免意外的全局变量
  - 避免使用不当的闭包
  - 及时清除定时器与不用的数据，一般会在unMounted中执行

[参考文档-Vue性能优化方案——个人经验总结](https://blog.csdn.net/qq_41176306/article/details/124650401)

## 九、reactive和ref的区别 以及对应的 shallowRef 与shallowReactive （创建非递归响应对象）

[参考文档-Vue3.0中Ref与Reactive的区别是什么](https://www.yisu.com/zixun/604877.html)

1. Ref的本质是通过Reactive创建的，Ref(10)=>Reactive({value:10});

2. Reactive的本质是将每一层的数都解析成proxy对象，Reactive 的响应式默认都是递归的，改变某一层的值都会递归的调用一遍，重新渲染dom。

3. ref和reactive都为递归监听


+ shallowRef与shallowReactive

1. shallowRef 与shallowReactive创建的是非递归的响应对象，shallowReactive创建的数据第一层数据改变会重新渲染dom

2. 通过shallowRef创建的响应式对象，需要修改整个value才能重新渲染dom

```javascript
var state = shallowRef({
   a:'a',
    gf:{
       b:'b',
       f:{
          c:'c',
          s:{d:'d'}
       }
    }
})
state.value.a = 1//并不能重新渲染，shallowRef的原理也是通过shallowReactive({value:{}})创建的，要修改value才能重新渲染
// 方案一
state.value = {
    a:'1',
    gf:{
       b:'2',
       f:{
          c:'3',
          s:{d:'d'}
       }
    }
}
// 方案二
state.value.a = 1
triggerRef(state)

```

## 十、toRef、toRefs、toRaw

1. toRef、toRefs 

作用/场景：

  toRef 和 toRefs 可以用来复制 reactive 里面的属性然后转成 ref，而且它既保留了响应式，也保留了引用，也就是你从 reactive 复制过来的属性进行修改后，除了视图会更新，原有 ractive 里面对应的值也会跟着更新，如果你知道 浅拷贝 的话那么这个引用就很好理解了，它复制的其实就是引用 + 响应式 ref

  可以封装函数返回响应式属性，对象。可以理解为浅拷贝引用。

- [Vue3 理解 toRef 和 toRefs 的作用、用法、区别](https://blog.csdn.net/cookcyq__/article/details/121618833)
- [👍 彻底清楚搞懂toRef和toRefs是什么，也许你知道toRef和toRefs，一直有点蒙蔽，一直没搞懂它，看完这篇文章你彻底清楚](https://blog.csdn.net/qq_33323469/article/details/122121843)
  
1. toRaw

- toRaw
 	从Reactive或Ref中得到原始数据

  返回 reactive 或 readonly 代理的原始对象。这是一个“逃生舱”，可用于临时读取数据而无需承担代理访问/跟踪的开销，也可用于写入数据而避免触发更改。不建议保留对原始对象的持久引用。请谨慎使用。

  
- toRaw作用
 	做一些不想被监听的事情(提升性能)

  如在搜索框中,绑定了有个响应式变量searchValue,但是有个请求数据的方法不需要该变量的代理跟踪访问,这么在输入框输入该值时,不会一直触发该请求方法,直到点击按钮,才触发该方法

[参考文档-Vue3.0 toRaw函数和markRaw函数](https://www.jianshu.com/p/73fcbbc9b654)

## 十一、 vue3、vue2相关的api清单

### 1.vue3 api清单

1. 7个应用配置：errorHandler， warnHandler（只在开发环境）， globalProperties， optionMergeStrategies， performance， compilerOptions ，~~isCustomElement~~
2. 9个应用api: component, config, directive, mixin, mount ,provide, unmount, use , version
3. 14个全局api: createApp, h , defineComponent, defineAsyncComponent, defineCustomElement ,resolveComponent, resolveDynamicComponent,resolveDirective,withDirectives, createRenderer, nextTick, mergeProps, useCssModule, version
4. 选项：
   1. 7个Data选项：data,props,computed,methods,watch.emits,expose
   2. 2个Dom选项： template render
   3. 13个生命周期：2*（created,mounted,updated,unmounted）,actived, deactived,errorCaptured,renderTracked,renderTriggered,
   4. 2个选项/资源：components, directive
   5. 4个组合：mixins, extends,provide/inject, setup
   6. 3个杂项：name,inheritAttrs,complierOptions 
5. 9个实例属性：$data, $props, $el,$options,$praent,$root,$refs,$slots,$attrs
6. 4个实例方法：$watch , $emit , $forceUpdate , $nextTick
7. 15个指令
8. 3个特殊attribute: ref key is
9. 6个内置组件：component , transition , transition-group , keep-alive , slot, teleport
10. 响应性api
   1. 9个响应性基础api: ractive，readonly, isProxy , isReactive, isReadonly, toRaw, markRaw, shallowReactive, shallowReadyonly
   2. 8个Refs: ref, unref, toRef, toRefs, isRef, customRef, shallowRef, triggerRef
   3. 5个Computed与Watch:computed , watchEffect, watchPostEffect , watchSyncEffect, watch
   4. 3个Effect作用域API:用于库开发
11. 组合式API
    1. setup
    2. 生命周期钩子 OnX
    3. Provide / Inject
    4. getCurrentInstance


### 2.vue2 api清单

1. 9个全局配置 : 移除 ：silent devtools keyCodes productionTip 保留：optionMergeStrategies errorHandler  warnHandler performance q迁移：Vue.config.ignoredElements=》app.config.compilerOptions.isCustomElement
2. 12个全局 API：移除 Vue.extend Vue.set Vue.delete Vue.filter Vue.commplie Vue.observable 迁移至应用Api： nextTick directive mixin use component version
3. 选项
   1. 6个Data选项：data props computed methods watch . 移除： propsData
   2. 3个Dom选项： template render 。 移除：el renderError
   3. 11个生命周期：都保留只是destory =>unmounted。 v3新增： renderTracked,renderTriggered
   4. 3个选项/资源：directives components ； 移除： filters
   5. 4个选项/组合: mixins extends provide/inject 移除：praent  v3新增：setup
   6. 6个杂项： name inheritAttrs 移除：delimiters（用compilerOptions.delimiters替换） functional model comments (app.config.compilerOptions.comments)
4. 14个实例属性：$data, $props, $el,$options,$praent,$root,$refs,$slots,$attrs  移除：$children $scopedSlots $isServer $listeners
5. 11个实例方法： $watch  $emit , $forceUpdate , $nextTick  移除 ：$on，$off  $once $delete  $mount  $set
6. 14个指令： v3新增：v-memo 移除: v-is
7. 6个特殊attribute: key ref is 移除：slot  slot-scope   scope
8. 5个内置的组件： component  transition  transition-group  keep-alive  slot  v3新增： teleport

## 十二、VUE3中watch与watchEffect

watch与 watchEffect 比较允许我们：

- 懒执行副作用；
- 更具体地说明什么状态应该触发侦听器重新运行；
- 访问侦听状态变化前后的值。

watchEffect的一些特点：

- 不需要手动传入依赖（不用指定监听对象）
- 无法获取原始值，只能获取更新后的值
- 立即执行（在onMounted前调用）
- 一些异步操作放里面更加的合适

功能：
1. 停止监听

2. 更改监听时机：

```javascript
  watchEffect(() => {
   console.log(count.value)
},{flush:"pre"}) //pre, post, sync
```

3. 清除副作用 onInvalidate

```javascript
  watchEffect((onInvalidate) => {
   console.log(count.value)
   onInvalidate(()=>{
      //会在重新运行时或者停止时先执行
      // 可以用来取消一些异步请求事件
   })
},{flush:"pre"}) //pre, post, sync
```

4. 侦听器调试 onTrack 和 onTrigger 选项可用于调试侦听器的行为。

[参考文档-VUE3中watch与watchEffect](https://blog.csdn.net/m0_51969330/article/details/123673334)

## 十四、vue中写过高阶组件么？举个例子怎么实现

1. 什么是高阶组件：

  一个函数接受一个组件为参数，返回一个包装后的组件/ 接受一个组件并返回一个组件，这个组件具有原组件的功能，并拥有了新自定义的功能。
  
  - 在 React 的世界里，高阶组件就是 f(Class) -> 新的Class。
  - Vue 的世界里，高阶组件就是 f(object) -> 新的object  (在 Vue 的世界里，组件是一个对象，所以高阶组件就是一个函数接受一个对象，返回一个新的包装好的对象。)

2. 高阶函数和mixin的选择：

  - 重用性。因为minxin对原组件具有侵入性，这会导致原来组件的可重用性降低，而高阶组件不会，高阶组件对原组件只是一个调用关系，并没有修改原来组件任何内容。

  - 可测试性。因为高阶组件只是一个嵌套关系，在组件测试的时候，可以单独的测试原始组件和高阶组件。

  - 层级问题。高阶组件也有他的弊端，如果你高阶组件嵌套层级太深，会导致出错的时候调试困难的问题，所以到底使用高阶组件和minxin需要看实际场景。

3. 高阶组件使用场景

  - 第三方ui框架组件二次封装：例如按钮点击的节流防抖 [参考链接](https://zhuanlan.zhihu.com/p/59939294)
  - 封装请求，逻辑处理到高阶组件中，渲染不同的ui木偶组件  即 异步请求状态管理进行封装到高阶组件  [参考链接](https://zhuanlan.zhihu.com/p/126552443)




## 参考文档

+ [Justin3go的博客--/汇总分类/前端框架/](https://justin3go.com/%E6%B1%87%E6%80%BB%E5%88%86%E7%B1%BB/%E5%89%8D%E7%AB%AF%E6%A1%86%E6%9E%B6/)
+ [Vue3 Compiler 优化细节，如何手写高性能渲染函数](https://zhuanlan.zhihu.com/p/150732926)
