# cesium地球相关知识点

## 一. 常见坐标系

### 基础概念

+ 1. 笛卡尔坐标系（Cartesian3）：原点为地球的几何中心使用三个数字表示空间中的一个点的坐标，分别表示 x、y、z 三个方向上的距离。适用于三维计算、三维建模、图形学等领域的研究和应用。可以使用以下代码创建一个笛卡尔坐标系的点：

```javascript
var position = new Cesium.Cartesian3(x, y, z);
```

+ 2. 地理坐标系（Cartographic）：使用经度、纬度和高度三个值表示地球上的一个点的坐标。适用于地球物理、大地测量、地震学等领域的研究，也可以用于进行卫星导航、遥感等应用。可以使用以下代码创建一个地理坐标系的点：

```javascript
var position = new Cesium.Cartographic(longitude, latitude, height);
```
+ 3. 屏幕坐标系（ScreenSpaceEventType）：使用屏幕上的 x、y 坐标表示一个点的位置。例如，可以使用以下代码获取鼠标在屏幕上的位置：

```javascript
var position = new Cesium.Cartesian2(event.position.x, event.position.y);
```
+ 4. 矩形坐标系（Rectangle）：使用西南角和东北角两个点的经纬度表示一个矩形区域。例如，可以使用以下代码创建一个矩形区域：

```javascript
var rectangle = new Cesium.Rectangle(west, south, east, north);
```
+ 5. 地心坐标系：原点为地球的质心。使用三个数字表示空间中的一个点的坐标，分别表示 x、y、z 三个方向上的距离 --- 没用过

+ 其他坐标系：地心惯性坐标系、固定参考点坐标系

### 坐标系之间的转换

1. 笛卡尔坐标系和地理坐标系之间的转换：
```javascript
var position = new Cesium.Cartesian3(x, y, z); //创建笛卡尔坐标
var cartographic = Cesium.Cartographic.fromCartesian(position); //将笛卡尔坐标赚为地理坐标
var longitude = Cesium.Math.toDegrees(cartographic.longitude); //将弧度转为度
var latitude = Cesium.Math.toDegrees(cartographic.latitude);
var height = cartographic.height;
```
2. 地理坐标系和笛卡尔坐标系之间的转换：
```javascript
var longitude = Cesium.Math.toRadians(120.0);
var latitude = Cesium.Math.toRadians(30.0);
var height = 1000.0;
var cartographic = new Cesium.Cartographic(longitude, latitude, height); //创建地理坐标 单位是弧度 
var position = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
```
3. 笛卡尔坐标系和屏幕坐标系之间的转换：
```javascript
var position = new Cesium.Cartesian3(x, y, z);
var canvasPosition = new Cesium.Cartesian2();
// var canvas = viewer.scene.canvas;
// scene：为场景 position为笛卡尔坐标系
var result = Cesium.SceneTransforms.wgs84ToWindowCoordinates(Cesium.viewer.scene, position, canvasPosition);//将WGS84坐标中的位置转换为窗口坐标
if (result) {
    var x = canvasPosition.x;
    var y = canvasPosition.y;
}
```
4. 屏幕坐标系和笛卡尔坐标系之间的转换：
```javascript
    viewer.camera.pickEllipsoid(
        new Cesium.Cartesian2(x, y),
        viewer.scene.globe.ellipsoid
      );
```
5. 地理坐标系和屏幕坐标系之间的转换：
```javascript
// 先将地理坐标系转为笛卡尔
var longitude = Cesium.Math.toRadians(120.0);
var latitude = Cesium.Math.toRadians(30.0);
var height = 1000.0;
var cartographic = new Cesium.Cartographic(longitude, latitude, height);
// 此时为笛卡尔坐标系position
var position = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
// 可不传 canvasPosition
var canvasPosition = new Cesium.Cartesian2();
// 
var result = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, position, canvasPosition);
if (result) {
    var x = canvasPosition.x;
    var y = canvasPosition.y;
}
```
6. 笛卡尔坐标系和地心坐标系之间的转换：
```javascript
var position = new Cesium.Cartesian3(x, y, z);
// 变换矩阵 fixedFrameTransform
var fixedFrameTransform = Cesium.Transforms.computeIcrfToFixedMatrix(new Cesium.JulianDate());
var positionInFixedFrame = new Cesium.Cartesian3();
// 点乘矩阵
Cesium.Matrix4.multiplyByPoint(fixedFrameTransform, position, positionInFixedFrame);
```
7. 地心坐标系和笛卡尔坐标系之间的转换：
```javascript
var positionInFixedFrame = new Cesium.Cartesian3(x, y, z);
var fixedFrameTransform = Cesium.Transforms.computeIcrfToFixedMatrix(new Cesium.JulianDate());
var position = new Cesium.Cartesian3();
// 点乘逆矩阵
Cesium.Matrix4.multiplyByPoint(Cesium.Matrix4.inverseTransformation(fixedFrameTransform, new Cesium.Matrix4()), positionInFixedFrame, position);
```



## 参考文档

+ [GeoJson格式标准 ](https://www.oschina.net/translate/geojson-spec#point)
 
+ [使用 Cesium 动态加载 GeoJSON 数据 ](https://www.cnblogs.com/shoufengwei/p/8883013.html)

+ [墨卡托投影、地理坐标系、地面分辨率、地图比例尺](https://www.cnblogs.com/gispathfinder/p/6087558.html)