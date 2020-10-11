# Promise实现

## [Promise/A+规范](https://promisesaplus.com/)

## 代码实现

```javascript

function Promise(fn){
  var state = 'pending';
  var doneList = [];//成功回调函数列表
  var failList= [];//失败回调函数列表
  this.then = function(done ,fail){
    switch(state){
      case "pending":
        doneList.push(done);
        //每次如果没有推入fail方法，我也会推入一个null来占位
        failList.push(fail || null);
        return this;
        break;
      case 'fulfilled':
        done();//只有同步，且成功时会进入执行
        return this;
        break;
      case 'rejected':
        fail();//只有同步，且失败时会进入执行
        return this;
        break;
    }
  }
  function resolve(newValue){
    state = "fulfilled";
    setTimeout(function(){
      var value = newValue;
      for (var i = 0;i<doneList.length;i++){
        var temp = doneList[i](value);
        if(temp instanceof Promise){
            var newP =  temp;
            for(i++;i<doneList.length;i++){
                newP.then(doneList[i],failList[i]);
            }
        }else{
            value = temp;
        }
      }
    },0);
  }
  function reject(newValue){
    state = "rejected";
    setTimeout(function(){
      var value = newValue;
      var tempRe = failList[0](value);
      //如果reject里面传入了一个promise，那么执行完此次的fail之后，将剩余的done和fail传入新的promise中
      if(tempRe instanceof Promise){
        var newP = tempRe;
        for(i=1;i<doneList.length;i++){
            newP.then(doneList[i],failList[i]);
        }
      }else{
        //如果不是promise，执行完当前的fail之后，继续执行doneList
        value =  tempRe;
        doneList.shift();
        failList.shift();
        resolve(value);
      }
    },0);
  }
  fn(resolve,reject);
}

var p = function (){
    return new Promise(function(resolve,reject){
        setTimeout(function(){
          reject('p 的结果');
        }, 100);
    });
}
var p2 = function (input){
    return new Promise(function(resolve){
        setTimeout(function(){
            console.log('p2拿到前面传入的值：' + input)
            resolve('p2的结果');
        }, 100);
    });
}
p()
.then(function(res){console.log('p的结果:' + res); return 'p then方法第一次返回'},function(value){console.log(value);return 'p then方法第一次错误的返回'})
.then(function(res){console.log('p第一次then方法的返回：'+res); return 'p then方法第二次返回'})
.then(p2)
.then(function(res){console.log('p2的结果：' + res)});

```