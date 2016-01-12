#!/usr/bin/env node
const rollup = require( 'rollup' )

rollup.rollup({
  entry: './src/assets/js/entry1.js'
}).then( function ( bundle ) {
  bundle.write({
    format: 'umd',
    dest: './dest/assets/js/bundle.js'
  })
})
