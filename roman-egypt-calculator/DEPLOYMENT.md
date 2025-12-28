# 部署指南 | Deployment Guide

## 🚀 Part 1: GitHub Pages 部署 (推荐国际用户)

### 方法 A: 通过网页上传 (最简单)

#### 步骤 1: 创建 GitHub 账号
1. 访问 https://github.com
2. 点击 "Sign up" 注册账号
3. 验证邮箱

#### 步骤 2: 创建新仓库
1. 点击右上角 "+" → "New repository"
2. 填写信息:
   - **Repository name**: `roman-egypt-calculator` (或任意名称)
   - **Description**: 千年穿越计算器 - Roman Egypt Economic Calculator
   - **Visibility**: 选择 `Public` (GitHub Pages 免费版需要公开仓库)
   - ✅ 勾选 "Add a README file"
3. 点击 "Create repository"

#### 步骤 3: 上传文件
1. 在仓库页面，点击 "Add file" → "Upload files"
2. 将以下文件/文件夹拖入:
   ```
   index.html
   css/
   js/
   assets/ (如果有)
   README.md
   ```
3. 在 "Commit changes" 处填写 "Initial upload"
4. 点击 "Commit changes"

#### 步骤 4: 启用 GitHub Pages
1. 点击仓库的 "Settings" 标签
2. 左侧菜单找到 "Pages"
3. 在 "Source" 下:
   - Branch: 选择 `main`
   - Folder: 选择 `/ (root)`
4. 点击 "Save"
5. 等待 1-3 分钟，页面会显示你的网站地址：
   ```
   https://你的用户名.github.io/roman-egypt-calculator/
   ```

### 方法 B: 通过 Git 命令行 (推荐开发者)

```bash
# 1. 安装 Git (如果未安装)
# Windows: https://git-scm.com/download/win
# Mac: brew install git
# Linux: sudo apt install git

# 2. 配置 Git
git config --global user.name "你的用户名"
git config --global user.email "你的邮箱"

# 3. 克隆空仓库 (先在 GitHub 网页创建空仓库)
git clone https://github.com/你的用户名/roman-egypt-calculator.git
cd roman-egypt-calculator

# 4. 复制项目文件到此文件夹
# (手动复制 index.html, css/, js/, assets/ 等)

# 5. 提交并推送
git add .
git commit -m "Initial commit: Roman Egypt Calculator"
git push origin main

# 6. 然后去 GitHub Settings → Pages 启用
```

---

## 🇨🇳 Part 2: Gitee 码云部署 (推荐中国大陆用户)

**Gitee (码云)** 是中国的 GitHub 替代品，服务器在国内，访问速度快，也支持 Pages 功能。

### 步骤 1: 注册 Gitee 账号
1. 访问 https://gitee.com
2. 点击 "注册" 
3. 可用手机号或邮箱注册
4. 完成实名认证 (Gitee Pages 可能需要)

### 步骤 2: 创建新仓库
1. 点击右上角 "+" → "新建仓库"
2. 填写:
   - **仓库名称**: `roman-egypt-calculator`
   - **仓库介绍**: 千年穿越计算器
   - **是否开源**: 先选私有，之后可改为公开
3. 点击 "创建"

### 步骤 3: 上传文件
方法一: 网页上传
1. 点击 "上传文件"
2. 拖入所有项目文件

方法二: Git 命令
```bash
git remote add gitee https://gitee.com/你的用户名/roman-egypt-calculator.git
git push gitee main
```

### 步骤 4: 启用 Gitee Pages
1. 进入仓库 → "服务" → "Gitee Pages"
2. 选择部署分支: `main`
3. 选择部署目录: 根目录
4. 点击 "启动"
5. 网站地址: `https://你的用户名.gitee.io/roman-egypt-calculator`

**⚠️ 注意**: 
- Gitee Pages 可能需要实名认证
- 公开仓库才能使用 Gitee Pages
- 2022年后 Gitee 对公开仓库有内容审核

---

## 🔄 Part 3: GitHub + Gitee 双向镜像同步

### 方法 A: 从 GitHub 导入到 Gitee

1. 登录 Gitee
2. 点击 "+" → "从 GitHub/GitLab 导入仓库"
3. 授权 GitHub 账号
4. 选择要导入的仓库
5. 点击 "导入"

### 方法 B: 设置自动镜像同步

在 Gitee 仓库设置中:
1. 进入 "管理" → "仓库镜像管理"
2. 添加 GitHub 仓库地址
3. 选择同步方式:
   - **推送镜像**: Gitee → GitHub (主仓库在 Gitee)
   - **拉取镜像**: GitHub → Gitee (主仓库在 GitHub)
4. 可设置自动同步或手动同步

### 方法 C: 本地同时推送两个平台

```bash
# 添加两个远程仓库
git remote add github https://github.com/用户名/roman-egypt-calculator.git
git remote add gitee https://gitee.com/用户名/roman-egypt-calculator.git

# 推送到两个平台
git push github main
git push gitee main

# 或者一次性推送到所有远程
git remote set-url --add origin https://gitee.com/用户名/roman-egypt-calculator.git
git push origin main  # 会同时推送到两个平台
```

---

## 🌐 Part 4: 自定义域名 (可选)

### GitHub Pages 自定义域名

1. 在仓库根目录创建 `CNAME` 文件，内容为你的域名:
   ```
   calculator.yourdomain.com
   ```

2. 在域名 DNS 设置中添加:
   ```
   类型: CNAME
   主机: calculator (或 @)
   值: 你的用户名.github.io
   ```

3. 等待 DNS 生效 (最多 48 小时)

4. 在 GitHub Settings → Pages 中勾选 "Enforce HTTPS"

### Gitee Pages 自定义域名

Gitee Pages 专业版支持自定义域名，免费版不支持。

---

## 📱 Part 5: 微信公众号嵌入

### 方法 1: 阅读原文链接
在文章末尾添加 "阅读原文" 链接指向你的网站。

### 方法 2: 小程序 webview
如果你有小程序，可以用 `<web-view>` 组件嵌入:
```html
<web-view src="https://你的域名/roman-egypt-calculator/"></web-view>
```
注意: 需要在小程序后台配置业务域名白名单。

### 方法 3: 公众号文章内嵌
微信公众号文章不支持直接嵌入 iframe，但可以:
- 插入二维码图片让读者扫码访问
- 使用 "阅读原文" 跳转

---

## 🔧 Part 6: 故障排除

### 问题: 404 页面未找到
- 确保 `index.html` 在仓库根目录
- 检查仓库是否设为 Public
- 等待 GitHub Actions 部署完成 (查看 Actions 标签)

### 问题: CSS/JS 未加载
- 检查文件路径是否正确 (区分大小写)
- 确保文件夹结构: `css/styles.css`, `js/app.js`

### 问题: 中国访问慢
- 使用 Gitee 镜像
- 或购买国内云服务 (阿里云 OSS / 腾讯云 COS)

### 问题: Gitee Pages 无法启用
- 需要实名认证
- 仓库需要设为公开
- 仓库需要通过内容审核

---

## 📊 性能优化建议

1. **压缩图片**: 使用 TinyPNG 压缩图片资源
2. **合并文件**: 考虑合并 CSS/JS 为单文件减少请求
3. **添加 PWA**: 添加 `manifest.json` 和 Service Worker 支持离线访问
4. **CDN 加速**: 使用 jsDelivr CDN 加速 GitHub 资源在中国的访问:
   ```
   https://cdn.jsdelivr.net/gh/用户名/仓库名@分支/文件路径
   ```

---

## ✅ 部署检查清单

- [ ] index.html 在根目录
- [ ] css/styles.css 路径正确
- [ ] js/harper-data.js 路径正确
- [ ] js/calculator.js 路径正确
- [ ] js/app.js 路径正确
- [ ] 仓库设为 Public
- [ ] GitHub Pages 已启用
- [ ] 网站可正常访问
- [ ] (可选) Gitee 镜像已设置
- [ ] (可选) 自定义域名已配置
