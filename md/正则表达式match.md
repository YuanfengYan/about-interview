# 正则表达式之match

  vue2源码的模板解析，parse 中主要就是用正则去解析template然后生成ast抽象树。这则匹配用到最多的就是match。
  match([string] | [RegExp]) 

## 一、match不同正则的返回情况

### 1、返回值：Array/null

### 2、不使用g全局匹配时

```javascript
var str='2019shanghai=nihao !!'
str.match(/\w[i]/)
```

![不使用g全局匹配时](https://img-blog.csdnimg.cn/20190220174717573.png)

可以看出会找到首次匹配的字符串立马返回，返回的数组有4项

0：匹配到的字符串                                     group：undefined，这表示当前的正则表达式没使用分组

index ：首次匹配上的子串的起始下标。 input：表示源字符串

### 3、使用g全局匹配

如果要找所有匹配的字符串，需要加g

```javascript
var str='2019shanghai=nihao !!'
str.match(/\w[i]/g)
=>["ai", "ni"]
```

![使用g全局匹配](https://img-blog.csdnimg.cn/20190220175300545.png)

 很明显返回了两个匹配的选项，但少了不加g全局匹配时两个项（index，group）

### 4、使用分组

1. 使用分组，且不使用g全局匹配

语义：找出<font color="red">首次匹配</font>等号前后都是英文字母的字符串，并返回分组内匹配的字符串。

```javascript
var str='2019shanghai=nihao !! my_age=age18'
str.match(/([A-Za-z]*)(=)[A-Za-z]+/)
```

![使用分组，且不使用g全局匹配](https://img-blog.csdnimg.cn/20190220181958647.png)

数组第一个元素是正则找到的最长的匹配，剩下的2个元素是对应（）分组里面的正则匹配到的字符串。

而且发现只会匹配到第一组，就会返回结果。不会继续查找后续的匹配项。这和原先不使用分组且不使用g是一样的。


2. 使用分组（配合使用?:---匹配但不捕获），且不使用g全局匹配

语义：找出首次匹配等号前后都是英文字母的字符串，并返回分组内匹配的字符串（忽略含?:的分组）。

```javascript
var str='2019shanghai=nihao !! my_age=age18'
str.match(/([A-Za-z]*)(?:=)[A-Za-z]+/)
```

![使用分组（配合使用?:---匹配但不捕获），且不使用g全局匹配](https://img-blog.csdnimg.cn/2019022018283116.png)


相比于①少了一个元素=，因为在分组（=）里面加了?: 其他的都不变，匹配依然是一样的匹配，只是不展示在该分组内的匹配对应元素。


3. 使用分组，且使用g全局匹配

语义：找出所有匹配等号前后都是英文字母的字符串。

```javascript
var str='2019shanghai=nihao !! my_age=age18'
str.match(/([A-Za-z]*)(=)[A-Za-z]+/g)
```

![使用分组，且使用g全局匹配](https://img-blog.csdnimg.cn/20190220181109928.png)

很明显分组内匹配到的都不会展示，只会展示最长的能匹配的字符串集合。

## 二、vue源码里template的正则分析

首先vue源码中templete模板解析的原理是，通过正则依次解析template字符串，并通过advance截取调对应的字符串，匹配类型有 ：起始标签，结束标签、注释、Doctype、条件注释等。其中起始标签内，还会匹配标签内的属性，表达式等。

匹配起始标签：

```javascript
const ncname = '[a-zA-Z_][\\w\\-\\.]*'

const qnameCapture = `((?:${ncname}\\:)?${ncname})`

const startTagOpen = new RegExp(`^<${qnameCapture}`)

html.match(startTagOpen)

等价于 html.match(/^<((?:[a-zA-Z_][\w\-\.]*\:)?[a-zA-Z_][\w\-\.]*)/)

[a-zA-Z_] ：一个（字母、下划线）组成的字符串

[\w\-\.]* ：字母、下划线、中划线、小数点组成的字符串0个或以上个

\:  ：以冒号结尾的字符串

? :0个或一个

[a-zA-Z_]  ：一个（字母、下划线）组成的字符串

[\w\-\.]* ：0个或以上（字母，数字，中划线，下划线，小数点）组成的字符串

大概意思：^<  以<起始，后面紧跟的字符串必须以字母或下划线开头，后面可以是字母，下划线，中划线，小数点组合而成，但最多可以出现一次冒号，且冒号不是在最后。

注：里面的?:主要是为了避免多次分组出现在匹配中，因为存在两个分组的嵌套。

匹配起始标签内的属性，表达式

 const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/

attr = html.match(attribute))

// ^\s* --0个或者更多的空白字符开头

// ([^\s"'<>\/=]+) 不是空字符、"'<>/=的符号

// (?:\s*(=)\s* 匹配等号并捕获，且匹配前后的空白字符但不不捕获

// (?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+))匹配非"的字符并捕获，且匹配前后的"但不不捕获 | 匹配非'的字符并捕获，且匹配前后的'但不不捕获 | 匹配非空白字符 " ' = < > 的字符并捕获



如上图，html是通过advance函数截取剩下的template，返回的是首次匹配的数组，数组1,2,3,4,5分别是分组里正则匹配的字符串

在Vue源码中通过循环正则匹配取出里面的属性键值对，放入Ast抽象树中。

模板解析的其他正则也是类似的如下是里面的正则

const startTagClose = /^\s*(\/?)>/  --------------起始闭合标签

const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)   ----结束标签

const doctype = /^<!DOCTYPE [^>]+>/i   -----doctype标签

const comment = /^<!\--/       ----------注释标签

const conditionalComment = /^<!\[/     -----------条件注释
```


​
