# 阿里云 Alibaba Cloud Linux 3 安装 GitLab CE 指南
## 1. 环境准备
+ **系统**：Alibaba Cloud Linux 3（基于 RHEL 8）
+ **最低配置**：
    - CPU：2 核
    - 内存：4GB（推荐 8GB 以上）
    - 磁盘：20GB 以上
+ **网络要求**：
    - 已分配公网 IP
    - 开放 HTTP(80)、HTTPS(443) 和 SSH(22)，若自定义端口需额外开放
+ **访问方式**：SSH 终端登录（默认用户名 `admin` 或 `root`）

---

## 2. 系统更新
```bash
sudo dnf update -y
```

---

## 3. 安装依赖
```bash
sudo dnf install -y curl policycoreutils-python-utils perl
```

---

## 4. 添加 GitLab 官方仓库（兼容 alinux3）
GitLab 官方不识别 `alinux3`，需强制指定为 `el/8`：

```bash
curl -fsSL https://packages.gitlab.com/install/repositories/gitlab/gitlab-ce/script.rpm.sh -o /tmp/gitlab.repo.sh
sudo os=el dist=8 bash /tmp/gitlab.repo.sh
```

---

## 5. 安装 GitLab CE
`EXTERNAL_URL` 用于访问 GitLab 的地址，可填公网 IP 或域名，支持自定义端口：

```bash
sudo EXTERNAL_URL="http://47.108.177.82:7080" dnf install -y gitlab-ce
```

---

## 6. 初始化配置
```bash
sudo gitlab-ctl reconfigure
```

初始化会生成配置文件、创建数据库并启动服务，可能需要 3～10 分钟。

---

## 7. 配置防火墙
本地防火墙（firewalld）：

```bash
sudo firewall-cmd --permanent --add-port=7080/tcp
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

阿里云安全组：

+ 登录阿里云控制台 → 安全组 → 入方向规则
+ 添加 TCP 规则，端口范围：`22,80,443,7080`

---

## 8. SELinux 配置（保持安全）
```bash
sudo setsebool -P httpd_can_network_connect 1
```

---

## 9. 访问 GitLab
浏览器访问：

```cpp
http://47.108.177.82:7080
```

+ 首次登录会要求设置 **root** 密码
+ 默认管理员账号：`root`

---

## 10. 常用命令
```bash
sudo gitlab-ctl status         # 查看状态
sudo gitlab-ctl restart        # 重启服务
sudo gitlab-ctl stop           # 停止服务
sudo gitlab-ctl tail           # 查看实时日志
```

---

## 11. 修改域名或端口
编辑配置文件：

```bash
sudo vi /etc/gitlab/gitlab.rb
```

修改：

```ruby
external_url "http://gitlab.example.com"   # 可换成 https://...
```

然后重新加载配置：

```bash
sudo gitlab-ctl reconfigure
```

---

## 12. 启用 HTTPS（可选）
在 `/etc/gitlab/gitlab.rb` 中启用 Let’s Encrypt：

```ruby
external_url "https://gitlab.example.com"
letsencrypt['enable'] = true
```

然后：

```bash
sudo gitlab-ctl reconfigure
```

---

## 13. 数据备份与还原
**备份**：

```bash
sudo gitlab-rake gitlab:backup:create
```

**还原**：

```bash
sudo gitlab-rake gitlab:backup:restore BACKUP=<备份文件名>
```

---

## 14. 升级 GitLab
```bash
sudo dnf update -y gitlab-ce
sudo gitlab-ctl reconfigure
```

---

✅ **部署完成**  
至此，你的阿里云 alinux3 云服务器已成功安装并运行 GitLab CE，可直接在公网访问进行代码托管与协作。

