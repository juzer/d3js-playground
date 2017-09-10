var gulp = require('gulp');
var serve = require('gulp-serve');
var watch = require('gulp-watch');

gulp.task('build', function() {});
 
gulp.task('serve', serve('./'));
gulp.task('serve-build', serve(['public', 'build']));
gulp.task('serve-prod', serve({
  root: ['public', 'build'],
  port: 80,
  middleware: function(req, res) {
    // custom optional middleware 
  }
}));

gulp.task('watch', function () {
    gulp.watch('*.html', ['build']);
    gulp.watch('*.css', ['build']);
});


gulp.task('default', ['serve', 'watch']);
