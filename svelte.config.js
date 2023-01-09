import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		alias: {
			$utils: './src/utils',
			$models: './src/models'
		}
	},
	preprocess: [
		preprocess({
			postcss: true
		})
	]
};

export default config;
