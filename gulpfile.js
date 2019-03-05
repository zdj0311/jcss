var gulp = require('gulp');
var replace = require('gulp-replace');

gulp.task('test', function() {
   return gulp.src('dist/static/js/main.*.js')
   .pipe(replace(/const\s/g, 'var '))
   .pipe(gulp.dest('dist/static/js'))
});
gulp.task('default',['test'])