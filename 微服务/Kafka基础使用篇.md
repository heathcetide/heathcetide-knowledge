**Kafka:**

使用步骤：  
		具体操作：

服务器的依赖耦合  
		1.服务器的依赖耦合

如果一个业务涉及了多个服务就会多重耦合，这样的话时效性到位了，但是性能就会异常地下，也会因为系统服务的产生复杂的依赖关系  
   2.可以通过发布订阅消息系统来处理  


    - <!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/jpeg/43218187/1727009894793-bf183cf7-da93-4fc0-a0f8-0c28fc3739d0.jpeg)  


   3.Kafka生产者-写入数据  


                    * 在Java中Kafka消息用类ProducerRecord<K, V>表示。  

                        + 注意这里使用了泛型，这里的 V 即是消息的内容。  

                        + 这里的 K 代表什么呢？  

                        + 这里的 Key 不是主题，大家可以将其当做消息的附加信息，具体作用稍后就能明白。  

                        + 那么到目前为止，我们知道一个消息体的大致结果如下  

                            - <!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/svg/43218187/1727009893830-cf14f818-1ba7-48d5-8130-cce891b7c020.svg)  

                        + 内容序列化  

                            - 我们知道为了网络传输，通常我们需要将内容进行序列化，同样Kafka也是如此，需要将key，value进行系列化  

                            - 回顾application.properties中的配置属性  

                                * spring.kafka.producer.retries=0spring.kafka.producer.batch-size=16384spring.kafka.producer.buffer-memory=33554432//#1. key序列化spring.kafka.producer.key-serializer=org.apache.kafka.common.serialization.StringSerializer//#2. value序列化spring.kafka.producer.value-serializer=org.apache.kafka.common.serialization.StringSerializer  

                        + 主题分区  

                            - 对于消息应该用什么数据结构进行存储？  

                            - 消息满足先入先出的规则，最好使用队列进行存储，俗称消息队列  

                                * <!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/jpeg/43218187/1727009894817-e7ddc999-3322-47e9-b495-175c6e36aa38.jpeg)  

                                * 左侧是消息入口，右侧是消息出口，越早的消息越早被消费，但是kafka是为了应对大数据量，大批量消息而设计的，这种简单的系统坑定是不支持大量并发的，在此基础上，系统需要支持横向扩展的能力  

                                * 那么其是如何实现的呢？它提出了分区的概念，每个分区都是一个队列，每个消息会按照一定的规则放置在某个分区里面  

+ <!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/jpeg/43218187/1727009894773-f6e1d389-063e-474d-9d20-aec9e52ce0e4.jpeg)  

                                * 当消息通过序列化到分区器时，系统首先根据Topic寻到对于的主题区域，然后再通过规则找到对应主题下的分区  

                                * 默认情况下消息会被随机发送到主题内各个可用的分区上，并且通过算法保证分区消息量均衡，如果消息体中有key，则会根据key的哈希值找到某个固定分区，也就是如果key相同则分区也相同  

        * 引入依赖  

            + <dependency> <groupId>org.springframework.kafka</groupId> <artifactId>spring-kafka</artifactId></dependency>  

        * 配置文件  

            + <!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/jpeg/43218187/1727009894803-15715c1c-595c-411f-9b32-5bca31548fb7.jpeg)  

                - #============== kafka ===================# 指定kafka 代理地址，可以多个spring.kafka.bootstrap-servers={服务器公网IP地址}:9093#=============== 生产者配置=======================spring.kafka.producer.retries=0spring.kafka.producer.batch-size=16384spring.kafka.producer.buffer-memory=33554432spring.kafka.producer.key-serializer=org.apache.kafka.common.serialization.StringSerializerspring.kafka.producer.value-serializer=org.apache.kafka.common.serialization.StringSerializer#===============消费者配置=======================# 指定默认消费者group idspring.kafka.consumer.group-id=test-consumer-groupspring.kafka.consumer.auto-offset-reset=earliestspring.kafka.consumer.enable-auto-commit=truespring.kafka.consumer.auto-commit-interval=100spring.kafka.consumer.key-deserializer=org.apache.kafka.common.serialization.StringDeserializerspring.kafka.consumer.value-deserializer=org.apache.kafka.common.serialization.StringDeserializer  

        * 引入测试代码  

            + 在KafkaSender中加入基础的发送消息代码，测试Kafka是否配置成功  

            + <!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/jpeg/43218187/1727009895115-11d43aff-0ee7-4b80-94cd-6c46a69640ca.jpeg)  

                -   

                    * @Controller@RequestMapping("kafka")  

                    * public class KafkaSender {  

                    * @Autowired private KafkaTemplate<String, String> kafkaTemplate;  

                    * //发送消息方法 @RequestMapping("/send")  

                    * @ResponseBody public String send() {//topic消息主题//youkeda消息内容 kafkaTemplate.send("topic", "key","youkeda");  

                    * return "success";  

                        +  }  

                            - }  

        * 消费数据  

            + 有了消息的发送就肯定有接收者，被称之为消费者  

            + 那么问题来了，不同消费者如何分配同一主题的消息呢？同一主题的消息不同分区如何分流呢？  

            + 这里我们需要引出一个新概念--消费者组  

                - 一个消费者组里的消费者订阅同一个主题，每个消费者接收主题一部分分区的消息  

                - 案例：  

                    * 1.单消费者  

                        + <!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/jpeg/43218187/1727009895539-aecb3905-25c0-4490-beea-bd4099fb75a1.jpeg)  

                    * 2.多消费者  

                        + <!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/jpeg/43218187/1727009895447-4089dd79-ae82-4d68-93e9-393acb620792.jpeg)<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/jpeg/43218187/1727009895665-9644d03d-5117-4c07-8c3a-233c851d0cbf.jpeg)  

                        + 注意：一条消息只会被同组消费一次，也就是消息不会再同一个消息中重复消费，具有排他性（已经收到消息的消费者重启计算机后也不会再次接收到同一条消息）  

                    * 3.超消费者  

                        + <!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/jpeg/43218187/1727009895779-f348446c-2951-4a47-94a3-fc9bc20ff396.jpeg)  

                        + 这样一部分消费者将会闲置，不会接收任何消息  

                    * 4.多消费者组  

                        + <!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/jpeg/43218187/1727009895905-4de42de2-9ee1-4b4b-93ca-aeb0508696ce.jpeg)  

                        + 注意：多个消费者组订阅同一个主题，将分别消费这个主题的消息，也就是一个消息都会通知每个消费者组  

            + 消费者配置  

                - // 配置消费者组spring.kafka.consumer.group-id=test-consumer-groupspring.kafka.consumer.auto-offset-reset=earliestspring.kafka.consumer.enable-auto-commit=truespring.kafka.consumer.auto-commit-interval=100// 配置消息体Key反序列化器spring.kafka.consumer.key-deserializer=org.apache.kafka.common.serialization.StringDeserializer// 配置消息体Value反序列化器spring.kafka.consumer.value-deserializer=org.apache.kafka.common.serialization.StringDeserializer  

                - 代码  

                    *   

                        + import org.springframework.beans.factory.annotation.Autowired;  

                        + import org.springframework.kafka.core.KafkaTemplate;  

                        + import org.springframework.stereotype.Controller;  

                        + import org.springframework.web.bind.annotation.RequestMapping;  

                        + import org.springframework.web.bind.annotation.ResponseBody;  

                        + @Controller@RequestMapping("kafka")  

                        + public class KafkaSender {  

                        + @Autowired private KafkaTemplate<String, String> kafkaTemplate;  

                        + //发送消息方法 @RequestMapping("/send")  

                        + @ResponseBody public String send() {//topic消息主题//youkeda消息内容 kafkaTemplate.send("topic", "key","youkeda");  

                        +  System.out.println("消息发送成功");  

                        + return "success";  

                            -  }  

                                * }  

    - Kafka定义  

        * 随着信息技术的快速发展以及互联网规模的极具增长，计算机所存储的信息量呈现爆炸式增长，目前数据量已经进入大规模和超大规模的海量数据时代，而如何高效的存储，分析，处理和挖掘海量数据就已经成为了技术研究领域的热点和难点问题  

            + 当前出现的云存储，分布式存储系统，NoSQL数据库（如Mongodb）等前言技术在海量数据的驱使下，呈现日新月异的发展，采用这些技术来处理大数据已经成为了一种趋势  

            + 而如何采集和运营管理，分析这些数据也是大数据集处理中一个至关重要的组成环节  

        * 如要看到实时交易额，这当然是需要响应的基础设施对其提供支持，针对这一需求，当前业界已经有很多开源的消息系统，而本节课的Kafka就是当前流行的一款非常优秀的消息系统  

        * <!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/jpeg/43218187/1727009896065-d997f765-be18-4218-820c-1945abe380b3.jpeg)  

            + 1.消息系统  

                - Kafka允许发布和订阅数据，从这点来看，它类似于ActiveMQ，RabbitMQ等框架，但是Kafka作为一个分布式系统，是以集群的方式运行的，可以自由伸缩，同时还提供了数据传递保证，看复制，持久化等等。  

            + 2.存储和持续处理大型数据流，  

                - Kafka可以存储和持续处理大型数据流，并且保持延续性的低延迟，在这一点上，可以将将其看作是一个实时版的Hadoop。Kafka的低延迟特点更加适合及时应对这些事件做出响应  

            + 3.实时流平台  

                - Kafka其实是一个面向实时数据的流平台，也就是它不仅可以将现有的应用程序和数据系统连接起来，他还能用于加强这些触发相同数据流的应用  

        * Kafka安装  

            + Zookeeper  

                - 在安装Kafka之前，我们首先得安装Kafka的依赖应用--zookeeper  

                - Zookeeper是一个分布式的，开放源码的分布式应用程序协调服务。由于Kafka是一个分布式平台，所以需要Zookeeper对其集群进行管理和负载均衡。  

                - zookeeper有现成的Docker，在服务器上输入如下命令即可安装  

                    * sudo docker run -d --restart=unless-stopped --name zookeeper --network host zookeeper  

            + Kafka的安装  

                - sudo docker run -d --restart=unless-stopped --name kafka --network host \ --env KAFKA_HEAP_OPTS="-Xmx256M -Xms128M" \ --env KAFKA_ZOOKEEPER_CONNECT=127.0.0.1:2181 \ --env KAFKA_LISTENER_SECURITY_PROTOCOL_MAP=INSIDE:PLAINTEXT,OUTSIDE:PLAINTEXT \ --env KAFKA_LISTENERS=INSIDE://0.0.0.0:9092,OUTSIDE://0.0.0.0:9093 \ --env KAFKA_INTER_BROKER_LISTENER_NAME=INSIDE \ --env KAFKA_ADVERTISED_LISTENERS=INSIDE://{此处替换为私网IP}:9092,OUTSIDE://{此处替换为公网IP}:9093 \ wurstmeister/kafka  

                    * <!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/jpeg/43218187/1727009896059-26fafef1-e612-4d4e-89c6-67879b40a118.jpeg)  

        * SpringBoot中集成Kafka  

            + 引入依赖包（Maven中有直接适配的SpringBoot的Kafka的依赖包，我们只需要引入到pom中即可）（springboot会自动匹配版本）  

                - <dependency> <groupId>org.springframework.kafka</groupId> <artifactId>spring-kafka</artifactId></dependency>  

            + （配置Kafka服务器）在应用的application.properties中加入Kafka服务器的基础配置如下  

                - #============== kafka ===================# 指定kafka 代理地址，可以多个spring.kafka.bootstrap-servers={服务器公网IP地址}:9093#=============== 生产者配置=======================spring.kafka.producer.retries=0spring.kafka.producer.batch-size=16384spring.kafka.producer.buffer-memory=33554432spring.kafka.producer.key-serializer=org.apache.kafka.common.serialization.StringSerializerspring.kafka.producer.value-serializer=org.apache.kafka.common.serialization.StringSerializer#===============消费者配置=======================# 指定默认消费者group idspring.kafka.consumer.group-id=test-consumer-groupspring.kafka.consumer.auto-offset-reset=earliestspring.kafka.consumer.enable-auto-commit=truespring.kafka.consumer.auto-commit-interval=100spring.kafka.consumer.key-deserializer=org.apache.kafka.common.serialization.StringDeserializerspring.kafka.consumer.value-deserializer=org.apache.kafka.common.serialization.StringDeserializer  

                - 注意，这里面大多数属性都是生产者，消费者的基础配置，我们不需要关系，只需要替换其中{服务器公网IP地址}  

                - 最终替换之后的结果为  

                    * spring.kafka.bootstrap-servers=xxx.xxx.xxx.xxx:9093  

            + 引入测试代码  

                - 在kafkaSender加入基础的发送消息代码，测试Kafka是否配置成功  

                    * @Controller@RequestMapping("kafka")public class KafkaSender { @Autowired private KafkaTemplate<String, String> kafkaTemplate; //发送消息方法 @RequestMapping("/send") @ResponseBody public String send() { kafkaTemplate.send("topic", "youkeda"); return "success"; }}  

                    * 如果控制台出现如下信息则表示Kafka配置成功  

                        + 2020-08-05 10:20:59.775 INFO 368 --- [nio-8080-exec-3] o.a.k.clients.producer.ProducerConfig : ProducerConfig values: acks = 1 batch.size = 16384 ...... 此处省略N行 ssl.truststore.type = JKS transaction.timeout.ms = 60000 transactional.id = null value.serializer = class org.apache.kafka.common.serialization.StringSerializer2020-08-05 10:20:59.877 INFO 368 --- [nio-8080-exec-3] o.a.kafka.common.utils.AppInfoParser : Kafka version: 2.5.02020-08-05 10:20:59.882 INFO 368 --- [nio-8080-exec-3] o.a.kafka.common.utils.AppInfoParser : Kafka commitId: 66563e712b0b9f842020-08-05 10:20:59.882 INFO 368 --- [nio-8080-exec-3] o.a.kafka.common.utils.AppInfoParser : Kafka startTimeMs: 15965940598762020-08-05 10:21:00.080 INFO 368 --- [ad | producer-1] org.apache.kafka.clients.Metadata : [Producer clientId=producer-1] Cluster ID: D4w2I2tqSpiXTomr0ixBaw  

    - 接入钉钉  

        * 架构设计  

            + <!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/jpeg/43218187/1727009896612-55d42158-68cf-4733-8325-333b23795fd8.jpeg)  

                - 这个设计中，我们通知服务应用和的雾主题应用完全解除耦合，通过kafka消息机制进行通信，而通知服务著需要管理通知  

            + 1.首先需要一个通知服务应用，利用Kafka对接得物应用和通知应用  

            + 2.利用通知服务应用给钉钉系统发布消息  

        * 项目步骤  

            + 1.接入钉钉系统通知  

            + 2.构建通知应用，确定消息模型  

            + 3.通知应用接入KakfaConsumer  

            + 4.改造订单服务接入KafkaProducer  

        * 具体实现  

            + 这种一般可以去官网看看如何实现  

                - [https://open.dingtalk.com/document/app#/faquestions/vzbp02](https://open.dingtalk.com/document/app#/faquestions/vzbp02)  

            + 1.引入maven依赖  

                - <dependency> <groupId>com.aliyun</groupId> <artifactId>alibaba-dingtalk-service-sdk</artifactId> <version>1.0.1</version></dependency>  

            + 2.简单发送消息代码  

                - @RequestMapping("/text")@ResponseBodypublic String sendText(){ // #0. 配置钉钉客户端，dingdingUrl即根据刚才拷贝的Webhook DingTalkClient client = new DefaultDingTalkClient(this.dingdingUrl); // #1. request表示整个消息请求 OapiRobotSendRequest request = new OapiRobotSendRequest(); // #2. 请求设置消息类别 request.setMsgtype("text"); // #3. 设置消息内容 OapiRobotSendRequest.Text text = new OapiRobotSendRequest.Text(); text.setContent("得物来新订单了"); request.setText(text); // #4. 设置钉钉@功能 OapiRobotSendRequest.At at = new OapiRobotSendRequest.At(); at.setIsAtAll(true); request.setAt(at); try { // #5. 发送消息请求 client.execute(request); } catch (ApiException e) { e.printStackTrace(); } return "success";}  

            + 注意：如果选择了自定义关键词，那么消息内容就必须包含关键词这个词  

            + @Value("${dewu.notify.dingding}")private String dingdingUrl;  

                - 对于url可以在配置文件中写值，动态设置  

                - 配置文件中#============== notify ==================dewu.notify.dingding=[https://oapi.dingtalk.com/robot/send?access_token=dddc99bdd1478c9361285d74fed4c6449a43707e92c3ca08b2f52608e5cac830](https://oapi.dingtalk.com/robot/send?access_token=dddc99bdd1478c9361285d74fed4c6449a43707e92c3ca08b2f52608e5cac830)  

            + <!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/jpeg/43218187/1727009896539-125a02ed-8d79-4355-a54a-c32a1f4ff9fc.jpeg)<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/jpeg/43218187/1727009896842-9b4aeddb-3f16-4306-b409-14030a04c449.jpeg)<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/jpeg/43218187/1727009896997-03543252-45c5-4261-9b56-41cfd51d5b4b.jpeg)  

                - 文本，；链接，markdown的实现  

        * 构建通知应用  

            + 如何衔接到的雾通知应用  

                - 定义对外约定的通知内容，也就是通知模型  

                - 涉及的关键因数  

                    * 1.我们需要定义一个Enum类型表示不同的通知平台  

                    * 2.我们需要支持不同的消息类型（定义一个MsgType字段）  

                    * 3.通知主体内容（主题，内容，图片，跳转地址等）  

                - 最终模型如下  

                    * <!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/jpeg/43218187/1727009896975-0f9a8b2d-7e41-43c8-9b2f-8d7dd5da6efb.jpeg)  

                    * 我们初步将对接平台的接口，称之为NotifyHelper，拥有发送通知的方法  

                        + <!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/jpeg/43218187/1727009897416-83e7f665-cb42-472a-a26e-f7a2527cf9d2.jpeg)  

                    * 紧接着我们完善钉钉通知和企业微信通知的helper  

                        + <!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/jpeg/43218187/1727009897457-eba3c2ee-5e85-4fe8-b332-65718233b9f8.jpeg)  

                    * 最后加入接收Kafka消息的监听器NotifyConsumer，利用其完成对Helper的调用  

                        + <!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/jpeg/43218187/1727009897734-5d2349b5-294d-46d9-a3ac-8e5682edf77f.jpeg)  

    - 数据流  

        * 理论部分  

            + 什么是数据流？它是用来支持流式处理的  

            + 数据流也被称为事件流，比如：1.我们在浏览数据时的浏览数据。2.在搜索商品的搜索数据3.购买商品数据4.etc.....  

            + 对于淘宝而言，这些数据是无处不在的，这就是数据流  

            + 总结一下数据流的特定  

                - 1.无穷的，没有边界的（我们之前解除到的数据，大多数是有限的，比如某天的访问量，某个季度的数据）  

                - 2.无处不在的（从上面的分析得出，网站中发生的一切都是数据流）  

                - 3.有序的（数据的到来总有个先后顺序）  

                - 4.不可变的（数据一旦产生就不能被改变，数据流表示的是某一时刻的事实，时间是无法倒流的）  

                - 5.可重播（既然数据是无法改变的，在不改变数据的情况下，结果肯定是固定的，也就是如果将数据重新跑n次，结果总是相同的）  

            + 流式处理的含义  

                - 流式处理是指实时的处理一个或者这个多个事件流  

                - 其实是一个编程范式  

                    * 之前遇到过的处理范式  

                        + 1.请求与相应（在java网络编程中，springboot课程中的Api，service接口都属于这种范式）  

                        + 2.批处理（大多数任务程序都属于这一类）  

                            - 案例1：系统在每天流程将每个学生当天的学习情况做一个统计，比如学习总时长，学习章节数，代码量等信息  

                            - 案例2：为了统计网页访问量，我们系统会在每天凌晨统计当天的访问次数pv，和当天的访问人数uv（我们可以看到这种批处理的特点：对事件要求不高，但需要高吞吐量）  

                                * <!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/jpeg/43218187/1727009897766-4cccd608-0e60-4562-afa3-d93f2bf04743.jpeg)  

                        + 3.流式处理  

                            - 批处理既高效也经济，但近几年为了能及时，高效的做出决策，需要系统能在更短的事件内提供有效的数据，这种批处理范式的高燕吃，明显不能满足业务的要求，因此出现了流式处理  

                            - 大多数业务不需要毫秒级的相应，但是也不能接受第二天才知道结果  

                                * 举几个例子  

+ 1.现在的趋势是什么？  

+ 2.在最近10分钟内有多少次无效登录尝试？  

+ 3.用户群是如何利用我们最近发布的特征的？  

+ 再比如网络报警，交易报警，股票数据等  

                                * 这些业务是持续性的，它们希望系统能及时给出响应结果，这里是流式处理的应用领域  

                                * <!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/jpeg/43218187/1727009897986-00320634-a303-4a09-9367-dd9e100c8624.jpeg)  

                            - 纵观流式处理，很多方面和普通的数据处理非常相似，大多是是写一些代码来接收数据，对数据进行清理可能还会加入一些变换，聚合，增强，然后输出到另一个地方  

                                * 但是它的出众点在于低延迟，持续性，高吞吐  

                            - 下面是一些流式处理的基本概念  

                                * 时间  

+ 时间，肯定是流式处理最为重要的概念，因为正如上章所描述的场景，大多数流式处理应用都是基于时间窗口而进行的  

+ 举个例子：如果我们是一个股价走势的流式应用，如果当前因为网络的原因导致系统宕机2个小时，那么当系统恢复以后，我们需要知道该如何处理这两个小时的数据，这个时候每个数据上携带的时间就显得尤为重要  

+ 1.事件时间（指事件或者数据产生的时间，也就是kafka消息的时间）  

+ 2.处理时间（指事件或数据被流应用处理的事件，从上面的案例可以看到，我们需要找到这个时间段没有处理的事件，这个时间就特别重要）  

+ 3.摄入时间（被处理以后的时间保存到kafka主题的时间）  

                                * 状态  

+ 流式处理中的状态是什么呢？对于一些简单的流式处理，其实并不关心状态，即对每个消息的处理都是相互独立的，例如：如果想从kafka读取在线购物交易事件流，找出金额超出1W元的交易，这种场景下，就是对消息的简单处理和转换即可，那么消息的状态用在什么地方呢？  


 

