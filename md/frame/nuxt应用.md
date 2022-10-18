# nuxt应用

## 应用创建
nuxt2
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

nuxt3
```javascript
yarn create nuxt-app <project-name> / npx nuxi init nuxt-app /npm init nuxt-app <project-name>
cd <project-name>
yarn install
yarn dev -o /npm run dev -- -o / pnpm run dev -o
```

##  遇到的坑

1. 

## 参考文档

+ [nuxt生命周期讲解](http://t.zoukankan.com/XF-eng-p-14611496.html)
+ [Vue SSR原理介绍与Nuxt 框架简介](https://juejin.cn/post/6885304582180700174#heading-5)
