const gulp         = require('gulp')
const htmlmin      = require('gulp-htmlmin')
const postcss      = require('gulp-postcss')
const rollup       = require('gulp-rollup')
const sourcemaps   = require('gulp-sourcemaps')
const del          = require('del')
const autoprefixer = require('autoprefixer')
const cssnext      = require('postcss-cssnext')
const cssnano      = require('cssnano')
const uglify       = require('rollup-plugin-uglify')
const babel        = require('rollup-plugin-babel')
const npm          = require('rollup-plugin-npm')
const commonjs     = require('rollup-plugin-commonjs')

const destDir = './dest'

gulp.task('default', ['html-minify', 'postcss', 'bundle'])

gulp.task('clean', () => {
  del([destDir])
})

gulp.task('clean:bundle', () => {
  del([destDir + '/**/*.js?(.map)'])
})

gulp.task('bundle', ['clean:bundle'], () => {
  gulp.src('src/**/*.js', {read: false})
    .pipe(rollup({
      format: 'umd',
      plugins: [
        npm({ jsnext: true, main: true }),
        commonjs(),
        babel({
          exclude: 'node_modules/**',
          presets: ["es2015-rollup"]
        }),
        uglify() // depend babel if code is es2015 syntax
      ],
      sourceMap: true
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(destDir))
})

gulp.task('postcss', () => {
  const browsers = ['last 5 versions', 'ie >= 6', 'Edge >= 12', 'Firefox >= 3', 'Chrome >= 6', 'Opera >= 9', 'Android >= 2.2', 'iOS >= 5']
  const processors = [
    autoprefixer({ browsers }),
    cssnext(),
    cssnano()
  ]
  return gulp.src('./src/**/*.css')
    .pipe(sourcemaps.init())
    .pipe(postcss(processors))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(destDir))
})

gulp.task('html-minify', () => {
  gulp.src('./src/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(destDir))
})
