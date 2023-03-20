# nuxt使用总结

## 一、nuxt基本介绍

+ 基于 Vue.js 的通用应用框架。
+ SSR 服务端渲染。在服务端生成html发送至客户端

+ 个人认为适用于并发量小、需要seo的网站应用

## 二、nuxt.js的优势、劣势

### 优势

+ 1. 约定式开发 无需为了路由划分而烦恼，你只需要按照对应的文件夹层级创建 `.vue` 文件
+ 2. 有利于SEO
+ 3. 首屏加载速度快
+ 4. HTML头部标签管理
+ 5. 内置了 webpack，省去了配置 webpack 的步骤，nuxt 会根据配置打包对应的文件

### 劣势

+ 1. 服务端压力较大 (在并发量的的项目，占用服务端CPU资源会比较大)
+ 2. 需要pm2进行管理
+ 3. 不利于调试，线上看不到错误信息，只能跑本地项目查找

## 三、项目搭建

### 1、 项目初始化

+ nuxt2

```javascript
yarn create nuxt-app nuxt2-app //<project-name>
create-nuxt-app v5.0.0
✨  Generating Nuxt.js project in nuxt2-app
? Project name: nuxt2-app
? Programming language: TypeScript
? Package manager: Yarn
UI framework: Element
? Template engine: HTML
? Nuxt.js modules: (Press <space> to select, <a> to toggle all, <i> to invert selection)
? Linting tools: (Press <space> to select, <a> to toggle all, <i> to invert selection)
? Testing framework: None
? Rendering mode: Universal (SSR / SSG)
? Deployment target: Server (Node.js hosting)
? Development tools: (Press <space> to select, <a> to toggle all, <i> to invert selection)
? What is your GitHub username? yuanfengyan
? Version control system: Git


 yarn add sass-loader@10 sass //安装sass 
 yarn add @nuxtjs/axios

 nuxt.config.js 配置
 modules: [
'@nuxtjs/axios'
],
配置axios的plugins 对应的插件（请求响应拦截等）

yarn add cookie-universal-nuxt  //
modules: [
    // Simple usage
    'cookie-universal-nuxt',

    // With options
    ['cookie-universal-nuxt', { alias: 'cookiz' }],
 ]

yarn add vuex-persistedstate  //vuex数据持久化 插件
 
```

+ nuxt3

```javascript
yarn create nuxt-app <project-name> / npx nuxi init nuxt-app /npm init nuxt-app <project-name>
cd <project-name>
yarn install
yarn dev -o /npm run dev -- -o / pnpm run dev -o
```

### 2、 目录介绍

```
└─nuxt
  ├─.nuxt               // Nuxt自动生成，临时的用于编译的文件，build
  ├─assets              // 用于组织未编译的静态资源如LESS、SASS或JavaScript,对于不需要通过 Webpack 处理的静态资源文件，可以放置在 static 目录中
  ├─components          // 用于自己编写的Vue组件，比如日历组件、分页组件
  ├─layouts             // 布局目录，用于组织应用的布局组件，不可更改⭐
  ├─middleware          // 用于存放中间件
  ├─node_modules
  ├─pages               // 用于组织应用的路由及视图,Nuxt.js根据该目录结构自动生成对应的路由配置，文件名不可更改⭐
  ├─plugins             // 用于组织那些需要在 根vue.js应用 实例化之前需要运行的 Javascript 插件。
  ├─static              // 用于存放应用的静态文件，此类文件不会被 Nuxt.js 调用 Webpack 进行构建编译处理。 服务器启动的时候，该目录下的文件会映射至应用的根路径 / 下。文件夹名不可更改。⭐
  └─store               // 用于组织应用的Vuex 状态管理。文件夹名不可更改。⭐
  ├─.editorconfig       // 开发工具格式配置
  ├─.eslintrc.js        // ESLint的配置文件，用于检查代码格式
  ├─.gitignore          // 配置git忽略文件
  ├─nuxt.config.js      // 用于组织Nuxt.js 应用的个性化配置，以便覆盖默认配置。文件名不可更改。⭐
  ├─package-lock.json   // npm自动生成，用于帮助package的统一设置的，yarn也有相同的操作
  ├─package.json        // npm 包管理配置文件
  └─README.md
  额外的常见自行配置
  pm2.json //pm2  启动配置
  server/index.js // pm2启动的文件
  
```


## 参考文档

+ [nuxt生命周期讲解](http://t.zoukankan.com/XF-eng-p-14611496.html)
+ [Vue SSR原理介绍与Nuxt 框架简介](https://juejin.cn/post/6885304582180700174#heading-5)
