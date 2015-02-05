var gulp = require('gulp');

var jshint     = require('gulp-jshint');
var livereload = require('gulp-livereload');
var nodemon    = require('gulp-nodemon');

var path = {
  clientJS: './client/app/**/*.js',
  serverJS: './server/**/*.js',
  server: './server/index.js'
};

gulp.task('develop', function() {
  nodemon({ script: path.server })
    .on('change', ['lint'])
    .on('restart', function() {
      console.log('Server restarted');
    });
});

gulp.task('lint', function() {
  gulp.src([path.clientJS, path.serverJS])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch(path.clientJS).on('change', livereload.changed);
});

gulp.task('default', ['develop', 'lint', 'watch']);