# 素（su）

> 素净、简朴。一个内容与主题分离的 Astro 静态个人站点主题。

「素」取素净之意：去繁就简的径向信息架构、克制的双主题、专注于内容本身。
支持博客、相册、推文、项目、友链、关于六大板块。

## 特性

- **径向信息架构**：左侧被裁切的同心圆环导航 + 右侧内容区，每个板块一个独立页面（SEO 友好）
- **响应式自适应**：圆环按视口高度自动缩放（桌面/笔记本/手机横屏），长边为底边时显示环形布局；竖屏自动切换为底部导航条
- **双主题**：`nord`（浅色）/ `business`（深色）
- **加密博客**：构建时 markdown → PBKDF2(150k) + AES-256-GCM 加密，前端在线解密，页面无明文，支持密码显示/隐藏
- **相册**：横向拓展卡片、幻灯片轮播、EXIF 表格（表格分界线、无信息自动隐藏）、全屏查看
- **三个 RSS**：博客 / 相册 / 推文 独立订阅源 + 自动生成 Sitemap
- **内容与主题分离**：全部内容在 `src/content/`，主题在 `src/` 其余目录，可拆分为模板仓库 + 内容仓库
- **分析工具注入**：su.toml 声明分析工具名，自动注入 `src/content/analysis/<name>.html`

## 快速开始

```sh
pnpm install
pnpm dev        # 开发（http://localhost:4321）
pnpm build      # 构建到 dist/
pnpm preview    # 预览构建产物
pnpm check      # 类型检查（astro check）
```

后台开发服务器：`astro dev --background` / `astro dev status` / `astro dev stop` / `astro dev logs`。

## 内容结构

所有内容都放在 `src/content/` 下，通过 `src/content.config.ts` 注册的 content collections 连接主题。

```
src/content/
├── su.toml                    # 全局配置（见下方）
├── blogs/*.md                 # 博客（frontmatter：title/date/tags/description/draft/pinned/password）
├── albums/*.toml              # 相册（title/date/description/location/cover + [[photos]]）
├── tweets/*.toml              # 推文（content/date/images/source）
├── projects/*.toml            # 项目（数字前缀排序 + tags/featured）
├── friends/*.toml             # 友链（数字前缀排序）
├── about/index.md             # 关于我
├── analysis/*.html            # 分析工具代码片段（su.toml 的 analysis 数组引用）
└── public/                    # 随构建合并进站点的静态文件（CNAME、favicon 等）
```

### su.toml 全局配置

| 字段 | 说明 |
| --- | --- |
| `site` | 部署域名（RSS / Sitemap / OG 依赖） |
| `title` / `description` / `author` / `language` | 站点元信息 |
| `[[nav]]` | 主导航（顺序即显示顺序，icon 为 astro-icon id） |
| `[footer]` | `icp` / `moeicp`（萌ICP备案，链接自动从文字提取数字）/ `since` |
| `[profile]` | 头像、简介、社交链接（simple-icons + astro-icon） |
| `[seo]` | `ogImage` / `twitter` |
| `favicon` | 站点图标（相对路径或绝对 URL，type 按扩展名自动推断） |
| `analysis` | 分析工具名数组，对应 `src/content/analysis/<name>.html`，缺失自动跳过 |

## 路由

| 路由 | 说明 |
| --- | --- |
| `/` | 首页（简介 / 社交链接 / 订阅入口 / 备案） |
| `/blog/` | 博客列表（置顶优先，加密文章带 🔒） |
| `/blog/[slug]/` | 文章详情（阅读进度弧 / 上一篇下一篇 / 加密解锁） |
| `/blog/tag/[tag]/` | 标签页（相关标签外环推荐） |
| `/albums/` | 相册列表 |
| `/albums/[slug]/` | 相册详情（幻灯片 / EXIF / 全屏） |
| `/tweets/` | 推文（月份分组） |
| `/projects/` | 项目展示 |
| `/projects/tag/[tag]/` | 项目标签页 |
| `/friends/` | 友链 |
| `/about/` | 关于我 |
| `/rss.xml` | 博客订阅源（加密文章不进入） |
| `/rss-albums.xml` | 相册订阅源 |
| `/rss-tweets.xml` | 推文订阅源 |
| `/sitemap-index.xml` | 站点地图（自动生成，排除加密文章与资源路由） |

## 加密博客

- 文章 frontmatter 设置 `password` 即启用加密
- 构建时：markdown → HTML（shiki 高亮）→ PBKDF2(150k) + AES-256-GCM 加密，页面只含密文
- 前端同流程在线解密，解密后与普通文章一致
- 加密文章**不进入 RSS 与 Sitemap**，但仍可通过分享 URL 直达（页面本身无明文）

## 技术栈

- [Astro](https://astro.build)（Content Layer，原生 TOML 数据条目）
- [Tailwind CSS 4](https://tailwindcss.com) + [daisyUI 5](https://daisyui.com)
- [astro-icon](https://github.com/natemoo-re/astro-icon)（lucide + simple-icons）
- [astro-seo](https://github.com/jonasmerlin/astro-seo)（SEO meta / OG / Twitter）
- [@astrojs/rss](https://docs.astro.build/en/guides/rss/) / [@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/)
- [exifr](https://github.com/MikeKovarik/exifr)（相册 EXIF 提取）

主题配置（颜色 / 圆角 / 玻璃质感变量）在 `src/styles/global.css` 顶部的 `@plugin "daisyui/theme"` 块中。

## 仓库拆分（模板 + 内容）

站点拆成两个仓库：

- **模板仓库**（本仓库）：全部代码
- **内容仓库**：仅内容目录（`blogs/` `albums/` `tweets/` `projects/` `friends/` `about/` + `su.toml` + `analysis/` + `public/`），仓库根即目录结构

构建合并（CI）：clone 内容仓库到 `src/content/`，再 `pnpm build` 部署（GitHub Pages 等）。

模板仓库 `.gitignore`：

```
src/content/*
!src/content/su.toml
```
