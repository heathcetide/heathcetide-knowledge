微信小程序开发已知包括：

1.使用微信原生代码

2.使用前端框架包括uniapp，taro，mpvue。



下载微信小程序开发平台，

使用uniapp下载HbuildX

需要将微信小程序代码转为手机App，并且给出了一个FinClip的技术，但是这里我不太了解，甚至感觉就算这个能转化，那我这个使用uniapp的框架做出来的小程序能否进行这样的转换。



App相关知识：

一般来说会把开发手机App的类型分为3大类：

1.Web，（其实就是在手机上使用浏览器浏览网页，和在电脑上浏览网页不同，WebApp是针对手机屏幕的大小做出适应的，也就是，只要手机有浏览器就可以使用WebApp，也就不用担心用户使用的是IOS还是Android系统，前端只用HTML，css，JS就可以写出WebApp，如果WebAPP是动态的，那么后端使用的语言也并没有被限制死，开发难度和周期都会小很多，）

缺点：找应用的时候要么去搜索要么输入URL，而且访问不了手机里大部分内置功能，比如摄像头，联系人等等。



2.Native，NativeAPP就是原生APP的意思，性能最好，而且可以访问手机的内置功能，毕竟就是使用手机系统提供的编程语言和手机进行沟通

比如Android一般就是用Java或者Kotlin开发

而IOS则使用Objective-C或者Swift开发

所以缺点也很明显，一个App通常需要两拨开发人员，毕竟这些语言的差别还是有的，而且还有学习难度（费用大，周期长）

3.Hybrid：也就是混合开发APP，其实就是将WebAPP和NativeAPP结合起来，外层壳使用Native原生构建，内容使用html5构建。但是不用点开浏览器，原生中提供了浏览器的类，其实就是内置浏览器，而这个浏览器类就可以处理H5的操作了，这个类其实就是WebView，这样使得HybridApp处于Web和Native的中间，但是还是有一些问题，比如部分功能还是需要安卓和IOS两拨人去维护，一些功能还是要实现两遍，而且H5没法获取APP原生的一些系统权限，也不支持本地缓存。

到了后面，各个大厂都在自己的APP中加入了小程序，小程序虽然也是基于WebView渲染，但是小程序把逻辑层和渲染层分开了，使得脚本线程和渲染线程不会相互排斥。比如UI渲染和Java脚本都放在同一个单线程执行，就容易导致逻辑任务与渲染任务的资料大打架



大厂有很多开发人员可以实现在APP中加入小程序，而微信小程序并不是说随随便便就可以加入到自己的APP中，怎么也得需要一个小程序容器，但是并不是每个人都有时间和技术去造轮子，如何找到这个小程序容器呢。

这里找到了一个FinCLip，让小程序在苹果应用中无缝运行

FInClip官网[https://www.finclip.com/](https://www.finclip.com/)

其体验与微信小程序开发者几乎一模一样，而且还有免费额度



具体操作步骤：

1.进入官网进行注册账号

<!-- 这是一张图片，ocr 内容为：FINCLIP 甜 登录 没有账户?免费注册 请输入邮箱/用户名/手机号 请输入密码 登录 忘记密码 手机验证码登录 第三方登录 微信 GITEE FINCLIP小程序数字管理平台 -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1731556332313-2525befa-e754-4a7b-853b-4ab9b3d377de.png)

2.在我的小程序处创建新的小程序（这个可以免费创建），创建之后即可获取到小程序的AppID，跟微信操作是一样的

<!-- 这是一张图片，ocr 内容为：小程序开放平台 FINCLIP小程序数字管理平台 上午好,今天是 2024/11/14 首页 数据概览 资源看板 待办中心 代码包下载量 日志上传流量 接口请求次数 35 2.21 MB 0.01 MB 小程序 应用管理 开发 我的小程序 剩余可创建:4 创建小程序 分析 低功耗(0) H5应用(O) 全部(1) 小组件(0) 小程序(1) 小游戏(0) -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1731556401172-817b4313-0d6e-4b26-80f9-5f63c0024ab0.png)

3.创建我的应用

新增一个应用，创建基本信息，然后配置关联小程序

<!-- 这是一张图片，ocr 内容为：小程序开放平台 应用 请输入应用名称 新增 首页 小程序 启用状态 状态 应用名称 应用管理 有效 高原传染病自主判别软件 开发 高原重点传染病自主判别软 有效 分析 件 -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1731556457334-19a5e9df-5613-4d2f-b6b7-52769b39c10c.png)

添加配置小程序，选择目标小程序就可进行关联

<!-- 这是一张图片，ocr 内容为：详细信息 关联小程序 BUNDLEID 其他 API与菜单 小程序列表 邀请第三方小程序 配置小程序 关联状态 操作 小程序名称 APPLD -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1731556502539-1c7500b1-2c86-4850-85e6-080e7122cf9a.png)

关联之后即可进行开发，这里可以去下载FinClip的开发IDE[小程序开发工具下载_小程序sdk下载资源-FinClip资源下载-泰坪小程序开放平台](https://www.finclip.com/downloads/?activeTab=ide)

下载成功之后打开，然后进行登录和配置，导入小程序即可

<!-- 这是一张图片，ocr 内容为：导入项目 管理项目 中运行小程序(兼容性检查工具) 选择项目目录 个小V个 UNPACKAGE>DIST>DEV>MP-WEIXIN 组织 新建文件夹 修改日期 名称 2024/11/ COMMON WPS云盘 2024/11/ COMPONENTS 乐云云盘 2024/11/ PAGES 此电脑 2024/11/ STATIC WINDOWS-SSC 2024/11/ UNI MODULES DATA(D:) 2024/11/ UVIEW-UI 新加卷(E:) MOVESPEED MOVESPEED(C 网络 文件夹: 打开 -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1731568274402-d7faa57b-5a2a-41c4-95ab-75aafe170389.png)

将小程序代码写好之后点击上传按钮进行版本提交：

输入版本号和版本说明即可进行代码提交。

<!-- 这是一张图片，ocr 内容为：普通编译 真机调试清理缓存 详情 预览 上传 编译 别软件 上传小程序 APP ID: FC2446722989134917(高原重点传染病自主判别软件) 版本号: 建议为X.Y.Z格式,当前版本号1.6.8 版本说明: 请输入 确定 取消 -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1731568331746-6ebec169-0419-4c01-9354-81d22f5611cc.png)



然后回到开发者页面[https://www.finclip.com/dev#/miniApp/](https://www.finclip.com/dev#/miniApp/)

<!-- 这是一张图片，ocr 内容为：信息详情 版本管理 第三方平台关联 灰度发布 开发域名配置 关联应用 其他 隐私设置 线上版本V1.6.7 提交时间:2024/11/1414:53 提交用户:HEATHCETIDE 版本说明:该出手时要出手 山下载二维码 工取消发布版本 版本回退 导出离线包 微信小程序管理 审核版本 无审核版本配置审核版本 体验版本V1.4.2 提交时间:2024/11/13 22:28 提交用户:HEATHCETIDE 版本说明:22.28上次 -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1731568393450-40e274e6-299a-437e-93a7-92ac1e5f0405.png)

此时配置审核版本，选择需要提交的小程序版本，然后点击自行审核（这里只需要自己点击审核即可）

<!-- 这是一张图片，ocr 内容为：隐私设置 开发域名配置 关联 其他 审核处理提示 小程序需要自行审核请在待办中心完成小程序的审核操作 后,进行发布上架操作. 下次不再提示 下载二维码 取消发布版本 版本回退 确认并跳转至审核页 取消 审核中 审核版本 V1.6.8 提交时间:2024/11/1415:13 提交用户:HEATHCETIDE 版本说明:悲伤放弃版 山下载二维码 审核意见: 175秒后过期 培销 -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1731568440225-34639ecf-e931-4945-aff8-3d28dd347c91.png)<!-- 这是一张图片，ocr 内容为：不可发布 发布状态: 下载二维码 申请人: HEATHCETIDE 175秒后过期 2024/11/1415:13 最后操作时间: 悲伤放弃版 版本说明: 审核预览信息 用户名:- 密码: 描述: 截图: 隐私保护提示 上一条下一条 驳回 取消 通过 -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1731568484058-a2f1cc62-456f-4772-bc7b-4f93b8da96ed.png)

点击通过审核之后即可发布上线版本，此时就没有问题了。



回到FinClipStudio开发者工具：  
点击生成APP

<!-- 这是一张图片，ocr 内容为：详情 生成APP 上传 导出 生成APP 生成APP配置 生成鸿蒙APP NEW 生成鸿蒙APP配置 查看云打包进展 -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1731568562674-cae03824-2abf-4de7-8bc6-615b58185a66.png)

这里会先进行App的配置，基本配置随便输入即可，这里并没有太强制的要求。

生成APP配置完成之后，即可点击生成APP

<!-- 这是一张图片，ocr 内容为：生成APP 第一步,选择小程序生成APP方式 云打包(推荐选项,通过FINCLIP完成小程序转APP,无需自行编译) 本地编译(建议有开发基础用户选择,需要自行在本地进行编译) 如何区分APP生成方式 本地编译类型仅面向拥有一定移动APP开发经验的开发者使用,如果您此前从未使用过 APPLE XCODE,GOOGLE STUDIO 或其他IDE开发IOS与ANDROID 原生应用,请选择"云 打包". 上一步 下一步 不清楚如何使用?查看功能介绍 -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1731568644023-481fb9b2-38d2-45ed-8837-e9f08c5c2510.png)

这里使用云打包开始速度打包

<!-- 这是一张图片，ocr 内容为：生成APP 第四步,选择APP所属平台 IOS 应用(可用于IPHONE,IPAD 设备): ANDROID 应用(可用于ANDROID 手机,或智能电视等设备): 为什么要选择APP平台 在IOS与ANDROID平台中开发应用有对应的证书要求.只有当开通苹果官方开发者账号 后才可以上架苹果应用,请您根据实际需要选择所属平台. 上一步 下一步 不清楚如何使用?查看功能介绍 -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1731568682299-7a3f1353-7bb1-408f-833a-e843b6bf3476.png)

这里选择安卓应用，然后点击下一步。

<!-- 这是一张图片，ocr 内容为：生成APP 第五步,上传打包证书 配置ANDROID应用证书 证书别名 YOURALIAS 证书私钥 000000000000 文件私钥 OOOOOOOOOOOO 证书文件 G://KEYSTORE.JKS 2在IOS与ANDROID平台中开发应用有对应的证书要求.只有当开通苹果官方开发者 账号后才可以上架苹果应用,请您根据实际需要选择所属平台. 为了保证每一款移动应用都不会被他人轻易篡改或替换,IOS与ANDROID平台中的应用 程序在发布过程中需要通过证书进行加密,只有当您上传所需的相关信息与文件后,云 打包工作才能正常开展. 不清楚如何使用?查看功能介绍 下一步 上一步 -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1731568713149-83fb03a6-c7f6-4b7d-8b9d-45fd0aedcb08.png)

keytool -genkey -keyalg RSA -keysize 2048 -dname "cn=Your Name,ou=Department,o=YourOrganization,l=City,st=State,c=CountryCode" -alias yourAlias -keypass yourPassword -storepass yourPassword -validity 36500 -keystore /path/to/your/keystore.jks 这里面storepassword，alias，password分别是什么

生成生疏的命令

```plain
keytool -genkey -keyalg RSA -keysize 2048 -dname "cn=Your Name,ou=Department,
o=YourOrganization,l=City,st=State,c=CountryCode" -alias yourAlias -keypass 
yourPassword -storepass yourPassword -validity 36500 -keystore /path/to/your/
keystore.jks
```

