uniapp项目创建方式：

1.使用HBuilderX创建项目

2.通过命令行的方式创建



HBuilderX跟uniapp是同一个公司开发的

[https://dcloud.io/](https://dcloud.io/)

在官网找到HBuilderX并下载到本地，HBuilderX下载解压之后，点击HBuilderX.exe就可以运行成功了（建议创建快捷方式）

步骤：

1.下载安装HbuilderX编译器

2.通过HbuilderX创建uniapp vue3项目

3.安装uniapp -vue3编译器插件

4.运行微信开发者工具（如果编译出了问题，就去微信开发者工具开启服务端口）

<!-- 这是一张图片，ocr 内容为：H HBUILDER X 微信开发者工具 创建UNI-APP项目 安装VUE编译插件 预览,调试 开启服务端口 用VUE开发项目 编译成小程序代码 -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1724060794188-bfc76466-f001-4265-8211-79a116df7242.png)



<!-- 这是一张图片，ocr 内容为：业务页面文件存放的目录 TPAGES LINDEX LINDEX.VUE INDEX页面 存放应用引用的本地静态资源的目录(注意:静态资源只能存放于此) -STATIC 非工程代码,一般存放运行或发行的编译结果 UNPACKAGE KINDEX.HTML H5端页面 VUE初始化入口文件 -MAINJS 配置APP全局样式,监听应用生命周期 TAPP.VUE 配置页面路由,导航栏,TABBAR等页面类信息 TPAGESJSON 配置APPID,应用名称,LOGO,版本等打包信息 MANIFEST.JSON UNI-APP内置的常用样式变量 UNI.SCSS -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1724060857465-3d166564-a3c9-49f5-895d-02e7db103cfc.png)

pages.json和tabBar案例：

pages.json：配置页面路由，导航栏，tabBar等页面信息

<!-- 这是一张图片，ocr 内容为：23.25 首页 I HELLO -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1724060991517-f3e73f96-b62f-4bcf-8578-b72ac5f1f688.png)案例Demo



<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1724062005104-9813a044-6962-4ca6-b59a-a6062b9aeff3.png)<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1724062005073-07e119ba-3a49-4ebb-81a9-5869400fcc37.png)<!-- 这是一张图片，ocr 内容为：98 -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1724062005083-8792c19b-2419-4d6e-a48b-cffd990df110.png)<!-- 这是一张图片，ocr 内容为：88 -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1724062005102-7ee50806-6467-428e-9680-49bcdcb38ea4.png)<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1724062005219-68387bfa-afe3-44ae-8604-0c5e354093ee.png)<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1724062005631-b57f92b2-bda0-4b0c-985d-92e8e9828e3b.png)<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1724062005624-7d884ebb-e8a7-4e69-8db7-1e8de3e864f9.png)<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1724062005634-881ad7a7-08ed-4aed-a6a8-019fd20fd7be.png)

**uniapp 和原生小程序开发的区别：**

每一个页面是一个.vue文件，数据绑定及事件处理同vue.js规范：

1.属性绑定 src = "{{ url }}" 升级为了 :src = "url"

2.事件绑定  bindtap = "eventName" 升级成了 @tap = "eventName" ，支持（）传参

3.支持vue常用指令： v-for    v-if     v-show   v-model等



提示：调用接口能力，建议前缀wx替换为uni，养成好习惯，这样支持多端开发

用swiper实现轮播图，swiper-item实现其中的每一项

```plain
	<swiper class="banner" indicator-dots circular :autoplay="false">
		<swiper-item v-for="item in pictures" :key="item.id">
			<image @tap="onPreviewImage(item.url)" :src="item.url"></image>
		</swiper-item>
	</swiper>
	<view class="box">
		111
	</view>
```

```plain
<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">{{title}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>

```



命令行工具创建：  
	vue3+ts版： npx degit dcloudio/uni-preset-vue#vite-ts 项目名称

<!-- 这是一张图片，ocr 内容为：官网链接:HTTPS://UNIAPP.DCLOUD.NET.CN/QUICKSTART-CLI.HTML#创建UNI-APP -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1724069797340-ec911fdc-75e1-4b2f-80c2-86fc13c0bd92.png)

<!-- 这是一张图片，ocr 内容为：编译和运行UNI-APP项目: NPX DEGIT XX 创建项目 导入微信开发者工具 MANIFEST.JSON 添加 APPID PNPM DEV:MP-WEIXIN PNPM INSTALL -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1724069871355-b65ae8f4-fcb9-46d2-917f-53fae46f0cd8.png)





如果使用命令行工具的话，还是使用vscode，运维vscode对于ts类型支持友好，熟悉的编译器。而HbuilderX对ts类型支持暂不完善

<!-- 这是一张图片，ocr 内容为：用VSCODE开发UNI-APP项目 文件()  选择(S)       传致G)  传致G)  按徽(5) 中 扩展 快速创建页面 GRECOMMENDED GO 0 工作区推荐 O UNI-CREATE-VIEW 快速UNI-APP页面 安装UNI-APP插件 快速创建UNIAPP视图与组件! UNI-APP代码提示 毛先生 UNI-HELPER UNI-APP代码提示 增强UNI-APP 系列产品在VSCODE 内 出 UNI HELPER 鼠标悬停查文档 UNIAPP小程序扩展 鼠标悬停查文档 可能是最好用的UNIAPP小程序扩展自 EVIIS -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1724069965040-e8023dd0-6af1-43a5-bd9f-17aae21854e8.png)







项目基础架构：使用uni-ui组件库。

程序架构分为三部分：构建界面，状态管理，数据交互



1.构建界面：1.安装uni-ui (官方出品)	2.组件的自动引入	3.配置ts类型

使用npm安装：	

```plain
npm i @dcloudio/uni-ui
```



<!-- 这是一张图片，ocr 内容为：基础架构-使用UNI-UI组件库 PNPM I @DCLOUDIO/UNI-UI 安装UNI-UI PAGES.JSON EASYCOM": 构建界面 组件自动引入 "AUTOSCAN":TRUE, "CUSTOM": // UNI-UI 规则如下配置 "JUNI-(*)":"@DCLOUDIO/UNI-UI/LIB/UNI-$1/UNI-$1.VUE" 配置TS类型 "PAGES": 小兔鲜儿小程序 状态管理 1 @UNI-HELPER/UNI-UI-TYPES PNPM I-L TSCONFIG.JSON "COMPILEROPTIONS": 数据交互 "TYPES": "@DCLOUDIO/TYPES". "@TYPES/WECHAT-MINIPROGRAM". "UNI-HELPER/UNI-APP-TYPES". @UNI-HELPER/UNI-UI-TYPES" -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1724079893889-d9fd42a3-98a1-441b-9a18-6c76ea857d4e.png)





小程序端Pinia持久化

<!-- 这是一张图片，ocr 内容为：MEMBER.TS INDEX.TS 资源管理器 MAIN.TS MY.VUE INDEXTS>[E]PINIA SRC >STORES> HEIMA-SHOP IMPORT { CREATEPINIA } FROM 'PINIA' .HUSKY VSCODE IMPORT PERSIST FROM 'PINIA-PLUGIN-PERSISTEDSTATE' DIST NODE_MODULES 4//创建PINIA实例 SRC 5 CONST PINIA CREATEPINIA( COMPONENTS COMPOSABLES // 使用持久化存储插件 9 PAGES 7 PINIA.USE(PERSIST) SERVICES 8 STATIC //默认导出,给 MAIN.TS 使用 6 STORES 10 MODULES EXPORT DEFAULT PINIA MEMBER.TS 11 INDEX.TS //模块统一导出 12 STYLES 13 EXPORT*FROM UTILS 14 APP.VUE ENV.D.TS MAIN.TS MANIFEST JSON -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1724080000679-89af0771-a776-4f66-a8ad-6d7fb33b82e9.png)

## <font style="color:rgb(51, 51, 51);">小程序端 Pinia 持久化</font>
<font style="color:rgb(51, 51, 51);">说明：</font>`<font style="color:rgb(51, 51, 51);background-color:rgb(243, 244, 244);">Pinia</font>`<font style="color:rgb(51, 51, 51);"> 用法与 </font>`<font style="color:rgb(51, 51, 51);background-color:rgb(243, 244, 244);">Vue3</font>`<font style="color:rgb(51, 51, 51);"> 项目完全一致，</font>`<font style="color:rgb(51, 51, 51);background-color:rgb(243, 244, 244);">uni-app</font>`<font style="color:rgb(51, 51, 51);"> 项目仅需解决</font>**<font style="color:rgb(51, 51, 51);">持久化插件兼容性</font>**<font style="color:rgb(51, 51, 51);">问题。</font>

### <font style="color:rgb(51, 51, 51);">持久化存储插件</font>
<font style="color:rgb(51, 51, 51);">安装持久化存储插件： </font>[<font style="color:rgb(51, 51, 51);">pinia-plugin-persistedstate</font>](https://prazdevs.github.io/pinia-plugin-persistedstate/zh/guide/config.html#storage)

pnpm i pinia-plugin-persistedstate

<font style="color:rgb(51, 51, 51);">插件默认使用 </font>`<font style="color:rgb(51, 51, 51);background-color:rgb(243, 244, 244);">localStorage</font>`<font style="color:rgb(51, 51, 51);"> 实现持久化，小程序端不兼容，需要替换持久化 API。</font>

### <font style="color:rgb(51, 51, 51);">基本用法</font>
<font style="color:rgb(51, 51, 51);">::: code-group</font>

```plain
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 定义 Store
export const useMemberStore = defineStore(
  'member',
  () => {
    // 会员信息
    const profile = ref<any>()

    // 保存会员信息，登录时使用
    const setProfile = (val: any) => {
      profile.value = val
    }

    // 清理会员信息，退出时使用
    const clearProfile = () => {
      profile.value = undefined
    }

    // 记得 return
    return {
      profile,
      setProfile,
      clearProfile,
    }
  },
  // TODO: 持久化
  {
    persist: true,
  },
)
```

```plain
import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

// 创建 pinia 实例
const pinia = createPinia()
// 使用持久化存储插件
pinia.use(persist)

// 默认导出，给 main.ts 使用
export default pinia

// 模块统一导出
export * from './modules/member'
```

```plain
import { createSSRApp } from 'vue'
import pinia from './stores'

import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)

  app.use(pinia)
  return {
    app,
  }
}
```

<font style="color:rgb(51, 51, 51);">:::</font>

### <font style="color:rgb(51, 51, 51);">多端兼容</font>
**<font style="color:rgb(51, 51, 51);">网页端持久化 API</font>**

```plain
// 网页端API
localStorage.setItem()
localStorage.getItem()
```

**<font style="color:rgb(51, 51, 51);">多端持久化 API</font>**

```plain
// 兼容多端API
uni.setStorageSync()
uni.getStorageSync()
```

**<font style="color:rgb(51, 51, 51);">参考代码</font>**

```plain
// stores/modules/member.ts
export const useMemberStore = defineStore(
  'member',
  () => {
    //…省略
  },
  {
    // 配置持久化
    persist: {
      // 调整为兼容多端的API
      storage: {
        setItem(key, value) {
          uni.setStorageSync(key, value) // [!code warning]
        },
        getItem(key) {
          return uni.getStorageSync(key) // [!code warning]
        },
      },
    },
  },
)
```

## <font style="color:rgb(51, 51, 51);">uni.request 请求封装</font>
### <font style="color:rgb(51, 51, 51);">请求和上传文件拦截器</font>
**<font style="color:rgb(51, 51, 51);">uniapp 拦截器</font>**<font style="color:rgb(51, 51, 51);">： </font>[<font style="color:rgb(51, 51, 51);">uni.addInterceptor</font>](https://uniapp.dcloud.net.cn/api/interceptor.html)

**<font style="color:rgb(51, 51, 51);">接口说明</font>**<font style="color:rgb(51, 51, 51);">：</font>[<font style="color:rgb(51, 51, 51);">接口文档</font>](https://www.apifox.cn/apidoc/shared-0e6ee326-d646-41bd-9214-29dbf47648fa/doc-1521513)

<font style="color:rgb(51, 51, 51);">::: tip 实现需求</font>

1. <font style="color:rgb(51, 51, 51);">拼接基础地址</font>
2. <font style="color:rgb(51, 51, 51);">设置超时时间</font>
3. <font style="color:rgb(51, 51, 51);">添加请求头标识</font>
4. <font style="color:rgb(51, 51, 51);">添加 token</font><font style="color:rgb(51, 51, 51);">:::</font>

**<font style="color:rgb(51, 51, 51);">参考代码</font>**

```plain
// src/utils/http.ts

// 请求基地址
const baseURL = 'https://pcapi-xiaotuxian-front-devtest.itheima.net'

// 拦截器配置
const httpInterceptor = {
  // 拦截前触发
  invoke(options: UniApp.RequestOptions) {
    // 1. 非 http 开头需拼接地址
    if (!options.url.startsWith('http')) {
      options.url = baseURL + options.url
    }
    // 2. 请求超时
    options.timeout = 10000
    // 3. 添加小程序端请求头标识
    options.header = {
      'source-client': 'miniapp',
      ...options.header,
    }
    // 4. 添加 token 请求头标识
    const memberStore = useMemberStore()
    const token = memberStore.profile?.token
    if (token) {
      options.header.Authorization = token
    }
  },
}

// 拦截 request 请求
uni.addInterceptor('request', httpInterceptor)
// 拦截 uploadFile 文件上传
uni.addInterceptor('uploadFile', httpInterceptor)
```

<font style="color:rgb(51, 51, 51);">::: warning 注意事项</font>

<font style="color:rgb(51, 51, 51);">微信小程序端，需登录 </font>[<font style="color:rgb(51, 51, 51);">微信公众平台</font>](https://mp.weixin.qq.com/)<font style="color:rgb(51, 51, 51);"> 配置合法域名 </font><font style="color:rgb(51, 51, 51);">👇</font>

`<font style="color:rgb(51, 51, 51);background-color:rgb(243, 244, 244);">https://pcapi-xiaotuxian-front-devtest.itheima.net</font>`

<font style="color:rgb(51, 51, 51);">:::</font>

### <font style="color:rgb(51, 51, 51);">封装 Promise 请求函数</font>
<font style="color:rgb(51, 51, 51);">::: tip 实现需求</font>

1. <font style="color:rgb(51, 51, 51);">返回 Promise 对象，用于处理返回值类型</font>
2. <font style="color:rgb(51, 51, 51);">成功 resolve</font>
    1. <font style="color:rgb(51, 51, 51);">提取数据</font>
    2. <font style="color:rgb(51, 51, 51);">添加泛型</font>
3. <font style="color:rgb(51, 51, 51);">失败 reject</font>
    1. <font style="color:rgb(51, 51, 51);">401 错误</font>
    2. <font style="color:rgb(51, 51, 51);">其他错误</font>
    3. <font style="color:rgb(51, 51, 51);">网络错误</font>

<font style="color:rgb(51, 51, 51);">:::</font>

**<font style="color:rgb(51, 51, 51);">参考代码</font>**

```plain
/**
 * 请求函数
 * @param  UniApp.RequestOptions
 * @returns Promise
 *  1. 返回 Promise 对象，用于处理返回值类型
 *  2. 获取数据成功
 *    2.1 提取核心数据 res.data
 *    2.2 添加类型，支持泛型
 *  3. 获取数据失败
 *    3.1 401错误  -> 清理用户信息，跳转到登录页
 *    3.2 其他错误 -> 根据后端错误信息轻提示
 *    3.3 网络错误 -> 提示用户换网络
 */
type Data<T> = {
  code: string
  msg: string
  result: T
}
// 2.2 添加类型，支持泛型
export const http = <T>(options: UniApp.RequestOptions) => {
  // 1. 返回 Promise 对象
  return new Promise<Data<T>>((resolve, reject) => {
    uni.request({
      ...options,
      // 响应成功
      success(res) {
        // 状态码 2xx，参考 axios 的设计
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // 2.1 提取核心数据 res.data
          resolve(res.data as Data<T>)
        } else if (res.statusCode === 401) {
          // 401错误  -> 清理用户信息，跳转到登录页
          const memberStore = useMemberStore()
          memberStore.clearProfile()
          uni.navigateTo({ url: '/pages/login/login' })
          reject(res)
        } else {
          // 其他错误 -> 根据后端错误信息轻提示
          uni.showToast({
            icon: 'none',
            title: (res.data as Data<T>).msg || '请求错误',
          })
          reject(res)
        }
      },
      // 响应失败
      fail(err) {
        uni.showToast({
          icon: 'none',
          title: '网络错误，换个网络试试',
        })
        reject(err)
      },
    })
  })
}
```

## <font style="color:rgb(51, 51, 51);">【拓展】代码规范</font>
**<font style="color:rgb(51, 51, 51);">为什么需要代码规范</font>**

<font style="color:rgb(51, 51, 51);">如果没有统一代码风格，团队协作不便于查看代码提交时所做的修改。</font>

### <font style="color:rgb(51, 51, 51);">统一代码风格</font>
+ <font style="color:rgb(51, 51, 51);">安装 </font>`<font style="color:rgb(51, 51, 51);background-color:rgb(243, 244, 244);">eslint</font>`<font style="color:rgb(51, 51, 51);"> + </font>`<font style="color:rgb(51, 51, 51);background-color:rgb(243, 244, 244);">prettier</font>`

<font style="color:rgb(51, 51, 51);">pnpm i -D eslint prettier eslint-plugin-vue @vue/eslint-config-prettier @vue/eslint-config-typescript @rushstack/eslint-patch @vue/tsconfig</font>

+ <font style="color:rgb(51, 51, 51);">新建 </font>`<font style="color:rgb(51, 51, 51);background-color:rgb(243, 244, 244);">.eslintrc.cjs</font>`<font style="color:rgb(51, 51, 51);"> 文件，添加以下 </font>`<font style="color:rgb(51, 51, 51);background-color:rgb(243, 244, 244);">eslint</font>`<font style="color:rgb(51, 51, 51);"> 配置</font>

```plain
/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier',
  ],
  // 小程序全局变量
  globals: {
    uni: true,
    wx: true,
    WechatMiniprogram: true,
    getCurrentPages: true,
    getApp: true,
    UniApp: true,
    UniHelper: true,
    App: true,
    Page: true,
    Component: true,
    AnyObject: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'prettier/prettier': [
      'warn',
      {
        singleQuote: true,
        semi: false,
        printWidth: 100,
        trailingComma: 'all',
        endOfLine: 'auto',
      },
    ],
    'vue/multi-word-component-names': ['off'],
    'vue/no-setup-props-destructure': ['off'],
    'vue/no-deprecated-html-element-is': ['off'],
    '@typescript-eslint/no-unused-vars': ['off'],
  },
}
```

+ <font style="color:rgb(51, 51, 51);">配置 </font>`<font style="color:rgb(51, 51, 51);background-color:rgb(243, 244, 244);">package.json</font>`

```plain
{
  "script": {
    // ... 省略 ...
    "lint": "eslint . --ext .vue,.js,.ts --fix --ignore-path .gitignore"
  }
}
```

+ <font style="color:rgb(51, 51, 51);">运行</font>

<font style="color:rgb(51, 51, 51);">pnpm lint</font>

<font style="color:rgb(51, 51, 51);">::: tip 温馨提示到此，你已完成 </font>`<font style="color:rgb(51, 51, 51);background-color:rgb(243, 244, 244);">eslint</font>`<font style="color:rgb(51, 51, 51);"> + </font>`<font style="color:rgb(51, 51, 51);background-color:rgb(243, 244, 244);">prettier</font>`<font style="color:rgb(51, 51, 51);"> 的配置。:::</font>

<font style="color:rgb(51, 51, 51);"></font>

<font style="color:rgb(51, 51, 51);"></font>

<font style="color:rgb(51, 51, 51);"></font>

<font style="color:rgb(51, 51, 51);"></font>

<font style="color:rgb(51, 51, 51);"></font>

<font style="color:rgb(51, 51, 51);"></font>

<font style="color:rgb(51, 51, 51);"></font>

<font style="color:rgb(51, 51, 51);"></font>

```plain
<template>
	<view class="login">
		<view class="input-box">
		    <view class="pre-text">手机号:</view>
		    <input type="text" placeholder="输入手机号" v-model="userName" />
		</view>
		<view class="input-box">
		    <view class="pre-text">密码:</view>
		    <input type="password" placeholder="输入密码" v-model="password" />
		</view>
	</view>
</template>

<script setup>
import {ref} from 'vue';
</script>

<style lang="scss">
.login {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 0 60px;
  margin-top: 172px;
  .input-box {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 20px 0;
    margin-bottom: 80px;
    border-bottom: 2px solid #e3e3ed;
    .pre-text {
      flex: none;
      width: 140px;
      font-weight: 600;
      text-align: left;
      font-size: 20px;
      color: #000000;
    }
    input {
      flex: 1;
      border: none;
      outline: none;
      font-weight: 500;
      font-size: 22px;
      color: #171717;
    }
    input::-webkit-input-placeholder {
      font-weight: 500;
      font-size: 30px;
      line-height: 42px;
      color: #d7d7e5;
    }
  }
  .login-btn {
    width: 100%;
    height: 94px;
    background: #00c2c3;
    font-weight: 500;
    font-size: 32px;
    text-align: center;
    line-height: 94px;
    color: #ffffff;
  }
}
</style>

```



npm install -g @vue/cli 



<!-- 这是一张图片，ocr 内容为：<TEMPLATE> HOVER-CLASS-"BOXHOVER">VIEW布局标签</VIEW> <VIEW CLASS"BOX" </TEMPLATE> SETUPY <SCRIPT </SCRIPT> <STYLE LANG-"SCSS"> .BOXT WIDTH:200PX; HEIGHT: 200PX; BACKGROUND:#CCC; ,BOXHOVERL BACKGROUND: ORANGE T -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1724467714066-6fe4349e-a816-46f3-874e-3b4095464948.png)

1.属性使用Hover即可在鼠标指针到目的位置的时候颜色改变，跟css的:hover一样

<!-- 这是一张图片，ocr 内容为：<TEMPLATE> <VIEW CLASS-"BOX" HOVER-CLASS-"BOXHOVER"> <VIEW CLASS二"INNER"HOVER-CLASS二"INNERHOVE">内部元素</VIEWZ </VIEW> </TEMPLATE> <SCRIPT SETUP> </SCRIPT> -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1724468006672-da3f6d87-2845-45c0-8df3-484111eb8279.png)

记得要加一个hover-class



如何实现只想要子元素改变，而不改变父元素：

使用hover-stop-propagation

<!-- 这是一张图片，ocr 内容为：ASS-"INNER" HOVER-CLASS-"INNERHOVER" HOVER-STOP-PROPAGATION-"TRUE">内部元素</VI CLASS" <VIEW EW> -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1724468113024-3a0dd615-43b5-4a91-84b6-52d4c365e843.png)







路由和页面跳转：

navigator路由：

navigator类似于html的a标签，但是只能跳转本地页面，目标页面必须要在pages.json里面注册

<!-- 这是一张图片，ocr 内容为：<VIEW> <NAVIGATOR URL-"/PAGES/DEMO1/DEMO1">跳转到DEMO1</NAVIGATOR> </VIEW> -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1724470671879-e0e34521-37c4-4f1f-a77c-c69ec9784ddd.png)

这样就可了



<!-- 这是一张图片，ocr 内容为：INDEX TABBAR 12 MY ] 13 'LIST" ESLINTREJS APP.JS 14 APP.JSON 15 PAGES/INDEX/INDEX", PAGEPATH APP.WXSS TEXT":"主题", 16 PROJECT.CONFIGJSON PROJECT.PRIVATE.CONFIG.JS... ICONPATH":"IMAGES/THEMEPNG" 17 SITEMAPJSON I'SELECTEDRCONPATH":"IMAGES/THEME.PNG" 18 19 20 "PAGES/MY/INDEX", 21 PAGEPATH "TEXT":"我的", 22 IMAGES/MY.PNG ICONPATH": 23 "SELECTEDICONPATH":"IMAGES/MY.PNG" 24 25 26 27 子 28 -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1724472097166-2351d088-94f7-4583-a407-989bf8a93361.png)

<!-- 这是一张图片，ocr 内容为：TABBAR CUSTOM' TRUE "LIST": PAGEPATH TEXT"主题 ICONPATH": 'SELECTEDRCONP -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1724472274709-8f511d85-f0b8-460d-9ceb-99ac5deb090d.png)

