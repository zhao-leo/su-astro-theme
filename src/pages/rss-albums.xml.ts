import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { getSite } from '../lib/site';

/** 相册 RSS */
export async function GET(context: { site: string }) {
	const site = await getSite();
	const albums = (await getCollection('albums')).sort(
		(a, b) => b.data.date.getTime() - a.data.date.getTime(),
	);
	return rss({
		title: `${site.title} · 相册`,
		description: `相册订阅：${site.description}`,
		site: context.site,
		items: albums.map((album) => ({
			title: album.data.title,
			pubDate: album.data.date,
			description: album.data.description ?? `${album.data.photos.length} 张照片`,
			link: `/albums/${album.id}/`,
		})),
		customData: '<language>zh-CN</language>',
	});
}
