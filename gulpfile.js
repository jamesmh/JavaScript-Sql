var gulp = require('gulp');
var del = require('del');
var concat = require('gulp-concat');
var order = require('gulp-order');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('default', () => {
    del(['dist/sql.js'], { force: true });
    
    // Combine all files and generate dist/sql.js
    gulp.src(['src/**/*.js'])
    	.pipe(order([
    		'meta.js',
    		'polyfills.js',
    		'sql.js',
    		'helpers.js',
    		'*.js'
		]))
    	.pipe(concat('sql.js'))    	
    	.pipe(gulp.dest('dist/'));

    
    // Combine all files, uglify, and generate dist/sql.min.js
    return gulp.src(['dist/sql.js'])
        .pipe(rename('sql.min.js'))
        .pipe(uglify())     
        .pipe(gulp.dest('dist/'));
});