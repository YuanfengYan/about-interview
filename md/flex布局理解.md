# flex布局理解


## 一、 容器属性

+ **flex-direction**: row row-reverse column column-reserve  子元素排列方向 default:row

+ **flex-warp**: nowarp  warp warp-serverse 该属性为轴线 是否换行
  
+ flex-flow: flex-direction 和 flex-warp简写形式

+ **justify-content**: flex-start | flex-end | center | space-between | space-around;   主轴上的对齐方式

+ **align-item** : flex-start | flex-end | center | baseline | stretch  定义项目在交叉轴上如何对齐。

## 二、 项目属性

+ **order**:  子元素或者子容器的排列顺序。数值越小，排列越靠前，默认为0。

+ **flex-grow**: 子元素或者子容器的放大比例，默认为0 :即如果存在剩余空间，也不放大。

+ **flex-shrink** : 项目的缩小比例，默认为1，即如果空间不足，该项目将缩小。

+ **flex-basis** : auto | ..px 属性定义了在分配多余空间之前，项目占据的主轴空间（main size） 

+ flex: 是flex-grow, flex-shrink 和 flex-basis的简写 默认值为0 1 auto

+ **align-self**：允许单个项目有与其他项目不一样的对齐方式， 默认值为auto，表示继承父元素的align-items属性，如果没有父元素，则等同于stretch。
## 参考文档

+ [Flex布局\弹性布局--面试题](https://juejin.cn/post/6881565341856563213)
+ [Flex 布局教程：语法篇-- 阮一峰](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html?utm_source=tuicool)