# Grid 布局

## 一、属性

### 1. 容器属性

+ display: grid \ inline-grid;
+ grid-template-columns: 属性定义每一列的列宽
+ grid-template-rows: 属性定义每一行的行高
  + repeat() 示例： repeat(3, 33.33%); repeat(2, 100px 20px 80px);
  + 绝对单位 \ 百分比 示例： 100px 100px 100px; \ 33.33% 33.33% 33.33%;
  + auto-fill 示例： repeat(auto-fill, 100px); 100px 尽可能多的占满对应的行或者列
  + fr 关键字 示例： 1fr 1fr; 1fr 2fr（后面的是前面的2倍）;150px 1fr 2fr;
  + minmax： 示例： 1fr 1fr minmax(100px, 1fr);minmax(100px, 1fr)表示列宽不小于100px，不大于1fr。
  + auto浏览器自己决定长度。 示例： 100px auto 100px;
  + 网格线的名称：示例： [c1] 100px [c2] 100px [c3] auto [c4]; 
+ grid-row-gap 新标准写法 row-gap： 行与行的间隔（行间距）
+ grid-column-gap 新标准写法 column-gap： 列间距。
+ grid-gap 新标准写法 gap：`<grid-row-gap> <grid-column-gap>;`
+ grid-template-areas：grid-template-areas:"header header header"
                     "main main sidebar"
                     "footer footer footer";
+ grid-auto-flow: row，即"先行后列" column，变成"先列后行" row dense; \ column dense; 尽量不出现空格。
+ justify-items: 属性设置单元格内容的水平位置（左中右）。 start | end | center | stretch;
+ align-items 属性设置单元格内容的垂直位置（上中下）。start | end | center | stretch;
+ justify-content : 整个内容区域在容器里面的水平位置 start | end | center | stretch | space-around | space-between | space-evenly;
+ aling-content
+ place-content
+ grid-auto-columns /grid-auto-rows: 浏览器自动创建的多余网格的列宽和行高
+ grid-template 三个属性集合：grid-template-columns（列宽）、grid-template-rows （行高）和grid-template-areas （区域定义）
+ grid 6个属性合集简写：grid-template(三个) + grid-auto-rows（多余行高）、grid-auto-columns（多余列宽）、grid-auto-flow（先行列的顺序）

### 2. 项目属性

  + grid-column-start 属性，
  + grid-column-end 属性，
  + grid-row-start 属性，
  + grid-row-end 属性
    + 指定项目的四个边框，分别定位在哪根网格线 1 2...
    + span 2;
    + grid-column 属性，grid-row 属性 以上4个属性的简写 grid-row: 1 / 3; =》 grid-row: 1 / span 2;
  + grid-area： grid-area:
  + justify-self 属性: 属性设置单元格内容的水平位置（左中右）跟justify-items属性的用法完全一致，但只作用于单个项目。
  + align-self 属性，
  + place-self 属性



## 参考文档

[CSS Grid 网格布局教程](https://www.ruanyifeng.com/blog/2019/03/grid-layout-tutorial.html)
