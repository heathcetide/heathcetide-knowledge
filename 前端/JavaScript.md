`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">JavaScript</font>`<font style="color:rgb(0, 0, 0);">简单来说，就是一种专为与网页交互而设计的脚本语言，这是官方的一种说法，作为初学者，我们更关注的应该是效果，即什么东西可以实现什么效果。</font>

`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">JavaScript</font>`<font style="color:rgb(0, 0, 0);">主要由三部分组成：</font>

1. <font style="color:rgb(0, 0, 0);">核心(ECMAScript)</font>
2. <font style="color:rgb(0, 0, 0);">文档对象模型(DOM)</font>
3. <font style="color:rgb(0, 0, 0);">浏览器对象模型(BOM)</font>

<font style="color:rgb(0, 0, 0);">我们可以将这三部分当作三个部门，每个部门都有自己的职责，首先我们来介绍核心(ECMAScript)。</font>

#### <font style="color:rgb(0, 0, 0);">核心(ECMAScript)</font>
`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">ECMAScript</font>`<font style="color:rgb(0, 0, 0);">规定了</font>**<font style="color:rgb(0, 0, 0);">这门语言的基本组成部分</font>**<font style="color:rgb(0, 0, 0);">，主要有以下几个部分组成：</font>

+ <font style="color:rgb(0, 0, 0);">语法</font>
+ <font style="color:rgb(0, 0, 0);">类型</font>
+ <font style="color:rgb(0, 0, 0);">语句</font>
+ <font style="color:rgb(0, 0, 0);">关键字</font>
+ <font style="color:rgb(0, 0, 0);">保留字</font>
+ <font style="color:rgb(0, 0, 0);">操作符</font>
+ <font style="color:rgb(0, 0, 0);">对象</font>

<font style="color:rgb(0, 0, 0);">在这里我们先不同去纠结这几部分到底是什么，在后面的课程中我们会逐一学习到，在这里我们只要知道它们是</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">JavaScript</font>`**<font style="color:rgb(0, 0, 0);">这门语言的基本组成部分</font>**<font style="color:rgb(0, 0, 0);">即可。</font>

<font style="color:rgb(0, 0, 0);">有了这些基本组成部分，</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">JavaScript</font>`<font style="color:rgb(0, 0, 0);">就可以完成基本的</font>**<font style="color:rgb(0, 0, 0);">逻辑以及数据处理</font>**<font style="color:rgb(0, 0, 0);">。</font>

#### <font style="color:rgb(0, 0, 0);">文档对象模型(DOM)</font>
`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">DOM</font>`<font style="color:rgb(0, 0, 0);">的功能简单来说呢就是可以获取到我们写的所有的</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">html</font>`<font style="color:rgb(0, 0, 0);">标签，并给标签添加或者删除样式，并可以给标签添加事件(例如点击、拖动等)。这些功能的实现是基于下面几种接口的：</font>

+ **<font style="color:rgb(0, 0, 0);">DOM 遍历和范围</font>**<font style="color:rgb(0, 0, 0);">： 可以找到页面中所有的标签;</font>
+ **<font style="color:rgb(0, 0, 0);">DOM 事件</font>**<font style="color:rgb(0, 0, 0);">： 例如给某个图片添加拖动事件，使图片可以随意拖动;</font>
+ **<font style="color:rgb(0, 0, 0);">DOM 样式</font>**<font style="color:rgb(0, 0, 0);">： 可以更改页面中所有元素的样式，例如更改某一段文字的颜色。</font>

<font style="color:rgb(0, 0, 0);">再次重申，这一节的内容目前都是用来了解的，</font>**<font style="color:rgb(0, 0, 0);">不要深入研究</font>**

#### <font style="color:rgb(0, 0, 0);">浏览器对象模型(BOM)</font>
`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">BOM</font>`<font style="color:rgb(0, 0, 0);">只会处理跟浏览器相关的东西，比如：</font>

+ <font style="color:rgb(0, 0, 0);">弹出新窗口功能</font>
+ <font style="color:rgb(0, 0, 0);">移动、缩放、关闭浏览器窗口的功能</font>
+ <font style="color:rgb(0, 0, 0);">给用户提供显示器分辨率的功能</font>
+ <font style="color:rgb(0, 0, 0);">提供浏览器信息</font>

<font style="color:rgb(0, 0, 0);">在初学 JavaScript 的时候，我们可能只会跟前两种打交道</font>

### `<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">JavaScript</font>`<font style="color:rgb(0, 0, 0);">的书写位置</font>
`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">JavaScript</font>`<font style="color:rgb(0, 0, 0);">与</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">CSS</font>`<font style="color:rgb(0, 0, 0);">的书写位置非常相似，分为</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">HTML</font>`<font style="color:rgb(0, 0, 0);">内部和外部</font>

#### `<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">JavaScript</font>`<font style="color:rgb(0, 0, 0);">写在</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">HTML</font>`<font style="color:rgb(0, 0, 0);">内部</font>
1. <font style="color:rgb(0, 0, 0);">使用</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">script</font>`<font style="color:rgb(0, 0, 0);">标签嵌入</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">JavaScript</font>`

`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);"><script></script></font>`<font style="color:rgb(0, 0, 0);">标签可以将</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">JavaScript</font>`<font style="color:rgb(0, 0, 0);">代码嵌入到</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">HTML</font>`<font style="color:rgb(0, 0, 0);">内部，具体嵌入方式如下：</font>

```plain
// script标签嵌入JavaScript代码
<script>
    // JavaScript代码
    let name = "Bob";
    function(){
        console.log("我的名字叫："+name);
    }
</script>
```

<font style="color:rgb(140, 140, 140);">上述代码中，</font>`<font style="color:rgb(140, 140, 140);background-color:rgb(245, 245, 245);">script</font>`<font style="color:rgb(140, 140, 140);">标签中间的代码大家不用去理解，后面我们会学到. 你或许会看到</font>`<font style="color:rgb(140, 140, 140);background-color:rgb(245, 245, 245);"><script type="text/javascript" charset="utf-8"></script></font>`<font style="color:rgb(140, 140, 140);">这种类型的</font>`<font style="color:rgb(140, 140, 140);background-color:rgb(245, 245, 245);">script</font>`<font style="color:rgb(140, 140, 140);">标签，其实它跟</font>`<font style="color:rgb(140, 140, 140);background-color:rgb(245, 245, 245);"><script></script></font>`<font style="color:rgb(140, 140, 140);">标签是一样的，其中</font>`<font style="color:rgb(140, 140, 140);background-color:rgb(245, 245, 245);">type="text/javascript"</font>`<font style="color:rgb(140, 140, 140);">代表> 文档类型是</font>`<font style="color:rgb(140, 140, 140);background-color:rgb(245, 245, 245);">javascript</font>`<font style="color:rgb(140, 140, 140);">类型，字符编解码方式是</font>`<font style="color:rgb(140, 140, 140);background-color:rgb(245, 245, 245);">utf-8</font>`<font style="color:rgb(140, 140, 140);">.这两个暂时都不用去理解</font>

1. <font style="color:rgb(0, 0, 0);">注意</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">script</font>`<font style="color:rgb(0, 0, 0);">标签在</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">HTML</font>`<font style="color:rgb(0, 0, 0);">文件中的位置</font>

<font style="color:rgb(0, 0, 0);">这里我们强行规定一个位置或者说这就是一种规范，即</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">body</font>`<font style="color:rgb(0, 0, 0);">标签的内部，并保证是在末尾，如下面的代码所示：</font>

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Document</title>
  </head>
  <body>
    <!-- 正常的html标签一定要写在script标签的前面 -->
    <div></div>
    <!-- 在body标签的内部并在末尾 -->
    <script></script>
  </body>
</html>
```

`<font style="color:rgb(140, 140, 140);background-color:rgb(245, 245, 245);">script</font>`<font style="color:rgb(140, 140, 140);">标签在</font>`<font style="color:rgb(140, 140, 140);background-color:rgb(245, 245, 245);">HTML</font>`<font style="color:rgb(140, 140, 140);">文件中的位置很随意，可以说写在哪里都无所谓，但是在学习</font>`<font style="color:rgb(140, 140, 140);background-color:rgb(245, 245, 245);">JavaScript</font>`<font style="color:rgb(140, 140, 140);">的</font>`<font style="color:rgb(140, 140, 140);background-color:rgb(245, 245, 245);">DOM</font>`<font style="color:rgb(140, 140, 140);">的时候，如果不注意</font>`<font style="color:rgb(140, 140, 140);background-color:rgb(245, 245, 245);">script</font>`<font style="color:rgb(140, 140, 140);">标签的位置，会出现你意想不到的报错.</font>

<font style="color:rgb(0, 0, 0);">此时我们就可以在</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">script</font>`<font style="color:rgb(0, 0, 0);">标签中间书写</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">JavaScript</font>`<font style="color:rgb(0, 0, 0);">代码了.</font>

<font style="color:rgb(0, 0, 0);">下面我们通过代码演示来感受一下：</font>

<font style="color:rgb(255, 255, 255);background-color:rgb(108, 108, 108);">代码演示</font>

#### `<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">JavaScript</font>`<font style="color:rgb(0, 0, 0);">写在</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">HTML</font>`<font style="color:rgb(0, 0, 0);">外部</font>
<font style="color:rgb(0, 0, 0);">和</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">CSS</font>`<font style="color:rgb(0, 0, 0);">一样，在</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">JavaScript</font>`<font style="color:rgb(0, 0, 0);">中我们也是推崇代码分离的，即</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">JavaScript</font>`<font style="color:rgb(0, 0, 0);">代码写在</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">xxx.js</font>`<font style="color:rgb(0, 0, 0);">文件中，然后由引入标签去引入即可.</font>

<font style="color:rgb(0, 0, 0);">这里的引入标签即</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">script</font>`<font style="color:rgb(0, 0, 0);">标签，不一样的是，在标签上多了一个</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">src</font>`<font style="color:rgb(0, 0, 0);">参数，引入方式如下：</font>

```plain
<script src='index.js'></script>
```

<font style="color:rgb(0, 0, 0);">代码演示如下：</font>

<font style="color:rgb(255, 255, 255);background-color:rgb(108, 108, 108);">代码演示</font>

<font style="color:rgb(0, 0, 0);">书写位置与内部的书写位置一致，即书写在</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">body</font>`<font style="color:rgb(0, 0, 0);">标签内，但是在末尾.</font>





注释：

```plain
// 单行注释
```

**<font style="color:rgb(0, 0, 0);">块级注释</font>**

<font style="color:rgb(0, 0, 0);">块级注释以一个斜杠和一个星号开头，以一个星号和一个斜杠结尾，如下所示：</font>

```plain
/*
 * 注释
 * 注释
 */
```

<font style="color:rgb(0, 0, 0);">注释的内容少，可以用单行注释，内容多，就使用块级注释.</font>

### <font style="color:rgb(0, 0, 0);">字符串</font>
<font style="color:rgb(0, 0, 0);">什么是字符串呢?简单的说就是</font>**<font style="color:rgb(0, 0, 0);">用引号引起来的就是字符串</font>**<font style="color:rgb(0, 0, 0);">，这里的引号可以是单引号('')也可以是双引号("").</font>

**<font style="color:rgb(0, 0, 0);">切记：</font>**<font style="color:rgb(0, 0, 0);">输入引号的时候，一定要切换为英文输入法.</font>

**<font style="color:rgb(0, 0, 0);">中文添加引号</font>**

<font style="color:rgb(0, 0, 0);">下面两种都是字符串：</font>

```plain
// 双引号
"字符串";

// 单引号
'字符串';
```

**<font style="color:rgb(0, 0, 0);">英文添加引号</font>**

<font style="color:rgb(0, 0, 0);">下面两种都是字符串</font>

```plain
// 双引号
"Tom";

// 单引号
'Tom';
```

**<font style="color:rgb(0, 0, 0);">字母添加引号</font>**

<font style="color:rgb(0, 0, 0);">字母在一些编程语言中被视为字符，在这里你可以将它视为字符串，下面两种都是字符串：</font>

```plain
// 双引号
"T";

// 单引号
'T';
```

**<font style="color:rgb(0, 0, 0);">数字添加引号</font>**

<font style="color:rgb(0, 0, 0);">数字不添加引号的时候，不是字符串，但是添加了引号以后就会变成字符串：</font>

```plain
// 双引号，字符串
"12";

// 单引号，字符串
'1';
```

<font style="color:rgb(140, 140, 140);">谨记数字和字符串的区别</font>

### <font style="color:rgb(0, 0, 0);">console 访问控制台</font>
<font style="color:rgb(0, 0, 0);">JavaScript 与我们之前学习的</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">HTML/CSS</font>`<font style="color:rgb(0, 0, 0);">不一样的是，它的输出结果不是在浏览器的页面中显示，而是在控制台中显示.</font>

`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">console</font>`<font style="color:rgb(0, 0, 0);">表示访问控制台，</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">log()</font>`<font style="color:rgb(0, 0, 0);">表示在控制台输出信息，中间用点(.)连接，完整的写法是：</font>

```plain
console.log("要输出的内容");
```

<font style="color:rgb(140, 140, 140);">大家不用纠结</font>`<font style="color:rgb(140, 140, 140);background-color:rgb(245, 245, 245);">console.log()</font>`<font style="color:rgb(140, 140, 140);">是什么，因为这是浏览器内置对象，也就是浏览器自带的，我们只要记住这句话可以在控制台输出信息即可.</font>

<font style="color:rgb(0, 0, 0);">将输出语句写在</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">script</font>`<font style="color:rgb(0, 0, 0);">标签内，完整的写法如下：</font>

```plain
<script>console.log("Hello World");</script>
```

`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">JavaScript</font>`<font style="color:rgb(0, 0, 0);">代码写在</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">HTML</font>`<font style="color:rgb(0, 0, 0);">代码内部的写法如下：</font>

<font style="color:rgb(255, 255, 255);background-color:rgb(108, 108, 108);">代码演示</font>

<font style="color:rgb(0, 0, 0);">可以看出，在</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">index.js</font>`<font style="color:rgb(0, 0, 0);">文件中写</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">JavaScript</font>`<font style="color:rgb(0, 0, 0);">代码的时候，是不需要加</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">script</font>`<font style="color:rgb(0, 0, 0);">标签的，只有在</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">HTML</font>`<font style="color:rgb(0, 0, 0);">代码中才需要加</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">script</font>`<font style="color:rgb(0, 0, 0);">标签.</font>

### <font style="color:rgb(0, 0, 0);">模版字符串</font>
<font style="color:rgb(0, 0, 0);">在一般的字符串中，如果我们要将字符串和变量拼接起来，要用加号（+）去拼接，例如：</font>

```plain
let firstName = "胡";
let lastName = "雪岩";

let say = "大家好，我姓" + firstName + "，名" + lastName;

console.log(say);
```

<font style="color:rgb(0, 0, 0);">可以看的出，这个写法非常的繁琐，模版字符串就可以简化书写，模版字符串的核心是反引号（``）和 占位符</font><font style="color:rgb(0, 0, 0);"> </font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">${expression}</font>`<font style="color:rgb(0, 0, 0);"> </font><font style="color:rgb(0, 0, 0);">，反引号的作用是将字符串和变量包起来，占位符的作用就是在字符串中插入变量。</font>

<font style="color:rgb(140, 140, 140);">记住占位符的语法：</font>`<font style="color:rgb(140, 140, 140);background-color:rgb(245, 245, 245);">${变量名}</font>`

<font style="color:rgb(0, 0, 0);">比如上面的代码我们可以使用模版字符串来进行改造：</font>

```plain
let firstName = "胡";
let lastName = "雪岩";

let say = `大家好，我姓${firstName}，名${lastName}`;

console.log(say);
```

#### <font style="color:rgb(0, 0, 0);">转义符（\）</font>
<font style="color:rgb(0, 0, 0);">转义符在模版字符串和一般的字符串中都很常见，比如说我们要写下面这段代码：</font>

```plain
let str = "华为正式发布操作系统---"鸿蒙OS"";
console.log(str);
```

<font style="color:rgb(0, 0, 0);">这样的写法是错误的，但是我们就想在双引号里面写双引号，怎么办呢？这里就要用到转义符（\），在前后双引号前面添加一个转义符（\），代码如下：</font>

```plain
let str = "华为正式发布操作系统---\"鸿蒙OS\"";
console.log(str);
```

<font style="color:rgb(0, 0, 0);">这里因为文档格式化的原因，没办法写出转义符号，其实应该是这样的"华为正式发布操作系统---"鸿蒙 OS""</font>

<font style="color:rgb(0, 0, 0);">同样的，如果我们想要在模版字符串中使用反引号（``），也可以在模版字符串中的`前面添加一个转义符（\），如：</font>

```plain
let firstName = "胡";
let lastName = "雪岩";

let say = `大家好，我姓${firstName}，名${lastName}，喜欢\`看书\``;

console.log(say);
```

#### <font style="color:rgb(0, 0, 0);">多行字符串拼接</font>
<font style="color:rgb(0, 0, 0);">再比如我们要输出一首古诗，使用一般的字符串我们就要用到\n 来换行，代码如下：</font>

```plain
let str = "春眠不觉晓\n" + "处处闻啼鸟\n" + "夜来风雨声\n" + "花落知多少\n";
console.log(str);
```

<font style="color:rgb(0, 0, 0);">但是使用模版字符串，只需要回车就好，代码如下：</font>

```plain
let str = `春眠不觉晓
处处闻啼鸟
夜来风雨声
花落知多少`;

console.log(str);
```

#### <font style="color:rgb(0, 0, 0);">在字符串中使用表达式</font>
<font style="color:rgb(0, 0, 0);">在以前我们要在一个字符串中使用表达式，我们要去拼接这个表达式，具体做法如下：</font>

```plain
let number1 = 20;
let number2 = 10;
console.log(
  "两个数的和是：" +
    (number1 + number2) +
    "\n两个数的差是：" +
    (number1 - number2) +
    "。"
);
```

<font style="color:rgb(0, 0, 0);">同样，这种做法就很繁琐，首先加号和引号太多了，输入成本太高，这时候我们就可以充分利用占位符（${expression}）来做点文章，改写如下：</font>

```plain
let number1 = 20;
let number2 = 10;
console.log(`两个数的和是：${number1 + number2} 
两个数的差是：${number1 - number2} 。`);
```

#### <font style="color:rgb(0, 0, 0);">模版字符串中使用三元表达式</font>
<font style="color:rgb(0, 0, 0);">这里我们就不去管字符串拼接的表达式了，直接使用模版字符串来写三元表达式，先写一个最简单的:</font>

```plain
let str = `这里是${false ? "浙江" : "江苏"}`;

console.log(str); // 江苏
```

<font style="color:rgb(0, 0, 0);">很容易可以看的出，输出结果是江苏，那么我们做更深一步的书写，加大难度：</font>

```plain
let str = `这里是${true ? "江苏" : "浙江"}-${true ? "南京" : "常州"}`;

console.log(str); // 这里是江苏-南京
```

#### <font style="color:rgb(0, 0, 0);">使用场景一</font>
<font style="color:rgb(0, 0, 0);">熟练了这种应用以后呢，我们要结合实际工作来做点文章，给个场景吧，大家知道，一个 class 后面是可以跟多个类名的，类名不同，样式不同，比如说 class = "base hover"，</font>

<font style="color:rgb(0, 0, 0);">当然我们这个场景不会这么简单，我们的场景是根据屏幕的宽度来动态的改样式，这里就可以用模版字符串：</font>

```plain
// 定义屏幕的宽度，当然这个宽度是根据window的api去获取的
let screen = 760;

// 判断屏幕是大屏还是小屏，这里我们认为大于760px的就是大屏
function isLargeScreen() {
  return screen > 800;
}

// 定义元素的排列方式，大屏row排列，小屏column排列
// 具体什么排列方式，是根据屏幕大小决定的
let item = {
  isCollapsed: screen > 800
};

// 这里我们就要根据上面的信息来动态的获取类名（多个）
const classes = `header ${
  isLargeScreen() ? "" : `icon-${item.isCollapsed ? "column" : "row"}`
}`;

console.log(classes);
```

#### <font style="color:rgb(0, 0, 0);">使用场景二</font>
<font style="color:rgb(0, 0, 0);">再比如我们后面会在 js 代码中组装 HTML 代码，然后显示在屏幕中：</font>

```plain
let htmlCode = `
    <img src='' />
    ${
      true
        ? `<img src='https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1906469856,4113625838&fm=26&gp=0.jpg' />`
        : `<img src='' />`
    }
`;
console.log(htmlCode);
// <img src='' />
//    <img src='https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1906469856,4113625838&fm=26&gp=0.jpg' />
```

<font style="color:rgb(0, 0, 0);">这里注意，html 代码作为条件成功后要输出的内容，要用反引号扩起来，会跟之前的代码有点区别，要注意一下</font>

<font style="color:rgb(0, 0, 0);"></font>

<font style="color:rgb(0, 0, 0);"></font>

`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">JavaScript</font>`<font style="color:rgb(0, 0, 0);">中定义变量的关键字(编程语言中特定的单词)有两个，即</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">let</font>`<font style="color:rgb(0, 0, 0);">、</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">const</font>`<font style="color:rgb(0, 0, 0);">.</font>

### <font style="color:rgb(0, 0, 0);">使用 let 定义变量</font>
<font style="color:rgb(0, 0, 0);">定义变量的格式如下图所示：</font>

+ <font style="color:rgb(0, 0, 0);">关键字： 编程语言中特定的单词;</font>
+ <font style="color:rgb(0, 0, 0);">变量名： 用于保存值的占位符;</font>
+ <font style="color:rgb(0, 0, 0);">赋值符号： 将值赋给变量的符号;</font>

<font style="color:rgb(0, 0, 0);">下面来定义一个变量并在控制台输出，核心代码如下：</font>

```plain
let name = "Will Smith";
console.log(name);
```

<font style="color:rgb(0, 0, 0);">来看一下代码演示的效果：</font>

<font style="color:rgb(255, 255, 255);background-color:rgb(108, 108, 108);">代码演示</font>

<font style="color:rgb(0, 0, 0);">其实上面的代码包含了两步：</font>

1. <font style="color:rgb(0, 0, 0);">定义变量</font>
2. <font style="color:rgb(0, 0, 0);">给变量赋值</font>

**<font style="color:rgb(0, 0, 0);">1.定义变量</font>**

<font style="color:rgb(0, 0, 0);">定义一个变量名为</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">name</font>`<font style="color:rgb(0, 0, 0);">的变量：</font>

```plain
// 定义一个变量名为name的变量
let name;
```

**<font style="color:rgb(0, 0, 0);">注意：</font>**`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">let</font>`<font style="color:rgb(0, 0, 0);">声明变量的时候，不能重复声明同名变量，例如：</font>

```plain
let number = 20;
let number = 30;
```

<font style="color:rgb(0, 0, 0);">上面这段代码运行的时候会报如下错误：</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">Uncaught SyntaxError: Identifier 'number' has already been declared</font>`<font style="color:rgb(0, 0, 0);">，这句话的意思是</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">number</font>`<font style="color:rgb(0, 0, 0);">这个变量已经被声明过了.</font>

<font style="color:rgb(140, 140, 140);">当然如果是在不同的作用域内声明相同变量，是可以的，暂时我们还遇不到这种情况，遇到的时候会讲</font>

#### <font style="color:rgb(0, 0, 0);">2.给变量赋值</font>
```plain
// 定义变量
let name;

// 给变量赋值
name = "Will Smith";
```

<font style="color:rgb(0, 0, 0);">代码演示如下：</font>

<font style="color:rgb(255, 255, 255);background-color:rgb(108, 108, 108);">代码演示</font>

**<font style="color:rgb(0, 0, 0);">注意：</font>**

1. <font style="color:rgb(0, 0, 0);">在使用</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">console.log()</font>`<font style="color:rgb(0, 0, 0);">输出变量的时候，并没有加引号("").</font>
2. <font style="color:rgb(0, 0, 0);">使用变量一定要在定义变量之后，例如下面这种方式会报错：</font>

```plain
// name还未定义和赋值就使用，报错
console.log(name);
let name = "Will Smith";
```

<font style="color:rgb(0, 0, 0);">正确的写法是：</font>

```plain
// 正确输出
let name = "Will Smith";
console.log(name);
```

<font style="color:rgb(140, 140, 140);">或许你们会在其它资料中看到定义变量的关键字</font>`<font style="color:rgb(140, 140, 140);background-color:rgb(245, 245, 245);">var</font>`<font style="color:rgb(140, 140, 140);">，这是一种过时的定义变量的关键字，因为它会导致很多未知的错误，所以现在已经不常用了，大家可以忽略.</font>

### <font style="color:rgb(0, 0, 0);">使用 const 定义变量</font>
<font style="color:rgb(0, 0, 0);">const 定义变量的方式和 let 一样，如下图所示：</font>

<font style="color:rgb(0, 0, 0);">const 的用法也和 let 是一样的，在这里我们就不做过多解释，下面我们主要讨论的是 const 和 let 在定义变量的时候，有什么不同.</font>

#### `<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">let</font>`<font style="color:rgb(0, 0, 0);">和</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">const</font>`<font style="color:rgb(0, 0, 0);">异同点一：</font>
+ `<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">let</font>`<font style="color:rgb(0, 0, 0);">定义的变量可以被多次重新赋值</font>

```plain
let name = "Bob";
console.log(name); // Bob

name = "Tom";
console.log(name); // Tom
```

<font style="color:rgb(255, 255, 255);background-color:rgb(108, 108, 108);">代码演示</font>

+ `<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">const</font>`<font style="color:rgb(0, 0, 0);">定义的变量只能赋值一次</font>

```plain
const name = "Bob";
console.log(name); // Bob

name = "Tom"; // 报错
console.log(name); // 不执行
```

<font style="color:rgb(0, 0, 0);">因为代码演示会导致我们的系统卡死，所以暂不做演示</font>

#### `<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">let</font>`<font style="color:rgb(0, 0, 0);">和</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">const</font>`<font style="color:rgb(0, 0, 0);">异同点二：</font>
+ `<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">let</font>`<font style="color:rgb(0, 0, 0);">定义变量的时候，可以不赋初始值</font>

```plain
let age;
console.log(age); // undefined
```

+ `<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">const</font>`<font style="color:rgb(0, 0, 0);">定义变量的时候，要赋初始值，否则会报错</font>

```plain
const age; // 报错
console.log(age);  // 不执行
```

<font style="color:rgb(0, 0, 0);">因为代码演示会导致我们的系统卡死，所以暂不做演示</font>





`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">JavaScript</font>`<font style="color:rgb(0, 0, 0);">中的整数和数学中的整数是一样的,是正整数、零、负整数的集合,一般来说,我们所接触的整数都是十进制的,例如：</font>

```plain
let number = 8;
console.log(number); // 8
```

<font style="color:rgb(0, 0, 0);">除了十进制还有八进制,十六进制,所谓十进制就是逢 10 进 1,八进制就是逢 8 进 1,十六进制就是逢 16 进 1,我们用几张图来简单的理解一下进制问题,下面的途中,红色方格表示进位：</font>

+ <font style="color:rgb(0, 0, 0);">八进制</font>

```plain
let number1 = 010; // 八进制的8
let number2 = 011; // 八进制的9
let number3 = 012; // 八进制的10
```

+ <font style="color:rgb(0, 0, 0);">十进制</font>

```plain
let number1 = 7; // 十进制的7
let number2 = 20; // 十进制的20
```

+ <font style="color:rgb(0, 0, 0);">十六进制</font>

```plain
let number1 = 0x010; // 十六进制的16
let number2 = 0x11; // 十六进制的17
let number3 = 0x12; // 十六进制的18
```

**<font style="color:rgb(0, 0, 0);">注意：</font>**<font style="color:rgb(0, 0, 0);">在编程中我们遇到的更多的是十进制的数值，大家大可不必把时间花费在不常用的知识点上，对于其它两种进制的要求是，见到能认识即可.</font>

### <font style="color:rgb(0, 0, 0);">浮点数</font>
<font style="color:rgb(0, 0, 0);">浮点数值必须包含一个小数点，并且小数点后面至少有一位数字.小数点前面可以没有数字，但是不推荐这种写法.</font>

<font style="color:rgb(0, 0, 0);">下面是几种常见的浮点数值：</font>

```plain
let floatNumber1 = 2.0;
let floatNumber2 = 0.4;
let floatNumber3 = .2; // 正确，但是不推荐
```

<font style="color:rgb(0, 0, 0);">除此之外还有一些极大或者极小的数值，可以用科学计数法</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">e</font>`<font style="color:rgb(0, 0, 0);">来表示，例如：</font>

```plain
let bigNumber = 9.43e7; // 等于94300000
```

<font style="color:rgb(0, 0, 0);">上面的数值表示 9.43 乘以 10 的 7 次方.</font>

```plain
let smallNumber = 3e-7; // 等于0.0000003
```

<font style="color:rgb(0, 0, 0);">上面的数值表示 3 乘以 10 的-7 次方.</font>

#### <font style="color:rgb(0, 0, 0);">浮点数的精度丢失现象</font>
<font style="color:rgb(0, 0, 0);">浮点数值的最高精度是 17 位小数，但是在算数运算当中其精度远不如整数.</font>

<font style="color:rgb(0, 0, 0);">例如，0.1 加 0.2 的结果不是 0.3：</font>

```plain
let number1 = 0.1;
let number2 = 0.2;
console.log(number1 + number2); // 0.30000000000000004
```

<font style="color:rgb(0, 0, 0);">查看代码演示：</font>

<font style="color:rgb(255, 255, 255);background-color:rgb(108, 108, 108);">代码演示</font>

<font style="color:rgb(0, 0, 0);">因此在后面我们学习到条件判断的时候，不要使用这种判断：</font>

```plain
if (a + b == 0.3) {
  console.log('输出成功');
}
```

<font style="color:rgb(0, 0, 0);">这段代码的意思就是如果 a+b=0.3，那么就在控制台输出“输出成功”四个字.</font>

<font style="color:rgb(0, 0, 0);">因为 0.1+0.2 本来的确等于 0.3，因为精度丢失成了 0.30000000000000004，所以本来应该成立的判断条件却不成立了.</font>

### <font style="color:rgb(0, 0, 0);">NaN</font>
<font style="color:rgb(0, 0, 0);">NaN(Not a Number)即非数值.</font>

<font style="color:rgb(0, 0, 0);">简单来说，就是两个变量执行了一个运算，例如</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">+</font>`<font style="color:rgb(0, 0, 0);">、</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">-</font>`<font style="color:rgb(0, 0, 0);">、</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">*</font>`<font style="color:rgb(0, 0, 0);">、</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">/</font>`<font style="color:rgb(0, 0, 0);">当中的一种，返回的结果仍然是数字类型，但是执行的数学运算没有成功.例如：</font>

```plain
let a = 'number';
let b = 10;
let c = a / b;
console.log(c); // NaN
console.log(typeof c); // number
```

<font style="color:rgb(140, 140, 140);">上面的代码中</font>`<font style="color:rgb(140, 140, 140);background-color:rgb(245, 245, 245);">typeof</font>`<font style="color:rgb(140, 140, 140);">是用来判断变量类型的，最后返回的结果</font>`<font style="color:rgb(140, 140, 140);background-color:rgb(245, 245, 245);">number</font>`<font style="color:rgb(140, 140, 140);">表示是数字类型</font>

<font style="color:rgb(0, 0, 0);">查看完整代码演示：</font>

<font style="color:rgb(255, 255, 255);background-color:rgb(108, 108, 108);">代码演示</font>

<font style="color:rgb(0, 0, 0);">我们再回过头来看一下最开始的定义</font>

1. <font style="color:rgb(0, 0, 0);">执行了一个运算,这里执行了除法运算</font>
2. <font style="color:rgb(0, 0, 0);">返回的结果仍然是数字类型,可以从输出结果看,是</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">number</font>`<font style="color:rgb(0, 0, 0);">类型</font>
3. <font style="color:rgb(0, 0, 0);">执行的数学运算没有成功,本案例中一个字符串除以一个数字,的确是无法进行运算的.</font>

<font style="color:rgb(0, 0, 0);">通过这个定义我们还可以知道其他的一些出现</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">NaN</font>`<font style="color:rgb(0, 0, 0);">的情况,如：</font>

1. <font style="color:rgb(0, 0, 0);">0/0</font>
2. <font style="color:rgb(0, 0, 0);">字符串乘以数字</font>
3. `<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">NaN</font>`<font style="color:rgb(0, 0, 0);">和任何数进行运算,例如</font>

```plain
let a = 'number';
let b = 10;
let c = a / b;
// 此时`c`和任何数进行运算结果都是`NaN`
```

<font style="color:rgb(0, 0, 0);">目前我们知道这几个就足够了.</font>

