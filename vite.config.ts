import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit(), cssHMR(), yamlHMR()],
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
