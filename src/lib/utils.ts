/** 工具函数：日期格式化、排序等 */

export function formatDate(date: Date, locale = 'zh-CN'): string {
	return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(date);
}

export function formatDateTime(date: Date): string {
	return new Intl.DateTimeFormat('zh-CN', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

/** 按 data.date 降序排序（内容集合条目） */
export function sortByDateDesc<T extends { data: { date: Date } }>(items: T[]): T[] {
	return [...items].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** 按 id 字符串排序（数字前缀文件名，如 01-xxx.toml） */
export function sortById<T extends { id: string }>(items: T[]): T[] {
	return [...items].sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
}
