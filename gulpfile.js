var gulp = require('gulp');
var uglify = require("gulp-uglify");
var concat = require('gulp-concat');
var rename = require('gulp-rename');

gulp.task('minify-js', function() {
	gulp.src('src/yun.js') 
		.pipe(uglify()) 
		.pipe(rename('yun.min.js'))
		.pipe(gulp.dest('dest')); 
});

gulp.task('entrance', ['minify-js', 'watch'], function() {
	console.log('the gulp entrance.');
	console.log("task start");
});

gulp.task('default', ['minify-js', 'watch'], function() {
	console.log('the gulp entrance.');
	console.log("task start");
});

gulp.task('watch', function() {
	gulp.watch('hello.js', ['minify-js']);
});