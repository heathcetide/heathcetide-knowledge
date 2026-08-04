### 课程预告:
欢迎各位来到手写MQ系列课程，本期我们将会进行手写一个消息队列中间件，通过这个过程我们将会了解MQ的运行流程，当然还包括研究市面上各种消息队列技术的底层，其中就有大家熟知的Kafka，RabbitMQ，RocketMQ，当然我们也会提一下ActiveMQ和Redis实现的简易消息队列这五种。

这里提一嘴，除了上面的五种，你还知道别的相关技术么？下面给大家说一些
🟩 Amazon SQS（Simple Queue Service）

1. 类型：托管服务（云原生）
2. 特点：高可用、自动扩展、无需维护基础设施，适用于 AWS 生态。
3. 使用场景：轻量异步任务、事件驱动架构等。

🟦 Google Pub/Sub

1. 类型：托管服务（云原生）
2. 特点：全球分布、自动缩放、与 GCP 集成良好。
3. 使用场景：实时流数据处理、大规模发布/订阅模型。

🟥 NATS

1. 类型：轻量级、高性能消息系统
2. 特点：极简架构、低延迟、支持请求/响应和发布/订阅模式。
3. 使用场景：IoT、微服务通信、低延迟场景。

🟨 ZeroMQ

1. 类型：消息库（非中间件）
2. 特点：嵌入式、超轻量、无中间代理、低延迟。
3. 使用场景：高性能通信系统、自定义消息模式。

🟧 Apache Pulsar

1. 类型：分布式、云原生消息队列
2. 特点：多租户、存储与计算分离、支持流和队列模型、强大的分区能力。
3. 对比 Kafka：Pulsar 支持原生多主题、多消费者模型，存储更持久。
4. 适用场景：金融、电信、大数据流处理等。

🟫 Beanstalkd

1. 类型：简单、高性能队列
2. 特点：专注于任务队列，适合延迟队列、任务重试。
3. 使用场景：后台作业处理、Web 异步任务等。

🟪 Celery（依赖底层队列）

1. 类型：Python 分布式任务队列（不是底层队列，而是封装）
2. 特点：支持多种后端（Redis、RabbitMQ 等），用于异步任务和定时任务。
3. 适用场景：Django/Flask 等 Python 系统异步执行任务。

🔵 Microsoft Azure Service Bus

1. 类型：托管消息中间件
2. 特点：企业级服务总线、支持事务、重复检测、会话等。
3. 适用场景：企业内部系统集成、基于 Azure 架构。

课程预告到此为止，下面，我们开始我们的手写MQ课程！


### kafka底层架构与原理
> <font style="color:rgb(85, 86, 102);background-color:rgb(238, 240, 244);">Kafka 是一个可横向扩展，高可靠的实时消息中间件，常用于服务解耦、流量削峰。</font>
<font style="color:rgb(85, 86, 102);background-color:rgb(238, 240, 244);">好像是 LinkedIn 团队开发的，后面捐赠给</font><font style="color:rgb(78, 161, 219) !important;">apache</font><font style="color:rgb(85, 86, 102);background-color:rgb(238, 240, 244);">基金会了。</font>
>

<!-- 这是一张图片，ocr 内容为： -->
!

下面大家看一下kafka的总架构图
<!-- 这是一张图片，ocr 内容为： -->
!

1. Producer：生产者，消息的产生者，是消息的入口。
2. Broker：Broker 是 kafka 一个实例，每个服务器上有一个或多个 kafka 的实例，简单的理解就是一台 kafka 服务器，kafka cluster 表示集群的意思
3. Topic：消息的主题，可以理解为消息队列，kafka的数据就保存在topic。在每个 broker 上都可以创建多个 topic 。
4. Partition：Topic的分区，每个 topic 可以有多个分区，分区的作用是做负载，提高 kafka 的吞吐量。同一个 topic 在不同的分区的数据是不重复的，partition 的表现形式就是一个一个的文件夹。
5. Replication：每一个分区都有多个副本，副本的作用是做备胎，leader节点会将数据同步到follow从节点。当leader故障的时候会选择一个follower ，成为 leader，follower和leader绝对是在不同的机器，同一机器对同一个分区也只可能存放一个副本。

<!-- 这是一张图片，ocr 内容为： -->
!

Consumer：消费者，消息的消费方，是消息的出口。

Consumer Group：可以将多个消费组构成一个消费者组，同一个 partition 的数据只能被消费者组中的某一个消费者消费。同一个消费者组的消费者可以消费同一个topic的不同分区的数据，这也是为了提高kafka的吞吐量。

Zookeeper：kafka 2.8 版本之前是依赖 zookeeper 来保存集群的的元信息，来保证系统的可用性。

Raft：kafka 2.8 版本之后就根据 raft 来保证系统的可用性。

为什么同一个 partition 的数据只能被消费者组中的某一个消费者消费？

<!-- 这是一张图片，ocr 内容为： -->
!

顺序性：Kafka 保证了同一个分区内的消息是有序的，如果允许多个消费者并行消费同一个分区的消息，那么消息的顺序性将无法得到保证。当然由于各个分区的不同，我们顺序性还是不要靠kafka，在自己业务做判定。

负载均衡：通过让不同的消费者组内的消费者分摊不同的分区，Kafka 实现了负载均衡，确保每个消费者都有机会消费消息，同时避免了重复消费。

Offset 管理：每个消费者在消费时都会维护自己的 offset，如果多个消费者同时消费同一个分区，那么 offset 的管理将变得复杂，可能会导致重复消费或者消息丢失。

**发送数据**

kafka 会每次发送数据都是向 leader节点发送数据，并顺序写入到磁盘，然后 leader节点会将数据同步到各个从节点follower，即使主节点挂了，也不会影响服务的正常运行。

<!-- 这是一张图片，ocr 内容为： -->
!

producer 生产者获取 leader 节点，将消息发送给leader节点。

leader节点将消息持久化到本地后，将数据同步到各个follower节点。

leader节点收到各个follower节点的ack后，发送ack给producer

**消费数据**

和生产者一样，消费者主动到kafka集群中拉取消息时，也是从leader节点去拉取数据。

<!-- 这是一张图片，ocr 内容为： -->
!

获取leader节点

拉去offset为0的数据进行消费

消费成功后发送ack，offset将会移动到下一位，待下次消费定位数据

kafka 为什么会那么快？

一共有四个原因


磁盘顺序读写

PageCache 页缓存技术

零拷贝技术

kafka 分区架构

磁盘顺序读写

生产者发送数据到 kafka 集群中，最终会写入到磁盘中，会采用顺序写入的方式。消费者从 kafka 集群中获取数据时，也是采用顺序读的方式。无论是机械磁盘还是固态硬盘 SSD，顺序读写的速度都是远大于随机读写的。


机械磁盘顺序读写省去了磁头频繁寻址和旋转盘片的开销

固态硬盘SSD以Page为单位做读写，以Block为单位做垃圾回收。写相同数据量的情况下，顺序写制造更少的垃圾Block，所以比随机写有更高的性能。

PageCache 页缓存技术

当 kafka 有写操作时，先将数据写入PageCache中，然后在顺序写入到磁盘中。

当读操作发生时，先从PageCache中查找，如果找不到，再去磁盘中读取。


零拷贝技术

一般性能的瓶颈都是网络io、磁盘io。我们来看下从磁盘读取数据到网卡场景下，传统 IO 的整个过程
DMA方式，Direct Memory Access，也称为成组数据传送方式，有时也称为直接内存操作。DMA方式在数据传送过程中，没有保存现场、恢复现场之类的工作。


传统 IO 模型下，从磁盘读取数据，写到网卡设备中，经历了 4 次用户态和内核态之间的切换和数据的拷贝。红色箭头为数据拷贝。

那能不能让拷贝次数发送的少一点呢？但是kafka 采用了 sendfile 的零拷贝技术


所谓的零拷贝技术不是指不发生拷贝，而是在用户态没有进行拷贝。


kafka 分区架构

分区架构：kafka 集群架构采用了多分区技术，并行度高。


参考

[1] [https://strikefreedom.top/archives/why-kafka-is-so-fast](https://strikefreedom.top/archives/why-kafka-is-so-fast)

[2] [https://cloud.tencent.com/developer/article/2185290](https://cloud.tencent.com/developer/article/2185290)

[3] [https://serverfault.com/questions/843628/why-do-sequential-writes-have-better-performance-than-random-writes-on-ssds](https://serverfault.com/questions/843628/why-do-sequential-writes-have-better-performance-than-random-writes-on-ssds)

[4] [https://xie.infoq.cn/article/51b6764c48ff70988e124a868](https://xie.infoq.cn/article/51b6764c48ff70988e124a868)


# <font style="color:rgb(34, 34, 38);">RabbitMQ 架构介绍：深入理解与应用</font>
RabbitMQ 是一个开源的消息代理（Message Broker）软件，它实现了高级消息队列协议（AMQP），并提供了可靠的消息传递机制。RabbitMQ 广泛应用于分布式系统中，用于解耦系统组件、异步处理任务和实现消息驱动的架构。下面将详细介绍 RabbitMQ 的架构、核心组件、工作原理以及应用场景。


1. RabbitMQ 架构概述

1.1 消息代理

消息代理（Message Broker）是一个中间件，用于在不同的应用程序之间传递消息。消息代理接收发送者（Producer）发送的消息，并将消息传递给接收者（Consumer）。消息代理可以确保消息的可靠传递，即使发送者和接收者位于不同的网络或系统中。


1.2 RabbitMQ 的核心组件

RabbitMQ 的核心组件包括
Producer：消息的发送者，负责将消息发送到 RabbitMQ。

Consumer：消息的接收者，负责从 RabbitMQ 接收消息并处理。

Exchange：消息交换机，负责将消息路由到不同的队列。

Queue：消息队列，用于存储消息，直到消费者处理它们。

Binding：绑定，定义了 Exchange 和 Queue 之间的关系，用于消息路由。


简单架构图
完整架构图
1.3 RabbitMQ 的工作原理

RabbitMQ 的工作原理如下
Producer 发送消息：Producer 将消息发送到指定的 Exchange。

Exchange 路由消息：Exchange 根据消息的属性和 Binding 规则，将消息路由到相应的 Queue。

Queue 存储消息：Queue 存储消息，直到消费者处理它们。

Consumer 接收消息：Consumer 从 Queue 中接收消息并处理。

2. RabbitMQ 的核心组件详解

2.1 Producer

Producer 是消息的发送者，负责将消息发送到 RabbitMQ。Producer 通过 AMQP 协议与 RabbitMQ 通信，将消息发送到指定的 Exchange。


2.2 Consumer

Consumer 是消息的接收者，负责从 RabbitMQ 接收消息并处理。Consumer 通过 AMQP 协议与 RabbitMQ 通信，从指定的 Queue 中接收消息。


2.3 Exchange

Exchange 是消息交换机，负责将消息路由到不同的 Queue。RabbitMQ 提供了多种类型的 Exchange，包括
Direct Exchange：直接交换机，根据消息的 Routing Key 将消息路由到相应的 Queue。

Fanout Exchange：广播交换机，将消息广播到所有绑定的 Queue。

Topic Exchange：主题交换机，根据消息的 Routing Key 和 Binding Key 的匹配规则，将消息路由到相应的 Queue。

Headers Exchange：头部交换机，根据消息的头部属性，将消息路由到相应的 Queue。

2.4 Queue

Queue 是消息队列，用于存储消息，直到消费者处理它们。Queue 是 RabbitMQ 的核心组件之一，它提供了持久化、排他性、自动删除等特性。


2.5 Binding

Binding 定义了 Exchange 和 Queue 之间的关系，用于消息路由。Binding 通过 Routing Key 或 Binding Key 将 Exchange 和 Queue 绑定在一起。


3. RabbitMQ 的工作原理

3.1 消息发送

Producer 通过 AMQP 协议将消息发送到指定的 Exchange。消息包含以下属性
Routing Key：用于 Exchange 路由消息。

Headers：消息的头部属性，用于 Headers Exchange 路由消息。

Properties：消息的其他属性，如消息优先级、过期时间等。

3.2 消息路由

Exchange 根据消息的属性和 Binding 规则，将消息路由到相应的 Queue。不同类型的 Exchange 使用不同的路由规则
Direct Exchange：根据消息的 Routing Key 将消息路由到相应的 Queue。

Fanout Exchange：将消息广播到所有绑定的 Queue。

Topic Exchange：根据消息的 Routing Key 和 Binding Key 的匹配规则，将消息路由到相应的 Queue。

Headers Exchange：根据消息的头部属性，将消息路由到相应的 Queue。

3.3 消息存储

Queue 存储消息，直到消费者处理它们。Queue 提供了持久化、排他性、自动删除等特性，以确保消息的可靠传递。


3.4 消息接收

Consumer 通过 AMQP 协议从指定的 Queue 中接收消息并处理。Consumer 可以选择手动确认消息或自动确认消息。


4. RabbitMQ 的应用场景

4.1 异步处理

RabbitMQ 可以用于异步处理任务，将耗时的任务放入消息队列中，由消费者异步处理。这种方式可以提高系统的响应速度和吞吐量。


4.2 解耦系统组件

RabbitMQ 可以用于解耦系统组件，通过消息传递机制，不同的组件可以独立开发和部署，提高系统的可维护性和可扩展性。


4.3 消息驱动的架构

RabbitMQ 可以用于实现消息驱动的架构，通过消息传递机制，系统可以响应外部事件，实现复杂的业务逻辑。


4.4 分布式系统

RabbitMQ 可以用于分布式系统中，通过消息传递机制，不同的节点可以协同工作，实现分布式计算和数据处理。


5. 总结

RabbitMQ 是一个强大的消息代理软件，它提供了可靠的消息传递机制，广泛应用于分布式系统中。通过理解 RabbitMQ 的架构、核心组件和工作原理，我们可以更好地设计和实现消息驱动的系统。


无论是异步处理、系统解耦还是分布式系统，RabbitMQ 都能帮助我们实现高效、可靠的消息传递。希望本文能够帮助你更好地理解和应用 RabbitMQ。


目录标题

核心组件概览

Exchange 类型与路由机制

消息生命周期

确认机制与可靠性

高可用与扩展

常见插件与协议支持

RabbitMQ 是一个开源的消息代理，用于在分布式系统中解耦、可靠地传递消息。它基于 AMQP 协议，实现了灵活的交换机（Exchange）、队列（Queue）和绑定（Binding）模型，支持高可用集群、插件扩展和多种协议。以下介绍其核心概念，帮助快速入门并理解消息流转、路由和高可用特性。


展示了 RabbitMQ 在消息流转（Publish → Route → Enqueue → Consume）与集群高可用层面的整体设计


核心组件概览

Producer（生产者）：负责创建并发送消息到 RabbitMQ 的客户端应用或服务。生产者通过指定的 Exchange 将消息发布到 Broker 中，消息内容可以是任意字节流，如 JSON、XML 或文本【(GeeksforGeeks)】。

Exchange（交换机）：接收生产者发送的消息，并根据类型和路由键（Routing Key）将消息路由到一个或多个 Queue。【(RabbitMQ)】

Queue（队列）：存储待消费的消息的容器，消费者可从队列中按序拉取或被推送消息，直到被确认（acknowledge）后才从队列中移除【(Informatica Docs)】。

Consumer（消费者）：订阅一个或多个队列，接收并处理消息。消费者在处理完成后，向 Broker 发送 ACK，以便 Broker 可以安全删除消息【(GeeksforGeeks)】。

Binding（绑定）：将 Exchange 与 Queue 相连的规则，Binding 可携带路由键或某些参数，用于告诉 Exchange 如何将消息路由到对应的队列【(GeeksforGeeks)】。

Routing Key（路由键）：消息携带的任意字符串，Exchange 根据其类型和绑定的路由键来决定消息流向哪些队列【(GeeksforGeeks)】。

连接（Connection）：生产者和消费者通过TCP连接与RabbitMQ服务器通信。


通道（Channel）：每个连接可以包含多个通道，通道是建立在单个TCP连接上的虚拟连接，用于执行AMQP命令。使用通道可以减少TCP连接的开销，允许多个用户或应用程序共享一个连接。


Exchange 类型与路由机制

RabbitMQ 支持多种 Exchange 类型，每种类型决定了路由逻辑
Direct Exchange：将消息路由到绑定时指定了完全匹配路由键的队列【(RabbitMQ)】。

Fanout Exchange：忽略路由键，将消息广播到绑定的所有队列，常用于订阅/发布场景【(RabbitMQ)】。

Topic Exchange：根据路由键的通配模式（如 user.* 或 #.log）进行灵活匹配，将消息路由到符合模式的队列【(RabbitMQ)】。

Headers Exchange：通过消息头（Headers）与绑定时配置的键值对匹配，而非使用路由键【(Informatica Docs)】。

消息生命周期

Publish（发布）：Producer 调用 basic_publish 将消息发送到指定 Exchange，并携带 Routing Key。【(维基百科)】

Route（路由）：Exchange 按 Binding 规则将消息复制或转发到一个或多个队列【(RabbitMQ)】。

Enqueue（入队）：消息落入队列并等待被消费；如果队列设置为持久化（durable），消息也可写入磁盘以防宕机丢失【(维基百科)】。

Consume（消费）：Consumer 调用 basic_consume 或 basic_get 接收消息，并在处理成功后发送 ACK，Broker 删除该消息，否则可重新入队或丢弃（根据配置重试或死信）【(RabbitMQ)】。

确认机制与可靠性

Publisher Confirms：可选的发布确认机制，当 Broker 成功接收到并持久化消息后，会向生产者发送确认（ACK），确保消息不丢失【(维基百科)】。

Consumer Acks：消费者必须显式 ACK 才算消息被正确处理；如果消费者断开连接且未 ACK，消息会重新入队供其他消费者消费，保证至少一次交付【(RabbitMQ)】。

事务模式（Transactions）：RabbitMQ 也支持事务，但性能较低，通常推荐使用 Publisher Confirms 代替事务以兼顾性能与可靠性【(维基百科)】。

高可用与扩展

镜像队列（Mirrored Queues）：在集群中将队列镜像到多个节点，任何节点失败时，仍可从其他节点继续消费，保证高可用【(维基百科)】。

集群模式（Clustering）：多个 Broker 节点可组成集群，分布 Exchange 与 Queue 的元数据，实现水平扩展与故障转移【(维基百科)】。

联邦（Federation）与 Shovel 插件：用于跨数据中心或不同 RabbitMQ 集群间的消息转发和复制，支持异地高可用与灾备【(维基百科)】。

常见插件与协议支持

Management Plugin：提供 Web UI、HTTP API 和 Prometheus 指标，用于监控、管理虚拟主机、用户、队列和连接【(维基百科)】。

STOMP/MQTT/Web STOMP 插件：使 RabbitMQ 支持多种协议，方便物联网、WebSocket 或其他协议的客户端集成【(维基百科)】。

Delayed Message Plugin：允许在队列中延迟消息投递，用于任务调度与重试场景【(维基百科)】。

以上便是 RabbitMQ 的核心概念介绍，包括消息流转的主要组件、Exchange 类型与路由逻辑、确认与可靠性机制，以及高可用集群和插件生态。掌握这些要素，便可快速构建稳定且可扩展的消息驱动系统。


