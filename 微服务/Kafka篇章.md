### Install Docker using `apt` (recommended):
1. **Update your package index:**

```plain
bash


复制代码
sudo apt update
```

2. **Install Docker (using **`**docker.io**`**):**

```plain
bash


复制代码
sudo apt install docker.io
```

3. **Verify the installation:**

```plain
docker --version
```



1.Kafka定义  


    - 随着信息技术的快速发展以及互联网规模的极具增长，计算机所存储的信息量呈现爆炸式增长，目前数据量已经进入大规模和超大规模的海量数据时代，而如何高效的存储，分析，处理和挖掘海量数据就已经成为了技术研究领域的热点和难点问题  

    - 当前出现的云存储，分布式存储系统，NoSQL数据库（如Mongodb）等前言技术在海量数据的驱使下，呈现日新月异的发展，采用这些技术来处理大数据已经成为了一种趋势  

    - 而如何采集和运营管理，分析这些数据也是大数据集处理中一个至关重要的组成环节  

    - 如要看到实时交易额，这当然是需要响应的基础设施对其提供支持，针对这一需求，当前业界已经有很多开源的消息系统，而本节课的Kafka就是当前流行的一款非常优秀的消息系统  

    - <!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/jpeg/43218187/1727009827010-c5e2dfdd-f8dd-4115-b25e-5b6a71858f34.jpeg)  

        * **1.消息系统**  

            + Kafka允许发布和订阅数据，从这点来看，它类似于ActiveMQ，RabbitMQ等框架，但是Kafka作为一个分布式系统，是以集群的方式运行的，可以自由伸缩，同时还提供了数据传递保证，看复制，持久化等等。  

        * **2.存储和持续处理大型数据流，**  

            + Kafka可以存储和持续处理大型数据流，并且保持延续性的低延迟，在这一点上，可以将将其看作是一个实时版的Hadoop。Kafka的低延迟特点更加适合及时应对这些事件做出响应  

        * **3.实时流平台**  

            + Kafka其实是一个面向实时数据的流平台，也就是它不仅可以将现有的应用程序和数据系统连接起来，他还能用于加强这些触发相同数据流的应用  

    - Kafka安装  

        * **Zookeeper**  

            + 在安装Kafka之前，我们首先得安装Kafka的依赖应用--zookeeper  

            + Zookeeper是一个分布式的，开放源码的分布式应用程序协调服务。由于Kafka是一个分布式平台，所以需要Zookeeper对其集群进行管理和负载均衡。  

            + zookeeper有现成的Docker，在服务器上输入如下命令即可安装  


```java
sudo docker run -d --restart=unless-stopped --name zookeeper --network host registry.cn-hangzhou.aliyuncs.com/ykd_project/zookeeper:3.7.2
```

        * Kafka的安装  


```java
sudo docker run -d --restart=unless-stopped --name kafka \
          --network host \
          --env KAFKA_HEAP_OPTS="-Xmx256M -Xms128M" \
          --env KAFKA_ZOOKEEPER_CONNECT=127.0.0.1:2181 \
          --env KAFKA_LISTENER_SECURITY_PROTOCOL_MAP=INSIDE:PLAINTEXT,OUTSIDE:PLAINTEXT \
          --env KAFKA_LISTENERS=INSIDE://0.0.0.0:9092,OUTSIDE://0.0.0.0:9093 \
          --env KAFKA_INTER_BROKER_LISTENER_NAME=INSIDE \
          --env KAFKA_ADVERTISED_LISTENERS=INSIDE://8.137.22.105:9092,OUTSIDE://8.137.22.105:9093  \
          registry.cn-hangzhou.aliyuncs.com/ykd_project/kafka:2.13-2.8.1
```

            +   

                - <!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/jpeg/43218187/1727009827019-5b64ed74-26d8-4059-a0ab-10cba791fb2b.jpeg)  
  

    - SpringBoot中集成Kafka  

        * 引入依赖包（Maven中有直接适配的SpringBoot的Kafka的依赖包，我们只需要引入到pom中即可）（springboot会自动匹配版本）  

            + <dependency> <groupId>org.springframework.kafka</groupId> <artifactId>spring-kafka</artifactId></dependency>  

        * （配置Kafka服务器）在应用的application.properties中加入Kafka服务器的基础配置如下  

            + #============== kafka ===================# 指定kafka 代理地址，可以多个spring.kafka.bootstrap-servers={服务器公网IP地址}:9093#=============== 生产者配置=======================spring.kafka.producer.retries=0spring.kafka.producer.batch-size=16384spring.kafka.producer.buffer-memory=33554432spring.kafka.producer.key-serializer=org.apache.kafka.common.serialization.StringSerializerspring.kafka.producer.value-serializer=org.apache.kafka.common.serialization.StringSerializer#===============消费者配置=======================# 指定默认消费者group idspring.kafka.consumer.group-id=test-consumer-groupspring.kafka.consumer.auto-offset-reset=earliestspring.kafka.consumer.enable-auto-commit=truespring.kafka.consumer.auto-commit-interval=100spring.kafka.consumer.key-deserializer=org.apache.kafka.common.serialization.StringDeserializerspring.kafka.consumer.value-deserializer=org.apache.kafka.common.serialization.StringDeserializer  

            + 注意，这里面大多数属性都是生产者，消费者的基础配置，我们不需要关系，只需要替换其中{服务器公网IP地址}  

            + 最终替换之后的结果为  

                - spring.kafka.bootstrap-servers=xxx.xxx.xxx.xxx:9093  

        * 引入测试代码  

            + 在kafkaSender加入基础的发送消息代码，测试Kafka是否配置成功  


  


                - 如果控制台出现如下信息则表示Kafka配置成功  


```vue
2020-08-05 10:20:59.775  INFO 368 --- [nio-8080-exec-3] o.a.k.clients.producer.ProducerConfig    : ProducerConfig values:
        acks = 1
        batch.size = 16384

        ...... 此处省略N行

        ssl.truststore.type = JKS
        transaction.timeout.ms = 60000
        transactional.id = null
        value.serializer = class org.apache.kafka.common.serialization.StringSerializer

2020-08-05 10:20:59.877  INFO 368 --- [nio-8080-exec-3] o.a.kafka.common.utils.AppInfoParser     : Kafka version: 2.5.0
2020-08-05 10:20:59.882  INFO 368 --- [nio-8080-exec-3] o.a.kafka.common.utils.AppInfoParser     : Kafka commitId: 66563e712b0b9f84
2020-08-05 10:20:59.882  INFO 368 --- [nio-8080-exec-3] o.a.kafka.common.utils.AppInfoParser     : Kafka startTimeMs: 1596594059876
2020-08-05 10:21:00.080  INFO 368 --- [ad | producer-1] org.apache.kafka.clients.Metadata        : [Producer clientId=producer-1] Cluster ID: D4w2I2tqSpiXTomr0ixBaw
```

            +   


 

