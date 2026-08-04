# Kubernetes技术简介


**1 微服务容器云大纲**


[马哥教育2021年微服务容器云课程大纲.pdf](https://www.yuque.com/office/yuque/0/2021/pdf/22822197/1636775010671-b350cbc8-c5b8-4df9-a7eb-7ea1503149f3.pdf?from=https%3A%2F%2Fwww.yuque.com%2Fwanghang888%2Fmz1nwt%2Fwwwoou)


**2 K8s架构的整体目标参考如下**
[一个完整的，全面K8s化的集群稳定架构（值得借鉴）](https://mp.weixin.qq.com/s/jV55dggamLN-I8ckDex02g)
[K8s学习简单目录](https://edu.csdn.net/skill/cloud_native/cloud_native-b7a0d39bc3694e03b5729a4e0d7862c4?category=838)


**3 怎么学习K8s**

<font style="color:rgb(36, 36, 36);">可以啊，你需要哪方面的呢？</font><font style="color:rgb(114, 46, 209);">其实不管阿里云云效，还是GitHub action，还是Jenkins，基本都是gitops这样一套标吧。</font>
<font style="color:rgb(114, 46, 209);">现在我们使用的GitHub action，那么你可以先了解一下gitops标准，然后再看看GitHub action的实操。理论结合实际，学的更快效果更好。</font>

<font style="color:rgb(114, 46, 209);">对于工具类的，比如DOCKER，K8S，GitHub action</font><font style="color:rgb(36, 36, 36);">，作为快速入门，其实可以到B站，或Google上，很多免费资料，带你快速入门，也够用了；要想稍微深入系统学习一下，那么可以花钱买一些高质量的视频;</font>


看完视频，有了项目经验，<font style="color:rgb(114, 46, 209);">再花时间通读一下官方文档，那么你基本上可以打败80%的人了,官方文档是最好的资料</font><font style="color:rgb(36, 36, 36);">，但是对于新手，读起来可能有点麻烦，带着项目经验去读官方文档，理解起来会更快，也更深入</font>

<font style="color:rgb(114, 46, 209);">工具类的学完，再看看行业标准，比如gitops，cncf，Redhat等出的标准和最佳实践，加上项目落地经验</font><font style="color:rgb(36, 36, 36);">，基本上你就可以出师了</font>


参考K8s的专题
[https://www.jianshu.com/nb/41283759](https://www.jianshu.com/nb/41283759)
[Kubernetes学习资源(博文汇总)](https://blog.csdn.net/qq_43437874/category_9836652.html)
[Openshift与Kubernetes的区别](https://www.cnblogs.com/wintersun/p/12210155.html)
[K8s学习资源汇总](https://blog.csdn.net/redrose2100/category_11460259_2.html)


# 微服务与K8s


参考:
[微服务与K8s](https://mp.weixin.qq.com/s/Wt7umMTWIPj2niegAgY2Vg)


# K8s部署SpringBoot项目的参考
<font style="color:rgb(38, 38, 38);">
</font>**<font style="color:rgb(38, 38, 38);">1 宜家项目</font>**<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">使用的的是阿里云服务器， 通过K8s实现自动化部署；</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">前端通过K8s自动化部署, 后端的Java项目也实现K8s实现自动化部署；</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">项目介绍， 项目是一个简单的额SpringBoot 项目，采用前后端分离，所以前端合后端要分开部署</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font>

<!-- 这是一张图片，ocr 内容为： -->
!

<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">slb+waf是阿里云</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">ingress 是K8s的门户</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">service front-end 是前端Ui</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">Ngnix </font><font style="color:rgb(232, 50, 60);">为啥要加这一层？ 前端ui直接请求service front-end，然后转到后端的java pod， 为啥要加一层Ngnix呢？有点想不通</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(114, 46, 209);">service front-end </font><font style="color:rgb(38, 38, 38);"> 是一层聚合， 专门配置后端服务的服务名？ 这一层也有点小疑问</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">java因公用的pod</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font>

# 了解 Kubernetes 的架构及特性


参考:
[参考:快速了解 Kubernetes 的架构及特性](https://mp.weixin.qq.com/s/1xiT2iUMiEEKnqYuGfT66A)
[详解 K8S 高可用部署，超详细！](https://mp.weixin.qq.com/s/TPt9Akf2OhK0y4stwa267g)
[K8s高可用部署(二)](https://mp.weixin.qq.com/s/jpMmAe3Kw4A-RuQvQlvGIw)

<font style="color:rgb(38, 38, 38);"></font>

# 基于K8s持续集成方案
<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font>**<font style="color:rgb(38, 38, 38);">1 阿里云的云效方案实现K8s持续集成</font>**<font style="color:rgb(38, 38, 38);">
</font>[基于云效实现自动化部署参考](https://blog.csdn.net/yuanchangliang/article/details/125185293)<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(245, 34, 45);">阿里云效如何实现自动化部署？</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font>**<font style="color:rgb(38, 38, 38);">2 基于阿里云的容器服务ACK</font>**<font style="color:rgb(38, 38, 38);">
</font>[阿里云容器服务官方文档](https://help.aliyun.com/product/85222.html?spm=5176.2020520152.help.dexternal.5b4716dd5XD2E7)<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(245, 34, 45);">云效的持续集成和容器服务Ack有什么区别？</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(245, 34, 45);">宜家在GitHub上的代码怎么和容器服务打通， 实现自动化部署？ 这也是一种思路？</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(245, 34, 45);">在云平台上的话， K8s升级等变化， 我们在代码层面上的调整？</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font>**<font style="color:rgb(0, 0, 0);">3 自己搭建K8s</font>**<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);"> 自己搭建K8s的劣势：</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);"> 1，</font><font style="color:rgb(51, 51, 51);">搭建集群繁琐;</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(51, 51, 51);"> 2，您需要手动配置Kubernetes相关的各种组件、配置文件、证书、密钥、相关插件和工具，整个集群搭建工作需要 花 费专业人员数天到数周的时间;</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(51, 51, 51);"> 3,在公共云上，需要投入大量的成本实现和云产品的集成。</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(51, 51, 51);"> 与阿里云上其他产品的集成，需要您自己投入成本来实现，如日志服务、监控服务和存储管理等。</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(51, 51, 51);"> 4，容器是一个系统性工程，涉及网络、存储、操作系统、编排等各种技术，需要专门的人员投入。</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(51, 51, 51);"> 5，容器技术一直在不断发展，版本迭代快，需要不断地试错、升级、测试。</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">总结: 不过是自建的K8s平台还是使用云服务器的产品服务， 都需要懂K8s专业技能的人才</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font>


**<font style="color:rgb(38, 38, 38);">Kubernetes官方文档</font>**

<font style="color:rgb(38, 38, 38);"></font>

[官网地址](https://kubernetes.io/zh-cn/)


## <font style="color:rgb(38, 38, 38);">使用Kubernetes容器化部署的一些小疑问</font>
<font style="color:#722ED1;">1 </font><font style="color:#722ED1;">使用K8s部署java应用之后，外部用户请求是如何请求到服务的？</font>

<font style="color:#722ED1;">2 K8s内部的容器是如何进行通信的？</font>

<font style="color:#722ED1;">3 K8s如何访问外部系统的接口或者外部的互联网或者，另外一个K8s集群？</font>

<font style="color:#722ED1;">4 K8s如何集成配置中心、Rdis、Mq、Mongdb、mysql等这些？应用和这些组件都是要以K8s容 器部 署吗？</font>

<font style="color:#722ED1;">5 K8s如何集成Ngnix？</font>

<font style="color:#722ED1;">6 如果使用K8s部署Mysql持久化关系型数据库的话， 那么事怎么存储的？那么部署Redis、Mongodb这些nosql的数据库呢？</font>

<font style="color:#722ED1;">7 K8s 如何实现持续集成，集成Git和Maven，如何实现自动打包？然后部署</font>

<font style="color:#722ED1;">8 如果使用云服务的K8s(阿里云的容器云服务 ACK)和自建K8s自动部</font>

<font style="color:rgb(38, 38, 38);"></font>

# 1 Kubernetes 容器内访问外部接口
<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font>**<font style="color:rgb(38, 38, 38);">1 场景</font>**<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">在应用程序中经常会涉及到第三方系统的集成，我们采用K8s容器化部署的时候，</font><font style="color:rgb(114, 46, 209);">从容器内访问外部系统的接口时，外部系统或许也是K8s或者虚拟机部署的，这个时候也许会请求不通的情况</font><font style="color:rgb(38, 38, 38);">，这个时候我们该怎么解决呢？</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">参考</font><font style="color:rgb(38, 38, 38);">
</font>[官网解决方案参考](https://kubernetes.io/zh-cn/docs/concepts/services-networking/service/)<font style="color:rgb(38, 38, 38);">
</font>[其他参考](https://akomljen.com/kubernetes-tips-part-1/)<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font>


# 2 Kubernetes读取应用程序的配置文件
<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font>**<font style="color:rgb(38, 38, 38);">1 场景</font>**<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">在应用程序中我们会有很多配置文件， 一般配置文件我们可以使用像Nacos、Apollo等配置中心，这样就需要部署Nacos、Apollo等配置中心，但是如果使用KuberNetes容器化部署的话，</font><font style="color:rgb(114, 46, 209);">应用程序在容器内， 怎么使用配置中心呢？这是一个问题</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(0, 0, 0);">方案二：</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(0, 0, 0);">我们可以直接将配置文件放在Kubernetes中，然后应用程序读取，那么Kubernetes是如何处理配置文件的呢？</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(0, 0, 0);">参考</font><font style="color:rgb(38, 38, 38);">
</font>[官方Kubernetes处理配置文件-configMap](https://kubernetes.io/zh-cn/docs/concepts/configuration/configmap/)<font style="color:rgb(38, 38, 38);">
</font>[官网Kubernetes处理配置文件加密-Secret](https://kubernetes.io/zh-cn/docs/concepts/configuration/secret/)<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font>


# 3 Kubernete存储
<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">场景</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(114, 46, 209);">在使用K8s部署关系型数据库时，那么是如何存储的呢？</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">参考</font><font style="color:rgb(38, 38, 38);">
</font>[Kubernetes之存储](https://kubernetes.io/zh-cn/docs/concepts/storage/volumes/)<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font>


<font style="color:rgb(38, 38, 38);">


</font>


