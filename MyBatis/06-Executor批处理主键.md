# 06 · Executor、批处理与主键

---

## 面试题

### Q1. 有哪些 Executor？区别？工作机制？如何指定？

| 类型 | 特点 |
| --- | --- |
| **SimpleExecutor** | 每次执行新建 Statement，用完关闭（默认常见） |
| **ReuseExecutor** | 按 SQL 缓存并复用 Statement |
| **BatchExecutor** | 走 JDBC `addBatch`/`executeBatch`，批量刷新 |

工作机制：`SqlSession` 持有 Executor；执行 `update/query` 时走缓存装饰（`CachingExecutor`）再委托真实 Executor → StatementHandler。

**指定方式：**

```java
session = factory.openSession(ExecutorType.BATCH);
// 或全局 defaultExecutorType
```

Spring：`SqlSessionTemplate` 可配置 `ExecutorType`；批处理常单独开 BATCH session。

---

### Q2. 如何执行批处理？批量插入能返回主键列表吗？

```java
SqlSession session = factory.openSession(ExecutorType.BATCH);
try {
  Mapper m = session.getMapper(Mapper.class);
  for (Item it : list) {
    m.insert(it); // 先攒 batch
  }
  session.flushStatements();
  session.commit();
} finally {
  session.close();
}
```

**主键回填：**

- `useGeneratedKeys="true" keyProperty="id"` 对 **单条** insert 很成熟  
- **BatchExecutor** 下不同驱动对 generated keys 支持不一致；批量 values 一条 SQL 多行时，多数可配置 `useGeneratedKeys` 回填列表，但要测具体驱动  
- 也可 `<selectKey>` 预先取序列（Oracle 等）  

口述：**能，但依赖 JDBC 驱动与写法；MySQL 单条/多 values + useGeneratedKeys 常见可回填；Batch 模式务必验证。**

---

### Q3. MyBatis 如何处理主键生成？

1. 数据库自增：`useGeneratedKeys` + `keyProperty`  
2. `<selectKey>`：insert 前/后执行取 id（序列）  
3. Java 侧生成雪花/UUID 再插入  

---

## 关联

- [[02-执行流程与Mapper原理]] · [[07-插件与分页]]
