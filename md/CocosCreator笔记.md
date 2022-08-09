# CocosCreator笔记

## 一、基础知识

### three.js 、webGl、 openGl、 Cocos creator 比较

### 资源

|       资源       |    type      |
|  :---   | ---  |
|   精灵    |   cc.Sprite   |
|   预制资源    |   cc.Prefab   |
|   粒子资源    |   cc.ParticleSystem   |
|   骨骼动画资源    |   cc.Spine    |
|   音频资源    |   cc.AudioClip    |
|   JSON    |   cc.JsonAsset    |
|   文本资源    |    cc.TextAsset   |
|   动画    |    cc.Animation   |
|   屏幕适配组件    |   cc.widget   |


### 事件

+ this.node.on() 事件监听  off once
        this.node.on('mousedown', function (event) {
            this.enabled = false;
        }, this);
    发送事件：
    | 名称 | 作用 | 参数   |
    |   :---  |   :---    |   :---  |
    |   emit  |    通过事件名发送自定义事件     |   参数列表：type   arg1 arg2 arg3 arg4 arg5   |
    |   dispatchEvent  |    分发事件到事件流中。     |   参数列表：event   |

     区别： dispatchEvent 是分发到事件流中 经历 1、捕获阶段 2、目标阶段 3、冒泡阶段

+ 节点系统事件(鼠标和触摸事件)

+ 全局系统事件(键盘和重力传感事件)
        cc.SystemEvent.EventType.KEY_DOWN (键盘按下)
        cc.SystemEvent.EventType.KEY_UP (键盘释放)
        cc.SystemEvent.EventType.DEVICEMOTION (设备重力传感)

```javascript
// 重力感应
onLoad () {
        // open Accelerometer
        cc.systemEvent.setAccelerometerEnabled(true);
        cc.systemEvent.on(cc.SystemEvent.EventType.DEVICEMOTION, this.onDeviceMotionEvent, this);
    },
  onDestroy () {
        cc.systemEvent.off(cc.SystemEvent.EventType.DEVICEMOTION, this.onDeviceMotionEvent, this);
    },

    onDeviceMotionEvent (event) {
        cc.log(event.acc.x + "   " + event.acc.y);
    },
```

### 音频播放


```javascript
// properties类型
audio: {
            default: null,
            type: cc.AudioClip
        }
// 播放
cc.audioEngine.play(this.audio, false, 1);
```

### 动画

+ 动画节点 cc.Animation

动画编辑器使用

    1. 创建一个节点;

    2. 为这个节点添加一个动画组件 cc.Animation;

    3. 为这个动画组件新建一个动画文件 --> AnimationClip对象;

    4. cc.Animation 控制面板的属性:

        　　(1): default Anim Clip: 默认的播放的动画剪辑;  
        　　(2): Clips: 动画剪辑的数组集合  
        　　(3): Play onLoad: 是否在加载的时候开始播放;  

动画编辑器的原理

    1. 时间轴
    2. 在不同的时刻，调整节点以及孩子节点的不同的属性的值，然后创建出补间动画;
    3. 节点调动画的属性:
    　　位置, 缩放, 旋转, 大小, 颜色, 透明度, 锚点, 扭曲, ...;
    4. 动画编辑器也可以调节节点的子节点
    5. 动画参数:
    　　Simaple: 1秒多少帧, Speed: 速度,播放速度,越小越慢,
    　　wrapMode: Normal, Loop, PingPong, Reverse, Loop Reverse, PingPongReverse;
    6. 动画
    　　(1)添加动画属性
    　　(2)添加关键帧/删除关键帧,选到关键帧，在属性编辑器上编辑和修改;
    　　(3)编辑补间动画曲线路径;

Animation组件

    1. 代码中获得cc.Animation组件:
    　　编辑器关联;
    　　代码获取组件;
    2: Animation组件主要的方法:
    　　play([name], [start_time]), 播放指定的动画，如果没有制定就播放默认的动画;
    　　playAdditive: 与play一样，但是不会停止当前播放的动画;
    　　stop([name]): 停止指定的动画，如果没有指定名字就停止当前播放的动画;
    　　pause/resume: 暂停唤醒动画;
    　　getClips: 返回组件里面带的AnimationClip数组
    3: Animation重要的属性:
    　　defaultClip: 默认的动画剪辑;
    　　currentClip: 当前播放的动画剪辑;
    4: Animation播放事件: 动画组件对象来监听on,不是节点
    　　play : 开始播放时 stop : 停止播放时 pause : 暂停播放时 resume : 恢复播放时
    　　lastframe : 假如动画循环次数大于 1，当动画播放到最后一帧时 finished : 动画播放完成时

+ 缓动系统（cc.tween）

```javascript
cc.tween(this.node)
    .to(1, { position: cc.v2(100, 100), rotation: 360 })
    .to(1, { scale: 2 })
    .start()
```

|   属性    |   功能    |
|   :----   |   ---    |
|   to      |   对属性进行绝对值计算，最终的运行结果即是设置的属性值，即改变到某个值。      |
|   by      |   对属性进行相对值计算，最终的运行结果是设置的属性值加上开始运行时节点的属性值，即变化值。      |

### 使用对象池

    put 将对象返回对象池
    size  判断对象池中是否有空闲的对象
    get 从对象池获取对象
    clear 清空对象池

        ```javascript  
        properties: {
            enemyPrefab: cc.Prefab
        },
        onLoad: function () {
            this.enemyPool = new cc.NodePool();
            let initCount = 5;
            for (let i = 0; i < initCount; ++i) {
                let enemy = cc.instantiate(this.enemyPrefab); // 创建节点
                this.enemyPool.put(enemy); // 通过 put 接口放入对象池
            }
        }
        ```

### 生命周期

| 钩子函数 |   时机     |
|   :---   | :---     |
|   onLoad    |   组件首次激活时触发    |
|   start    |   组件第一次执行update之前触发    |
|   update    |   每一帧渲染前调用    |
|   lateUpdate    |   所有组件update调用后调用    |
|   onDestroy    |   组件或所在节点调用了destroy()时调用，并在当前帧结束时统一回收组件    |
|   onEnable    |   enabled属性从false到true和active从false到ture时执行。执行顺序是在onLoad之后，start之前    |
|   onDisable    |   enabled属性从true到false和active从true到false时执行。    |

### 物理引擎 和 碰撞检测

+ 开启物理引擎 和 碰撞检测

    // 开启物理  
    cc.director.getPhysicsManager().enabled = true;  
    // 开启碰撞  
    cc.director.getCollisionManager().enabled = true;

### 数据存储

    存储：cc.sys.localStorage.setItem(key,value)  
    读取：cc.sys.localStorage.getItem(key)  
    移除：cc.sys.localStorage.removeItem(key)  
    无论存入什么类型的数据，读取出来的类型都是字符串类型（除了是微信小游戏中表现为存什么，取出的就是什么类型）

### 坐标系转换  

    得到一个节点的世界坐标

```javascript

    /**
    * 得到一个节点的世界坐标
    * node的原点在中心
    * @param {*} node
    */
    function localConvertWorldPointAR(node) {
        if (node) {
            return node.convertToWorldSpaceAR(cc.v2(0, 0));
        }
        return null;
    }
    /**
    * 得到一个节点的世界坐标
    * node的原点在左下边
    * @param {*} node
    */
    function localConvertWorldPoint(node) {
        if (node) {
            return node.convertToWorldSpace(cc.v2(0, 0));
        }
        return null;
    }
```  

    把一个世界坐标的点，转换到某个节点下的坐标

```javascript

/**
 * 把一个世界坐标的点，转换到某个节点下的坐标
 * 原点在node中心
 * @param {*} node
 * @param {*} worldPoint
 */
function worldConvertLocalPointAR(node, worldPoint) {
    if (node) {
        return node.convertToNodeSpaceAR(worldPoint);
    }
    return null;
}
 
/**
 * 把一个世界坐标的点，转换到某个节点下的坐标
 * 原点在node左下角
 * @param {*} node 
 * @param {*} worldPoint 
 */
function worldConvertLocalPoint(node, worldPoint) {
    if (node) {
        return node.convertToNodeSpace(worldPoint);
    }
    return null;

```

### 屏幕适配组件

creator屏幕适配策略: 固定高度,固定宽度, 固定宽高度;

creator界面适配案例:

    1: 确定设计分辨率  (960*640 ...)  
    2: 配置适配策略;  (固定宽度、固定高度、固定宽高度)  
    3: 在设计分辨率下来搭建场景;  
    4: 决定界面上的停靠点,借助cc.Widget组件来实现;  
    5: 相对于父亲的区域大小;  

## 二、 搭建单场景项目框架

### 1、

### 三、 关于自己项目经历

因公司cocos项目多人力紧缺，临时去帮忙做了大半年的cocos项目。
独立完成2个cocos creator项目。(谁是最大糊涂蛋，个人中心) 参与（答题pk,恐龙化博物馆，qdl, 海洋巨无霸等4个项目 ）
熟悉cocos creator单场景+多预制体模式的框架搭建（界面中的窗体都按需加载, 复用性高. 使用者只需要关心界面内的逻辑）
项目优化：对于多个cocos 项目，提取引擎文件进行打包。
为啥使用：可以快速实现各种酷炫的动画，
## 做的项目

[弹弹球][https://github.com/YuanfengYan/cocos-bollgame]

## 参考文档

- [Cocos 官方文档](https://www.cocos.com/docs)  
- [Cocos 论坛](https://forum.cocos.org/)
- [Cocos Creator游戏实战](https://zhuanlan.zhihu.com/p/101240692)
- [Cocos Creator 开发范例](https://github.com/cocos-creator/example-cases)
