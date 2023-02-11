import alias from '@rollup/plugin-alias';
const replace = require('@rollup/plugin-replace');
const vue = require('rollup-plugin-vue');

export default {
	input: 'src/npc/js/main.js',
	output: {
		file: 'dev/npc/js/main.js',
		format: 'iife',
		sourcemap: 'inline',
		sourcemapExcludeSources: true,
		// Instructs that when importing from 'vue' it should use global variable Vue instead
		globals: {
			vue: 'Vue',
			'vue-i18n': 'VueI18n'
		}
	},
	watch: {
		clearScreen: false
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
		})
	],
	// Assume these references are to external files
	external: ['vue', 'vue-i18n']
};
