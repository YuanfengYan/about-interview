# Chrome插件MV3

- MV2版本的chrome插件在2023年停止支持

## 一、创建项目

### 1. 配置文件manifest.json 

```json
{
    "name": "插件名称",
    "description" : "这是插件描述",
    "version": "1.0", //插件版本
    "manifest_version": 3,
     "action": {//定义插件的用户界面部分，如浏览器工具栏按钮。
        "default_popup": "popup.html",
        "default_icon": "abc.png",
        "default_title": "这是鼠标移上去时提示文字"
      },
      "background": {//定义后台脚本或服务工作者（Service Worker）。
        "service_worker": "background.js"
      },
      "permissions":["storage","tabs","activeTab"],//插件所需的权限列表
      "content_scripts": [ //定义将注入到网页中的内容脚本。
        {
            "matches": ["https://*.example.com/*"],
            "js": ["content.js"],
            "css": ["styles.css"]
        }
        ],
        "web_accessible_resources": [//定义插件可以公开访问的资源。
            {
            "resources": ["icons/*"], //可以公开访问的资源
            "matches": ["<all_urls>"] // 所有网页（<all_urls>）都可以访问 resources
            }
        ],
        "options_page": "options.html",//选项页面为用户提供了一个界面，可以在其中配置扩展程序的设置或首选项。它通常用于提供用户配置选项，如自定义扩展的行为、主题、通知设置等。
        // 用户可以右键点击扩展的图标，并选择“选项”来打开选项页面。
        "host_permissions": [//此键允许扩展指定它可以访问哪些网站。
        "*://*.example.com/*",
        "*://mozilla.org/*"
        ]
     
}

```

### 2. 插件代码的四大主要部分action（popup）、 options_page、background、content_scripts

- action 
    + 定义扩展的浏览器图标和弹出页面。
- options_page 
    + 提供一个用户界面，允许用户配置扩展程序的设置。
    + 主要用于收集和存储用户的配置选项，这些配置可能会影响扩展程序的行为。
- background
    + 包含后台脚本，通常用于处理长期运行的任务，如事件监听、网络请求和存储管理。
    + 在 Manifest V3 中，通常使用 Service Worker 来实现后台脚本。
- content_scripts
    + 注入到网页中的脚本，用于操作网页的 DOM 和与网页内容交互。
    + 可以修改网页的外观和行为，但受限于网页的安全策略。

#### 四者之间通讯方式

1. 使用 chrome.runtime API 发送消息：（content_script 和 background / popup.js 通信）

- content_scripts向popup主动发消息的前提是popup必须打开！否则需要利用background作中转；
- 如果background和popup同时监听，那么它们都可以同时收到消息，但是只有一个可以sendResponse，一个先发送了，那么另外一个再发送就无效；

```javascript
// 从 content_script 发送消息到 background：
// content_script.js
chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
    console.log(response.farewell);
});
// 在 background或者popup 脚本中接收消息：
// background.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.greeting === "hello") {
        sendResponse({farewell: "goodbye"});
    }
});

```

2. 使用 chrome.storage API 进行数据存储和共享：（options 和 content_script 通信）

- 这种方式适用于存储持久化的数据，并在不同组件之间共享数据。

```javascript
// options_page 中保存设置：
// options.js 在 
document.getElementById('save').addEventListener('click', function() {
    var setting = document.getElementById('setting').value;
    chrome.storage.sync.set({setting: setting}, function() {
        console.log('Setting saved');
    });
});
// 在 content_script 中读取设置：
// content_script.js 
chrome.storage.sync.get(['setting'], function(result) {
    console.log('Setting is ' + result.setting);
});

```

3. 使用长连接（Long-lived connections）： （ content_script 和 background /popup： 通信）

- 适用于需要持续双向通讯的情况，如实时数据更新。


```javascript
// 在 content_script 中建立连接：
// content_script.js
var port = chrome.runtime.connect({name: "knockknock"});
port.postMessage({joke: "Knock knock"});
port.onMessage.addListener(function(msg) {
    if (msg.question === "Who's there?") {
        port.postMessage({answer: "Madame"});
    } else if (msg.question === "Madame who?") {
        port.postMessage({answer: "Madame foot got caught in the door!"});
    }
});
// 在 background 脚本中处理连接：
// background.js
chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name == "knockknock");
    port.onMessage.addListener(function(msg) {
        if (msg.joke == "Knock knock") {
            port.postMessage({question: "Who's there?"});
        } else if (msg.answer == "Madame") {
            port.postMessage({question: "Madame who?"});
        }
    });
});

```

```javascript
// 获取当前选项卡ID
function getCurrentTabId(callback)
{
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
	{
		if(callback) callback(tabs.length ? tabs[0].id: null);
	});
}
// popup.js
getCurrentTabId((tabId) => {
    var port = chrome.tabs.connect(tabId, {name: 'test-connect'});
    port.postMessage({question: '你是谁啊？'});
    port.onMessage.addListener(function(msg) {
        alert('收到消息：'+msg.answer);
        if(msg.answer && msg.answer.startsWith('我是'))
        {
            port.postMessage({question: '哦，原来是你啊！'});
        }
    });
});
// content-script.js：
// 监听长连接
chrome.runtime.onConnect.addListener(function(port) {
    console.log(port);
    if(port.name == 'test-connect') {
        port.onMessage.addListener(function(msg) {
            console.log('收到长连接消息：', msg);
            if(msg.question == '你是谁啊？') port.postMessage({answer: '我是你爸！'});
        });
    }
});
```



4. popup或者bg向content_script主动发送消息

```javascript
// popup或者bg
function sendMessageToContentScript(message, callback)
{
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
    {
        chrome.tabs.sendMessage(tabs[0].id, message, function(response)
        {
            if(callback) callback(response);
        });
    });
}
sendMessageToContentScript({cmd:'test', value:'你好，我是popup！'}, function(response)
{
    console.log('来自content的回复：'+response);
});
// content-script.js接收：
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
    // console.log(sender.tab ?"from a content script:" + sender.tab.url :"from the extension");
    if(request.cmd == 'test') alert(request.value);
    sendResponse('我收到了你的消息！');
});
// 双方通信直接发送的都是JSON对象，不是JSON字符串，所以无需解析，很方便（当然也可以直接发送字符串）
```
5. injected_script和content-script

- content-script和页面内的脚本（injected-script自然也属于页面内的脚本）之间唯一共享的东西就是页面的DOM元素，有2种方法可以实现二者通讯：
    1. 可以通过window.postMessage和window.addEventListener来实现二者消息通讯；
    2. 通过自定义DOM事件来实现；

第一种方法（推荐）：

```javascript
// injected-script中：
window.postMessage({"test": '你好！'}, '*');

// content script中：
window.addEventListener("message", function(e)
{
    console.log(e.data);
}, false);

```

第二种方法：

```javascript
// injected-script中
var customEvent = document.createEvent('Event');
customEvent.initEvent('myCustomEvent', true, true);
function fireCustomEvent(data) {
    hiddenDiv = document.getElementById('myCustomEventDiv');
    hiddenDiv.innerText = data
    hiddenDiv.dispatchEvent(customEvent);
}
fireCustomEvent('你好，我是普通JS！');

// content-script.js中：
var hiddenDiv = document.getElementById('myCustomEventDiv');
if(!hiddenDiv) {
    hiddenDiv = document.createElement('div');
    hiddenDiv.style.display = 'none';
    document.body.appendChild(hiddenDiv);
}
hiddenDiv.addEventListener('myCustomEvent', function() {
    var eventData = document.getElementById('myCustomEventDiv').innerText;
    console.log('收到自定义事件消息：' + eventData);
});
```

6. popup调用后台background脚本中的方法

```javascript
var bg = chrome.extension.getBackgroundPage();
bg.test();//test()是background中的一个方法
```

#### 普通HTML中的js(injected_scrip) 和 content_scripts 区别

- 执行环境：Content Script 具有独立的 JavaScript 环境，普通 HTML 内的 JavaScript 与页面共享环境。
- 权限：Content Script 受限于 Chrome 扩展权限模型，普通 JavaScript 受限于浏览器的同源策略。
- 用途：Content Script 用于扩展和增强网页功能，普通 JavaScript 用于实现网页核心功能。
- 通信机制：Content Script 使用 Chrome 扩展的消息传递 API，普通 JavaScript 使用标准的浏览器 API。

## 二、开发案例

todo...

- 插件爬虫
- 视频录制
后续更新

## 参考文档
- [Plasmo CSUI](https://docs.plasmo.com/framework/content-scripts-ui/styling)
- [Chrome插件中 popup,background,contantscript消息传递机制](https://www.cnblogs.com/Galesaur-wcy/p/15745099.html)
- [chrome V3插件入门到放弃，Plasmo不完全使用指南](https://blog.csdn.net/Jioho_chen/article/details/126672461)
