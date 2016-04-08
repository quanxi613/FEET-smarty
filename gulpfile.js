/*global -$ */
'use strict';
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var httpProxy = require('http-proxy');
var config = require('./config.json');
var runSequence = require('run-sequence');

gulp.task('connect', function () {
  $.connectPhp.server({
    base: config.dist,
    port: 9001,
    open: false
  });

  var proxy = httpProxy.createProxyServer({});

  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist'],
      directory: true,
      routes    : {
          '/bower_components': 'bower_components'
      },
      middleware: function (req, res, next) {
          var url = req.url;

          if (!url.match(/^\/(src|fonts|bower_components)\//)) {
              proxy.web(req, res, { target: 'http://127.0.0.1:9001' });
          } else {
              next();
          }
      }
    }
  });


  gulp.watch('./app/src/css/**/*.less', ['less', reload]);
  gulp.watch('./app/tpl/**/*.tpl', ['tpl', reload]);
  gulp.watch('./app/src/js/**/*.js', ['js', reload]);
  gulp.watch('./app/src/js/**/*.hbs', ['jstpl', reload]);

  gulp.watch([
    './app/**/*',
    '!./app/src/**/*',
    '!./app/tpl/**/*',
    '!./app/less/**/*'
    ], ['copy', reload]);

});


gulp.task('copy', function () {
  return gulp.src([
    './app/**/*',
    '!./app/src/**/*',
    '!./app/tpl/**/*',
    '!./app/less/**/*'
    ])
    .pipe(gulp.dest(config.dist))
});


gulp.task('mock', function () {
  return gulp.src('./app/mock/**/*.php')
    .pipe(gulp.dest(config.dist + 'mock'));
});

gulp.task('tpl', function () {
  return gulp.src('./app/tpl/**/*')
    .pipe($.changed(config.dist + 'tpl'))
    .pipe(gulp.dest(config.dist + 'tpl'));
});

gulp.task('img', function () {
  return gulp.src('./app/src/img/**/*')
    .pipe($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    }))
    .pipe(gulp.dest(config.dist + 'src/img'));
});

//编译less并自动添加浏览器前缀
gulp.task('less', function () {
  var AUTOPREFIXER_BROWSERS = [
    'ie >= 8',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23'
  ];

  return gulp.src(['./app/src/css/**/*.less'])
    .pipe($.plumber())
    .pipe($.changed(config.dist + 'src/css', {extension: '.css'}))
    .pipe($.sourcemaps.init())
    .pipe($.less())
    .pipe($.postcss([
      require('autoprefixer-core')({browers: AUTOPREFIXER_BROWSERS})
    ]))
    .pipe($.sourcemaps.write())
    .pipe($.if(config.uglify, $.csso()))
    .pipe(gulp.dest(config.dist + 'src/css'))
    .pipe($.plumber.stop())
    .pipe(reload({stream: true}));
});

gulp.task('css', function () {
  var AUTOPREFIXER_BROWSERS = [
    'ie >= 8',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23'
  ];

  return gulp.src('./app/src/css/**/*.css')
    .pipe($.postcss([
      require('autoprefixer-core')({browers: AUTOPREFIXER_BROWSERS})
    ]))
    .pipe($.if(config.uglify, $.csso()))
    .pipe(gulp.dest(config.dist + 'src/css'))
    .pipe(reload({stream: true}));
});

//js处理 是否压缩
gulp.task('js', function () {
  return gulp.src('./app/src/js/**/*.js')
    .pipe($.changed(config.dist + 'src/js'))
    .pipe($.if(config.uglify, $.uglify()))
    .pipe(gulp.dest(config.dist + 'src/js'));
});

//js模板引擎
gulp.task('jstpl', function () {
  return gulp.src('./app/src/js/**/*.hbs')
    .pipe($.handlebars())
    .pipe($.defineModule('amd'))
    .pipe(gulp.dest(config.dist + 'src/js'));
});

gulp.task('clean', require('del').bind(null, ['dist']));

var build = ['tpl', 'jstpl', 'less', 'css', 'js', 'img'];
//var local = ['tpl', 'jstpl', 'less', 'css', 'js', 'img'];

//本地调试
gulp.task('default', function (callback) {
  runSequence(
    'clean',
    'mock',
    'copy',
    build,
    'connect',
    callback
    );
});


//发布版本
gulp.task('build', function (callback) {
  runSequence(
    build,
    callback
    );
});
