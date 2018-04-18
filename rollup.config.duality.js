import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import uglify from 'rollup-plugin-uglify';

export default {
	external: [ 'three.js', 'Detector', 'object-controls' ],
	globals: {
		'three.js': 'THREE',
		'Detector': 'Detector',
		'object-controls': 'OCONTROLS'
	},
	input: 'examples/js/duality-main.js',
	output: [
		{
			format: 'iife',
			file: 'build/js/duality-main.min.js'
		},
	],
	plugins: [
		eslint({
			exclude: [
				'src/styles/**',
				'build/js/object-controls.module.js',
			]
		}),
		babel({
			exclude: 'node_modules/**',
		}),
		(process.env.NODE_ENV === 'production' && uglify()),
	],
};
