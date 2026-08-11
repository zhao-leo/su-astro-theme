import { getEntry } from 'astro:content';

/** 读取全局配置 src/content/su.toml */
export async function getSite() {
	const entry = await getEntry('su', 'su');
	if (!entry) throw new Error('缺少全局配置：src/content/su.toml');
	return entry.data;
}

/** 主导航（顺序即显示顺序） */
export async function getNav() {
	const site = await getSite();
	return site.nav;
}

/** 页脚信息 */
export async function getFooter() {
	const site = await getSite();
	return site.footer;
}
