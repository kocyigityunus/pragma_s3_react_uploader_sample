var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var colors = require('colors/safe');

var onError = function(err){
  console.log( colors.red(err) );
};

gulp.task('app', function() {
  var bundler = browserify({
    entries: ['./jsapp/app.jsx'],
    debug: true, // for sourcemapping
  })
  .transform( babelify , { presets: ["es2015", "react"] } );

  bundler.exclude('react'); // exclude this for bundle.js
  bundler.exclude('react-dom'); // exclude this for bundle.js

    var watcher  = watchify(bundler);
    return watcher

    .on('update', function () { // When any files update
        var updateStart = Date.now();
        console.log('Updating!');
        watcher.bundle() // Create new bundle that uses the cache for high performance
        .on('error', onError )
        .pipe(source('app.js'))
        .on('error', onError )
        .pipe(gulp.dest('./public/build/'));
        console.log( colors.green( 'Updated! ' + (Date.now() - updateStart) + ' ms' ) );
        console.log( colors.random( new Date() + '' ) );
    })
    .bundle() // Create the initial bundle when starting the task
    .on('error', onError )
    .pipe(source('app.js'))
    .on('error', onError )
    //.pipe(buffer()) // for uglifying
    //.pipe(uglify()) // for uglifying
    .pipe(gulp.dest('./public/build/'))
    .on('error', onError );
});

gulp.task('bundle', function() {

    var bundler = browserify();

    bundler.require('react');
    bundler.require('react-dom');
    bundler.require('jquery');

    return bundler
    .bundle()
    .on('error', onError )
    .pipe(source('bundle.js'))
    .pipe(buffer()) // for uglifying
    .pipe(uglify()) // for uglifying
    .pipe(gulp.dest('./public/build/'))
    .on('error', onError );

});

gulp.task('default', ['app','bundle']);
