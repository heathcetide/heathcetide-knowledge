[https://dashboard.ngrok.com/get-started/setup/windows](https://dashboard.ngrok.com/get-started/setup/windows)内网穿透工具官网。

在这里下载内网穿透工具，然后将exe文件的路径复制下载，放入到系统变量的Path中进行存储。

然后呢需要在

[https://dashboard.ngrok.com/get-started/your-authtoken](https://dashboard.ngrok.com/get-started/your-authtoken)

使用命令将authtoken设置一下才能够使用内网穿透工具

```plain
ngrok config add-authtoken $YOUR_AUTHTOKEN
```

然后随机点开一个cmd命令行工具，输入

```plain
ngrok http 80(端口号)
```

这样也就开启了内网穿透，此时它会显示出相应的内网和公网的地址，可以根据公网的地址进行访问即可使用了



但是在微信小程序这里，除了改变代码上的地址还不行，还需要在开发者平台这里修改

[https://mp.weixin.qq.com/wxamp/devprofile/get_profile?token=58194212&lang=zh_CN](https://mp.weixin.qq.com/wxamp/devprofile/get_profile?token=58194212&lang=zh_CN)<!-- 这是一张图片，ocr 内容为：小程序 付费管理 门店管理 服务器域名 木月还可修改49次 修改 统计 使用数行天行及连锁和天护省.大部落部面部落部项行,解入周刀,面部我的向直接有合部.可收用DOONT度气类有效于,其现项目,直理省,直接复合,成分表行解驾驶下 品功能 域名 可配置数量 服务器配置 品开发 200个 HTTPS://FB77-2409-8A20-42F0-51A0-D48-C6CE-ABD8-CFC4.NGROK-FREE.APP REQUEST合法域名 开发管理 开发工具 200个 SOCKET合法域名 云服务 成长 2001 UPLOADFILE合法域名 -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1723958354644-ae4fdfc1-99b8-4195-a7c7-a429c7ec24b5.png)

如果改完之后还是有之前的报错就可以清除一下缓存，然后把这个项目删了重新进行导入。





