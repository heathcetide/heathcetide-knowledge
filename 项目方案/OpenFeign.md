1.引入依赖：

```plain
<!-- Feign 依赖 -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
    <version>3.1.8</version>
</dependency>
```

2.启动类开启Feign注解：

```plain
@EnableFeignClients
public class CodeForgeApplication {
```

3.编写feign接口：

```plain
@FeignClient("codeforge-component-go-service")  // user-service 是注册到 nacos 的服务名
public interface UserClient {
    @GetMapping("/api/v1/study")
    ApiResponse getStudyRooms();
}
```

4.调用feign接口:

```plain
@Resource
private UserClient userClient;

@PostConstruct
void init() {
    logger.info("CodeForgeApplication started successfully.");
    ApiResponse studyRooms = userClient.getStudyRooms();
    logger.info("StudyRooms: {}", studyRooms);
}
```

## **一、基础功能（你已使用）**
+ `@FeignClient(name="xxx")`：声明客户端
+ `@GetMapping / @PostMapping`：绑定 HTTP 接口
+ `@PathVariable` / `@RequestParam` / `@RequestBody`：传递参数

## **二、高级功能**
### 1. **服务降级（熔断）**
防止依赖服务挂了导致整个系统崩：

```plain
@FeignClient(name="xxx", fallback=MyFallback.class)
```

或支持 Hystrix、Sentinel、Resilience4j（Spring Cloud Alibaba 推荐 Sentinel）

### 2. **统一错误处理（ErrorDecoder）**
```plain
@Component
public class FeignErrorDecoder implements ErrorDecoder {
    @Override
    public Exception decode(String methodKey, Response response) {
        // 可以根据 HTTP 状态码定制异常
        return new RuntimeException("Feign 请求失败: " + response.status());
    }
}
```

配置进 Feign：

```plain
@FeignClient(name = "xxx", configuration = FeignCustomConfig.class)
```

---

### 3. **请求拦截器（添加 Token、TraceId）**
```plain
@Component
public class FeignRequestInterceptor implements RequestInterceptor {
    @Override
    public void apply(RequestTemplate template) {
        template.header("Authorization", "Bearer your_token_here");
    }
}
```

### 4. **多 FeignClient 配置不同参数**
比如不同的超时、编码器设置：

```plain
feign:
  client:
    config:
      default:
        connectTimeout: 5000
        readTimeout: 5000
      userClient:
        loggerLevel: FULL
```

### 5. **文件上传**
```plain
@PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
ApiResponse upload(@RequestPart("file") MultipartFile file);
```

### 6. **文件下载**
```plain
@GetMapping(value = "/download", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
Response download();
```

### 7. **重试机制**
```plain
feign:
  client:
    config:
      default:
        retryer: com.netflix.retry.Retryer.Default
```

也可以自定义 Retryer。

### 8. **日志打印**
```plain
feign:
  client:
    config:
      default:
        loggerLevel: FULL  # 可选：NONE, BASIC, HEADERS, FULL
```

### 9. **异步调用（需要额外依赖）**
Feign 默认是同步的，可通过异步封装如：

```plain
@Async
public CompletableFuture<ApiResponse> asyncCall() {
    return CompletableFuture.completedFuture(feignClient.get());
}
```

### 10. **FeignClient 多环境支持**
```plain
@FeignClient(name = "user-service", url = "${user-service.url}")
```

适用于不同环境设置不同 URL。

### 11. **请求压缩（gzip）**
```plain
feign:
  compression:
    request:
      enabled: true
    response:
      enabled: true
```

### 12. **负载均衡（配合 Ribbon 或 Nacos）**
如果你使用 Spring Cloud，Feign 默认支持服务名负载均衡（通过 Ribbon 或 Nacos）。

### 13. **支持 **`**Feign.Builder**`** 自定义客户端**
适合复杂的创建逻辑或多个服务使用不同配置：

```plain
@Bean
public MyFeignClient myFeignClient() {
    return Feign.builder()
            .encoder(new JacksonEncoder())
            .decoder(new JacksonDecoder())
            .target(MyFeignClient.class, "http://host");
}
```

---

## **三、调试技巧**
+ 打开 `FULL` 日志可看完整请求响应
+ 推荐用 Postman 验证一次接口结构
+ 用断点 + 调试观察拦截器效果



****

**http客户端Feign代替RestTemplate**

相比于之前使用restTemplate进行远程调用

```jsx
String url = "http://userservice/user/"+order.getUserId();
User user = restTemplate.getForObject(url, User.class);
```

主要存在的问题：

1.代码的可读性差，编程体验不统一

2.参数复杂URL难以维护

**openFeign**

介绍Fiegn是一个声明式的http客户端，官方网址github.com/OpenFeign/feign

其作用就是帮我们优雅的实现http请求的发送，解决上面提到的问题

<!-- 这是一张图片，ocr 内容为：POWERPOINT  POWERPRINGCLOUDO2.PPTX]POWERPOINT HTTP客户端FEIGN 黑马程序员 WWW.THEIMB.COM 定义和使用FEIGN客户端 TERIEG ERT  HTE://EVERSERVLEE/VEERS** ENTEN.PRTOWERTEC)ERTEC: TORR  MER  REATTE OLATS,PRBRTERTECTCURL,BER.ELATA): 使用FEIGN的步骤如下: 1.引入依赖: <DEPENDENCY> <GROUPID>ORG.SPRINGFRAMEWORK.CLOUD</GROUPID> <ARTIFACTID>SPRING -CLOUD-STARTER-OPENFEIGN</ARTIFACTID> </DEPENDENCY> 2.在ORDER-SERVICE的启动类添加注解开启FEIGN的功能: CENABLEFAIGNCLIENTS @MAPPERSCAN("CN.ITCAST.ORDER.MAPPER") @SPRINGBOOTAPPLICATION PUBLIC CLASS ORDERAPPLICATION PUBLIC STATIC VOID MAIN(STRING[] ARGS){ SPRINGAPPLICATION.RUN(ORDERAPPLICATION.CLASS,ARGS); 品 园 血 奥 幻灯片第26张,共68张 五QM -->
![](https://cdn.nlark.com/yuque/0/2024/jpeg/43218187/1727141654874-0ac9f478-c0d3-48e6-8e2e-3df17f39f36c.jpeg)<!-- 这是一张图片，ocr 内容为：[SPRINGCLOUD02 PPTS]POWERPOINT HTTP客户端FEIGN 黑马程序员 WWW.THEIMA.COM 定义和使用FEIGN客户端 SERIRG ERT.         ESERSERELEE/VSERD" E                                                              POP    REE   REEPLATS.PE5FORLEJEETCARL,EEER.ELASS); 使用FEIGN的步骤如下: 3.编写FEIGN客户端: @FEIGNCLIENT('USERSERVICE") PUBLIC INTERFACE USERCLIENT @GETMAPPING("/USER/{ID}") USER FINDBYID(@PATHVARIABLE("ID") LONG ID); 主要是基于SPRINGMVC的注解来声明远程调用的信息,比如: 服务名称:USERSERVICE 请求方式:GET 请求路径://USER//ID] 请求参数:LONG ID 返回值类型:USER 园 88 中 丽 公灯片第 27张,其68张 美 -->
![](https://cdn.nlark.com/yuque/0/2024/jpeg/43218187/1727141784722-20d85a79-1478-4c8c-a253-b10d969a1e2e.jpeg)<!-- 这是一张图片，ocr 内容为：X RUN TOOLS GIT WINDOW HELP ORDERSERVICE.JAVA [ORDER-SERVICE]-ADMINISTRATOR CLOUD-DEMO-O EILE EDIT VIEW NAVIGATE CODE ANALYZE REFACTOR BUILD RUN TOOL ORDERAPPLICATION 文明 GIT: QUERYORDERBYLD MAIN JAVA CN ITCAST ORDERVICE 三二二十一 PROJECT ORDERSERVICE.JAVA PATTERNPROPERTIES JAVAX ORDERAPPLICATION.JAVA ORDERCONTROLLER JAVA USERCLIENTJAVA LUAJ PUDIC  CLASS URAERVICE CLOUD-DEMO-D:/CODEICLOUD-DEMO 7AF3DB A3 12 IDEA EMAVEN AAUTOWIRED 18 EUREKA-SERVER 7AF3DBE4/10 A PRIVATE ORDERHAPPER ORDERNAPPER; 14 ORDER-SERVICE 7AF3DBE4/10 A SIC 15 MAIN BAUTOWIRED 16 JAVA 17% PRIVATE USERCLIENT USERCLIENT; CNITCASTORDER 18 CLIENTS PUBLIC ORDER QUERYORDERBYID(LONG ORDERID){ 19 USERCLIENT 1/1.查询订单 28 DL MAPPER ORDER ORDER :ORDERMAPPER.FINDBYID(ORDERID); 21 BA POJO 1/2.用FEIGN远程调用 22 USER USER  USERCLIENT.FINDBYID(ORDER.GETUSERID());L. ORDERSERVICE 23 WEB 1/3.1/WUSER DER 25 ORDERAPPLICATION ORDER.SETUSER(USER); RESOURCES 1/4.返回 26 TEST RETURN ORDER; 27 TARGET 子 28 I ORDER-SERVICE.IML 29 MI POM.XML 30 /*@AUTOWIRED B USER-SERVICE 7AF3DBE4/10 A WORD BOCK R 本 X FAVORITES SERVICES 三云战复用七 CONSOLE ENDPOINTS 04-12 17:66:40:616  INFO 1228 ---- [NIG-8088-EXEC-7] COM,ZAXXER,HIKARIDATARIDATASOURGE SPRING BOOT TODO BUILD 园 TERMINAL G PROFILET PROBLEMS SPRING F GIT EVENT LOG % ENDPOINTS SERVICES GENPROTOBUF 946 OF 1979M 10 4/N/A 23:60 CRLF UTF-8 4 SPACES A7AF3DBE4 PRESS ESCAPE TO REMOVE THE HIGHLIGHTING -->
![](https://cdn.nlark.com/yuque/0/2024/jpeg/43218187/1727141794540-b2890e3c-9c34-4ed3-b8f7-2a51883c95cb.jpeg)<!-- 这是一张图片，ocr 内容为：[SPRINGCLOUDIOZ.PPBL`POWERPOINT HTTP客户端FEIGN-快速入门 黑马程序员 WWW.ITHEIMA.COM FEIGN的使用步骤 引入依赖 0  引 总结 添加@ENABLEFEIGNCLIENTS注解 编写FEIGNCLIENT接口 使用FEIGNCLIENT中定义的方法代替RESTTEMPLATE 四 品 血 幻灯片第29张,共68张 立RM 美 -->
![](https://cdn.nlark.com/yuque/0/2024/jpeg/43218187/1727141814877-e7ebb52c-d3b9-4356-939e-dfe6953ebc92.jpeg)  
	使用方式  
		1.引入依赖

```jsx
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-openfeign</artifactId>
            <version>2.2.7.RELEASE</version>
        </dependency>
```

 		2.启动类上加上注解	@EnableFeignClients

```java
@EnableFeignClients
@SpringBootApplication(scanBasePackages={"hibiscus.cetide.app"})
public class AppApplication {
}
```

  
		3.编写Feign客户端  
			1.创建clients包并且创建UserClient

```java
@FeignClient("userservice")
public interface UserClient {
    @GetMapping("/users")
    String getUserName(String userId);
}
```

注意事项  
1.服务名 2.服务的请求方式 3.请求路径 4.请求参数 5.返回值类型  
	实现例子

```java
    Order order = orderMapper.findById(id);
    User user = userClient.findById(order.getUserId())
    order.setUser(user);
```











<!-- 这是一张图片，ocr 内容为：如灯开放跌[SPRINGCLOUDIOZPPBX]-POWERPOINT HTTP客户端FEIGN 黑马程序员 WWW.THEIME.COM 自定义FEIGN的配置 FEIGN运行自定义配置来覆盖默认配置,可以修改的配置如下: 类型 说明 作用 修改日志级别 FEIGN.LOGGER.LEVEL 包含四种不同的级别:NONE,BASIC,HEADERS,FULL HTTP远程调用的结果做解析,例如解析JSON字符串为JAVA对象 响应结果的解析器 FEIGN.CODEC.DECODER 将请求参数编码,便于通过HTTP请求发送 请求参数编码 FEIGN.CODEC.ENCODER 支持的注解格式 FEIGN.CONTRACT 默认是SPRINGMVC的注解 FEIGN.RETRYER 请求失败的重试机制,默认是没有,不过会使用RIBBON的重试 失败重试机制 一般我们需要配置的就是日志级别. 园 88 血 幻灯片第30张,其68张 立A- -->
![](https://cdn.nlark.com/yuque/0/2024/jpeg/43218187/1727141824604-5513a024-3386-44fc-8cfb-fe8a86f8c831.jpeg)





<!-- 这是一张图片，ocr 内容为：HTTP客户端FEIGN 黑马程序员 WWW:HBIRT 自定义FEIGN的配置 配置FEIGN日志的方式二:JAVA代码方式,需要先声明一个BEAN: SS FEIGNCLIENTCONFIQURATION F PUBLIC CLASS F @BEAN PUBLIC LOGGER.LEVEL FEIGNLOGLEVEL() RETURN LOGGER.LEVEL.BASIC; 而后如果是全局配置,则把它放到@ENABLEFEIGNCLIENTS这个注解中: R而后如 @ENABLEFEIGNCLIENTS(DEFAULTCONFIGURATION - FEIGNCLIENTCONFIGURATION.CLASS) 如果是局部配置,则把它放到@FEIGNCLIENT这个注解中: OFEIGNCLIENT(VALUE :"USERSERVICE", CONFIGURATION - FEIGNCLIENTCONFIGURATION.CLASS) 品 四 血 R 公灯片第32张,其68张 R 中口 -->
![](https://cdn.nlark.com/yuque/0/2024/jpeg/43218187/1727141833597-47c007ea-81b3-448f-a069-81eb06d279b0.jpeg)



<!-- 这是一张图片，ocr 内容为：网打台按:[SPRINGCLOUDO2.PPBD:POWERPOINT HTTP客户端FEIGN 黑马程序员 WWW.THEIMB.COM 自定义FEIGN的配置 配置FEIGN日志有两种方式: 方式一:配置文件方式 全局生效: FEIGN: CLIENT: CONFIG: DEFAULT:#这里用DEFAUTT就是全局配置,如果是写服务名称,则是针对某个微服务的配置 LOGGERLEVEL:FULL#日志级别 局部生效: FEIGN: CLIENT: CONFIG: USERSERVICE:#这里用DEFAULT就是全局配置.如果是写服务名称,则是针对某个微服务的配置 LOGGERLEVEL:FULL #日志级别 路园 中 切灯片第31张,共68张 五QU 帅口 -->
![](https://cdn.nlark.com/yuque/0/2024/jpeg/43218187/1727141849996-ea340987-1dfb-4eed-ac45-c3bd41126a2b.jpeg)



<!-- 这是一张图片，ocr 内容为：X WINDOW HELP CLOUD-DEMO-ORDER-SERVICEL...LAPPLICATION.YML[ORDER SERVICE] EILE EDIT VIEW NAVIGATE CODE ANALYZE BEFACTOR BUILD RUN TOOLS GIT Y GIT: 文 CLOUD-DEMO ORDER-SERVICE SRC MAIN  RESOURCES ORDERAPPLICATION APPLICATIONYML G 中云三 PROJECT BOOTSTRAP.YML USERCLIENTJAVA ORDERCONTROLLER JAVA ORDERSERVICE JAVA SORDER-SERVICEL../APPLICATION.YML MATATA JAVA 40 CONFIG: DL  CN.ITCAST.ORDER EM DEFAULT: 41 THIL CLIENTS STRUCTURE 42 LOGGERLEVEL:FULL USERCLIENT BLL MAPPER BL POJO LLL DATABASE TH SERVICE ORDERSERVICE DIL WEB DOCUMENT 1/1>FEIGN:` CLIENT,CONFIG:I DEFAULT:LOGGERLEVEK SERVICES 本 三云王王风大 EL  CONSOLE &ENDPOINTS 04-12 18:21:11:167 INFU 15756 MAINJ C.N.C.SOURCES.UKLCONTIQURATIONSOURCE SPRING BOOT TO ENABLE URLS AS DYNAMIC CONFIQURATION SOURCES, DEFINE SYSTEM PROPERTY ARCHALUS RUNNING ORDERAPPLICATION -GONFIGURATIONSOURCE.ADDITIONALURLS OR MAKE CONFIG-PROPERTIES AVAILABLE ON CLASSPATH 04-12 18:21:11:170 WARN  13756---------1 USERAPPLICATION:8081/ MAIN] C.N.C.SOURCES.URLCONFIQURATIONSOURCE USERAPPLICATION2:8082/ NO URLS WILL BE POLLED AS DYNAMIC CONFIQURATION SOURCES. CENTOS-101 04-12 18:21:170 INFO 13756-------[ IN]C.N.C.SOURCES.URLCONFIQURATIONSOURCE MAINL 森甲林 TO ENABLE URLS AS DYNAMIC CONFIGURATION SOURCES, DEFINE SYSTEM PROPERTY ARCHAIUS .CONFIGURATIONSOURCE.ADDITIONALURLS OR MAKE CONFIG.PROPERTIES AVAILABLE ON CLASSPATH. MAIN]O.S.S.S.CONCURRENT.THREADPOOLTASKEXECUTOR 04-12 18:21:11:246 INF0 13756-----[ INITIALIZING EXECUTORSERVICE 'APPLICATIONTASKEXECUTOR' 04-12 18:21:12:152 INF0 13756 ---[ MAIN]O.S.S.C.THREADPOOL.TASKSCHEDULER INITIALIZING EXECUTORSERVICE NACOS-WATCH-TASK-SCHEDULER' TERMINAL G PROFILERVICES SPRING L GIT PROBLEMS GENPROTOBUF SERVICES EVENT LOG 653 OF 1979M BUILD COMPLETED SUCCESSFULLY IN 915 MS(M 10 A/NO REMOTE 42:17 CRLF UTF-8 2 SPACES A 7AF3DBE4 NTS AGO) 中国建设门门诊 帅口 -->
![](https://cdn.nlark.com/yuque/0/2024/jpeg/43218187/1727141861465-05e7ba2c-bb8f-427c-9f94-69ac5f536a4a.jpeg)



<!-- 这是一张图片，ocr 内容为：POWERPOINT 如灯]故映 [SPRINGCLOUDO2.PPTX],POWERPOINT HTTP客户端FEIGN-日志配置 黑马程序员 WWW.THEIME.COM FEIGN的日志配置: 1.方式一是配置文件,FEIGN.CLIENT.CONFIG.XXX.LOGGERLEVEL 总结 如果XXX是DEFAULT则代表全局 如果XX是服务名称,例如USERSERVICE则代表某服务 2.方式二是JAVA代码配置LOGGER.LEVEL这个BEAN 如果在@ENABLEFEIGNCLIENTS注解声明则代表全局 如果在@FEIGNCLIENT注解中声明则代表某服务 圆 品 中 公灯片第33张,其68张 立Q- 英 -->
![](https://cdn.nlark.com/yuque/0/2024/jpeg/43218187/1727141868180-84c6b706-62df-43f3-a92b-a42c88439593.jpeg)



<!-- 这是一张图片，ocr 内容为：片故缺-[SPRINGCLOUD02.PPTX]POWERPOINT HTTP客户端FEIGN 黑马程序员 WWW.THEIMA.CCM FEIGN的性能优化 FEIGN底层的客户端实现: URLCONNECTION:默认实现,不支持连接池 APACHE HTTPCLIENT:支持连接池 OKHTTP:支持连接池 因此优化FEIGN的性能主要包括: 使用连接池代替默认的URLCONNECTION 日志级别,最好用BASIC或NONE 88 中 幻灯片第34张,其68张 五QU 英 -->
![](https://cdn.nlark.com/yuque/0/2024/jpeg/43218187/1727141875607-41bf539c-b761-415f-af4f-67bb0c3beea4.jpeg)



<!-- 这是一张图片，ocr 内容为：[SPRINGCLOUDO2.PPBX]POWERPOINT POWERPOINT幻灯片故缺[SPR] HTTP客户端FEIGN 黑马程序员 WWW.THEIML.COM FEIGN的性能优化-连接池配置 FEIGN添加HTTPCLIENT的支持: 引入依赖: <!-HTTPCLIENT的依赖 <DEPENDENCY> <GROUPID>IO.GITHUB.OPENFEIGN</GROUPID> <ARTIFACTID>FEIGN-HTTPCLIENT</ARTIFACTID> </DEPENDENCY> 配置连接池: FEIGN: CLIENT: CONFIG: DEFAULT:#DEFAULT全局的配置 LOGGERLEVET:BASIC #日志级别,BASIC就是基本的请求和响应信息 HTTPCLIENT: ENABLED:TRUE #开启FEIGN对HTTPCLIENT的支持 MAX-CONNECTIONS:200#最大的连接数 MAX-CONNECTIONS-PER-ROUTE:50#每个路径的最大连接数 园 88 公灯片第35张,68张 立A- -->
![](https://cdn.nlark.com/yuque/0/2024/jpeg/43218187/1727141884784-294a215c-e128-423c-a55e-cc828dc7c09a.jpeg)



<!-- 这是一张图片，ocr 内容为：X CLOUD-DEMO-ORDER SERVICEL.-/APPLICATION.YML [ORDER SERVICE] HELP $ GIT WINDOW EILE EDIT VIEW NAVIGATE CODE ANALYZE BEFACTOR BUILD RUN TOOLS G 文明 GIT: ORDERAPPLICATION CLOUD-DEMO ORDER-SERVICE SRC,MAIN RESOURCES APPLICATIONYML VG 三三二二二NPOMXML(ORDERVICE) PROJECT ORDER-SERVICEL..../APPLICATION.YML ORDERSERVICE JAVA USERCLIENT.JAVA BOOTSTRAP.YML ORDER-SERVICE 7AF3DBE4/11A 26 #EUREKA: SRC 27 # CLIENT: EMAVEN MAIN SERVICE-URL:#EUREKA的地址信息 # 28 JAVA DEFAUTZONE:HTTP://127.0.0.1:10086/EUREKA 29 CN.ITCAST.ORDER @DATABASE 30 USERSERVICE: CLIENTS 31 RIBBON: USERCLIENT NFLOADBALANCERRULECLASSNAME:COM.ALIBABA.CLOUD.NACOS.RIBBON.NACOSRULE # 32 CONFIG DEFAUITFEIGNCONFIGURATION 33 RIBBON: DLL MAPPER EAGER-LOAD: 34 DA POJO ENABLED:TRUE 开启机馆加救 35 SERVICE CLIENTS:指定饥饿加载的服务名称 36 ORDERSERVICE 37 USERSERVICE BILWEB 38 FEIGN: ORDERAPPLICATION 39 HTTPCLIENT: RESOURCES 40 ENABLED:TRUE #支持HTTPCLIENT的开关 S APPLICATION.YML 44 TEST NAX-CONNECTIONS:220#最大连接数 TARGET MAX-CONNECTIONS-PER-ROUTE:50 单个路径的最大连按制 ORDER-SERVICE.IML MPOM.XML DOCUMENT 1/1  FEIGN: SUE EAE   TEA 7AGE 7ANAA/19 A SERVICES WORD BOOK FAVORITES 小豆云洗卫用士 EI CONSOLE ENDPOINTS 64-12 18:24:46:971 DEBUG 19756------- [NIO-EXEC-EXEC-4] CN.ITCAST.ORDER.CLIENTS.USERCLIENT SPRING BOOT [USERCLIENT#FINDBYID]<--H --HTTP/1.1 200(47MS) RUNNING ENDPOINTS<BUILD TODODO &SERVICESPRING G PROFILER LT GIT EVENT LOG PROBLEMS GENPROTOBUF 677 OF 1979M 11 2/NO REMOTE 38:1(136 CHARS,4 LINE BREAKS) CRLF UTF-8 2 SPACES,A 7AF3DBE4 BUILD COMPLETED SUCCESSFULLY IN 2 SEC,864 MS (11 MINUTES AGO) -->
![](https://cdn.nlark.com/yuque/0/2024/jpeg/43218187/1727141893085-fee68f07-29a2-4b1c-9b0f-88ac574beb8b.jpeg)



<!-- 这是一张图片，ocr 内容为：HTH放映[SPRINGCLOUDI0UDI02.PPTX]POWERPOINT HTTP客户端FEIGN-快速入门 黑马程序员 WWW.THEIMIC.COM FEIGN的优化: 总结 1.日志级别尽量用BASIC 2.使用HTTPCLIENT或OKHTTP代替URLCONNECTION 引入FEIGN-HTTPCLIENT依赖 配置文件开启HTTPCLIENT功能,设置连接池参数 品 幻灯片第36张,其68张 -->
![](https://cdn.nlark.com/yuque/0/2024/jpeg/43218187/1727141900754-b45eaadf-b4cf-4d98-84ab-e728cf1e4e31.jpeg)



<!-- 这是一张图片，ocr 内容为：POWERPOINT 网XTH收快 [SPRINGCLO2.PPTZ-POWERPOINT HTTP客户端FEIGN 黑马程序员 WWW.THEIME.COM FEIGN的最佳实践 方式一(继承):给消费者的FEIGNCLIENT和提供者的CONTROLLER定义统一的父接口作为标准. PUBLIC INTERFACE USERAPI-L @GETMAPPING(*/USER/FID]) USER FINDBYID(@PATHVARIABLE("ID)LONG ID); RESTCONTROLLER @FEIGNCLIENT(VALUE "USERSERVICE") PUBLIC CLASS USERCONTROLLER IMPLEMENTS USERAPI{ PUBLIC INTERFACE USERCLIENT EXTENDS USERAPI{] 子 IT IS GENERALLY NOT ADVISABLE TO SHARE AN INTERFACE BETWEEN A SERVER AND A LIENT,IT IT IGHT COUPLING, ALSO ACTUALLY DOESIT WORK WITH SPRING MYCIN ITS CURRENT FORM (METHOD PARAMETER MAPPINGIS NOT INHERITE 品品 血 幻灯片第37张,共69张 口物英 五V- -->
![](https://cdn.nlark.com/yuque/0/2024/jpeg/43218187/1727141909601-d8b0bdde-b83b-4fda-94af-caf5803879f1.jpeg)



<!-- 这是一张图片，ocr 内容为：[SPRINGCLOUD02.PPTX]POWERPOINT HTTP客户端FEIGN 黑马程序员 WWW.ITHEIMG.COM FEIGN的最佳实践 方式二(抽取):将FEIGNCLIENT抽取为独立模块,并且把接口有关的POJO,默认的FEIGN配置都放到这个模块中,提供 给所有消费者使用 ORDER-SERVICE FEIGN-API USERCLIENT USER-SERVICE USER 引用依赖 远程调用 USERCONTROLLER DEFAULTCONFIG PAY-SERVICE 路易 中 公灯片第38张,共69张 口物英 -->
![](https://cdn.nlark.com/yuque/0/2024/jpeg/43218187/1727141918595-5501f2b2-6cf3-441e-bb37-08af8a1a457b.jpeg)



<!-- 这是一张图片，ocr 内容为：[SPRINGCLOUD02.PPTX]POWERPOINT HTTP客户端FEIGN-快速入门 黑马程序员 WWW.THIMIMA.COM FEIGN的最佳实践: 让CONTROLLER和FEIGNCLIENT继承同一接口 总结 将FEIGNCLIENT,POJO,FEIGN的默认配置都定义到 一个项目中,供所有消费者使用 路 中国 幻灯片第39张,其69张 五Q朝 口中英 -->
![](https://cdn.nlark.com/yuque/0/2024/jpeg/43218187/1727141926720-9e8c76ba-fc5a-4b5c-bc5a-796862e5a510.jpeg)



<!-- 这是一张图片，ocr 内容为：[]收购[SPRINGCLOUD02.PPTXL-POWERPOINT HTTP客户端FEIGN 黑马程序员 WWW.ITHEIME.COM 抽取FEIGNCLIENT 实现最佳实践方式二的步骤如下: 1.首先创建一个MODULE,命名为FEIGN-API,然后引入FEIGN的STARTER依赖 2.将ORDER-SERVICE中编写的USERCLIENT.USER.DEFAULTFEIGNCONFIGNCONFIGN-APIGN-APIGN-APIGN-API项目中 3.在ORDER-SERVICE中引入FEIGN-API的依赖 4.修改ORDER-SERVICE中的所有与上述三个组件有关的IMPORT部分,改成导入FEIGN-API中的包 5.重启测试 四品 中 红灯片第40张,共71张 立RM -->
![](https://cdn.nlark.com/yuque/0/2024/jpeg/43218187/1727141932306-1808f029-510a-4314-bb41-13c4eed46b3c.jpeg)

#### 
---

---

---

---

---

---

---

---

---

---

---

---

