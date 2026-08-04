# 微服务简介
<font style="color:rgb(38, 38, 38);">  
</font>**<font style="color:rgb(38, 38, 38);">1:微服务的简单介绍：</font>**<font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(64, 64, 64);"> 服务就是在实现某个业务逻辑的模块或者应用，微服务就是将原有的服务在以更小的粒度去拆分成一个服务。</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);"> 微服务的拆分原则：</font><font style="color:rgb(64, 64, 64);">将应用拆分成微服务应当遵循单一职责，也就是将服务中紧密相关的业务放在一起，无关的业务分离出去，例如：支付和订单可以做成一个服务，登录注册可以作为一个服务。每个服务运行在自己的进程中不会相互干扰。每个服务拥有自己的独立存储系统。</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(64, 64, 64);"> 优点：</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(64, 64, 64);"> 微服务从业务上对系统进行了垂直拆分，将各个业务分离成一个个小的应用，</font><font style="color:rgb(38, 38, 38);">使其实现了业务的职责单一化，减小了业务的之间的耦合度，提高系统的可用性，微服务架构一般还要拥有容错设计：</font>_<font style="color:rgb(38, 38, 38);">单个服务出问题时对其他的业务影响不大，或者为服务引入的熔断、降级、限流使其出现问题的概率大幅度降低</font>_<font style="color:rgb(38, 38, 38);">  
</font>_<font style="color:rgb(38, 38, 38);">缺点：</font>_<font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(64, 64, 64);">数据一致性降低，增加了运维的难度和复杂度，系统的架构变得更加复杂。</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font>**<font style="color:rgb(38, 38, 38);">2:基于Linux的Centos部署方式实现的问服务：</font>**<font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font>**<font style="color:rgb(38, 38, 38);">2.1)基于Linux的服务器部署的图如下:</font>**<font style="color:rgb(38, 38, 38);">  
</font>

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1634006217250-6ef6e6d5-4307-470b-a661-eab3cce94559.png?x-oss-process=image%2Fformat%2Cwebp)

<font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font>**<font style="color:rgb(38, 38, 38);">2.2)基于阿里云云安全的部署图。</font>**<font style="color:rgb(38, 38, 38);">  
</font>

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2021/png/22822197/1634270426031-bbc257c9-7c89-4a41-9453-a874329661b4.png?x-oss-process=image%2Fformat%2Cwebp)

<font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">这幅图中需要注意的点：</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);"> 运维人员：通过VPN+堡垒玑+ssh的方式访问到内网。</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);"> 外部api+客户端的Http请求，以Https的形式访问，先到云顿这层的网络保护？这个云顿是什么？</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);"> 客户端访问静态资源， 也是以https的吗？</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font>**<font style="color:rgb(38, 38, 38);">3:维服务的优缺点:</font>**<font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(51, 51, 51);"> 优点:服务独立测试、部署、升级、发布</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(51, 51, 51);"> 缺点：微服务提高了系统的复杂度，</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(51, 51, 51);"> 开发人员要处理分布式系统的复杂性，除了常规的问题外，还有像数据隔离的报表问题要处理。</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font>**<font style="color:rgb(38, 38, 38);">4:微服务设计需要考虑的问题：</font>**<font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(51, 51, 51);">在微服务化过程中，要使用哪些中间件解决服务之间通信和服务治理的问题，其中就包括:</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(114, 46, 209);">用 RPC 框架解决服务通信的问题；</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(114, 46, 209);">用注册中心解决服务注册和发现的问题；</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(114, 46, 209);">使用分布式 Trace 中间件，排查跨服务调用慢请求；</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(114, 46, 209);">使用负载均衡服务器，解决服务扩展性的问题；</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(114, 46, 209);">在 API 网关中植入服务熔断、降级和流控等服务治理的策略。</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font>**<font style="color:rgb(38, 38, 38);">4.1)发现故障的征兆:</font>**<font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(51, 51, 51);"> 在高并发分布式的场景下，故障经常是突然间就雪崩式爆发。所以必须建立完善的监控体系，尽可能发现故障的征兆。</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(51, 51, 51);"> 微服务架构中组件繁多，各个组件所需要监控的指标不同。</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(51, 51, 51);"> 比如Redis缓存一般监控占用内存值、网络流量，数据库监控连接数、磁盘空间，业务服务监控 并发数、响应延迟、错误率等。因此如果做一个大而全的监控系统来监控各个组件是不大现实 的，而且扩展性会很差。</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(51, 51, 51);"> 一般的做法是让各个组件提供报告自己当前状态的接口（metrics接口），这个接口输出的数据 格式应该是一致的。</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(51, 51, 51);"> 然后部署一个指标采集器组件，定时从这些接口获取并保持组件状态，同时提供查询服务。最后还需要一个UI，从指标采集器查询各项指标，绘制监控界面或者根据阈值发出告警。</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font>**<font style="color:rgb(38, 38, 38);">4.2)链路的追踪：</font>**<font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(51, 51, 51);"> 在微服务架构下，一个用户的请求往往涉及多个内部服务调用。为了方便定位问题，需要能够记录每个用户请求时，微服务内部产生了多少服务调用，及其调用关系。这个叫做链路跟踪。</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">要实现链路跟踪，每次服务调用会在HTTP的headers中记录至少记录四项数据:</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(51, 51, 51);">traceId：traceId标识一个用户请求的调用链路。具有相同traceId的调用属于同一条链路,</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(51, 51, 51);"> spanId：标识一次服务调用的ID，即链路跟踪的节点ID,</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(51, 51, 51);"> parentId：父节点的spanId,</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">requestTime & responseTime：请求时间和响应时间。</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(51, 51, 51);">链路跟踪只能定位到哪个服务出现问题，不能提供具体的错误信息。查找具体的错误信息的能力则需要由日志分析组件来提供</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font>**<font style="color:rgb(38, 38, 38);">4.3)日志分析：</font>**<font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(51, 51, 51);"> 日志分析组件在微服务兴起之前就被广泛使用了。</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">日志服务可以使用ELK日志分析组件。ELK是Elasticsearch、Logstash和Kibana三个组件的缩写。</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(51, 51, 51);">Elasticsearch：搜索引擎，同时也是日志的存储。</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(51, 51, 51);"> Logstash：日志采集器，它接收日志输入，对日志进行一些预处理，然后输出到Elasticsearch。</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(51, 51, 51);"> Kibana：UI组件，通过Elasticsearch的API查找数据并展示给用户。</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font>**<font style="color:rgb(38, 38, 38);">4.4)权限控制，服务治理</font>**<font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(51, 51, 51);"> 在调用者和被调用者中间加一层网关，每次调用时进行权限校验。另外，网关也可以作为一个提供服务接口文档的平台。</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(51, 51, 51);"> 网关在粒度上的区别：</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(51, 51, 51);"> 粗粒度的方案是，整个微服务一个网关，微服务外部通过网关访问微服务，微服务内部则直接 调用。</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(51, 51, 51);"> 细粒度的方案是，不管是微服务内部调用或者来自外部的调用，都必须通过网关。</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font>**<font style="color:rgb(38, 38, 38);"> 4.5)熔断、服务降级、限流</font>**<font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(51, 51, 51);"> 服务熔断：</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(51, 51, 51);"> 当下游的服务因为某种原因突然变得不可用或响应过慢，上游服务为了保证自己整体服务的可用性，</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(51, 51, 51);"> 不再继续调用目标服务，直接返回，快速释放资源。</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(51, 51, 51);"> 服务限流：</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(51, 51, 51);"> 限流：限流策略有很多，最简单的比如当单位时间内请求数过多时，丢弃多余的请求。</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(51, 51, 51);"> 服务降级：两种形式</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(51, 51, 51);"> 当下游的服务因为某种原因</font>**<font style="color:rgb(51, 51, 51);">不可用</font>**<font style="color:rgb(51, 51, 51);">，上游主动调用本地的一些降级逻辑，避免卡顿，迅速返回给用户！ </font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(51, 51, 51);">当下游的服务因为某种原因</font>**<font style="color:rgb(51, 51, 51);">响应过慢</font>**<font style="color:rgb(51, 51, 51);">，下游服务主动停掉一些不太重要的业务，释放出服务器资源，增加响应速度！</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(51, 51, 51);"> 熔断和服务降级的区别：</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(51, 51, 51);"> 服务降级有很多种降级方式！如开关降级、限流降级、熔断降级!</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(51, 51, 51);"> 服务熔断属于降级方式的一种！</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(51, 51, 51);">因为从实现上来说，熔断和降级必定是一起出现。因为当发生</font>**<font style="color:rgb(51, 51, 51);">下游服务不可用</font>**<font style="color:rgb(51, 51, 51);">的情况，就需要</font>**<font style="color:rgb(51, 51, 51);">进入上游的降 级逻辑</font>**<font style="color:rgb(51, 51, 51);">了,熔断也是降级的一种。</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font>**<font style="color:rgb(38, 38, 38);">5 微服务实践参考</font>**<font style="color:rgb(38, 38, 38);">  
</font>

| <font style="color:rgb(38, 38, 38);">Spring Cloud入门介绍</font><font style="color:rgb(38, 38, 38);">   </font> | [https://www.jianshu.com/p/747dc0a4322a](https://www.jianshu.com/p/747dc0a4322a)<font style="color:rgb(38, 38, 38);">   </font> |
| --- | --- |
| [Spring Cloud Alibab](https://www.jianshu.com/nb/34732659)<font style="color:rgb(38, 38, 38);">a实践</font><font style="color:rgb(38, 38, 38);">   </font> | [https://www.jianshu.com/nb/34732659](https://www.jianshu.com/nb/34732659)<font style="color:rgb(38, 38, 38);">   </font> |
| <font style="color:rgb(38, 38, 38);">spring cloud中国社区的官方</font><font style="color:rgb(38, 38, 38);">   </font><font style="color:rgb(38, 38, 38);">spring Cloud技术的线下分享</font><font style="color:rgb(38, 38, 38);">   </font><font style="color:rgb(38, 38, 38);">   </font><font style="color:rgb(38, 38, 38);">spring Cloud官方GitHub</font><font style="color:rgb(38, 38, 38);">   </font><font style="color:rgb(38, 38, 38);">spring Cloud </font><font style="color:rgb(64, 64, 64);">Netflix</font><font style="color:rgb(38, 38, 38);">实践</font><font style="color:rgb(38, 38, 38);">   </font> | [https://github.com/SpringCloud](https://github.com/SpringCloud)<font style="color:rgb(38, 38, 38);">   </font>[https://github.com/SpringCloud/spring-cloud-document](https://github.com/SpringCloud/spring-cloud-document)<font style="color:rgb(38, 38, 38);">   </font>[https://spring.io/projects/spring-cloud](https://spring.io/projects/spring-cloud)<font style="color:rgb(38, 38, 38);">   </font>[https://www.jianshu.com/nb/51143763](https://www.jianshu.com/nb/51143763)<font style="color:rgb(38, 38, 38);">   </font> |


<font style="color:rgb(38, 38, 38);">  
  
  
  
</font>**<font style="color:rgb(38, 38, 38);">6 微服务实践技巧</font>**<font style="color:rgb(38, 38, 38);">  
</font>[微服务中的二次浅封装实战](https://mp.weixin.qq.com/s/yApUyG1xH8Geg8oR1NM1IQ)<font style="color:rgb(38, 38, 38);">  
</font>[系统服务话之后，这几点需要注意](https://mp.weixin.qq.com/s/XVlPJMBlNHiseO5wgFcVCQ)<font style="color:rgb(38, 38, 38);">  
</font>[微服务技术选型参考](https://mp.weixin.qq.com/s/YpoUULSxFVC71jPsqKVn-g)<font style="color:rgb(38, 38, 38);">  
  
  
  
  
</font>**<font style="color:rgb(38, 38, 38);">7 微服务实战案例源码</font>**<font style="color:rgb(38, 38, 38);">  
</font>[微服务实战案例](https://mp.weixin.qq.com/s/yApUyG1xH8Geg8oR1NM1IQ)<font style="color:rgb(38, 38, 38);">  
</font>[微服务架构中，二次浅封装实战](https://mp.weixin.qq.com/s/CC7KQ5Vi3HQcp0jdVP2Hmw)<font style="color:rgb(245, 34, 45);">推荐</font><font style="color:rgb(38, 38, 38);">  
</font>[Spring Cloud 微服务技术练手gitHub](https://github.com/shenniubuxing3/springcloud-Finchley.SR2)<font style="color:rgb(245, 34, 45);"> 推荐</font><font style="color:rgb(38, 38, 38);">  
</font>[微服务实战:微服务架构实战](https://blog.csdn.net/u011177064/category_9572944.html)<font style="color:rgb(38, 38, 38);">  
  
  
  
</font>  


# 微服务实践资料参考
  
  
**1 各互联网公司微服务实践**  
[去哪儿旅行微服务架构实践](https://mp.weixin.qq.com/s/bYkAAkAm1RKeHyg2hc2HPg)  
[单体架构服务转型至分布式的踩坑经历](https://mp.weixin.qq.com/s/FZVujIwGulnkF69FE_WwwQ)  
[微服务架构(专业)](https://www.cnblogs.com/wintersun/p/6219259.html)  
  
  
  
  
  
**2 微服务面试**  
[Spring Cloud最全面试题整理，全是干货](https://mp.weixin.qq.com/s/77zEuRCJi5CAFDOmFBqekw)  
[Spring Cloud微服务介绍](https://mp.weixin.qq.com/s/6KbIEVKGdWwQy1EW_S3o5w)  
[SpringCloud 是什么？能干什么？组件现状如何？](https://mp.weixin.qq.com/s/6KbIEVKGdWwQy1EW_S3o5w)  
  
  
  
  
  
  
参考:  
[企业微服务架构实战](https://blog.csdn.net/u011177064/category_9572944.html)





# 1 居然之家智慧物流项目
** 1 网关服务设计**  


<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2022/jpeg/22822197/1667887995475-8e99e3a0-a3cb-4005-8219-1940edf52a88.jpeg?x-oss-process=image%2Fformat%2Cwebp%2Finterlace%2C1)

  
** 2 网关展现的能力**  


<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2022/jpeg/22822197/1667888003387-01f606da-c085-47e0-a02c-1ef237d0c2f1.jpeg?x-oss-process=image%2Fformat%2Cwebp%2Finterlace%2C1)

  
** 3 网关的安全设计**  


<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2022/jpeg/22822197/1667888020152-96ddc436-55b1-46ca-8584-81e9f46cee05.jpeg?x-oss-process=image%2Fformat%2Cwebp%2Finterlace%2C1)

  
  
** 4 网关的权限认证设计**  


<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2022/jpeg/22822197/1667888025125-88674a50-b7da-495e-a047-745e181fe692.jpeg?x-oss-process=image%2Fformat%2Cwebp%2Finterlace%2C1)

  
  
** 5 微服务业务中台架构设计**  


<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2022/jpeg/22822197/1667888032091-7fa7edfe-0df9-4c67-948b-d0c9db24a08d.jpeg?x-oss-process=image%2Fformat%2Cwebp%2Finterlace%2C1)

  
  
** 6 微服数据库架构设计**  


<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2022/jpeg/22822197/1667888038037-17b8f826-a212-413c-98fb-92c1920a77c4.jpeg?x-oss-process=image%2Fformat%2Cwebp%2Finterlace%2C1)

  
  
** 7 业务能力展现**  


<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2022/jpeg/22822197/1667888043128-c686596c-b6f9-4be2-b4fe-d62078b5ffcb.jpeg?x-oss-process=image%2Fformat%2Cwebp%2Finterlace%2C1)

  
  
** 8 微服务云效部署**  


<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2022/jpeg/22822197/1667888047917-98d12b0c-4250-4325-9321-852d566ba171.jpeg?x-oss-process=image%2Fformat%2Cwebp%2Finterlace%2C1)

  
  
** 9 微服务日志搜集监控**  


<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2022/jpeg/22822197/1667888051802-f0ccc553-cd0a-480a-a8c9-09b62c53358d.jpeg?x-oss-process=image%2Fformat%2Cwebp%2Finterlace%2C1)

  
  
** 10 其他**  
**10.1 持续化部署方案**  


<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2022/jpeg/22822197/1667888057010-d47e97db-7a52-4c07-a6d6-6a8e138333ce.jpeg?x-oss-process=image%2Fformat%2Cwebp%2Finterlace%2C1)

  
**10.2 前端组件化封装**  


<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2022/jpeg/22822197/1667888062605-ea7a8c09-9822-4b8a-bd74-b8a4a8594d13.jpeg?x-oss-process=image%2Fformat%2Cwebp%2Finterlace%2C1)

  
  
**10.3 移动端设计**  


<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2022/jpeg/22822197/1667888067312-2391472a-f2ec-4646-b966-124548d6c3fd.jpeg?x-oss-process=image%2Fformat%2Cwebp%2Finterlace%2C1)

  


若有收获，就点个赞吧

  
 

# 微服务优秀博文
**1 微服务实践**  
[微服务下蓝绿发布、滚动发布、灰度发布等方案，必须懂！](https://mp.weixin.qq.com/s/-A2TCKI6kUJebyIX8kqfRw)  
[微服务:注册中心技术选型](https://mp.weixin.qq.com/s/onNYpGtDsVUhRTj3SzxFiw)  
[聊聊微服务架构中认证鉴权那些事](https://mp.weixin.qq.com/s/fMFdIHTMWCOMKlDgSP0onQ)  
[Spring Cloud微服务如何保证各微服务调用安全](https://mp.weixin.qq.com/s/GRF7SGkr2VIhxvo-FPLsKA)  
[微服务之服务监控和治理、容错隔离、Docker总结](https://mp.weixin.qq.com/s/GgssFqtRLj6r_EFrniDI0w)  
[微服务如何聚合API文档](https://mp.weixin.qq.com/s/PBkKrDtEDvszzeaPjnJ8Zg)  
[聊聊微服务架构下的数据架构](https://mp.weixin.qq.com/s/IEhfzgfidGlRXmxTROI7gQ)  
[微服务架构常见的设计模式](https://mp.weixin.qq.com/s/DeXPNclNMewgGOwccW8DqA)  
[spring Cloud 微服务优雅地下线](https://mp.weixin.qq.com/s/4lAnmiSjEE7cZcZWfAbGVg)  
[悟空聊架构:Spring Cloud组件的源码分析](https://mp.weixin.qq.com/mp/appmsgalbum?action=getalbum&__biz=MzAwMjI0ODk0NA==&scene=1&album_id=2083392961806925826&count=3#wechat_redirect)<font style="color:rgb(232, 50, 60);">推荐</font>  
  


若有收获，就点个赞吧

  
 

# 为什么要使用微服务？
<font style="color:rgb(38, 38, 38);">  
</font>**<font style="color:rgb(38, 38, 38);">1 单体架构</font>**<font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(114, 46, 209);">单体应用就是将应用程序的所有功能都打包成一个独立的单元，最终以一个WAR包或JAR包存在</font><font style="color:rgba(0, 0, 0, 0.65);">，里面包含</font><font style="color:rgba(0, 0, 0, 0.65);">DAO,Service、UI等所有的逻辑。不幸的是，这种简单的单元有很大的局限性。应用程序随着业务需求的迭代，功能的追加扩展,最终成为一个庞然大物。</font><font style="color:rgb(38, 38, 38);">  
</font>**<font style="color:rgba(0, 0, 0, 0.65);">单体架构的缺点</font>**<font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(114, 46, 209);">1 复杂性高</font><font style="color:rgba(0, 0, 0, 0.65);">:</font><font style="color:rgba(0, 0, 0, 0.65);">业务规模和团队规模发展的一定阶段，模块耦合严重，代码难以理解，质量变差;</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(114, 46, 209);">2 交付效率低</font><font style="color:rgba(0, 0, 0, 0.65);">:</font><font style="color:rgba(0, 0, 0, 0.65);">构建和部署耗时长，难以定位问题，开发效率低，全量部署耗时长、影响范围广、风险大，发布频次低;</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(114, 46, 209);">3 可靠性差:</font><font style="color:rgba(0, 0, 0, 0.65);">一个bug有可能引起整个应用的崩溃;</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(114, 46, 209);">4 阻碍技术创新:</font><font style="color:rgba(0, 0, 0, 0.65);">受技术栈限制，团队成员使用同一框架和语言</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font>**<font style="color:rgba(0, 0, 0, 0.65);">2 微服务</font>**<font style="color:rgb(38, 38, 38);">  
</font>**<font style="color:rgba(0, 0, 0, 0.65);">微服务架构</font>**<font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgba(0, 0, 0, 0.65);">将单体应用拆分为多个高内聚低耦合的小型服务，每个小服务运行在独立进程，由不同的团队开发和维护，独立自动部署，可以采用不同的语言及存储。</font><font style="color:rgb(38, 38, 38);">  
</font>**<font style="color:rgb(38, 38, 38);">微服务的优点</font>**<font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(114, 46, 209);">1 易于开发与维护:</font><font style="color:rgba(0, 0, 0, 0.65);">微服务相对小，易于理解;</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(114, 46, 209);">2 独立部署</font><font style="color:rgba(0, 0, 0, 0.65);">:</font><font style="color:rgba(0, 0, 0, 0.65);">一个微服务的修改不需要协调其它服务;</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(114, 46, 209);">3 伸缩性强:</font><font style="color:rgba(0, 0, 0, 0.65);">每个服务都可按硬件资源的需求进行独立扩容;</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(114, 46, 209);">4 </font><font style="color:rgb(114, 46, 209);">技术异构性:</font><font style="color:rgba(0, 0, 0, 0.65);">使用最适合该服务的技术，降低尝试新技术的成本.</font><font style="color:rgb(38, 38, 38);">  
</font>**<font style="color:rgb(38, 38, 38);">微服务带来的挑战</font>**<font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">参考</font><font style="color:rgb(38, 38, 38);">  
</font>[为什么要使用微服务架构](http://www.runtester.com/detail/blog/16)<font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font>

  


# 微服务架构的划分？
  
1,传统架构的架构需求  
<font style="color:rgb(51, 51, 51);">传统的架构思想，架构的目标是可扩展性、可靠性和安全性。但随着大型互联网项目对系统迭代要求的效率更高，对架构的要求更高，能够快速安全地交付系统成为了一个重要指标。</font>  
  
<font style="color:rgb(51, 51, 51);">2,服务</font>  
<font style="color:rgb(51, 51, 51);">服务是一个单一的、可独立部署的系统组件，</font>  
<font style="color:rgb(51, 51, 51);">服务具有API，为其客户服务的API封装了其内部实现，微服务架构中的每项服务都有自己的架构，可能还有独特的技术栈。</font>  
  
<font style="color:rgb(51, 51, 51);">3,服务的拆分：</font>  
<font style="color:rgb(51, 51, 51);"> 3.1)根据业务类拆分，比如电商系统的业务能力包括：订单模块、库存模块和发货模块等。</font>  
  
<font style="color:rgb(51, 51, 51);"> 3.2)基于领域驱动进行服务拆分：也就是领域驱动设计也简称DDD，DDD有两个特别重要的概 念，子域和限界上下文。</font>  
  
  
**<font style="color:rgb(51, 51, 51);">1 微服务如何拆分</font>**  
**<font style="color:rgb(51, 51, 51);">服务拆分原则</font>**<font style="color:rgb(51, 51, 51);">：我们需要确定拆分服务时应遵循哪些原则，以确保每个微服务的独立性和可维护性。</font>  
**<font style="color:rgb(51, 51, 51);">服务边界的确定</font>**<font style="color:rgb(51, 51, 51);">：如何明确定义每个微服务的边界，以避免微服务之间的不必要耦合？</font>  
**<font style="color:rgb(51, 51, 51);">服务粒度：</font>**<font style="color:rgb(51, 51, 51);">我们需要明确微服务的粒度应该是多大，以便更好地管理和维护它们。</font>  
**<font style="color:rgb(51, 51, 51);">潜在问题</font>**<font style="color:rgb(51, 51, 51);">：在实施服务化之后，我们可能会面临性能、安全性、版本管理和通信等方面的问题，需要提前考虑并准备相应的解决方案。</font>  
  
  
**<font style="color:rgb(51, 51, 51);">1.1 微服务拆分原则 </font>**  
<font style="color:rgb(51, 51, 51);"> 首要原则是确保每个</font><font style="color:rgb(17, 124, 238);">单一服务内部拥有高内聚性和低耦合性。这意味着每个服务应只承担其职责内的任务，不应处理不属于自身职责范围的功能</font><font style="color:rgb(51, 51, 51);">。虽然这听起来可能理所当然，但在实际开发中，很多人往往会犯这方面的错误。 </font>  
  
  
**<font style="color:rgb(51, 51, 51);">1.2 微服务拆分的粒度 </font>**  
<font style="color:rgb(51, 51, 51);">最初应该进行粗略拆分，然后逐渐细化。</font>  
  
  
  
**<font style="color:rgb(51, 51, 51);">1.3 拆分过程中</font>****<font style="color:rgb(55, 65, 81);background-color:rgb(247, 247, 248);">要确保服务接口的定义具有可扩展性</font>**  
<font style="color:rgb(55, 65, 81);background-color:rgb(247, 247, 248);">第四个原则是要确保服务接口的定义具有可扩展性。在进行服务拆分后，由于服务</font><font style="color:rgb(51, 51, 51);">独立部署在不同的进程中，服务之间的通信不再是进程内部的方法调用，而是跨进程的网络通信。在这种通信模型下，服务接口的定义必须具有可扩展性，以防止在服务发生变化时引发意外错误</font>  
  
  
  
  
  
  
  
  
  
  
  
<font style="color:rgb(51, 51, 51);">参考</font>  
[微服务在拆分的时候的一些思考](https://mp.weixin.qq.com/s/dL5RxgNF1mxwkMpxHOOU7Q)



# 微服务的保护&容错
  
  
  
  
  
  
  
  
  
  
  
参考  
[Hystrix在项目中实践](https://mp.weixin.qq.com/s/4Fg0COnWRB3rRWfxbJt7gA)<font style="color:rgb(232, 50, 60);">推荐</font>  
[设计一个容错的微服务](https://mp.weixin.qq.com/s/vvEj-NNODt5FLePrx4AF0A)  
[微服务的可靠性设计](https://www.infoq.cn/news/micro-service-reliability-design)  
[如何搭建微服务架构的质量体系](http://www.runtester.com/detail/blog/16)<font style="color:rgb(232, 50, 60);">理论</font>  


若有收获，就点个赞吧

  
 

# 微服务配置中心方案
<font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">参考</font><font style="color:rgb(38, 38, 38);">  
</font>[贝壳找房:微服务架构原理](https://mp.weixin.qq.com/s/yOnh9-VlFCnkb2CtCexm4w)<font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font><font style="color:rgb(38, 38, 38);">  
</font>

  


# 微服务数据库方案
**1 微服务是一库一服务还是一库多服务**  


<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2022/png/22822197/1648987136687-fc9f69ec-ba16-4161-8877-9678686f2dd3.png?x-oss-process=image%2Fformat%2Cwebp)

  
**一库多服**  
<font style="color:rgb(34, 34, 34);">这种架构模式通常会被认为是微服务架构下的反范式，它的问题在于：</font>  
<font style="color:rgb(34, 34, 34);">●单点故障：一个数据库倒下，整批服务全部停止。何来的服务独立性？ 当然也可以部署高可用</font>  
  
**一库一服**  
<font style="color:rgb(34, 34, 34);">所以一般推荐的做法，是为每一个微服务准备一个单独的数据库，也即一库一服 (database per service) 模式，</font><font style="color:rgb(24, 144, 255);">它满足每一个服务是独立开发、独立部署、独立扩展的特性</font><font style="color:rgb(34, 34, 34);">。当需要对一个服务进行升级或者数据架构改动的时候，无须影响到其他的服务。</font>  
  




# 微服务熔断Hystrix
  
<font style="color:rgb(77, 77, 77);">互联网</font>[高并发](https://so.csdn.net/so/search?q=%E9%AB%98%E5%B9%B6%E5%8F%91&spm=1001.2101.3001.7020)<font style="color:rgb(77, 77, 77);">系统一般QPS、TPS都比较高，当流量比较大的时候，有三种常见手段可以保证系统高可用和稳定。</font>  
  
**<font style="color:rgb(77, 77, 77);">Hystrix</font>**  
**1 业务场景**  
<font style="color:rgb(77, 77, 77);">在互联网分布式应用中，常常会将核心业务抽取出来当做独立的服务供别的服务使用。举个栗子，电商系统中会拆分成订单、库存、评论、C端展示等多个服务,</font>  
  
**<font style="color:rgb(77, 77, 77);">下单查询库存失败快速返回</font>**  
<font style="color:rgb(77, 77, 77);">用户下单的时候，首先会去订单服务中调用创建订单接口，</font><font style="color:rgb(114, 46, 209);">创建订单接口又会去调用库存服务去查询用户选用的商品库存是否充足，如果</font><font style="color:rgb(114, 46, 209);">库存服务因为网络、bug等问题挂掉后，会导致创建订单的线程一直等待挂起，如果此时有大量请求进入系统会导致大量线程挂起，从而使整个系统瘫痪。</font>  
  
**下单页面查询优惠券失败，可以服务降级**  
<font style="color:rgb(77, 77, 77);">又比如用户下单页面优惠券展示，在调用优惠券查询接口时发生故障，会导致用户下单无法继续。这个时候就可以用降级的思想，使优惠券查询接口直接返回空，这样用户端最多就看不到所能使用的优惠券，但是可以正常下单，不影响核心业务的使用。</font>  
  
  
  
**1.1)解决思路**  
<font style="color:rgb(77, 77, 77);">解决措施之一就是如果库存服务不可用后，</font><font style="color:rgb(114, 46, 209);">可以用熔断的思想,</font><font style="color:rgb(0, 0, 0);">快速返回失败；</font>  
<font style="color:rgb(0, 0, 0);">下单页面查询优惠券失败,</font><font style="color:rgb(114, 46, 209);">采用服务降级(服务降级的逻辑)</font>  
  
**<font style="color:rgb(77, 77, 77);">2 Hystrix原理简介</font>**  
<font style="color:rgb(77, 77, 77);">Hystrix是netflix开源的一个容错框架，解决当外部依赖故障时拖垮业务系统、甚至引起雪崩的问题。</font>  
<font style="color:rgb(77, 77, 77);">Hystrix提供了如下操作：</font>  
**<font style="color:rgba(0, 0, 0, 0.75);">降级:</font>**<font style="color:rgba(0, 0, 0, 0.75);">超时降级、资源不足时(线程或信号量)降级，降级后可以配合降级接口返回兜底数据；</font>  
**<font style="color:rgba(0, 0, 0, 0.75);">隔离(线程池隔离和信号量隔离)：</font>**<font style="color:rgba(0, 0, 0, 0.75);">限制调用分布式服务的资源使用，某一个调用的服务出现问题不会影响 其他服务调用。</font>  
**<font style="color:rgba(0, 0, 0, 0.75);">容断:</font>**<font style="color:rgba(0, 0, 0, 0.75);">当失败率达到阀值自动触发降级(如因网络故障/超时造成的失败率高)，熔断器触发的快速失败会进 行快速返回</font>  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
[美团技术:关于服务容错的思考](https://tech.meituan.com/2016/11/11/service-fault-tolerant-pattern.html)  
[微服务高可用利器——Hystrix熔断降级原理&实践总结](https://blog.csdn.net/lsgqjh/article/details/103237718)  
[Hystrix降级技术解析-Fallback](https://mp.weixin.qq.com/s/vVJx6MAxuwPNzYUoOV1t7g)  
[Hystrix线程隔离技术解析-线程池](https://mp.weixin.qq.com/s/DJGKKCY295IJCM9N6yc8IQ)  
[Hystrix线程隔离技术解析-信号量](https://mp.weixin.qq.com/s/3yEJ2oJC6s2BtSLPGrQCqA)  
[Hystrix熔断器技术源码解析](https://mp.weixin.qq.com/s/O0eTZeDglA6kjaWX9c2Czg)  
[Hystrix的服务降级](https://blog.csdn.net/yxh13521338301/article/details/106405438)  


若有收获，就点个赞吧

  
 

# Hystrix在项目中的使用
  
  
  
  
  
  
  
  
  
  
参考：  
[贝壳找房:Hystrix在项目中的使用](https://mp.weixin.qq.com/s/4Fg0COnWRB3rRWfxbJt7gA)  


若有收获，就点个赞吧

  
 

