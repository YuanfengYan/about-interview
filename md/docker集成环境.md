# docker

    初步理解：docker就是一个虚拟机可以执行一些镜像实例化，比如nginx，php等环境。比起虚拟机docker更加轻量快速##

    介绍参考链接 [Docker和k8s的区别与介绍](https://www.cnblogs.com/misswangxing/p/10669444.html)

## 一、 docker 常规命令

容器使用：

- docker inspect 容器名称 ：可以查看Docker 容器的配置和状态信息。
- docker stop 容器名称： 停止 WEB 应用容器
- docker pull 镜像名： 获取镜像 例如： docker pull ubuntu
- docker run -it 镜像名（xxx）： 使用镜像（xxx）启动容器，-it 参数为以命令行模式进入该容器 例如： docker run -it ubuntu /bin/bash
- docker run [options] IMAGE[:TAG] [COMMAND] [ARG…]
   - IMAGE是镜像的名字
   - COMMAND是运行起来的时候要执行什么命令.
   - ARG表示这条命令运行需要的参数.
- docker start 已停止的容器id(b750bbbcfd88 )： 启动一个已停止的容器：
- docker stop <容器 ID>
- ...
- docker attach 1e560fca3906 ： 不推荐 
- docker exec -it 243c32535da7 /bin/bash：推荐 容器启动后会进入后台。此时想要进入容器
- docker export 容器Id > 容器快照名.tar  ： 这样将导出容器快照到本地文件。
- docker import <指定 URL 或者某个目录来导>http://example.com/exampleimage.tgz example/imagerepo： 导入容器快照
- docker rm -f 1e560fca3906 : 删除容器

镜像使用：

- docker rmi hello-world  删除镜像
- 创建镜像：
  - 1、从已经创建的容器中更新镜像，并且提交这个镜像
  - 2、使用 Dockerfile 指令来创建一个新的镜像

- 构建镜像
  - docker build -t “命名的镜像名” “.”   构建当前目录下的Dockerfile文件，制作一个镜像名为‘xxx’的镜像
    - t ：指定要创建的目标镜像名

    - . ：Dockerfile 文件所在目录，可以指定Dockerfile 的绝对路径


容器连接： 

- -p 标识来指定容器端口绑定到主机端口。
  - -P :是容器内部端口随机映射到主机的端口。
  - -p : 是容器内部端口绑定到指定的主机端口。

- docker port "容器名称"  //可以查看端口

Dockerfile:

- FROM- 镜像从那里来
- MAINTAINER- 镜像维护者信息
- RUN- 构建镜像执行的命令，每一次RUN都会构建一层
- CMD- 容器启动的命令，如果有多个则以最后一个为准，也可以为ENTRYPOINT提供参数
- VOLUME- 定义数据卷，如果没有定义则使用默认
- USER- 指定后续执行的用户组和用户
- WORKDIR- 切换当前执行的工作目录
- HEALTHCHECH- 健康检测指令
- ARG- 变量属性值，但不在容器内部起作用
- EXPOSE- 暴露端口
- ENV- 变量属性值，容器内部也会起作用
- ADD- 添加文件，如果是压缩文件也解压
- COPY- 添加文件，以复制的形式
- ENTRYPOINT- 容器进入时执行的命令

#### 有时遇到pull 镜像错误 

+ <font color='red'>error pulling image configuration: download failed after attempts=6: dial tcp 104.18.124.25:443: i/o timeout
</font>

可以 Docker 配置文件 /etc/docker/daemon.json

```javascript 
sudo mkdir -p /etc/docker 
// 将多行文本写入daemon 如果daemon文件不存在就会创建
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://yxzrazem.mirror.aliyuncs.com"]
}
EOF
sudo systemctl daemon-reload //重载配置
sudo systemctl restart docker //重启docker
```
## 二、 示例应用

### 示例一： 搭建关联php的nginx

多个项目统一的目录  ~/workspace

创建 php 容器 aha-php-fpm

    docker run --name  aha-php-fpm -v ~/workspace:/www  --privileged=true -d php:7.1-fpm

    1、 --name aha-php-fpm 将容器命名为 aha-php-fpm

    2、 -v ~/workspace:/www  将主机中当前目录下的workspace挂载到容器的/www

    3、--privileged=true  使用该参数，container内的root拥有真正的root权限。privileged启动的容器，可以看到很多host上的设备，并且可以执行mount。 甚至允许你在docker容器中启动docker容器。

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


#### 小白普及

  nginx与php关系 [参考文档](https://www.cnblogs.com/liyuanhong/articles/11181520.html)

  php

      1、php是一门编程语言 
      
      2、php只能在你的服务器里运行，单独不能和客户交互

  nginx

      1、nginx是一个已经写好的程序

      2、nginx是一个可以监听处理http请求（浏览器请求）的程序

  如何进行关联


### 示例二： 本地环境运行在微信开发者工具中

 前景：
1、常规开发中本地项目带有端口8080或者其他
2、而微信开发者工具中调试不能带有端口号访问

实现方案 ： 通过本地docker启动一个nginx代理指定的域名 指向本地的带端口号的地址

1. 安装docker
2. 终端运行
  ```javascript
  docker run --name mynginx2 -p 80:80 -d \
    -v ~/mynginx/conf/conf.d:/etc/nginx/conf.d:ro \
    nginx
  ```
3. 在根目录~ 创建 mynginx/conf 文件夹
4. 在mynginx/conf中添加配置文件 对应文件名.conf 例如：aha-mom.conf
 ```javascript
 server {
     # 指定端口（nginx默认监听的端口，不用管）
     listen    80;
     # 修改位置——被代理的对应域名
     server_name mom-test.d.ahaschool.com;
    #  server_name 127.0.0.1;

 
     location / {
       # 修改位置——代理到的开发地址
      #  proxy_pass http://www.baidu.com;
      #  proxy_pass http://127.0.0.1:8080;
       proxy_pass http://192.168.10.238:8080/; //项目的ip+端口
        #proxy_set_header  Host       $host; //这项需要注释掉，原先就是因为这个配置原因一直不行
       proxy_set_header  X-Real-IP    $remote_addr;
       proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504;
       proxy_max_temp_file_size 0;
       proxy_connect_timeout   90;
       proxy_send_timeout     90;
       proxy_read_timeout     90;
       proxy_buffer_size     64k;
       proxy_buffers       32 32k;
       proxy_busy_buffers_size  128k;
      proxy_temp_file_write_size 64k;
     }
   }
 ```
5. 修改host文件添加
```javascript
127.0.0.1 mom-test.d.ahaschool.com
```
6. vue.config.js中添加
因为不加的话会一直报
 Invalid Host/Origin header
虽然不影响开发，但会影响开发体验
 ```javascript
 devServer: {
      disableHostCheck: true, //  新增该配置项
    }
 ```



### 示例三：完整的搭建nginx (若直接启动容易将宿主机的空内容覆盖容器内容)

 + [参考文档](https://juejin.cn/post/7126146371198910478)

```javascript
 docker run -d --name mynginx  -p 80:80 nginx
  
 mkdir -p /home/nginx/
 mkdir -p /home/nginx/logs   
 mkdir -p /home/nginx/html

docker cp mynginx:/etc/nginx/nginx.conf /home/nginx/nginx.conf
docker cp mynginx:/etc/nginx/conf.d /home/nginx/
docker cp mynginx:/usr/share/nginx/html /home/nginx/ #此处就是网站站点目录

docker stop mynginx # mynginx 容器| 容器ID 也可以，只需要前3位数字即可
 docker rm mynginx
 docker rm -f mynginx #直接删除正在运行的容器

docker run \
-p 80:80 -p 443:443 -p 8081:8081 \
--name nginx \
-v /home/nginx/nginx.conf:/etc/nginx/nginx.conf \
-v /home/nginx/conf.d:/etc/nginx/conf.d \
-v /home/nginx/logs:/var/log/nginx \
-v /home/nginx/html:/usr/share/nginx/html \
-v /home/nginx/ssl:/etc/nginx/ssl \
-d nginx

```

## 三、镜像的构建及上传

### 1. 利用dockerfile 构建本地镜像

#### 常见的前端项目构建Dockerfile

```dockerfile
# 基础镜像 一般可以采用node:xx-slim 瘦身版 几十兆
FROM node:latest 
COPY package.json /
RUN npm i --registry=https://registry.npm.taobao.org
RUN npm run build

FROM nginx:latest
# 这里的dist/目录是你的项目打包后的文件目录
COPY ./dist/ /usr/share/nginx/html/
COPY ./nginx.conf /etc/nginx/conf.d/

EXPOSE 80
```

+ 在版本 Docker 17.05 之后，支持多个FROM,对于多个FROM的理解：
    - 每一条 FROM 指令都是一个构建阶段，多条 FROM 就是多阶段构建。但生成镜像的只能是最后一个阶段的结果，但是，能够将前置阶段中的文件拷贝到后边的阶段中，这就是多阶段构建的最大意义
    - 就和上面代码的一样node只需要在构建的时候支持，后续构建镜像不需要node。

#### **如何设置容器自定义启参数**

```dockerfile
FROM node:16-slim
COPY ./ /home/prooject
WORKDIR /home/prooject

RUN npm config set registry https://registry.npm.taobao.org \
    && npm config set disturl https://npm.taobao.org/dist \
    && npm config set puppeteer_download_host https://npm.taobao.org/mirrors
RUN  npm install \
     && npm run puppet-install
...
RUN npm run build
# CMD ["node", "lib/bundle.esm.js"]
CMD ["sh" , "start.sh"]
```

```javascript
// start.sh
// 此脚本使用/bin/bash来解释执行  #!是一个特殊的表示符，其后，跟着解释此脚本的shell路径。
#!/bin/bash
boot_env=$(env | grep XXXX | cut -d= -f2) //将环境变量中的XXXX 赋值给boot_env
echo $boot_env
FROMTYPE=$boot_env && node ./lib/bundle.esm.js //node 启动前设置对应的变量 （这里设置一个FROMTYPE，代码中可以通过process.env.FROMTYPE访问拿到）

```

启动命令 

` docker run --name test -e FROMTYPE=yyy  yanyuanfeng/xxxx:latest`

node中可以访问 process.env.FROMTYPE


### 2. 构建命令

`build  --pull --rm -f "Dockerfile" -t yanyuanfeng/xxxx:latest .`

+ --pull:它将提取任何基本映像的最新版本，而不是重复使用您已经在本地标记的内容
+ --rm:这意味着,如果构建不成功,则不会删除这些中间容器.这允许调试最后一个中间容器,或将其作为中间映像提交.
+ --force-rm:对比--rm,那些中间的容器将始终是即使在不成功的编译的情况下删除.
+ -f: 指定Dockerfile文件（也可以用远程的）
+ --tag, -t: 镜像的名字及标签，通常 name:tag 或者 name 格式；可以在一次构建中为一个镜像设置多个标签。

### 3. 上传镜像

`docker login`
`docker push yanyuanfeng/xxxx:latest`


## 参考文档

  + [阮一峰 Docker 入门教程](http://www.ruanyifeng.com/blog/2018/02/docker-tutorial.html)
  + [docker 入门讲解 - 构建本地环境](https://learnku.com/articles/36739)
  + [docker run 的 -i -t -d等参数](https://blog.csdn.net/qq_19381989/article/details/102781663)
  + [使用docker容器化开发部署Vue项目](https://www.bilibili.com/read/cv13105865/)
  + [菜鸟教程](https://www.runoob.com/docker/docker-tutorial.html)
