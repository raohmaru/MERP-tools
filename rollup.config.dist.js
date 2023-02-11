import { nodeResolve } from '@rollup/plugin-node-resolve';
import alias from '@rollup/plugin-alias';
const replace = require('@rollup/plugin-replace');
const vue = require('rollup-plugin-vue');

export default {
	input: 'src/npc/js/main.js',
	output: {
		dir: 'dist/npc/js/',
		format: 'es',
		sourcemap: false
	},
	// Export chunks
	manualChunks: {
		vue: ['vue', 'vue-i18n']
	},
	plugins: [
		// Allows to import .vue files
		vue(),
		// Vue’s esm build expects process.env.NODE_ENV to be available / replaced with a string
		replace({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
		}),
		alias({
			entries: [
				{ find: '@utils', replacement: './src/common/js/utils' }
			]
		}),
		// Used to resolve node_modules
		nodeResolve()
	]
};
