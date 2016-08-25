var gulp = require('gulp');
var del = require('del');
var concat = require('gulp-concat');
var order = require('gulp-order');

gulp.task('default', () => {
    del(['dist/sql.js'], { force: true });
    return gulp.src(['src/**/*.js'])
    	.pipe(order([
    		'meta.js',
    		'polyfills.js',
    		'sql.js',
    		'helpers.js',
    		'*.js'
		]))
    	.pipe(concat('sql.js'))    	
    	.pipe(gulp.dest('dist/'));
});