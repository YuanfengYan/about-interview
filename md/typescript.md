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
  
  implements与extends的定位

  + [extends和implements的区别](https://blog.csdn.net/King_crazy/article/details/105665377) 
  + [Class属性Extends和Implements的区别 参考链接](https://blog.csdn.net/web_doris/article/details/11517759)
  
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

## **ts示例**

```javascript
// 联合数组类型
let ani: (string | number | boolean)[] = [1, '2', true]

type Ani = string | number | boolean
let ani2: Ani[] = [1, '2', true]

// 兼容
interface Named {
    name: string;
}

let x: Named;
let y = { name: 'Alice', location: 'Seattle' };
x = y;

// 交叉类型 type合并
type Name = { name: string } & { age: number }
// let name2:Name = {name:"jack"} //报错
let name2: Name = { name: "jack", age: 12 } //ok

// interface合并
interface User {
  name: string
  age: number
}
interface User {
  sex: string
}
let user: User = { name: 'xx', age: 18, sex: 'nan' }

type Alias = { num: number }
interface Interface {
    num: number;
}

type Easing = "ease-in" | "ease-out" | "ease-in-out";

// Color合并
interface Color { 
  name1: string,
  getname(): string,
  age: number|string,
  setage(age:number):void
}
interface Color { 
  name2: number,
}


interface Bg { 
  background:string
}
// 类实现多个接口
class MyColor implements Color,Bg{
  name1 = '2';
  name2 = 4;
  background: string;
  age: string;
  addr: string;
  setage(str) { 
    this.age = '12'
    return str
  };
  getname() { 
    return 'this.name'
  };
  constructor(public h: number, m: number) { 

  }

}
// 接口继承类
interface Info extends MyColor { 
  phone: string;
} 
class AnotherColor implements Info  { 
  name1 = '2';
  phone = '123';
  name2 = 4;
  background: string;
  age: string;
  addr: string;
  setage(str) { 
    this.age = '12'
    return str
  };
  getname() { 
    return 'this.name'
  };
  constructor(public h: number, m: number) { 

  }
}

// 接口继承接口
interface Shape {
    color: string;
}

interface PenStroke {
    penWidth: number;
}

interface Square extends Shape, PenStroke {
    sideLength: number;
}
class MySauqre implements Square { 
  color = '2';
  penWidth = 2;
  sideLength = 2;
}
console.log(new MySauqre().color)
const mycolor = new MyColor(1,2)


// 约束了loggingIdentity的T泛型，必须要是含有length为number 的属性
interface Lengthwise {
    length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);  // Now we know it has a .length property, so no more error
    return arg;
}
loggingIdentity({ length: 12 })

// 接口继承Type
type Name = { 
  name: string; 
}
interface User extends Name { 
  age: number; 
}

let user: User = {
  age: 12,
  name:'1'
}
// 命名空间
declare namespace API {
  interface ResponseList { }
  namespace API2 { 
    interface ABC { 
      a: string,
      b:number
    }
  }
}
let bb: API.API2.ABC = {
  a: '11',
  b: 123
}

```

## ts 内置工具

- [TS 里几个常用的内置工具类型（Record、Partial 、 Required 、 Readonly、 Pick 、 Exclude 、 Extract 、 Omit）的使用 -参考链接](https://blog.csdn.net/qq_43869822/article/details/121664818)

- [官方地址](https://www.typescriptlang.org/docs/handbook/utility-types.html)

  Capitalize  首字母大写
  Uppercase 字母大写
  Exclude 和 Extract

## ts练习

```javascript
interface Todo { 
    name: string,
    age: number,
    addr:string
}

// 实现Pick
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P]
}
interface Todo { 
    name: string,
    age: number,
    addr:string
}
type My = MyPick<Todo, "age" | "name">

const todo:My = {
    name: 'x',
    age: 2,

}
// 实现Readonly<T>
    // 方案一
type MyReadonly<T,K extends keyof T = keyof T> = {
  readonly[key in K]:T[key]
}
    // 方案二
type ReadOnly<T> = {
    readonly [K in keyof T]: T[K];
};
const r1:MyReadonly<Todo> = {
    name: '1',
    age: 2,
    addr:'1'
}
// r1.name = '2'
// 元组转换对象
// type TupleToObject<T extends readonly any[]>={ 
//   [Key in T[number]]:Key
// }
type First<T extends any[]> = T extends [infer F,infer S, ...infer Rest] ? S : never
type A1 = [number,string]
const arr1:A1 = [1, '2']
const a :First<A1> = '2'


interface Fish {
    fish: string
}
interface Water {
    water: string
}
interface Bird {
    bird: string
}
interface Sky {
    sky: string
}
//naked type
type Condition<T> = T extends Fish ? Water : Sky;
// type FishBird = Fish | Bird
let condition1: Condition<Fish | Bird> = { water: '水',sky: "ss"};
let condition2: Condition<Fish | Bird> = { sky: '天空' };
let condition3: Fish | Bird = { fish: '天空', bird: '' };
type Diff<T, U> = T extends U ? never : T;

type R = Diff<"a" | "b" | "c" | "d", "a" | "c" | "f">;  // "b" | "d"

 const add =function (a: number, b: number): number{ return a+b }
type aa = ReturnType<(a: number, b: number) => number>

// 第一个元素
type arr1 = [3, 2, 1]
type First1<T extends any[]> = T['length'] extends 0?never: T[0] 
type head1 = First1<arr1> //3

// 创建一个通用的Length，接受一个readonly的数组，返回这个数组的长度。

type tesla = ['tesla', 'model 3', 'model X', 'model Y']
type Length<T extends readonly any[]> = T['length'] 
type teslaLength = Length<tesla> // expected 4

// 实现内置的Exclude <T, U>类型
type MyExclude<T,U> =   T extends U ? never:T
type Result = MyExclude<'a' | 'b' | 'c', 'a'> // 'b' | 'c'

// Awaited
type ExampleType = Promise<string>
// type MyAwaited<T> = 
// type MyAwaited<T> = T extends Promise<infer Return> ? MyAwaited<Return> : T
type MyAwaited<T extends Promise<any>> = T extends Promise<infer I> ?
 I extends Promise<any> ? MyAwaited<I> : I 
 : never
type Result2 = MyAwaited<ExampleType> // string

// if
type IF<T extends boolean,U,K> = T extends true?U:K
type A = IF<false, 'a', 'b'>  // expected to be 'a'

// 在类型系统里实现 JavaScript 内置的 Array.concat 方法
type Concat<T extends any[],K extends any[]> = [...T,...K]
type Result3 = Concat<[1], [2]> // expected to be [1, 2]

// Includes
//  type Equals<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;
type IsEqual<X, Y> =
(<T>() => T extends X ? 1 : 2) extends
(<T>() => T extends Y ? 1 : 2) ? true : false
type Includes<T extends any[], U> = T extends  [infer First, ...infer Rest] ? IsEqual<First, U> extends true? true  : Includes<Rest, U> :false
type isPillarMen = Includes<['Kars', 'Esidisi', 'Wamuu', 'xxxx'], 'Dio'> // expected to be `false`

```
## ts中级练习
```javascript
// 中等题

// 实现一个通用MyReadonly2<T, K>，它带有两种类型的参数T和K。
// K指定应设置为Readonly的T的属性集。如果未提供K，则应使所有属性都变为只读，就像普通的Readonly<T>一样。
interface Todo {
  title: string
  description: string
  completed: boolean
}
type MyReadonly2<T,K extends keyof T = keyof T > = {
  readonly [key in K]:T[key] //把所有在k定义的键 readonly
}&{
   [key in keyof T as key extends K ? never : key] : T[key] ////把所有在k定义的键不设置，而不在的设置为非readyOnly
}
// type MyReadonly2<T,K extends keyof T = keyof T> = {
//   readonly [ P in K ]: T[P]
// } & {
//   -readonly [ P in keyof T as P extends K ? never : P]: T[P]
// }
const todo: MyReadonly2<Todo, 'title' | 'description'> = {
  title: "Hey",
  description: "foobar",
  completed: false,
}

todo.title = "Hello" // Error: cannot reassign a readonly property
todo.description = "barFoo" // Error: cannot reassign a readonly property
todo.completed = true // OK
// Omit
type AA =  {
  title: string,
  description: string,
  completed: boolean,
}

type oo = Omit<AA,'title' | 'description'>
// 实现一个通用的DeepReadonly<T>，它将对象的每个参数及其子对象递归地设为只读。
type X = { 
  x: { 
    a: 1
    b: 'hi'
  }
  y: 'hey'
}
type Expected = { 
  readonly x: { 
    readonly a: 1
    readonly b: 'hi'
  }
  readonly y: 'hey' 
}
type D = string | boolean | (() => any);

type DeepReadonly<T> = T extends D ? {
 readonly [key in keyof T] : T[key]
} : {
  readonly [key in keyof T] : DeepReadonly<T[key]>
}
type Todo2 = DeepReadonly<X> // should be same as `Expected`

// 实现泛型TupleToUnion<T>，它返回元组所有值的合集。
type Arr = ['1', '2', '3']
type TupleToUnion<T extends any[]> = T[number] 
type Test = TupleToUnion<Arr> // expected to be '1' | '2' | '3'

// 可串联构造器
// type Chainable<P extends {} = {}> = {
//   option<T extends string, K > (key:T extends keyof P? T:never,value:K):Chainable<P &{[T in P]:K}>,
// }
type Chainable<O = {}> = {
  option<K extends string, V>(k: K extends keyof O ? never : K, v: V): Chainable<Omit<O, K> & {
    [P in K]: V
  }>
  get(): O
}
declare const config: Chainable
const result = config
  .option('foo', 123)
  .option('name', 'type-challenges')
  .option('bar', { value: 'Hello World' })
  .get()

// 期望 result 的类型是：
interface Result {
  foo: number
  name: string
  bar: {
    value: string
  }
}

// 实现一个通用Last<T>，它接受一个数组T并返回其最后一个元素的类型。
type arr11 = ['a', 'b', 'c']
type arr21 = [3, 2, 1]
type Last<T extends any[]> = T extends [...infer L,infer R] ?R:undefined
type tail1 = Last<arr11> // expected to be 'c'
type tail2 = Last<arr21> // expected to be 1
// 实现一个通用Pop<T>，它接受一个数组T，并返回一个由数组T的前length-1项以相同的顺序组成的数组。
type arr1 = ['a', 'b', 'c', 'd']
type arr2 = []
type Pop<T extends any[]> = T extends [...infer L, infer R]?L:never
type re1 = Pop<arr1> // expected to be ['a', 'b', 'c']
type re2 = Pop<arr2> // expected to be [3, 2]
// Promise.all
// 键入函数PromiseAll，它接受PromiseLike对象数组，返回值应为Promise<T>，其中T是解析的结果数组。
const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise<string>((resolve, reject) => {
  setTimeout(resolve, 100, 'foo');
});
declare function PromiseAll<T extends readonly any[]>(
  values:readonly [...T]
): Promise<
  {
    [K in keyof T]: T[K] extends Promise<infer R> ? R : T[K];
  }
>;
// expected to be `Promise<[number, 42, string]>`
const p = PromiseAll([promise1, promise2, promise3] as const)

// Type Lookup 我们期望LookUp<Dog | Cat, 'dog'>获得Dog，LookUp<Dog | Cat, 'cat'>获得Cat。
interface Cat {
  type: 'cat'
  breeds: 'Abyssinian' | 'Shorthair' | 'Curl' | 'Bengal'
}

interface Dog {
  type: 'dog'
  breeds: 'Hound' | 'Brittany' | 'Bulldog' | 'Boxer'
  color: 'brown' | 'white' | 'black'
}
type LookUp<T,K extends string> = {
  [key in K] : T extends {type:K}?T:never
}[K]
// type LookUp<U, T extends string> = {
//   [K in T]: U extends { type: T } ? U : never
// }[T]
type MyDog = LookUp<Cat | Dog, 'dog'|'cat'> // expected to be `Cat|Dog`
type MyDog1 = LookUp<Cat | Dog, 'dog'> // expected to be `Dog`

// Trim Left 实现 TrimLeft<T> ，它接收确定的字符串类型并返回一个新的字符串，其中新返回的字符串删除了原字符串开头的空白字符串。
type TrimLeft<T extends string> = T extends `${' '|'\n'|'\t'}${infer s}`? TrimLeft<s>:T
type trimed = TrimLeft<'  Hello World  '> // 应推导出 'Hello World  '

// Capitalize 实现 Capitalize<T> 它将字符串的第一个字母转换为大写，其余字母保持原样。
type  MyCapitalize<T extends string> = T extends `${infer L}${infer R}`? `${Uppercase<L>}${R}`:T
type capitalized = MyCapitalize<'hello world'> // expected to be 'Hello world'

// Replace 实现 Replace<S, From, To> 将字符串 S 中的第一个子字符串 From 替换为 To 。
type Replace<S extends string, F extends string, T extends string> = S extends `${infer L}${F}${infer R}`?`${ L}${T}${ R}`:never
type replaced = Replace<'types are fun!', 'fun', 'awesome'> // 期望是 'types are awesome!'

// ReplaceAll 实现 ReplaceAll<S, From, To> 将一个字符串 S 中的所有子字符串 From 替换为 To。
type ReplaceAll<S extends string , F extends string, T extends string> = S extends `${infer L}${F}${infer R}`?ReplaceAll<`${L}${T}${R}`,F,T>:S
type replaced = ReplaceAll<'t y p e s', ' ', ''> // 期望是 'types'

// type C<T extends '23'> = T
// let a:C<'23'>

// 实现一个泛型 AppendArgument<Fn, A>，对于给定的函数类型 Fn，以及一个任意类型 A，返回一个新的函数 G。G 拥有 Fn 的所有参数并在末尾追加类型为 A 的参数。

type Fn = (a: number, b: string) => number
type AppendArgument<F ,D> = F extends (...arg:infer R)=>infer T ?(...arg:[...R,T])=>T:never
type Result = AppendArgument<Fn, boolean> 

// Permutation
// 实现联合类型的全排列，将联合类型转换成所有可能的全排列数组的联合类型。
type Permutation<T,U =T> = [T] extends [never]?[]:T extends U ? [T, ...Permutation<Exclude<U,T>>]:never //之所以用[T] extends 官方介绍https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types
type perm = Permutation<'A' | 'B' | 'C'>; // ['A', 'B', 'C'] | ['A', 'C', 'B'] | ['B', 'A', 'C'] | ['B', 'C', 'A'] | ['C', 'A', 'B'] | ['C', 'B', 'A']

// 在这个挑战中，你需要写一个接受数组的类型，并且返回扁平化的数组类型。
type Flatten<T extends any[]> =T['length'] extends 0? []:T extends [infer L, ...infer R] ? 
    L extends any[]?
        [...Flatten<L>,...Flatten<R>]:[L,...Flatten<R>]
    : never
type flatten = Flatten<[1, 2, [3, 4], [[[5]]]]> // [1, 2, 3, 4, 5]

// 实现一个为接口添加一个新字段的类型。该类型接收三个参数，返回带有新字段的接口类型。
type Test = { id: '1' }
type Merge<T> = {
  [P in keyof T]: T[P]
}
type AppendToObject<T extends object,K extends string,V extends any> = Merge<{
    [key in keyof T] :T[key]
}&{
   [key in K]:V
}>
type Result = AppendToObject<Test, 'value', 4> // expected to be { id: '1', value: 4 }

// 实现一个接收string,number或bigInt类型参数的Absolute类型,返回一个正数字符串。

type Test2 = -100;
type Absolute<T extends string|number> = `${T}` extends `-${infer S}` ? S:T 
type Result2 = Absolute<Test2>; // expected to be "100"

// 实现一个将接收到的String参数转换为一个字母Union的类型。
type Test3 = '123';
type StringToUnion<T extends string> = T extends ''?never: T extends  `${infer N}${infer OTHER}` ? N|StringToUnion<OTHER>:never
type Result3 = StringToUnion<Test3>; // expected to be "1" | "2" | "3"

// Merge
// 将两个类型合并成一个类型，第二个类型的键会覆盖第一个类型的键。
type foo = {
  name: string;
  age: string;
}
type coo = {
  age: number;
  sex: string
}
type Merge3<T extends object,K extends object> = {
    [key in keyof T]:T[key],
}
type Merge2<T, U> = {
  [K in keyof (T & U)]: K extends keyof U
    ? U[K]
    : K extends keyof T
    ? T[K]
    : never;
};

// type Merge3<T, U> = Omit<Omit<T, keyof U> & U, never>;

type Result4 = Merge3<foo,coo>; // expected to be {name: string, age: number, sex: string}

// KebabCase 大写字母转-

type FirstLowcase<T extends string> = T extends `${infer F}${infer R}`
  ? F extends Lowercase<F> ? T : `${Lowercase<F>}${R}`
  : T //第一个字母转小写
type KebabCase<T extends string>= T extends `${infer F}${infer R}`?R extends FirstLowcase<R> ? `${FirstLowcase<F>}${KebabCase<R>}`:`${FirstLowcase<F>}-${KebabCase<FirstLowcase<R>>}` :T

type FooBarBaz = KebabCase<"FooBarBaz">;
const foobarbaz: FooBarBaz = "foo-bar-baz";

type DoNothing = KebabCase<"do-nothing">;
const doNothing: DoNothing = "do-nothing";

// 获取两个接口类型中的差值属性。
type Foo = {
  a: string;
  b: number;
}
type Bar = {
  a: string;
  c: boolean
}
type Comtype = Exclude<keyof Bar, keyof Foo>
// 一
// type Diff<T ,K  > = {
//     [key in Exclude<keyof T, keyof K>|Exclude<keyof K, keyof T>]: key extends keyof T? T[key] : K[key],
// }
// 二
type Diff<O, O1> = {[K in keyof O|keyof O1 as K extends keyof O?K extends keyof O1?never:K:K]:K extends keyof O1?O1[K]:K extends keyof O?O[K]:never}

type Result11 = Diff<Foo,Bar> // { b: number, c: boolean }
type Result22 = Diff<Bar,Foo> // { b: number, c: boolean }

// AnyOf
type Falsy = '' | [] | false | Record<keyof any, never> | 0;
type AnyOf<T extends any[]> = T[number] extends Falsy ? false : true;
type Sample1 = AnyOf<[1, '', false, [], {}]> // expected to be true.
type Sample2 = AnyOf<[0, '', false, [], {}]> // expected to be false.

// IsUnion
type IsUnion<T, B = T> = T extends T
  ? [Exclude<B, T>] extends [never]
    ? false
    : true
  : never; 
type case1 = IsUnion<string>  // false
type case2 = IsUnion<string|number>  // true
type case3 = IsUnion<[string|number]>  // false
// ReplaceKeys

type NodeA = {
  type: 'A'
  name: string
  flag: number
}
type NodeB = {
  type: 'B'
  id: number
  flag: number
}
type NodeC = {
  type: 'C'
  name: string
  flag: number
}
type ReplaceKeys<U, T extends keyof any, Y extends Record<any, any>, G = U> =
  U extends G
    ? {
      [k in keyof U]: k extends T
        ? keyof Y extends T
          ? Y[k]
          : never
        : U[k]
    }
    : never
type Nodes = NodeA | NodeB | NodeC
type ReplacedNodes = ReplaceKeys<Nodes, 'name' | 'flag', {name: number, flag: string}> // {type: 'A', name: number, flag: string} | {type: 'B', id: number, flag: string} | {type: 'C', name: number, flag: string} // would replace name from string to number, replace flag from number to string.
type ReplacedNotExistKeys = ReplaceKeys<Nodes, 'name', {aa: number}> // {type: 'A', name: never, flag: number} | NodeB | {type: 'C', name: never, flag: number} // would replace name to never
// 实现类型 PercentageParser。根据规则 /^(\+|\-)?(\d*)?(\%)?$/ 匹配类型 T。

type PString1 = ''
type PString2 = '+85%'
type PString3 = '-85%'
type PString4 = '85%'
type PString5 = '85'

type IsSigns<T> = T extends '+' | '-' ? T : never;
type GetNumber<T> = 
  T extends `${IsSigns<infer R>}${infer L}` 
  ? [R, L] 
  : ['', T]
type PercentageParser<A extends string> = A extends `${infer R}%`
  ? [...GetNumber<R>, '%']
  : [...GetNumber<A>, '']
type R1 = PercentageParser<PString1> // expected ['', '', '']
type R2 = PercentageParser<PString2> // expected ["+", "85", "%"]
type R3 = PercentageParser<PString3> // expected ["-", "85", "%"]
type R4 = PercentageParser<PString4> // expected ["", "85", "%"]
type R5 = PercentageParser<PString5> // expected ["", "85", ""]

// 从字符串中剔除指定字符。
type DropChar<T extends string, K extends string> = T extends `${infer R}${infer L}` ? R extends K ? DropChar<L,K>:`${R}${DropChar<L,K>}` :''
// type DropChar<S, C> = S extends `${infer F}${infer R}`
//     ? `${F extends C ? '' : F}${DropChar<R, C>}`
//     : ''
// type DropChar<S extends string, C extends string > = S extends `${infer First}${C}${infer Rest}`?`${First}${DropChar<Rest, C>}`:  S
type Butterfly = DropChar<' b u t t e r f l y ! ', ' '> // 'butterfly!'

// PickByType
type PickByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};
type OnlyBoolean = PickByType<{
  name: string
  count: number
  isReadonly: boolean
  isEnable: boolean
}, boolean> // { isReadonly: boolean; isEnable: boolean; }

// StartsWith
type StartsWith<T extends string, C extends string> = T extends `${C}${infer R}`?true :false
type a = StartsWith<'abc', 'ac'> // expected to be false
type b = StartsWith<'abc', 'ab'> // expected to be true
type c = StartsWith<'abc', 'abcd'> // expected to be false

// PartialByKeys
interface User {
  name: string
  age: number
  address: string
}
type Merge<T> = {
    [key in keyof T]:T[key]
}
type PartialByKeys<T extends Record<any,any>, K extends keyof T> = Merge<{
     [key in keyof T as key extends K?key:never]?:T[key]
}&
{
    [key in keyof T as key extends K?never:key]:T[key]
}>
// type Copy<T> = {
//   [P in keyof T]: T[P]
// }

// type PartialByKeys<T, K = keyof T> = Copy<Omit<T, K & keyof T> & {
//   [P in K & keyof T]?: T[P]
// }>

type UserPartialName = PartialByKeys<User, 'name'> // { name?:string; age:number; address:string }

// RequiredByKeys
interface User {
  name?: string
  age?: number
  address?: string
}
type Merge<T> = {
    [key in keyof T]:T[key]
}
type RequiredByKeys<T,K extends keyof T> = Merge<{
    [key in keyof T as key extends K? key:never]-?:T[key]
}&{
    [key in keyof T as key extends K? never:key]:T[key]
}>
type UserRequiredName = RequiredByKeys<User, 'name'> // { name: string; age?: number; address?: string }
// 实现一个通用的类型 Mutable<T>，使类型 T 的全部属性可变（非只读）。
interface Todo {
  readonly title: string
  readonly description: string
   completed: boolean
}
type Mutable<T extends Record<any,any>> = {
    -readonly [key in keyof T]:T[key]
}
type MutableTodo = Mutable<Todo> // { title: string; description: string; completed: boolean; }

// OmitByType
type OmitByType<T extends object, K extends any> = {
    [key in keyof T as T[key] extends K ?never:key]: T[key]
}
type OmitBoolean = OmitByType<{
  name: string
  count: number
  isReadonly: boolean
  isEnable: boolean
}, boolean> // { name: string; count: number }

// Object.entries
interface Model {
  name: string;
  age: number;
  locations: string[] | null;
}
type ObjectEntries<T> = {
  [K in keyof T]-?: [K, T[K] extends undefined ? undefined : Exclude<T[K], undefined>]
}[keyof T]

type modelEntries = ObjectEntries<Model> // ['name', string] | ['age', number] | ['locations', string[] | null];

// Shift
type Shift<T extends any[]> = [...T] extends [infer L,...infer R] ?R:[]
type Result = Shift<[3, 2, 1]> // [2, 1]

// Tuple to Nested Object medium #object 元组到嵌套对象介质
type TupleToNestedObject<T extends any[], V extends any> = T['length'] extends 0?V:
    T extends [infer F,...infer Rest]?
        { [key in F & string]: TupleToNestedObject<Rest, V> }
    :V


type a = TupleToNestedObject<['a'], string> // {a: string}
type b = TupleToNestedObject<['a', 'b'], number> // {a: {b: number}}
type c = TupleToNestedObject<[], boolean> // boolean. if the tuple is empty, just return the U type

// 实现类型版本的数组反转 Array.reverse
type Reverse<T extends any[]> = T['length'] extends 0 ?[]:[...T] extends [infer F,...infer Rest]  ? [...Reverse<Rest>,F]:[]
type a1 = Reverse<['a', 'b']> // ['b', 'a']
type b1 = Reverse<['a', 'b', 'c']> // ['c', 'b', 'a']

// Type FlipArguments<T>需要函数类型T，并返回一个新的函数类型，该函数类型的返回类型与T相同，但参数相反。
// type Reverse<T> = T extends [infer A, ...infer B] ? [...Reverse<B>, A] : []
type FlipArguments<T> = T extends (...args: infer A) => infer R ? (...args: Reverse<A>) => R : never
type Flipped = FlipArguments<(arg0: string, arg1: number, arg2: boolean) => void> 
// (arg0: boolean, arg1: number, arg2: string) => void

```
## 其他


- [ts的.d.ts和declare究竟是干嘛用的](https://blog.csdn.net/qq_34551390/article/details/118800743)

## 参考文档

[typescript](https://www.tslang.cn/docs)

- [typescript （TS）进阶篇 --- 内置高阶泛型工具类型（Utility Type）](https://blog.csdn.net/m0_52409770/article/details/123049461)
- [typescript在线练习](https://www.tslang.cn/play/index.html)
- [typescript在线练习2](https://www.typescriptlang.org/play)
- [type-challenges](https://github.com/type-challenges/type-challenges/blob/main/README.zh-CN.md)

```typescript
```
