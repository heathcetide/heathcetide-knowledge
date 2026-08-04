# Maven实战

**1 Maven创建多模块工程参考**
**1.1)居然之家Maven多模块工程**


<!-- 这是一张图片，ocr 内容为： -->
!


**1.1.1）整个工程的父工程的pom**
tomahawk-boot工程的pom文件
主要定义的是，整个工程的Maven远程仓库，当然这些仓库是阿里云，以及一些插件， <font style="color:rgb(245, 34, 45);">有些插件我也不知道是怎么用的？</font><font style="color:rgb(0, 0, 0);">然后在这个工程上建立子工程。</font>
<font style="color:rgb(0, 0, 0);">可以在这个工程里定义整个工程的版本，如：</font> <version>${revision}</version>,其中的
${revision}为0.1.2-SNAPSHOT


```plain
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
 xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
 <modelVersion>4.0.0</modelVersion>

 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot</artifactId>
 <version>${revision}</version>
 <packaging>pom</packaging>
 <name>Tomahawk Boot</name>
 <description>Tomahawk Boot</description>

 <properties>
 <!-- Project revision -->
 <revision>0.1.2-SNAPSHOT</revision>
 <!-- Maven Plugin Versions -->
 <maven-compiler-plugin.version>3.8.1</maven-compiler-plugin.version>
 <!-- JUnit 5 requires Surefire version 2.22.0 or higher -->
 <maven-surefire-plugin.version>2.22.2</maven-surefire-plugin.version>
 <maven-source-plugin.version>3.2.1</maven-source-plugin.version>
 <maven-javadoc-plugin.version>3.1.1</maven-javadoc-plugin.version>
 <maven-gpg-plugin.version>3.0.1</maven-gpg-plugin.version>
 <flatten-maven-plugin.version>1.2.7</flatten-maven-plugin.version>
 <jacoco.version>0.8.5</jacoco.version>

 </properties>

 <modules>
 <module>tomahawk-build-tools</module>
 <module>tomahawk-boot-dependencies</module>
 <module>tomahawk-boot-parent</module>
 <module>tomahawk-boot-core</module>
 <module>tomahawk-boot-tools</module>
 <module>tomahawk-boot-governance</module>
 <module>tomahawk-boot-starters</module>
 </modules>

 <!-- 仓库地址 -->
 <repositories>
 <repository>
 <id>tomahawk-snapshots</id>
 <url>https://repo.rdc.aliyun.com/repository/112630-snapshot-JQxYHE/</url>
 <releases>
 <enabled>false</enabled>
 </releases>
 <snapshots>
 <enabled>true</enabled>
 </snapshots>
 </repository>
 <repository>
 <id>tomahawk-release</id>
 <url>https://repo.rdc.aliyun.com/repository/112630-release-1x7qc4/</url>
 <releases>
 <enabled>true</enabled>
 </releases>
 <snapshots>
 <enabled>false</enabled>
 </snapshots>
 </repository>
 </repositories>

 <!-- 产品发布地址 -->
 <distributionManagement>
 <snapshotRepository>
 <id>tomahawk-snapshots</id>
 <url>https://repo.rdc.aliyun.com/repository/112630-snapshot-JQxYHE/</url>
 </snapshotRepository>
 <repository>
 <id>tomahawk-releases</id>
 <url>https://repo.rdc.aliyun.com/repository/112630-release-1x7qc4/</url>
 </repository>
 </distributionManagement>
 <build>
 <plugins>
 <plugin>
 <groupId>org.codehaus.mojo</groupId>
 <artifactId>flatten-maven-plugin</artifactId>
 <version>1.1.0</version>
 <configuration>
 <!-- 是否更新pom文件，此处还有更高级的用法 -->
 <updatePomFile>true</updatePomFile>
 <flattenMode>resolveCiFriendliesOnly</flattenMode>
 </configuration>
 <executions>
 <execution>
 <id>flatten</id>
 <phase>process-resources</phase>
 <goals>
 <goal>flatten</goal>
 </goals>
 </execution>
 <execution>
 <id>flatten.clean</id>
 <phase>clean</phase>
 <goals>
 <goal>clean</goal>
 </goals>
 </execution>
 </executions>
 </plugin>
 <!-- 给文件头加版权信息 -->
 <plugin>
 <groupId>com.mycila</groupId>
 <artifactId>license-maven-plugin</artifactId>
 <version>2.3</version>
 <configuration>
 <header>license/header.txt</header>
 <headerDefinitions>
 <headerDefinition>license/tomahawk-header.xml</headerDefinition>
 </headerDefinitions>
 <properties>
 <owner>capgemini</owner>
 <email>zaichao.li@capgemini.com</email>
 </properties>
 <includes>
 <include>src/main/java/**/*.java</include>
 </includes>

 <!--排除文件-->
 <excludes>
 <exclude>**/*.properties</exclude>
 <exclude>*.sh</exclude>
 <exclude>*.yml</exclude>
 <exclude>.editorconfig</exclude>
 <exclude>.gitignore</exclude>
 <exclude>**/*.md</exclude>
 <exclude>**/*.xml</exclude>
 </excludes>
 </configuration>
 <executions>
 <execution>
 <goals>
 <goal>check</goal>
 </goals>
 </execution>
 </executions>
 <dependencies>
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-build-tools</artifactId>
 <version>${project.version}</version>
 </dependency>
 </dependencies>
 </plugin>
 </plugins>
 </build>


 <profiles>
 <profile>
 <id>dev</id>
 <properties>
 <!--profiles.active是自定义的字段（名字随便起），自定义字段可以有多个-->
 <profiles.active>local</profiles.active>
 </properties>
 <!--activation>
 <activeByDefault>true</activeByDefault>
 </activation-->

 <!-- 给文件头加版权信息 -->
 <build>
 <plugins>
 <plugin>
 <groupId>com.mycila</groupId>
 <artifactId>license-maven-plugin</artifactId>
 <version>2.3</version>
 <configuration>
 <header>license/header.txt</header>
 <headerDefinitions>
 <headerDefinition>license/tomahawk-header.xml</headerDefinition>
 </headerDefinitions>
 <properties>
 <owner>capgemini</owner>
 <email>zaichao.li@capgemini.com</email>
 </properties>
 <includes>
 <include>src/main/java/**/*.java</include>
 </includes>

 <!--排除文件-->
 <excludes>
 <exclude>**/*.properties</exclude>
 <exclude>*.sh</exclude>
 <exclude>*.yml</exclude>
 <exclude>.editorconfig</exclude>
 <exclude>.gitignore</exclude>
 <exclude>**/*.md</exclude>
 <exclude>**/*.xml</exclude>
 </excludes>
 </configuration>
 <executions>
 <execution>
 <goals>
 <goal>check</goal>
 </goals>
 </execution>
 </executions>
 <dependencies>
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-build-tools</artifactId>
 <version>0.1.2-SNAPSHOT</version>
 </dependency>
 </dependencies>
 </plugin>

 <plugin>
 <groupId>org.apache.maven.plugins</groupId>
 <artifactId>maven-pmd-plugin</artifactId>
 <version>3.11.0</version>
 <configuration>
 <skip>true</skip>
 <rulesets>
 <ruleset>rulesets/java/ali-comment.xml</ruleset>
 <ruleset>rulesets/java/ali-concurrent.xml</ruleset>
 <ruleset>rulesets/java/ali-constant.xml</ruleset>
 <ruleset>rulesets/java/ali-exception.xml</ruleset>
 <ruleset>rulesets/java/ali-flowcontrol.xml</ruleset>
 <ruleset>rulesets/java/ali-naming.xml</ruleset>
 <ruleset>rulesets/java/ali-oop.xml</ruleset>
 <ruleset>rulesets/java/ali-orm.xml</ruleset>
 <ruleset>rulesets/java/ali-other.xml</ruleset>
 <ruleset>rulesets/java/ali-set.xml</ruleset>
 </rulesets>
 <printFailingErrors>true</printFailingErrors>
 </configuration>
 <executions>
 <!-- 绑定pmd:check到verify生命周期 -->
 <execution>
 <id>pmd-check-verify</id>
 <phase>verify</phase>
 <goals>
 <goal>check</goal>
 </goals>
 </execution>
 <!-- 绑定pmd:pmd到site生命周期 -->
 <execution>
 <id>pmd-pmd-site</id>
 <phase>site</phase>
 <goals>
 <goal>pmd</goal>
 </goals>
 </execution>
 </executions>
 <!-- p3c依赖 -->
 <dependencies>
 <dependency>
 <groupId>com.alibaba.p3c</groupId>
 <artifactId>p3c-pmd</artifactId>
 <version>2.1.1</version>
 </dependency>
 </dependencies>
 </plugin>
 </plugins>
 </build>
 </profile>
 <profile>
 <id>capgemini</id>
 <properties>
 <profiles.active>prod</profiles.active>
 </properties>
 <!-- 给文件头加版权信息 -->
 <build>
 <plugins>
 <plugin>
 <groupId>com.mycila</groupId>
 <artifactId>license-maven-plugin</artifactId>
 <version>2.3</version>
 <configuration>
 <header>license/header.txt</header>
 <headerDefinitions>
 <headerDefinition>license/tomahawk-header.xml</headerDefinition>
 </headerDefinitions>
 <properties>
 <owner>capgemini</owner>
 <email>zaichao.li@capgemini.com</email>
 </properties>
 <includes>
 <include>src/main/java/**/*.java</include>
 </includes>

 <!--排除文件-->
 <excludes>
 <exclude>**/*.properties</exclude>
 <exclude>*.sh</exclude>
 <exclude>*.yml</exclude>
 <exclude>.editorconfig</exclude>
 <exclude>.gitignore</exclude>
 <exclude>**/*.md</exclude>
 <exclude>**/*.xml</exclude>
 </excludes>
 </configuration>
 <executions>
 <execution>
 <goals>
 <goal>check</goal>
 </goals>
 </execution>
 </executions>
 <dependencies>
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-build-tools</artifactId>
 <version>0.1.2-SNAPSHOT</version>
 </dependency>
 </dependencies>
 </plugin>

 <plugin>
 <groupId>org.apache.maven.plugins</groupId>
 <artifactId>maven-pmd-plugin</artifactId>
 <version>3.15.0</version>
 <configuration>
 <skip>false</skip>
 <rulesets>
 <ruleset>cagemini-rulesets/java/ali-comment.xml</ruleset>
 <ruleset>cagemini-rulesets/java/ali-concurrent.xml</ruleset>
 <ruleset>cagemini-rulesets/java/ali-constant.xml</ruleset>
 <ruleset>cagemini-rulesets/java/ali-exception.xml</ruleset>
 <ruleset>cagemini-rulesets/java/ali-flowcontrol.xml</ruleset>
 <ruleset>cagemini-rulesets/java/ali-naming.xml</ruleset>
 <ruleset>cagemini-rulesets/java/ali-oop.xml</ruleset>
 <ruleset>cagemini-rulesets/java/ali-orm.xml</ruleset>
 <ruleset>cagemini-rulesets/java/ali-other.xml</ruleset>
 <ruleset>cagemini-rulesets/java/ali-set.xml</ruleset>
 </rulesets>
 <printFailingErrors>true</printFailingErrors>
 </configuration>
 <executions>
 <!-- 绑定pmd:check到verify生命周期 -->
 <execution>
 <id>pmd-check-verify</id>
 <phase>deploy</phase>
 <goals>
 <goal>check</goal>
 </goals>
 </execution>
 <!-- 绑定pmd:pmd到site生命周期 -->
 <execution>
 <id>pmd-pmd-site</id>
 <phase>site</phase>
 <goals>
 <goal>pmd</goal>
 </goals>
 </execution>
 </executions>
 <!-- p3c依赖 -->
 <dependencies>
 <dependency>
 <groupId>com.alibaba.p3c</groupId>
 <artifactId>p3c-pmd</artifactId>
 <version>2.1.1</version>
 </dependency>
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-build-tools</artifactId>
 <version>0.1.2-SNAPSHOT</version>
 </dependency>

 </dependencies>
 </plugin>
 <plugin>
 <groupId>org.apache.maven.plugins</groupId>
 <artifactId>maven-site-plugin</artifactId>
 <version>3.7.1</version>
 <configuration>
 <locales>zh_CN</locales>
 </configuration>
 </plugin>
 <plugin>
 <groupId>org.apache.maven.plugins</groupId>
 <artifactId>maven-project-info-reports-plugin</artifactId>
 <version>3.0.0</version>
 </plugin>
 </plugins>
 </build>
 <reporting>
 <plugins>
 <plugin>
 <groupId>org.apache.maven.plugins</groupId>
 <artifactId>maven-pmd-plugin</artifactId>
 <version>3.15.0</version>
 </plugin>
 </plugins>
 </reporting>
 </profile>
 </profiles>
</project>
```

### <font style="color:#000000;">1.1.2)tomahawk-boot-dependencies和tomahawk-boot-parent模块</font>
 我们知道，用户创建的SpringBoot项目，需要引入SpringBoot的版本， 这个时候有两种方式定义项目SpringBoot的版本，一种是引入SpringBoot的Parent依赖，在这里定义版本， 还有一种方式是SpringBoot的dependencies的方式，因此居然的这个项目就创建了这两个子模块，这两个模块定义了一些开源的工具类、以及一些其他组件的版本， 用户在创建SpringBoot项目使用居然的依赖的，须引用这两个中的一个就可以了。

#### tomahawk-boot-dependencies的pom
主要是定义了开源的工具包、组件、以及自定义组件(比如:自定义的Starter)的版本

```plain
<project xmlns="http://maven.apache.org/POM/4.0.0"
 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
 xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
 <modelVersion>4.0.0</modelVersion>
 <parent>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot</artifactId>
 <version>${revision}</version>
 <relativePath>../pom.xml</relativePath>
 </parent>

 <artifactId>tomahawk-boot-dependencies</artifactId>
 <packaging>pom</packaging>

 <properties>
 <java.version>1.8</java.version>
 <maven.compiler.source>1.8</maven.compiler.source>
 <maven.compiler.target>1.8</maven.compiler.target>
 <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
 <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>

 <!-- Maven Plugin Versions -->
 <maven-source-plugin.version>3.2.1</maven-source-plugin.version>
 <maven-javadoc-plugin.version>3.1.1</maven-javadoc-plugin.version>
 <maven-gpg-plugin.version>3.0.1</maven-gpg-plugin.version>
 <flatten-maven-plugin.version>1.2.7</flatten-maven-plugin.version>


 <!-- Spring Boot -->
 <spring-cloud.version>2020.0.5</spring-cloud.version>
 <spring-cloud-alibaba.version>2021.1</spring-cloud-alibaba.version>
 <spring.boot.version>2.4.2</spring.boot.version>

 <sentinel-nacos.version>1.8.0</sentinel-nacos.version>
 <mockito.version>3.8.0</mockito.version>
 <springfox-swagger2.version>2.8.0</springfox-swagger2.version>
 <spring-boot-maven-plugin.version>2.0.1.RELEASE</spring-boot-maven-plugin.version>
 <maven-archetype-plugin.version>3.1.1</maven-archetype-plugin.version>
 <sonar-maven-plugin.version>2.4</sonar-maven-plugin.version>
 <mybatis-plus.version>3.4.0</mybatis-plus.version>
 <druid.version>1.2.4</druid.version>

 <mysql.version>8.0.18</mysql.version>
 <apache.commons-lang3.version>3.3.2</apache.commons-lang3.version>
 <jackson.version>2.9.9</jackson.version>
 <hamcrest.version>2.1</hamcrest.version>
 <jackson.version>2.10.2</jackson.version>
 <junit.version>4.13-beta-3</junit.version>
 <libraries-bom.version>13.2.0</libraries-bom.version>
 <maven-compiler-plugin.version>3.7.0</maven-compiler-plugin.version>
 <maven-exec-plugin.version>1.6.0</maven-exec-plugin.version>
 <maven-jar-plugin.version>3.0.2</maven-jar-plugin.version>
 <maven-shade-plugin.version>3.1.0</maven-shade-plugin.version>
 <maven-compiler-plugin.version>3.8.1</maven-compiler-plugin.version>
 <maven-resources-plugin.version>3.1.0</maven-resources-plugin.version>
 <maven-install-plugin.version>3.0.0-M1</maven-install-plugin.version>
 <maven-deploy-plugin.version>3.0.0-M1</maven-deploy-plugin.version>
 <maven-surefire-plugin.version>3.0.0-M5</maven-surefire-plugin.version>
 <jacoco-maven-plugin.version>0.8.5</jacoco-maven-plugin.version>
 <hutool.version>5.7.12</hutool.version>
 <lombok.version>1.18.10</lombok.version>
 <slf4j.version>1.7.25</slf4j.version>
 <logback-classic.version>1.2.3</logback-classic.version>
 <logback-core.version>1.2.3</logback-core.version>
 <pinyin4j.version>5.7.12</pinyin4j.version>
 <junit.jupiter.version>5.6.2</junit.jupiter.version>
 <junit.platform.version>1.3.1</junit.platform.version>
 <testng.version>6.9.13.6</testng.version>
 <commons-io.version>2.5</commons-io.version>
 <version.testcontainers>1.14.3</version.testcontainers>
 <ynamic.datasource.version>3.0.0</ynamic.datasource.version>
 <druid.spring.version>1.1.23</druid.spring.version>
 <seata.version>1.4.1</seata.version>
 <oss.version>3.8.1</oss.version>
 <s3.version>1.11.656</s3.version>
 <easyexcel.version>3.0.5</easyexcel.version>
 <xxjob.version>2.3.0</xxjob.version>
 <dozer.version>6.5.2</dozer.version>
 <aliyun-sms.version>2.0.6</aliyun-sms.version>
 <httpclient.version>4.5.3</httpclient.version>
 <dingtalk.version>1.0.1</dingtalk.version>
 <spring-cloud-context.version>3.0.5</spring-cloud-context.version>
 <validator.version>6.1.5.Final</validator.version>
 <alibaba.fastjson.version>1.2.68</alibaba.fastjson.version>
 </properties>

 <organization>
 <name>战斧</name>
 </organization>

 <dependencyManagement>
 <dependencies>
 <!-- =============================================================================================== -->
 <!-- ======================= tomahawk dependencies ======================= -->
 <!-- =============================================================================================== -->
 <!-- 核心包 -->
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-core</artifactId>
 <version>${revision}</version>
 </dependency>
 <!-- 工具包 -->
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-tools</artifactId>
 <version>${revision}</version>
 </dependency>
 <!-- 构建包 -->
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-build-tools</artifactId>
 <version>${revision}</version>
 </dependency>
 <!-- starters -->
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-starter</artifactId>
 <version>${revision}</version>
 </dependency>
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-starters</artifactId>
 <version>${revision}</version>
 </dependency>
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-starter-api</artifactId>
 <version>${revision}</version>
 </dependency>
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-starter-business</artifactId>
 <version>${revision}</version>
 </dependency>
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-starter-cache</artifactId>
 <version>${revision}</version>
 </dependency>
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-starter-db</artifactId>
 <version>${revision}</version>
 </dependency>
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-starter-excel</artifactId>
 <version>${revision}</version>
 </dependency>
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-starter-exception</artifactId>
 <version>${revision}</version>
 </dependency>
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-starter-filter</artifactId>
 <version>${revision}</version>
 </dependency>
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-starter-i18n</artifactId>
 <version>${revision}</version>
 </dependency>
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-starter-i18n-core</artifactId>
 <version>${revision}</version>
 </dependency>
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-starter-i18n-handler</artifactId>
 <version>${revision}</version>
 </dependency>
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-starter-job</artifactId>
 <version>${revision}</version>
 </dependency>
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-starter-log</artifactId>
 <version>${revision}</version>
 </dependency>
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-starter-message</artifactId>
 <version>${revision}</version>
 </dependency>
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-starter-mongodb</artifactId>
 <version>${revision}</version>
 </dependency>
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-starter-mq</artifactId>
 <version>${revision}</version>
 </dependency>
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-starter-nacos</artifactId>
 <version>${revision}</version>
 </dependency>
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-starter-open</artifactId>
 <version>${revision}</version>
 </dependency>
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-starter-oss</artifactId>
 <version>${revision}</version>
 </dependency>
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-starter-redisson</artifactId>
 <version>${revision}</version>
 </dependency>
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-starter-request</artifactId>
 <version>${revision}</version>
 </dependency>
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-starter-search</artifactId>
 <version>${revision}</version>
 </dependency>
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-starter-security</artifactId>
 <version>${revision}</version>
 </dependency>
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-starter-security-aop</artifactId>
 <version>${revision}</version>
 </dependency>
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-starter-security-api</artifactId>
 <version>${revision}</version>
 </dependency>
 <!--<dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-starter-security-auth</artifactId>
 <version>${revision}</version>
 </dependency>-->
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-starter-security-sdk-hmac</artifactId>
 <version>${revision}</version>
 </dependency>
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-starter-security-sdk-rsa</artifactId>
 <version>${revision}</version>
 </dependency>
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-starter-security-xss</artifactId>
 <version>${revision}</version>
 </dependency>
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-starter-sentinel</artifactId>
 <version>${revision}</version>
 </dependency>
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-starter-sign</artifactId>
 <version>${revision}</version>
 </dependency>
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-starter-swagger</artifactId>
 <version>${revision}</version>
 </dependency>
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-starter-tenant</artifactId>
 <version>${revision}</version>
 </dependency>
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-starter-test</artifactId>
 <version>${revision}</version>
 </dependency>
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-starter-transaction</artifactId>
 <version>${revision}</version>
 </dependency>
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-starter-uid</artifactId>
 <version>${revision}</version>
 </dependency>
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-starter-uid-api</artifactId>
 <version>${revision}</version>
 </dependency>
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-starter-uid-client</artifactId>
 <version>${revision}</version>
 </dependency>
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-starter-uid-generator</artifactId>
 <version>${revision}</version>
 </dependency>
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-starter-uid-worker</artifactId>
 <version>${revision}</version>
 </dependency>
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-starter-web</artifactId>
 <version>${revision}</version>
 </dependency>
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-starter-websocket</artifactId>
 <version>${revision}</version>
 </dependency>

 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-starter-security-spring</artifactId>
 <version>${revision}</version>
 </dependency>

 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-starter-security-user</artifactId>
 <version>${revision}</version>
 </dependency>

 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-starter-datascope</artifactId>
 <version>${revision}</version>
 </dependency>
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-starter-datapolicy</artifactId>
 <version>${revision}</version>
 </dependency>

 <!-- =============================================================================================== -->
 <!-- ======================= third part dependencies ======================= -->
 <!-- =============================================================================================== -->
 <!-- swagger2 -->
 <dependency>
 <groupId>io.springfox</groupId>
 <artifactId>springfox-swagger2</artifactId>
 <version>${springfox-swagger2.version}</version>
 </dependency>
 <dependency>
 <groupId>io.swagger</groupId>
 <artifactId>swagger-annotations</artifactId>
 <version>1.5.14</version>
 </dependency>
 <dependency>
 <groupId>io.swagger</groupId>
 <artifactId>swagger-models</artifactId>
 <version>1.5.14</version>
 </dependency>
 <dependency>
 <groupId>io.springfox</groupId>
 <artifactId>springfox-spi</artifactId>
 <version>2.8.0</version>
 </dependency>
 <dependency>
 <groupId>io.springfox</groupId>
 <artifactId>springfox-schema</artifactId>
 <version>2.8.0</version>
 </dependency>
 <dependency>
 <groupId>io.springfox</groupId>
 <artifactId>springfox-swagger-common</artifactId>
 <version>2.8.0</version>
 </dependency>
 <dependency>
 <groupId>io.springfox</groupId>
 <artifactId>springfox-spring-web</artifactId>
 <version>2.8.0</version>
 </dependency>
 <dependency>
 <groupId>com.google.guava</groupId>
 <artifactId>guava</artifactId>
 <version>20.0</version>
 </dependency>
 <dependency>
 <groupId>org.springframework.security.oauth</groupId>
 <artifactId>spring-security-oauth2</artifactId>
 <version>2.3.4.RELEASE</version>
 </dependency>
 <!-- hutool -->
 <dependency>
 <groupId>cn.hutool</groupId>
 <artifactId>hutool-all</artifactId>
 <version>${hutool.version}</version>
 </dependency>
 <dependency>
 <groupId>com.alibaba</groupId>
 <artifactId>druid</artifactId>
 <version>${druid.version}</version>
 </dependency>
 <dependency>
 <groupId>org.junit</groupId>
 <artifactId>junit-bom</artifactId>
 <version>${junit.jupiter.version}</version>
 <type>pom</type>
 <scope>import</scope>
 </dependency>
 <dependency>
 <groupId>org.testcontainers</groupId>
 <artifactId>testcontainers-bom</artifactId>
 <version>${version.testcontainers}</version>
 <type>pom</type>
 <scope>import</scope>
 </dependency>
 <!-- mysql -->
 <dependency>
 <groupId>mysql</groupId>
 <artifactId>mysql-connector-java</artifactId>
 <version>${mysql.version}</version>
 </dependency>
 <dependency>
 <groupId>org.apache.commons</groupId>
 <artifactId>commons-lang3</artifactId>
 <version>${apache.commons-lang3.version}</version>
 </dependency>
 <dependency>
 <groupId>com.baomidou</groupId>
 <artifactId>mybatis-plus-boot-starter</artifactId>
 <version>${mybatis-plus.version}</version>
 </dependency>
 <dependency>
 <groupId>com.baomidou</groupId>
 <artifactId>mybatis-plus</artifactId>
 <version>${mybatis-plus.version}</version>
 </dependency>
 <dependency>
 <groupId>com.baomidou</groupId>
 <artifactId>mybatis-plus-extension</artifactId>
 <version>${mybatis-plus.version}</version>
 </dependency>
 <dependency>
 <groupId>com.baomidou</groupId>
 <artifactId>mybatis-plus-generator</artifactId>
 <version>${mybatis-plus.version}</version>
 </dependency>
 <dependency>
 <groupId>junit</groupId>
 <artifactId>junit</artifactId>
 <version>${junit.version}</version>
 </dependency>
 <dependency>
 <groupId>org.mockito</groupId>
 <artifactId>mockito-all</artifactId>
 <version>1.9.5</version>
 <scope>test</scope>
 </dependency>
 <dependency>
 <groupId>org.mockito</groupId>
 <artifactId>mockito-core</artifactId>
 <version>${mockito.version}</version>
 <scope>test</scope>
 </dependency>
 <!-- Lombok -> Java annotation library which helps to reduce boilerplate code. -->
 <dependency>
 <groupId>org.projectlombok</groupId>
 <artifactId>lombok</artifactId>
 <version>${lombok.version}</version>
 </dependency>
 <!-- Slf4j + logback -->
 <dependency>
 <groupId>org.slf4j</groupId>
 <artifactId>slf4j-api</artifactId>
 <version>${slf4j.version}</version>
 </dependency>
 <dependency>
 <groupId>ch.qos.logback</groupId>
 <artifactId>logback-classic</artifactId>
 <version>${logback-classic.version}</version>
 </dependency>
 <dependency>
 <groupId>ch.qos.logback</groupId>
 <artifactId>logback-core</artifactId>
 <version>${logback-core.version}</version>
 </dependency>
 <!-- pingyin -->
 <dependency>
 <groupId>com.belerweb</groupId>
 <artifactId>pinyin4j</artifactId>
 <version>2.5.0</version>
 </dependency>
 <!--dynamic datasource begin-->
 <dependency>
 <groupId>com.baomidou</groupId>
 <artifactId>dynamic-datasource-spring-boot-starter</artifactId>
 <version>${ynamic.datasource.version}</version>
 </dependency>
 <!--druid begin-->
 <dependency>
 <groupId>com.alibaba</groupId>
 <artifactId>druid-spring-boot-starter</artifactId>
 <version>${druid.spring.version}</version>
 </dependency>
 <!-- easyExcel -->
 <dependency>
 <groupId>com.alibaba</groupId>
 <artifactId>easyexcel</artifactId>
 <version>${easyexcel.version}</version>
 </dependency>
 <!-- xxl-job-core -->
 <dependency>
 <groupId>com.xuxueli</groupId>
 <artifactId>xxl-job-core</artifactId>
 <version>${xxjob.version}</version>
 </dependency>
 <!--object store by aliyun oss begin-->
 <dependency>
 <groupId>com.aliyun.oss</groupId>
 <artifactId>aliyun-sdk-oss</artifactId>
 <version>${oss.version}</version>
 </dependency>
 <!--object store by aws oss begin-->
 <dependency>
 <groupId>com.amazonaws</groupId>
 <artifactId>aws-java-sdk-s3</artifactId>
 <version>${s3.version}</version>
 </dependency>
 <!--distributed transaction by seata begin-->
 <dependency>
 <groupId>io.seata</groupId>
 <artifactId>seata-spring-boot-starter</artifactId>
 <version>${seata.version}</version>
 </dependency>
 <dependency>
 <groupId>com.github.dozermapper</groupId>
 <artifactId>dozer-core</artifactId>
 <version>${dozer.version}</version>
 </dependency>
 <dependency>
 <groupId>com.aliyun</groupId>
 <artifactId>dysmsapi20170525</artifactId>
 <version>${aliyun-sms.version}</version>
 </dependency>
 <dependency>
 <groupId>org.apache.httpcomponents</groupId>
 <artifactId>httpclient</artifactId>
 <version>${httpclient.version}</version>
 </dependency>
 <!--钉钉api -->
 <dependency>
 <groupId>com.aliyun</groupId>
 <artifactId>alibaba-dingtalk-service-sdk</artifactId>
 <version>${dingtalk.version}</version>
 </dependency>
 <!--配置文件动态刷新 -->
 <dependency>
 <groupId>org.springframework.cloud</groupId>
 <artifactId>spring-cloud-context</artifactId>
 <version>${spring-cloud-context.version}</version>
 </dependency>
 <dependency>
 <groupId>org.hibernate.validator</groupId>
 <artifactId>hibernate-validator</artifactId>
 <version>${validator.version}</version>
 </dependency>

 <!--JWT解析库-->
 <dependency>
 <groupId>com.nimbusds</groupId>
 <artifactId>nimbus-jose-jwt</artifactId>
 <version>8.16</version>
 </dependency>

 <dependency>
 <groupId>com.alibaba</groupId>
 <artifactId>fastjson</artifactId>
 <version>${alibaba.fastjson.version}</version>
 </dependency>

 <dependency>
 <groupId>org.redisson</groupId>
 <artifactId>redisson</artifactId>
 <version>3.12.3</version>
 </dependency>

 <dependency>
 <groupId>org.owasp.esapi</groupId>
 <artifactId>esapi</artifactId>
 <version>2.4.0.0</version>
 </dependency>
 <dependency>
 <groupId>org.jsoup</groupId>
 <artifactId>jsoup</artifactId>
 <version>1.13.1</version>
 </dependency>
 <dependency>
 <groupId>org.apache.velocity</groupId>
 <artifactId>velocity-engine-core</artifactId>
 <version>2.1</version>
 </dependency>

 <dependency>
 <groupId>com.alibaba.csp</groupId>
 <artifactId>sentinel-logging-slf4j</artifactId>
 <version>1.8.0</version>
 </dependency>
 <dependency>
 <groupId>com.github.xiaoymin</groupId>
 <artifactId>knife4j-spring-ui</artifactId>
 <version>2.0.9</version>
 </dependency>

 <!-- =============================================================================================== -->
 <!-- ======================= spring dependencies ======================= -->
 <!-- =============================================================================================== -->
 <!-- Spring Boot -->
 <dependency>
 <groupId>org.springframework.boot</groupId>
 <artifactId>spring-boot-dependencies</artifactId>
 <version>${spring.boot.version}</version>
 <type>pom</type>
 <scope>import</scope>
 </dependency>
 <!-- Spring Cloud -->
 <dependency>
 <groupId>org.springframework.cloud</groupId>
 <artifactId>spring-cloud-dependencies</artifactId>
 <version>${spring-cloud.version}</version>
 <type>pom</type>
 <scope>import</scope>
 </dependency>
 <!-- Spring Cloud Alibaba -->
 <dependency>
 <groupId>com.alibaba.cloud</groupId>
 <artifactId>spring-cloud-alibaba-dependencies</artifactId>
 <version>${spring-cloud-alibaba.version}</version>
 <type>pom</type>
 <scope>import</scope>
 </dependency>
 <!--<dependency>
 <groupId>com.alibaba</groupId>
 <artifactId>dubbo-dependencies-bom</artifactId>
 <version>2.6.4</version>
 <type>pom</type>
 <scope>import</scope>
 </dependency>-->

 </dependencies>
 </dependencyManagement>

 <build>
 <pluginManagement>
 <plugins>
 <!-- =============================================================================================== -->
 <!-- ======================= tomahawk plugins ======================= -->
 <!-- =============================================================================================== -->
 <!-- 构建包 -->
 <plugin>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-build-tools</artifactId>
 <version>${revision}</version>
 </plugin>
 <!-- =============================================================================================== -->
 <!-- ======================= third parts plugins ======================= -->
 <!-- =============================================================================================== -->
 <plugin>
 <groupId>org.codehaus.mojo</groupId>
 <artifactId>flatten-maven-plugin</artifactId>
 <version>1.1.0</version>
 </plugin>
 <!-- 给文件头加版权信息 -->
 <plugin>
 <groupId>com.mycila</groupId>
 <artifactId>license-maven-plugin</artifactId>
 <version>2.3</version>
 </plugin>
 <plugin>
 <groupId>org.apache.maven.plugins</groupId>
 <artifactId>maven-jxr-plugin</artifactId>
 <version>3.2.0</version>
 </plugin>
 <plugin>
 <groupId>org.apache.maven.plugins</groupId>
 <artifactId>maven-release-plugin</artifactId>
 <version>2.5.3</version>
 </plugin>
 <plugin>
 <groupId>org.springframework.boot</groupId>
 <artifactId>spring-boot-maven-plugin</artifactId>
 <version>2.6.7</version>
 </plugin>
 <plugin>
 <groupId>org.flywaydb</groupId>
 <artifactId>flyway-maven-plugin</artifactId>
 <version>5.2.4</version>
 </plugin>
 <plugin>
 <groupId>org.apache.maven.plugins</groupId>
 <artifactId>maven-surefire-plugin</artifactId>
 <version>2.22.0</version>
 </plugin>
 <plugin>
 <groupId>org.apache.maven.plugins</groupId>
 <artifactId>maven-project-info-reports-plugin</artifactId>
 <version>3.0.0</version>
 </plugin>
 <plugin>
 <groupId>org.apache.maven.plugins</groupId>
 <artifactId>maven-site-plugin</artifactId>
 <version>3.7.1</version>
 </plugin>
 <!--检测代码覆盖率的插件jacoco-->
 <plugin>
 <groupId>org.jacoco</groupId>
 <artifactId>jacoco-maven-plugin</artifactId>
 <version>0.8.5</version>
 </plugin>
 <!-- 使用 maven-surefire-plugin来执行单元测试。将surefireArgLine赋值给argLine参数，以保证在测试执行时Jacoco agent处于运行状态。 -->
 <plugin>
 <groupId>org.apache.maven.plugins</groupId>
 <artifactId>maven-surefire-plugin</artifactId>
 <version>2.16</version>
 </plugin>
 </plugins>
 </pluginManagement>
 </build>
</project>
```

#### tomahawk-boot-parent的pom
 在这个工程中，其实还是依赖tomahawk-boot-dependencies工程，并且定义了阿里云Maven远程仓库的地址，这样可以变更版本之后提供给用户使用。

```plain
<!-- Copyright 2020-2020 The Reachauto Authors -->
<project xmlns="http://maven.apache.org/POM/4.0.0"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>

	<parent>
		<groupId>com.tomahawk.boot</groupId>
		<artifactId>tomahawk-boot-dependencies</artifactId>
		<version>${revision}</version>
		<relativePath>../tomahawk-boot-dependencies</relativePath>
	</parent>

	<artifactId>tomahawk-boot-parent</artifactId>
	<description>tomahawk parent</description>
	<packaging>pom</packaging>
	<inceptionYear>2022</inceptionYear>

	<licenses>
		<license>
			<name>Tomahawk License</name>
			<comments>Copyright (c) 2022, easyhome All rights reserved.</comments>
		</license>
	</licenses>

	<properties>
		<main.basedir>${project.basedir}/..</main.basedir>
		<java.version>1.8</java.version>
		<maven.compiler.source>1.8</maven.compiler.source>
		<maven.compiler.target>1.8</maven.compiler.target>
		<project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
		<project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
	</properties>

	<organization>
		<name>战斧</name>
	</organization>

	<dependencyManagement>
		<dependencies>
		</dependencies>
	</dependencyManagement>

	<profiles>
		<profile>
			<id>tomahawk</id>
			<properties>
				<altReleaseDeploymentRepository>
					tomahawk-releases::default::https://packages.aliyun.com/maven/repository/112630-release-1x7qc4/
				</altReleaseDeploymentRepository>
				<altSnapshotDeploymentRepository>
					tomahawk-snapshots::default::https://packages.aliyun.com/maven/repository/112630-snapshot-JQxYHE/
				</altSnapshotDeploymentRepository>
			</properties>
			<repositories>
				<repository>
					<id>central</id>
					<url>https://maven.aliyun.com/nexus/content/groups/public</url>
					<releases>
						<enabled>true</enabled>
					</releases>
					<snapshots>
						<enabled>false</enabled>
					</snapshots>
				</repository>
				<repository>
					<id>snapshots</id>
					<url>https://maven.aliyun.com/nexus/content/groups/public</url>
					<releases>
						<enabled>false</enabled>
					</releases>
					<snapshots>
						<enabled>true</enabled>
					</snapshots>
				</repository>
				<repository>
					<id>tomahawk-releases</id>
					<url>https://packages.aliyun.com/maven/repository/112630-release-1x7qc4/</url>
					<releases>
						<enabled>true</enabled>
					</releases>
					<snapshots>
						<enabled>false</enabled>
					</snapshots>
				</repository>
				<repository>
					<id>tomahawk-snapshots</id>
					<url>https://packages.aliyun.com/maven/repository/112630-snapshot-JQxYHE/</url>
					<releases>
						<enabled>false</enabled>
					</releases>
					<snapshots>
						<enabled>true</enabled>
					</snapshots>
				</repository>
			</repositories>
			<pluginRepositories>
				<pluginRepository>
					<id>central</id>
					<url>https://maven.aliyun.com/nexus/content/groups/public</url>
					<releases>
						<enabled>true</enabled>
					</releases>
					<snapshots>
						<enabled>false</enabled>
					</snapshots>
				</pluginRepository>
				<pluginRepository>
					<id>snapshots</id>
					<url>https://maven.aliyun.com/nexus/content/groups/public</url>
					<releases>
						<enabled>false</enabled>
					</releases>
					<snapshots>
						<enabled>true</enabled>
					</snapshots>
				</pluginRepository>
				<pluginRepository>
					<id>tomahawk-releases</id>
					<url>https://packages.aliyun.com/maven/repository/112630-release-1x7qc4/</url>
					<releases>
						<enabled>true</enabled>
					</releases>
					<snapshots>
						<enabled>false</enabled>
					</snapshots>
				</pluginRepository>
				<pluginRepository>
					<id>tomahawk-snapshots</id>
					<url>https://packages.aliyun.com/maven/repository/112630-snapshot-JQxYHE/</url>
					<releases>
						<enabled>false</enabled>
					</releases>
					<snapshots>
						<enabled>true</enabled>
					</snapshots>
				</pluginRepository>
			</pluginRepositories>
		</profile>
	</profiles>
</project>
```

用户使用依赖的方式

```plain
方法1：直接父类集成脚手架
<parent>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-parent</artifactId>
 <version>0.1.2-SNAPSHOT</version>
</parent>

方法2：引入脚手架dependencies

<dependencyManagement>
 <dependencies>
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-dependencies</artifactId>
 <version>0.1.2-SNAPSHOT</version>
 <type>pom</type>
 <scope>import</scope>
 </dependency>
 </dependencies>
</dependencyManagement>
注释：引入成功后，方可使用脚手架的模块

## 模块引入说明
方法1：直接引入starter总模块（*引入该模块可以使用所有插件，不需要单个引入）
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-starter</artifactId>
 </dependency>

方法2：单个引入脚手架子模块（*根据自己需求引入需要的模块）
 <dependencys>
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-starter-log</artifactId>
 </dependency>
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-starter-db</artifactId>
 </dependency>
 </dependencys>


```

**1.1.3）tomahawk-boot-core工程**
这个工程主要定义的是一些项目中通用的代码，比如：一些常量、工具类、异常等等
给其他的模块、特别是自定义的Starter模块里使用


<!-- 这是一张图片，ocr 内容为： -->
!


**tomahawk-boot-core的pom文件**


```plain
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
 xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
 <modelVersion>4.0.0</modelVersion>

 <parent>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-boot-parent</artifactId>
 <version>${revision}</version>
 <relativePath>../tomahawk-boot-parent</relativePath>
 </parent>

 <artifactId>tomahawk-boot-core</artifactId>
 <description>战斧脚手架</description>
 <packaging>jar</packaging>

 <dependencies>
 <!-- springframework -->
 <dependency>
 <groupId>org.springframework.boot</groupId>
 <artifactId>spring-boot-autoconfigure</artifactId>
 </dependency>
 <dependency>
 <groupId>org.springframework</groupId>
 <artifactId>spring-context</artifactId>
 </dependency>
 <!-- lombok -->
 <dependency>
 <groupId>io.swagger</groupId>
 <artifactId>swagger-annotations</artifactId>
 </dependency>
 <dependency>
 <groupId>io.swagger</groupId>
 <artifactId>swagger-models</artifactId>
 </dependency>
 <!-- jackson -->
 <dependency>
 <groupId>com.fasterxml.jackson.core</groupId>
 <artifactId>jackson-databind</artifactId>
 </dependency>
 <dependency>
 <groupId>com.fasterxml.jackson.datatype</groupId>
 <artifactId>jackson-datatype-jdk8</artifactId>
 </dependency>
 <dependency>
 <groupId>com.fasterxml.jackson.datatype</groupId>
 <artifactId>jackson-datatype-jsr310</artifactId>
 </dependency>
 <dependency>
 <groupId>com.fasterxml.jackson.module</groupId>
 <artifactId>jackson-module-parameter-names</artifactId>
 </dependency>
 <!-- lombok -->
 <dependency>
 <groupId>org.projectlombok</groupId>
 <artifactId>lombok</artifactId>
 </dependency>
 <!-- junit -->
 <dependency>
 <groupId>org.junit.vintage</groupId>
 <artifactId>junit-vintage-engine</artifactId>
 </dependency>
 <dependency>
 <groupId>org.junit.jupiter</groupId>
 <artifactId>junit-jupiter</artifactId>
 <scope>test</scope>
 </dependency>
 </dependencies>
</project>

```

[1万字拿下Maven的核心概念和最佳实战](https://mp.weixin.qq.com/s/6-Og_SV3Daq7Z8boMWuHcw)

[使用 Idea 搭建 Spring boot Maven 多模块父子工程](https://liren.blog.csdn.net/article/details/107180225)


# Maven的常用命令
**<font style="color:rgb(77, 77, 77);">1 跳过测试打包命令</font>**
<font style="color:rgba(0, 0, 0, 0.75);"> mvn clean install -Dmaven.test.skip=true</font>
<font style="color:rgb(34, 34, 34);"> mvn clean install -DskipTests=true -Dcheckstyle.skip=true</font>


[Maven常见命令](https://www.cnblogs.com/yoyo1216/p/14518792.html)


# Maven项目的配置


**1 插件配置**

```plain
<build>
 <finalName>${project.artifactId}</finalName>
 <plugins>
 <plugin>
 <groupId>org.springframework.boot</groupId>
 <artifactId>spring-boot-maven-plugin</artifactId>
 <version>2.3.3.RELEASE</version>
 </plugin>
 <plugin>
 <groupId>com.spotify</groupId>
 <artifactId>dockerfile-maven-plugin</artifactId>
 <version>1.4.13</version>
 <configuration>
 <skip>false</skip>
 <repository>${project.artifactId}</repository>
 </configuration>
 </plugin>
 </plugins>
</build>
```

# Maven的插件dockerfile-maven-plugin


**1，简单介绍**
<font style="color:rgb(77, 77, 77);">正常情况下，我们在开发了一个应用程序后，会使用</font>[maven](https://so.csdn.net/so/search?q=maven&spm=1001.2101.3001.7020)<font style="color:rgb(77, 77, 77);">进行打包，生成对应的jar文件。而后，会使用docker将jar文件build成一个镜像（docker image）。之后，就可以在docker daemon中创建基于镜像的容器，并可提供服务了,dockerfile-maven-plugin 插件可以在项目构建的时候自动生成镜像，也可以自动将生成的镜像push到指定的镜像库。</font>


<font style="color:rgb(77, 77, 77);">参考:</font>
[maven插件dockerfile-maven-plugin简单介绍](https://blog.csdn.net/hzgaoshichao/article/details/124136458)


# Maven插件spring-boot-maven-plugin

[官网](https://docs.spring.io/spring-boot/docs/2.2.1.RELEASE/maven-plugin/index.html)
**1 插件简介**
<font style="color:rgb(77, 77, 77);">spring-boot-</font>[maven](https://so.csdn.net/so/search?q=maven&spm=1001.2101.3001.7020)<font style="color:rgb(77, 77, 77);">-plugin是spring boot提供的maven打包插件。可打直接可运行的jar包或war包。</font>
<font style="color:rgb(77, 77, 77);">在新建包pom文件的build中加上execute类加载器，这样其他服务引用这个包时才能动态的找到类</font>

```plain
<build>
 <plugins>
 <plugin>
 <groupId>org.springframework.boot</groupId>
 <artifactId>spring-boot-maven-plugin</artifactId>
 <version>2.3.7.RELEASE</version>
 <configuration>
 <classifier>execute</classifier>
 </configuration>
 </plugin>
 </plugins>
</build>
```

<font style="color:rgb(77, 77, 77);">参考:</font>

[<font style="color:#722ED1;">插件介绍:spring-boot-</font>](https://blog.csdn.net/u010406047/article/details/110878472)

<font style="color:#722ED1;"></font>

# Docker部署企业级Maven私服仓库 nexus3


参考
[Docker部署企业级Maven私服仓库 nexus3](https://gblfy.blog.csdn.net/article/details/126274964).


# Maven Parent父工程中常用的依赖


**1 在父工程中常用的一些基础工具依赖**

```plain
 <!--定义SpringBoot的版本 -->
 <parent>
 <groupId>org.springframework.boot</groupId>
 <artifactId>spring-boot-starter-parent</artifactId>
 <version>2.4.2</version>
 <relativePath/> <!-- lookup parent from repository -->
 </parent>

 <properties>
 <maven.compiler.source>8</maven.compiler.source>
 <maven.compiler.target>8</maven.compiler.target>
 <spring-cloud-alibaba.version>2021.1</spring-cloud-alibaba.version>
 <spring-cloud.version>2020.0.5</spring-cloud.version>
 <easy-execl.version>2.1.6</easy-execl.version>
 <thumbnailator.version>0.4.8</thumbnailator.version>
 <redisson.version>3.14.0</redisson.version>
 <fastjson.version>1.2.23</fastjson.version>
 <hutool.version>5.4.1</hutool.version>
 <dynamic-datasource.version>3.5.1</dynamic-datasource.version>
 <springfox-boot-starter.version>3.0.0</springfox-boot-starter.version>
 <knife4j-spring-boot-starter.version>3.0.3</knife4j-spring-boot-starter.version>
 <guava.version>29.0-jre</guava.version>
 <slf4j.version>1.7.25</slf4j.version>
 </properties>


 <dependencies>
 <!--swagger3 start -->
 <dependency>
 <groupId>com.github.xiaoymin</groupId>
 <artifactId>knife4j-spring-boot-starter</artifactId>
 <version>${knife4j-spring-boot-starter.version}</version>
 </dependency>
 <dependency>
 <groupId>io.springfox</groupId>
 <artifactId>springfox-boot-starter</artifactId>
 <version>${springfox-boot-starter.version}</version>
 </dependency>
 <!--swagger3 end -->
 <!-- slf4j日志接口 -->
 <dependency>
 <groupId>org.slf4j</groupId>
 <artifactId>slf4j-api</artifactId>
 </dependency>

 <!--netty-->
 <dependency>
 <groupId>io.netty</groupId>
 <artifactId>netty-all</artifactId>
 </dependency>

 <!--lombok -->
 <dependency>
 <groupId>org.projectlombok</groupId>
 <artifactId>lombok</artifactId>
 <version>${lombok.version}</version>
 </dependency>

 <!--easyexcel -->
 <dependency>
 <groupId>com.alibaba</groupId>
 <artifactId>easyexcel</artifactId>
 <version>${easy-execl.version}</version>
 </dependency>

 <!--hutool -->
 <dependency>
 <groupId>cn.hutool</groupId>
 <artifactId>hutool-all</artifactId>
 <version>${hutool.version}</version>
 </dependency>

 <!--guava -->
 <dependency>
 <groupId>com.google.guava</groupId>
 <artifactId>guava</artifactId>
 <version>${guava.version}</version>
 </dependency>

 <!--commons-lang3 -->
 <dependency>
 <groupId>org.apache.commons</groupId>
 <artifactId>commons-lang3</artifactId>
 <version>3.4</version>
 </dependency>

 <!--fastjson -->
 <dependency>
 <groupId>com.alibaba</groupId>
 <artifactId>fastjson</artifactId>
 <version>${fastjson.version}</version>
 </dependency>

 <!--缩略图-->
 <dependency>
 <groupId>net.coobird</groupId>
 <artifactId>thumbnailator</artifactId>
 <version>${thumbnailator.version}</version>
 </dependency>

 <!-- 单元测试依赖包 开始 -->
 <dependency>
 <groupId>org.junit.vintage</groupId>
 <artifactId>junit-vintage-engine</artifactId>
 </dependency>
 <dependency>
 <groupId>org.junit.jupiter</groupId>
 <artifactId>junit-jupiter-params</artifactId>
 </dependency>
 <dependency>
 <groupId>org.junit.jupiter</groupId>
 <artifactId>junit-jupiter</artifactId>
 <scope>test</scope>
 </dependency>
 <!-- 单元测试依赖包 结束 -->

 <!--asp切面的依赖，和Spring的Aop配合使用 -->
 <dependency>
 <groupId>org.aspectj</groupId>
 <artifactId>aspectjrt</artifactId>
 </dependency>
 <dependency>
 <groupId>org.aspectj</groupId>
 <artifactId>aspectjweaver</artifactId>
 </dependency>


 <!--redisson的starter -->
 <dependency>
 <groupId>org.redisson</groupId>
 <artifactId>redisson-spring-boot-starter</artifactId>
 <version>${redisson.version}</version>
 </dependency>

 <!--Mysql -->
 <dependency>
 <groupId>mysql</groupId>
 <artifactId>mysql-connector-java</artifactId>
 </dependency>

 <!--mybatisPlus -->
 <dependency>
 <groupId>com.baomidou</groupId>
 <artifactId>mybatis-plus-boot-starter</artifactId>
 <version>3.4.3.4</version>
 </dependency>

 <!--MybatisPlus generator自动生成代码 start -->
 <dependency>
 <groupId>com.baomidou</groupId>
 <artifactId>mybatis-plus-generator</artifactId>
 <version>3.4.0</version>
 </dependency>
 <dependency>
 <groupId>org.apache.velocity</groupId>
 <artifactId>velocity-engine-core</artifactId>
 <version>2.2</version>
 </dependency>
 <!--MybatisPlus generator自动生成代码 end -->


 <!--MybatisPlus dynamic自动切换数据源 -->
 <dependency>
 <groupId>com.baomidou</groupId>
 <artifactId>dynamic-datasource-spring-boot-starter</artifactId>
 <version>${dynamic-datasource.version}</version>
 </dependency>

 <!--SpringBoot 官方的starter start -->
 <!--starter的validation,统一校验参数 -->
 <dependency>
 <groupId>org.springframework.boot</groupId>
 <artifactId>spring-boot-starter-validation</artifactId>
 </dependency>
 <!--starter的bootstrap,参数在配置中心配置,在SpringBoot项目中以Yml的形式引入 -->
		 <dependency>
 <groupId>org.springframework.cloud</groupId>
 <artifactId>spring-cloud-starter-bootstrap</artifactId>
 </dependency>
 <!--SpringBoot 官方的starter end -->
 </dependencies>


 <!--定义Spring Cloud Alibaba的版本 以及spring cloud的版本-->
 <dependencyManagement>
 <dependencies>
 <dependency>
 <groupId>com.alibaba.cloud</groupId>
 <artifactId>spring-cloud-alibaba-dependencies</artifactId>
 <version>${spring-cloud-alibaba.version}</version>
 <type>pom</type>
 <scope>import</scope>
 </dependency>
 <dependency>
 <groupId>org.springframework.cloud</groupId>
 <artifactId>spring-cloud-dependencies</artifactId>
 <version>${spring-cloud.version}</version>
 <type>pom</type>
 <scope>import</scope>
 </dependency>
 </dependencies>
 </dependencyManagement>
```

## 2 操作文档文件的一些依赖
```plain
 <!-- https://mvnrepository.com/artifact/org.apache.pdfbox/pdfbox -->
 <dependency>
 <groupId>org.apache.pdfbox</groupId>
 <artifactId>pdfbox</artifactId>
 <version>2.0.21</version>
 </dependency>
		
		 <!-- poi 相关包 一律选3.14版本适配 start -->
 <dependency>
 <groupId>org.apache.poi</groupId>
 <artifactId>poi</artifactId>
 <version>3.17</version>
 </dependency>
 <dependency>
 <groupId>org.apache.poi</groupId>
 <artifactId>poi-ooxml</artifactId>
 <version>3.17</version>
 </dependency>
 <dependency>
 <groupId>org.apache.poi</groupId>
 <artifactId>poi-scratchpad</artifactId>
 <version>3.17</version>
 </dependency>
 <dependency>
 <groupId>org.apache.poi</groupId>
 <artifactId>poi-ooxml-schemas</artifactId>
 <version>3.17</version>
 </dependency>
		 <!-- 字体库在这个jar包里 不可缺少 版本和poi有所不同 -->
 <dependency>
 <groupId>org.apache.poi</groupId>
 <artifactId>ooxml-schemas</artifactId>
 <version>1.3</version>
 </dependency>
 <!-- poi 相关包 一律选3.14版本适配 end -->

		
		 <!-- itext包 用来将word转化为PDF 适用于Windows 和 Linux， start -->
 <dependency>
 <groupId>com.itextpdf.tool</groupId>
 <artifactId>xmlworker</artifactId>
 <version>5.5.11</version>
 </dependency>

 <!-- https://mvnrepository.com/artifact/com.itextpdf/itext-asian -->
 <dependency>
 <groupId>com.itextpdf</groupId>
 <artifactId>itext-asian</artifactId>
 <version>5.2.0</version>
 </dependency>
 <!-- itext包 用来将word转化为PDF end -->

 <!-- https://mvnrepository.com/artifact/com.itextpdf/itextpdf -->
 <dependency>
 <groupId>com.itextpdf</groupId>
 <artifactId>itextpdf</artifactId>
 <version>5.5.13</version>
 </dependency>
 <!--Java使用Aspose-Words实现Word转换Pdf -->
 <dependency>
 <groupId>com.aspose</groupId>
 <artifactId>aspose-words</artifactId>
 <version>15.8.0</version>
 </dependency>

		 <!--XDocReport是一个用来进行文档填充和文档格式转换的java -->
	 	<dependency>
 <groupId>fr.opensagres.xdocreport</groupId>
 <artifactId>xdocreport</artifactId>
 <version>2.0.1</version>
 </dependency>

		 <!-- jsoup 用来操作html 生成相应的格式, 否则格式无法整理-->
 <dependency>
 <groupId>org.jsoup</groupId>
 <artifactId>jsoup</artifactId>
 <version>1.11.3</version>
 </dependency>

		
		 <!-- freemarker依赖 -->
 <dependency>
 <groupId>org.springframework.boot</groupId>
 <artifactId>spring-boot-starter-freemarker</artifactId>
 </dependency>
 <!--集成freemarker、flying-saucer-pdf、itext通过html模板生成PDF，flying-saucer-pdf终于完美解决了（中文问题，换行问题，页眉页脚，水印）,html+css控制pdf样式 -->
 <dependency>
 <groupId>org.xhtmlrenderer</groupId>
 <artifactId>flying-saucer-pdf</artifactId>
 <version>9.1.12</version>
 </dependency>
```

## 3 在子模块中常用的依赖
```plain
	 <properties>
 <dingtalk.version>1.2.15</dingtalk.version>
	 <oss.version>3.10.2</oss.version>
	 <sa-token.version>1.29.0</sa-token.version>
 </properties>


 <!--阿里钉钉的sdk -->
	<dependency>
		<groupId>com.aliyun</groupId>
		<artifactId>dingtalk</artifactId>
		<version>${dingtalk.version}</version>
	</dependency>
	
	 <!--阿里云oos -->
	<dependency>
		<groupId>com.aliyun.oss</groupId>
		<artifactId>aliyun-sdk-oss</artifactId>
		<version>${oss.version}</version>
	</dependency>
	


	
	<!--SA-TOKEN 开始-->
	<!-- sa-token权限认证框架 -->
	<dependency>
		<groupId>cn.dev33</groupId>
		<artifactId>sa-token-spring-boot-starter</artifactId>
		<version>${sa-token.version}</version>
	</dependency>
	<!-- Sa-Token 整合 Redis （使用jackson序列化方式） -->
	<dependency>
		<groupId>cn.dev33</groupId>
		<artifactId>sa-token-dao-redis-jackson</artifactId>
		<version>${sa-token.version}</version>
	</dependency>
	 <!-- Sa-Token插件：权限缓存与业务缓存分离 -->
 <dependency>
 <groupId>cn.dev33</groupId>
 <artifactId>sa-token-alone-redis</artifactId>
 <version>${sa-token-version}</version>
 </dependency>
	 <!-- 提供Redis连接池 -->
 <dependency>
 <groupId>org.apache.commons</groupId>
 <artifactId>commons-pool2</artifactId>
 </dependency>
	<!--SA-TOKEN 结束-->
```

## 4 SpringBoot官方Start依赖
```plain

		<!--starter的websocket -->
		 <dependency>
 <groupId>org.springframework.boot</groupId>
 <artifactId>spring-boot-starter-websocket</artifactId>
 </dependency>
```

## 5 Spring Cloud的依赖
在父工程中定义好Spring Cloud的版本， 在父工程或者子工程中直接使用

```plain
<!--Spring Cloud 负载均衡依 -->
<dependency>
 <groupId>org.springframework.cloud</groupId>
 <artifactId>spring-cloud-loadbalancer</artifactId>
</dependency>

<!--Spring Cloud openfeign -->
<dependency>
 <groupId>org.springframework.cloud</groupId>
 <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>

<!--Spring Cloud 的GateWay网关 -->
<dependency>
 <groupId>org.springframework.cloud</groupId>
 <artifactId>spring-cloud-starter-gateway</artifactId>
</dependency>
```

**6 Spring Cloud Alibaba的依赖**
 在父工程中定义来Spring Cloud Alibaba的版本， 在父工程或者子工程中字节使用


```plain
<!--Spring Cloud Alibaba的config配置中心 -->
<dependency>
 <groupId>com.alibaba.cloud</groupId>
 <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
</dependency>

<!--Spring Cloud Alibaba的discovery注册中心 -->
<dependency>
 <groupId>com.alibaba.cloud</groupId>
 <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>

```

## 7 使用阿里云制品库配置参考
<font style="color:#E8323C;">这是居然之家的使用阿里云的中央仓库， 可以使用这个参考配置？</font>

```plain
 <!--推送库地址 这个配置到时候再看下改成自己阿里云的-->

<distributionManagement>
 <snapshotRepository>
 <id>rdc-snapshots</id>
 <url>https://packages.aliyun.com/maven/repository/112630-snapshot-JQxYHE/</url>
 </snapshotRepository>
 <repository>
 <id>rdc-releases</id>
 <url>https://packages.aliyun.com/maven/repository/112630-release-1x7qc4/</url>
 </repository>
</distributionManagement>


<!--读取库地址 这个配置到时候也要看下，改成自己的配置-->
<repositories>
 <repository>
 <id>rdc-snapshots</id>
 <url>https://packages.aliyun.com/maven/repository/112630-snapshot-JQxYHE/</url>
 <snapshots>
 <enabled>true</enabled>
 </snapshots>
 </repository>
 <repository>
 <id>rdc-releases</id>
 <url>https://packages.aliyun.com/maven/repository/112630-release-1x7qc4/</url>
 <releases>
 <enabled>true</enabled>
 </releases>
 </repository>
</repositories>

```

## 7 插件配置参考
<font style="color:#E8323C;"> 这里面用到了两个插件spring-boot-maven-plugin和dockerfile-maven-plugin，什么场景下使用？</font>

<font style="color:#E8323C;"> 使用spring-boot-maven-plugin和dockerfile-maven-plugin这两个插件有什么要注意的点？</font>

<font style="color:#E8323C;"> 这个<finalName>表签后的变量${project.artifactId}是啥值？</font>

```plain
#参考1
<build>
 <finalName>${project.artifactId}</finalName>
 <plugins>
 <plugin>
 <groupId>org.springframework.boot</groupId>
 <artifactId>spring-boot-maven-plugin</artifactId>
 </plugin>
 <plugin>
 <groupId>com.spotify</groupId>
 <artifactId>dockerfile-maven-plugin</artifactId>
 <version>1.4.13</version>
 <configuration>
 <skip>false</skip>
 <repository>${project.artifactId}</repository>
 </configuration>
 </plugin>
 </plugins>
</build>


#参考2
 <build>
 <plugins>
 <plugin>
 <groupId>org.codehaus.mojo</groupId>
 <artifactId>flatten-maven-plugin</artifactId>
 <version>1.1.0</version>
 <configuration>
 <!-- 是否更新pom文件，此处还有更高级的用法 -->
 <updatePomFile>true</updatePomFile>
 <flattenMode>resolveCiFriendliesOnly</flattenMode>
 </configuration>
 <executions>
 <execution>
 <id>flatten</id>
 <phase>process-resources</phase>
 <goals>
 <goal>flatten</goal>
 </goals>
 </execution>
 <execution>
 <id>flatten.clean</id>
 <phase>clean</phase>
 <goals>
 <goal>clean</goal>
 </goals>
 </execution>
 </executions>
 </plugin>
 <!-- 给文件头加版权信息 -->
 <plugin>
 <groupId>com.mycila</groupId>
 <artifactId>license-maven-plugin</artifactId>
 <version>2.3</version>
 <configuration>
 <header>license/header.txt</header>
 <headerDefinitions>
 <headerDefinition>license/tomahawk-header.xml</headerDefinition>
 </headerDefinitions>
 <properties>
 <owner>capgemini</owner>
 <email>zaichao.li@capgemini.com</email>
 </properties>
 <includes>
 <include>src/main/java/**/*.java</include>
 </includes>

 <!--排除文件-->
 <excludes>
 <exclude>**/*.properties</exclude>
 <exclude>*.sh</exclude>
 <exclude>*.yml</exclude>
 <exclude>.editorconfig</exclude>
 <exclude>.gitignore</exclude>
 <exclude>**/*.md</exclude>
 <exclude>**/*.xml</exclude>
 </excludes>
 </configuration>
 <executions>
 <execution>
 <goals>
 <goal>check</goal>
 </goals>
 </execution>
 </executions>
 <dependencies>
 <dependency>
 <groupId>com.tomahawk.boot</groupId>
 <artifactId>tomahawk-build-tools</artifactId>
 <version>${project.version}</version>
 </dependency>
 </dependencies>
 </plugin>
 </plugins>
 </build>
```

# 私服release库和snapshot库的正确使用方式
<font style="color:rgb(38, 38, 38);">


</font>
参考

[私服release库和snapshot库的正确使用方式](https://mp.weixin.qq.com/s/B_mFBZ9mBLUUxNYBooitUw)

.


# IDEA的使用技巧

**1 IDEA实用的一些常用的插件**
[IDEA 将对象转成Json的插件](https://blog.csdn.net/xixingzhe2/article/details/112283064)

[https://blog.csdn.net/xixingzhe2/article/details/112283064](https://blog.csdn.net/xixingzhe2/article/details/112283064)


**<font style="color:rgb(38, 38, 38);">JMeter安装及简单介绍</font>**

## <font style="color:rgb(38, 38, 38);">1 压测</font>
[美团技术：从0到1构建压测工具](https://tech.meituan.com/2016/01/08/loading-test.html)

[JMeter(1) 安装与配置](https://zhengqing.blog.csdn.net/article/details/122503007)

[Win10 本地安装Jmeter，本地并配置Jmeter环境变量](https://www.cnblogs.com/ruowangxiaxue/p/12303705.html)

[Jmeter进行压力测试](https://www.cnblogs.com/stulzq/p/8971531.html)

[JMeter 性能测试实例详细介绍](https://www.cnblogs.com/little-little-bai/p/10338156.html)

[JMeter生成Html性能压测报告](https://gblfy.blog.csdn.net/article/details/106525659)<font style="color:rgb(38, 38, 38);"></font>


<font style="color:rgb(38, 38, 38);"></font>


<font style="color:rgb(38, 38, 38);"></font>


<font style="color:rgb(38, 38, 38);"></font>


