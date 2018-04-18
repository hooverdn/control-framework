import eslint from 'rollup-plugin-eslint';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

export default {
	external: [ 'three.js', 'Detector' ],
	globals: {
		'three.js': 'THREE',
	},
	input: 'src/object-controls.js',
	output: [
		{
			format: 'umd',
			name: 'OCONTROLS',
			file: 'build/js/object-controls.min.js'
		},
		{
			file: 'build/js/object-controls.module.js',
			format: 'es',
		}
	],
	plugins: [
		eslint({
			exclude: [
				'src/styles/**',
			]
		}),
		babel({
			exclude: 'node_modules/**',
		}),
		(process.env.NODE_ENV === 'production' && uglify()),
	],
};
