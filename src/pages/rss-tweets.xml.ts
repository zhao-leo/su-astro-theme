import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { getSite } from '../lib/site';

/** 推文 RSS */
export async function GET(context: { site: string }) {
	const site = await getSite();
	const tweets = (await getCollection('tweets')).sort(
		(a, b) => b.data.date.getTime() - a.data.date.getTime(),
	);
	return rss({
		title: `${site.title} · 推文`,
		description: `推文订阅：${site.description}`,
		site: context.site,
		items: tweets.map((tweet) => ({
			title: tweet.data.content.slice(0, 40) + (tweet.data.content.length > 40 ? '…' : ''),
			pubDate: tweet.data.date,
			description: tweet.data.content,
			link: '/tweets/',
		})),
		customData: '<language>zh-CN</language>',
	});
}
