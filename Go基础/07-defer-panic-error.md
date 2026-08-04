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

## 关联

- [[05-函数方法与闭包]] · [[09-结构体语法与其它]]
