# canvas 常见的渲染优化策略

## 优化策略

### 一 离屏绘制，使用缓存

  离屏canvas当成一个缓存区。把需要重复绘制的画面数据进行缓存起来，减少调用canvas的API的消耗。
  原因是：canvas的API的实际是非常消耗性能的，尽量减少api的调用次数

### 二、　尽量少调用 canvasAPI ，尽可能集中绘制

### 三、　使用requestAnimationFrame

### 四、不要频繁设置绘图上下文的 font 属性。

### 五、 避免浮点运算

  比如取整问题 Math.floor，Math.ceil，parseInt 
  可以使用位运算 [参考文章](https://www.w3school.com.cn/js/pro_js_operators_bitwise.asp)
```javascript 
  somenum = 13.5
  rounded = (0.5 + somenum) | 0; 
  rounded = ~~ (0.5 + somenum);
  rounded = (0.5 + somenum) << 0;
  //14
```

## 参考文章 

+ [谈谈canvas的性能优化（主要讲缓存问题）](https://www.cnblogs.com/axes/p/3567364.html?utm_source=tuicool&utm_medium=referral)