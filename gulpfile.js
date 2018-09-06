/*!
 * DON'T FORGET:  $ npm install
 */

/*
 * Change this path according to the folder structure
 */
var sitePath = 'site/atomica/';
var siteName = sitePath.split('/')[1];

// Load dependencies
var gulp            = require('gulp'),                      // Main gulp dependency
    webpack         = require('webpack'),
    webpackStream   = require('webpack-stream'),
    webpackConfig   = require('./webpack.config.js'),
    browserSync     = require('browser-sync').create(),     // BrowserSync
    reload          = browserSync.reload,                   // BrowserSync
    babel           = require("gulp-babel"),                // ES6
    nunjucksRender  = require('gulp-nunjucks-render'),      // Nunjucks renderer
    sass            = require('gulp-sass'),                 // SASS Compiler
    autoprefixer    = require('gulp-autoprefixer'),         // CSS Autoprefixer
    cssnano         = require('gulp-cssnano'),              // CSS compiler
    sourcemaps      = require('gulp-sourcemaps'),           // Sourcemap generator
    jshint          = require('gulp-jshint'),               // JS Hinter
    uglify          = require('gulp-uglify'),               // JS Uglify
    imagemin        = require('gulp-imagemin'),             // Image optimizer
    rename          = require('gulp-rename'),               // Rename files
    concat          = require('gulp-concat'),               // Concat files
    cache           = require('gulp-cache'),                // Cache
    fs              = require('fs')                         // Does something? :)))
    del             = require('del');                       // Remove files / dirs
    rev             = require('gulp-rev'),                  // Makes revisions for Cache Bustin
    runSequence     = require('run-sequence').use(gulp);    // Determines synchronous tasks
    replace         = require('gulp-replace');              // Allows replacement of strings in files
    useref          = require('gulp-useref');               // Replaces script/style links in production .html


// Allows all tasks to console.log errors
function handleError (error) {
  console.log(error.toString());
  this.emit('end');
}

// Parse HTML with Nunjucks
gulp.task('nunjucks', function() {
  nunjucksRender.nunjucks.configure([sitePath + 'dev/template/']);
  return gulp.src(sitePath + 'dev/template/module/**/*.+(html|nunjucks)')
  .pipe(nunjucksRender())
  .on('error', handleError)
  .pipe(replace('site/@@site_template@@/', sitePath))
  .pipe(gulp.dest(sitePath + 'prod/template/'));
});

// Styles
gulp.task('styles', function() {
    return gulp.src([sitePath + 'dev/scss/main.scss'])
      .pipe(sass())
      .on('error', handleError)
      .pipe(gulp.dest(sitePath + 'prod/build'))
      .pipe(reload({stream: true}));
});

gulp.task('scripts', function() {
  return gulp.src([
    sitePath + 'dev/js/vendor/jquery.js',
    sitePath + 'dev/js/vendor/jquery-ui.js',
    sitePath + 'dev/js/vendor/fontawesome.js',
    sitePath + 'dev/js/vendor/fancybox.js',
    sitePath + 'dev/js/vendor/slick.js',
    sitePath + 'dev/js/**/*.js', '!' + sitePath + 'dev/js/es6/**/*.js'
  ])
  .pipe(jshint())
  .pipe(jshint.reporter('jshint-stylish'))
  .pipe(jshint.reporter('fail'))
  .on('error', handleError)
  .pipe(concat('main.js'))
  .on('error', handleError)
  .pipe(gulp.dest(sitePath + 'prod/build'))
  .pipe(reload({stream: true}));
});

gulp.task("scripts-es6", function () {
  return gulp.src(sitePath + 'dev/js/es6/**/*.js')
    .pipe(babel())
    .on('error', handleError)
    .pipe(concat('main-es6.js'))
    .on('error', handleError)
    .pipe(webpackStream(webpackConfig), webpack)
    .pipe(gulp.dest(sitePath + 'prod/build'))
    .pipe(reload({stream: true}));
});

// Images
// TODO: Add @2x function for retina
gulp.task('images', function() {
  return gulp.src(sitePath + 'dev/gfx/**/*')
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .on('error', handleError)
    .pipe(gulp.dest(sitePath + 'prod/gfx'));
});

// Clean
gulp.task('clean', function() {
  return del([sitePath + 'prod/build', sitePath + 'prod/gfx', sitePath + 'prod/template']);
});

// TODO: Must be removed from production !!!
// Copy's the components & elements directories to prod
gulp.task('copy', function () {
  return gulp.src([sitePath + 'dev/template/component/**/*', sitePath + 'dev/template/element/**/*'], {
    base: sitePath + 'dev/template'
  })
  .pipe(gulp.dest(sitePath + 'prod/template'));
});
gulp.task('copy-fonts', function () {
  return gulp.src(sitePath + 'dev/fonts/**/*')
    .pipe(gulp.dest(sitePath + 'prod/fonts'));
});

// Special nunjucks task for Browser-sync
gulp.task('nunjucks-serve', function() {
  nunjucksRender.nunjucks.configure([sitePath + 'dev/template/']);
  return gulp.src(sitePath + 'dev/template/page/**/*.+(html|nunjucks)')
  .pipe(nunjucksRender())
  .on('error', handleError)
  .pipe(replace('/site/@@site_template@@/prod/', 'http://localhost:3000/'))
  .pipe(gulp.dest(sitePath + 'prod/template/'))
  .pipe(reload({stream: true}));
});

// Browser-sync initiate
gulp.task('serve', function() {
    browserSync.init({
        server: sitePath + 'prod/',
        index: "template/home.html",
    });

    gulp.start('nunjucks-serve');

    // Watch everything for changes, reload browser if changed
    gulp.watch(sitePath + 'dev/template/**/*.html', ['nunjucks-serve']);
    gulp.watch(sitePath + 'dev/template/**/*.html', ['copy']);
    gulp.watch(sitePath + 'dev/fonts/**/*', ['copy-fonts']);
    gulp.watch(sitePath + 'dev/scss/**/*.scss', ['styles']);
    gulp.watch(sitePath + 'dev/js/**/*.js', ['scripts','scripts-es6']);
});

// Default task: $ gulp
gulp.task('default', ['clean'], function(callback) {
  runSequence('copy', 'copy-fonts', 'images', 'styles', 'scripts', 'scripts-es6', 'nunjucks', callback);
});

// Watch
gulp.task('watch', function() {

  // Reset the head includes
  gulp.start('nunjucks');

  // Watch .html and .nunjucks files
  gulp.watch(sitePath + 'dev/template/**/*.html', ['nunjucks']);
  gulp.watch(sitePath + 'dev/template/**/*.html', ['copy']);

  // Watch fonts directory
  gulp.watch(sitePath + 'dev/fonts/**/*', ['copy-fonts']);

  // Watch .scss files
  gulp.watch(sitePath + 'dev/scss/**/*.scss', ['styles']);

  // Watch .js for errors and compile
  gulp.watch(sitePath + 'dev/js/**/*.js', ['scripts', 'scripts-es6']);

  // Watch image files
  gulp.watch(sitePath + 'dev/gfx/**/*', ['images']);

  // Create variable watchers to handle deletes & renames
  var htmlWatcher = gulp.watch(sitePath + 'dev/template/**/*.html', ['nunjucks']);

  // Capture change events and handle accordingly
  htmlWatcher.on('change', function (event) {
    // if file gets deleted in dev, also delete in prod
    if (event.type === 'deleted') {
      // Simulating the {base: 'src'} used with gulp.src in the scripts task
      var filePathFromSrc = path.relative(sitePath + 'dev/template/page/**/*.', event.path);
      var destFilePath = path.resolve(sitePath + 'prod/template/', filePathFromSrc);

      del.sync(destFilePath).on('error', handleError);
    }
  });

});

/*!
==============================================================================================
==============================================================================================
===========================================================================   PRODUCTION SETUP
==============================================================================================
==============================================================================================
*/

// Prod nunjucks
gulp.task('prod-nunjucks', function() {
  nunjucksRender.nunjucks.configure([sitePath + 'dev/template/']);
  return gulp.src(sitePath + 'dev/template/page/**/*.+(html|nunjucks)')
    .pipe(nunjucksRender())
    .pipe(gulp.dest(sitePath + 'prod/template/'))
});

// Replace all dependency links in html files
gulp.task('prod-dependencies', function() {
  var fileContent = JSON.parse(fs.readFileSync(sitePath + 'prod/build/rev-manifest.json', 'utf8'));
  var cssPath = fileContent["main.min.css"];
  var jsPath = fileContent["main.min.js"];
  return gulp.src(sitePath + 'prod/template/*.html')
    .pipe(replace('site/@@site_template@@/', sitePath))
    .pipe(replace("@@site_assets['main.css']@@", cssPath))
    .pipe(replace("@@site_assets['main.js']@@", jsPath))
    .pipe(replace('<script src="/site/'+ siteName +'/prod/build/main-es6.js"></script>', ''))
    .pipe(useref({ searchPath: './' }))
    .pipe(gulp.dest(sitePath + 'prod/template'))
});

// Prod Styles
gulp.task('prod-styles', function() {
  return gulp.src([sitePath + 'dev/scss/main.scss'])
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(rename({ suffix: '.min' }))
    .on('error', handleError)
    .pipe(sourcemaps.write())
    .pipe(autoprefixer({
      browsers: ['> 1%', 'last 2 versions']
    }))
    .pipe(cssnano())
    .pipe(gulp.dest(sitePath + 'prod/build'))
});

// Prod scripts
gulp.task('prod-scripts', function() {
  return gulp.src([
    sitePath + 'prod/build/main.js',
    sitePath + 'prod/build/main-es6.js'
  ])
  .pipe(concat('main.js'))
  .pipe(rename({ suffix: '.min' }))
  .pipe(uglify().on('error', handleError))
  .pipe(gulp.dest(sitePath + 'prod/build'))
});

// JS / CSS Cache Busting
gulp.task('cache-bust', function() {
    return gulp.src([sitePath + 'prod/build/main.min.css', sitePath + 'prod/build/main.min.js'])
      .pipe(gulp.dest(sitePath + 'prod/build'))  // copy original assets to build dir
      .pipe(rev())
      .on('error', handleError)
      .pipe(gulp.dest(sitePath + 'prod/build'))  // write rev'd assets to build dir
      .pipe(rev.manifest())
      .on('error', handleError)
      .pipe(gulp.dest(sitePath + 'prod/build')); // write manifest to build dir
});

// Clean useless files and directories from production
gulp.task('prod-cleanup', function(){
  return del([sitePath + 'prod/template/site']);
});

gulp.task('prod-success', function() {
  console.log('\x1b[32m','=======================================\n > > > Production build completed! < < <\n =======================================');
});

// Ready for production!
gulp.task('production', ['clean'], function(callback) {

  runSequence(
    'copy',
    'copy-fonts',
    'styles',
    'prod-styles',
    'scripts',
    'scripts-es6',
    'prod-scripts',
    'cache-bust',
    'prod-nunjucks',
    'prod-dependencies',
    'images',
    'prod-cleanup',
    'prod-success',
    callback
  );

});
