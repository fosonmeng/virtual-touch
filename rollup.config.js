// build: rollup -c
// watch: rollup -c -w
// add node imports to: external[]
// middlewares refer to -> https://github.com/rollup/rollup-pluginutils

// dependencies:
// +-- rollup@0.68.1
// +-- rollup-plugin-buble@0.19.6
// +-- rollup-plugin-commonjs@9.2.0
// +-- rollup-plugin-json@3.1.0
// +-- rollup-plugin-node-resolve@4.0.0
// `-- rollup-pluginutils@2.3.3
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import buble from 'rollup-plugin-buble';
import json from 'rollup-plugin-json';

const input = 'src/main.js';
const output = {
  name: 'VirtualTouch',
  browser: 'dist/virtual-touch.umd.js',
  main: 'dist/virtual-touch.cjs.js',
  module: 'dist/virtual-touch.esm.js',
};

export default [
  // browser-friendly UMD build
  {
    input: input,
    output: {
      name: output.name,
      file: output.browser,
      format: 'umd',
      sourcemap: true
    },
    plugins: [
      resolve(), // so Rollup can find `ms`
      commonjs(), // so Rollup can convert `ms` to an ES module
      buble({ // transpile ES2015+ to ES5
        exclude: ['node_modules/**']
      }),
      json(),
    ]
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: input,
    external: [],
    output: [{
        file: output.main,
        format: 'cjs'
      },
      {
        file: output.module,
        format: 'es'
      }
    ],
    plugins: [
      buble({ // transpile ES2015+ to ES5
        exclude: ['node_modules/**']
      }),
      json(),
    ]
  }
];
