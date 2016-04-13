var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    uglify = require('gulp-uglify'),
    usemin = require('gulp-usemin'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    changed = require('gulp-changed'),
    rev = require('gulp-rev'),
    browserSync = require('browser-sync'),
    del = require('del'),
    pngquant = require('imagemin-pngquant'),
    sass = require('gulp-sass'),
    ts = require('gulp-typescript'),
    wait = require('gulp-wait'),
    ngannotate = require('gulp-ng-annotate');
    

gulp.task('jshint',['tscomp'], function() {
    return gulp.src('client/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

// Clean
gulp.task('clean', function() {
    return del(['dist']);
});

gulp.task('usemin', function() {
    return gulp.src(['./client/**/*.html','!./client/lib/**/*.html'])
        .pipe(usemin({
            css:[minifycss(),rev()],
            js: [ngannotate(),uglify(),rev()]
        }))
        .pipe(gulp.dest('dist/'))
        .pipe(wait(1000))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('sass', function() {
    return gulp.src('client/css/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('client/css'))
});

gulp.task('imagemin', function() {
    return del(['dist/images']), gulp.src('client/images/**/*.{jpg,gif,jpeg,svg,png}')
    .pipe(imagemin({progressive: true, interlaced:true}))
    .pipe(gulp.dest('dist/images'))
    .pipe(wait(1000))
    .pipe(browserSync.reload({stream:true}))
    .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('tscomp', function() {
    return gulp.src('./client/ts/**/*.ts')
        .pipe(ts({
            target: 'ES5',
            outDir: './client/js/'
        }))
        .pipe(gulp.dest('./client/js'))
});

gulp.task('copyfonts', ['clean'], function() {
    gulp.src('./client/lib/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
    .pipe(gulp.dest('dist/fonts'))
    .pipe(wait(1000))
    .pipe(browserSync.reload({stream:true}));
    gulp.src('./client/lib/bootstrap/dist/fonts/**/*.{ttf,woff,eof,svg}*')
    .pipe(gulp.dest('dist/fonts'))
    .pipe(wait(1000))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('serve',['default'], function() {
    var files = [
        'dist/**/*'
    ];
    browserSync.init(files, {
        server: {
            baseDir: 'dist',
            index: 'index.html'
        }
    });
    
    gulp.watch('client/js/**/*.js', ['usemin']);
    gulp.watch('client/**/*.html', ['usemin']);
    gulp.watch('client/css/**/*.scss', ['sass']);
    gulp.watch('client/css/**/*.css', ['usemin']);
    gulp.watch('client/ts/**/*.ts', ['tscomp']);
    gulp.watch('client/images/**',['imagemin']);
 
});


gulp.task('default', ['clean','tscomp','sass'], function() {
    gulp.start('usemin','imagemin','copyfonts');
});

















