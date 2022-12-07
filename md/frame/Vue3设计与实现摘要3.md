# Vue3设计与实现3/6

## 第三篇、渲染器

## 一、渲染器的设计

    渲染器的实现直接影响框架的性能

### 1. 渲染器与响应系统的结合

    渲染器就是用来执行渲染任务的，渲染器不仅能够渲染真是DOM元素，还是框架跨平台能力的关键。

+ 利用响应系统，自动调用渲染器完成页面的渲染和更新。示例代码：

```javascript
function renderer(domString, container){
	container.innerHTML = domString
}
const count = ref(1)
effect(()=>{
	renderer(`<h1>${count.value}</h1>`,document.getElementById('app'))
})

count.value++
// <h1>1</h1>
```

+ @vue/reactivity提供了IIFE模块格式，可以直接通过`<script>`的标签引入到页面使用：
  + `<script src="https://unpkg.com/@vue/reactive@3.0.5/dist/reactivity.global.js"><?script>`


```javascript
const {effect, ref} = VueReactivity
function renderer(domString, container){
	container.innerHTML = domString
}
const count = ref(1)
effect(()=>{
	renderer(`<h1>${count.value}</h1>`,document.getElementById('app'))
})
count.value++

```

### 2. 渲染器的基本概念

+ renderer: 渲染器
+ render: 动词-渲染
+ 渲染器的作用:  是把虚拟DOM渲染为特定平台的真实元素。在浏览器上，渲染器会把DOM渲染为真实DOM元素
+ 渲染器把虚拟DOM节点首次渲染成真实DOM节点的过程叫做<font color='red'>挂载</font>。
+ 渲染器就要将newVnode和上一次渲染的oldVnode进行比较，试图找到更新变更点。这个过程叫“打补丁”（或更新），英文用<font color='red'>patch</font>来表示
+ createReanderer: 创建并返回渲染器，包含了不仅是render方法，还有很多如：hydrate(服务端渲染用)
+ patch 

```javascript
// 参数n1表示 旧vnode
// 参数n2表示 新vnode
// 参数container表示 容器
function patch(n1,n2,container){
	//...
}

```

### 3. 自定义渲染器

    之所以要自定义渲染器，是为了使渲染器的核心不依赖与浏览器，将浏览器特定的API抽离

+ 代码demo

```javascript
function createRenderer(options){
	// 通过options得到操作DOM的API
	const{
		createElement,
		insert,
		setElementText
	} = options

	// 在这个作用域内定义的函数都可以访问那些API
  function mountElement(vnode, container){
    // 调用createElement函数创建元素
    const el = createElement(vnode.type)
    // 处理子节点，如果子节点是字符串，代表元素具有文本节点
    if(typeof vnode.children === 'string'){
      // 调用setElementText设置元素的文本节点
      setElement(el,vnode.children)
    }
    // 调用insert函数将元素插入到容器内
    insert(el,container)
  }
	function patch(n1, n2, container){
		// ...
	}
	function patch(n1, n2, container){
		// ...
	}
  function render(vnode,container){
    if(vnode){
      patch(container._vnode,vnode,container)
    }else{
      if(container._vnode){
        container.innerHTML = ''
      }
    }
    container._vnode = vnode
  }
	return {
		render
	}	
}

// 创建renderer时传入配置项
const renderer = createRenderer({
	// 用于创建元素
	createElement(tag){
		return document.createElement(tag)
	},
	// 用于设置元素的文本节点
	setElementText(el,text){
		el.textContent = text
	},
	// 用于在给定的parent下添加指定元素
	insert(el,parent,anchor = null){
		parent.insertBefore(el,anchor)
	}
})

```

+ createRenderer中传入Dom的APi方法（对应渲染平台的API）作为配置项。

## 二、挂载与更新

本章节的主要内容：

  + 如何挂载节点以及节点属性。 
  + 概念Html Attributes 和Dom Properties
  + 卸载操作不能单纯的使用innerHTML来清空容器元素：问题
    + 容器的内容可能有多个组件渲染，卸载时需要调用这些组件的beforeUnmount,unmounted等生命周期
    + 内容有元素存在自定义指令，卸载时要执行对应指令钩子函数
    + 使用innerHTML来清空，不会移除绑定在DOM元素上面的事件处理函数
  + 以vnode的纬度来完成卸载DOM
  + 渲染器在执行更新时，需要优先检测元素是否相同
  + 事件的处理：伪造invoker函数
  + 处理事件与更新时间问题，利用事件处理函数被绑定到DOMM元素的时间与事件触发时间之间的差异：需要屏蔽所有绑定时间晚于事件触发时间的事件处理函数的执行
  + 子节点的更新，定义了children属性只有三种类型
    + 字符串类型：代表元素具有文本节点
    + 数组类型：代表元素有一组子节点
    + null：代表元素没有子节点
  + 利用symbol类型唯一性，为文本节点和注释节点创建唯一标识，作为node.type属性的值
  + fragment及其用途

### 1. 挂载子节点和元素的属性


```javascript
const vnode = {
	type: 'div',
	// 使用props描述一个元素的属性
	props:{
		id: 'foo'
	},
	children: {
		{
			type: 'p',
			children: 'hello'
		}
	}
}

function mountElement(vnode, container){
	const el = createElement(vnode,type)
  // children处理
	if(typeof vnode.children === 'string'){
		setElementText(el, vnode, children)
	}else if(Array.isArray(vnode.children)){
		// 如果children是数组，就进行遍历，并调用patch函数来挂载它们
		vnode.children.forEach((child)=>{
			patch(null,child,el)
		})
	}
  // 如果 vnode.props存在才处理它
	if (vnode.props){
		// 遍历 vnode.props
		for(const key in vnode.props){
			// 调用 setAttribute 将属性设置到元素上 这里是存在缺陷的，在下面会介绍
			el.setAttribute(key, vnode.props[key])
		}
	}
	insert(el,container)
}

```

### 2.HTML Attributes 和 DOM Properties

+ HTML Attributes：是定义在HTML标签上的属性：例如
+ DOM Properties: 当浏览器解析这段HTML代码后，会创建一个与之相符的DOM元素对象，所以可以通过JavaScript代码来读取改DOM对象。对象上的属性就是DOM Properties

+ 很多HTML Attributes在DOM对象上有与之同名的DOM Properties,但也不尽相同
  + 例如：`<div class="foo"></div>`对应Properties 为el.className
  + `<div aria-valuenow="75"></div>`没有对应的对应Properties，反之亦然，Properties也存在不对应的Attributes
+ HTML Attributes的作用是设置与之对应的DOM Properties初始值


### 3. 正确地设置元素属性

- 对于普通的HTML文件来说，浏览器解析HTML代码后，会自动分析HTML Attribute并设置合适的DOM Properties。但是用户编写在 Vue.js的单文件组件中的模板不会被浏览器解析，也就是说，本来要浏览器完成的工作，现在需要框架来完成。

例如

```javascript
<button disabled>Buttons</button>
```

vnode

```javascript
const button = {
	type: 'button',
	props: {
		disabled: ''
	}
}
==>
el.setAttribute('disabled','')
==>
<button :disabled="false">Buttons</button>
// 用户的本意是不禁用，但是用过setAttribute设置后，按钮还是被禁用了
```

那么就需要特殊处理，即优先设置元素的DOM Properties，当其为空字符串时，手动将值矫正为true，

```javascript
function mountElement(vnode,container){
	const el = createElement(vnode,type)
	// 省略children的处理
	if(vnode.props){
		for(const key in vnode.props){
			// 用in操作符判断key是否存在对应的DOM Properties
			if(key in el){
				const type = typeof el[key]
				const value = vnode.props[key]
				// 如果是布尔类型，并且value是空字符串，则将值矫正为true
				if(type === 'boolean' && value === ''){
					el[key] = true
				}else{
					el[key] = value
				}
			}else{
				// 如果要设置的属性没有对应的DOM Properties,则使用setAttribute函数设置属性
				el.setAttribute(key, vnode.pops[key])
			}
		}
	}
	insert(el,container)
}

```

+ 上面在代码中，会检查每个vnode.props中的属性是否存在对应的DOM Properties 
  + 存在：则优先设置Dom Properites。当然并特殊处理布尔类型的Dom Properites
  + 不存在：使用setAttribute函数完成属性设置

当然还有许多类似需要特殊处理的情况，在《vue.js设计与实现》中还讲解了`<input/>`标签的form属性对应Dom Properites是el.form,但是是只读，
需要通过setAttribute进行特殊设置。
并抽离为一个方法shouldSetAsProps，来判断是否需要特殊处理
```javascript
function shouldSetAsProps(el,key,value){
	// 特殊情况，特殊处理
	if(key === 'form' && el.tagName === 'INPUT') return false
	// 兜底
	return key in el
}

function mountElement(vnode,container){
	const el = createElement(vnode,type)
	// 省略children的处理
	if(vnode.props){
		for(const key in vnode.props){
			
			const value = vnode.props[key]
			// 使用shouldSetAsProps来判断是否应该作为DOM Properties设置
			if(shouldSetAsProps(el,key,value)){
				const type = typeof el[key]
				if(type === 'boolean' && value === ''){
					el[key] = true
				}else{
					el[key] = value
				}
			}else{
				el.setAttribute(key, value)
			}
			
		}
	}
	insert(el,container)
}
```

+ 总而言之很多特殊处理的情况，都是经验之谈，在框架的不断迭代中去‘见招拆招’，才能使框架越来越强大

### 4. class的处理

上一节已经讲了如何正确处理vnode.props中定义的属性，设置到DOM元素上。需要对一些特殊情况进行处理
这里之所以讲一部分因为vue.js对class属性做了增强,下面是3中方式设置class

+ 1.指定class为一个字符串值

```javascript
<p class="foo bar"></p>
// 对应vnode
const vnode = {
	type: 'p',
	props: {
		class: 'foo bar'
	}
}

```

+ 2.指定class为一个对象值

```javascript
const cls = {foo:true, bar:false}
<p :class="cls"></p>
// 对应vnode
const vnode = {
	type: 'p',
	props: {
		class: {foo:true, bar:false}
	}
}

```

+ 3.class是包含上面两种情况的数组

```javascript
<p :class="arr"></p>
const arr = [
	// 字符串
	'foo bar',
	{
		baz: true
	}
]
// 对应vnode
const vnode = {
	type: 'p',
	props: {
		class: [
			'foo bar',
			{ baz: true }
		]
	}
}
```

正因为class的值是多种类型的，所以必须在设置元素的class之前将值转化为统一的字符串形式,再把改字符串作为元素的class值去设置。因此需要通过封装一个normalizeClass函数。

```javascript
const vnode = {
	type: 'p',
	props: {
		// 通过normalizeClass进行序列化
		class: normalizeClass([
			'foo bar',
			{baz:true}	
		])
	}
}

```

+ 浏览器中为一个元素设置class有三种方式，即setAttribute,el.className和el.classList，

通过性能分析比较：el.className进行设置性能最优

```javascript
const renderer = createRenderer({
	// 省略其他选项
	
	patchPros(el,key,preValue,nextValue){
		if(key==='class'){
			el.className = nextValu || ''
		}else if(shouldSetAsProps(el,key,nextValue)){
			const type = typeof el[key]
			if(type === 'boolean' && nextValue=== ''){
				el[key] = true
			}else{
				el[key] = nextValue
			}
		}else{
			el.setAttribute(key, nextValue)
		}
	}
})

```

+ 通过对class的处理，可以看到vnode.props对象中定义的属性值的类型并不总是和DOM元素属性的数据结构保持一致，这取决于上层API的设计

### 5. 卸载操作

+ 正确地卸载方式是：根据vnode对象获取与其相关联的真实DOM元素，然后使用原生DOM操作方法将该DOM元素移除。

```javascript
function mountElement(vnode, container){
	// 让vnode.el引用真实DOM元素
	const el = vnode.el = createElement(vnode,type)
	if(typeof vnode.children === 'string'){
		setElementText(el, vnode.children)
	}else if(Array.isArray(vnode.children)){
		vnode.children.forEach(child=>{
			patch(null,child,el)
		})
	}

	if(vnode.props){
		for(const key in vnode.props){
			patchProps(el,key,null,vnode.props[key])
		}
	}
	insert(el,container)
}
// 因此有了这些只需要根据虚拟节点对象vnode.el取得真实DOM元素,再将其从父元素中移除即可，看下面代码：
function render(vnode,container){
	if(vnode){
		patch(container._vnode,vnode,container)
	}else{
		if(container._vnode){ //这里单纯就是如果有历史渲染的节点，直接删除
			unmount(container._vnode)
		}
	}
	container._vnode = vnode
}

function unmount(vnode){
	const parent = vnode.el.parentNode
	if(parent){
		parent.removeChild(vnode.el)
	}
}

```

### 6.区分vnode的类型

当后续调用render函数渲染空内容（即null）时，会执行卸载操作。如果后续渲染时，为render函数传递了新的vnode，则不会进行卸载操作，而是把新旧vnode都传递给patch函数进行打补丁操作，但是在执行打补丁操作之前，需要保证新旧vnode所描述的内容相同，就比如说，初次渲染的vnode是一个p元素，后续又渲染了一个input元素，这就会造成新旧vnode描述的内容不同，即vnode.type属性的值不同。这样打补丁是没有意义的

```javascript
function patch(n1,n2,container){
	// 如果n1存在，则对比n1和n2的类型
	if(n1 && n1.type !== n2.type){
		// 如果新旧vnode的类型不同，则直接将旧的vnode卸载
		unmount(n1)
		// 卸载完后，要将n1的值重置为null，保证后续挂载操作正确执行
		n1 = null
	}
	const {type} = n2
	// 如果n2.type的类型是字符串，则描述的是普通标签元素
	if(typeof type === 'string'){
		if(!n1){
			mountElement(n2,container)
		}else{
			// 更新操作
		}
	}else if(typeof type === 'object'){
		// 如果类型是对象则描述的是组件
	}else if(typeof type === 'xxx'){
		// 其他类型的vnode
	}
	
}

```

### 7.事件的处理

本节描述：如何在虚拟节点中描述事件，如何把事件添加到DOM元素上

1. 如何在虚拟节点中描述事件

```javascript
// 凡是以字符串on开头的属性都视作事件
const vnode = {
	type: 'p',
	props: {
		// 使用 onXxx描述事件
		onClick: () => {
			alert('clicked')
		}
	},
	children: 'text'
}

```

2. 如何把事件添加到DOM元素上

```javascript
// 调用addEventListener函数来绑定事件
patchProps(el, key, prevValue, nextValue){
	// 匹配以on开头的属性，试其为事件
	// 正则表达式
	if(/^on/.test(key)){
		// 根据属性名称得到对应的事件名称，例如 onClick ---> click
		const name = key.slice(2).toLowerCase()
    // 移除上一次绑定的事件处理函数
		preValue && el.removeEventListener(name, prevValue)
		// 绑定事件，nextValue为事件处理函数
		el.addEventListener(name,nextValue)
	}else if(key === 'class'){
		// 省略部分代码
	}else if(shouldSetAsProps(el,key,nextValue)){
		// 省略部分代码
	}else{
		// 省略部分代码
	}
}

```

升级版本 ：创建invoker并缓存在el._vei可以不用removeEventListen、 `el._vei[key]`来存放对应事件名下的事件函数、同一个事件下绑定多个事件处理函数

```javascript
patchProps(el, key, prevValue, nextValue){
	if(/^on/.test(key)){
		const invokers = el._vei || (el._vei = {})
		let invoker = invokers[key]
		
		const name = key.slice(2).toLowerCase()
		if(nextValue){
			if(!invoker){
        // invoker是一个事件存放的函数，内部调用了绑定的事件 invoker.value
				invoker = el.vei[key] = (e)=>{//key来使单个事件名下能绑定多个事件执行函数
					// 如果invoker.value是数组，则遍历它并逐个调用事件处理函数
					if(Array.isArray(invoker.value)){
						invoker.value.forEach(fn=>fn(e))
					}else{
						// 否则直接作为函数调用
						invoker.value(e)
					}
				}
				invoker.value = nextValue
				el.addEventListener(name,invoker)
			}else{
				invoker.value = nextValue
			}
		}else if(invoker){
			el.removeEventListener(name, invoker)
		}
	}else if(key === 'class'){
		// 省略部分代码
	}else if(shouldSetAsProps(el,key,nextValue)){
		// 省略部分代码
	}else{
		// 省略部分代码
	}
}

```

### 8. 事件冒泡与更新时机问题

先看一个例子：
```javascript
const {effect, ref} = VueReactivity

const bol = ref(false)

effect(()=>{
	// 创建node
	const vnode = {
		type: 'div',
		props: bol.value?{
			onClick: ()=>{
				alert('父元素 clicked')
			}
		}:{}
		children: [
			{
				type: 'p',
				props: {
					onClick: ()=>{
						bol.value = true
					}
				},
				children: 'text'
			}
		]
	}
	//渲染vnode
	renderer.render(vnode,document.querySelector('#app'))

})

```

+ 上述例子中结果是：首次点击p时，会触发`alert('父元素 clicked')`,和期望的不一样。

原因： **微任务会穿插在由事件冒泡触发的多个事件处理函数之间被执行。** 当我们点击p时 修改了bol的值，触发副作用函数，修改了div的绑事件。这是一个微任务事件。

解决方案： 事件触发的时间要早于事件处理函数被绑定的时间时，不触发即<font color='blue'>屏蔽所有绑定时间晚于事件触发时间的事件处理函数的执行</font>

```javascript
patchProps(el, key, prevValue, nextValue){
	if(/^on/.test(key)){
		const invokers = el._vei || (el.vei = {})
		let invoker = invokers[key]
		const name = key.slice(2).toLowerCase()
		if(nextValue){
			if(!invoker){
				invoker = el._vei[key] = (e) => {
					// e.timeStamp 是事件发生的时间
					// 如果事件发生的时间早于事件处理函数绑定的时间，则不执行时间处理函数
					if(e.timeStamp < invoker.attacher) return
					if(Array.isArray(invoker.value)){
						invoker.value.forEach(fn=>fn(e))
					}else{
						invoker.value(e)
					}
				}
				invoker.value = nextValue
				// 添加 invoker.attached属性，存储事件处理函数被绑定的时间
				invoker.attached = performance.now()
				el.addEventListener(name, invoker)
			}else{
				invoker.value = nextValue
			}
		}else if(invoker){
			el.removeEventListener(name, invoker)
		}
	}else if(key === 'class'){
		// 省略部分代码
	}else if(shouldSetAsProps(el, key, nextValue)){
		// 省略部分代码
	}else{
		// 省略部分代码
	}
}
// performance.now获取的是高精时间，但根据浏览器的不同，e.timeStamp的值会有所不同，既可以是高精时间也可能是非高精时间。因此要做兼容处理，但是在Chrome 49, Firefox 54, Opera 36之后的版本，e.timeStamp都是高精时间。
```

### 9. 更新子节点

todo

+ diff算法比较复杂，这里暂时不进行描述 后续新出一篇单独写diff算法的

### 10 文本节点和注释节点

起因：我们用vnode.type来描述元素的名称，如果是字符一般代表对应的标签，对象/函数一般是组件。当文本节点和注释节点是没有标签名称的

所以：需要人为创建唯一标识

```javascript
// 文本节点
const Text = Symbol()
const newVnode = {
	// 描述文本节点
	type: Text,
	children: '我是文本内容'
}

// 注释节点的type标识
const Comment = Symbol()
const newVnode = [
	type: Comment,
	children:'我是注释内容'
}

```

有了vnode后，就可以用渲染器来渲染了，如下面代码所示：

```javascript
function patch(n1,n2,container){

	if(n1 && n1.type !== n2.type){
		unmount(n1)
		n1 = null
	}

	const {type} = n2

	if(typeof type === 'string'){
		/.../
	}else if(type === Text){
		// 如果是文本节点
		if(!n1){
			// 如果没有旧节点，则进行挂载
			// 使用createTextNode创建文本节点
			const el = n2.el = document.createTextNode(n2.children)
			// 将文本节点插入到容器中
			insert(el,container)
		}else{
			// 如果旧vnode存在，只需要使用新文本节点的文本内容更新旧文本节点即可
			const el = n2.el = n1.el
			if(n2.children !== n1.children){
				el.nodeValue = n2.children
			}
		}
	}
}
```

### 11. Fragment

Fragment（片断）是 Vue.js 3 中新增的一个 vnode 类型

Vue.js 3 是如何用 vnode 来描述多根节点模板的呢？答案是，使用 Fragment

与文本节点和注释节点类似，片段也没有所谓的标签名称，因也需要为片段创建唯一标识，即 Fragment。对于 Fragment 类型的 vnode 的来说，它的 children 存储的内容就是模板中所有根节点。有了 Fragment 后，就可以用它来描述 Items.vue 组件的模板了

```javascript
 const Fragment = Symbol()
const vnode = {
  type: Fragment,
  children: [
    { type: 'li', children: '1' },
    { type: 'li', children: '2' },
    { type: 'li', children: '3' },
  ]
}
```

```javascript
function patch(oldNode, newNode, container) {  
  // 如果 n1 存在，则对比 n1 和 n2 类型
  if (oldNode && oldNode.type !== newNode.type) {
    unmount(oldNode)
    oldNode = null
  }
  // 如果 oldNode 和 newnode 相同
  const { type } = newNode
  // 如果 newNode.type 的值是字符串类型，则描述的是普通标签
  if (typeof type === 'string') {
    // 如果 n1 不存在，意味着挂载，则调用 mountEmement 函数完成挂载
    if (!oldNode) {
      mountElement(newNode, container)  
    } else {
      patchElement(oldNode, newNode)
    }
  } else if (type === Text) {
    // 如果新 vnode 的类型是 Text,则说明该 vnode 描述的是文本节点
    // 如果没有旧节点，则进行挂载
    if (!oldNode) {
      const el = newNode.el = createText(newNode.children)
      // 将文本节点插入到容器中
      insert(el, container)
    } else {
      // 如果旧 vnode 存在，只需要使用新文本节点的文本内容更新旧文本节点即可
      const el = newNode.el = oldNode.el
      if (newNode.children !== oldNode.children) {
        setText(el, newNode.children)
      }
    }
  } else if (type === Fragment) {
    if (!oldNode) {
      // 如果旧 vnode 不存在，则只需要将 Fragment 的 children 逐个挂载即可
      newNode.children.forEach(c => patch(null, c, container))
    } else {
      // 如果旧 vnode 存在，则只需要更新 Fragment 的 children 即可
      patchChildren(oldNode, newNode, container)
    }
  }
}
```

## 三、简单Diff算法

todo

## 四、双端Diff算法

todo

## 五、快速Diff算法

todo

## 参考文档

+ 霍春阳的《vue.js 设计与实现》
