`SmartApplicationListener` 是 Spring 框架中提供的一个高级事件监听器接口，它扩展了普通的 `ApplicationListener` 接口，允许你更细粒度地控制监听器对哪些事件和事件源感兴趣，从而减少不必要的事件处理。下面介绍其用法和示例。

---

## 1. SmartApplicationListener 接口介绍
`SmartApplicationListener` 继承自 `ApplicationListener<ApplicationEvent>`，除了继承 `onApplicationEvent` 方法外，还新增了以下两个方法：

+ **supportsEventType(Class<? extends ApplicationEvent> eventType)**  
返回 `true` 表示当前监听器对该类型的事件感兴趣，反之则不处理，从而避免无关事件的调用。
+ **supportsSourceType(Class<?> sourceType)**  
返回 `true` 表示当前监听器对该事件源类型感兴趣，可以过滤掉不需要的事件源。

这种机制可以帮助你优化监听器，避免处理大量不相关的事件。

---

## 2. 使用步骤
### 步骤 1. 实现 SmartApplicationListener
你可以创建一个类实现 `SmartApplicationListener` 接口，并重写相关方法。例如：

```plain
import org.springframework.context.ApplicationEvent;
import org.springframework.context.event.SmartApplicationListener;
import org.springframework.stereotype.Component;

@Component
public class MySmartApplicationListener implements SmartApplicationListener {

    // 定义该监听器支持的事件类型
    @Override
    public boolean supportsEventType(Class<? extends ApplicationEvent> eventType) {
        // 例如，只处理 ContextRefreshedEvent 事件
        return eventType.equals(org.springframework.context.event.ContextRefreshedEvent.class);
    }

    // 定义该监听器支持的事件源类型
    @Override
    public boolean supportsSourceType(Class<?> sourceType) {
        // 例如，只处理来自 ApplicationContext 类型的事件源
        return sourceType != null && org.springframework.context.ApplicationContext.class.isAssignableFrom(sourceType);
    }

    // 当满足条件的事件发生时，会调用此方法
    @Override
    public void onApplicationEvent(ApplicationEvent event) {
        System.out.println("监听到事件：" + event);
        // 此处可以添加你自定义的业务逻辑处理
    }

    // 可选：设置监听器的执行顺序，数字越小优先级越高
    @Override
    public int getOrder() {
        return 0;
    }
}
```

在上面的示例中：

+ `supportsEventType` 方法指定只对 `ContextRefreshedEvent` 感兴趣，即当 Spring 应用上下文刷新完成后触发。
+ `supportsSourceType` 方法限制只有当事件的源对象是 `ApplicationContext`（或其子类）时才处理。
+ `onApplicationEvent` 方法中编写处理逻辑，这里简单输出事件信息。
+ `getOrder` 方法可以用来设置执行顺序（如果有多个监听器）。

### 步骤 2. 注册监听器
如果你在类上使用了 `@Component` 注解，并且开启了组件扫描，Spring Boot 会自动注册该监听器，不需要额外配置。如果没有使用组件扫描，你也可以在配置类中显式注册：

```plain
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ListenerConfig {

    @Bean
    public MySmartApplicationListener mySmartApplicationListener() {
        return new MySmartApplicationListener();
    }
}
```

---

## 3. 测试监听效果
启动 Spring Boot 应用，触发符合条件的事件（例如上下文刷新时会触发 `ContextRefreshedEvent`），你就能在控制台看到类似输出：

```plain
监听到事件：org.springframework.context.event.ContextRefreshedEvent[source=org.springframework.boot.web.servlet.context.AnnotationConfigServletWebServerApplicationContext@...]
```

---

## 4. 总结
+ **优势**：  
`SmartApplicationListener` 通过 `supportsEventType` 和 `supportsSourceType` 方法，可以让你精确控制监听器的触发条件，减少不必要的事件处理。
+ **场景**：  
当你只关心特定类型的事件或来自特定源的事件时，使用 `SmartApplicationListener` 能够提高性能和代码清晰度。
+ **注意**：  
如果你只是简单监听所有事件，也可以直接使用 `ApplicationListener`，但当需要更精细的过滤时推荐使用 `SmartApplicationListener`。

这样，你就可以在 Spring Boot 项目中灵活使用 `SmartApplicationListener` 来响应特定的应用事件了。

