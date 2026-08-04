# 04 · Map 与引用类型

---

## 面试题

### Q1. 引用类型有哪些？和指针有何不同？

常说的「引用类型」：`slice`、`map`、`channel`、`function`、`interface`（有时也提）。

更准确说法：它们作为变量时，变量里存的是**描述符/头**（小值），指向堆上共享结构。

| | 「引用类型」 | 指针 `*T` |
| --- | --- | --- |
| 本质 | 内建描述符 | 地址 |
| 赋值 | 拷贝描述符，共享底层 | 拷贝地址 |
| nil | 有 nil 状态 | 有 nil |
| 运算 | 不能当指针乱算 | `&` `*` |

切片头可拷贝；指针明确指向单一 `T`。

---

### Q2. map 如何实现两种 get？如何判断 key 是否存在？

```go
v := m[k]           // 不存在时返回零值（无法区分「值就是零」）
v, ok := m[k]       // comma-ok：ok 表示是否存在
```

判断包含：`_, ok := m[k]; ok`。

---

### Q3. map 的 key 为什么无序？

实现是哈希表；遍历顺序**刻意随机化**（从 Go 1 起），防止依赖顺序的 bug、一定程度缓解哈希碰撞攻击。  
**需要有序：** 取出 key 排序后再读，或用有序结构。

---

### Q4. 如何顺序读取 map？

```go
keys := make([]string, 0, len(m))
for k := range m { keys = append(keys, k) }
sort.Strings(keys)
for _, k := range keys {
    fmt.Println(k, m[k])
}
```

---

### Q5. map 扩容机制？

哈希表：装载因子过高或过多溢出桶时扩容。

要点（口述）：

1. 分配更大的 buckets（常 2 倍）  
2. 渐进式搬迁（incremental rehash）：访问/写入时逐步把旧桶迁到新桶  
3. 有时因溢出过多触发「等量扩容」整理  

细节随版本变；面试抓：**装载因子 + 渐进搬迁**。

---

### Q6. map 不初始化 / nil map 会怎样？

```go
var m map[string]int // nil
_ = m["a"]           // 读：OK，得零值
m["a"] = 1           // 写：panic: assignment to entry in nil map
```

必须先 `make` 或字面量初始化再写。

---

### Q7. nil 的 slice 和 map 使用差异？

| 操作 | nil slice | nil map |
| --- | --- | --- |
| 读 / range | OK | OK（零值） |
| 写 / 赋值 | append OK；下标写需有 len | **写 panic** |
| len | 0 | 0 |

---

### Q8. 如何实现 set？

```go
set := make(map[string]struct{})
set["a"] = struct{}{}
_, ok := set["a"]
delete(set, "a")
```

用 `struct{}` 省内存。

---

### Q9. map 值不可寻址，如何改值的属性？

```go
type User struct{ Age int }
m := map[string]User{"u": {Age: 1}}
// m["u"].Age = 2  // 编译错误：不可寻址

// 做法1：取出改再放回
u := m["u"]
u.Age = 2
m["u"] = u

// 做法2：存指针
mp := map[string]*User{"u": {Age: 1}}
mp["u"].Age = 2
```

---

### Q10. make 创建 map/channel 参数？

```go
make(map[K]V)           // 无提示
make(map[K]V, hint)     // 容量提示，减少扩容
make(chan T)            // 无缓冲
make(chan T, n)         // 缓冲大小 n
```

slice 见 [[03-数组与切片]]。

---

## 关联

- [[03-数组与切片]] · [[02-指针与内存]] · [[01-变量常量与基础类型]]
