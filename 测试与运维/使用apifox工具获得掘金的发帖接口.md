# 使用apifox工具获得掘金的发帖接口

掘金相对于csdn来说，是先创建文章（[https://api.juejin.cn/content_api/v1/article_draft/create](https://api.juejin.cn/content_api/v1/article_draft/create)），返回一个文章id

![](https://cdn.nlark.com/yuque/0/2025/png/43219335/1743925303148-e3417832-f11d-4015-82a6-1fcaf6cd22bf.png "null")

然后拿着这个文章id作为draft_id，调用发帖服务（[https://api.juejin.cn/content_api/v1/article/publish](https://api.juejin.cn/content_api/v1/article/publish)），才能完成文章的发送

![](https://cdn.nlark.com/yuque/0/2025/png/43219335/1743925380112-a5be8d80-36bd-42c8-8ff8-2998de07902d.png "null")  
`注意哦：`（参考下图）

- 分类id（category_id）和标签id（tag_ids）是必填项
- 编辑摘要（brief_content）必须是50-100字，不然后面测试的时候会报参数错误

![](https://cdn.nlark.com/yuque/0/2025/png/43219335/1743925767285-25f632fe-b07f-4ef8-8f98-578ed481e3d9.png "null")

# 通过ai工具生成相应的DTO与Service

API服务接口

创建IJueJinService接口的实现类实例

配置HTTP客户端配置类

之后就可以进行接口调用测试了

# 测试接口

！其中JueJinApiProperties相比csdn来说添加了authorization这个参数，yml文件别忘配！

接口测试通过就可以进行下一步了

# 整合服务

接下来要做的就是把创建文章（create）与发表文章（publish）的接口结合起来

domain层还是沿用小傅哥的例子

infrastructure层进行writeArticle方法的编写

# 最后对整合后的接口测试

![](https://cdn.nlark.com/yuque/0/2025/png/43219335/1743926545814-71fc3f6f-3b8a-48ef-9bed-7d003fdc1569.png "null")

完美收工 _