import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import nodePolyfills from 'vite-plugin-node-stdlib-browser'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		nodePolyfills()
	],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	test: {
		globals: true,
		environment: "jsdom",
	},
	server: {
		proxy: {
			"/ws": {
				target: "ws://localhost:9001",
				ws: true,
			},
		},
	},
});
