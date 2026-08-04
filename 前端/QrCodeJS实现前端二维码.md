<!-- 这是一张图片，ocr 内容为：复制链接分享 直接用ARCO DESIGN的可复制文本组件,也可以使用文本复制组件,比如 公如COPY-TEXT-TO-CLIPBOARD:HTTPS://WWW.NPMJS.CO M/PACKAGE/COPY-TEXT-TO-CLIPBOARD. 移动端扫码分享 移动端扫码分享可以使用 GRCODE 组件:HTTPS://WWW.NPMJS.COM/PACKAGE/QRCODE 原理是将链接作为文本,转换为二维码图片. 小知识:可以接入微信15-SK实现微信卡片分享能力,用户在网页内分享到微信时,用户看到的不再是一个于巴巴的链 接,而是可以自定义展示的标题和图片. 如图: 17841850974155571 17841850974155571 00 HTTPS://WWW.LAOYUJIANLI.COM/ 通用简历范文-老鱼简历 后端开发,有1段工作经 历,有1段项目经历 1784185097415557121 1784185097415557121 1784185097415557121 参考文档: HTTPS://DEVELOPERS.WEIXIN.QQ.COM/DOC/OFFIACCOUNT/OA WEB.APPS/JS-SDK.HTML#10 -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1730619807572-db512aa8-d459-43fa-8c24-9f970516d006.png)

[https://www.npmjs.com/package/qrcode](https://www.npmjs.com/package/qrcode)

[https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html#10](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html#10)

实现通用分享组件：



项目中引入QrCode

```java
npm install --save qrcode
```

定义ShareModal.vue

```java
<template>
  <div>{{ link }}</div>
  <img :src="codeImg" />
</template>

<script setup lang="ts">
import QRCode from "qrcode";
import { ref } from "vue";

const link = "https://laoyujianli.com/share/yupi";
const codeImg = ref();

// With promises
QRCode.toDataURL(link)
  .then((url) => {
    console.log(url);
    codeImg.value = url;
  })
  .catch((err) => {
    console.error(err);
  });
</script>

```

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1730619879145-f8106504-a1d0-4879-b0d2-51fc6cbfda7a.png)

3.编写弹窗界面代码：

使用ArcoDesign的Modal组件，支持传入title标题和link分享链接属性

```java
<template>
  <a-modal v-model:visible="visible" @cancel="closeModal" :footer="false">
    <template #title> 分享</template>
    <h4 style="margin-top: 0">复制分享链接</h4>
    <a-typography-paragraph copyable>
      {{ link }}
    </a-typography-paragraph>
    <h4>手机扫码查看</h4>
    < :src="code" />
  </a-modal>
</template>

<script setup lang="ts">
// @ts-ignore
import QRCode from "qrcode";
import { defineProps, ref, withDefaults } from "vue";

/**
 * 定义组件属性类型
 */
interface Props {
  title: string;
  link: string;
}

/**
 * 给组件指定初始值
 */
const props = withDefaults(defineProps<Props>(), {
  title: () => "分享",
  link: () => "https://laoyujianli.com/share/yupi",
});

// 是否可见
const visible = ref(false);
// 要展示的图片
const code = ref();

// 打开弹窗
const openModal = () => {
  visible.value = true;
};

// 关闭弹窗
const closeModal = () => {
  visible.value = false;
};

// 二维码生成
QRCode.toDataURL(props.link)
  .then((url: string) => {
    code.value = url;
  })
  .catch((err: any) => {
    console.error(err);
  });
</script>
```

为了方便页面中使用组件，需要暴露出ioenModal函数

```java
import { defineExpose } from "vue";

// 暴露函数给父组件
defineExpose({
  openModal,
});
```

页面中使用组件

1.页面代码引入：

```java
<ShareModal ref="shareModalRef" :link="shareLink" />
```

2.定义分享函数，打开分享弹窗

注意分享链接的路径要正确，代码如下：

```java
// 分享弹窗引用
const shareModalRef = ref();
// 分享链接
const shareLink = `${window.location.protocol}//${window.location.host}/app/detail/${props.app.id}`;
// 分享
const doShare = (e: Event) => {
  if (shareModalRef.value) {
    shareModalRef.value.openModal();
  }
  e.stopPropagation();
};

```

```vue
<template>
  <a-modal v-model:visible="visible" :footer="false" @cancel="closeModal">
    <template #title>
      {{ title }}
    </template>
    <h4 style="margin-top: 0">复制分享链接</h4>
    <a-typography-paragraph copyable>{{ link }}</a-typography-paragraph>
    <h4>手机扫码查看</h4>
    <img :src="codeImg" />
  </a-modal>
</template>

<script setup lang="ts">
import { defineExpose, defineProps, ref, withDefaults } from "vue";
// @ts-ignore
import QRCode from "qrcode";
import message from "@arco-design/web-vue/es/message";

/**
 * 定义组件属性类型
 */
interface Props {
  // 分享链接
  link: string;
  // 弹窗标题
  title: string;
}

/**
 * 给组件指定初始值
 */
const props = withDefaults(defineProps<Props>(), {
  link: () => "https://laoyujianli.com/share/yupi",
  title: () => "分享",
});

// 要展示的图片
const codeImg = ref();

// 是否可见
const visible = ref(false);

// 打开弹窗
const openModal = () => {
  visible.value = true;
};

// 暴露函数给父组件
defineExpose({
  openModal,
});

// 关闭弹窗
const closeModal = () => {
  visible.value = false;
};

// 二维码生成
QRCode.toDataURL(props.link)
  .then((url: any) => {
    codeImg.value = url;
  })
  .catch((err: any) => {
    console.error(err);
    message.error("生成二维码失败，" + err.message);
  });
</script>

<style scoped></style>
```

