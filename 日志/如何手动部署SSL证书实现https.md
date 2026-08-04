> 教程食用前提：已经部署了普通的网站到云服务器的Nginx并且拥有了一个已解析+备案的域名
>

为了防止安全（主要是为了防止屏蔽和攻击），我们需要将原来的HTTP变成具有加密效果的HTTPS，那么这需要我进行操作下载SSL，

这里我使用腾讯云免费的SSL证书进行操作：

[https://console.cloud.tencent.com/ssl/dsc/hosting](https://console.cloud.tencent.com/ssl/dsc/hosting)我们去腾讯云访问SSL证书管理（没有的可以去申请一个免费的）

<!-- 这是一张图片，ocr 内容为：我的证书 产品体验划说了直 概览 免费证书 正式证书 全部 上传证书 我的证书 证书托管 证书使用指南 爱爱帮动 一皱HTTPS 购买新书后,还要专名设证书,并将证书部解别服务器织云产品上才可实现网站HTTPSIO空过信. 我的资料 购买证书 申请证书 部署证书 提作记录 证书工具 装写成各信只,记并基本茶数,提交面CA机构定核,期门需要完成成名验证, 在选择SI辽书道,确定医名,证书品牌等因素,支付订单后控制合会生成 证书签发后,还需要将证书安转列报多管表对度的云产品上才能生效,实现 企业型证书还嘉要完成企业信是市核. HTTPS加四通信. 张来签发的新证书 我的权益 查看申请指南 查看安装指南 查看购物市 证书监控区 X WHLZ负责者IE书,TUSIASA品得的预证书将于2025年1月14日从USERTNSTUSTUSIGER GLOTALROOI G2.五客公告评后区 域名注册G 回云解析DNS心 中请中 已签发 即将过期 已过期 1 0 0 0 自动化管理方案 待称证0 西北 Q山山乡 标签各个美健字用蓝线上分脑,基它只能输入单个美睫李 中清免典证书(1/50) 购买证书 上传证书 证书记 操作 自动块费 状态 了 到期时问题 球名解析 关联询源 绑定域名 江书信息 D:MICEKCEI 部雪 下载  升级 B 备注:未命名 托管中 已签发 0 77% 更多 B效期:共90天 -->
![](https://cdn.nlark.com/yuque/0/2025/png/43218187/1742278015784-6b8a3fa3-f9fe-47ee-8d3c-cd79550efb50.png)

将证书和我们的域名相绑定（这里就不细说了，看腾讯云的面板就明白了）

<!-- 这是一张图片，ocr 内容为：标签多个关键字用竖线十分隔,其它只能输入单个关键字 申请免费证书(1/50) 上传证书 购买证书 批星探作, 点击下载 域名解折 关联资源 绑定域名 状态了 操作 自动续费 到期时间 证书托管 证书信息 ID:MICEKCEI 部丢 级 下载 HIBISCUS.FIT, 备注:未命名 托管中 未关联刷新 2025-06-14 07:59:59 已签发 史多 WWW.HIBISCUS.FIT 有效期:共90天 /1页 10Y条/页 共1条 -->
![](https://cdn.nlark.com/yuque/0/2025/png/43218187/1742278090677-1bc29473-2a5c-4bed-905f-e3c0c73afd76.png)

找到目标的证书，然后点击下载按钮进行操作，点完之后会有一个弹出窗，显示要下载哪种证书：

<!-- 这是一张图片，ocr 内容为：快生馆! 腾讯云 支持通过实例10,名称学皮,当源 主账号 领取专属试票券,最高安全部10元,查看计情> 我的证书 供注注册办连对可过?加入$$L证我女深群,把和文档区 有奖问题,产品体验您说了算 切换场景 概览 正式证书 上传证书 全部 免费证书 我的证书 证券电话 下载证书 石浆门卷,产品体验地游了真 证书使用指南 一针HTTPS 购买证券后,江集要签发证书,并称证书部警到权分 服务帮买型 招作 出租 下4 下4 TOMCAT (PTETE;C) 购买证书 部署证书 用记录 松射下航 TOMCAT(JKS档式) 证书工具 台证 证书签院后,还复要将证书安苏亚亚谷黑吃对原的层产导上才保生效,实现 在选择9SI证券前,确定编识,运书品件等因真, 张朱亚农的折证书. APACHE (CRT文料.KOY文件) 查看购买指市 商界支箱南 帮助 下配 NGINK(近用大部分场票)(PEM文件,CRT文件,KEY文件) 成名午旅价 网用后保证书,TUSUFEIS星评价送订电解于202 禁制  下品 姓名注册 IIS (PT&文件) 云斜析DNS ? 中请中 已益发 0 禁舱 下战 其他(PNM文件,AN文件,KERY文件) 行业公0 白劲化世地方面 招助 下载 标证书下载(CRT文件) 玩而这个关键,?用帮请了分隔,其这只知神入平个关律? 中国保证号(1150] 加入$SL证书交涂成 证书托教 操作 状态了 维定应名 证书信息 D:MICEKCCI 关团 部警下航 升级 托管中 共90天 10/ 元/中 门直 共1年 给产品打个分@ -->
![](https://cdn.nlark.com/yuque/0/2025/png/43218187/1742278144805-d8d3fa33-76ec-48b9-8edb-d164e7d392fc.png)

这里有两种主流方式进行，一种Nginx的，另一种是宝塔的，这两种我比较推荐，宝塔的话总的来说更加傻瓜式操作，更简单一些，不过我们这里使用的是命令行的方式部署的，那么我们选择比较通用的下载Nginx。

下载的压缩包中的文件包括有：

    - **hibiscus.fit.csr**：证书签名请求（申请证书时使用，部署时不需要此文件）
    - **hibiscus.fit.key**：私钥文件
    - **hibiscus.fit_bundle.crt**：证书文件（可能包含部分中间证书）
    - **hibiscus.fit_bundle.pem**：完整证书链文件（通常包含服务器证书及中间证书）

下载之后就要将压缩文件上传到服务器：

```plain
命令：
scp hibiscus.fit_nginx.zip 用户名@云服务器IP:~
```

	上传之后使用unzip进行解压缩：

```plain
unzip hibiscus.fit_nginx.zip 
```

### 1. 上传证书文件
首先，将你需要部署的文件（主要是 `hibiscus.fit.key` 和 `hibiscus.fit_bundle.pem`，也可以用 `hibiscus.fit_bundle.crt` 替换，如果 PEM 文件已包含所有证书链）上传到服务器。建议放在一个专用目录下，例如：

```plain
sudo mkdir -p /etc/nginx/ssl
sudo cp hibiscus.fit.key hibiscus.fit_bundle.pem /etc/nginx/ssl/
```

注意：一定要设置好文件权限，确保私钥文件安全（例如只允许 root 读取）：

```plain
sudo chmod 600 /etc/nginx/ssl/hibiscus.fit.key
```

### 2. 修改 Nginx 配置
编辑你网站对应的 Nginx 配置文件（例如 `/etc/nginx/sites-available/default` 或你自定义的配置文件）。添加或修改 443 端口的 server 块，如下所示：

```plain
server {
    listen 443 ssl;
    server_name hibiscus.fit www.hibiscus.fit;

    # 指定 SSL 证书和私钥（如果 hibiscus.fit_bundle.pem 包含完整链，可直接使用）
    ssl_certificate /etc/nginx/ssl/hibiscus.fit_bundle.pem;
    ssl_certificate_key /etc/nginx/ssl/hibiscus.fit.key;

    # 可选：添加一些基本的 SSL 配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # 其他配置（例如网站根目录、日志等）
    root /var/www/hibiscus.fit;
    index index.html index.htm;

    location / {
        try_files $uri $uri/ =404;
    }
}

# 可选：将 HTTP（80端口）请求重定向到 HTTPS
server {
    listen 80;
    server_name hibiscus.fit www.hibiscus.fit;
    return 301 https://$host$request_uri;
}
```

### 3. 测试 Nginx 配置
保存配置后，运行以下命令测试 Nginx 配置是否正确：

```plain
sudo nginx -t
```

如果显示配置正确（例如 “syntax is ok” 和 “test is successful”），则继续下一步。

### 4. 重载 Nginx
测试通过后，重载 Nginx 使配置生效：

```plain
sudo systemctl reload nginx
```

### 5. 验证部署
现在，打开浏览器访问 [https://hibiscus.fit](https://hibiscus.fit)  [https://www.hibiscus.fit](https://www.hibiscus.fit) SSL 证书已经生效。你可以点击浏览器地址栏的锁图标来查看证书详细信息。



在可以使用https之后又出现了另一个问题：

后端请求被屏蔽了，因为后端请求是非https的。。。。。所以现在页面看不到了

```plain
Mixed Content: The page at 'https://hibiscus.fit/' was loaded over HTTPS, but requested an insecure XMLHttpRequest endpoint 'http://1.14.99.158:8080/api/articles/recommend?num=10'. This request has been blocked; the content must be served over HTTPS.
（匿名） @ index-599eb9fb.js:28
index-599eb9fb.js:28 Mixed Content: The page at 'https://hibiscus.fit/' was loaded over HTTPS, but requested an insecure XMLHttpRequest endpoint 'http://1.14.99.158:8080/api/articles/recommend?num=6'. This request has been blocked; the content must be served over HTTPS.
（匿名） @ index-599eb9fb.js:28
articleService-cf0c640e.js:1 Error fetching recommended articles: xe
getRecommendedArticles @ articleService-cf0c640e.js:1
articleStore-b7ddcbe5.js:1 获取精选文章失败: xe
i @ articleStore-b7ddcbe5.js:1
articleService-cf0c640e.js:1 Error fetching recommended articles: xe
getRecommendedArticles @ articleService-cf0c640e.js:1
articleStore-b7ddcbe5.js:1 获取精选文章失败: xe
```

这是浏览器的混合内容错误提示，意思是你的网站是通过 HTTPS 加载的，但其中某个 AJAX 请求使用了 HTTP 协议，现代浏览器会阻止这种不安全的请求。

### 解决方案
1. **将 API 升级为 HTTPS**  
如果你的 API 服务器（目前是 `http://1.14.99.158:8080`）支持 HTTPS，修改请求地址为 HTTPS，例如：

```plain
https://1.14.99.158:8080/api/articles/recommend?num=10
```

这样所有内容都是通过 HTTPS 加载，就不会有混合内容问题。

2. **使用 Nginx 反向代理**  
如果 API 服务器不能直接使用 HTTPS，你可以在你的 Nginx 上配置反向代理。在你的 Nginx 配置中添加一个 location，将请求转发到 HTTP 的 API 服务器，这样浏览器访问的是 HTTPS 地址，而内部代理访问 HTTP。例如，在 HTTPS 的 server 块中添加：

```plain
location /api/ {
    proxy_pass http://1.14.99.158:8080/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

然后在前端将请求地址修改为相对路径 `/api/articles/recommend?num=10`。这样整个流程都是 HTTPS，浏览器就不会拦截了。

3. **前端修改请求地址**  
如果以上方案都不可行，确保前端所有请求都使用 HTTPS 协议。但最好的做法还是让 API 服务器支持 HTTPS 或使用反向代理转发。

选择一种方案，确保所有内容都通过 HTTPS 加载，就能解决这个混合内容问题。



这里在后端安装安全证书太过麻烦了，我建议使用第二种方式，使用Nginx进行反向代理即可。

