# Jenkins

## 一、基于docker安装

1. docker pull jenkins/jenkins
2. docker run --name myJenkins  -p 8080:8080 -p 50000:50000 -v /var/jenkins_home:/var/jenkins_home jenkins/jenkins //创建容器名为myJenkins，映射端口 8080 和 50000 ，将容器/var/jenkins_home 挂载到主机目录/var/jenkins_home 
3. 在云服务器配置安全组 8080
4. 访问 http:服务器ip:8080即可访问 
5. 登陆复制密码
6. 插件安装

