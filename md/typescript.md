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

## 三、 类

### 继承

### 公共，私有与受保护的修饰符

### 默认public

### 私有private

  当成员被标记成 private时，它就不能在声明它的类的外部访问
  如果其中一个类型里包含一个 private成员，那么只有当另外一个类型中也存在这样一个 private成员， 并且它们都是来自同一处声明时，我们才认为这两个类型是兼容 (该规则同样适用于protected)
### 受保护 protected

  protected修饰符与 private修饰符的行为很相似，但有一点不同， protected成员在派生类中仍然可以访问

### 只读的 readonly

  只读属性必须在声明时或构造函数里被初始化。

### 存取器get和set

  修饰 get和 set来截取对对象成员的访问

### 静态属性 static

### 抽象类 abstract [参考](https://www.cnblogs.com/yaphetsfang/articles/13468126.html)

  应用场景： 描述一类事物的时候，发现该事物确实存在着某种行为，但是目前该行为是不具体的
  
## 四、 函数 ...

## 五、泛型

```typescript
function identity<T>(arg: T): T {
    return arg;
}
```

### 泛型类型

```typescript
interface GenericIdentityFn {
    <T>(arg: T): T;
}

function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: GenericIdentityFn = identity;
```

### 泛型类

  泛型类看上去与泛型接口差不多。 泛型类使用（ <>）括起泛型类型，跟在类名后面。

```typescript
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };
```

### 泛型约束

```typescript
// 约束了loggingIdentity的T泛型，必须要是含有length为number 的属性
interface Lengthwise {
    length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);  // Now we know it has a .length property, so no more error
    return arg;
}
```

### 在泛型约束中使用类型参数

```typescript
// 通过声明obj:T，key:K
// 你可以声明一个类型参数，且它被另一个类型参数所约束。 比如，现在我们想要用属性名从对象里获取这个属性。 并且我们想要确保这个属性存在于对象 obj上，因此我们需要在这两个类型之间使用约束。
function getProperty(obj: T, key: K) {
    return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, "a"); // okay
getProperty(x, "m"); // error: Argument of type 'm' isn't assignable to 'a' | 'b' | 'c' | 'd'.
```
## 参考文档

[typescript](https://www.tslang.cn/docs)