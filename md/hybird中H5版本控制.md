<!--
 * @Description: 
 * @Author: yanyuanfeng
 * @Date: 2022-06-15 16:42:00
 * @LastEditors: yanyuanfeng
 * @LastEditTime: 2022-06-16 11:32:52
-->
# hybird中H5版本控制

## 1. 项目背景

hybird在开发过程中，会持续进行功能迭代。随着版本不断更新，但又要保持原先版本的App内的H5不能出现问题。
当版本过多时，在H5内耦合去判断终归是不现实的。

## 2. 实现方案介绍

H5会根据每次APP版本进行构建，对应的版本号为构建目标文件夹名称
例如： App版本版本1.2.0，就会在dist目录下构建一个文件夹为 v1_2_0的版本。然后app在访问的时候会自动访问对应app版本号对应的H5

## 3. 具体实现

```javascript
var fs = require("fs");
let currentVersion = 'v1_4_0';
let versionTimestamp =  new Date().getTime();
// 因为项目中要动态创建php文件在这进行创建目录结构，如果项目中没有动态创建指定目录的可以不需要这段
if (!fs.existsSync("dist")) {
  fs.mkdirSync("dist");
  if(!fs.existsSync("dist/"+currentVersion)){
    fs.mkdirSync("dist/"+currentVersion);
  }
}else if(!fs.existsSync("dist/"+currentVersion)){
  fs.mkdirSync("dist/"+currentVersion);
}
module.exports = {
  output:{
    path: path.resolve(__dirname, `../dist/${currentVersion}/${versionTimestamp}`)// 输出文件目录
  }
  // outputDir: "dist/"+ currentVersion+ '/' + versionTimestamp // 输出文件目录
};

```