<!--
 * @Description: 
 * @Author: yanyuanfeng
 * @Date: 2021-03-08 18:02:47
 * @LastEditors: yanyuanfeng
 * @LastEditTime: 2021-03-08 18:07:55
-->
# npm相关知识点

## 上传npm包

[Vue插件封装，以及插件发布到npm](https://blog.csdn.net/yan_yuanfeng/article/details/88312730)

1. npm login/adduser
2. npm publish
3. npm publish --tag beta //发布测试包
4. npm deprecate -f <package>@<version> "<message>"  //废弃包


如果npm 使用 taobao 的镜像后，无法 login & publish
需要指定 --registry http://registry.npmjs.org 

npm adduser --registry http://registry.npmjs.org

npm publish --registry http://registry.npmjs.org


### 访问上传的npm包

cdn访问地址 ： https://cdn.jsdelivr.net/npm/<package>
刷新cdn缓存 ： https://purge.jsdelivr.net/npm/<package>
