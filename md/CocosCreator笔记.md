# CocosCreator笔记

## 基础知识

+ scene 场景  
+ script 脚本  
+ 资源：  
        图片资源 texture  
        预制资源 Prefab  
        粒子资源 ParticleSystem  
        骨骼动画资源 Spine  
        瓦片图资源 TiledMap  
        音频资源  ---  type: cc.AudioClip
        JSON ---  type: cc.JsonAsset  
        文本资源 ---  type: cc.TextAsset  
+ this.node.on() 事件监听  off once
        this.node.on('mousedown', function (event) {
            this.enabled = false;
        }, this);
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

+ 缓动系统（cc.tween）

+ 使用对象池
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

+ 生命周期

    onLoad   组件首次激活时触发
    start    组件第一次执行update之前触发
    update     每一帧渲染前调用
    lateUpdate 所有组件update调用后调用
    onDestroy  组件或所在节点调用了destroy()时调用，并在当前帧结束时统一回收组件
    onEnable  组件的enabled属性从false变为true时
    onDisable  组件的enabled属性从true变为false时

+ 开启物理引擎 和 碰撞检测

    // 开启物理
    cc.director.getPhysicsManager().enabled = true;
    // 开启碰撞
    cc.director.getCollisionManager().enabled = true;

## 参考文档

- [Cocos Creator游戏实战](https://zhuanlan.zhihu.com/p/101240692)