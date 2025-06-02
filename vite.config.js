import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import nodePolyfills from 'vite-plugin-node-stdlib-browser';

export default defineConfig({
	plugins: [react(), nodePolyfills()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	optimizeDeps: {
		exclude: ['html-docx-js'], // 🛑 tell Vite not to pre-bundle this
	},
});
