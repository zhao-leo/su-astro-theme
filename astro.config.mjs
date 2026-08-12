// @ts-check
import { cpSync, rmSync, watch } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import * as toml from 'smol-toml';

// site 从 src/content/su.toml 读取（内容侧唯一配置源）
const su = toml.parse(readFileSync('./src/content/su.toml', 'utf-8'));

// —— public 目录合并 ——
// 顶层 public/ 与 src/content/public/（内容仓库侧）合并到 .astro/merged-public，
// 作为 Astro 的 publicDir —— build 与 dev 都生效（dev 下内容仓库 public 变更实时同步）
const mergedPublic = fileURLToPath(new URL('./.astro/merged-public', import.meta.url));
const topPublic = fileURLToPath(new URL('./public', import.meta.url));
const contentPublic = fileURLToPath(new URL('./src/content/public', import.meta.url));

function syncPublic() {
	rmSync(mergedPublic, { recursive: true, force: true });
	cpSync(topPublic, mergedPublic, { recursive: true });
	cpSync(contentPublic, mergedPublic, { recursive: true });
}
syncPublic();

// dev / 构建进程存续期间：监听内容仓库 public 变更，实时同步
try {
	watch(contentPublic, { recursive: true }, () => syncPublic());
} catch {
	/* 目录不存在时忽略 */
}

export default defineConfig({
	site: typeof su.site === 'string' ? su.site : undefined,
	integrations: [
		sitemap({
			// 只收录 HTML 页面，排除 rss.xml 等资源路由
			filter: (page) => !page.endsWith('.xml'),
		}),
		icon(),
	],
	publicDir: mergedPublic,
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
