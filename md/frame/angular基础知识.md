# angular基础知识

## 基础知识

### 一、模块  @NgModule

* 为组件提供编译的上下文环境
* 专注于某个应用领域、某个工作流或一组紧密相关的能力 将其组件和一组相关代码（如服务）关联起来形成特性模块 。通过 exports 属性公开其中的一部分，以便外部组件使用它们
* ngModule可以导入其他ngModule导入功能，并允许导出它们自己的功能供其他ngModule使用。
* 特性模块可以=》按需加载模块（惰性加载）

#### 特性模块分类

1. 领域特性模块。（ 比如编辑客户信息或下订单等）
2. 带路由的特性模块。（ 一种特殊的领域特性模块，但它的顶层组件会作为路由导航时的目标组件）
3. 路由模块。
4. 服务特性模块 ( 比如数据访问和消息,  HttpClientModule 就是一个服务模块的好例子. 根模块 AppModule 是唯一的可以导入服务模块的模块)
5. 可视部件特性模块 。 ( 很多第三方 UI 组件库)

#### api:

1. declarations:属于该模块的可声明对象的列表：（组件、指令、管道）
2. providers：依赖注入提供者的列表
3. imports： 被导入的模块中导出的那些软件资产同样会被声明在这里
4. exports：该模块的可声明对象的列表区别于1 供其他导入它的模块使用 （声明（ declaration ）的子集，可用于其它模块中的组件模板 ）
5. bootstrap：自启动组件列表（通常只用一个就是根组件）
6. entryComponents：可以动态载入视图的组件列表

### 二、组件 @Component

创建命令  ng generate component name
创建 Angular 组件的方法有三步：

+ 从 @angular/core 中引入 Component 修饰器
+ 建立一个普通的类，并用 @Component 修饰它
+ 在 @Component 中，设置 selector 自定义标签，以及 template 模板

### 三、模板 Templates

         模板的默认语言就是HTML。

### 四、数据绑定 

    ①插值： {{title}}

    ②属性绑定 [propertyName]="xxxx"

    ③事件绑定 (click) = "xxxx"

    ④ 双向绑定 <input [value]="currentUser.firstName" 
          (input)="currentUser.firstName=$event.target.value" >

### 五、指令 Directives（ \*ngFor \*ngIf）

三种类型的指令：

    ① 属性指令：以元素的属性形式来使用的指令。

    ② 结构指令：用来改变DOM树的结构

    ③ 组件：作为指令的一个重要子类，组件本质上可以看作是一个带有模板的指令。

### 六、服务 Services

* 对于与特定视图无关并希望跨组件共享的数据或逻辑，可以创建服务类
* 封装了某一特定功能，并且可以通过注入的方式供他人使用的独立模块。
* 服务分为很多种，包括：值、函数，以及应用所需的特性。

组件和模块分开，是为了高模块性和复用性

服务类注册到注入器：

        @injectable 元数据中的providedIn属性

        @NgModule 元数据中的providers属性

        @Component 元数据中的providers属性

### 七、依赖注入 它是一种编程模式，可以让类从外部源中获他的依赖，热不必亲自创建他们

### 八、装饰器

## 生命周期

+ <font color="bule">首次初始化</font>

1. 父组件构造器constructor =》子组件构造器constructor
2. 父组件ngOnInit (可以拿到dom) =》父组件 ngAfterContentInit =》父组件ngAftercontentChecked
3. 子组件ngOnChanges =》子组件ngOnInit =》
4. 子组件ngAfterContentInit =》 子组件ngAfterContentChecked
5. 子组件ngAfterViewInit =》子组件ngAfterViewChecked
6. 父组件 ngAfterViewInit =》父组件ngAfterViewChecked

+ <font color="bule">切换父组件传入子组件的值</font>

7. 父组件 ngAfterContentChecked
8. 子组件 ngOnChanges  =》子组件ngAfterContentChecked =》子组件 ngAfterViewChecked
9. 父组件 ngAfterViewChecked

## 父子组件通信

1. 父组件=》子组件  [prop]="value" @Input() prop :<any>
2. 子组件 =》父组件  @Output() event :EventEmitter<any>=new EventEmitter()  =>this.event.emit(val)
3. 本地变量引用#var
4. @ViewChild

## 安装环境

### 删除当前环境

    cnpm uninstall -g @angular/cli //卸载之前的版本
    cnpm cache clean --force //清理缓存，确保卸载干净
    ng v //若显示类似command not found的信息，则说明卸载完成

### 安装指定版本

    cnpm install -g @angular/cli@8.0.3 //指定安装版本