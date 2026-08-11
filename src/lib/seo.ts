/** SEO 辅助：把内容里的相对路径解析成绝对 URL */

const siteUrl: string = import.meta.env.SITE || '';

/** 相对路径（如 /og.svg）→ 绝对 URL；已是绝对地址则原样返回 */
export function absoluteUrl(path?: string | null): string | undefined {
	if (!path) return undefined;
	if (/^https?:\/\//i.test(path)) return path;
	if (path.startsWith('//')) return `https:${path}`;
	return new URL(path, siteUrl).toString();
}
