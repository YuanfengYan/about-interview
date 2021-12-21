# Typescript

## 一、 基础类型

    boolean;
    number;
    string;
    []（number[],Array<number>...）;
    元组（[string, number]...）;
    enum（enum Color {Red = 1, Green = 3, Blue = 4}）;
    Any;
    Void;
    Null 和 Undefined;
    Never;
    Object;
    类型断言（ (<string>someValue).length ,(someValue as string).length;）

## 二、 接口

通俗理解：为ts类型检查 定义契约

### 可选属性

```typescript
  interface SquareConfig {
    color?: string;
    width?: number;
  }
```

### 只读属性

```typescript
  interface Point {
      readonly x: number;
      readonly y: number;
  }
  // TypeScript具有ReadonlyArray<T>类型，它与Array<T>相似
  let ro: ReadonlyArray<number> = a;

```

### 额外的属性检查

    对象字面量会被特殊对待而且会经过 额外属性检查，当将它们赋值给变量或作为参数传递的时候。
    如果一个对象字面量存在任何“目标类型”不包含的属性时，你会得到一个错误。

```typescript
  interface SquareConfig {
      color?: string;
      width?: number;
  }

  function createSquare(config: SquareConfig): void {
    console.log(config)
  }
  //当这种 对象字面量 的形式 就会报错理由--额外的属性检查
  let mySquare = createSquare({ cc: "red", width: 100 });

  //方案一 当下面的方式就没问题
  const b = { cc: "red", width: 100 }
  let mySquare = createSquare(b);

  // 方案二 断言方式
  let mySquare = createSquare({ width: 100, opacity: 0.5 } as SquareConfig);

  // 方案三 
  // 重新定义接口,
  interface SquareConfig {
      color?: string;
      width?: number;
      [propName: string]: any;//新增的
  }

```


###  函数类型

```typescript
  interface SearchFunc {
    (source: string, subString: string): boolean;
  }

  let mySearch: SearchFunc;
  mySearch = function(src: string, sub: string): boolean {
    let result = src.search(sub);
    return result > -1;
  }
```

### 可索引的类型

```typescript
  interface StringArray {
    [index: number]: string;
  }
  // TypeScript支持两种索引签名：字符串和数字
  // 可以同时使用两种类型的索引，但是数字索引的返回值必须是字符串索引返回值类型的子类型。
  // 原因：这是因为当使用 number来索引时，JavaScript会将它转换成string然后再去索引对象。
```

### 类类型

#### 实现接口


```typescript
interface ClockInterface {
    currentTime: Date;
}
class Clock implements ClockInterface {
    currentTime: Date;
    constructor(h: number, m: number) { }
}

// 你也可以在接口中描述一个方法，在类里实现它，如同下面的setTime方法一样：
interface ClockInterface {
    currentTime: Date;
    setTime(d: Date);
}

class Clock implements ClockInterface {
    currentTime: Date;
    setTime(d: Date) {
        this.currentTime = d;
    }
    constructor(h: number, m: number) { }
}
// 接口描述了类的公共部分，而不是公共和私有两部分。 它不会帮你检查类是否具有某些私有成员。
```

  implements与extends的定位 [引用](https://1991421.cn/2020/01/30/9b18a5df/)
  implements
  顾名思义，实现，一个新的类，从父类或者接口实现所有的属性和方法，同时可以重写属性和方法，包含一些新的功能

  extends
  顾名思义，继承，一个新的接口或者类，从父类或者接口继承所有的属性和方法，不可以重写属性，但可以重写方法

#### 类静态部分与实例部分的区别 [详见](https://www.tslang.cn/docs/handbook/interfaces.html)


### 继承接口

```typescript
// 一个接口可以继承多个接口，创建出多个接口的合成接口。
  interface Shape {
      color: string;
  }

  interface PenStroke {
      penWidth: number;
  }

  interface Square extends Shape, PenStroke {
      sideLength: number;
  }

  let square = <Square>{};
  square.color = "blue";
  square.sideLength = 10;
  square.penWidth = 5.0;
```

### 混合类型

```typescript

  // 一个对象可以同时做为函数和对象使用，并带有额外的属性。

  interface Counter {
      (start: number): string;
      interval: number;
      reset(): void;
  }
  function getCounter(): Counter {
      let counter = <Counter>function (start: number) {};
      counter.interval = 123;
      counter.reset = function () { };
      return counter;
  }
  let c = getCounter();
  c(10);
  c.reset();
  c.interval = 5.0;
//编译后
  function getCounter() {
      var counter = function (start) { };
      counter.interval = 123;
      counter.reset = function () { };
      return counter;
  }
  var c = getCounter();
  c(10);
  c.reset();
  c.interval = 5.0;

```

### 接口继承类

```typescript
class Control {
    private state: any;
}

interface SelectableControl extends Control {
    select(): void;
}

class Button extends Control implements SelectableControl {
    select() { }
}

class TextBox extends Control {
    select() { }
}

// 错误：“Image”类型缺少“state”属性。
class Image implements SelectableControl {
    select() { }
}

class Location {

}
```

## 参考文档

[typescript](https://www.tslang.cn/docs)