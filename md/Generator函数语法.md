# Generator函数语法

## Generator概念

    Generator 函数是 ES6 提供的一种异步编程解决方案

语法上

    Generator 函数除了是一个状态机，封装了多个内部状态。
    还是一个遍历器对象生成函数

形式上

    一是，function关键字与函数名之间有一个星号；
    二是，函数体内部使用yield表达式，定义不同的内部状态（yield在英语里的意思就是“产出”）

调用 Generator 函数后，该函数并不执行，返回的也不是函数运行结果，而是一个指向内部状态的指针对象

## this指向

    Generator  函数总是返回一个遍历器，ES6 规定这个遍历器是 Generator 函数的实例，也继承了 Generator 函数的prototype对象上的方法。
    但不能把Generator当做构造函数来使用，因为返回的总是遍历器对象，而不是this对象。

## 应用

### （1）异步操作的同步化表达

```javascript
    function* main() {
    var result = yield request("http://some.url");
    var resp = JSON.parse(result);
        console.log(resp.value);
    }
    function request(url) {
    makeAjaxCall(url, function(response){
        it.next(response);
    });
    }
    var it = main();
    it.next();
```

### （2）控制流管理 

```javascript
function* longRunningTask(value1) {
  try {
    var value2 = yield step1(value1);
    var value3 = yield step2(value2);
    var value4 = yield step3(value3);
    var value5 = yield step4(value4);
    // Do something with value4
  } catch (e) {
    // Handle any error from step1 through step4
  }
}
```

### （3）部署 Iterator 接口

>利用 Generator 函数，可以在任意对象上部署 Iterator 接口。

    利用 Generator 函数，可以在任意对象上部署 Iterator 接口。

```javascript
function* iterEntries(obj) {
  let keys = Object.keys(obj);
  for (let i=0; i < keys.length; i++) {
    let key = keys[i];
    yield [key, obj[key]];
  }
}

let myObj = { foo: 3, bar: 7 };

for (let [key, value] of iterEntries(myObj)) {
  console.log(key, value);
}

```

### （4）作为数据结构

    Generator 可以看作是数据结构，更确切地说，可以看作是一个数组结构，因为 Generator 函数可以返回一系列的值，这意味着它可以对任意表达式，提供类似数组的接口。

```javascript
function* doStuff() {
  yield fs.readFile.bind(null, 'hello.txt');
  yield fs.readFile.bind(null, 'world.txt');
  yield fs.readFile.bind(null, 'and-such.txt');
}
for (task of doStuff()) {
  // task是一个函数，可以像回调函数那样使用它
}

```
