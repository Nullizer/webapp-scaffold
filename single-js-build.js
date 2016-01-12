#!/usr/bin/env node
const rollup   = require( 'rollup' )
const uglify   = require('rollup-plugin-uglify')
const babel    = require('rollup-plugin-babel')
const npm      = require('rollup-plugin-npm')
const commonjs = require('rollup-plugin-commonjs')

rollup.rollup({
  entry: './src/assets/js/entry1.js',
  plugins: [
    npm({ jsnext: true, main: true }),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
      presets: ["es2015-rollup"]
    }),
    uglify() // depend babel if code is es2015 syntax
  ]
}).then(bundle => {
  bundle.write({
    format: 'umd',
    dest: './dest/assets/js/bundle.js'
  })
})
