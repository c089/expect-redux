import babel from 'rollup-plugin-babel';
import pkg from './package.json';

export default [
  {
    input: 'src/index.js',
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ],
    external: ['ramda', 'sprintf-js'],
    plugins: [
      babel({
        exclude: ['node_modules/**']
      })
    ]
  }
];
