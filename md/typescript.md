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
  
  implements与extends的定位 [引用](https://1991421.cn/2020/01/30/9b18a5df/) / [Class属性Extends和Implements的区别 参考链接](https://blog.csdn.net/web_doris/article/details/11517759)
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

### 泛型类型(接口)

Array<T>就是自定义泛型
```typescript
interface GenericIdentityFn {
    <T>(arg: T): T;
}

function identity<T>(arg: T): T {
    return arg;
}
let myIdentity: GenericIdentityFn = identity;

//  不再描述泛型函数，而是把非泛型函数签名作为泛型类型一部分。
interface GenericIdentityFn2<T> {
    (arg: T): T;
}

let myIdentity2: GenericIdentityFn2<number> = identity;
```

### 泛型类

  泛型类看上去与泛型接口差不多。 泛型类使用（ <>）括起泛型类型，跟在类名后面。

  泛型类指的是实例部分的类型，所以类的静态属性不能使用这个泛型类型。

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

## 枚举

### 数字枚举

```typescript
enum Direction {
    Up = 1,
    Down,
    Left,
    Right
}
```
### 字符串枚举

### 计算的和常量成员

    当一个表达式满足下面条件之一时，它就是一个常量枚举表达式：

    1、一个枚举表达式字面量（主要是字符串字面量或数字字面量）
    2、一个对之前定义的常量枚举成员的引用（可以是在不同的枚举类型中定义的）
    3、带括号的常量枚举表达式
    4、一元运算符 +, -, ~其中之一应用在了常量枚举表达式
    5、常量枚举表达式做为二元运算符 +, -, *, /, %, <<, >>, >>>, &, |, ^的操作对象。 若常数枚举表达式求值后为 NaN或 Infinity，则会在编译阶段报错。

```typescript
enum FileAccess {
    // constant members
    None,
    Read    = 1 << 1,
    Write   = 1 << 2,
    ReadWrite  = Read | Write,
    // computed member
    G = "123".length
}
// 自增Up=1，Down=2，Left=3,Right=4
```

### 联合枚举与枚举成员的类型

  当枚举成员子集都是：字面量枚举成员
  即初始值为：
  1、任何字符串字面量（例如： "foo"， "bar"， "baz"）
  2、任何数字字面量（例如： 1, 100）
  3、应用了一元 -符号的数字字面量（例如： -1, -100）
  就带有了一种特殊的语义,枚举成员成为了类型
```typescript
enum ShapeKind {
    Circle,
    Square,
}

interface Circle {
    kind: ShapeKind.Circle;
    radius: number;
}

interface Square {
    kind: ShapeKind.Square;
    sideLength: number;
}

let c: Circle = {
    kind: ShapeKind.Square,
    //    ~~~~~~~~~~~~~~~~ Error!
    radius: 100,
}
```

### 运行时的枚举

### 反向映射

```typescript
enum Enum {
    A
}
let a = Enum.A;
let nameOfA = Enum[a]; // "A"
```
### const枚举

```typescript
// 常量枚举成员在使用的地方会被内联进来
const enum Directions {
    Up,
    Down,
    Left,
    Right
}

let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right]
```

### 外部枚举
  外部枚举和非外部枚举之间有一个重要的区别，在正常的枚举里，没有初始化方法的成员被当成常数成员。 对于非常数的外部枚举而言，没有初始化方法时被当做需要经过计算的。
```typescript
// 外部枚举用来描述已经存在的枚举类型的形状。
declare enum Enum {
    A = 1,
    B,
    C = 2
}
```
## 高级类型

### 交叉类型


```typescript
function extend<T, U>(first: T, second: U): T & U {
    let result = <T & U>{};
    for (let id in first) {
        (<any>result)[id] = (<any>first)[id];
    }
    for (let id in second) {
        if (!result.hasOwnProperty(id)) {
            (<any>result)[id] = (<any>second)[id];
        }
    }
    return result;
}

class Person {
    constructor(public name: string) { }
}
interface Loggable {
    log(): void;
}
class ConsoleLogger implements Loggable {
    log() {
        // ...
    }
}
var jim = extend(new Person("Jim"), new ConsoleLogger());
var n = jim.name;
jim.log();
```

### 联合类型

    1、联合类型表示一个值可以是几种类型之一。 我们用竖线（ |）分隔每个类型，所以 number | string | boolean表示一个值可以是 number， string，或 boolean。
    2、如果一个值是联合类型，我们只能访问此联合类型的所有类型里共有的成员。

```typescript
interface Bird {
    fly();
    layEggs();
}

interface Fish {
    swim();
    layEggs();
}

function getSmallPet(): Fish | Bird {
    // ...
}

let pet = getSmallPet();
pet.layEggs(); // okay
pet.swim();    // errors
```

### 类型保护与区分类型


#### 利用断言

```typescript
let pet = getSmallPet();

if ((<Fish>pet).swim) {
    (<Fish>pet).swim();
}
else {
    (<Bird>pet).fly();
}
```

#### 用户自定义的类型保护

```typescript
function isFish(pet: Fish | Bird): pet is Fish {
    return (<Fish>pet).swim !== undefined;
}
// 'swim' 和 'fly' 调用都没有问题了

if (isFish(pet)) {
    pet.swim();
}
else {
    pet.fly();
}
```
#### typeof类型保护

  这些* typeof类型保护*只有两种形式能被识别： typeof v === "typename"和 typeof v !== "typename"， "typename"必须是 "number"， "string"， "boolean"或 "symbol"。 但是TypeScript并不会阻止你与其它字符串比较，语言不会把那些表达式识别为类型保护。  

```typescript
function padLeft(value: string, padding: string | number) {
    if (typeof padding === "number") {
        return Array(padding + 1).join(" ") + value;
    }
    if (typeof padding === "string") {
        return padding + value;
    }
    throw new Error(`Expected string or number, got '${padding}'.`);
}
```

#### instanceof类型保护

```typescript
interface Padder {
    getPaddingString(): string
}

class SpaceRepeatingPadder implements Padder {
    constructor(private numSpaces: number) { }
    getPaddingString() {
        return Array(this.numSpaces + 1).join(" ");
    }
}

class StringPadder implements Padder {
    constructor(private value: string) { }
    getPaddingString() {
        return this.value;
    }
}

function getRandomPadder() {
    return Math.random() < 0.5 ?
        new SpaceRepeatingPadder(4) :
        new StringPadder("  ");
}

// 类型为SpaceRepeatingPadder | StringPadder
let padder: Padder = getRandomPadder();

if (padder instanceof SpaceRepeatingPadder) {
    padder; // 类型细化为'SpaceRepeatingPadder'
}
if (padder instanceof StringPadder) {
    padder; // 类型细化为'StringPadder'
}
```

  instanceof的右侧要求是一个构造函数，TypeScript将细化为：

      1、此构造函数的 prototype属性的类型，如果它的类型不为 any的话
      2、构造签名所返回的类型的联合

### 类型别名


  类型别名会给一个类型起个新名字。 类型别名有时和接口很像，但是可以作用于原始值，联合类型，元组以及其它任何你需要手写的类型。

```typescript
type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;
function getName(n: NameOrResolver): Name {
    if (typeof n === 'string') {
        return n;
    }
    else {
        return n();
    }
}
```

- 起别名不会新建一个类型 - 它创建了一个新 名字来引用那个类型

```typescript
// 同接口一样，类型别名也可以是泛型 - 我们可以添加类型参数并且在别名声明的右侧传入
type Container<T> = { value: T };
// 我们也可以使用类型别名来在属性里引用自己：
type Tree<T> = {
    value: T;
    left: Tree<T>;
    right: Tree<T>;
}
// 然而，类型别名不能出现在声明右侧的任何地方。
type Yikes = Array<Yikes>; // error
```

#### 接口 vs. 类型别名

 1、接口创建了一个新的名字，可以在其它任何地方使用。 类型别名并不创建新名字—比如，错误信息就不会使用别名。 在下面的示例代码里，在编译器中将鼠标悬停在 interfaced上，显示它返回的是 Interface，但悬停在 aliased上时，显示的却是对象字面量类型。

```typescript
type Alias = { num: number }
interface Interface {
    num: number;
}
declare function aliased(arg: Alias): Alias;
declare function interfaced(arg: Interface): Interface;
```
  2、类型别名不能被 extends和 implements（自己也不能 extends和 implements其它类型）

### 字符串字面量类型

  字符串字面量类型允许你指定字符串必须的固定值。 在实际应用中，字符串字面量类型可以与联合类型，类型保护和类型别名很好的配合
  可以用于区分函数重载

### 数字字面量类型


### 枚举成员类型

### 可辨识联合

### 多态的 this类型

### 索引类型

### 映射类型

## Symbols

## 迭代器和生成器

### 可迭代性

  当一个对象实现了Symbol.iterator属性时，我们认为它是可迭代的。 一些内置的类型如 Array，Map，Set，String，Int32Array，Uint32Array等都已经实现了各自的Symbol.iterator。 对象上的 Symbol.iterator函数负责返回供迭代的值。

#### for..of 语句

```typescript
// for..of会遍历可迭代的对象，调用对象上的Symbol.iterator方法。
let someArray = [1, "string", false];

for (let entry of someArray) {
    console.log(entry); // 1, "string", false
}
```

#### for..of vs. for..in 语句


```typescript
// for..of和for..in均可迭代一个列表；但是用于迭代的值却不同，for..in迭代的是对象的 键 的列表，而for..of则迭代对象的键对应的值。
let list = [4, 5, 6];

for (let i in list) {
    console.log(i); // "0", "1", "2",
}

for (let i of list) {
    console.log(i); // "4", "5", "6"
}
// 另一个区别是for..in可以操作任何对象；它提供了查看对象属性的一种方法。 但是 for..of关注于迭代对象的值。内置对象Map和Set已经实现了Symbol.iterator方法，让我们可以访问它们保存的值。
let pets = new Set(["Cat", "Dog", "Hamster"]);
pets["species"] = "mammals";

for (let pet in pets) {
    console.log(pet); // "species"
}

for (let pet of pets) {
    console.log(pet); // "Cat", "Dog", "Hamster"
}
```
## 参考文档

[typescript](https://www.tslang.cn/docs)



```typescript
```