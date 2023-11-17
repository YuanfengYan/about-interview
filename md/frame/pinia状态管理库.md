# pinia状态管理库

## 一、 基本介绍

- pinia是原先vuex的替代者，它允许跨组件或页面共享状态
- 支持TypeScript
- 去掉了mutation，只有state、getters和actions.简化使用，代码直观
- 去掉了modules的概念，每个store都是一个独立的模块，不再需要嵌套模块
- 提供符合组合式风格的API与Vue3新语法统一


## 二、安装、创建

### 1. 安装

```javascript
yarn add pinia
# 或者使用 npm
npm install pinia
```

### 2. 创建

```javascript
import { createApp } from 'vue'
import { createPinia } from 'pinia' //引入api
import App from './App.vue'
const pinia = createPinia() //创建pinia
const app = createApp(App)
app.use(pinia) //pinia实例传入 应用
app.mount('#app')
```

### 3. 定义 Store

```javascript
import { defineStore } from 'pinia'

// 你可以对 `defineStore()` 的返回值进行任意命名，但最好使用 store 的名字，同时以 `use` 开头且以 `Store` 结尾。(比如 `useUserStore`，`useCartStore`，`useProductStore`)
// 第一个参数是你的应用中 Store 的唯一 ID。
export const useAlertsStore = defineStore('alerts', {
  // 其他配置...
})
```

**两种方案： 一种选项式 一种Setup**

+ 选项式 

优点： 简单直观
```javascript
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  getters: {
    double: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++
    },
  },
})
```

+ Setup方式

优点： 
- 可以在一个 store 内创建侦听器
- 并自由地使用任何[组合式函数](https://cn.vuejs.org/guide/reusability/composables.html)

```javascript
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  function increment() {
    count.value++
  }

  return { count, increment }
})
// ref() 就是 state 属性
// computed() 就是 getters
// function() 就是 actions

```

## 三、State使用

### 1、组件中使用

```javascript
// store/userstore.ts
import { defineStore } from 'pinia';
interface User{
	name:string
    addrList:any[]
}
export const useUserStore = defineStore('userstore',{
    state:()User:=>({
        name:'默认名字',
        addrList:['xxx','yyy']
    })
    getters:{
        getAddListByIndex(){
            // ...
        }
    }
    actions: {
        addAddrList(addr:string){
            this.addrList.push(addr)
        }
        setName(name:string){
            this.name = name
        }
    }
})
// setup组件
import { useUserStore } from '/@/stores/userstore';
const userStore = useUserStore()
console.log(userStore.name)
```

### 2、组件中变更state的四种方法

方法一和方法二都属于直接修改，对于单向数据流方面考虑不推荐，但好用

- 方法一： 直接修改

```javascript
import { useUserStore } from '/@/stores/userstore';
const userStore = useUserStore()
userStore.name = 'Mr.Yan'
```

- 方法二： 通过storeToRefs 转为ref后修改
  
```javascript
import { storeToRefs } from 'pinia'
import { useUserStore } from '/@/stores/userstore';
const userStore = useUserStore()
const {name} = storeToRefs(userStore)
name.value = 'Mr.Yan'
```

- 方法三： $patch传对象参数
  
```javascript
import { storeToRefs } from 'pinia'
import { useUserStore } from '/@/stores/userstore';
const userStore = useUserStore()
userStore.$patch({
    name:'Mr.Yan',
    addrList:['新地址1']
})
// 可以一次修改多个属性

```

- 方法四： $patch传函数
  
```javascript
import { storeToRefs } from 'pinia'
import { useUserStore } from '/@/stores/userstore';
const userStore = useUserStore()
userStore.$patch((state)=>{
   state.name = 'Mr.Yan'
   state.addrList.push('地址3')
})
// 可以一次修改多个属性，同时可以弥补方案三种不能，向数组中添加、移除一个元素或是做 splice 操作
```

- 方法五： 调用actions 方法
  
```javascript
import { storeToRefs } from 'pinia'
import { useUserStore } from '/@/stores/userstore';
const userStore = useUserStore()
userStore.setName('Mr.Yan')
// 推荐
```

### 3 $subscribe订阅

```javascript
userStore.$subscribe((mutation, state) => {
  // import { MutationType } from 'pinia'
  mutation.type // 'direct' | 'patch object' | 'patch function'
  // 和 cartStore.$id 一样
  mutation.storeId // 'cart'
  // 只有 mutation.type === 'patch object'的情况下才可用
  mutation.payload // 传递给 cartStore.$patch() 的补丁对象。

  // 每当状态发生变化时，将整个 state 持久化到本地存储。
  localStorage.setItem('userStore', JSON.stringify(state))
})

// 类似watch
watch(userStore,()=>{
    // ...
})

// 区别
官方文档上说: `比起普通的 watch()，使用 $subscribe() 的好处是 subscriptions 在 patch 后只触发一次 (例如，当使用上面的函数版本时)。`
实测貌似没啥差别，也没仔细研究
总的来说，$subscribe是一个实例方法 ,watch是一个全局API,$subscribe更适合全局监听整个store的状态变化，而watch更适合监听特定的响应式对象的变化。
```
## 四、 getters

## 五、 actions

// ...
- 订阅 action

对于错误调试比较有用
```javascript
const unsubscribe = someStore.$onAction(
  ({
    name, // action 名称
    store, // store 实例，类似 `someStore`
    args, // 传递给 action 的参数数组
    after, // 在 action 返回或解决后的钩子
    onError, // action 抛出或拒绝的钩子
  }) => {
    // 为这个特定的 action 调用提供一个共享变量
    const startTime = Date.now()
    // 这将在执行 "store "的 action 之前触发。
    console.log(`Start "${name}" with params [${args.join(', ')}].`)

    // 这将在 action 成功并完全运行后触发。
    // 它等待着任何返回的 promise
    after((result) => {
      console.log(
        `Finished "${name}" after ${
          Date.now() - startTime
        }ms.\nResult: ${result}.`
      )
    })

    // 如果 action 抛出或返回一个拒绝的 promise，这将触发
    onError((error) => {
      console.warn(
        `Failed "${name}" after ${Date.now() - startTime}ms.\nError: ${error}.`
      )
    })
  }
)

// 手动删除监听器
unsubscribe()


<script setup>
const someStore = useSomeStore()
// 此订阅器即便在组件卸载之后仍会被保留
someStore.$onAction(callback, true)
</script>
```

## 六、插件

- 为 store 添加新的属性
- 定义 store 时增加新的选项
- 为 store 增加新的方法
- 包装现有的方法
- 改变甚至取消 action
- 实现副作用，如本地存储
- 仅应用插件于特定 store


## 参考文档

+ [pinia中文文档](https://pinia.web3doc.top/getting-started.html)
+ [pinia](https://pinia.vuejs.org/)
