import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		proxy: {
			'/socket.io': {
				target: 'ws://localhost:7870',
				ws: true
			}
		}
	}
});
