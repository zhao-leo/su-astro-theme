import { getCollection } from 'astro:content';

/** 排序：置顶 + 日期降序 */
function sortPosts<T extends { data: { pinned?: boolean; date: Date } }>(posts: T[]): T[] {
	return posts.sort((a, b) => {
		if (a.data.pinned !== b.data.pinned) return a.data.pinned ? -1 : 1;
		return b.data.date.getTime() - a.data.date.getTime();
	});
}

/** 全部文章：置顶 + 日期降序（列表/tag/详情页均显示，含加密文章） */
export async function getPosts() {
	return sortPosts(await getCollection('blogs'));
}

/** 标签及其文章数（按出现次数降序） */
export async function getTags(): Promise<[string, number][]> {
	const posts = await getPosts();
	const counts = new Map<string, number>();
	for (const post of posts) {
		for (const tag of post.data.tags) {
			counts.set(tag, (counts.get(tag) ?? 0) + 1);
		}
	}
	return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}
