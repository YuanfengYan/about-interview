# webpack
 
  本文是基于webpack4版本
## 一、介绍

### 1、功能

* 打包：  将多个文件 打包成 一个文件，减少服务器压力和下载带宽

* 转换：  将预编译语言 转换成 浏览器识别的语言

* 优化：  性能优化

### 2、本质

* 静态模块处理器=>递归构建关系依赖图

### 3、常用模块/配置

* source map(devtool: 'inline-source-map'),：代码出错警告 能够将编译后的代码映射回原始源代码 用于测试环境
* html-webpack-plugin : 打包html压缩
* clean-webpack-plugin： 清理历史打包数据
* webpack-dev-server: 实时重新加载
* mini-css-extract-plugin： 提取CSS
* optimize-css-assets-webpack-plugin： 压缩css

## 二、webpack构建流程

1. 校验配置文件：读取命令行传入或者webpack.config.js文件，<b>初始化本次构建的配置参数</b>
2. 生成Compiler对象：执行配置文件中的插件实例化语句(new MyWebpackPlugin()等)，<b>为webpack事件流挂上自定义hooks</b>
3. 进入entryOption阶段：webpack开始读取配置的Entries，<b>递归遍历所有的入口文件</b>
4. run/watch：如果运行在watch模式则执行watch方法，否则执行run方法
5. compilation：职责就是构建模块和Chunk，并利用插件优化构建过程。（和 Compiler 用法相同，钩子类型不同,且通过 Compilation 也能读取到 Compiler 对象）
6. emit：所有文件的编译及转化都已经完成
7. afterEmit：文件已经写入磁盘完成
8. done：完成编译

### 插件Plugins

+ 比较清晰的plugin制作 [Webpack4.0各个击破（7）plugin篇](https://www.mk2048.com/blog/blog_hckc2bjiai1aa.html)
#### 基本结构

>plugins是可以用自身原型方法apply来实例化的对象apply只在安装插件被Webpack compiler执行一次。apply方法传入一个webpck compiler的引用，来访问编译器回调。

1. 一个命名的 Javascript 方法或者 JavaScript 类。
2. 它的原型上需要定义一个叫做 apply 的方法。
3. 注册一个事件钩子。
4. 操作webpack内部实例特定数据。
5. 功能完成后，调用webpack提供的回调。

#### 工作原理

1. 读取配置的过程中会先执行 new HelloPlugin(options) 初始化一个 HelloPlugin 获得其实例。
2. 初始化 compiler 对象后调用 HelloPlugin.apply(compiler) 给插件实例传入 compiler 对象。
3. 插件实例在获取到 compiler 对象后，就可以通过compiler.plugin(事件名称, 回调函数) 监听到 Webpack 广播出来的事件。并且可以通过 compiler 对象去操作 Webpack。

+ 一个简单的例子

```javascript
class HelloPlugin{
  // 在构造函数中获取用户给该插件传入的配置
  constructor(options){
  }
  // Webpack 会调用 HelloPlugin 实例的 apply 方法给插件实例传入 compiler 对象
  apply(compiler) {
    // 在emit阶段插入钩子函数，用于特定时机处理额外的逻辑；
    compiler.hooks.emit.tap('HelloPlugin', (compilation) => {
      // 在功能流程完成后可以调用 webpack 提供的回调函数；
    });
    // 监听compilation下的钩子
     compiler.hooks.compilation.tap('HelloPlugin', (compilation) => {
      compilation.hooks.buildModule.tap('HelloPlugin',(module)=>{
        // ....
      })
    });
    // compiler.plugin('hooks-name'，function(){}) //属于webpack3及以前的写法，因为没找到3的官方文档，而webpack4开始官网已经是 compiler.hooks.hooksname.tap('pluginname',function(){})这种写法
    // 如果事件是异步的，会带两个参数，第二个参数为回调函数，在插件处理完任务时需要调用回调函数通知webpack，才会进入下一个处理流程。
    compiler.plugin('emit',function(compilation, callback) {
      // 支持处理逻辑
      // 处理完毕后执行 callback 以通知 Webpack 
      // 如果不执行 callback，运行流程将会一直卡在这不往下执行 
      callback();
    });
  }
}

module.exports = HelloPlugin;

// 安装插件时, 只需要将它的一个实例放到Webpack config plugins 数组里面:
const HelloPlugin = require('./hello-plugin.js')
var webpackConfig = {
  plugins: [new HelloPlugin({ options: true })],
}

```

### Loaders

### Loader 工作原理

[Loader传送门](https://champyin.com/2020/01/28/%E6%8F%AD%E7%A7%98webpack-loader/)
>webpack 只能直接处理 javascript 格式的代码。任何非 js 文件都必须被预先处理转换为 js 代码，才可以参与打包。loader（加载器）就是这样一个代码转换器。它由 webpack 的 loader runner 执行调用，接收原始资源数据作为参数（当多个加载器联合使用时，上一个loader的结果会传入下一个loader），最终输出 javascript 代码（和可选的 source map）给 webpack 做进一步编译

## 三、webpack优化方案

### 提升首页加载速度

1. 配置CDN+externals
    >页面中引入CDN外链
    >在webpack.config.js中加入external配置项，(让里面的库不被webapck打包，也不影响通过import（或者其他AMD、CMD等）方式引入)
    >output中配置output:{libraryTarget:"umd"} (libraryTarget可告知我们构建出来的业务模块，当读到了externals中的key时，需要以umd的方式去获取资源名，否则会有出现找不到module的情况)
2. 防止重复 提取vendor (减小js的体积) 并且 设置文件名hash不因为文件未改动而变化，命中缓存
    >CommonsChunkPlugin()抽离公共的代码 (Vue cli构建的项目中默认所有在node_modules中的模块打包进vendor)  
        entry中配置要进行公共提取的文件
        vendor: ['lodash']
        new webpack.HashedModuleIdsPlugin(),//保证项目构建时vendor.js的hash值在module文件未变化时不进行改变
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest'
        })

    >HashedModuleIdsPlugin()保证项目构建时vendor.js的hash值在module文件未变化时不进行改变
3. 开启gizp压缩
    >compression-webpack-plugin插件 
    >webpack4开始只需要配置mode 为 "production"进行uglifyjs 压缩插件。
4. 动态导入
    >output 中配置 chunkFilename: '[name].bundle.js'
    第一种，也是优先选择的方式是，使用符合 ECMAScript 提案 的 import() 语法。
    第二种，则是使用 webpack 特定的 require.ensure
5. 配置tree shaking
   >package.json中配置  "sideEffects": false
   来告知 webpack，它可以安全地删除未用到的 export 导出。
   或者指定某些文件可以无副作用进行tree shaking

### 提升打包速度

1. 配置CDN+externals  
2. 提取vendor
3. 开启happypack的线程池（node.js采用单线程异步非阻塞模式，也就是说每一个计算独占cpu，遇到I/O请求不阻塞后面的计算，当I/O完成后，以事件的方式通知，继续执行计算）

```javascript
var HappyPack = require('happypack');  
var happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
module: {  
  loaders: [
      {
        test: /.js[x]?$/,
        // loader: 'babel-loader?presets[]=es2015&presets[]=react'
        loader: 'happypack/loader?id=happybabel'
      }
    ]
  },
  plugins: [
      new HappyPack({
        id: 'happybabel',
        loaders: ['babel-loader'],
        threadPool: happyThreadPool,
        cache: true,
        verbose: true
      })
  ]
  ```

4. 利用DllPlugin和DllReferencePlugin预编译资源模块  

### 其他

1. cross-env 设置环境变量

>能跨平台地设置及使用环境变量 npm i --save-dev cross-env  

```javascript
{
  "scripts": {
    "build": "cross-env NODE_ENV=production webpack --config build/webpack.config.js"
  }
}
```

2. 配置别名alias

>vue2.0 配置webpack.base.config.js中配置
>vue3.0 配置在vue.config.js

```json
resolve:{
  alias:{
    "vue":"vue/dist/vue.esm.js"
  }
}
```

3. Tree-Shaking

  Tree-shaking的本质是消除无用的js代码：在 webpack 项目中，当我们在入口文件中引入一个模块的时候，可能不会引入这个模块的所有代码，只引入了我们需要的代码，那么在使用webpack进行打包时，tree-shaking会自动帮我们把不用的代码过滤掉。

  提升项目性能：JS绝大多数情况需要通过网络进行加载，然后执行，加载的文件越小，整体执行时间更短，所以去除无用代码以减少文件体积, 从而提升项目性能。

>生产环境自动配好了，开发环境需要配置

## 四、webpack3和webpack4区别

1. mode

    webpack增加了一个mode配置，只有两种值development | production。对不同的环境他会启用不同的配置。

2. CommonsChunkPlugin

  CommonChunksPlugin已经从webpack4中移除。
  可使用optimization.splitChunks进行模块划分（提取公用代码）。
  但是需要注意一个问题，默认配置只会对异步请求的模块进行提取拆分，如果要对entry进行拆分
  需要设置optimization.splitChunks.chunks = 'all'。
  SplitChunksPlugin的好，好在解决了入口文件过大的问题还能有效自动化的解决懒加载模块之间的代码重复问题

  [两者比较](https://www.cnblogs.com/zhanyishu/p/9349576.html)

3. webpack4使用MiniCssExtractPlugin取代ExtractTextWebpackPlugin。

4. 代码分割。

  使用动态import，而不是用system.import或者require.ensure

5. vue-loader。

  使用vue-loader插件为.vue文件中的各部分使用相对应的loader，比如css-loader等

6. UglifyJsPlugin

  现在也不需要使用这个plugin了，只需要使用optimization.minimize为true就行，production mode下面自动为true

  optimization.minimizer可以配置你自己的压缩程序


## 五 其他

### 用.env.development设置环境变量

    1，利用node的fs模块读取文件处理成对象
    2，用webpack.DefinePlugin插件，设置process.env

```javascript
//readEnv.js

const fs = require('fs');
const path = require('path');
// 读取环境变量的文件把它转化成对象
module.exports = (file) => { // flie为文件路径
    let fileName = path.join(__dirname, file);
    let data = fs.readFileSync(fileName, { encoding: 'utf8' })
    let d = data.replace(/\r/g, ',').replace(/\n/g, '') // 把换行和回车替换
    let arr = d.split(',').map(item => {
        return item.split('=')
    }) // [ [ 'a', '1' ], [ 'b', '2' ] ]
    let obj = {}
    arr.forEach(item => {
        obj[item[0]] = item[1]
    })
    return obj //{ a: '1', b: '2' }
    // 可以接着处理
    /* 像vue-cli3 新版create-react-app 一样规定环境变量的Key必须以(VUE_APP_)  (REACT_APP_) 开头 */
}

//webpack.dev.conf.js
const readEnv = require('./readEnv')
const env = readEnv('../.env.development')

plugins: [
    new webpack.DefinePlugin({ // 定义环境和变量
    'process.env': {
        NODE_ENV: "'development'",
        ...env
    }
    })
]
//.env.development

development=dev
name=xxx

```


## 六 实用的webpack方法

## 七 关于vue-cli搭建的项目如何修改webpack

+ [vue.config中configureWebpack 与 chainWebpack区别](https://www.jianshu.com/p/27d82d98a041)
+ [官方介绍webpack 相关](https://cli.vuejs.org/zh/guide/webpack.html#%E7%AE%80%E5%8D%95%E7%9A%84%E9%85%8D%E7%BD%AE%E6%96%B9%E5%BC%8F)

### require.context

require.context(directory, useSubdirectories, regExp)

  directory: 要查找的文件路径
  useSubdirectories: 是否查找子目录
  regExp: 要匹配文件的正则

示例：file = require.context('./components/', true, /\.js$/)

返回的是一个方法，有两个静态方法 keys,resolve, 一个静态属性 id

方法返回的是我们需要的模块/ file('即匹配的文件名的相对路径') 参数同resolve

1、keys: 返回匹配成功模块的名字组成的数组

2、resolve: 接受一个参数request，request为test文件夹下面匹配文件的相对路径，返回这个匹配文件相对于整个工程的相对路径

3、id: 执行环境的id，返回的是一个字符串，主要用在module.hot.accept，应该是热加载

应用场景：

      实现自动化导入模块,在前端工程中,如果遇到从一个文件夹引入很多模块的情况,可以使用这个api,它会遍历文件夹中的指定文件,然后自动导入,使得不需要每次显式的调用import导入模块


## 参考文档

+ [揭秘webpack插件工作流程和原理](https://juejin.im/post/6844904161515929614)
+ [揭秘webpack plugin](https://www.cnblogs.com/etoumao/p/13496636.html)
+ [关于webpack的面试题](https://www.cnblogs.com/gaoht/p/11310365.html)
+ [webpack5 和 webpack4 的区别有哪些 ](https://blog.csdn.net/weixin_48181168/article/details/120445028)
+ [webpack 源码解读(3)--CommonsChunkPlugin](https://zhuanlan.zhihu.com/p/33676967)