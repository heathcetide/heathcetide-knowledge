**<font style="color:rgb(1, 1, 1);">RAG 是什么？为什么需要 RAG？</font>**

<font style="color:rgb(0, 0, 0);">面试官一般这么问："为什么不让 LLM 直接回答，非要用 RAG？"或者"LLM 的知识截止问题你怎么解决？"</font>

### **<font style="color:rgb(14, 136, 235);">LLM 的三大知识缺陷</font>**
**<font style="color:rgb(14, 136, 235);background-color:rgba(0, 0, 0, 0);">① 知识截止</font>**<font style="color:rgb(0, 0, 0);">——训练数据有截止日期，昨天发生的事它不知道。你问它"2026年3月发布的 XX 框架有什么特性"，它要么瞎编要么说不知道。</font>

**<font style="color:rgb(14, 136, 235);background-color:rgba(0, 0, 0, 0);">② 私有数据无法触达</font>**<font style="color:rgb(0, 0, 0);">——公司的内部文档、客户数据、业务规则，这些 LLM 从来没见过，直接问就是胡说。</font>

**<font style="color:rgb(14, 136, 235);background-color:rgba(0, 0, 0, 0);">③ 容易幻觉</font>**<font style="color:rgb(0, 0, 0);">——当 LLM 不确定但又想回答时，它会编造看似合理但完全错误的信息。这个问题在没有外部知识验证时尤其严重。</font>

### **<font style="color:rgb(14, 136, 235);">RAG 的核心思路</font>**
<font style="color:rgb(0, 0, 0);">RAG（Retrieval-Augmented Generation，检索增强生成）的本质就一句话：</font>**<font style="color:rgb(14, 136, 235);background-color:rgba(0, 0, 0, 0);">在 LLM 生成回答之前，先从外部知识库检索相关信息，把检索结果塞进 Prompt，让 LLM 基于事实回答。</font>**

<font style="color:rgb(0, 0, 0);">没有 RAG：用户问题 → LLM → 回答（可能幻觉）</font>

<font style="color:rgb(0, 0, 0);">有 RAG：用户问题 → 检索相关知识 → [问题 + 检索结果] → LLM → 回答（基于事实）</font>

**<font style="color:rgb(14, 136, 235);background-color:rgba(0, 0, 0, 0);">面试核心点</font>**<font style="color:rgb(0, 0, 0);">：RAG 不是替代 LLM，是给 LLM 补充外部知识。LLM 负责理解和生成，RAG 负责提供事实依据。</font>

<font style="color:rgb(0, 0, 0);"></font>

**<font style="color:rgb(0, 0, 0);">2. RAG 的完整链路是怎样的？</font>**

<font style="color:rgb(0, 0, 0);"></font>

<font style="color:rgb(0, 0, 0);">面试官会问："你说你做过 RAG 项目，能完整讲一下从用户提问到最终回答的链路吗？"</font>

<font style="color:rgb(0, 0, 0);">这是基础中的基础，但很多人讲不清楚。</font>

<!-- 这是一张图片，ocr 内容为： -->
![](https://cdn.nlark.com/yuque/0/2026/png/43218187/1777447349659-afe5c7cf-8243-457c-9fd7-0ba5241acf08.png)





+ **<font style="color:rgb(1, 1, 1);"></font>**
+ **<font style="color:rgb(1, 1, 1);">向量检索的原理是什么？</font>**
+ **<font style="color:rgb(1, 1, 1);">向量数据库怎么选？Milvus、FAISS、Qdrant 各自适合什么场景？</font>**
+ **<font style="color:rgb(1, 1, 1);">纯向量检索有什么问题？为什么需要混合检索？</font>**
+ **<font style="color:rgb(1, 1, 1);">Rerank 是什么？为什么检索之后还要重排序？</font>**
+ **<font style="color:rgb(1, 1, 1);">Chunk 怎么切？切大了切小了各有什么问题？</font>**
+ **<font style="color:rgb(1, 1, 1);">Embedding 模型怎么选？中文场景选什么？</font>**
+ **<font style="color:rgb(1, 1, 1);">RAG 的幻觉怎么处理？</font>**
+ **<font style="color:rgb(1, 1, 1);">RAG 检索效果不好怎么优化？</font>**
+ **<font style="color:rgb(1, 1, 1);">Agentic RAG 是什么？和普通 RAG 有什么区别？</font>**
+ **<font style="color:rgb(1, 1, 1);">大厂真实面试追问汇总</font>**

