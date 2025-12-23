# reactHook基本介绍 (基于React 19.2)

## 内置Hook

### 1. useState 

- 用法

```javascript
const [count,setCount] = useState(0);
```

- 使用场景

1. 需要在函数组件中使用状态的时候

### 2. useRef

- 用法

```javascript
const ref = useRef();
```

- 使用场景

1. 需要在函数组件中使用DOM的时候
2. 需要在函数组件中使用回调的时候

### 3. useContext

- 用法

```javascript
const MyContext = createContext();

// 在函数父组件中
const MyComponent = () => {
    return (
        <MyContext.Provider value={value}>
            <OtherComponent />
        </MyContext.Provider>
    )
}
// 在函数子组件中
const OtherComponent = () => {
    const value = useContext(MyContext);
    return (
        <div>
            <p>{value}</p>
        </div>
    )
}
```

- 使用场景

1. 需要在函数组件中使用上下文的时候
2. 需要在函数组件中使用回调的时候


### 4. useReducer

- 用法

```javascript
const [state,dispatch] = useReducer(reducer, initialArg, init?);
// 

function reducer(state, action) {
   switch (action.type) {
    case 'added_todo': {
      const nextId = state.todos.length + 1;
      return {
        ...state,
        todos: [
          ...state.todos,
          { id: nextId, text: action.text }
        ]
      };
    }
    // ...
  }
}
const MyComponent = () => {
    const [state,dispatch] = useReducer(reducer, {name: 'zhangsan',todos:[]}, );
    const handleClick = () => {
        dispatch({
            type: 'added_todo',
            text: 'new todo'
        })
    }
    return (
        <div>
            <p onClick={handleClick}>{value}</p>
            <ul>
                {
                    state.todos.map((todo) => (
                        <li key={todo.id}>{todo.text}</li>
                    ))
                }
            </ul>
        </div>
    )
}


```

- 使用场景 用 useReducer 替代 useState。

1. 当状态更新逻辑复杂
2. 深更新嵌套对象
3. 下一个状态依赖前一个
4. 深更新嵌套对象

### 5. useImperativeHandle

- 简介
当父组件需要直接调用子组件的特定方法时，用 useImperativeHandle 安全地暴露这些方法。

### 6. useMemo

- 简介
useMemo 用于在函数组件中缓存计算值，避免不必要的重新计算。

- 用法

```javascript
const memoizedValue = useMemo(() => {
    // 计算缓存值
    return calculateValue();
  }, [dependencies]); // 只有在依赖项发生变化时才重新计算缓存值   
})
```

### 7. useSyncExternalStore

- 简介
  当你需要让 React 组件订阅 React 之外的状态时（如 Redux、Zustand、浏览器 API），就用 useSyncExternalStore。

- 用法

```javascript
const snapshot = useSyncExternalStore(
  subscribe,    // 订阅函数：(callback) => unsubscribe
  getSnapshot,  // 获取当前状态
  getServerSnapshot? // SSR 时用的（可选）
);

// 例子
// 订阅网络状态
function useOnlineStatus() {
  return useSyncExternalStore(
    (callback) => {
      window.addEventListener('online', callback);
      window.addEventListener('offline', callback);
      return () => {
        window.removeEventListener('online', callback);
        window.removeEventListener('offline', callback);
      };
    },
    () => navigator.onLine, // 获取当前状态
    () => true, // SSR 时默认为 true
  );
}
// 使用
function App() {
  const isOnline = useOnlineStatus();
  return <div>{isOnline ? '在线' : '离线'}</div>;
}
```


### 8. useEffectEvent

### 9. useCallback

### 10. useTransition

### 11. useDeferredValue

- 简介
可以让你延迟更新 UI 的某些部分，直到它们的值变得稳定。

- 用法
  
```javascript
const deferredValue = useDeferredValue(value);

// 例子

function App() {
  const [value, setValue] = useState(0);
  const deferredValue = useDeferredValue(value);
  return (
    <div>
      <p>Value: {value}</p>
      <p>Deferred value: {deferredValue}</p>
      <button onClick={() => setValue(value + 1)}>Increment</button>
    </div>
  );
}

```
