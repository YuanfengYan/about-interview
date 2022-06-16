<!--
 * @Description: 
 * @Author: yanyuanfeng
 * @Date: 2021-03-09 14:25:32
 * @LastEditors: yanyuanfeng
 * @LastEditTime: 2022-03-18 14:41:31
-->
# stencil笔记

## 特性

    Virtual DOM

    Async rendering (inspired by React Fiber)
    
    Reactive data-binding

    TypeScript

    JSX
    
    Static Site Generation (SSG)

Stencil还支持Web组件之上的一些关键功能，特别是预渲染和对象属性
（Stencil also enables a number of key capabilities on top of Web Components, in particular, prerendering, and objects-as-properties (instead of just strings).）

兼容性好

## API

### 修饰器(Decorators)

1. @Component() declares a new web component 声明一个新的Web组件

2. @Prop() declares an exposed property/attribute 声明暴露的属性

Prop Decorator
```javascript
import { Prop } from '@stencil/core';

...
export class TodoList {
  @Prop() color: string;
  @Prop() favoriteNumber: number;
  @Prop() isSelected: boolean;
  @Prop() myHttpService: MyHttpService;
  @Prop({mutable: true}) mutableVal: string; //可变
}
```

Prop options:

```javascript

export interface PropOptions {
    attribute?: string; //配置@Prop({attribute:attributename})因为dom attribute只接受sting 设置的是attributes
    mutable?: boolean;//默认false,一旦在值被用户设定，在组件内不能去改变。除非该属性设置true，可变
    reflect?: boolean;//默认false ,一旦设置了@Prop({ reflect: true }) message = 'Hello';attributes 相当于<tag massage="hello"></tag>
}
```

3. @State() declares an internal state of the component  声明组件的内部状态

4. @Watch() declares a hook that runs when a property or state changes  声明在属性或状态更改时运行的钩子
5. @Element() declares a reference to the host element 声明对host元素的引用
6. @Method() declares an exposed public method  声明一个公开的公共方法
7. @Event() declares a DOM event the component might emit 声明组件可能发出的DOM事件
8. @Listen() listens for DOM events 监听DOM事件

### 生命周期钩子

1. connectedCallback()
2. disconnectedCallback()
3. componentWillLoad()
4. componentDidLoad()
5. componentShouldUpdate(newValue, oldValue, propName): boolean
6. componentWillRender()
7. componentDidRender()
8. componentWillUpdate()
9. componentDidUpdate()
10. render()

### appload事件

```javascript
window.addEventListener('appload', (event) => {
  console.log(event.detail.namespace);
});
```

### Patterns


## 其他

- property 是DOM中的属性，是JavaScript里的对象；
- attributes是属于property的一个子集
- attribute 是HTML标签上的特性，表现为DOM节点的attributes属性，它的值只能够是字符串；
- attribute 和 property之间的数据绑定是单向的，修改 attribute 会导致 property发生修改；
- 更改property和attribute上的任意值，都会将更新反映到HTML页面中。


## 参考文档

[stenciljs官方文档](https://stenciljs.com/docs/getting-started)