OOP面试对象编程:

<!-- 这是一张图片，ocr 内容为：面向对象编程(00P)的三个基本特征是:封装,继承,多态 封装:封装是对象和类概念的主要特性,封装,把客观事物封较成抽象的类,并且把自己的部分属性和方法提供给其他X 继承:面向对象编程(OOP)语言的一个主要功能就是"继承是指这样一种能力:它可以使用现有类的功能,并在要功能,并存 多态:允许将子类类型的指针赋值给父类类型的指针,同一个函数调用会有不同的执行效果 DART所有的东西都是对象-所有的对象都继承自OBJECT类. DART是一门使用类和单继承的面向对象语言,所有的对象都是类的实例,并且所有的类都是OBJECT的子类 一个类通常由属性和方法组成. 水 -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1732537571109-47649ba0-4159-4c31-8335-c17dc9b4a09d.png)

自定义类：

```dart
class Person{

  String name="zhangsan";

  int age = 23;

  void getInfo(){
    print("$name---$age");
    //或者
    print("${this.name} --- ${this.age}");
  }
}

void main(){
  var p1 = new Person();

  p1.name;

  Person p2 = new Person();
}
```

```dart
//演示封装
class Person{
  //无参与有参只可以定义一个，但是命名构造函数可以定义多个
  Person(){
    print("无参构造函数");
  }

  Person(String name, int age){
    print("有参构造函数");
    this.name = name;
    this.age = age;
  }
  //另类写法
  //Person(this.name, this.age);

  //命名构造函数,比如：new DateTime.now();
  Person.now(){
    print("命名构造函数");
  }

  Person.setInfo(String name){
    print("我是命名构造函数二号"+ name);
  }
  
  String name="zhangsan";

  int age = 23;

  void setAge(age){
    this.age = age;
  }

  int getAge(){
    return this.age;
  }
}

```



```dart
文件多了就分成多个，需要使用就使用
import 'lib/Person.dart';
这样就可以直接使用

Dart和其他面向对象的语言不一样，Data中没有public，private，protected这些
  访问权限修饰符，但是我们可以使用_把一个属性或者方法定义为私有
而且不仅要加_,并且要单独一个文件才行，如果跟main在一个文件中则无效
class Person{

  String _name;

  int _age;
}

```

除了私有属性之外，私有方法也是这样

<!-- 这是一张图片，ocr 内容为：() VOID RUN PRINT((这是一个私有方法'); EXECRUN() THIS. RUN( -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1732544532657-13cb4a85-77db-4f07-8602-d6ff0ba93a61.png)

计算属性：get和set

<!-- 这是一张图片，ocr 内容为：CLASS RECT{ HEIGHT; NUM NUM WIDTH; RECT(THIS.HEIGHT,THIS.WIDTH); GET AREAT RETURN THIS.HEIGHT*THIS.WIDTH; VOID MAIN()(  RECT REW RECT(10,4); //注意调用直接通过访问属性的方式访问AREA PRINT("面积:${R.AREA} 了 -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1732544860955-ad9548b1-7775-45ae-9c1a-b815929e9059.png)

<!-- 这是一张图片，ocr 内容为：CLASS RECT{ HEIGHT; NUM WIDTH; NUM RECT(THIS.HEIGHT,THIS.WIDTH); AREA RETURN THIS.HEIGHT*THIS.WIDTH; AREAHEIGHT(VALUE){ SET THIS.HEIGHTVALUE; VID MAIN()F  RECT REW RECT(10,4); // PRINT("面积:${R.AREA()}"); R.AREAHEIGHT2; -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1732544899772-f42c44d1-1fa6-42ab-87ab-12f4895243ab.png)



Dart中的类，静态成员，操作符，类的集成；

<!-- 这是一张图片，ocr 内容为：DART中的静态成员: 1,使用STATIC 关键字来实现类级别的变量和函数 2,静态方法不能访问非静态成员,非静态方法可以访问静态成员 CLASS PERSON 张三'; STATIC STRING 三 NAME VOID SHOW() PRINT(NAME) I MAIN()- VAR PNEW PERSON(); P.SHOW(); -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1732544967697-22c93a9c-e6f7-4a32-bf89-dfbeb1c8b15c.png)

**对象操作符：**

<!-- 这是一张图片，ocr 内容为：DART中的对象操作符: (了解) 条件运算符 类型转换 AS 类型判断 IS 级联操作 (连缀) CLASS PERSON STRING NAME; NUM AGE; PERSON(THIS.NAME,THIS.AGE); VOID PRINTINFO() { PRINT("${THIS.NAME}---${THIS.AGE}"); 了 MAIN()( -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1732545123820-298aac43-42cd-40e2-93a3-29f58268288b.png)

is的使用案例

<!-- 这是一张图片，ocr 内容为：PERSON PENEW PERSON('张三', 20); IF(P IS PERSON) P.NAME"李四"; P.PRINTINFO(); PRINT(P IS OBJECT); -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1732545182626-401f6571-d070-459b-b738-26db39fc6898.png)

as的使用案例:

<!-- 这是一张图片，ocr 内容为：VAR P1; TD P1-NEW PERSON('张三',20); // P1.PRINTINFO(); (P1 AS PERSON).PRINTINFO(); -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1732545223477-f7c2e9ea-138a-4fe6-b99e-6e4a1d2f92c3.png)

使用级联简化操作：

<!-- 这是一张图片，ocr 内容为：PERSON P1-NEW PERSON('张三1', 20); 二 //  P1.PRINTINFO(); P1.NAME:'张三222'; P1.AGE-40; 二 P1.PRINTINFO(); N P1-NEW PERSON('张三1', 20); PERSON P1.PRINTINFO(); 李四" P1..NAME ...AGE-30 PRINTINFO( -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1732545310881-16d66b1e-0f53-423f-8f5e-6fd97e3169b9.png)



**继承特性：**

<!-- 这是一张图片，ocr 内容为：面向对象的三大特性:封装,继承,多态 DART中的类的继承: 1,子类使用EXTENDS关键词来继承父类 2,子类会继承父类里面可见的属性和方法但是不会继承构造函数 3,子类能复写父类的方法GETTER和SETTER CLASS PERSON 张三'; STRING NAME- AGE20; NUM PRINTINFO() { VOID  PRINT("${THIS.NAME}---${THIS.AGE}"); MAIN()( -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1732545366316-8d085dbb-e86d-407d-926d-4d8570c5764b.png)

<!-- 这是一张图片，ocr 内容为：CLASS WEB EXTENDS PERSON{ SUPER(NAME, AGE){ WEB(STRING NAME,NUM AGE): 了 MAIN() // PERSON PENEW PERSON('李四',20);  // P.PRINTINFO(); 二 PERSON P1-NEW PERSON('张三',20);  // P1.PRINTINFO(); WNEWWEB(张三',12); WEB -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1732545408964-b5b41526-034f-4a3a-bb8b-0f829b5ff003.png)

抽象类：

<!-- 这是一张图片，ocr 内容为：DART中抽象类:DART抽象类主要用于定义标准,子类可以继承插象类,也可以实现抽象类接口. 1,抽象类通过ABSTRACT 关键字来定义 2,DART中的抽象方法不能用ABSTRACT声明,DART中没有方法体的方法我们称为抽象方法. 3,如果子类继承抽象类必须得实现里面的抽象方法 4,如果把抽象类当做接口实现的话必须得实现抽象类里面定义的所有属性和方法. 5,抽象类不能被实例化,只有继承它的子类可以 EXTENDS抽象类 和 IMPLEMENTS的区别: 1,如果要复用抽象类里面的方法,并且要用抽象方法约束自类的话我们就用EXTENDS继承抽象类 2,如果只是把抽象类当做标准的话我们就用IMPLEMENTS实现抽象类 案例:定义一个ANIMAL 类要求它的子类必须包含EAT方法 -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1732545532273-9871e83c-a67e-4252-8779-09acc1c466fc.png)<!-- 这是一张图片，ocr 内容为：ABSTRACT CLASS ANIMAL{ //抽象方法 EAT(); CLASS DOG EXTENDS ANIMAL{ @OVERRIDE EAT() { IMPLEMENT EAT // TODO: RETURN NULL; -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1732545595693-5015032f-5986-41c8-ab71-994bcc502cd6.png)



<!-- 这是一张图片，ocr 内容为：CLASS ANIMALL ABSTRACT EAT();  1/抽象方法 RUN();//抽象方法 PRINTINFO() PRINT('我是一个抽象类里面的普通方法'); CLASS DOG EXTENDS ANIMAL{ @OVERRIDE EAT(){ PRINT(小狗在吃骨头); I @OVERRIDE J ()UNJ //  TODO: /MPLEMENT RUN PRINT(小狗在跑); -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1732545696930-1af67874-7a09-412a-9412-246d1ac328b8.png)



<!-- 这是一张图片，ocr 内容为：DATR中的多态: 允许将子类类型的指针赋值给父类类型的指针,同一个函数调用会有不同的执行效果 子类的实例赋值给父类的引用. 多态就是父类定义一个方法不去实现,让继承他的子类去实现,每个子类有不同的表现. ABSTRACT CLASS ANIMAL{ 1/抽象方法 EAT(); RUN();//抽象方法 PRINTINFO()() PRINT('我是一个抽象类里面的普通方法'); CLASS DOG EXTENDS ANIMAL{ @OVERRIDE EAT() { PRINT(小狗在吃骨头'); -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1732545721995-a43d86e8-bc8f-43a0-9109-f889d2084a4d.png)



Dart的接口：

<!-- 这是一张图片，ocr 内容为：和JAVA一样,DART也有接口,但是和JAVA还是有区别的. 首先,DART的接口没有INTERFACE关键字定义接口,而是 通类或抽象类都可以作为接口被实现. 同样使用IMPLEMENTS关键字进行实现. 但是DANT的接口有点奇怪,如果实现的类是普通类,会将普通类和抽象中的属性的方法全部需要覆写一遍. 而因为抽象类可以定义抽象方法,普通类不可以,所以一般如果要实现像JAVA接口那样的方式,一般会使用抽 建议使用抽象类定义接口. 头 -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1732545778409-bc02bdab-430f-4ad0-b8e1-8260bd0745ad.png)

例子：

<!-- 这是一张图片，ocr 内容为：定义一个DB库支持MYSQL  MSSQL MONGODB MYSQLIMSSQL MONGODB三个类里面都有同样的方法 //当做接口  接口:就是约定 ,规范 ABSTRACT CLASS DB{ ADD(); (); SAVE DELETE -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1732545841015-04ff1959-0a48-48e4-beb3-609c211135dc.png)

<!-- 这是一张图片，ocr 内容为：CLASS MYSQL IMPLEMENTS DB{ @OVERRIDE ADD(){ // TODO: IMPLEMENT ADD RETURN NULL; @OVERRIDE DELETE IMP I // TODO: OLEMENT DELETE RETURN NULL; @OVERRIDE SAVE(){ // TODO IMPLEMENT SAVE RETURN NULL; -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1732545864554-998b7d3e-6e49-4cca-b60d-b7eb719b6edc.png)<!-- 这是一张图片，ocr 内容为：//当做接口  接口:就是约定,规范 ABSTRACT CLASS DB{ STRING URI; //数据库的链接地址 ADD(); SAVE DELETE(); CLASS MYSQL IMPLEMENTS DB{ @OVERRIDE STRING URI; @OVERRIDE ADD() { //  TODO:IMPLEMENT ADD RETURN NULL; @OVERRIDE DELETE() () () ( 二 IMPLEMENT DELETE TODO: -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1732545898029-f636c472-5446-462b-bbc3-8d1936910412.png)



Dart中一个类实现多个接口，以及Dart中的Minxins：

<!-- 这是一张图片，ocr 内容为：CLASS C IMPLEMENTS A,BR @OVERRIDE STRING NAME; @OVERRIDE PRINTA() { PRINTA PRINT @OVERRIDE PRINTB() // TODO: IMPLEMENT PRINTB NULL; RETURN -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1732546005713-a9306721-5e42-446f-8455-8dc6ccb25d80.png)



<!-- 这是一张图片，ocr 内容为：MIXINS的中文意思是混入,就是在类中混入其他功能. 在DART中可以使用MIXINS实现类似多继承的功能 因为MIXINS使用的条件,随着DART版本一直在变,这里讲的是DART2.X中使用MIXINS的条件: 1,作为MIXINS的类只能继承自OBJECT,不能继承其他类 2,作为MIXINS的类不能有构造函数 3,一个类可以MIXINS多个MIXINS类 4,MIXINS绝不是继承,也不是接口,而是一种全新的特性I /* -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1732546043369-44d94669-7a47-409c-b714-bed393cecf54.png)

<!-- 这是一张图片，ocr 内容为：CLASS A { VOID PRINTA() PRINT("A"); CLASS B { VOID PRINTB( B()G PRINT("B"); Y CLASS C WITH A,B{ 了 VOID MAIN() -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1732546080401-25e821b8-b31c-4e30-8a70-7095ce136061.png)



泛型，泛型方法，泛型类，泛型接口：

<!-- 这是一张图片，ocr 内容为：通俗理解:泛型就是解决类接口方法的复用性,以及对不特定数据类型的支持(类型校验) * -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1732546178226-706d8b7f-a3cf-4904-9b19-01d3b752b5f6.png)

<!-- 这是一张图片，ocr 内容为：//不指定类型放弃丁类型检查.我们现在想实现的是传入什么返回什么.比如;传入NUMBER类型必须这回NL GETDATA(T>(T VALUE)( RETURN VALUE; -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1732546221878-ab9161a8-bd12-4491-b166-81d462e8ab1e.png)

<!-- 这是一张图片，ocr 内容为：CLASS MYLIST<T>{ LIST LIST 三 <T>[]; VOID ADD(T VALUE) THIS.LIST.ADD(VALUE); GETLIST() { LIST RETURN LIST; RUN | DEBUG MAIN() { MYLIST L1NEW MYLIST(); 11.ADD("张三"); 11.ADD(12D; -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1732546264965-ae63b553-f97e-4da8-916a-60aa6df3f10b.png)



Dart中的库，自定义库，系统库，第三方库：

<!-- 这是一张图片，ocr 内容为：LIBRARY指令可以创建一个库,每个DART文件都是一个库,即使没有使用LIBRARY指令来指定. DART中的库主要有三种: 1,我们自定义的库 IMPORT 'LIB/XXX.DART'; 2,系统内置库 IMPORT 'DART:MATH'  IMPORT 'DART:IO'; IMPORT 'DART:CONVERT' 3,PUB包管理系统中的库 HTTPS://PUB.DEV/PACKAGES HTTPS://PUB.FLUTTER-IO.CN/PACKAGES HTTPS://PUB.DARTLANG.ORG/FLUTTER/ 1,需要在自己想项目根目录新建一个PUBSPEC.YAML 2,在PUBSPEC.YAML文件然后配置名称,描述,依赖等信息 3,然后运行 PUB GET 获取包下载到本地 4,项目中引入库 IMPORT 'PACKAGE:HTTP/HTTP.DART' AS HTTP;看文档使用 水厂 -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1732546360357-c2f5f7fd-e360-4203-a5e2-8f3fe73587b6.png)



比如自带的库

<!-- 这是一张图片，ocr 内容为：2  // IMPORT 'DART:IO'; IMPORT "DART:MATH"; MAIN() 5 6 PRINT(MIN(12,23)); 7 8 子 终病 调试控制台 15 黑狗 EXITED WITH CODE-0 IN 1.712 ONE] SE UNNING] DART "D:\DARTDEMO\DEMO13\02 ART -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1732546526083-e2b697dd-b0a0-44bd-b9a5-bd062e6aee64.png)



发请求的库

<!-- 这是一张图片，ocr 内容为：IMPORT 'DART:IO'; // IMPORT 'DART:CONVERT'; VOID MAIN() ASYNC{ VAR RESULT ; AWAIT _GETDATAFROMZHIHUAPI(); PRINT(RESULT); 子 /API接口:HTTP://NEWS-AT.ZHIHU.COM/API/3/STORIES/LATES/LATEST _GETDATAFROMZHIHUAPI() ASYNCT //1,创建HTTPCLIENT对象 VAR HTTPCLIENT - NEW HTTPCLIENT(); /2,创建URI对象 /API/3/STORIES/LATEST'); VARURI NEWURI.HTTP(HEWS-AT.ZHIHU.COM 1/3,发起请求,等待请求 VAR REQUEST - AWAIT HTTPCLIENT.GETURL(URI); /4,关闭请求,等待响应 VAR RESPONSE - AWAIT REQUEST.CLOSE(); //5,解码响应的内容 RETURN AWAIT RESPONSE.TRANSFORM(UTF8.DECODER).JOIN(); -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1732546571643-98238f02-7240-4fb0-84e4-65eaa2b78cac.png)

同步和异步：

<!-- 这是一张图片，ocr 内容为：ASYNC和AWAIT 这两个关键字的使用只需要记住两点: 只有ASYNC方法才能使用AWAIT关键字调用方法 如果调用别的ASYNC方法必须使用AWAIT关键字 I ASYNC是让方法变成异步. AWAIT是等待异步方法执行完成. 水 VOID MAIN() ASYNCF  AWAIT TESTASYNC(); VAR RESULT PRINT(RESULT); TESTASYNC() ASYNCF HELLO ASYNC' RETURN -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1732546616267-a1166df1-9a20-4d2b-a51d-63244cbb526f.png)

这样调用异步方法就会有问题：

<!-- 这是一张图片，ocr 内容为：VID MAIN()I 16 VAR RESULT - TESTASYND(); 17 PRINT(RESULT); 18 19 子 20 21 11异步方法 22 TESTASYNC() ASYNC{ 23 RETURN HELLO ASYNC'; 24 25 26 27 问题15输出调试控制台 [DONE] EXITED WITH CODE-0 IN 1.604 SECONDS "D:\DARTDEMO\DEMO13\04关于 [RUNNING] DART ASYNC AW 'FUTURE<DYNAMIC>' INSTANCE OF -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1732546660119-f14ea214-6bd2-4b48-bdb9-7e67beb3ecda.png)



<!-- 这是一张图片，ocr 内容为：VOID MAIN() 16 ASYNCF AWAIT TESTASYNC(); 17 VAR RESULT PRINT(RESULT); 18 19 20 21 11异步方法 22 TESTASYNC() 23 ASYNCT RETURN 'HELLO ASYNC'; 24 25 26 27 终端 问题 调试控制台 15 [DONE] EXITED WITH CODE-0 IN CODE-0IN 1.333 SECONDS [RUNNING] DA ] DART "D:\DARTDEMO\DEMO13\04关于 ASYNG HELLO ASYNC -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1732546691150-dd7dc0d1-5ad2-436f-951d-40e403671683.png)



<!-- 这是一张图片，ocr 内容为：PUB包管理系统中的 1,从下面网址找到要用的库 HTTPS://PUB.DEV/PACKAGES HTTPS://PUB.FLUTTER-IO.CN/PACKAGES HTTPS://PUB.DARTLANG.ORG/FLUTTER/ 2,创建一个PUBSPEC.YAML文件,内容如下 NAME:XXX DESCRIPTION: A NEW FLUTTER MODULE PROJECT. DEPENDENCIES: HTTP: 10.12.0+2 DATE FORMAT: 1.0.6 配置DEPENDENCIES 运行PUT GET获取远程库 5,看文档引入库使用 -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1732546794172-0832c340-2411-4592-9753-5f7f063234be.png)

前往：https://pub.dev/packages



<!-- 这是一张图片，ocr 内容为：INPORT DART:CONVERT' AS CONVERT; IMPORT TPACKAGE:HTTP/HTTP.DART AS HTTP; MAIN() ASYNC :"HTTP://WWW.PHONEGAP100.COM/APPAPI.PHP?A-GETPORTALLIST&CATID-208PAGE-1" VAR URL " 1/ AW AWAIT THE HTTP GET RESPONSE, THEN DECODE THE JSON-FORMATTED RESPONCE. RESPONSE AWAIT HTTP.GET(URL); VAR IF (RESPONSE.STATUSCODE 200) 三 CONVERT.JSONDECODE(RESPONSE.BODY); VAR JSONRESPONSE CON PRINT(JSONRESPONSE); ELSEF PRINT("REQUEST FAILED WITH STATUS: ${RESPONSE.STATUSCODE]. -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1732546959215-4f09b541-f9d2-4aec-9676-62aaf645a72c.png)



Dart2.13之后的一些新特性Null，safety，late关键字，空类型声明符？，非空断言！，required关键字：

<!-- 这是一张图片，ocr 内容为：NULL SAFETY翻译成中文的意思是空安全. NUIL SAFETY可以帮助开发着避免一些日常开发中很难被发现的错误,并且额外的好处是可以改善性能. FLUTTER2.2.0(2021年5月19日发布) 之后的版本都要求使用NULL SAFETY. ?可空类型 !类型断言 -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1732547110165-c8f69274-49ef-42e1-bd05-e1182831b7f7.png)



<!-- 这是一张图片，ocr 内容为："张三"; // STRING USERNAME:"张. // USERNAME-NULL; //A VALUE OF TYPE 'NULL' CAN'T BE ASSIGNED TO A VARIABLE OF TYPE 'STRI 表示USERNAME是一个可空类型 // STRING? USERNAME"张三 STRING? USERNAMENULL; -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1732547197909-dde8a390-d749-4a0f-a495-bf2facd43ec8.png)



<!-- 这是一张图片，ocr 内容为：INT?A-123; / INT?表示A是一个可空类型 A-NULL; PRINT(A); // LIST<STRING> 11:["张三","李四","王五"]; // LLFNULL; //A VALUE OF TYPE 'NULL' CAN'T BE ASSIGNED TO A VARIABLE OF TYPE 'LIST-STRING LIST<STRING>?11-["张三","李四","王五"]; 11-NULL; I -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1732547250131-d74b7663-c673-4af9-8ae9-6a9e3528b75a.png)



<!-- 这是一张图片，ocr 内容为：可空类型 类型断言 GETDATA(APIURL) STRING? IF(APIURL!NULL){ RETURN "THIS IS SERVER DATA"; 子 RETURN NULL; -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1732547326909-e328f67a-52b9-4f01-b6fb-a8899ae71ec1.png)

<!-- 这是一张图片，ocr 内容为：1/!类型断言  STRING? STR-"THIS IS STR"; STR-NULL; PRINT(STR!.LENGTH); -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1732547359791-fb1cdf08-8c2a-4992-9b20-8837c844fd00.png)

<!-- 这是一张图片，ocr 内容为：1/!类型断言 70 71 STRING? STR,"THIS IS STR"; 72 73 STR-NULL; 74 75 /类型断言:如果STR不等于NULL 会打印STR的长度,如果等于NUL1会抛出异常 PRINT(STR!.LENGTH); 76 77 可题27 终端 调试控制台 输出 CODE DONEJ EXITED WITH CODE-0 1N 0.535 SECONDS RUNNING] "D:\DARTDEMO\DEMO15\01 NULL SAFETY 以及可空类型 非空断言.DART" DART EXCEPTION: INHANDLED LULL CHECK OPERATOR USED ON A NULL VALUE (FILE://D://DARTDEMO/DEMO15/ MAIN 91%20NU118205AFETY%20XE4XBB%A5KES%8F%8AXE5K8F%AFKAFKE7KA9KBAZE7KBBXE5%9EXBBXBBXE9%E9%9EXE7%A9KBA35A3 66%A8%80.DART:76:12) (DART:ISOLATE-PATCH/ISOLATE_PATCH.DART:2811 DELAYENTRYPOINTINVOCATION.<ANONYMOUS CLOSURE> 2 (DART:ISOLATE-PATCH/ISOLATE PATCH.DART:184:12) RAWRECEIVEPORTIMPL._HANDLEMESSAGE -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1732547389335-c63393af-69d4-4a3d-b2bb-a4a14bb6657a.png)

<!-- 这是一张图片，ocr 内容为：PRINTLENGTH(STRING? STR){ VOID PRINT(STR!.LENGTH); -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1732547436378-002c24ff-de3a-47b8-8f35-3752e36c4de0.png)

<!-- 这是一张图片，ocr 内容为：LATE关键字主要用于延泥初始化. CLASS PERSON LATE STRING NAMEJ LATE INT AGE; SETNAME(STRING NAME,INT AGE){ VOID THIS.NAMENAME; THIS.AGE-AGE; STRING GETNAME(){ RETURN "${THIS.NAME}---${THIS.AGE}"; -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1732547485317-19e3cd8f-d752-4a3f-8687-1e8a8178d0db.png)



<!-- 这是一张图片，ocr 内容为：REQUIRED关键词: 最开始@REQUIRED是注解 现在它已经作为内置修饰符. 主要用于允许根据需要标记任何命名参数(函数或类),使得它们不为空.因为可选参数中必须有个 REQUIRE 水 STRING PRINTUSERINFO(STRING USERNAME, {REQUIRED INT AGE, REQUIRED STRING SEX)) (/行参 IF(AGE!0) -性别:$SEX--年龄:$AGE"; RETURN"姓名:$USERNAME -性别:$SEX--年龄保密"; RETURN"姓名:$USERNAME -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1732547562773-890a4d3c-2b09-4982-a04d-795b7988788e.png)

<!-- 这是一张图片，ocr 内容为：主要用于允许根据需要标记任何命名多数(西数或类),使得它们不为空.因为可选参数中必须有个REQUIRE STRING PRINTUSERINFO(STRING USERNAME, [REQUIRED INT AGE, REQUIRED STRING SEX)) (/行 IF(AGE!0){ "姓名:$USERNAME---性别:$SEX--年龄:$AGE"; RETURN 子 名:$USERNAME--性别:$SEX--年龄保密"; "姓名:实 RETURN -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1732547579744-95c57dd8-6dc7-4eb0-b463-6f41ee7f90cc.png)



Dart性能优化之常量，常量构造函数详解：

<!-- 这是一张图片，ocr 内容为：DART 常量:FINAL 和 CONST修饰符 CONST 声明的常量是在编译时确定的,永远不会改变 FINAL声明的常量允许声明后再赋值,赋值后不可改变,FINAL声明的变量是在运行时确定钻 FINAL不仅有CONST的编译时常量的特性,最重要的它是运行时常量,并且FINAL是惰性初始化 */ -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1732547714521-75df58ef-d622-4817-babd-51f32d052ba5.png)



