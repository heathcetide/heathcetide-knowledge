基础代码：

```dart
import 'package:flutter/material.dart';

void main(){
  runApp(const Center(
    child: Text("Hello Flutter", textDirection: TextDirection.ltr),
  ));
}
```

添加样式：

```dart
import 'package:flutter/material.dart';

void main(){
  runApp(const Center(
    child: Text("Hello Flutter", textDirection: TextDirection.rtl,
    style: TextStyle(
      // color: Colors.green,
      color: Color.fromARGB(244, 255, 255, 1)
    )
    ),
  ));
}
```



使用MaterialApp和Scaffold两个组件装饰App

```dart
import 'package:flutter/material.dart';

void main(){
  runApp(MaterialApp(
    home: Scaffold(
      appBar: AppBar(
      title: Text("八股文背题助手"),
      ),
      body: const Center(
        child: Text("你好使用者",
          textDirection: TextDirection.ltr,
          style: TextStyle(
            color: Colors.green,
            fontSize: 30
          ),
        )
      )
    )
  ));
}
```



模块化雏形：

```dart
import 'package:flutter/material.dart';

void main(){
  runApp(MyApp());
}
class MyApp extends StatelessWidget {
  const MyApp({Key? key}) :super(key: key);

  @override
  Widget build(BuildContext context) {
    // TODO implement build
    return const Center(
      child: Text('Hello World!', textDirection: TextDirection.ltr),
    );
  }
}
```



div标签：

```dart
class Name extends StatelessWidget{
  const Name({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // TODO implement build
    return Center(
      child: Container(
        alignment: Alignment.bottomRight,
        width: 200,
        height: 200,
        decoration: const BoxDecoration(
          color: Colors.lightGreen
        ),
        child: const Text("data", textDirection: TextDirection.ltr),
      )
      // child: Text('Hello World!', textDirection: TextDirection.ltr),
    );
  }
}
```

flutter build apk --release

发布最新版本

