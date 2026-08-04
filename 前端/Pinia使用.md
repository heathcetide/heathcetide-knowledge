Pinia的持久化插件--Persist

Pinia默认的是内存存储，当刷新浏览器的时候就会丢失数据

Persist插件可以将pinia中的数据持久化的存储



使用Persist的步骤：

1.安装persist

```javascript
npm install pinia-persistedstate-plugin
```

	      2.在pinia中使用persist

```javascript
import { createPersistedState } from "pinia-persistedstate-plugin";
const pinia = createPinia();
const persistedState = createPersistedState()
pinia.use(persistedState)

createApp(App).use(ArcoVue).use(pinia).use(router).mount("#app");
```

3.定义状态store时指定持久化配置参数

