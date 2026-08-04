# 1 DevOps实践参考


参考:
[这才是DevOps演进及CI/CD实践的正确打开方式](https://mp.weixin.qq.com/s/6vfuRmnH1RtIB4OzPuGOoA)
[DevOps 学习笔记（一） | DevOps 简介及环境搭建](https://juejin.cn/post/7205396234717282360)
[DevOps 学习笔记（二）| 使用 Harbor](https://juejin.cn/post/7205473726539890745)
[DevOps 学习笔记（三）| 使用 Jenkins 流水线](https://juejin.cn/post/7205527600700751933)


# Jeecg-Boot后端Devops流程介绍
<font style="color:rgb(38, 38, 38);">
</font>**<font style="color:rgb(38, 38, 38);">1 基于Linux版本的shell脚本启动</font>**<font style="color:rgb(38, 38, 38);">
</font>**<font style="color:rgb(38, 38, 38);">1.1 流程</font>****<font style="color:rgb(65, 44, 12);">步骤</font>**<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">●</font><font style="color:rgb(38, 38, 38);">程序员将代码 push 到代码仓库；</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">●</font><font style="color:rgb(38, 38, 38);">Jenkins 根据触发条件拉取代码到</font>**<font style="color:rgb(38, 38, 38);">CI/CD 服务器；</font>**<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">●</font><font style="color:rgb(38, 38, 38);">Jenkins 使用 Maven 将代码 build 成 jar 包；</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">●</font><font style="color:rgb(38, 38, 38);">jenkins出发shell脚本(startup.sh)，将这个jar启动起来。</font><font style="color:rgb(38, 38, 38);">
</font>**<font style="color:rgb(38, 38, 38);">1.2 所需要服务器及需要安装的软件</font>**<font style="color:rgb(38, 38, 38);">
</font>**<font style="color:rgb(0, 0, 0);"> CI/CD服务器及需要安装软件(</font>**<font style="color:rgb(133, 133, 133);">这个CI/CD服务器可以作为基础组件的服务</font>**<font style="color:rgb(0, 0, 0);">)</font>**<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(133, 133, 133);">●</font><font style="color:rgb(133, 133, 133);">JDK</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(133, 133, 133);">●</font><font style="color:rgb(133, 133, 133);">Jenkins</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(133, 133, 133);">●</font><font style="color:rgb(133, 133, 133);">Git</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(133, 133, 133);">●</font><font style="color:rgb(133, 133, 133);">Maven</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(133, 133, 133);">●</font><font style="color:rgb(133, 133, 133);">Ngnix(非必须,作为集群部署的反向代理)</font><font style="color:rgb(38, 38, 38);">
</font>**<font style="color:rgb(0, 0, 0);"> 应用服务器</font>**<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(133, 133, 133);">●</font><font style="color:rgb(133, 133, 133);">JDK</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font>**<font style="color:rgb(38, 38, 38);">1.3 如果项目以集群的形式部署</font>**<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);"> 1 jenkins使用Maven将项目打成jar包；</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);"> 2 先将集群中节点服务器里的jar备份，然后再将jar推送至各个集群节点 (</font>**<font style="color:rgb(38, 38, 38);">如何推送呢?</font>**<font style="color:rgb(38, 38, 38);">)；</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);"> 3 触发集群节点里的启动脚本，启动新的jar(</font>**<font style="color:rgb(38, 38, 38);">启动jar的脚本?</font>**<font style="color:rgb(38, 38, 38);">)</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);"> 4 整个部署完成(</font>**<font style="color:rgb(38, 38, 38);">如何查看是否部署成功呢?</font>**<font style="color:rgb(38, 38, 38);">)</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font>**<font style="color:rgb(38, 38, 38);">2 基于Docker的方式</font>**<font style="color:rgb(38, 38, 38);">
</font>**<font style="color:rgb(38, 38, 38);">2.1 流程</font>****<font style="color:rgb(65, 44, 12);">步骤</font>**<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">●</font><font style="color:rgb(38, 38, 38);">程序员将代码 push 到代码仓库</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">●</font><font style="color:rgb(38, 38, 38);">Jenkins 根据触发条件拉取代码到</font>**<font style="color:rgb(38, 38, 38);">CI/CD 服务器</font>**<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">●</font><font style="color:rgb(38, 38, 38);">Jenkins 使用 Maven 将代码 build 成 jar 包</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">●</font><font style="color:rgb(38, 38, 38);">Jenkins 使用 jar 包通过 Dockerfile 和 docker-compose.yml 文件制作 自定义镜像</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">●</font><font style="color:rgb(38, 38, 38);">Jenkins 将自定义</font>**<font style="color:rgb(38, 38, 38);">镜像推送到Harbor 服务器上</font>**<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">●</font><font style="color:rgb(38, 38, 38);">Jenkins 调用</font><font style="color:rgb(38, 38, 38);">应用服务器</font><font style="color:rgb(38, 38, 38);">拉取自定义镜像</font><font style="color:rgb(38, 38, 38);">
</font>**<font style="color:rgb(38, 38, 38);">●</font>****<font style="color:rgb(38, 38, 38);">应用服务器运行镜像</font>**<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font>

<!-- 这是一张图片，ocr 内容为： -->
!

<font style="color:rgb(38, 38, 38);">
</font>**<font style="color:rgb(38, 38, 38);">2.2 所需要服务器及需要安装的软件</font>**<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">根据流程步</font><font style="color:rgb(65, 44, 12);">骤需要三台服务器，</font>**<font style="color:rgb(65, 44, 12);">CI/CD服务器(基础的工具软件)、应用服务器、Harbor服务器</font>**<font style="color:rgb(38, 38, 38);">
</font>**<font style="color:rgb(0, 0, 0);">CI/CD服务器需要安装</font>**<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(133, 133, 133);">●</font><font style="color:rgb(133, 133, 133);">JDK</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(133, 133, 133);">●</font><font style="color:rgb(133, 133, 133);">Jenkins</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(133, 133, 133);">●</font><font style="color:rgb(133, 133, 133);">Git</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(133, 133, 133);">●</font><font style="color:rgb(133, 133, 133);">Maven</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(133, 133, 133);">●</font><font style="color:rgb(133, 133, 133);">Docker</font><font style="color:rgb(38, 38, 38);">
</font>**<font style="color:rgb(0, 0, 0);"> 应用服务器</font>**<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(133, 133, 133);">Docker or Kubernetes 集群</font><font style="color:rgb(38, 38, 38);">
</font>**<font style="color:rgb(0, 0, 0);"> Harbor服务器</font>**<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(133, 133, 133);">●</font><font style="color:rgb(133, 133, 133);">Docker</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(133, 133, 133);">●</font><font style="color:rgb(133, 133, 133);">Harbor 镜像仓库</font><font style="color:rgb(38, 38, 38);">
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


## 3 Harbor服务器
 主要用来管理Docker的镜像仓库

### 3.1 Docker 安装


## 4 组件服务器
该服务器主要用来部署java程序所依赖的一些组件,**像数据库(mysql、Oracle、pgsql)、redis、Mongdb、es**等，如果需要集群部署，可能还要加机器


##


# 1 Docker 版本常用的软件介绍


参考
[基于jenkins+Docker版本的CI/CD常用软件安装](https://www.cnblogs.com/hqq2019-10/p/17560284.html)


若有收获，就点个赞吧


# 云原生简介


**1 电子书**
**云原生架构**


[云原生架构.pdf](https://www.yuque.com/office/yuque/0/2022/pdf/22822197/1652231368511-9689f02d-7a3f-480c-bb74-9fc218688407.pdf?from=https%3A%2F%2Fwww.yuque.com%2Fwanghang888%2Fmz1nwt%2Fhndum1)


参考
[一文看懂云原生时代 DevOps 如何选型](https://www.infoq.cn/article/ljJVfsroj9GbCkk8Dzr8)


# DevOps实战
**1 DevOps基础理论**
[Azure DevOps 一：简介与安装](https://www.jianshu.com/p/17563d43eb16)


若有收获，就点个赞吧


# DevOps需要掌握的工具
<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">1 构建工具
</font><font style="color:rgb(38, 38, 38);">Gradle，Maven

</font><font style="color:rgb(38, 38, 38);">2 自动化运维工具
</font><font style="color:rgb(38, 38, 38);">Ansible, Puppet, SaltStack


</font><font style="color:rgb(38, 38, 38);">3 代码仓库管理
</font><font style="color:rgb(38, 38, 38);">GitHub， GitLab，BitBucket

</font><font style="color:rgb(38, 38, 38);">4:虚拟化和容器化
</font><font style="color:rgb(38, 38, 38);">VMware, VirtualBox, Vagrant Docker, Docker，LXC


</font><font style="color:rgb(38, 38, 38);">5 持续集成
</font><font style="color:rgb(38, 38, 38);">Jenkins ,Travis CI, CircleCI
</font><font style="color:rgb(38, 38, 38);">Jenkins:基于java开发的持续集成工具。
</font><font style="color:rgb(38, 38, 38);">Travis CI：目前新兴的开源持续集成构建项目。它与JenKins的区别在于它采用的是YANL的格式。
</font><font style="color:rgb(38, 38, 38);">CircleCI：为WEB应用开发人员提供服务的持续集成平台。主要为开发团队提供测试，持续集成，代码部署等服务。


</font><font style="color:rgb(38, 38, 38);">6 自动化测试工具
</font><font style="color:rgb(38, 38, 38);">Mock：在测试过程中，对于某些不容易构建或者不容易获取的对象，可以用一个虚拟的Mock对象来创建，以便测试方法。
</font><font style="color:rgb(38, 38, 38);">Selenium：WEB自动化测试，Selenium是网页应用中最流行的开源自动化测试框架。起源于2000年，10多年来不断地完善，Selenium成为许多Web自动化测试人员的选择，尤其是那些有高级编程和脚本技能的人。Selenium也成为了其他开源自动化测试工具比如Katalon Studio，Watir，Protractor和Robot Framework的核心框架。

</font><font style="color:rgb(38, 38, 38);">Appium：Appium是一个移动端自动化测试开源工具，支持iOS和Android平台，支持Python、Java等语言，即同一套Java或Python脚本可以同时运行在iOS和Android平台，Appium 是一个C/S架构，核心是一个Web服务器，它提供了一套REST的接口。当收到客户端的连接后，就会监听到命令，然后在移动设备上执行这些命令，最后将执行结果放在HTTP响应中返还给客户端


</font><font style="color:rgb(38, 38, 38);">7 产品&质量管理
</font><font style="color:rgb(38, 38, 38);">禅道，Confluence, Jira , Bugzila
</font><font style="color:rgb(38, 38, 38);">禅道和Confluence：主要是产品需求，定义，依赖和推广等全面管理工具。
</font><font style="color:rgb(38, 38, 38);">Jira和Bugzila：则是用于产品的质量管理和监控能力，包括测试用例，缺陷跟踪和质量监控等。


</font><font style="color:rgb(38, 38, 38);">8：日志管理
</font><font style="color:rgb(38, 38, 38);">ELK， Logentries
</font><font style="color:rgb(38, 38, 38);">ELK:开源日志处理平台解决方案，它由日志采集解析工具Logstash, 基于Lucens的全文搜索引擎elasticsearch，可分析视化平台Kibana组成。
</font><font style="color:rgb(38, 38, 38);">Logentries，提供各种语言的客户端开发包，可以在云端对应用日志进行分析和统计。该平台的服务器端是不开源的，但是客户端的API都是开源的， 感觉是个不靠谱的产品啊


</font><font style="color:rgb(38, 38, 38);">9:监控预警
</font><font style="color:rgb(38, 38, 38);">DataDog, Graphlit, lcinga, Nagios, oneAPM, 听云，云智慧， 睿像
</font><font style="color:rgb(79, 79, 79);">DataDog：是一家专注于数字性能监控的厂商，产品范围包括应用性能监控、基础设施监控、组件监控及日志监控等，产品的形态是SAAS交付.</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(51, 51, 51);">Icinga： 即为一套容易部署以及容易为网管人员短期学习并使用的监控软件。</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(77, 77, 77);">Nagios：是一款开源的电脑系统和网络监视工具，能有效监控Windows、Linux和Unix的主机状态，在系统或服务状态异常时发出邮件或短信报警第一时间通知网站运维人员，在状态恢复后发出正常的邮件或短信通知。</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">oneAPM;
</font><font style="color:rgb(38, 38, 38);">听云:
</font><font style="color:rgb(38, 38, 38);">云智慧:
</font><font style="color:rgb(38, 38, 38);"> 睿像:


</font><font style="color:rgb(38, 38, 38);">10：压力测试
</font><font style="color:rgb(38, 38, 38);">Jmeter,Blaze Meter,Loader,LoadRunner
</font><font style="color:rgb(38, 38, 38);">Jmeter
</font><font style="color:rgb(38, 38, 38);">Blaze Meter
</font><font style="color:rgb(38, 38, 38);">Loader
</font><font style="color:rgb(38, 38, 38);">LoadRunner ,LoadRunner，是一种预测系统行为和性能的负载测试工具。通过以模拟上千万用户实施并发负载及实时性能监测的方式来确认和查找问题，LoadRunner能够对整个企业架构进行测试。企业使用LoadRunner能最大限度地缩短测试时间，优化性能和加速应用系统的发布周期。LoadRunner可适用于各种体系架构的自动负载测试，能预测系统行为并评估系统性能。


</font><font style="color:rgb(38, 38, 38);">11 :敏捷管理工具
</font><font style="color:rgb(38, 38, 38);">Trello , Teambitiom , Worktile, Tower , Jira , Asana , Taiga , Basecamp , Pivotal Tracker


</font><font style="color:rgb(38, 38, 38);">12 Web服务器
</font><font style="color:rgb(38, 38, 38);"> Ngnix

</font><font style="color:rgb(38, 38, 38);">13 应用服务器
</font><font style="color:rgb(38, 38, 38);">Tomcat ，Netty


</font><font style="color:rgb(38, 38, 38);">14：服务注册与发现
</font><font style="color:rgb(38, 38, 38);">Zookeeper , Etcd , Consul , Eureka , Nacos


</font><font style="color:rgb(38, 38, 38);">15:编排工具
</font><font style="color:rgb(38, 38, 38);">Kubernetes (K8s) , Docker Compose , Docker Swarm , Apache Mesos , DC/OS


</font><font style="color:rgb(38, 38, 38);">16:数据库
</font><font style="color:rgb(38, 38, 38);">Mysql ，Oracle ，PostgreSQL等关系型数据库， MongoDB ，Redis等NoSQL数据库。


</font><font style="color:rgb(245, 34, 45);">我感兴趣的有：</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(245, 34, 45);">自动化运维工具：Ansible, Puppet, SaltStack</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(245, 34, 45);">虚拟化和容器化：VMware, VirtualBox, Vagrant Docker, Docker，LXC</font><font style="color:rgb(38, 38, 38);">（其中VMware和VirtualBox已经了解过了）
</font><font style="color:rgb(245, 34, 45);">编排工具：Kubernetes (K8s)</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(245, 34, 45);"> 持续集成：Jenkins ,Travis CI, CircleCI</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(245, 34, 45);">日志管理：ELK</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(245, 34, 45);">产品管理：Jira ，Confluence</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(245, 34, 45);">监控预警：DataDog</font><font style="color:rgb(38, 38, 38);">


</font>


# 系统运维技能的要求介绍

1,工作职责:
 这是从一个银行的招聘要求上看到的
 负责全行硬件设备的日常维护，包括小型机、服务器、存储等； 负责全行基础类软件的日常维护，包括操作系统、中间件等； 负责全行基础类平台的日常维护，包括监控平台、云平台、自动化运维平台等； 负责全行信息系统灾备日常管理和维护。

所需要掌握的技能
1 熟悉小型机、服务器、存储设备日常维护；熟悉AIX、Linux、WAS、MQ、Nginx等操作系统和中间件的日常维护；
2 熟悉云平台日常维护，包括VMware、OpenStack、Docker、K8S等
3 熟悉监控平台日常维护，包括nagios、zabbix、ELK等；熟悉自动化运维工具，包括Ansible、Saltstack、Jenkins等，
4 对DevOps领域有深入理解和丰富的实施经验的优先考虑
5 同等条件下，拥有RHCE、RHCA、vCP、DevOps等证书优先考虑

这些技能中的一些名词解释
中间件
AIX:是IBM基于AT&T Unix System V开发的一套类UNIX操作系统，运行在IBM专有的Power系列芯片设计的小型机硬件系统之上。
WAS：WAS是业界领先的安全专家服务，是一项针对web应用程序的安全服务，是基于应用系统整体架构的特性和其个性化的需求来提供有针对性的安全解决方案，通过来自一线的经验变成用户所需要的安全服务。

自动化运维工具
Ansible,新出现的自动化运维工具，基于Python开发，集合了众多运维工具（puppet、cfengine、chef、func、fabric）的优点，实现了批量系统配置、批量程序部署、批量运行命令等功能.
SaltStack管理工具允许管理员对多个操作系统创建一个一致的管理系统，包括VMware vSphere环境.
Jenkins

监控相关
熟悉zabbix、nagios、等至少一种开源监控软件,熟练掌握shell脚本.
nagios： 普罗米修斯： zabbix
证书介绍
RHCE,RHCE是市场上第一个面向Linux的认证考试，它不是一个普通的认证测试，和其他操作系统认证考试相比，RHCE考试需要花费一整天的时间，而且在测试中更加注重考察考生的实践经验.
RHCA,红帽认证架构师。红帽认证架构师是红帽公司继红帽认证技师（RHCT）和红帽认证工程师（RHCE）认证之后推出的最新顶级认证。
Devops认证，不仅关注理论知识，更加关注实践技能的培养和考察，使DevOps Master 能够成功地将DevOps 应用于一个企业团队中，并促成 DevOps 原理被组织广泛采用和实行。该认证联合了在DevOps 工作领域的专家共同创建而成（相关的认证介绍,https://www.jianshu.com/p/3e293569f5b6)。


2,云计算高级运维需要掌握的技能:
 硬件， CMDB自动化：无论是自动化运维、标准化运维、DevOps、甚至是智能运维，其实都离开不 CMDB，可以说 CMDB 是运维体系的基石。 有了配置信息数据库，后面各种标准、流程都可以建立在 CMDB 基础之上，从而实现真正的标准化、自动化、智能化运维， 节约运维成本的同时，也降低运维流程混乱带来的操作风险。 CMDB涉及到的技术包括： 后端：Python3、Django、Django REST framework、Elasticsearch、uwsgi、Nginx、Docker 前端：Vue、Element-ui、Vue-Router、Vuex、Axios 其中后端的Python3、Django、Django REST framework、uwsgi、Nginx、Docker的学习 其中Django技术：Django是一个开放源代码的Web应用框架，由Python写成。采用了MTV的框架模式，即模型M，视图V和模版T，它最初是被开发来用于管理劳伦斯出版集团旗下的一些以新闻内容为主的网站的，即是CMS。 Django REST Framework：可以在Django的基础上迅速实现API，并且自身还带有WEB的测试页面，可以方便的测试自己的API， 那么问题来了关于这两个框架Django和Django REST Framework该如何学习，如何进行实际的运用呢？ uwsgi：uwsgi是一个Web服务器，它实现了WSGI协议、uwsgi、http等协议，Nginx中HttpUwsgiModule的作用是与uWSGI服务器进行交换。 其中前端的学习技术介绍： Element-ui：一套为开发者、设计师和产品经理准备的基于 Vue 2.0 的桌面端组件库。 Vue-Router：是Vue.js官方的路由管理器，它和 Vue.js 的核心深度集成，让构建单页面应用变得易如反掌。 Vuex：适用于在Vue项目开发时使用的状态管理工具 axios：是一个基于Promise 用于浏览器和 nodejs 的 HTTP 客户端。简单的理解就是ajax的封装 系统(虚拟化编排工具，K8s和docker) 应用:（开源技术解决方案） 云计算高级运维所从事的工作方向：基础设施建设、平台建设、自动化管理。


3,SRE运维所需要掌握的专业技能： SRE就是DevOps，只不过因为Google起了个高大上的名字还写了本书，SRE就火了，DevOps = Development + Operations，简而言之，通过研发(dev)把运维(ops)全部自动化(automation)。 所涉及的范围呢：代码管理和部署，配置管理，监控，应急响应，故障处理，压力测试，容灾等等 1:架构设计能力 熟悉WEB站点的架构设计，特点，网站及CDN运维，集群设计和实施 熟悉编程，熟练掌握Python/golang/lua/Shell/ruby中的任意一门语言，以及做过自动化运维。 业务运维：熟悉TCP/IP协议，Linux的常用命令及原理，Linux下的服务(postfix/iptables/nginx/ftp/dns)等部署和优化 了解常用的开源运维工具：ansible/puppet/LAMP等相关开源软件 维服务能力：熟悉clcd、链路监控、Rpc框架、维服务化优先。


4，运维相关的书籍
 技术运维保障相关的书籍(性能,运维,运维,监控,测试): 《鸟哥的Linux私房菜》 《DevOps架构师行动指南》 《Docker容器与容器云》 《Prometheus监控技术与实践》 《Prometheus云原生监控：运维与开发实战》 《阿里云云原生架构实践》 《大型网站运维：从系统管理到SRE》 网易运维专家、SRE团队领衔撰写 《智能运维：从0搭建大规模分布式AIOps系统》 AIOps运维


<font style="color:rgb(245, 34, 45);">5，我所感兴趣的是：</font>
<font style="color:rgb(245, 34, 45);">DevOps， 以及DevOps证书。</font>
<font style="color:rgb(245, 34, 45);">自动化运维工具，包括Ansible、Saltstack、Jenkins，puppet，LAMP。</font>
<font style="color:rgb(245, 34, 45);">监控：zabbix，普罗米修斯，nagios。</font>
<font style="color:rgb(245, 34, 45);">虚拟化编排工具：K8s和docker</font>

<font style="color:rgb(245, 34, 45);"></font>

# 系统运维技能的要求介绍

1,工作职责:
 这是从一个银行的招聘要求上看到的
 负责全行硬件设备的日常维护，包括小型机、服务器、存储等； 负责全行基础类软件的日常维护，包括操作系统、中间件等； 负责全行基础类平台的日常维护，包括监控平台、云平台、自动化运维平台等； 负责全行信息系统灾备日常管理和维护。

所需要掌握的技能
1 熟悉小型机、服务器、存储设备日常维护；熟悉AIX、Linux、WAS、MQ、Nginx等操作系统和中间件的日常维护；
2 熟悉云平台日常维护，包括VMware、OpenStack、Docker、K8S等
3 熟悉监控平台日常维护，包括nagios、zabbix、ELK等；熟悉自动化运维工具，包括Ansible、Saltstack、Jenkins等，
4 对DevOps领域有深入理解和丰富的实施经验的优先考虑
5 同等条件下，拥有RHCE、RHCA、vCP、DevOps等证书优先考虑

这些技能中的一些名词解释
中间件
AIX:是IBM基于AT&T Unix System V开发的一套类UNIX操作系统，运行在IBM专有的Power系列芯片设计的小型机硬件系统之上。
WAS：WAS是业界领先的安全专家服务，是一项针对web应用程序的安全服务，是基于应用系统整体架构的特性和其个性化的需求来提供有针对性的安全解决方案，通过来自一线的经验变成用户所需要的安全服务。

自动化运维工具
Ansible,新出现的自动化运维工具，基于Python开发，集合了众多运维工具（puppet、cfengine、chef、func、fabric）的优点，实现了批量系统配置、批量程序部署、批量运行命令等功能.
SaltStack管理工具允许管理员对多个操作系统创建一个一致的管理系统，包括VMware vSphere环境.
Jenkins

监控相关
熟悉zabbix、nagios、等至少一种开源监控软件,熟练掌握shell脚本.
nagios： 普罗米修斯： zabbix
证书介绍
RHCE,RHCE是市场上第一个面向Linux的认证考试，它不是一个普通的认证测试，和其他操作系统认证考试相比，RHCE考试需要花费一整天的时间，而且在测试中更加注重考察考生的实践经验.
RHCA,红帽认证架构师。红帽认证架构师是红帽公司继红帽认证技师（RHCT）和红帽认证工程师（RHCE）认证之后推出的最新顶级认证。
Devops认证，不仅关注理论知识，更加关注实践技能的培养和考察，使DevOps Master 能够成功地将DevOps 应用于一个企业团队中，并促成 DevOps 原理被组织广泛采用和实行。该认证联合了在DevOps 工作领域的专家共同创建而成（相关的认证介绍,https://www.jianshu.com/p/3e293569f5b6)。


2,云计算高级运维需要掌握的技能:
 硬件， CMDB自动化：无论是自动化运维、标准化运维、DevOps、甚至是智能运维，其实都离开不 CMDB，可以说 CMDB 是运维体系的基石。 有了配置信息数据库，后面各种标准、流程都可以建立在 CMDB 基础之上，从而实现真正的标准化、自动化、智能化运维， 节约运维成本的同时，也降低运维流程混乱带来的操作风险。 CMDB涉及到的技术包括： 后端：Python3、Django、Django REST framework、Elasticsearch、uwsgi、Nginx、Docker 前端：Vue、Element-ui、Vue-Router、Vuex、Axios 其中后端的Python3、Django、Django REST framework、uwsgi、Nginx、Docker的学习 其中Django技术：Django是一个开放源代码的Web应用框架，由Python写成。采用了MTV的框架模式，即模型M，视图V和模版T，它最初是被开发来用于管理劳伦斯出版集团旗下的一些以新闻内容为主的网站的，即是CMS。 Django REST Framework：可以在Django的基础上迅速实现API，并且自身还带有WEB的测试页面，可以方便的测试自己的API， 那么问题来了关于这两个框架Django和Django REST Framework该如何学习，如何进行实际的运用呢？ uwsgi：uwsgi是一个Web服务器，它实现了WSGI协议、uwsgi、http等协议，Nginx中HttpUwsgiModule的作用是与uWSGI服务器进行交换。 其中前端的学习技术介绍： Element-ui：一套为开发者、设计师和产品经理准备的基于 Vue 2.0 的桌面端组件库。 Vue-Router：是Vue.js官方的路由管理器，它和 Vue.js 的核心深度集成，让构建单页面应用变得易如反掌。 Vuex：适用于在Vue项目开发时使用的状态管理工具 axios：是一个基于Promise 用于浏览器和 nodejs 的 HTTP 客户端。简单的理解就是ajax的封装 系统(虚拟化编排工具，K8s和docker) 应用:（开源技术解决方案） 云计算高级运维所从事的工作方向：基础设施建设、平台建设、自动化管理。


3,SRE运维所需要掌握的专业技能： SRE就是DevOps，只不过因为Google起了个高大上的名字还写了本书，SRE就火了，DevOps = Development + Operations，简而言之，通过研发(dev)把运维(ops)全部自动化(automation)。 所涉及的范围呢：代码管理和部署，配置管理，监控，应急响应，故障处理，压力测试，容灾等等 1:架构设计能力 熟悉WEB站点的架构设计，特点，网站及CDN运维，集群设计和实施 熟悉编程，熟练掌握Python/golang/lua/Shell/ruby中的任意一门语言，以及做过自动化运维。 业务运维：熟悉TCP/IP协议，Linux的常用命令及原理，Linux下的服务(postfix/iptables/nginx/ftp/dns)等部署和优化 了解常用的开源运维工具：ansible/puppet/LAMP等相关开源软件 维服务能力：熟悉clcd、链路监控、Rpc框架、维服务化优先。


4，运维相关的书籍
 技术运维保障相关的书籍(性能,运维,运维,监控,测试): 《鸟哥的Linux私房菜》 《DevOps架构师行动指南》 《Docker容器与容器云》 《Prometheus监控技术与实践》 《Prometheus云原生监控：运维与开发实战》 《阿里云云原生架构实践》 《大型网站运维：从系统管理到SRE》 网易运维专家、SRE团队领衔撰写 《智能运维：从0搭建大规模分布式AIOps系统》 AIOps运维


<font style="color:rgb(245, 34, 45);">5，我所感兴趣的是：</font>
<font style="color:rgb(245, 34, 45);">DevOps， 以及DevOps证书。</font>
<font style="color:rgb(245, 34, 45);">自动化运维工具，包括Ansible、Saltstack、Jenkins，puppet，LAMP。</font>
<font style="color:rgb(245, 34, 45);">监控：zabbix，普罗米修斯，nagios。</font>
<font style="color:rgb(245, 34, 45);">虚拟化编排工具：K8s和docker</font>

<font style="color:rgb(245, 34, 45);"></font>

<font style="color:rgb(245, 34, 45);"></font>

# 堡垒机与VPN的关系
<font style="color:rgb(38, 38, 38);">
</font>**<font style="color:rgb(38, 38, 38);">1 VPN</font>**<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(114, 46, 209);">easyconnect</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(51, 51, 51);">Easy Connect是深信服旗下的专业应用虚拟化软件。该软件旨在帮助用户通过虚拟化技术，实现在移动端办公。其具备了极其简单的操作界面，用户只需输入服务器地址便可快速连接，并且支持代理设置。</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(51, 51, 51);">1.easyconnect通常是用来连接公司或校园内网的，可以获取到许多资源；</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(51, 51, 51);">2.首先在电脑上找到“easyconnect”软件，没有安装的小伙伴要先安装软件。箭头处即为easyconnect软件。双击鼠标打开软件，主界面，输入服务器地址，这个地址一般是公司或学校的vpn地址，点击“连接”即可；</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font>[VPN的原理是什么？](https://mp.weixin.qq.com/s/BS3BjWEuJlhQH1UB17MkBg)<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font>**<font style="color:rgb(51, 51, 51);">2 堡垒机</font>**<font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font><font style="color:rgb(38, 38, 38);">
</font>


