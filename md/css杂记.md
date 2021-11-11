# css杂记

## 一、 CSS防污染

+ 1、可以使用css module的形式

+ 2、可以使用css in js的形式

+ 3、css还能像vue组件的形式去写，只不过需要用工具去转化

## 二、 SCSS基础

+ 变量 $xx

```css
$font-stack: Helvetica, sans-serif;
$primary-color: #333;

body {
  font: 100% $font-stack;
  color: $primary-color;
}
```

+ 嵌套 允许同Dom嵌套结构进行样式编写

+ 引入 文件名以下划线开头

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

+ 混合(Mixin)

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

+ 继承 @extend 指令告诉 Sass 一个选择器的样式从另一选择器继承

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