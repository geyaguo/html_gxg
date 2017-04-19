var gulp = require('gulp');
var sass = require('gulp-sass');

//编译任务
gulp.task('sasslgm', function() {
	//scss文件源目录，即gulp会编译的文件
	return gulp.src('test/sass/main.scss')
		.pipe(sass())
		//编译之后放到的目标目录
		.pipe(gulp.dest('test/css/'))
})

//监测任务
gulp.task('default', function() {
	//创建一个任务自动监测scss文件的变化，变化之后自动执行任务  sasslgm
	gulp.watch('test/sass/**/*.scss', ['sasslgm']);
})