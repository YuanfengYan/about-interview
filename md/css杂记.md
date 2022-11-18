# css杂记

## 一、 CSS防污染

+ 1、可以使用css module的形式

+ 2、可以使用css in js的形式

+ 3、css还能像vue组件的形式去写，只不过需要用工具去转化

## 二、 SCSS基础

### 1、 变量 $xx

```css
$font-stack: Helvetica, sans-serif;
$primary-color: #333;

body {
  font: 100% $font-stack;
  color: $primary-color;
}
```

### 2、嵌套 允许同Dom嵌套结构进行样式编写

### 3、引入 文件名以下划线开头 (如果不用_，会生成css单独的文件)

```css
// _reset.scss
html, body, ul, ol {
  margin:  0;
  padding: 0;
}

// base.scss
@import 'reset';
body {
  font: 100% Helvetica, sans-serif;
  background-color: #efefef;
}
```

### 3、混合(Mixin)

  @mixin 指令允许我们定义一个可以在整个样式表中重复使用的样式。

  @include 指令可以将混入（mixin）引入到文档中。

```css
/* 混入接收两个参数 */
@mixin bordered($color, $width) {
  border: $width solid $color;
}

.myArticle {
  @include bordered(blue, 1px);  // 调用混入，并传递两个参数
}

.myNotes {
  @include bordered(red, 2px); // 调用混入，并传递两个参数
}
```

### 4、继承 @extend 指令告诉 Sass 一个选择器的样式从另一选择器继承

```css
.button-basic  {
  border: none;
  padding: 15px 30px;
  text-align: center;
  font-size: 16px;
  cursor: pointer;
}

.button-report  {
  @extend .button-basic;
  background-color: red;
}

.button-submit  {
  @extend .button-basic;
  background-color: green;
  color: white;
}
```

### 5、@content 类似占位用的

  代表自定义的内容
```
  `@content`用在`mixin`里面的，当定义一个`mixin`后，并且设置了`@content`；
  `@include`的时候可以传入相应的内容到`mixin`里面
```

官方例子：

```css
$color: white;
@mixin colors($color: blue) {
  background-color: $color;
  @content;
  border-color: $color;
}
.colors {
  @include colors { color: $color; }
}
/* 编译后： */
.colors {
  background-color: blue;
  color: white;
  border-color: blue;
}
```
### function 跟混合的区别在于函数可以写更多自己想要的逻辑，而且可以有返回值

```css
$color: #ff0089;
@function toUpper($value){
    @return to-upper-case($value+"");
}
body {
    background: toUpper($color);
}
```

### 5、操作函数

+ if ,@if ,@for from to/through, @each in, @while

## scss主题切换

```scss
$themes: (
  light: (
    font_color1: #414141,
    font_color2: white,
    //背景
    background_color1: #fff,
    background_color2: #f0f2f5,
    background_color3: red,
    background_color4: #2674e7,
    //边框
    border_color1: #3d414a,
  ),
  dark: (
    font_color1: #a7a7a7,
    font_color2: white,
    //背景
    background_color1: #1b2531,
    background_color2: #283142,
    background_color3: #1e6ceb,
    background_color4: #323e4e,
    //边框
    border_color1: #3d414a,
  ),
);
@mixin themeify {
  @each $theme-name, $theme-map in $themes {
    $theme-map: $theme-map !global;
    [data-theme="#{$theme-name}"] & {
      @content;
    }
  }
} //声明一个根据Key获取颜色的function
@function themed($key) {
  @return map-get($theme-map, $key);
}
//获取背景颜色
@mixin background_color($color) {
  @include themeify {
    background-color: themed($color) !important;
  }
}
.demo {
  font-size: 18px;
  @include background_color("background_color1");
}
// 编译后  在线编译工具 http://jsrun.net/app/scss
.demo {
  font-size: 18px; }
  [data-theme="light"] .demo {
    background-color: #fff !important; }
  [data-theme="dark"] .demo {
    background-color: #1b2531 !important; }
```

## 参考文档

+ [官方文档](https://www.sass.hk/docs/)

+ [ Scss function](https://www.dazhuanlan.com/guokai01/topics/1500242)

+ [scss基本使用及操作函数](https://blog.csdn.net/qq_41619796/article/details/110817284)

+ [SCSS学习篇之一：基础入门](https://blog.csdn.net/ann295258232/article/details/125595932)

+ [vue + Scss 动态切换主题颜色实现换肤](https://segmentfault.com/a/1190000022484192)
