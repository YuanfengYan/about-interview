# webGL学习笔记

## 一、基础知识

+ webGL 是OpenGL ES 2.0的web端衍生产品,可以结合 Html5 和 JavaScript 在网页上绘制和渲染二/三维图形。图形的绘制主要通过 WebGLRenderingContext 接口完成

+ webGL相比于Canvas优势： webGL由于利用了GPU的处理能力，并执行高性能的并行计算，所以WebGL在处理大规模复杂图形和动画方面具有优势。最终tong

+ webGL \ Canvas \ OpenGL 关系： JavaScript -> WebGL -> OpenGL ->.... -> 显卡 并把最终渲染出来图形 呈现到Canvas

## 二、 基本使用

- webGL中矩阵主列矩阵
- 
### 

## API使用杂记

- attribute （属性）一般attribute变量储存一些顶点数据，如：顶点坐标、法线、纹理坐标、顶点颜色等。
- uniform 统一变量 一个常量值，储存各种着色器需要的数据，例如：转换矩阵、光照参数或者颜色
- uniform4f uniform4fv 
  
+ 顶点坐标传入着色区
  + 创建缓冲区  `vertexBuffer = gl.createBuffer();`
  + 将缓冲区对象绑定target  `gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);`
  + 将顶点坐标传入缓冲区   `gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);`
  + 将缓冲区对象分配给对应的attribute变量  `gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);`
  + 开启attribute变量

+ 绘制纹理
  + 

## 相关算法

### 旋转

```javascript
// 绕z轴旋转B
// x1 = x*cos(B)-y*sin(B)
// y1 = x*sin(B)+y*cos(B)
// z1 = z
var VSHADER_SOURCE = `attribute vec4 a_Position; 
  uniform float u_ConB, u_SinB;
  void main() { 
    gl_Position.x = a_Position.x*u_ConB -a_Position.y*u_SinB;
    gl_Position.y = a_Position.x*u_SinB +a_Position.y*u_ConB;
    gl_Position.z = a_Position.z;
    gl_Position.w = 1.0;
  }`
```

矩阵旋转B绕z轴
$$
\begin{bmatrix}
   x1\\
   y1\\
   z1 \\
   1
  \end{bmatrix}
  =\begin{bmatrix}
   cosB & -sinB & 0  & 0\\
   sinB & cosB & 0   & 0\\
   0    & 0    & 1   & 0\\
   0    & 0    & 0   & 1
  \end{bmatrix}
×
 \begin{bmatrix}
   x\\
   y\\
   z\\
   1
  \end{bmatrix}
$$

### 矩阵平移

$$
\begin{bmatrix}
   x1\\
   y1\\
   z1\\
   1
  \end{bmatrix}
  =\begin{bmatrix}
   1 & 0 & 0 & Tx\\
   0 & 1 & 0 & Ty\\
   0 & 0 & 1 & Tz\\
   0 & 0 & 0 & 1
  \end{bmatrix}
×
 \begin{bmatrix}
   x\\
   y\\
   z\\
   1 
  \end{bmatrix}
$$
