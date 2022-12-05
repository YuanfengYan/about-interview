# Vue3设计与实现1/6

## 第一篇：框架的设计概览

## 一、权衡的艺术

  + 命令式（jquery）\ 声明式(vue)
  + 命令式的性能消耗 =  直接修改的性能消耗
  + 声明式的性能消耗 = 找出差异的性能消耗 + 直接修改的性能消耗  
  + 可维护性、心智负担 ： 命令式 <  声明式
  + DOM的运算与JavaScript的运算性能消耗远不在一个层级，DOM的性能消耗要高
  + vue三种模式：编译时，运行时，编译时+运行时

## 二、框架设计的核心要素

### 1. 提升用户的开发体验

+ Console->Enable custom formatters
+ warn 的友好使用提示

### 2. 控制框架代码的体积

+ `_DEV_`进行区分环境

### 3. 框架要做到良好的 Tree-Shaking

+ `/*#__PURE__*/`告诉打包工具，该函数不会产生副作用
+ rollup.js, webpack(如 terser)
+ 一般都是顶级调用的函数上会使用 `/*#__PURE__*/`

### 4. 框架应该输出怎样的构建产物

+ IIFE(immediately Invoked Function Expression)用于`<script src='xxx'></script> 引入` -- vue.global.js
+ esm:esm-browser 用于浏览器中`<script type="module" src="xxx"></script>`引入 -- vue.esm-browser.js
+ esm:esm-bundler 用于webpack,rollup.js这些打包工具使用的
+ cjs:用于node.js的环境中运行
+ 在-bundler `_DEV_` => `process.env.NODE_ENV!='production'`

### 5. 特性开关

+ `__VUE_OPTION_API__`开关来关闭是否兼容Vue2的选项式Api的写法。从而减小资源体积

### 6. 错误处理

+ callWithErrorHandling=>app.config.errorHander 注册统一的错误处理函数

+ 用户可以注册错误处理程序

```javascript
// utils.js
let handleError = null
export default {
    foo(fn) {
        callWithErrorHandling(fn)
    },
    registerErrorHandler(fn) {
        handleError = fn
    }
}
 
function callWithErrorHandling(fn){
  try{
    fn&&fn()
  }catch(err){
    handlerError()
  }
}
// 使用
import utils from 'utils.js'
utils.registerErrorHandler((e)=>{
  console.log(e)
})
utils.foo(()=>{})
```

### 7.良好的TS类型支持

## 三、Vue3的设计思路

### 1. 声明式描述UI

有两种方式:

+ 模版

```javascript
<div id="add" :title="title" @click="handle">
    <span></span>
</div>
```

+ JS对象

```javascript
// 其实就是描述虚拟DOM
const title = {
    tag: 'h1',
    props: {
        onClick: handler
    },
    children: [
        {
            tag: 'span'
        }
    ]
}
// 
import { h } from 'vue'
export default {
    render() {
        // h函数返回的是对象
        return h('h1', { onClick: handler }) // 虚拟DOM
    }
}
```

### 2. 初识渲染器

渲染器的作用就是 调用DOM的API把虚拟Dom渲染为真实的Dom

- 总体是三步：

```
1. 创建元素 如： documment.crateElement(vnode.tag)
2. 为元素添加属性和事件 如： el.addEventListener('click',fn)
3. 处理children
```

+ 后续篇章会介绍在变更内容时，不需要重新完整走一遍

### 3. 组件本质

+ **本质：组件就是一组DOM元素的封装**

```javascript
// 组件
const MyComponent = function() {
    return {
        tag: 'div',
        props: {
            onClick: () => alert('hello')
        },
        children: 'click me'
    }
}
// 用虚拟DOM中的tag来存储组件函数
const vnode  = {
  tag:MyComponent
}
// 在rennder函数中处理 区分tag类型是字符串还是function
function render(vnode,container){
  if(typeof vnode.tag === 'string'){
    // 说明是标签元素
    mountElemment(vnode,container)
  }else if(typeof vnode.tag === 'function'){//当然这里可以扩展不一定是function组件
    // 说明是组件
    conts subtree = vnode.tag()
    rennder(subtree,container)//递归调用
  }
}
```

### 4. 模版的工作原理

模版通过编译器， 编译为 渲染函数

```vue
<template>
    <div @click="handler">
        click me
    </div>
</template>
<script>
    export default {
        data() {},
        methods: {}
    }
</script>
<!-- 编译器会将<template>标签里的内容， 编译成渲染函数并添加到 <script>标签块的组件对象上 -->
<script>
    export default {
        data() {},
        methods: {},
        render() {
            return h('div', { onClick: handler }, 'click me')
        }
    }
</script>
<!-- 组件（使用模版 或者 手写渲染函数）要渲染的内容都是通过渲染函数产生的，渲染器再把渲染函数返回的虚拟DOM渲染为真实DOM. -->
```

### 5. Vue.js是各个模块组成的有机整体

+ 模版通过编译器，编译为渲染函数。这过程中， 会标记哪些是静态属性，哪些是动态属性，把这些信息附加到生成的渲染函数中，让渲染器省去寻早变更点的工作，提升性能
+ 编译器和渲染器都是Vue.js的核心组成部分

## 参考文档

+ 霍春阳的《vue.js 设计与实现》
