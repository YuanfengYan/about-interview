# vue项目的优化

## 一、懒加载[参考文档](https://www.cnblogs.com/xiaoxiaoxun/p/11001884.html)

### 1、vue异步组件实现路由懒加载

　　component：resolve=>(['需要加载的路由的地址'，resolve])

### 2、es提出的import(推荐使用这种方式)

　　const HelloWorld = （）=>import('需要加载的模块地址')

## 二、v-for 遍历必须为 item 添加 key，且避免同时使用 v-if （可以考虑computed）

## 三、v-if 和 v-show 区分使用场景

## 四、computed 和 watch 区分使用场景

## 五、长列表性能优化 (Object.freeze 方法来冻结一个对象)

## 六、事件的销毁、定时器销毁

## 七、图片资源懒加载（Vue-lazyloder）

## 八、第三方插件的按需引入

## 使用雪碧图/字体图标代替切图

>[在线生成工具](https://icomoon.io/app/#/select)

## 提取公共样式和方法

## 九、Webpack 层面的优化

### url-loader 中设置 limit 大小来对图片处理，对小于 limit 的图片转化为 base64 格式，其余的不做操作

## 十、浏览器缓存

## 十一、CDN 的使用

## 十二、SSR(服务端渲染)

## 十三、骨架屏
