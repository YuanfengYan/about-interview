# vue组件通信方式

## 一、props 和 $emit

## 二、$attrs 和 $listeners

Vue 2.4 提供了$attrs 和 $listeners 来实现能够直接让组件A传递消息给组件C。

+ $attrs：包含了父作用域中不被 prop 所识别 (且获取) 的特性绑定 (class 和 style 除外)。当一个组件没有声明任何 prop 时，这里会包含所有父作用域的绑定属性 (class和 style 除外)，并且可以通过 v-bind="$attrs" 传入内部组件。

+ $listeners：包含了父作用域中的 (不含 .native 修饰器的) v-on 事件监听器。它可以通过 v-on="$listeners" 传入内部组件。

```javascript
// 组件A
Vue.component('A', {
  template: `
    <div>
      <p>this is parent component!</p>
      <B :messagec="messagec" :message="message" v-on:getCData="getCData" v-on:getChildData="getChildData(message)"></B>
    </div>
  `,
  data() {
    return {
      message: 'hello',
      messagec: 'hello c' //传递给c组件的数据
    }
  },
  methods: {
    // 执行B子组件触发的事件
    getChildData(val) {
      console.log(`这是来自B组件的数据：${val}`);
    },
    // 执行C子组件触发的事件
    getCData(val) {
      console.log(`这是来自C组件的数据：${val}`);
    }
  }
});

// 组件B
Vue.component('B', {
  template: `
    <div>
      <input type="text" v-model="mymessage" @input="passData(mymessage)"> 
      <!-- C组件中能直接触发 getCData 的原因在于：B组件调用 C组件时，使用 v-on 绑定了 $listeners 属性 -->
      <!-- 通过v-bind 绑定 $attrs 属性，C组件可以直接获取到 A组件中传递下来的 props（除了 B组件中 props声明的） -->
      <C v-bind="$attrs" v-on="$listeners"></C>
    </div>
  `,
  /**
   * 得到父组件传递过来的数据
   * 这里的定义最好是写成数据校验的形式，免得得到的数据是我们意料之外的
   *
   * props: {
   *   message: {
   *     type: String,
   *     default: ''
   *   }
   * }
   *
  */
  props: ['message'],
  data(){
    return {
      mymessage: this.message
    }
  },
  methods: {
    passData(val){
      //触发父组件中的事件
      this.$emit('getChildData', val)
    }
  }
});

// 组件C
Vue.component('C', {
  template: `
    <div>
      <input type="text" v-model="$attrs.messagec" @input="passCData($attrs.messagec)">
    </div>
  `,
  methods: {
    passCData(val) {
      // 触发父组件A中的事件
      this.$emit('getCData',val)
    }
  }
});
var app=new Vue({
  el:'#app',
  template: `
    <div>
      <A />
    </div>
  `
});

```

## 三、中央事件总线 EventBus

EventBus 通过新建一个 Vue 事件 bus 对象，然后通过 bus.$emit 触发事件，bus.$on 监听触发的事件。
>中央事件总线 EventBus 非常简单，就是任意组件和组件之间打交道，没有多余的业务逻辑，只需要在状态变化组件触发一个事件，然后在处理逻辑组件监听该事件就可以。该方法非常适合小型的项目！

+ 1)、 首先我们通过 new Vue() 实例化了一个 Vue 的实例，也就是我们这里称呼的中央事件总线 EventBus ，然后将其赋值给了 Vue.prototype.$EventBus，使得所有的业务逻辑组件都能够访问到；
+ 2)、 然后定义了组件 A，在组件 A 里面定义了一个处理的方法 passData，主要定义触发一个全局的 globalEvent 事件，并传递一个参数；
+ 3)、 最后定义了组件 B，在组件 B 里面的 mounted 生命周期监听了组件 A 里面定义的全局 globalEvent 事件，并在回调函数里面执行了一些逻辑处理。

```javascript
// 组件 A
Vue.component('A', {
  template: `
    <div>
      <p>this is A component!</p>
      <input type="text" v-model="mymessage" @input="passData(mymessage)"> 
    </div>
  `,
  data() {
    return {
      mymessage: 'hello brother1'
    }
  },
  methods: {
    passData(val) {
      //触发全局事件globalEvent
      this.$EventBus.$emit('globalEvent', val)
    }
  }
});

// 组件 B
Vue.component('B', {
  template:`
    <div>
      <p>this is B component!</p>
      <p>组件A 传递过来的数据：{{brothermessage}}</p>
    </div>
  `,
  data() {
    return {
      mymessage: 'hello brother2',
      brothermessage: ''
    }
  },
  mounted() {
    //绑定全局事件globalEvent
    this.$EventBus.$on('globalEvent', (val) => {
      this.brothermessage = val;
    });
  }
});

//定义中央事件总线
const EventBus = new Vue();

// 将中央事件总线赋值到 Vue.prototype 上，这样所有组件都能访问到了
Vue.prototype.$EventBus = EventBus;

const app = new Vue({
  el: '#app',
  template: `
    <div>
      <A />
      <B />
    </div>
  `
});

```

## 四、provide 和 inject

父组件中通过 provider 来提供属性，然后在子组件中通过 inject 来注入变量。不论子组件有多深，只要调用了 inject 那么就可以注入在 provider 中提供的数据，而不是局限于只能从当前父组件的 prop 属性来获取数据，只要在父组件的生命周期内，子组件都可以调用

```javascript
// 定义 parent 组件
Vue.component('parent', {
  template: `
    <div>
      <p>this is parent component!</p>
      <child></child>
    </div>
  `,
  provide: {
    for:'test'
  },
  data() {
    return {
      message: 'hello'
    }
  }
});

// 定义 child 组件
Vue.component('child', {
  template: `
    <div>
      <input type="tet" v-model="mymessage"> 
    </div>
  `,
  inject: ['for'],	// 得到父组件传递过来的数据
  data(){
    return {
      mymessage: this.for
    }
  },
});

const app = new Vue({
  el: '#app',
  template: `
    <div>
      <parent />
    </div>
  `
});

```

## 五、v-model

```javascript
// 定义 parent 组件
Vue.component('parent', {
  template: `
    <div>
      <p>this is parent component!</p>
      <p>{{message}}</p>
      <child v-model="message"></child>
    </div>
  `,
  data() {
    return {
      message: 'hello'
    }
  }
});

// 定义 child 组件
Vue.component('child', {
  template: `
    <div>
      <input type="text" v-model="mymessage" @change="changeValue"> 
    </div>
  `,
  props: {
    value: String, // v-model 会自动传递一个字段为 value 的 props 属性
  },
  data() {
    return {
      mymessage: this.value
    }
  },
  methods: {
    changeValue() {
      this.$emit('input', this.mymessage); //通过如此调用可以改变父组件上 v-model 绑定的值
    }
  },
});

const app = new Vue({
  el: '#app',
  template: `
     <div>
      <parent />
    </div>
  `
});

```

## 六、$parent 和 $children

>注：$parent 就是父组件的实例对象，而 $children 就是当前实例的直接子组件实例了，不过这个属性值是数组类型的，且并不保证顺序，也不是响应式的。

```javascript
// 定义 parent 组件
Vue.component('parent', {
  template: `
    <div>
      <p>this is parent component!</p>
      <button @click="changeChildValue">test</button>
      <child />
    </div>
  `,
  data() {
    return {
      message: 'hello'
    }
  },
  methods: {
    changeChildValue(){
      this.$children[0].mymessage = 'hello';
    }
  },
});

// 定义 child 组件
Vue.component('child', {
  template:`
    <div>
      <input type="text" v-model="mymessage" @change="changeValue" /> 
    </div>
  `,
  data() {
    return {
      mymessage: this.$parent.message
    }
  },
  methods: {
    changeValue(){
      this.$parent.message = this.mymessage;//通过如此调用可以改变父组件的值
    }
  },
});
const app = new Vue({
  el: '#app',
  template: `
    <div>
      <parent />
    </div>
  `
});

```

## 七、$boradcast 和 $dispatch （Vue2.0已废弃）

## 八、Vuex 状态管理

+ [Vuex官网介绍](https://vuex.vuejs.org/zh/)
+ [手写Vuex核心原理，再也不怕面试官问我Vuex原理](https://juejin.im/post/6855474001838342151)

## 九、 $refs进行父子组件通信

```javascript
// 父组件
<template>
	<view>
		<children ref="children"></children>
	</view>
</template>
 
<script>
import children from './children'
data(){
    return{
        List:[1,2,3]
    }
}
mounted() {
	this.diffuseValues();
},
methods:{
    diffuseValues(){
        this.$refs.children.getValues(this.List)
    }
}
</script>

// 子组件
<template>
	<view>
		{{item}}
	</view>
</template>
 
<script>
data(){
    return{
        item: []
    }
}
mounted() {
	this.getValues();
},
methods:{
    getValues(values){
        this.item = values
    }
}
</script>

```

## 参考文档

+ [Vue 组件通信方式全面详解](https://juejin.im/post/6844903784963899405)
