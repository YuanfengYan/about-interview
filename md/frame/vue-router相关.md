# vue-router 相关

## 导航钩子类型

### (1)、全局导航钩子

        router.beforeEach(to, from, next),

        router.beforeResolve(to, from, next),//同时在所有组件内守卫和异步路由组件被解析之后

        router.afterEach(to, from ) //唯一一个导航钩子没有接受next，也不会改变导航本身

### (2)、组件内钩子

        beforeRouteEnter(to, from, next),  //beforeRouteEnter 是支持给 next 传递回调的唯一守卫

        beforeRouteUpdate(to, from, next),  
        //在当前路由改变，但是该组件被复用时调用 
        //举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转,
        //由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
        // 可以访问组件实例 `this`

        beforeRouteLeave(to, from, next)

### (3)、单独路由独享组件

        beforeEnter

## 完整的导航解析流程

1. 导航被触发。
2. 在失活的组件里调用 beforeRouteLeave 守卫。
3. 调用全局的 beforeEach 守卫。
4. 在重用的组件里调用 beforeRouteUpdate 守卫 (2.2+)。
5. 在路由配置里调用 beforeEnter。
6. 解析异步路由组件。
7. 在被激活的组件里调用 beforeRouteEnter。
8. 调用全局的 beforeResolve 守卫 (2.5+)。
9. 导航被确认。
10. 调用全局的 afterEach 钩子。
11. 触发 DOM 更新。
12. 调用 beforeRouteEnter 守卫中传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传入。

