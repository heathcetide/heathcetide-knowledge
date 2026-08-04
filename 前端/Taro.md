是一款开放式跨段跨框架解决方案，支持使用React/Vue/Nerv等框架开发微信/京东/百度/支付宝/字节跳动/QQ小程序/H5/RN等应用



Taro支持使用React/Vue/Vue3/Nerv框架

<!-- 这是一张图片，ocr 内容为：支持转换的平台有: H5 REACTNATIVE 微信小程序 京东小程序 百度小程序 支付宝小程序 字节跳动小程序 QQ小程序 钉钉小程序 企业微信小程序 支付宝IOT小程序 -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1720972760086-87fd81b1-9ada-4093-899c-ca7962675686.png)

安装taro

```go
# 使用 npm 安装
$ npm install -g @tarojs/cli@3.2.0

# 或者 使用 yarn 安装
$ yarn global add @tarojs/cli

# 如果安装了 cnpm，可以使用 cnpm 安装
$ cnpm install -g @tarojs/cli@3.2.0
```

安装之后查看版本

```go
npm info @tarojs/cli
```

创建初始化工程

```go
taro init project-name
```

如果遇到了改了半天没啥用就清理一下缓存，如果清理了缓存还是没啥用，就删了项目重开





小程序中用view标签代替div标签，但是它的功能要比div丰富多了

实现横向布局和纵向布局

```go
<!-- /src/pages/taro-components/layout/view/index.vue -->
<DemoBlock title="横向布局">
  <view class="flex flex-row">
    <view class="w-40 h-20 bg-blue-200"></view>
    <view class="w-40 h-20 bg-blue-400"></view>
    <view class="w-40 h-20 bg-blue-600"></view>
  </view>
</DemoBlock>
<DemoBlock title="纵向布局">
  <view class="flex flex-col">
    <view class="w-40 h-20 bg-blue-200"></view>
    <view class="w-40 h-20 bg-blue-400"></view>
    <view class="w-40 h-20 bg-blue-600"></view>
  </view>
</DemoBlock>
```

```plain
// 引入组件
import DemoBlock from "@/components/demo-block.vue";
```

view组件除了当作一个盒子来布局之外，还有很多其他的功能，外卖来看看它的属性列表：  
<!-- 这是一张图片，ocr 内容为：是否必填 类型 说明 默认值 参数 指定按下去 HOVERCLAS 否 STRING NONE 的样式类 S 是否阻止本 HOVERSTO 节点的祖先 BOOLEANFASLE PPROPAGA 节点出现点 TION 击态 点击后多久 出现HOVE HOVERSTAR 50 否 NUMBER RCLASS的 TTIME 效果 点击后多久 HOVERCLAS HOVERSTAY 否 400 NUMBER TIME S的效果会 消失 阻止滚动穿 CATCHMOV BOOLEANFALSE 透 E -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1723627814861-cadac0d2-501c-4bd8-b468-3989a9ea6dd7.png)



可以去查阅Taro官方组件库的viewProps去使用。[https://taro-docs.jd.com/docs/](https://taro-docs.jd.com/docs/)



hoverClass：拿到属性列表以后，实现组件的功能分为两步：

1.将组件在页面中写出来：

```go
<!-- 书写组件 -->
<view></view>
```

2.根据属性列表给组件中添加属性：

```go
<!-- 属性的值是字符串，可以将tailwind的类名添加进去，也可以添加我们自己写好的css类 -->
<view hoverClass="bg-blue-500"></view>
```

如果添加的属性是一个变量，那么在属性面前要加上冒号：

```go
<DemoBlock title="hoverClass" :needNotice="true">
  <view class="w-40 h-20 bg-blue-300" hoverClass="bg-blue-500"></view>
  <template v-slot:notice>点击色块后，色块会改变颜色</template>
</DemoBlock>
```

<!-- 这是一张图片，ocr 内容为：属性值为 DEMOBLOCK 的时候,通过冻加 这段代码在使用 NEEDNOTICE ;具名插槽,这样我们就可以在插槽 的方式,对外开放了 NOTICE TRUE 里添加一些解释信息. NOTICE插槽里只需要写文本即可,因为在组件内部已经写好了样 式. -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1723628016462-9e709c26-be2c-47b5-bacd-bf13217dd5f7.png)



Swiper组件：

其属性跟view组件的属性大同小异，值得一提的是swiper组件的current属性和onChange属性；

Swiper组件结构

```go
错误代码
<swiper>
  <view>item1</view>
  <view>item2</view>
  <view>item2</view>
  <view>item3</view>
</swiper>
```

```go
正确代码：
<swiper>
  <swiper-item>
    <!-- 滑动组件的内容，可以是view也可以是图片、文字等 -->
    <view>1</view>
  </swiper-item>
  <swiper-item>
    <view>1</view>
  </swiper-item>
  <swiper-item>
    <view>1</view>
  </swiper-item>
</swiper>
```

current属性：

```go
<template>
  <swiper
    class="h h-44"
    :circular="true"
    :current="current"
    :onChange="onchange"
  >
    <swiper-item v-for="index in 8" :key="index + 'swiperItem'">
      <view
        :class="[
          'h-full',
          'flex',
          'justify-center',
          'items-center',
          'text-4xl',
          `bg-purple-${index * 100}`,
        ]"
        >{{ index }}</view
      >
    </swiper-item>
  </swiper>
  <!-- 添加按钮 -->
  <view @tap="addCurrent">current+1</view>
</template>

<script setup>
import { ref } from 'vue'

const current = ref(0);
// 改变current的值，观察滑块是否移动
function addCurrent(){
  if(current.value > 7){
    return;
  }
  current.value++;
}
</script>
```

onChange方法

```go
// 初始化current并与组件中的current属性绑定
const current = ref(0);
// 初始化数字按钮的值
const data = ref([0, 1, 2, 3, 4, 5, 6, 7]);

// swiper组件的onChange属性的方法体
const onchange = (e) => {
  current.value = e.detail.current;
};

// 数字按钮的点击方法
const change = (e, index) => {
  current.value = index;
};

```

<!-- 这是一张图片，ocr 内容为：对上面的代码解释一下: 1.点击数字按钮,改变CURRENT的值,CURRENT的值改变,滑 块滑动 ONCHANGE函数,该函数改变 2.滑动滑块,触发ON CURRENT变 CURRENT,从而改变数字按钮的样式 量为当前滑块的 -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1723628291535-3b3affb9-a78f-47aa-8fd1-30ce09a383b3.png)

Text

<!-- 这是一张图片，ocr 内容为：本节课要学习的是组件库里面的基础组件 TEXT 是否必填 类型 默认值 说明 参数 文本是否可 否 FALSE BOOLEAN SELECTABLE 选 "ENSP" 显示连续空 否 'EMSP", SPACE 格 "DSQU 否 是否解码 FALSE DECODE BOOLEAN 虽然文本节点的属性有三个,但是在开发中我们不会用这些属性,只 会将它当做是一个SPAN标签来用. -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1723628328544-46b86d1b-9b4c-4590-bc92-cc42d0e0e51b.png)

将text当作span来使用就好了



Progress进度条组件：

```plain
<progress :percent="20" />
```

<font style="color:rgb(0, 0, 0);">这里的</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">:percent="20"</font>`<font style="color:rgb(0, 0, 0);">的意思是当前进度为</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">20%</font>`<font style="color:rgb(0, 0, 0);">，但是这么写进度条是没有进度动画的，需要加属性</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">:active="true"</font>`<font style="color:rgb(0, 0, 0);">。</font>

<font style="color:rgb(0, 0, 0);">这里需要讲一点 vue 的知识，当给</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">props</font>`<font style="color:rgb(0, 0, 0);">传递的值是字符串时，可以不用在属性前面添加冒号(:)，比如</font>`<font style="color:rgb(0, 0, 0);background-color:rgb(245, 245, 245);">message="当前进度"</font>`<font style="color:rgb(0, 0, 0);">。</font>

<font style="color:rgb(0, 0, 0);">但是，当传递的是非字符串的值，就需要加冒号(:)，比如：</font>

```plain
<!-- 下面的代码传递的是字符串1 -->
<component-a message="1"></component-a>
<!-- 下面的代码传递的是数字1 -->
<component-a :message="1"></component-a>
```

<font style="color:rgb(0, 0, 0);">所以要给进度条组件添加 active 为 true 的属性，就需要用冒号。</font>

```plain
<progress :percent="20" :active="true" />
```

<font style="color:rgb(0, 0, 0);">像上面这样写，进度条就会有从 0~~20 的进度了。</font>

### <font style="color:rgb(0, 0, 0);">动态设置进度</font>
<font style="color:rgb(0, 0, 0);">动态设置进度其实也很简单，只需要定义一个进度变量，以及一个可以改变进度变量值的按钮即可：</font>

1. <font style="color:rgb(0, 0, 0);">定义进度变量</font>

<font style="color:rgb(0, 0, 0);">在标签上绑定进度变量，在 script 中定义进度变量 persent。</font>

```plain
<template>
  <!-- 进度绑定为变量 -->
  <progress :persent="persent" :active="true" />
</template>

<script setup>
import { ref } from 'vue';

// 定义进度变量
const persent = ref(0);
</script>
```

1. <font style="color:rgb(0, 0, 0);">点击修改进度变量的值</font>

```plain
<template>
  <!-- 进度绑定为变量 -->
  <progress :persent="persent" :active="true" />
  <view @tap="changePersent">80%</view>
</template>

<script setup>
import { ref } from 'vue';

// 定义进度变量
const persent = ref(0);

// 修改进度
function(){
  persent.value = 80;
}
</script>
```

<font style="color:rgb(0, 0, 0);">点击按钮，改变 persent 的值，从而改变进度。</font>

<font style="color:rgb(140, 140, 140);">这里要说明的是，taro 使用 tap 事件来替代 click 事件。</font>

<font style="color:rgb(0, 0, 0);">点击修改进度，并以动画的形式呈现出来的小案例就实现咯。快来一起实现吧~</font>  
 

