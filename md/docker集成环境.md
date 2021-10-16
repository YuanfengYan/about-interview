# docker集成环境

    初步理解：docker就是一个虚拟机可以执行一些镜像实例化，比如nginx，php等环境。比起虚拟机docker更加轻量快速##

## 示例

多个项目统一的目录  ~/workspace

创建 php 容器 aha-php-fpm

    docker run --name  aha-php-fpm -v ~/workspace:/www  --privileged=true -d php:7.1-fpm

    1、 --name aha-php-fpm 将容器命名为 aha-php-fpm

    2、 -v ~/workspace:/www  将主机中当前目录下的workspace挂载到容器的/www

    3、--privileged=true  使用该参数，container内的root拥有真正的root权限。privileged启动的容器，可以看到很多host上的设备，并且可以执行mount。 甚至允许你在docker容器中启动docker容器。

移除php容器 aha-php-fpm

    docker rm aha-php-fpm

创建 aha-php-nginx 

    docker run --name aha-php-nginx -p 80:80 -d \
    --privileged=true \
    -v ~/workspace:/www:rw \
    -v ~/nginx/conf/conf.d:/etc/nginx/conf.d:ro \
    -v /data:/data:rw \
    --link aha-php-fpm:php \
    nginx

    1、 后台运行容器，并返回容器ID；

    2、 --link aha-php-fpm:php 容器连接 可以把两个容器连接为一组容器 --- nginx中配置有php（aha-php-fpm）

新增站点配置

    server {
              listen 80;
              server_name localhost;
              root /www/项目名称/发布后的目录;
              index index.php index.html;
              #access_log /usr/local/var/log/nginx/access.log;
              #error_log /usr/local/var/log/nginx/error.log;
              add_header 'Access-Control-Allow-Origin' '*';
              add_header 'Access-Control-Allow-Credentials' 'true';
              add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
              add_header 'Access-Control-Allow-Headers' 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type';
              location / {
                      try_files $uri $uri/ /index.php?$query_string;
                      #if (!-e $request_filename) {
                      #       rewrite ^/(.*)$ /index.php?/$1 last;
                      #        break;
                      #}
              }
              location /ip {
                      add_header Content-Type html/text;
                      return 200 $request_uri;
              }
              location ~ '\.php$' {
                      fastcgi_split_path_info ^(.+\.php)(/.+)$;
                      fastcgi_pass php:9000;
                      fastcgi_index index.php;
                      fastcgi_read_timeout 60;
                      fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
                      include fastcgi_params;
              }
      }
## 小白普及

  nginx与php关系 [参考文档](https://www.cnblogs.com/liyuanhong/articles/11181520.html)

  php

      1、php是一门编程语言 
      
      2、php只能在你的服务器里运行，单独不能和客户交互

  nginx

      1、nginx是一个已经写好的程序

      2、nginx是一个可以监听处理http请求（浏览器请求）的程序

  如何进行关联


## 参考文档

  + [阮一峰 Docker 入门教程](http://www.ruanyifeng.com/blog/2018/02/docker-tutorial.html)
  + [docker 入门讲解 - 构建本地环境](https://learnku.com/articles/36739)
  +  [docker run 的 -i -t -d等参数](https://blog.csdn.net/qq_19381989/article/details/102781663)