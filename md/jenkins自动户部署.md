# Jenkins

## 一、基于docker安装

1. docker pull jenkins/jenkins
2. docker run --name myJenkins -privileged=true  -p 8080:8080 -p 50000:50000 -v /var/jenkins_home:/var/jenkins_home jenkins/jenkins //创建容器名为myJenkins，映射端口 8080 和 50000 ，将容器/var/jenkins_home 挂载到主机目录/var/jenkins_home 
-privileged=true  //让容器具有root权限，便于进入容器
-p 8080:8080 //指定主机9090端口映射到Jenkins容器的8080端口（Jenkins的web访问端口）

```javascript 
//在服务器上用上面的版本落下来的版本和本地有区别，不知道什么原因，反正插件总是安装有失败的，最后查看了本地jenkins版本，去docker官网搜索了对应的版本2.425 没有问题 
docker pull jenkins/jenkins:2.425-slim-jdk21-previe
docker run -d --privileged --name jenkins -p 9999:8080   -p 50000:50000  -v  /home/jenkins_home:/var/jenkins_home  jenkins/jenkins:2.425-slim-jdk21-previe
```

1. 在云服务器配置安全组 8080
2. 访问 http:服务器ip:8080即可访问 
3. 登陆复制密码 ///var/jenkins_home/secrets/initialAdminPassword
4. 插件安装 (本地可以翻墙解决，服务器需要修改插件的代理地址) 

两个步骤，

- 修改 插件管理中心底部 升级站点的url选项为：https://mirrors.tuna.tsinghua.edu.cn/jenkins/updates/update-center.json 
- 进入之前挂在目录 /var/jenkins_home/updates/ 下的default.json 之行

```javascript
sed -i 's/https:\/\/updates.jenkins.io\/download/https:\/\/mirrors.tuna.tsinghua.edu.cn\/jenkins/g' default.json  
sed -i 's/https:\/\/www.google.com/https:\/\/www.baidu.com/g' default.json
// 执行 全局替换
```

+ [插件代理参考地址1](https://www.cnblogs.com/wswind/p/13838540.html)
+ [插件代理参考地址2](https://blog.csdn.net/qq_41342975/article/details/130394764)

## 二、 创建任务

1. + item
2. 添加git仓库地址
3. 添加凭证，github 在github上创建token 

[token创建](./img/jenkins1.jpg)

4. 执行构建 就可以发现/var/jenkins_home/job/下下载了对应的git项目在对应的任务目录下
5. 执行项目的命令

```javascript
// 示例： 
node -v
npm config set registry https://registry.npm.taobao.org //淘宝镜像
npm install
if test ${env} = 'test';then
	echo 'test'
else 
	echo 'prod'
    npm run build
fi

pwd
rm -f dist.tar
tar -cvf dist.tar dist  ##打tar包
chmod -R 755 dist.tar ##设置权限
# zip -r dist.zip dist #打包成.zip格式

exit;
```

6. 将打包后的文件发送到服务器目录

- 使用了插件`Publish Over SSH（具体配置在本文插件介绍中有）
    
- Exec command
(这里可以执行服务器ssh命令)
```javascript
cd /home/web-nuxt
pwd
tar xvf dist.tar
chmod -R 755 /home/web-nuxt
rm -f dist.tar
cd nuxt2-app/
source /etc/profile
source ~/.bash_profile
yarn install
pm2 restart nuxt

exit
```

## 三、 插件介绍

1. nodejs 安装node环境
2. Publish Over SSH 远程ssh执行命令 
[参考文档](https://blog.csdn.net/qq_41788609/article/details/121830792)
```javascript
1、在[系统配置]中配置远程服务器及登陆密码
2、在构建任务中配置传输文件，传输后远程ssh命令 
3、在执行参数构建时，选择对应的分支就可以构建指定分支
```
[文件远程传输远程ssh执行命令](./img/jenkins3.jpg)
3. Git Parameter 拉取git分支列表 选择参数构建=>git参数=>定义分支变量名 如branch=> 在源码仓库中的分支输入`${branch}`
   [参考文档](http://www.mydlq.club/article/45/)

## 四、 相关问题

+ 在使用Publish Over SSH执行远程命令时，注意环境变量，因为是在jenkins中连接远程服务器，需要执行`source /etc/profile source ~/.bash_profile`才能使用远程服务器的环境变量（如：pm2\yarn\等等）


## 其他

+ [参考链接](https://www.jb51.net/article/211881.htm))
+ [jenkins之SSH Publishers环境变量](https://www.cnblogs.com/SmilingEye/p/11775632.html)
