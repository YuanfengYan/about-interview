# vue3中台框架搭建

## 一、起步

+ 安装脚手架 npm install -g @vue/cli

+ 创建项目 vue create my-project

+ 安装项目依赖 npm i  element-plus axios mockjs @vue/composition-api 等

### 安装模块

- 安装scss： npm install -D sass-loader node-sass 

    安装后报错 this.getOptions is not a function 
    解决方案 卸载安装低版本 sass-loader@8.0.0   node-sass@4.12.0

- 安装 ts: vue add typescript

- 安装ts版本mockjs  npm i @types/mockjs -D

## 二、配置http请求

+ axios的请求，响应拦截（配置header头加密，数据跟踪，响应数据格式，异常处理等）

+ 配置.env环境变量，（.env不上传git,服务端通过Apollo进行配置线上的环境变量）

+ 创建api接口文件，按功能模块进行文件命名（一般以后端模块进行分类命名 user.js,order.js）

+ 配置mock.js 

## 三、添加页面路由

+ 安装 npm i vue-router  / npm i vue-router@next -D

+ 创建 router/index.js 配置页面路由routes等信息，返回VueRouter实例，绑定到vue实例 createApp(App).use(VueRouter)

+ 配置路由拦截器（权限判断，路由逻辑判断等）后续补充





