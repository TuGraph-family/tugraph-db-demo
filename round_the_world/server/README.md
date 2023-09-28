## 调试

npm install

npm start

查看 http://localhost:8000

## 部署

### 更改后端的生产接口地址

打开文件目录 /src/constant/index.ts
第四行（本地日常调试地址）： export const PROXY_HTTP = 'http://127.0.0.1:7071';
第五行 （生产环境地址）： export const PUBLISH_HTTP = 'http://127.0.0.1:7071';

替换为对应的地址即可

npm run build:prod
获取 dist 目录 copy 到服务器 /etc/www/html 目录
部署服务器下载 nginx
配置nginx.cnf文件

添加以下配置

# ----------------------

#开启gzip
gzip on;
server {
listen 8080; #配置端口
listen [::]:8080;

      server_name ; #修改为您的域名
      root /var/www/html/dist #必须在这个层里面有自己的index.html首页
      index index.html;

}

# ------------------

### 启动服务

systemctl start nginx

### 设置开机自启

systemctl enable nginx

### 查看启动状态

systemctl status nginx

### 查看部署情况

访问 localhost:8080 查看页面是否正常
