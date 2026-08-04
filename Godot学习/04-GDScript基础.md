# 04 · GDScript 基础

---

## 面试 / 自测题

### Q1. GDScript 是什么？和 Python 像在哪？

Godot 官方脚本，语法像 Python，但是：

- 为引擎 API 深度集成（`$`、信号、`@export`）  
- 可选**静态类型**  
- 有 `await` 与信号/帧协作  
- 不是 CPython，性能与库生态不同  

口述：**像 Python 的引擎脚本，不是通用后端语言。**

---

### Q2. 常用类型与注解怎么写？

```gdscript
var hp: int = 100
var speed := 200.0          # 推断
@export var max_jump: int = 2
const SPEED: float = 300.0

func damage(amount: int) -> void:
    hp -= amount
```

推荐逐步加类型：少空引用、编辑器补全更好、导出前能抓错。

---

### Q3. `class_name` 有什么用？

```gdscript
class_name BaseHero
extends CharacterBody2D
```

全局可按类型引用：`player is BaseHero`、参数 `func f(h: BaseHero)`。

注意：

- 循环依赖 / 解析失败会导致「类不存在」  
- 导出引擎版本不一致时 `class_name` 相关报错很常见  

---

### Q4. `await` 怎么用？和协程关系？

```gdscript
await get_tree().create_timer(0.5).timeout
await animation_player.animation_finished
var result = await some_async_func()
```

`await` 挂起当前函数，不阻塞整棵树（其它节点照常 `_process`）。

易错：节点 `queue_free` 后仍 await → 回调访问已释放对象。await 前确认生命周期。

---

### Q5. `@onready` 是什么？

```gdscript
@onready var hp_bar: ProgressBar = $UI/HpBar
```

等价于在 `_ready` 里赋值，保证节点已在树中。  
**不要**在声明时用 `$` 直接取子节点当默认值（进树前可能无效）。

---

### Q6. GDScript 和 C# 怎么选？

| | GDScript | C# |
| --- | --- | --- |
| 迭代速度 | 快 | 中 |
| 工具链 | 编辑器一体 | 需 .NET SDK |
| 导出 | 简单 | 平台/裁剪更折腾 |
| 性能 | 多数 2D 够用 | 重逻辑可更优 |
| 招人 | 引擎向 | 更广 |

中小 2D：**默认 GDScript**；已有 C# 团队或强逻辑库再混用。

---

### Q7. 静态函数、内部类？

```gdscript
static func clamp01(x: float) -> float:
    return clampf(x, 0.0, 1.0)

class Inner:
    var x := 1
```

静态方法不依赖实例；不要滥用静态存「全局可变状态」（还是 Autoload 更清晰）。

---

## 易错点

- 字典键类型混乱（StringName vs String）导致读不到。  
- `for i in array` 改数组长度会出问题。  
- 导出后断言/类型错误表现与编辑器不完全一样——发版前真机/目标平台跑一遍。
