# 07 · defer、panic 与 error

---

## 面试题

### Q1. Go 有异常类型吗？触发「异常」的场景？

Go **没有** Java 式受检/非受检异常体系。

- **常规错误：** `error` 接口，多返回值  
- **致命/不可恢复倾向：** `panic`（可被 `recover`）  

易触发 panic 的场景（口述举例）：

- 空指针 / nil map 写  
- 数组/切片越界  
- 向已关闭 channel 发送  
- 类型断言失败（非 comma-ok）  
- 主动 `panic(...)`  
- 重复 close channel 等  

业务错误优先 `error`，不要滥用 panic。

---

### Q2. 如何使用 defer？执行顺序？

`defer` 延迟到**当前函数返回前**执行。  
多个 defer：**LIFO（后进先出）**，像栈。

```go
defer fmt.Println(1)
defer fmt.Println(2)
// 输出 2 再 1
```

典型：解锁、关文件、rollback。

---

### Q3. defer 变量快照在什么情况下会失效？

defer 对参数是**调用时求值**（入参被拷贝进延迟调用）：

```go
i := 0
defer fmt.Println(i) // 打印 0（参数已拍快照）
i = 1
```

但闭包**捕获变量引用**时不是快照：

```go
i := 0
defer func() { fmt.Println(i) }() // 打印 1（看返回时的 i）
i = 1
```

**「快照失效」口诀：** 传值参数有快照；闭包引用外部变量则跟最终值走。要快照闭包：`defer func(x int){...}(i)`。

---

### Q4. 循环内执行 defer 会怎样？

defer 挂在**外层函数**上，不是挂在单次循环。循环一万次 defer → 函数结束才按 LIFO 全执行 → 延迟释放、占内存。

```go
for _, f := range files {
    defer f.Close() // 坏：全部结束才关
}
// 应：每次循环包一层函数，在内 defer；或直接 Close
```

---

### Q5. 如何从 panic 恢复？

```go
func safe() {
    defer func() {
        if r := recover(); r != nil {
            // 记录日志；可选转 error
        }
    }()
    panic("boom")
}
```

`recover` **只在 defer 中调用才有效**。  
常用于边界（HTTP handler）防进程崩溃；库内部慎用吞 panic。

---

### Q6. `error` 是什么？如何自定义错误？

```go
type error interface {
    Error() string
}
```

自定义：

```go
type NotFoundError struct{ Key string }
func (e *NotFoundError) Error() string { return e.Key + " not found" }
```

或 `errors.New` / `fmt.Errorf`。

---

### Q7. `errors.Is` / `errors.As` / `%w` 包装怎么讲？

Go 1.13+ 错误链：

```go
err := fmt.Errorf("load: %w", ErrNotFound)
errors.Is(err, ErrNotFound)  // true，沿链比较
var e *NotFoundError
errors.As(err, &e)           // 沿链找类型
```

- `%w`：包装保留 cause  
- `%v`：不形成可 Unwrap 的链（一般）  
- 判断用 `Is`/`As`，少用字符串比较  

---

### Q8. 什么时候该返回 error，什么时候 panic？

| 返回 error | panic |
| --- | --- |
| 可预期业务/IO 失败 | 程序bug：不变量破损 |
| 调用方应处理 | 初始化失败、不可继续 |
| 库的常态 API | 边界 recover 兜底 |

服务进程：中间件 recover → 记日志 → 500；不要用 panic 当控制流。

---

### Q9. defer 对性能有影响吗？

有一定开销（注册延迟调用），但相对 IO/系统调用通常可忽略。  
热路径微优化可手写清理，**可读性优先**；先 profile 再谈。

---

### Q10. panic 会不会跨 goroutine 被 recover？

**不会。** panic 只在**当前 goroutine** 沿 defer 栈展开；其它 goroutine 的 recover 救不了它。  
子 goroutine 必须自己 defer recover，或把错误通过 channel 送回。

---

## 关联

- [[05-函数方法与闭包]] · [[15-Context]] · [[11-Goroutine与Channel]] · [[09-结构体语法与其它]]
