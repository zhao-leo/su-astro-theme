import type { Ring, RingNode } from '../components/radial/RadialCircle.astro';

/** 板块（中层 icon 环） */
export const sections = [
	{ id: 'home', label: '首页', icon: 'lucide:home', href: '/' },
	{ id: 'blog', label: '博客', icon: 'lucide:pen-line', href: '/blog/' },
	{ id: 'albums', label: '相册', icon: 'lucide:images', href: '/albums/' },
	{ id: 'tweets', label: '推文', icon: 'lucide:message-circle', href: '/tweets/' },
	{ id: 'projects', label: '项目', icon: 'lucide:folder', href: '/projects/' },
	{ id: 'friends', label: '友链', icon: 'lucide:link', href: '/friends/' },
	{ id: 'about', label: '关于', icon: 'lucide:user', href: '/about/' },
];

/** 将 n 个节点等分分布在 [from, to] 角度区间（0°=右，顺时针） */
export function spread(n: number, from: number, to: number): number[] {
	if (n <= 1) return [0];
	const step = (to - from) / (n - 1);
	return Array.from({ length: n }, (_, i) => from + i * step);
}

export interface CircleCore {
	title: string;
	subtitle?: string;
}

/**
 * 构造页面圆环：外层空轨道 + 中层 7 板块 icon（当前板块始终居中于 0°）
 */
export function buildRings(opts: { current: string; core: CircleCore }): Ring[] {
	// 重排板块：当前放中间（index 3），左右对称环绕（prev3 prev2 prev1 current next1 next2 next3）
	const n = sections.length;
	const mid = Math.floor(n / 2);
	const idx = Math.max(0, sections.findIndex((s) => s.id === opts.current));
	const ordered: typeof sections = [];
	for (let k = mid; k >= 0; k--) ordered.push(sections[(idx - k + n) % n]);
	for (let k = 1; k < n - mid; k++) ordered.push(sections[(idx + k) % n]);

	const middleAngles = spread(n, -90, 90); // 当前板块位于 0°（正中）
	const middleNodes: RingNode[] = ordered.map((s, i) => ({
		icon: s.icon,
		text: s.label,
		href: s.href,
		angle: middleAngles[i],
		active: s.id === opts.current,
	}));

	return [
		// 仅中层图标环（外层轨道已移除）
		{ radius: 360, thickness: 15, nodes: middleNodes },
	];
}
