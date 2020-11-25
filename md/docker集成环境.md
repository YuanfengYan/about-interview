# docker集成环境

    初步理解：docker就是一个虚拟机可以执行一些镜像实例化，比如nginx，php等环境。比起虚拟机docker更加轻量快速##

## 示例

多个项目统一的目录  ~/workspace
创建 aha-php-fpm
    docker run --name  aha-php-fpm -v ~/workspace:/www  --privileged=true -d php:7.1-fpm

## 参考文档

    + [阮一峰 Docker 入门教程](http://www.ruanyifeng.com/blog/2018/02/docker-tutorial.html)
    + [docker 入门讲解 - 构建本地环境](https://learnku.com/articles/36739)