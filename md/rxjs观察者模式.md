# rxjs观察者模式

## rxjs基本知识

### Observables

+ ①是多个值的惰性推送集合( 什么是推送？ - 在推送体系中，由生产者来决定何时把数据发送给消费者。消费者本身不知道何时会接收到数据。)
+ ② 订阅 Observable 类似于调用函数。
+ ③ Observables 是使用 Rx.Observable.create 或创建操作符创建的。通过 Next,Error,Complete进行传递数据
+ ④ Subscription 表示进行中的执行, 使用 subscription.unsubscribe() 你可以取消进行中的执行var subscription  = observable.subscribe(x => console.log(x)); subscription.unsubscribe();

### Observer观察者

观察者是由 Observable 发送的值的消费者。观察者只是一组回调函数的集合，每个回调函数对应一种 Observable 发送的通知类型：next、error 和 complete

### Subscription

 Subscription 是表示可清理资源的对象，通常是 Observable 的执行。

### Subject

 Subject 是一种特殊类型的 Observable，它允许将值多播给多个观察者，所以 Subject 是多播的，而普通的 Observables 是单播的(每个已订阅的观察者都拥有 Observable 的独立执行)。

>他即是被观察者，也是观察者

## Rxjs优点

- 纯净性：通过pipe（scan等）无需使用外部共享变量，组成纯函数
 
- 流动性：Rxjs提供了一套操作符控制事件如何流经observables ( filter、delay、debounceTime、take、takeUntil、distinct、distinctUntilChanged 等等。)

- 值：对流经的值进行转换
