# Charles抓包使用

## 使用

1. 环境：手机和电脑处于同一个局域网  

2. 打开电脑 右上角Wi-Fi标志，选择 打开网络偏好设置 找到电脑ip地址

3. 打开手机 设置 -> 无线局域网 -> 选择与电脑相同的wifi -> 点击ℹ -> 配置代理 -> 选择手动 ->   
  服务器：填2中获取到的当前局域网内的IP地址  
  端口：8888  

4. 手机证书信任

   - 4.1 打开 Charles -> Help -> SSL Proxying -> Install Charles Root Certificate in Mobile Device or Remote Broswer
  
   - 4.1.1 弹出  
   - Configure your device to use Charles as its HTTP proxy on 192.168.10.156:8888, then browse to chls.pro/ssl to download and install the certificate.  

   - 4.2 打开手机 在手机浏览器上输入“chls.pro/ssl”下载证书 Charles Proxy CA 选择安装

   - 4.3 打开手机 设置 -> 通用 —> 关于本机 —> 证书信任设置 —> 打开 Charles Proxy CA  

5. 客户端设置   打开Charles

    - 5.1 使用代理设置
        - 点击Proxy->Proxy Settings
        - 勾选 Enable tranaparent HTTP proxying
        - 勾选 Enable SOCKS proxy

![客户端设置](https://qiniu.kananana.cn/other/charles7.png)  

- 5.2 抓取端口设置  
    - 点击Proxy->SSL Proxy Settings  
    - 勾选Enable SSL Proxying  
    - 点击Add，添加抓取端口（*:443默认为全部端口）  

1. success
