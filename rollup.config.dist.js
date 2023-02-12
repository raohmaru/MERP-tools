import { nodeResolve } from '@rollup/plugin-node-resolve';
import alias from '@rollup/plugin-alias';
import replace from '@rollup/plugin-replace';
import vue from 'rollup-plugin-vue';
import terser from '@rollup/plugin-terser';

export default {
	input: 'src/npc/js/main.js',
	output: {
		dir: 'dist/npc/js/',
		format: 'es',
		sourcemap: false,
		// Export chunks
		manualChunks: {
			vue: ['vue', 'vue-i18n']
		}
	},
	plugins: [
		// Allows to import .vue files
		vue(),
		// Vue’s esm build expects process.env.NODE_ENV to be available / replaced with a string
		replace({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
			preventAssignment: true
		}),
		alias({
			entries: [
				{ find: '@utils', replacement: './src/common/js/utils' }
			]
		}),
		// Used to resolve node_modules
		nodeResolve(),
		// Minification
		terser()
	]
};
