# 08 · UI 与 Canvas 层

---

## 面试 / 自测题

### Q1. Control 与 Node2D 混用注意什么？

- **Control**：锚点、布局容器、鼠标过滤，适合 HUD/菜单  
- **Node2D**：世界坐标，适合血条挂怪物头上（或用 `Camera` 转换）  

HUD 常用 `CanvasLayer` 固定在屏幕上，不受相机移动影响。

---

### Q2. CanvasLayer 的 layer 是什么？

整数层级，越大越靠前。

例：

- 游戏世界：默认  
- HUD：50  
- 弹窗：80  
- 全屏特效（热浪）：更高或按需求插入  

全屏后处理（`BackBufferCopy` + shader）要注意与 Compatibility 的限制。

---

### Q3. 锚点与容器？

- 锚点：相对父 Control 的归一化边距，做分辨率适配  
- `VBoxContainer` / `HBoxContainer` / `MarginContainer`：自动排版  

少用绝对像素堆满屏；换 16:9 / 手机分辨率会崩。

---

### Q4. `mouse_filter` 三种模式？

| 模式 | 行为 |
| --- | --- |
| Stop | 接收并挡住下层 |
| Pass | 接收但继续传 |
| Ignore | 完全穿透 |

全屏 ColorRect 做暗色遮罩时，若忘了 Stop，会点到后面游戏；做「只显示不挡」用 Ignore。

---

### Q5. 主题（Theme）有什么用？

统一按钮字体、颜色、StyleBox。  
大项目建默认 Theme，避免每个按钮单独改。

---

### Q6. 世界坐标 UI（伤害数字）怎么做？

1. 在世界用 `Node2D` 飘字，跟实体  
2. 或用 Control，每帧：

```gdscript
var screen = camera.unproject_position(world_pos) # 3D
# 2D: 直接用全局坐标差或 Viewport 变换
```

2D 横版更常见：直接把飘字场景 `add_child` 到关卡层，给初速度向上。

---

## 易错点

- 多个全屏 Rect 抢输入。  
- CanvasLayer 跟 `follow_viewport` 搞混导致 UI 跟着抖。  
- 字体文件巨大（中文 TTF）拖垮 Web 包体——按需裁字体。
