# linux

## 一、docker中安装linux

### 1、拉取镜像、启动

  - [docker-linux](https://hub.docker.com/search?q=linux&source=verified&operating_system=linux) 

```javascript
  //拉取的是centos 当然可以拉取其他的linux 
  docker pull centos:7
  docker run -d -it --name my_centos centos /bin/bash
  // yum -y install wget 

```

## 二、常见命令

### 1. ln 创建、删除软链接

+ 创建一个软连接: ln -s /usr/softwaredir/ /home/softwaredir_link  
  + ln -s   [B(必须要绝对路径) ]    [A]  意思是创建快捷方式 A 链接到B ,即: A-->B .如果目的地址(B)不用绝对路径,会出问题:软链接为红色.
+ 删除软连接: unlink [A]

### 2. 添加权限

+ chmod +x xxx //xxx文件名

## 其他

### centos中安装python3

1. 创建目录
    `mkdir -p /usr/local/python/python3`

2. 进入指定路径下载python源码 #操作路径 /usr/local
   `wget https://www.python.org/ftp/python/3.7.1/Python-3.7.1.tgz`

3. 解压源码压缩包
   `tar -zxvf  Python-3.7.1.tgz`

4. 安装python3.6.8
   1. 编译安装环境 #操作路径 /usr/local/Python-3.6.8/ `./configure --prefix=/usr/local/python/python3`
   2. 进行安装python3.6.8 #操作路径要在/usr/local/Python-3.6.8  `make && make install`

5. 软链接绑定
   1. ln -s /usr/local/python/python3/bin/python3 /usr/bin/python3

6. 验证是否安装成功
   1. python3 -V

### 安装yt-dlp

 /root/myApplication/bin/yt-dlp -f 'bv*[ext=mp4][height<=1080]+ba[ext=m4a]/b[ext=mp4] / bv*+ba/b' --print-json --merge-output-format mp4 -o "test1" --restrict-filenames  https://www.youtube.com/watch?v=UWydvG6OAjQ
 
 wget https://github.com/yt-dlp/yt-dlp/releases/download/2022.11.11/yt-dlp

docker cp -a my_centos:/root/download/ /
 /root/myApplication/bin/yt-dlp -f 'bv*[height=720]+ba' https://www.youtube.com/watch?v=UWydvG6OAjQ -o '%(id)s.%(ext)s'

 /root/myApplication/bin/yt-dlp -f 'bv*[ext=mp4][height=720]+ba[ext=m4a]'  --merge-output-format mp4  https://www.youtube.com/watch?v=UWydvG6OAjQ -o '%(id)s.mp4'

 /root/myApplication/bin/yt-dlp -f 'bv*[ext=mp4][height=720]+ba[ext=m4a]'   https://www.youtube.com/watch?v=UWydvG6OAjQ 
