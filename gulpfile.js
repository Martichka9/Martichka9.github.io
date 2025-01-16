"use strict";

let gulp = require("gulp"),
    csso = require("gulp-csso"),
	cp = require("child_process"),
	browserSync = require('browser-sync').create(),
	sass = require('gulp-sass')(require('sass'));
// var rename = require("gulp-rename");

gulp.task("reset-styles", async function() {
	return gulp.src( '_scss/reset.scss', '_scss/_variables.scss', '_scss/_fonts.scss')
		.pipe( sass().on('error', sass.logError) )
		.pipe( csso() )
		.pipe( gulp.dest( './docs/css/' ) )
		.pipe( browserSync.stream({ match: '**/*.css' }) )
	;
});
gulp.task("styles", async function() {
	return gulp.src( '_scss/styles/*.scss', '_scss/_variables.scss')
		.pipe( sass().on('error', sass.logError) )
		.pipe( csso() )
		.pipe( gulp.dest( './docs/css/' ) )
		.pipe( browserSync.stream({ match: '**/*.css' }) )
	;
});

gulp.task('copy', function() {
    return gulp.src([
		'_scss/fa/css/*.css',
		'_scss/fa/fa/webfonts/*.eot',
		'_scss/fa/webfonts/*.svg',
		'_scss/fa/webfonts/*.ttf',
		'_scss/fa/webfonts/*.woff',
		'_scss/fa/webfonts/*.woff2',
		'_scss/theme/*.css'
	], {base:'_scss/'})
        .pipe(gulp.dest('./docs/css/'));
});

// gulp.task('rename-css', async function(){
// 	gulp.src( 'docs/css/styles.css' )
// 	.pipe(rename( 'styles.min.css' ))
//   	.pipe(gulp.dest( './docs/css/' ));
// });

// Jekyll
gulp.task("jekyll-dev", function() {
	return cp.spawn("bundle", ["exec", "jekyll", "build --baseurl ''"], { stdio: "inherit", shell: true });
});

// Jekyll
gulp.task("jekyll", function() {
	return cp.spawn("bundle", ["exec", "jekyll", "build"], { stdio: "inherit", shell: true });
});

gulp.task("watch", function() {

	browserSync.init({
		server: {
            baseDir: "./docs/"
		}
	});

	gulp.watch( '_scss/**/*.scss', gulp.series('reset-styles', 'styles') );

	gulp.watch(
		[
			"./*.html",
			"./*.yml",
			"./_includes/*.html",
			"./_layouts/*.html",
			"./_data/*.json",
			"./*.xml"
		]
	).on('change', gulp.series('jekyll-dev', 'reset-styles', 'styles', 'copy') );
	//).on('change', gulp.series('jekyll-dev', 'reset-styles', 'styles') );

	gulp.watch( 'docs/**/*.html' ).on('change', browserSync.reload );
	gulp.watch( 'docs/**/*.js' ).on('change', browserSync.reload );
});

gulp.task("default", gulp.series('jekyll-dev', 'reset-styles', 'styles', 'copy', 'watch'));
//gulp.task("default", gulp.series('jekyll-dev', 'sass', 'watch'));

gulp.task("deploy", gulp.series('jekyll', 'reset-styles', 'styles', 'copy' , function() {
//gulp.task("deploy", gulp.series('jekyll', 'sass', function() {
	return cp.spawn('git status && git commit -am "small fixes + change font, update about, update footer" && git pull && git push', { stdio: "inherit", shell: true });
}));