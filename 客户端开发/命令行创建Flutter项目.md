1. **<font style="color:rgb(27, 28, 33);">安装 Flutter SDK</font>**<font style="color:rgb(27, 28, 33);">: 确保你已经安装了 Flutter SDK。如果还没有安装，可以访问 </font>[<font style="color:rgb(27, 28, 33);">Flutter 官网</font>](https://flutter.dev/docs/get-started/install)<font style="color:rgb(27, 28, 33);"> 获取安装指南。</font>
2. **<font style="color:rgb(27, 28, 33);">设置环境变量</font>**<font style="color:rgb(27, 28, 33);">: 将 Flutter 的 </font>`<font style="color:rgb(27, 28, 33);">bin</font>`<font style="color:rgb(27, 28, 33);"> 目录添加到你的系统路径中。例如，在 Windows 上，你可以通过以下方式添加：</font>

```plain
setx PATH "%PATH%;C:\path\to\flutter\bin"
```

<font style="color:rgb(27, 28, 33);">在 macOS 或 Linux 上，你可以在 </font>`<font style="color:rgb(27, 28, 33);">~/.bashrc</font>`<font style="color:rgb(27, 28, 33);">、</font>`<font style="color:rgb(27, 28, 33);">~/.zshrc</font>`<font style="color:rgb(27, 28, 33);"> 或 </font>`<font style="color:rgb(27, 28, 33);">~/.profile</font>`<font style="color:rgb(27, 28, 33);"> 文件中添加：</font>

```plain
export PATH="$PATH:/path/to/flutter/bin"
```

3. **<font style="color:rgb(27, 28, 33);">验证安装</font>**<font style="color:rgb(27, 28, 33);">: 打开终端（Terminal）或命令提示符（Command Prompt），运行以下命令来验证 Flutter 是否已正确安装：</font>

```plain
flutter doctor
```

<font style="color:rgb(27, 28, 33);">这个命令会检查你的开发环境并报告任何问题。</font>

4. **<font style="color:rgb(27, 28, 33);">创建新的 Flutter 项目</font>**<font style="color:rgb(27, 28, 33);">: 使用 </font>`<font style="color:rgb(27, 28, 33);">flutter create</font>`<font style="color:rgb(27, 28, 33);"> 命令来创建一个新的 Flutter 项目。例如，要创建一个名为 </font>`<font style="color:rgb(27, 28, 33);">my_flutter_app</font>`<font style="color:rgb(27, 28, 33);"> 的项目，可以运行：</font>

```plain
flutter create my_flutter_app
```

<font style="color:rgb(27, 28, 33);">这会在当前目录下创建一个名为 </font>`<font style="color:rgb(27, 28, 33);">my_flutter_app</font>`<font style="color:rgb(27, 28, 33);"> 的新文件夹，其中包含一个基本的 Flutter 应用结构。</font>

5. **<font style="color:rgb(27, 28, 33);">进入项目目录</font>**<font style="color:rgb(27, 28, 33);">: 切换到新创建的项目目录：</font>

```plain
cd my_flutter_app
```

6. **<font style="color:rgb(27, 28, 33);">运行项目</font>**<font style="color:rgb(27, 28, 33);">: 使用以下命令启动应用程序：</font>

```plain
flutter run
```

<font style="color:rgb(27, 28, 33);">这将编译并运行你的 Flutter 应用。如果你使用的是 Android Studio 或 Visual Studio Code，也可以直接从这些 IDE 中运行和调试你的应用。</font>

