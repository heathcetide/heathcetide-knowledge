### ** **📍**  1. 什么是 CSRF（跨站请求伪造）？**
**CSRF（Cross-Site Request Forgery，跨站请求伪造）** 是一种网络攻击方式，攻击者利用受害者已经**登录的身份**，通过伪造的请求，执行未授权的操作。

#### **📌**** CSRF 攻击示例**
1. **受害者登录某网站**（`example.com`），并在浏览器中保持登录状态。
2. **攻击者诱导受害者** 访问恶意网页（`evil.com`）。
3. **恶意网页的代码** 发送伪造的 `POST` 请求到 `example.com`（比如转账、修改密码）。
4. **由于受害者已经登录，浏览器会自动携带 **`**Cookies**`，导致 `example.com` 误以为是合法用户请求，最终执行了**未授权的操作**。



### **📍**** 2. CSRF 防御机制**
为防止 CSRF，常见的 **防御手段** 包括：

1. **CSRF Token（令牌验证）**✅（当前代码使用的方式）
2. **SameSite Cookie（限制跨站请求携带 Cookie）**
3. **Referer 检查（检查来源站点）**
4. **验证码（增加人工交互）**

**本代码使用 **`**CSRF Token**`** 机制防御 CSRF 攻击。**

****

### **📍**** 3. 代码功能解析**
**本代码实现了 ****基于 Redis 存储的 CSRF 令牌机制****，并通过 **`**CsrfFilter**`** 进行请求拦截，防止 CSRF 攻击。**

#### **📌**** 代码包含两个核心部分**
1. `**CsrfTokenRepository**`**（CSRF 令牌管理）**
    - **生成 CSRF Token**** 并存入 Redis**
    - **验证 CSRF Token**
    - **删除 CSRF Token**
2. `**CsrfFilter**`**（CSRF 过滤器）**
    - **拦截所有 HTTP 请求**
    - **检查 **`**POST/PUT/DELETE**`** 请求是否携带有效的 CSRF Token**
    - **如果 CSRF Token 无效，则阻止请求**
    - **在响应头中返回新的 CSRF Token**

---

### **📍**** 4. 代码效果**
#### **🔹**** 1. **`**CsrfTokenRepository**`** 解析**
📂** **`**CsrfTokenRepository.java**`

```plain
@Component
public class CsrfTokenRepository {
    
    private final RedisUtils redisUtils;
    
    private static final String CSRF_KEY_PREFIX = "csrf:";
    private static final long TOKEN_VALID_SECONDS = 7200; // 2小时

    public CsrfTokenRepository(RedisUtils redisUtils) {
        this.redisUtils = redisUtils;
    }

    /**
     * 生成 CSRF Token
     */
    public String generateToken(String sessionId) {
        String token = UUID.randomUUID().toString();  // 生成唯一 Token
        String key = CSRF_KEY_PREFIX + sessionId;
        redisUtils.set(key, token, TOKEN_VALID_SECONDS); // 存入 Redis（有效期 2 小时）
        return token;
    }
    
    /**
     * 验证 CSRF Token
     */
    public boolean validateToken(String sessionId, String token) {
        String key = CSRF_KEY_PREFIX + sessionId;
        Object storedToken = redisUtils.get(key);
        return token != null && token.equals(storedToken); // 验证 Token 是否匹配
    }
    
    /**
     * 移除 CSRF Token
     */
    public void removeToken(String sessionId) {
        String key = CSRF_KEY_PREFIX + sessionId;
        redisUtils.delete(key);  // 从 Redis 删除 Token
    }
}
```

✅** ****效果**

+ **生成 **`**CSRF Token**`**，并存入 ****Redis****，过期时间 2 小时。**
+ **在请求时检查 **`**Token**`** 是否匹配。**
+ **存储 Token 方式****：**`**Redis**`** 键值格式：**

```plain
csrf:SESSION_ID  ->  CSRF_TOKEN（有效期 2 小时）
```

---

#### **🔹**** 2. **`**CsrfFilter**`** 解析**
📂** **`**CsrfFilter.java**`

```plain
@Order(2)
public class CsrfFilter extends OncePerRequestFilter {
    private final CsrfTokenRepository tokenRepository;
    
    private static final Set<String> SAFE_METHODS = new HashSet<>(
        Arrays.asList("GET", "HEAD", "TRACE", "OPTIONS")
    );

    public CsrfFilter(CsrfTokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        
        // 1. 仅对 非 GET/HEAD/OPTIONS/TRACE 请求 进行 CSRF 检查
        if (requiresCsrfProtection(request)) {
            String sessionId = request.getSession().getId();
            String token = request.getHeader("X-CSRF-TOKEN");  // 从请求头获取 Token
            
            if (!tokenRepository.validateToken(sessionId, token)) {
                throw new SecurityException("CSRF Token无效");
            }
        }
        
        // 2. 为每个响应生成新的 CSRF Token
        String sessionId = request.getSession().getId();
        String newToken = tokenRepository.generateToken(sessionId);
        response.setHeader("X-CSRF-TOKEN", newToken);
        
        filterChain.doFilter(request, response);
    }
    
    /**
     * 判断是否需要 CSRF 保护
     */
    private boolean requiresCsrfProtection(HttpServletRequest request) {
        return !SAFE_METHODS.contains(request.getMethod()); // 仅对 POST/PUT/DELETE 等请求启用 CSRF 保护
    }
}
```

✅** ****效果**

1. **拦截所有请求**
2. **跳过安全方法（GET/HEAD/OPTIONS/TRACE）**
3. **检查 **`**X-CSRF-TOKEN**`** 请求头****，如果无效则抛出异常**
4. **每次请求后，都会在响应头中返回新的 CSRF Token**

```plain
X-CSRF-TOKEN: 123e4567-e89b-12d3-a456-426614174000
```

---

### **📍**** 5. 代码工作流程**
#### **🔹**** 1. 初次请求（GET）**
```plain
GET /somepage HTTP/1.1
Host: example.com
```

📌** ****服务器响应**

```plain
HTTP/1.1 200 OK
X-CSRF-TOKEN: abc123xyz456  # 返回新的 CSRF Token
```

📌** ****前端需要存储这个 Token，并在后续请求中携带它！**

---

#### **🔹**** 2. 发送敏感请求（POST/PUT/DELETE）**
```plain
POST /transfer HTTP/1.1
Host: example.com
X-CSRF-TOKEN: abc123xyz456  # 必须携带 CSRF Token
Content-Type: application/json

{
  "from": "Alice",
  "to": "Bob",
  "amount": 100
}
```

📌** ****服务器检查 **`**X-CSRF-TOKEN**`

+ **如果 Token 有效，则处理请求**
+ **如果 Token 无效，返回 403**

---

### **📍**** 6. 代码的安全性分析**
| **安全特性** | **效果** |
| --- | --- |
| **基于 Redis 存储 CSRF Token** | **仅当前 Session 允许访问** |
| **Token 仅存活 2 小时** | **避免长期有效** |
| **仅对非 GET 请求生效** | **兼顾安全和兼容性** |
| **请求时必须携带 Token** | **防止 CSRF** |


---

### **📍**** 7. 结论**
✅** ****本代码实现了基于 CSRF Token 的 CSRF 防护****，并且：**

1. **Token 存入 Redis****，防止跨会话攻击。**
2. **前端必须在 POST/PUT/DELETE 请求中携带 **`**X-CSRF-TOKEN**`**。**
3. **Token 每次请求后都会刷新****，增加安全性。**
4. **符合 CSRF 防御最佳实践****，适用于 Web API 保护。**

**这是一种 轻量、高效、安全 的 CSRF 解决方案，适用于 **`**Spring Boot**`** 和 **`**RESTful API**`



