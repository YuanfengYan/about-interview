# node 实现Excel内容转Json

## 一、搭建node环境

```javascript

  mkdir excel2Json
  cd excel2Json
  npm init -y

  //依赖安装
  npm install lodash
  npm install node-xlsx
  npm install 

```

## 二、 逻辑代码

+ 1、读取内容Excel

```javascript
  'use strict';
  let _ = require('lodash');
  let fs = require('fs');
  let xlsxrd = require('node-xlsx');
  let excelFilePath = './demo.xlsx';//目标文件
  // 读取excel中所有工作表的数据
  let list = xlsxrd.parse(excelFilePath);
  // 获取excel中第一个工作表的数据
  let data = list[0].data; //拿到的数据是一个数组嵌套，每一个数组代表工作表中的一行数据，如果存在单元格合并的项，只会存在左上角单元格上有值，其他的都是null

```

2、 处理含有两层嵌套的Excel

    前面两行表头，通过”/“进行别名，
    下面的代码稍有欠缺，部分场景没考虑进去，基本思路完整

```javascript
let map = {}
for (let j = 2; j<data.length; j++) {
    let Nesting = false; // 当前嵌套的对象是否是有用字段
    let obj = {};
    let nestObjName; //嵌套对象的名字
    for (let i = 0; i < data[1].length; i++) {
        let firstLineName = data[0][i]&&data[0][i].toString().split('/')[1]||"";
        let secondLineName = data[1][i]&&data[1][i].toString().split('/')[1]||"";

        // 第一行和第二行都存在说明是嵌套，
        if (firstLineName && secondLineName) {//嵌套对象
            
            nestObjName = firstLineName
            obj[nestObjName] = {};
            obj[nestObjName][secondLineName] = data[j][i]||"";
            Nesting = true;
            //第一行不存在，第二行存在说明是嵌套对象下的字段 且Nesting = true
        } else if (!firstLineName && Nesting) { //嵌套对象
            
            obj[nestObjName][secondLineName] = data[j][i]||"";
            //第一行存在，第二行不存在 说明是一级字段
        } else if (
            firstLineName &&
            !secondLineName
        ) {  //一级字段
          // console.log(data[j])
          Nesting = false
            obj[firstLineName] = data[j][i]||"";
        } else {
            continue;
        }
    }
    map[obj.id] = obj
}

const storeData = (data, path) => {
    try {
      fs.writeFileSync(path, JSON.stringify(data));
    } catch (err) {
      console.error(err);
    }
};
// 保存到对应的文件，可以考虑不存在则动态创建，
storeData(data, './files/text1.txt');

```
