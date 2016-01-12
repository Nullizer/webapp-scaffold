const gulp = require('gulp')
const htmlmin = require('gulp-htmlmin')
const postcss = require('gulp-postcss')
const rollup = require('gulp-rollup')
const sourcemaps = require('gulp-sourcemaps')
const cssnext = require('postcss-cssnext')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const clean = require('gulp-clean')
const uglify = require('rollup-plugin-uglify')

const destDir = './dest'

gulp.task('default', ['html-minify', 'postcss', 'bundle'])

gulp.task('clean', () => {
	gulp.src(destDir, {read: false})
		.pipe(clean({force: true}))
})

gulp.task('clean-bundle', () => {
  gulp.src(destDir + '/**/*.js?(.map)', {read: false})
    .pipe(clean({force: true}))
})

gulp.task('bundle', ['clean-bundle'], () => {
  gulp.src('src/**/*.js', {read: false})
    .pipe(rollup({
      format: 'umd',
      plugins: [
        uglify()
      ],
        sourceMap: true
    }))
    .pipe(sourcemaps.write('.')) // this only works if the sourceMap option is true
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
