import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { getSite } from '../lib/site';

/** 博客 RSS（只含元数据，加密文章不含正文） */
export async function GET(context: { site: string }) {
	const site = await getSite();
	const posts = (await getCollection('blogs', ({ data }) => !data.draft && !data.password)).sort(
		(a, b) => b.data.date.getTime() - a.data.date.getTime(),
	);
	return rss({
		title: `${site.title} · 博客`,
		description: site.description,
		site: context.site,
		items: posts.map((post) => ({
			title: post.data.title,
			pubDate: post.data.date,
			description: post.data.description,
			link: `/blog/${post.id}/`,
			categories: post.data.tags,
		})),
		customData: '<language>zh-CN</language>',
	});
}
