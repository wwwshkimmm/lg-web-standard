const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync').create();

const paths = {
  scss: {
    src: 'src/scss/**/*.scss',
    entry: 'src/scss/main.scss',
    dest: 'dist/css'
  },
  js: {
    src: 'src/js/**/*.js',
    entry: 'src/js/main.js',
    dest: 'dist/js',
    base: 'src/js'
  },
  html: {
    src: ['index.html', 'src/components_html/**/*.html']
  }
};

function compileScss() {
  return src(paths.scss.entry)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.scss.dest))
    .pipe(browserSync.stream());
}

function compileScssProd() {
  return src(paths.scss.entry)
    .pipe(plumber())
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest(paths.scss.dest));
}

function compileJs() {
  return src(paths.js.src, { sourcemaps: true, base: paths.js.base })
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: [['@babel/preset-env', { targets: '> 0.5%, last 2 versions, not dead', modules: false }]]
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.js.dest))
    .pipe(browserSync.stream());
}

function compileJsProd() {
  return src(paths.js.src, { base: paths.js.base })
    .pipe(plumber())
    .pipe(babel({
      presets: [['@babel/preset-env', { targets: '> 0.5%, last 2 versions, not dead', modules: false }]]
    }))
    .pipe(uglify())
    .pipe(dest(paths.js.dest));
}

function serve() {
  browserSync.init({
    server: {
      baseDir: './',
      index: 'index.html'
    },
    port: 3000,
    open: false,
    notify: false
  });

  watch(paths.scss.src, compileScss);
  watch(paths.js.src, compileJs);
  watch(paths.html.src).on('change', browserSync.reload);
}

const build = parallel(compileScssProd, compileJsProd);
const dev = series(parallel(compileScss, compileJs), serve);

exports.compileScss = compileScss;
exports.compileJs = compileJs;
exports.build = build;
exports.dev = dev;
exports.default = dev;
