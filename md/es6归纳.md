# es6归纳

## 一、let 和 const

### 特性

    1、不存在变量提升  

    2、暂时性死区

    3、不允许重复声明

    4、块级作用域

>es6环境下函数声明规则  

- 允许在块级作用域内声明函数。
- 函数声明类似于var，即会提升到全局作用域或函数作用域的头部。
- 同时，函数声明还会提升到所在的块级作用域的头部。


    5、let命令、const命令、class命令声明的全局变量，不属于顶层对象的属性

    6、ES2020 在语言标准的层面，引入globalThis作为顶层对象。也就是说，任何环境下，globalThis都是存在的，都可以从它拿到顶层对象，指向全局环境下的this。

## 二、变量的解构

### 解构允许设置默认值

### 对象的解构赋值

1、变量必须与属性同名，才能取到正确的值，如果变量名与属性名不一致，必须写成下面这样。
>let { foo: foo1, bar: bar2 } = { foo: 'aaa', bar: 'bbb' };

2、如果解构失败，变量的值等于undefined

3、对象的解构赋值可以取到继承的属性。

4、注意点

- 如果要将一个已经声明的变量用于解构赋值，必须非常小心
- 解构赋值允许等号左边的模式之中，不放置任何变量名
- 由于数组本质是特殊的对象，因此可以对数组进行对象属性的解构。

### 字符串的解构

>会先将字符串转为数组对象

###  数值和布尔值的解构赋值

>只要等号右边的值不是对象或数组，就先将其转为对象

### 用途

1. 交换变量的值

2. 从函数返回多个值

3. 函数参数的定义

4. 提取 JSON 数据

5. 函数参数的默认值

6. 遍历 Map 结构

7. 输入模块的指定方法

##  三、字符串的扩展

### 字符的 Unicode 表示法

### 字符串的遍历器接口

    ES6 为字符串添加了遍历器接口
    这个遍历器最大的优点是可以识别大于0xFFFF的码点 (for of)

### 模板字符串


## 四、字符串的新增方法

### 实例方法：includes(), startsWith(), endsWith()

    includes()：返回布尔值，表示是否找到了参数字符串。
    startsWith()：返回布尔值，表示参数字符串是否在原字符串的头部。
    endsWith()：返回布尔值，表示参数字符串是否在原字符串的尾部。

### 实例方法：repeat()

    repeat方法返回一个新字符串，表示将原字符串重复n次

### 实例方法：padStart()，padEnd()

    padStart()和padEnd()一共接受两个参数，第一个参数是字符串补全生效的最大长度，第二个参数是用来补全的字符串
    不改变原字符串

### 实例方法：trimStart()，trimEnd() 

    ES2019 对字符串实例新增了trimStart()和trimEnd()这两个方法。它们的行为与trim()一致，trimStart()消除字符串头部的空格，trimEnd()消除尾部的空格。它们返回的都是新字符串，不会修改原始字符串。

## 数值的扩展

### Number.isFinite(), Number.isNaN()

### Number.parseInt(), Number.parseFloat()

    ES6 将全局方法parseInt()和parseFloat()，移植到Number对象上面，行为完全保持不变

### Number.isInteger()

### Number.EPSILON

    表示是 JavaScript 能够表示的最小精度。
    Number.EPSILON === Math.pow(2, -52)

### 安全整数和 Number.isSafeInteger()

    JavaScript 能够准确表示的整数范围在-2^53到2^53之间（不含两个端点），超过这个范围，无法精确表示这个值

### Math 对象的扩展

    Math.trunc()

Math.trunc方法用于去除一个数的小数部分，返回整数部分。

    Math.sign()

Math.sign方法用来判断一个数到底是正数、负数、还是零。对于非数值，会先将其转换为数值

- 参数为正数，返回+1；
- 参数为负数，返回-1；
- 参数为 0，返回0；
- 参数为-0，返回-0;
- 其他值，返回NaN。

    Math.cbrt()

Math.cbrt()方法用于计算一个数的立方根

    Math.hypot()

Math.hypot方法返回所有参数的平方和的平方根。

    Math.fround() 、Math.imul() 、Math.clz32()

...

### Promise

1. Promise.allSettled()  Es9 = ES2020  引入

    方法接受一个数组作为参数，数组的每个成员都是一个 Promise 对象，并返回一个新的 Promise 对象。只有等到参数数组的所有 Promise 对象都发生状态变更（不管是 fulfilled还是rejected），返回的 Promise 对象才会发生状态变更。

返回固定结构

```javascript
    // 异步操作成功时
  {status: 'fulfilled', value: value}

  // 异步操作失败时
  {status: 'rejected', reason: reason}
```

```javascript
const resolved = Promise.resolve(42);
const rejected = Promise.reject(-1);

const allSettledPromise = Promise.allSettled([resolved, rejected]);

allSettledPromise.then(function (results) {
  console.log(results);
});
// [
//    { status: 'fulfilled', value: 42 },
//    { status: 'rejected', reason: -1 }
// ]
```

2. Promise.any()   es10 = es2021 

  只要参数实例有一个变成fulfilled状态，包装实例就会变成fulfilled状态；如果所有参数实例都变成rejected状态，包装实例就会变成rejected状态。

```javascript
Promise.any([
  fetch('https://v8.dev/').then(() => 'home'),
  fetch('https://v8.dev/blog').then(() => 'blog'),
  fetch('https://v8.dev/docs').then(() => 'docs')
]).then((first) => {  // 只要有一个 fetch() 请求成功
  console.log(first);
}).catch((error) => { // 所有三个 fetch() 全部请求失败
  console.log(error);
});
```

## 参考文档

+ [es6-阮一峰](https://es6.ruanyifeng.com/#docs/proposals)
  
+ 👍[ES6-ES12所有特性详解](https://blog.csdn.net/wang13679201813/article/details/124787648)