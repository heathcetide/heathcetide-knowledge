解决方案
```vue
const verifyCaptcha = async () => {
 const response = await fetch(
 "http://localhost:8121/api/user/verify-captcha",
 {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ captcha: captchaInput.value }),
 credentials: "include", // 添加这行确保凭证一起发送
 }
 );

 const result = await response.json();
 if (result.data) {
 message.success("图形验证码通过");
 captchaVerified.value = true; // 标记为已通过图形验证码
 } else {
 message.error("图形验证码错误，请重试");
 refreshCaptcha(); // 刷新验证码
 }
};
```

**1.在前端发送跨域请求时允许凭证**

在 `fetch` 请求中设置 `credentials: 'include'`，确保 session cookie 随请求一起发送。


2.**在后端启用跨域请求和允许凭证**

在 Spring Boot 的配置类中，启用 CORS 配置并允许凭证，确保 session ID 一致。

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

 @Override
 public void addCorsMappings(CorsRegistry registry) {
 registry.addMapping("/**")
 .allowedOrigins("http://localhost:8080") // 前端的域名或端口
 .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
 .allowCredentials(true); // 允许凭证
 }
}
```


3.**设置 Session Cookie 的 SameSite 属性**

确保 session cookie 的 `SameSite` 属性设置为 `None`，并且启用 `Secure`（前提是应用在 HTTPS 环境下）。在 Spring Boot 中，通过以下配置来实现
```java
import org.springframework.context.annotation.Configuration;
import org.springframework.session.web.http.CookieSerializer;
import org.springframework.session.web.http.DefaultCookieSerializer;
import org.springframework.context.annotation.Bean;

@Configuration
public class SessionConfig {

 @Bean
 public CookieSerializer cookieSerializer() {
 DefaultCookieSerializer serializer = new DefaultCookieSerializer();
 serializer.setSameSite("None"); // 确保跨域 session 可用
 serializer.setUseSecureCookie(true); // 确保在 HTTPS 下运行时使用
 return serializer;
 }
}
```

