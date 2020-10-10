# watch和computed区别

## computed

>computed 是计算属性，它会根据你所依赖的数据动态显示新的计算结果

+ 计算属性如果依赖不变的话，它就会变成缓存，computed 的值就不会重新计算

+ 计算出来的属性不需要调用直接可以在 DOM 里使用

>脏数据标志位 dirty

computed控制缓存的本质：

1. 本质是监听每个依赖的变化，执行computed的getter函数（内部进行封装了），返回对应的值。

2. 在创建对应依赖的watcher时，传入一个配置参数{lazy:true}，从而配置了watcher中的dirty=true,首次初始化的时候回去执行getter,一旦执行完getter，会将将dirty转为false。从而在依赖没有变化的时候，dirty==false,每次去到的数据就是缓存数据
一旦对应的依赖有变化时，就会执行dirty = lazy。在下次去getter时就会重新计算。

或者可以说

>1一开始每个 computed 新建自己的watcher时，会设置 watcher.dirty = true，以便于computed 被使用时，会计算得到值  
>2当 依赖的数据变化了，通知 computed 时，会设置 watcher.dirty = true，以便于其他地方重新渲染，从而重新读取 computed 时，此时 computed 重新计算  
>3computed 计算完成之后，会设置 watcher.dirty = false，以便于其他地方再次读取时，使用缓存，免于计算  

可以参考

+ [vue computed实现原理](https://www.cnblogs.com/kdcg/p/13639430.html)

+ [【Vue原理】月老Computed - 白话版](https://zhuanlan.zhihu.com/p/53219652)

## watch

>一个对象，键是 data 对应的数据，值是对应的回调函数。值也可以是方法名，或者包含选项的对象，当 data 的数据发生变化时，就会发生一个回调，他有两个参数，一个 val （修改后的 data 数据），一个 oldVal（原来的 data 数据）
Vue 实例将会在实例化时调用$watch()，遍历 watch 对象的每一个属性

<font color="bule">注意：</font>:不应该使用箭头函数来定义 watcher 函数，因为箭头函数没有 this，它的 this 会继承它的父级函数，但是它的父级函数是 window，导致箭头函数的 this 指向 window，而不是 Vue 实例

+ deep 控制是否要看这个对象里面的属性变化

+ immediate 控制是否在第一次渲染是执行这个函数

## 总结

+ 如果一个数据需要经过复杂计算就用 computed

+ 如果一个数据需要被监听并且对数据做一些操作就用 watch

+ computed 是多个数据变化影响一个，watch 是一个数据的变化可以去操作多个数据（包括一些异步操作等等）

## 参考文档

[Vue 里的 computed 和 watch 的区别](https://zhuanlan.zhihu.com/p/99894379?from_voters_page=true)