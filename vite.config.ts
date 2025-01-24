import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
	plugins: [
		sveltekit(),
		cssHMR(),
		yamlHMR(),
		viteStaticCopy({
			targets: [
				{
					src: 'content',
					dest: '.',
				}
			]
		}),
	],
	server: {
		fs: {
			allow: [
				"content/media",
			],
		},
	},
});

function cssHMR() {
	return {
		name: 'css-hmr',
		enforce: 'post' as const,
		handleHotUpdate({ file, server }: any) {
			if (file.endsWith('.css')) {
				server.ws.send({
					type: 'full-reload',
					path: '*'
				});
			}
		}
	};
}


function yamlHMR() {
	return {
		name: 'yaml-hmr',
		enforce: 'post' as const,
		handleHotUpdate({ file, server }: any) {
			if (file.endsWith('.yaml')) {
				server.ws.send({
					type: 'full-reload',
					path: '*'
				});
			}
		}
	};
}
