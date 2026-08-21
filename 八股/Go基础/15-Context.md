# 15 · Context

> 取消、超时、链路传值——微服务 / HTTP handler 必问。

---

## 面试题

### Q1. `context.Context` 解决什么问题？

在调用树中传递：

1. **取消信号**（超时、客户端断开、手动 cancel）  
2. **截止时间 deadline**  
3. **请求范围的键值**（trace id 等，慎用）  

让下游 goroutine / RPC / DB 调用能及时停下，避免泄漏与无效工作。

```go
ctx, cancel := context.WithTimeout(parent, 2*time.Second)
defer cancel()
```

---

### Q2. 四种常见构造？

| API | 作用 |
| --- | --- |
| `context.Background()` | 根；main、初始化、测试 |
| `context.TODO()` | 暂时不清楚用啥时的占位 |
| `WithCancel(parent)` | 手动 cancel |
| `WithTimeout` / `WithDeadline` | 超时 / 截止时间 |
| `WithValue(parent, k, v)` | 传请求域数据 |

子 context 取消会沿树向下传播；**父取消 → 子取消**；子取消一般不取消父。

---

### Q3. 为什么必须 `defer cancel()`？

`WithCancel` / `WithTimeout` 等会分配定时器与孩子节点关系。  
不调用 `cancel` 可能导致：

- 定时器 / 资源延迟释放  
- parent 的孩子引用滞留更久  

即使已经超时自动取消，也推荐 `defer cancel()` 尽早释放。

---

### Q4. 如何在业务里正确使用 Context？

1. 作为函数**第一个参数**：`func Foo(ctx context.Context, ...)`  
2. 不要塞进结构体长期存（除非生命周期极清晰）  
3. IO / RPC / `select` 听 `ctx.Done()`  
4. 错误用 `ctx.Err()`：`Canceled` / `DeadlineExceeded`  
5. 不要用 context 传可选参数替代函数参数（值应是请求元数据）  

```go
select {
case <-ctx.Done():
    return ctx.Err()
case res := <-ch:
    return res, nil
}
```

---

### Q5. `WithValue` 的坑？

- key 建议用**未导出类型**，防碰撞：`type key struct{}`  
- 只放跨 API 必要元数据（trace、auth 身份），不放可选业务大参  
- 取值要断言失败处理  
- 过度使用会让依赖隐式、难测  

---

### Q6. Context 取消是协程安全的吗？能重复 cancel 吗？

- 同一 context 的 `Done()` 关闭是并发安全的  
- `cancel()` **可多次调用**（多余调用是 no-op）  
- 派生出的子树会收到取消  

---

### Q7. HTTP 服务里 Context 从哪来？

`http.Request.Context()`：客户端断开、ServeHTTP 结束等会取消。  
handler 里往下传 `r.Context()`，下游查库/调服务都绑定它 → 客户端取消可中断工作（驱动需支持）。

---

### Q8. Context 和 channel 退出信号怎么选？

| | Context | 手写 done channel |
| --- | --- | --- |
| 树状传播 | 天生支持 | 要自己串 |
| 超时 | 标准库直接支持 | 自己 `select`+timer |
| 生态 | 几乎所有库第一参数 | 仅内部小范围 |

新代码优先 Context；遗留代码可并存。

---

## 关联

- [[11-Goroutine与Channel]] · [[12-Select与并发模式]] · [[07-defer-panic-error]]
