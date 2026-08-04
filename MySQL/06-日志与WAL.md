# 06 · 日志与 WAL（详解）

日志题要分清 **谁产生、记什么、干什么、刷盘策略**，并能和事务提交、主从串起来。

---

## 面试题

### Q1. MySQL 日志类型？binlog / redo / undo 区别？

**分层记忆：**

| 日志 | 层级 | 记什么 | 主要干什么 |
| --- | --- | --- | --- |
| **redo log** | InnoDB | 页级物理修改（怎么改页） | 崩溃恢复、支撑持久性（WAL） |
| **undo log** | InnoDB | 反向操作 / 旧版本 | 回滚、MVCC |
| **binlog** | Server | 逻辑（语句/行/混合） | 主从复制、时间点恢复、审计 |
| relay log | 从库 | 主库 binlog 的拷贝 | 从库重放 |
| 慢查询 / error / general | Server | 诊断信息 | 运维 |

**redo vs binlog 对比（高频）：**

| 维度 | redo | binlog |
| --- | --- | --- |
| 内容 | 物理（偏页） | 逻辑（SQL 或行前后镜像） |
| 写入时机 | 事务执行中可持续写 | 提交时 |
| 文件 | 固定大小循环写 | 追加，可归档清理 |
| 用途 | 崩溃后把页救回来 | 复制与备份恢复 |
| 引擎 | 仅 InnoDB | 所有引擎 Server 层 |

三者配合：**原子靠 undo，持久靠 redo，复制靠 binlog，提交靠二者两阶段。**

---

### Q2. 插入一条 SQL，redo 记录的是什么？

**不是**整条 `INSERT` 文本，而是对该表相关 **数据页 / 索引页** 的修改描述（页号、位置、变更内容等物理重做信息）。

可能涉及：聚簇索引页插入、二级索引页维护、undo 页本身变更等也会进 redo。

刷脏页前只要 redo 在，崩溃就能重放到一致状态（配合 checkpoint）。

---

### Q3. 什么是 WAL？优点？MySQL 用到了吗？

**Write-Ahead Logging：** 修改数据前，先保证日志持久（或按策略持久），再刷脏页。

**优点：**

1. 日志多 **顺序写**，吞吐远好于大量随机刷脏页  
2. 崩溃可用日志恢复，允许脏页晚刷  
3. 在「持久性」和「性能」之间用刷盘策略调节  

**MySQL：**

- InnoDB **redo = 经典 WAL**  
- binlog 在提交路径上同样「先落日志再认为事务成功对外可见」（与 redo 两阶段绑定）  

`innodb_flush_log_at_trx_commit`：

- `1`：每次提交 redo fsync（最安全）  
- `2`：提交写 OS 缓存，OS 刷盘  
- `0`：周期性刷（性能好、掉电风险大）  

---

### Q4. 事务日志与恢复机制怎么讲？

**崩溃恢复（实例重启）：**

1. 从 checkpoint 推进，用 **redo** 重做需要的页修改  
2. 未提交事务用 **undo** 回滚  
3. 处于 prepare 的事务看 **binlog 是否完整** 决定提交或回滚（两阶段）  

**时间点恢复（误删等）：**

全量备份 + 从备份点重放 **binlog** 到指定时刻。

**主从：**

主库 binlog → 从库 relay → SQL/并行 worker 应用。见 [[09-高可用主从读写分离]]。

---

### Q5. 口述一条更新从执行到刷盘的日志视角

```mermaid
flowchart TB
  U[UPDATE 行] --> Undo[写 undo 旧版本]
  Undo --> Page[改 BP 数据页为脏页]
  Page --> Redo[写 redo log buffer]
  Redo --> Commit{提交?}
  Commit -->|是| Prep[redo prepare]
  Prep --> Bin[写 binlog]
  Bin --> Cmt[redo commit]
  Cmt --> Flush[后台刷脏页到磁盘]
```

脏页刷盘前进程崩：靠 redo 救；未提交：靠 undo 回滚。

---

## 关联

- [[04-事务与MVCC]] · [[02-存储引擎与内存结构]] · [[09-高可用主从读写分离]]
