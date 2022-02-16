# 扁平数据结构转Tree 

**中心思想**

+ 1、利用对象引用赋值
+ 2、map对象O(1)的时间复杂度

```javascript
let arr = [
    {id: 1, name: '部门1', pid: 0},
    {id: 2, name: '部门2', pid: 1},
    {id: 3, name: '部门3', pid: 1},
    {id: 4, name: '部门4', pid: 3},
    {id: 5, name: '部门5', pid: 4},
]

function pushChild(obj,item) {
    if(obj.children){
        obj.children.push(item)
    }else{
        obj.children = Array.of(item)
    }
}
function getTree(arr) {
    let result = []
    // 创建map对象
    let map = new Map()
    for(let i = 0;i<arr.length;i++){
        map.set(arr[i].id ,arr[i])
    }
    // 遍历处理
    arr.map(item=>{
        if(map.get(item.pid)){
          pushChild(map.get(item.pid),item)  
        }
        if(!map.get(item.pid)){
            result.push(item)
        }
    })
    return result
}
getTree(arr) //【】
```