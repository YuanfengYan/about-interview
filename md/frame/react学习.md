# react学习

## 核心概念

### Hello World

```javascript
ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('root')
);
```

### JSX简介

- 标签语法
- 很好地描述 UI 应该呈现出它应有交互的本质形式
- 渲染逻辑 与其他 UI 逻辑内在耦合
- 会在视觉上有辅助作用， 显示更多有用的错误和警告消息

#### 用法

- 大括号内放置任何有效的 JavaScript 表达式 （2 + 2，user.firstName 或 formatName(user)）

```javascript
const name = 'Josh Perez';
const element = <h1>Hello, {name}</h1>;

ReactDOM.render(
  element,
  document.getElementById('root')
);
```

- 你可以通过使用引号，来将属性值指定为字符串字面量

```javascript
const element = <div tabIndex="0"></div>;
```

- Babel 会把 JSX 转译成一个名为 React.createElement()

```javascript
const element = (
  <h1 className="greeting">
    Hello, world!
  </h1>
);
// 等价于
const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Hello, world!'
);
```

### 元素渲染

  与浏览器的 DOM 元素不同，React 元素是创建开销极小的普通对象。React DOM 会负责更新 DOM 来与 React 元素保持一致。  

1. 更新已渲染的元素

更新 UI 唯一的方式是创建一个全新的元素，并将其传入

### 函数组件 与 class组件

```javascript
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
// 等效于
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

函数组件：它接收唯一带有数据的 “props”（代表属性）对象与并返回一个 React 元素。本质就是Javascript函数

- 组件的组合  
如果 UI 中有一部分被多次使用（Button，Panel，Avatar），或者组件本身就足够复杂（App，FeedStory，Comment），那么它就是一个可复用组件的候选项。

- Props 的只读性  
React 组件都必须像纯函数一样保护它们的 props 不被更改。  

### State & 生命周期

State 与 props 类似，但是 state 是```私有的```，并且完全受控于当前组件。

- 将函数组件转换成 class 组件
    1. 创建一个同名的 ES6 class，并且继承于 React.Component。
    2. 添加一个空的 render() 方法。
    3. 将函数体移动到 render() 方法之中。
    4. 在 render() 方法中使用 this.props 替换 props。
    5. 删除剩余的空函数声明。

- Class 生命周期
    - componentDidMount：在组件已经被渲染到 DOM 中后运行
    - componentWillUnmount：组件从 DOM 中被移除

- 正确地使用 State
    - 不要直接修改 State
    - 构造函数是唯一可以给 this.state 赋值的地方
    - State 的更新可能是异步的 ，不要依赖他们的值来更新下一个状态。（解决办法：setState() 接收一个函数而不是一个对象，这个函数用上一个 state 作为第一个参数，将此次更新被应用时的 props 做为第二个参数）
    ```javascript
    this.setState((state, props) => ({
        counter: state.counter + props.increment
    }));
    ```
    - State 的更新会被合并,这里的合并是浅合并

- 数据是向下流动的

### 事件处理

+ React 事件的命名采用小驼峰式（camelCase），而不是纯小写。
+ 使用 JSX 语法时你需要传入一个函数作为事件处理函数，而不是一个字符串。
+ 在 React 中不能通过返回 false 的方式阻止默认行为。你必须显式的使用 preventDefault 。(e.preventDefault();
+ this的绑定方式
    ```html
    <!-- 分别通过箭头函数和 Function.prototype.bind 来实现。 -->
    <button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>
    <button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>
    ```

### 条件渲染

1. 元素变量  
2. 运算符 &&
3. 三目运算符  
4. 阻止组件渲染  

    ```javascript
        // 在极少数情况下，你可能希望能隐藏组件，即使它已经被其他组件渲染。若要完成此操作，你可以让 render 方法直接返回 null，而不进行任何渲染。
        function WarningBanner(props) {
            if (!props.warn) {
                return null;
            }

            return (
                <div className="warning">
                Warning!
                </div>
            );
        }

    ```  

### 列表 & Key

- 渲染多个组件
    通过map() 方法来遍历 numbers 数组
- key
    - 如果列表项目的顺序可能会变化，我们不建议使用索引来用作 key 值，因为这样做会导致性能变差，还可能引起组件状态的问题
    - key 只是在兄弟节点之间必须唯一

### 表单

- 受控组件
    渲染表单的 React 组件还控制着用户输入过程中表单发生的操作。被 React 以这种方式控制取值的表单输入元素就叫做“受控组件”。
- textarea 标签
- select 标签
    由于 selected 属性的缘故，椰子选项默认被选中。React 并不会使用 selected 属性，而是在根 select 标签上使用 value 属性。这在受控组件中更便捷，因为您只需要在根标签中更新它

    ```html
     <select value={this.state.value} onChange={this.handleChange}>
            <option value="grapefruit">葡萄柚</option>
            <option value="lime">酸橙</option>
            <option value="coconut">椰子</option>
            <option value="mango">芒果</option>
          </select>
    ```

- 处理多个输入
    当需要处理多个 input 元素时，我们可以给每个元素添加 name 属性，并让处理函数根据 event.target.name 的值选择要执行的操作。

    ```javascript
      handleInputChange(event) {
            const target = event.target;
            const value = target.name === 'isGoing' ? target.checked : target.value;
            const name = target.name;

            this.setState({
            [name]: value
            });
        }
         <input
            name="isGoing"
            type="checkbox"
            checked={this.state.isGoing}
            onChange={this.handleInputChange} />
          <input
            name="numberOfGuests"
            type="number"
            value={this.state.numberOfGuests}
            onChange={this.handleInputChange} />
    ```

### 状态提升

- 将多个组件中需要共享的 state 向上移动到它们的最近共同父组件中，便可实现共享 state。这就是所谓的“状态提升”
- 因为props是不能改变的，通过子组件调用 this.props.fn(e.target.value);进行调用父组件的方法改变共享state

### 组合 vs 继承

1. 包含关系

- 有些组件无法提前知晓它们子组件的具体内容 使用一个特殊的 children prop 来将他们的子组件传递到渲染结果中：

    ```javascript
    function FancyBorder(props) {
        return (
            <div className={'FancyBorder FancyBorder-' + props.color}>
            {props.children}
            </div>
        );
    }
    ```  

- 当有多个插槽时，可以将子组件以props的方式传递进去渲染

    ```javascript
    function SplitPane(props) {
        return (
            <div className="SplitPane">
            <div className="SplitPane-left">
                {props.left}
            </div>
            <div className="SplitPane-right">
                {props.right}
            </div>
            </div>
        );
    }

    function App() {
        return (
            <SplitPane
            left={
                <Contacts />
            }
            right={
                <Chat />
            } />
        );
    }
    ```  

2. 特例关系

- “特殊”组件可以通过 props 定制并渲染“一般”组件：

3. React没有使用继承来构建组件层次的情况。

4. 如果你想要在组件间复用非 UI 的功能，我们建议将其提取为一个单独的 JavaScript 模块，如函数、对象或者类。组件可以直接引入（import）而无需通过 extend 继承它们。


## 高级指引

### 无障碍

### 代码分割

- 打包工具 （Webpack,Rolluo Browserify）进行打包，可以创建多个包进行运行时动态加载
- import()
- React.lazy
    - React.lazy 接受一个函数，这个函数需要动态调用 import()。它必须返回一个 Promise，该 Promise 需要 resolve 一个 defalut export 的 React 组件。  
    - 下面的代码会在首次渲染时，自动导入

    ```javascript
    const OtherComponent = React.lazy(() => import('./OtherComponent'));
    ```

    - 应在 Suspense 组件中渲染 lazy 组件，并且可以添加熟悉fallbank ,fallback 属性接受任何在组件加载过程中你想展示的 React 元素(可以包含多个懒加载组件)
    - 命名导出 (React.lazy 目前只支持默认导出（default exports）。如果你想被引入的模块使用命名导出（named exports），你可以创建一个中间模块，来重新导出为默认模块)

    ```javascript
    // ManyComponents.js
    export const MyComponent = /* ... */;
    export const MyUnusedComponent = /* ... */;
    // MyComponent.js
    export { MyComponent as default } from "./ManyComponents.js";
    // MyApp.js
    import React, { lazy } from 'react';
    const MyComponent = lazy(() => import("./MyComponent.js"));
    ```

- 异常捕获边界
- 基于路由的代码分割

    ```javascript
    import React, { Suspense, lazy } from 'react';
    import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

    const Home = lazy(() => import('./routes/Home'));
    const About = lazy(() => import('./routes/About'));

    const App = () => (
    <Router>
        <Suspense fallback={<div>Loading...</div>}>
        <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/about" component={About}/>
        </Switch>
        </Suspense>
    </Router>
    );
    ```

### Context

    Context 提供了一种在组件之间共享此类值的方式  

- 何时使用 Context

	为了共享那些对于一个组件树而言是“全局”的数据

	```javascript
	// Context 可以让我们无须明确地传遍每一个组件，就能将值深入传递进组件树。
	// 为当前的 theme 创建一个 context（“light”为默认值）。
	const ThemeContext = React.createContext('light');  
	class App extends React.Component {  
	render() {
		// 使用一个 Provider 来将当前的 theme 传递给以下的组件树。
			// 无论多深，任何组件都能读取这个值。
			// 在这个例子中，我们将 “dark” 作为当前的值传递下去。
			return (
			<ThemeContext.Provider value="dark">
				<Toolbar />
			</ThemeContext.Provider>
			);
		}
	}
	// 中间的组件再也不必指明往下传递 theme 了。
	function Toolbar() {
	return (
		<div>
		<ThemedButton />
		</div>
	);
	}

	class ThemedButton extends React.Component {
	// 指定 contextType 读取当前的 theme context。
	// React 会往上找到最近的 theme Provider，然后使用它的值。
	// 在这个例子中，当前的 theme 值为 “dark”。
		static contextType = ThemeContext;
		render() {
			return <Button theme={this.context} />;
		}
	}
	```

- 使用 Context 之前的考虑

	- 如果你只是想避免层层传递一些属性 --考虑组合组件  

- API

	- React.createContext

		```javascript
			const MyContext = React.createContext(defaultValue);
		```

		创建一个 Context 对象。当 React 渲染一个订阅了这个 Context 对象的组件，这个组件会从组件树中离自身最近的那个匹配的 Provider 中读取到当前的 context 值。
		只有当组件所处的树中没有匹配到 Provider 时，其 defaultValue 参数才会生效

	- Context.Provider

		```javascript
			<MyContext.Provider value={/* 某个值 */}>
		```

		- Provider 接收一个 value 属性，传递给消费组件
		- 一个 Provider 可以和多个消费组件有对应关系
		- 多个 Provider 也可以嵌套使用，里层的会覆盖外层的数据。
		- 当 Provider 的 value 值发生变化时，它内部的所有消费组件都会重新渲染。

	- Class.contextType

		- 挂载在 class 上的 contextType 属性会被重赋值为一个由 React.createContext() 创建的 Context 对象。这能让你使用 this.context 来消费最近 Context 上的那个值。
		- 你只通过该 API 订阅单一 context。
		- 使用

			```javascript
				MyClass.contextType = MyContext;
				//等价于
				static contextType = MyContext;
			```

	- Context.Consumer

		```javascript
			<MyContext.Consumer>
			{value => /* 基于 context 值进行渲染*/}
			</MyContext.Consumer>
		```

		- 这能让你在函数式组件中完成订阅 context。
		- 这需要```函数作为子元素（function as a child）```这种做法

	- Context.displayName

		- React DevTools 使用该字符串来确定 context 要显示的内容。

		```javascript
			const MyContext = React.createContext(/* some value */);
			MyContext.displayName = 'MyDisplayName';

			<MyContext.Provider> // "MyDisplayName.Provider" 在 DevTools 中
			<MyContext.Consumer> // "MyDisplayName.Consumer" 在 DevTools 中
		```

- 示例应用

	- 动态 Context  
		原理：在子组件外包上Content.Provider 传入value (值为父组件中的state状态)，子组件props传入父组件的方法（该方法是改变父组件的state），在子组件中就可以进行调用父组件的方法，进而实现动态context

	- 在嵌套组件中更新 Context  
		- 从一个在组件树中```嵌套很深```的组件中更新 context 是很有必要的。在这种场景下，你可以通过 context 传递一个函数，使得 consumers 组件更新 context：

		```javascript
			//theme-context.js
			// 确保传递给 createContext 的默认值数据结构是调用的组件（consumers）所能匹配的！
			export const ThemeContext = React.createContext({
				theme: themes.dark,
				toggleTheme: () => {},
			});

			//theme-toggler-button.js
			import {ThemeContext} from './theme-context';

			function ThemeTogglerButton() {
			// Theme Toggler 按钮不仅仅只获取 theme 值，它也从 context 中获取到一个 toggleTheme 函数
			return (
				<ThemeContext.Consumer>
				{({theme, toggleTheme}) => (
					<button          onClick={toggleTheme}
					style={{backgroundColor: theme.background}}>

					Toggle Theme
					</button>
				)}
				</ThemeContext.Consumer>
			);
			}
			export default ThemeTogglerButton;

			//app.js
			import {ThemeContext, themes} from './theme-context';
			import ThemeTogglerButton from './theme-toggler-button';

			class App extends React.Component {
			constructor(props) {
				super(props);

				this.toggleTheme = () => {
				this.setState(state => ({
					theme:
					state.theme === themes.dark
						? themes.light
						: themes.dark,
				}));
				};

				// State 也包含了更新函数，因此它会被传递进 context provider。
				this.state = {
				theme: themes.light,
				toggleTheme: this.toggleTheme,
				};
			}

			render() {
				// 整个 state 都被传递进 provider
				return (
				<ThemeContext.Provider value={this.state}>
					<Content />
				</ThemeContext.Provider>
				);
			}
			}

			function Content() {
			return (
				<div>
				<ThemeTogglerButton />
				</div>
			);
			}

			ReactDOM.render(<App />, document.root);
		```

	- 消费多个 Context  
		原因：为了确保 context 快速进行重渲染，React 需要使每一个 consumers 组件的 context 在组件树中成为一个单独的节点。  
		其他：如果两个或者更多的 context 值经常被一起使用，那你可能要考虑一下另外创建你自己的渲染组件，以提供这些值。

- 注意事项

	为了防止```当 provider 的父组件进行重渲染时，可能会在 consumers 组件中触发意外的渲染```，将 value 状态提升到父节点的 state 里

### 错误边界

- 错误边界无法捕获以下场景中产生的错误
	- 事件处理
	- 异步代码（例如 setTimeout 或 requestAnimationFrame 回调函数）
	- 服务端渲染
	- 它自身抛出来的错误（并非它的子组件）  

- 示例代码

	```javascript
		class ErrorBoundary extends React.Component {
		constructor(props) {
			super(props);
			this.state = { hasError: false };
		}

		static getDerivedStateFromError(error) {
			// 更新 state 使下一次渲染能够显示降级后的 UI
			return { hasError: true };
		}

		componentDidCatch(error, errorInfo) {
			// 你同样可以将错误日志上报给服务器
			logErrorToMyService(error, errorInfo);
		}

		render() {
			if (this.state.hasError) {
			// 你可以自定义降级后的 UI 并渲染
			return <h1>Something went wrong.</h1>;
			}

			return this.props.children; 
		}
		}
	```

### Refs转发

  Ref 转发是一个可选特性，其允许某些组件接收 ref，并将其向下传递（换句话说，“转发”它）给子组件。

  ```javascript
  const FancyButton = React.forwardRef((props, ref) => (
	<button ref={ref} className="FancyButton">
		{props.children}
	</button>
	));

	// 你可以直接获取 DOM button 的 ref：
	const ref = React.createRef();
	<FancyButton ref={ref}>Click me!</FancyButton>;
  ```
  这样父组件可以访问子组件的Dom

		步骤：
		1. 我们通过调用 React.createRef 创建了一个 React ref 并将其赋值给 ref 变量。  
		2. 我们通过指定 ref 为 JSX 属性，将其向下传递给 <FancyButton ref={ref}>。  
		3. React 传递 ref 给 forwardRef 内函数 (props, ref) => ...，作为其第二个参数。  
		4. 我们向下转发该 ref 参数到 <button ref={ref}>，将其指定为 JSX 属性。  
		5. 当 ref 挂载完成，ref.current 将指向 <button> DOM 节点。 

- 注意
	- 第二个参数 ref 只在使用 React.forwardRef 定义组件时存在。常规函数和 class 组件不接收 ref 参数，且 props 中也不存在 ref。
	- Ref 转发不仅限于 DOM 组件，你也可以转发 refs 到 class 组件实例中。

- 在高阶组件中转发 refs

	待补充....

### Fragments

	React 中的一个常见模式是一个组件返回多个元素。Fragments 允许你将子列表分组，而无需向 DOM 添加额外节点。

- 示例 

	```javascript
	//Fragments写法
	class Columns extends React.Component {
	render() {
		return (
			<React.Fragment>
				<td>Hello</td>
				<td>World</td>
			</React.Fragment>
			);
		}
	}
	//短语法写法
	class Columns extends React.Component {
	render() {
		return (
		<>
			<td>Hello</td>
			<td>World</td>
		</>
		);
	}
	}
	```

### 高阶组件

	高阶组件是参数为组件，返回值为新组件的函数。  

### 与第三方库协同

### 深入JSX

### 性能优化

- 使用生产版本

- 使用 Chrome Performance 标签分析组件

- 使用开发者工具中的分析器对组件进行分析

- 虚拟化长列表
		react-window 和 react-virtualized 是热门的虚拟滚动库

- 避免调停

......

### Portals

	Portal 提供了一种将子节点渲染到存在于父组件以外的 DOM 节点的优秀的方案

```javascript
ReactDOM.createPortal(child, container)
//用法
render() {
  // React 并*没有*创建一个新的 div。它只是把子元素渲染到 `domNode` 中。
  // `domNode` 是一个可以在任何位置的有效 DOM 节点。
  return ReactDOM.createPortal(
    this.props.children,
    domNode
  );
}
```

第一个参数（child）是任何可渲染的 React 子元素，例如一个元素，字符串或 fragment。第二个参数（container）是一个 DOM 元素。


- 通过 Portal 进行事件冒泡

## API REFERENCE

## HOOK 

### 使用State Hook

### 使用 Effect Hook

### Hook 规则

- 只在最顶层使用 Hook (不要在循环，条件或嵌套函数中调用 Hook， ...)

- 只在 React 函数中调用 Hook (不要在普通的 JavaScript 函数中调用 Hook)

- ESLint 插件

	```npm install eslint-plugin-react-hooks --save-dev```

	``` json
	// 你的 ESLint 配置
	{
	"plugins": [
		// ...
		"react-hooks"
	],
	"rules": {
		// ...
		"react-hooks/rules-of-hooks": "error", // 检查 Hook 的规则
		"react-hooks/exhaustive-deps": "warn" // 检查 effect 的依赖
	}
	}
	```

### 自定义Hook

### HOOK API

- useCallback

    ```javascript
    const memoizedCallback = useCallback(
        () => {
            doSomething(a, b);
        },
        [a, b],
    );
    ```

useCallback(fn, deps) 相当于 useMemo(() => fn, deps)。


- useMemo

    ```javascript
    const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
    ```

    - 把“创建”函数和依赖项数组作为参数传入 useMemo，它仅会在某个依赖项改变时才重新计算 memoized 值。这种优化有助于避免在每次渲染时都进行高开销的计算。

    - 相当于Vue中的computed

    - 传入 useMemo 的函数会在渲染期间执行。请不要在这个函数内部执行与渲染无关的操作

- useRef

    ```javascript
    const refContainer = useRef(initialValue);
    ```

    示例1:命令式地访问子组件

    ```javascript
    function TextInputWithFocusButton() {
    const inputEl = useRef(null);
    const onButtonClick = () => {
        // `current` 指向已挂载到 DOM 上的文本输入元素
        inputEl.current.focus();
    };
    return (
        <>
        <input ref={inputEl} type="text" />
        <button onClick={onButtonClick}>Focus the input</button>
        </>
    );
    }
    ```
    - 直接暴露给父组件带来的问题是某些情况的不可控
    - 父组件可以拿到DOM后进行任意的操作


    示例2：跨渲染周期保存数据

    ``` javascript
    export default function App(props){
    const [count, setCount] = useState(0);

    const doubleCount = useMemo(() => {
        return 2 * count;
    }, [count]);

    const timerID = useRef();
    
    useEffect(() => {
        timerID.current = setInterval(()=>{
            setCount(count => count + 1);
        }, 1000); 
    }, []);
    
    useEffect(()=>{
        if(count > 10){
            clearInterval(timerID.current);
        }
    });
    
    return (
        <>
        <button ref={couterRef} onClick={() => {setCount(count + 1)}}>Count: {count}, double: {doubleCount}</button>
        </>
    );
    }
    ```

- useImperativeHandle

    ```javascript
    //useImperativeHandle(ref, createHandle, [deps])
    
    import React, { useRef, forwardRef, useImperativeHandle } from 'react'

    const JMInput = forwardRef((props, ref) => {
    const inputRef = useRef()
    // 作用: 减少父组件获取的DOM元素属性,只暴露给父组件需要用到的DOM方法
    // 参数1: 父组件传递的ref属性
    // 参数2: 返回一个对象,父组件通过ref.current调用对象中方法
    useImperativeHandle(ref, () => ({
        focus: () => {
        inputRef.current.focus()
        },
    }))
    return <input type="text" ref={inputRef} />
    })

    export default function ImperativeHandleDemo() {
    // useImperativeHandle 主要作用:用于减少父组件中通过forward+useRef获取子组件DOM元素暴露的属性过多
    // 为什么使用: 因为使用forward+useRef获取子函数式组件DOM时,获取到的dom属性暴露的太多了
    // 解决: 使用uesImperativeHandle解决,在子函数式组件中定义父组件需要进行DOM操作,减少获取DOM暴露的属性过多
    const inputRef = useRef()

    return (
        <div>
        <button onClick={() => inputRef.current.focus()}>聚焦</button>
        <JMInput ref={inputRef} />
        </div>
    )
    }
    ```

    作用：

    - useImperativeHandle 可以让你在使用 ref 时自定义暴露给父组件的实例值。useImperativeHandle 应当与 forwardRef 一起使用

- useLayoutEffect

    - 它会在所有的 DOM 变更之后同步调用 effect
    - 可以使用它来读取 DOM 布局并同步触发重渲染。
    - 在浏览器执行绘制之前，useLayoutEffect 内部的更新计划将被同步刷新。

- useDebugValue

    useDebugValue 可用于在 React 开发者工具中显示自定义 hook 的标签。

- 延迟格式化 debug 值

## Redux 

### 设计思想

- 1、Web 应用是一个状态机，视图与状态是一一对应的。  
- 2、所有的状态，保存在一个对象里面。  

### 基本概念和 API

    参考链接：  [Redux 入门教程（一）：基本用法](http://www.ruanyifeng.com/blog/2016/09/redux_tutorial_part_one_basic_usages.html)

- Store

    - Store 就是保存数据的地方，你可以把它看成一个容器。整个应用只能有一个 Store。
    - Redux 提供createStore这个函数，用来生成 Store。

        ```javascript
        import { createStore } from 'redux';
        const store = createStore(fn);
        ```

- State

    - Store对象包含所有数据
    - store.getState()获取当前时刻的State

    ```javascript
    import { createStore } from 'redux';
    const store = createStore(fn);

    const state = store.getState();
    ```

- Action

    - Action 是一个对象。其中的type属性是必须的，表示 Action 的名称。
    - Action 描述当前发生的事情。改变 State 的唯一办法，就是使用 Action。它会运送数据到 Store。

    ```javascript
    const action = {
        type: 'ADD_TODO',
        payload: 'Learn Redux'
    };
    ```

- Action Creator

    - 一个生成Action的一个函数方法（原因：View 要发送多少种消息，就会有多少种 Action。如果都手写，会很麻烦）

    ```javascript
    const ADD_TODO = '添加 TODO';

    function addTodo(text) {
        return {
            type: ADD_TODO,
            text
        }
    }
    const action = addTodo('Learn Redux');
    //addTodo函数就是一个 Action Creator
    ```

- store.dispatch()

    - store.dispatch()是 View 发出 Action 的唯一方法。
    - store.dispatch接受一个 Action 对象作为参数，将它发送出去

    ```javascript
    import { createStore } from 'redux';
    const store = createStore(fn);
    store.dispatch({
        type: 'ADD_TODO',
        payload: 'Learn Redux'
    });
    //结合 Action Creator，这段代码可以改写如下。
    store.dispatch(addTodo('Learn Redux'));
    ```

- Reducer

    - 概念：Store 收到 Action 以后，必须给出一个新的 State，这样 View 才会发生变化。这种 State 的计算过程就叫做 Reducer。
    - Reducer 是一个函数，它接受 Action 和当前 State 作为参数，返回一个新的 State。

    ```javascript
    const reducer = function (state, action) {
        // ...
        return new_state;
    };

    const defaultState = 0;
    const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case 'ADD':
        return state + action.payload;
        default: 
        return state;
    }
    };

    const state = reducer(1, {
        type: 'ADD',
        payload: 2
    });
    ```

    - Reducer 函数最重要的特征是，它是一个纯函数

    ```
     纯函数概念：
        1、不得改写参数
        2、不能调用系统 I/O 的API
        3、不能调用Date.now()或者Math.random()等不纯的方法，因为每次会得到不一样的结果
    ```

        由于 Reducer 是纯函数，就可以保证同样的State，必定得到同样的 View。但也正因为这一点，Reducer 函数里面不能改变 State，必须返回一个全新的对象，请参考下面的写法。

    ```javascript
        // State 是一个对象
        function reducer(state, action) {
            return Object.assign({}, state, { thingToChange });
            // 或者
            return { ...state, ...newState };
        }

        // State 是一个数组
        function reducer(state, action) {
            return [...state, newItem];
        }
    ```

- store.subscribe()

    - Store 允许使用store.subscribe方法设置监听函数，一旦 State 发生变化，就自动执行这个函数。

    ```javascript
    import { createStore } from 'redux';
    const store = createStore(reducer);

    store.subscribe(listener);
    ```

    - store.subscribe方法返回一个函数，调用这个函数就可以解除监听

    ```javascript
    let unsubscribe = store.subscribe(() =>
        console.log(store.getState())
    );

    unsubscribe();
    ```

### Store 的实现

- 提供了三个方法

    ```javascript
        store.getState()
        store.dispatch()
        store.subscribe()
    ```

    ```javascript
        import { createStore } from 'redux';
        let { subscribe, dispatch, getState } = createStore(reducer);
    ```

- createStore方法还可以接受第二个参数，表示 State 的最初状态。这通常是服务器给出的。

    ```javascript
    let store = createStore(todoApp, window.STATE_FROM_SERVER)
    ```
