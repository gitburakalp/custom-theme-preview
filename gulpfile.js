let gulp = require('gulp'),
  sass = require('gulp-sass'),
  rename = require('gulp-rename'),
  autoprefixer = require('gulp-autoprefixer'),
  browserSync = require('browser-sync').create(),
  size = require('gulp-size'),
  plumber = require('gulp-plumber'),
  sourcemaps = require('gulp-sourcemaps');

let roots = {
    srcDir: './src/',
    jsDir: './src/js/',
    distDir: './dist/',
    sourceDir: '../sources/',
  },
  sassOptions = {
    outputStyle: 'compressed',
  };

var functionsBrowserSync = function (done) {
    browserSync.init({
      server: {
        baseDir: roots.srcDir,
      },
      online: true,
    });

    done();
  },
  functionsSass = function () {
    return gulp
      .src(roots.srcDir + 'sass/main.scss')
      .pipe(plumber())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sass(sassOptions))
      .pipe(
        size({
          gzip: true,
          showFiles: true,
        }),
      )
      .pipe(
        autoprefixer({
          grid: true,
        }),
      )
      .pipe(
        rename({
          suffix: '.min',
        }),
      )
      .pipe(sourcemaps.write('../sources'))
      .pipe(gulp.dest(roots.srcDir + 'css'))
      .pipe(browserSync.stream());
  },
  functionsHtml = function () {
    return gulp.src(roots.srcDir + '**/*.html').pipe(browserSync.stream());
  },
  functionsWatch = function () {
    gulp.watch(roots.srcDir + 'sass/**/*.scss', gulp.series('sass'));
    gulp.watch(roots.srcDir + 'js/*.js', gulp.series('html'));
    gulp.watch(roots.srcDir + '**/*.html', gulp.series('html'));
  };

gulp.task('browser-sync', functionsBrowserSync);
gulp.task('sass', functionsSass);
gulp.task('html', functionsHtml);
gulp.task('watch', functionsWatch);
gulp.task('default', gulp.series('browser-sync', 'html', 'sass', 'watch'));
