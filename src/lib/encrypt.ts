import { createSatteriMarkdownProcessor } from '@astrojs/markdown-satteri';

/** PBKDF2 迭代次数：前端解密时与构建时一致 */
export const PBKDF2_ITERATIONS = 150_000;

export interface EncryptedPayload {
	salt: string;
	iv: string;
	data: string;
	iterations: number;
}

const subtle = globalThis.crypto.subtle;

function toBase64(bytes: Uint8Array): string {
	return Buffer.from(bytes).toString('base64');
}

async function deriveKey(password: string, salt: Uint8Array<ArrayBuffer>, iterations: number, usages: KeyUsage[]) {
	const baseKey = await subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, [
		'deriveKey',
	]);
	return subtle.deriveKey(
		{ name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
		baseKey,
		{ name: 'AES-GCM', length: 256 },
		false,
		usages,
	);
}

/**
 * 构建时加密文章正文：
 * 1. markdown → HTML（与 Astro 渲染一致：GFM + shiki 双主题高亮）
 * 2. PBKDF2(password, salt) 派生密钥 → AES-256-GCM 加密
 * 前端用 WebCrypto 同样流程解密，明文不进 SSR HTML。
 */
export async function encryptPost(md: string, password: string): Promise<EncryptedPayload> {
	const processor = await createSatteriMarkdownProcessor({
		syntaxHighlight: 'shiki',
		shikiConfig: {
			themes: { light: 'github-light', dark: 'github-dark' },
			// @ts-expect-error Astro 类型声明未包含该字段（shiki 运行时仍支持）
			cssVariablePrefix: '--shiki-',
		},
		gfm: true,
		smartypants: false,
	});
	const { code } = await processor.render(md, { frontmatter: {} });

	const salt = crypto.getRandomValues(new Uint8Array(16)) as Uint8Array<ArrayBuffer>;
	const iv = crypto.getRandomValues(new Uint8Array(12)) as Uint8Array<ArrayBuffer>;
	const key = await deriveKey(password, salt, PBKDF2_ITERATIONS, ['encrypt']);
	const cipher = await subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(code));

	return {
		salt: toBase64(salt),
		iv: toBase64(iv),
		data: toBase64(new Uint8Array(cipher)),
		iterations: PBKDF2_ITERATIONS,
	};
}
