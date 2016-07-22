var gulp = require('gulp');
var clean = require('gulp-clean');
var webpack = require('webpack-stream');

gulp.task('default', ['clean', 'build']);

gulp.task('build', function() {
  return gulp.src('js/index.js')
    .pipe(webpack())
    .pipe(gulp.dest('build/'));
});

gulp.task('clean', function () {
  return gulp.src('build/', {force:true})
    .pipe(clean());
});