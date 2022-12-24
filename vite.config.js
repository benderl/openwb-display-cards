import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import nodePolyfills from "vite-plugin-node-stdlib-browser";
import rollupNodePolyFill from "rollup-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue(), nodePolyfills()],
	base: "/openWB/web/display/openwb-display-cards/",
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
	build: {
		rollupOptions: {
			plugins: [rollupNodePolyFill()],
			output: {
				manualChunks(id) {
					if (id.includes("node_modules")) {
						if (id.includes("inkline")) {
							return "vendor-inkline";
						}
						if (id.includes("fortawesome")) {
							return "vendor-fortawesome";
						}
						return "vendor";
					}
				},
			},
		},
	},
});
