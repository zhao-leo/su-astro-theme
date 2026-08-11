# su · 苏的小站

内容与主题分离的 Astro 静态个人站点：博客、相册、推文、听歌、项目、友链、关于。

## 快速开始

```sh
pnpm install
pnpm dev        # 开发
pnpm build      # 构建到 dist/
pnpm preview    # 预览构建产物
pnpm check      # 类型检查（astro check）
```

后台开发服务器：`astro dev --background` / `astro dev status` / `astro dev stop` / `astro dev logs`。

## 内容结构

所有内容都放在 `src/content/` 下（下文记作 `$`），主题（布局、组件、样式）在 `src/` 的其他目录，
二者通过 `src/content.config.ts` 注册的 content collections 连接。

```
src/content/
├── su.toml                  # 全局配置（标题、导航、页脚、SEO 默认值）
├── blogs/*.md               # 博客文章（frontmatter：title/date/tags/description/cover/draft/pinned）
├── albums/*.toml            # 相册（title/date/description/location/cover + [[photos]]）
├── tweets/*.toml            # 推文（content/date/images/source）
├── music/
│   ├── playlist/*.toml      # 歌单（title/provider/description/cover + [[songs]]）
│   └── provider/*.js        # 音乐来源（文件名即 provider 名，导出 label/type/resolve）
├── projects/*.toml          # 项目（01-xxx.toml，数字前缀用于排序）
├── friends/*.toml           # 友链（01-xxx.toml，数字前缀用于排序）
└── about/index.md           # 关于我
```

### 说明

- `site` 域名只在 `astro.config.mjs` 配置（RSS / Sitemap / OG 都依赖它）。
- 照片支持外链或本站 `public/` 下的路径。
- 歌单的 `provider` 字段对应 `$/music/provider/` 下的文件名，
  换播放源 = 新增 provider 文件 + 改歌单的 `provider` 字段。

## 路由

| 路由 | 说明 |
| --- | --- |
| `/` | 首页聚合 |
| `/blog/` `/blog/2/…` | 博客列表（分页） |
| `/blog/[slug]/` | 文章详情（TOC / 上一篇下一篇 / JSON-LD） |
| `/blog/tag/[tag]/` | 标签页 |
| `/albums/` `/albums/[slug]/` | 相册（照片墙 + 灯箱） |
| `/tweets/` `/tweets/2/…` | 推文时间线（分页） |
| `/music/` `/music/[slug]/` | 歌单（audio / iframe 双模式播放器） |
| `/projects/` | 项目展示 |
| `/friends/` | 友链 |
| `/about/` | 关于我 |
| `/rss.xml` | 博客订阅源 |
| `/rss-albums.xml` | 相册订阅源 |
| `/sitemap-index.xml` | 站点地图（自动生成） |

## 技术栈

- [Astro](https://astro.build)（Content Layer，原生 TOML 数据条目）
- [Tailwind CSS 4](https://tailwindcss.com) + [daisyUI 5](https://daisyui.com)（组件库）
- 默认双主题：`winter`（默认浅色）/ `dracula`（跟随系统深色），右上角按钮切换并记忆选择（localStorage），调色盘下拉可选其他 daisyUI 内置主题
- [astro-seo](https://github.com/jonasmerlin/astro-seo)（SEO meta / OG / Twitter）
- [@astrojs/rss](https://docs.astro.build/en/guides/rss/)（双订阅源）
- [@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/)

主题配置（颜色 / 圆角 / 阴影）在 `src/styles/global.css` 顶部的 `@plugin "daisyui/theme"` 块中。

### 仓库拆分（模板 + 内容）

站点计划拆成两个仓库：

- **模板仓库**（本仓库）：全部代码 + `src/content/su.toml`（站点配置）
- **内容仓库**：仅各 collection 目录（`blogs/` `albums/` `tweets/` `music/` `projects/` `friends/` `about/`），仓库根即目录结构

构建合并（CI）：clone 内容仓库到 `src/content/`（保留模板的 `su.toml`），再 `pnpm build` 部署到 GitHub Pages。

`.gitignore` 模板：

```
src/content/*
!src/content/su.toml
```

