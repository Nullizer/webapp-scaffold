const gulp         = require('gulp')
const htmlmin      = require('gulp-htmlmin')
const postcss      = require('gulp-postcss')
const uglify       = require('gulp-uglify')
const sourcemaps   = require('gulp-sourcemaps')
const rename       = require('gulp-rename')
const del          = require('del')
const rollup       = require('rollup').rollup
const cssnext      = require('postcss-cssnext')
const autoprefixer = require('autoprefixer')
const cssnano      = require('cssnano')
const oldie        = require('oldie')
const babel        = require('rollup-plugin-babel')
const nodeResolve  = require('rollup-plugin-node-resolve')
const rollupUglify = require('rollup-plugin-uglify')
const commonjs     = require('rollup-plugin-commonjs')
const path         = require('path')

const destDir = './www'

gulp.task('default', ['html:minify', 'postcss', 'postcss:oldie', 'bundle', 'copy:dist', 'copy:assets'])

const htmlSrc  = './src/**/*.html'
const cssSrc   = './src/**/*.css'
const jsSrc    = './src/**/*.js'
const assetSrc = './src/**/*.+(jpg|png|gif)'

gulp.task('watch', () => {
  gulp.watch(htmlSrc, ['html:minify'])
  gulp.watch(cssSrc, ['postcss', 'postcss:oldie'])
  gulp.watch(jsSrc, ['bundle'])
  gulp.watch(assetSrc, ['copy:assets'])
})

gulp.task('clean', () => {
  del([destDir])
})

gulp.task('clean:js', () => {
  del([path.join(destDir, '/**/*.js?(.map)')])
})

gulp.task('copy:assets', () => {
  gulp.src(assetSrc)
    .pipe(gulp.dest(destDir))
})

gulp.task('copy:dist', () => {
  gulp.src('./node_modules/babel-polyfill/dist/polyfill.min.js')
    .pipe(gulp.dest(path.join(destDir, '/assets/js/polyfills')))
  gulp.src('./node_modules/whatwg-fetch/fetch.js')
    .pipe(uglify())
    .pipe(gulp.dest(path.join(destDir, '/assets/js/polyfills')))
})

gulp.task('bundle', () => {
  return rollup({
    entry: 'src/assets/js/entry1.js',
    plugins: [
      nodeResolve({ jsnext: true, main: true }),
      commonjs(),
      babel({
        exclude: 'node_modules/**',
        presets: ['es2015-rollup'],
        plugins: ['transform-async-to-generator'],
      }),
      rollupUglify(),
    ]
  }).then(bundle => {
    return bundle.write({
      format: 'umd',
      dest: path.join(destDir, '/assets/js/main.js')
    })
  })
})

gulp.task('postcss', () => {
  gulp.src(cssSrc)
    .pipe(sourcemaps.init())
    .pipe(postcss([
      cssnext({ browsers: ['> 0%'] }),
      cssnano(),
    ]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(destDir))
})

gulp.task('postcss:oldie', () => {
  gulp.src(cssSrc)
    .pipe(sourcemaps.init())
    .pipe(postcss([
      cssnext({ browsers: ['last 1 versions'] }),
      oldie({
        rgba: { filter : true },
        rem : { replace: true },
        unmq: { disable: false },
      }),
      autoprefixer({ browsers: ['ie >= 6'] }),
      cssnano(),
    ]))
    .pipe(rename(path => path.extname = '.oldie.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(destDir))
})

gulp.task('html:minify', () => {
  gulp.src(htmlSrc)
    .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
    .pipe(gulp.dest(destDir))
})
