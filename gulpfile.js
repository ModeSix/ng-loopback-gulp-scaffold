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
    inject = require('gulp-inject'),
    wiredep = require('wiredep').stream;
    ngannotate = require('gulp-ng-annotate');


gulp.task('jshint',['typescript'], function() {
    return gulp.src('client/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reprter(stylish));
});

gulp.task('clean', function() {
    return del(['dist']);
});

gulp.task('inject-vendor', function() {
    gulp.src('client/index.html')
        .pipe(wiredep({
            directory: 'client/lib/',
            bowerJson: require('./bower.json')
    }))
    .pipe(gulp.dest('client'));
});

gulp.task('inject', function() {    
    gulp.src('./client/index.html')
        .pipe(inject(gulp.src(['./client/js/**/*.js','./client/css/**/*.css'],{read:false}), {relative:true}))
        .pipe(gulp.dest('./client'));
            
});



gulp.task('usemin', ['typescript','inject'], function() {
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
        .pipe(gulp.dest('client/css'));
});

gulp.task('imagemin', function() {
    return del(['dist/images']), gulp.src('client/images/**/*.{jpg,gif,jpeg,svg,png}')
    .pipe(imagemin({progressive: true, interlaced:true}))
    .pipe(gulp.dest('dist/images'))
    .pipe(wait(1000))
    .pipe(browserSync.reload({stream:true}))
    .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('typescript', function() {
    return gulp.src('client/ts/**/*.ts')
        .pipe(ts({
            target: 'ES5',
            outDir: 'client/js/'
        }))
        .pipe(gulp.dest('client/js'))
        .pipe(wait(1000))
        .pipe(browserSync.reload({stream:true}));
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

gulp.task('serve',['typescript', 'sass'], function() {
    var files = [
        'client/**/*'
    ];
    browserSync.init(files, {
        server: {
            baseDir: 'client',
            index: 'index.html',  
        },
        port: 9777
    });
    
    gulp.watch('client/js/**/*.js', browserSync.reload);
    gulp.watch('client/css/**/*.css', browserSync.reload);
    gulp.watch('client/**/*.html', browserSync.reload);
    gulp.watch('client/css/**/*.scss', ['sass']);
    gulp.watch('client/images/**/*.{jpg,jpeg,gif,png,svg}', browserSync.reload);
    gulp.watch('client/ts/**/*.ts', ['typescript']);
});

gulp.task('build', ['clean','typescript', 'sass','inject','inject-vendor'], function(){
    gulp.start('usemin','imagemin','copyfonts');
})


