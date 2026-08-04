在使用内网穿透工具ngrok的过程中，它的官网需要用邮箱或者github的账号进行登录，但是我用qq.com登录之后球用没有，然后我就选择去注册一个比较通用一些的邮箱（其实我后面发现QQ邮箱的改变（有另一种邮箱格式那个应该是可以的）），这个Zoho邮箱支持购买或者自定义域名，我觉得很牛逼



[https://accounts.zoho.com/home#profile/personal](https://accounts.zoho.com/home#profile/personal)邮箱官网，进行注册就好了。

<!-- 这是一张图片，ocr 内容为：CETIDE HEATH-CETIDE@ZOHOMAIL.COM 用户ID:860150090 -->
![](https://cdn.nlark.com/yuque/0/2024/png/43218187/1730618497123-dfada43e-782c-4f35-9fd0-e6d2d6e00b7a.png)

搭建 Zoho Mail 来使用自定义域名的邮箱是一个相对简单的过程，以下是实现步骤：

### 1. **注册 Zoho Mail 帐号**
+ 访问 Zoho Mail 的官方网站：[ZohoMail](https://www.zoho.com/mail/)。
+ 点击 **"Sign Up"** 注册一个 Zoho 帐号。如果你没有 Zoho 帐号，你需要先创建一个免费或付费账户。

### 2. **选择计划**
+ Zoho Mail 提供免费版和付费版。
+ 对于个人或小型团队来说，Zoho Mail 免费版提供了很多基本的功能，可以使用自己的域名搭建邮件服务。

### 3. **添加和验证域名**
+ 在注册并登录 Zoho Mail 后，点击 **"Admin Console"** 进入管理控制台。
+ 在控制台中选择 **"Domains"** 选项，点击 **"Add Domain"** 来添加你的自定义域名。
+ 输入你想使用的域名（例如 `mydomain.com`），并继续。
+ **验证域名**：Zoho 会要求你验证域名的所有权。通常的验证方法是：
    - **添加 TXT 记录**：你需要在你的 DNS 管理平台中添加一个 TXT 记录，Zoho 会提供一个唯一的文本值。你需要登录到你域名提供商的 DNS 控制面板，并添加这个 TXT 记录。
    - **添加 CNAME 记录**：另一种验证方式是添加 CNAME 记录。

验证 DNS 配置后，返回 Zoho Mail 并点击 **"Verify"**。通常，这个过程需要一些时间来更新 DNS 记录，可能需要几分钟到几个小时不等。

### 4. **配置 MX 记录**
+ 在域名验证完成后，你需要配置 **MX 记录** 以便通过 Zoho Mail 接收邮件。
+ Zoho 会提供一组 MX 记录，你需要在你的 DNS 管理平台中添加这些记录。MX 记录指向 Zoho 的邮件服务器，确保邮件能够正确地路由到 Zoho Mail。

Zoho 提供的典型 MX 记录如下：

+ **Priority**: 10, **Mail Server**: `mx.zoho.com`
+ **Priority**: 20, **Mail Server**: `mx2.zoho.com`
+ **Priority**: 50, **Mail Server**: `mx3.zoho.com`

确保删除旧的 MX 记录（如果有的话），以便所有的邮件都被发送到 Zoho 的邮件服务器。

### 5. **配置 SPF 和 DKIM**
+ **SPF 记录**：为了防止其他服务器伪造你的域名发送垃圾邮件，你需要配置 SPF 记录。
    - 在 DNS 管理面板中添加一个 SPF 记录：

```plain
makefile


复制代码
v=spf1 include:zoho.com ~all
```

+ **DKIM 配置**：为了确保邮件的真实性，你可以启用 **DKIM**（DomainKeys Identified Mail）来签署你的邮件。
    - 在 Zoho Mail 管理控制台中启用 DKIM 签名。
    - 根据 Zoho 提供的设置，在 DNS 管理平台中添加 DKIM 的 CNAME 记录。

### 6. **创建邮箱账户**
+ 在 Zoho Mail 管理控制台中，点击 **"Users"** 来添加用户邮箱。
+ 输入用户名和密码，创建你想要的邮箱账户。例如，如果你设置了 `mydomain.com`，你可以创建类似 `user@mydomain.com` 的邮箱。

### 7. **配置邮件客户端（可选）**
+ 如果你想在 Outlook、Thunderbird 等邮件客户端中使用 Zoho Mail，你需要配置 IMAP、POP 和 SMTP 设置。
+ 以下是 Zoho Mail 的常用邮件客户端设置：
    - **IMAP 设置**：
        * 服务器地址：`imap.zoho.com`
        * 端口：993
        * 安全类型：SSL
    - **SMTP 设置**：
        * 服务器地址：`smtp.zoho.com`
        * 端口：465（SSL）或 587（TLS）
        * 安全类型：SSL 或 TLS

### 8. **使用 Zoho Mail Web 界面**
+ 一旦配置完成，你可以使用 Zoho 提供的 Webmail 界面来管理你的邮件。
+ 登录到 Zoho Mail 后，直接在浏览器中访问你的邮箱。
+ 你可以在 Web 界面中创建文件夹、过滤规则等，来组织和管理收发的邮件。

### 9. **使用 Zoho Mail 移动应用**
+ Zoho 还提供了 **移动应用**，可以在 Android 和 iOS 设备上使用。你可以从 Google Play 或 App Store 下载 Zoho Mail 应用，并配置你的邮箱。

### 10. **测试邮件发送和接收**
+ 完成所有设置后，测试发送和接收邮件。确保邮件发送顺利，并且能够从其他邮箱接收到邮件。

