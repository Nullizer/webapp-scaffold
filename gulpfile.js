const gulp         = require('gulp')
const htmlmin      = require('gulp-htmlmin')
const postcss      = require('gulp-postcss')
const rollup       = require('gulp-rollup')
const sourcemaps   = require('gulp-sourcemaps')
const rename       = require("gulp-rename")
const del          = require('del')
const cssnext      = require('postcss-cssnext')
const autoprefixer = require('autoprefixer')
const cssnano      = require('cssnano')
const oldie        = require('oldie')
const uglify       = require('rollup-plugin-uglify')
const babel        = require('rollup-plugin-babel')
const npm          = require('rollup-plugin-npm')
const commonjs     = require('rollup-plugin-commonjs')

const destDir = './dest'

gulp.task('default', ['html-minify', 'postcss', 'postcss:oldie', 'bundle'])

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
  const processors = [
    cssnext({
      browsers: ['last 3 versions', 'ie >= 9', 'Edge >= 12', 'Firefox ESR',
                 'Chrome >= 16', 'Opera >= 11', 'Android >= 2.3', 'iOS >= 7']
    }),
    cssnano(),
  ]
  return gulp.src('./src/**/*.css')
    .pipe(sourcemaps.init())
    .pipe(postcss(processors))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(destDir))
})

gulp.task('postcss:oldie', () => {
  gulp.src('./src/**/*.css')
    .pipe(sourcemaps.init())
    .pipe(postcss([
      cssnext({
        browsers: ['last 1 versions']
      }),
      oldie({
        rgba: { filter: true },
        rem : { replace: true },
        unmq: { disable: false },
      }),
      autoprefixer({
        browsers: ['ie >= 6']
      }),
      cssnano(),
    ]))
    .pipe(rename(path => path.extname = '.oldie.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(destDir))
})

gulp.task('html-minify', () => {
  gulp.src('./src/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(destDir))
})
