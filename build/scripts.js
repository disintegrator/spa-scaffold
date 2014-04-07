var browserify = require('browserify');
var gulp = require('gulp');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var sourceStream = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');
var watchify = require('watchify');

module.exports.makeDeviceBundler = function(dest, useWatchify) {
    return function(device) {
        var lib = useWatchify ? watchify : browserify;
        var bundler = lib('./assets/scripts/' + device + '/index.js');

        bundler.transform('debowerify');

        if (useWatchify) {
            bundler.on('update', rebundle);
        }

        function rebundle() {
            var stream;

            gutil.log('Bundling scripts for ' + gutil.colors.cyan(device) + '...');

            stream = bundler.bundle()
                .pipe(sourceStream('bundle.' + device + '.js'))
                .pipe(gulp.dest(dest))
                .pipe(streamify(uglify()))
                .pipe(rename('bundle.' + device + '.min.js'))
                .pipe(gulp.dest(dest));

            stream.on('end', function() {
                gutil.log(gutil.colors.green('✔') + ' Bundled scripts for ' + gutil.colors.cyan(device));
            });

            return stream;
        }

        return rebundle();
    };
};

