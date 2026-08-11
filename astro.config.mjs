// @ts-check
import { readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import * as toml from 'smol-toml';

// site 从 src/content/su.toml 读取（内容侧唯一配置源）
const su = toml.parse(readFileSync('./src/content/su.toml', 'utf-8'));

// https://astro.build/config
export default defineConfig({
	site: typeof su.site === 'string' ? su.site : undefined,
	integrations: [
		sitemap({
			// 只收录 HTML 页面，排除 rss.xml 等资源路由
			filter: (page) => !page.endsWith('.xml'),
		}),
		icon(),
	],
	vite: {
		plugins: [tailwindcss()],
	},
	markdown: {
		shikiConfig: {
			// 双主题：浅色 / 深色，跟随 html[data-theme] 切换（global.css 中覆盖）
			themes: { light: 'github-light', dark: 'github-dark' },
			// @ts-expect-error Astro 7 类型声明未包含该字段（shiki 运行时仍支持）
			cssVariablePrefix: '--shiki-',
		},
	},
});
