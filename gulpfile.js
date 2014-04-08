var fs = require('fs');

var changed = require('gulp-changed');
var clean = require('gulp-clean');
var es = require('event-stream');
var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var less = require('gulp-less');

var makeDeviceBundler = require('./build/scripts').makeDeviceBundler;

var bowerDirectory = JSON.parse(fs.readFileSync('./.bowerrc')).directory;

gulp.task('images', function() {
    var src = 'assets/images/**/*';
    var dest = 'dist/assets/images';

    return gulp.src(src)
        .pipe(changed(dest))
        .pipe(imagemin())
        .pipe(gulp.dest(dest));
});

gulp.task('styles', function() {
    var src = 'assets/styles/*/style.less';
    var dest = 'dist/assets/styles';

    return gulp.src(src)
        .pipe(less({paths: [bowerDirectory]}))
        .pipe(gulp.dest(dest));
});

gulp.task('scripts', function() {
    var dest = 'dist/assets/scripts';
    var bundleForDevice = makeDeviceBundler(dest, false);
    return es.merge.apply(null, ['desktop', 'tablet', 'mobile'].map(bundleForDevice));
});

gulp.task('watch', function() {
    var bundleForDevice = makeDeviceBundler('dist/assets/scripts', true);

    gulp.watch('assets/images/**/*', ['images']);
    gulp.watch('assets/styles/**/*', ['styles']);

    return es.merge.apply(null, ['desktop', 'tablet', 'mobile'].map(bundleForDevice));
});

gulp.task('clean', function() {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});

gulp.task('default', ['clean', 'styles', 'scripts', 'images']);

