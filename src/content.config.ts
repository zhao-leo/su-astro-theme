import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * 全局配置：src/content/su.toml
 * 通过 getEntry('su', 'su') 读取整个对象
 */
const su = defineCollection({
	loader: glob({ pattern: 'su.toml', base: './src/content' }),
	schema: z.object({
		site: z.string().url(),
		title: z.string(),
		description: z.string(),
		author: z.string(),
		language: z.string().default('zh-CN'),
		nav: z
			.array(
				z.object({
					label: z.string(),
					href: z.string(),
					/** 导航图标（astro-icon id，如 lucide:pen-line） */
					icon: z.string().optional(),
				}),
			)
			.default([]),
		footer: z
			.object({
				icp: z.string().optional(),
				/** 萌ICP备案（文字，如“萌ICP备20250610号”；链接自动从文字提取数字） */
				moeicp: z.string().optional(),
				since: z.number().optional(),
			})
			.optional(),
		/** 博主信息（主页双列布局侧栏用） */
		profile: z
			.object({
				avatar: z.string().optional(),
				bio: z.string().optional(),
				/** 头像点击跳转的站点链接 */
				url: z.string().optional(),
				/** 社交链接：icon 为 astro-icon 的 id（如 simple-icons:github） */
				links: z
					.array(
						z.object({
							name: z.string(),
							url: z.string(),
							icon: z.string(),
						}),
					)
					.default([]),
			})
			.optional(),
		seo: z
			.object({
				ogImage: z.string().optional(),
				twitter: z.string().optional(),
			})
			.optional(),
		/** 分析工具列表：名称对应 src/content/analysis/<name>.html，构建时注入 <head>（缺失自动跳过） */
		analysis: z.array(z.string()).default([]),
		/** 站点 favicon：相对路径（如 /favicon.png）或绝对 URL 均可 */
		favicon: z.string().optional(),
	}),
});

/** 博客文章：src/content/blogs/*.md，文件名即 slug */
const blogs = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/blogs' }),
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		date: z.coerce.date(),
		tags: z.array(z.string()).default([]),
		cover: z.string().optional(),
		draft: z.boolean().default(false),
		pinned: z.boolean().default(false),
		/** 设置后正文加密，需输入密码解锁（构建时 AES-GCM 加密） */
		password: z.string().optional(),
	}),
});

/** 相册：src/content/albums/*.toml */
const albums = defineCollection({
	loader: glob({ pattern: '**/*.toml', base: './src/content/albums' }),
	schema: z.object({
		title: z.string(),
		date: z.coerce.date(),
		description: z.string().optional(),
		cover: z.string().optional(),
		location: z.string().optional(),
		photos: z
			.array(
				z.object({
					src: z.string(),
					caption: z.string().optional(),
				}),
			)
			.default([]),
	}),
});

/** 推文：src/content/tweets/*.toml */
const tweets = defineCollection({
	loader: glob({ pattern: '**/*.toml', base: './src/content/tweets' }),
	schema: z.object({
		content: z.string(),
		date: z.coerce.date(),
		images: z.array(z.string()).optional(),
		source: z.string().optional(),
	}),
});

/** 歌单：src/content/music/playlist/*.toml */
const music = defineCollection({
	loader: glob({ pattern: '**/*.toml', base: './src/content/music/playlist' }),
	schema: z.object({
		title: z.string(),
		provider: z.string(),
		description: z.string().optional(),
		cover: z.string().optional(),
		songs: z
			.array(
				z.object({
					id: z.string(),
					title: z.string(),
					artist: z.string(),
					duration: z.string().optional(),
				}),
			)
			.default([]),
	}),
});

/** 项目展示：src/content/projects/*.toml（文件名数字前缀用于排序） */
const projects = defineCollection({
	loader: glob({ pattern: '**/*.toml', base: './src/content/projects' }),
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		/** 必选：项目主页 */
		url: z.string(),
		/** 可选：源码仓库链接 */
		repo: z.string().optional(),
		/** 可选：包 / 制品链接（npm 等） */
		package: z.string().optional(),
		tags: z.array(z.string()).default([]),
		featured: z.boolean().default(false),
	}),
});

/** 友链：src/content/friends/*.toml（文件名数字前缀用于排序） */
const friends = defineCollection({
	loader: glob({ pattern: '**/*.toml', base: './src/content/friends' }),
	schema: z.object({
		name: z.string(),
		url: z.string(),
		avatar: z.string().optional(),
		description: z.string().optional(),
	}),
});

/** 关于我：src/content/about/index.md */
const about = defineCollection({
	loader: glob({ pattern: 'index.md', base: './src/content/about' }),
	schema: z.object({
		title: z.string().default('关于我'),
	}),
});

export const collections = { su, blogs, albums, tweets, music, projects, friends, about };
