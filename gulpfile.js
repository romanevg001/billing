const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefix = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const clean = require('gulp-clean-css');
const del = require('del');
const notify = require('gulp-notify');
const sourcemaps = require('gulp-sourcemaps');
const gulpIf = require('gulp-if');
const debug = require('gulp-debug');
const newer = require('gulp-newer');
const imagemin = require('gulp-imagemin');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();

const rollup = require('rollup-stream');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const multiEntry = require('rollup-plugin-multi-entry');

var isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == "development";

var opts = {
    "enter": "src/",
    "out": "public/",
    "js": "js/",
    "css": "css/",
    "img": "i/",
    "map": "../maps/"


};


//console.log(multiEntry)

gulp.task('sass',function(){

     return gulp.src(opts.enter + opts.css + "**/*.*")
         .pipe(gulpIf(isDevelopment,sourcemaps.init()))
         .pipe(sass())
         .on('error',notify.onError())
         .pipe(autoprefix())
         .pipe(clean())
         .pipe(gulpIf(isDevelopment,sourcemaps.write(opts.map)))
         .on('error',(er)=>{
             console.log(`error: ${er.lineNumber}: ${er.fileName}: ${er.message}`);
         })
         .pipe(gulp.dest(opts.out + opts.css));

});

//gulp.task('js',function(){
//    return gulp.src(opts.enter + opts.js + "*.*")
//        .pipe(sourcemaps.init())
//        .pipe(babel())
//        .on('error',notify.onError())
//        .pipe(uglify()).on('error',(er)=>{
//            console.log(`error: ${er.lineNumber}: ${er.fileName}: ${er.message}`);
//        })
//        .pipe(sourcemaps.write(opts.map))
//        .pipe(gulp.dest(opts.out +opts.js));
//
//});

//function jsFile (fileName){
gulp.task('js', function() {
    return rollup({
        entry: [opts.enter + opts.js+ 'index.js', opts.enter + opts.js+ 'lib.js'],
        sourceMap: true,
        plugins: [multiEntry.default()]
    }).on('error',notify.onError())
        .pipe(source('index.js', opts.enter + opts.js)).on('error',notify.onError())
        .pipe(buffer())
        .pipe(gulpIf(isDevelopment,sourcemaps.init({loadMaps: true})))
        .pipe(babel({compact: false})).on('error',notify.onError())
        .pipe(uglify())
        .pipe(gulpIf(isDevelopment,sourcemaps.write(opts.map)))
        .pipe(gulp.dest(opts.out + opts.js));
});

//gulp.task('js', function() { //Maybe you should add ./ (./file.js)
//    return jsFile('index.js')
//});
//gulp.task('jslib', function() { //Maybe you should add ./ (./file.js)
//    return jsFile('lib.js')
//});

//gulp.task('js', function() {
//    return gulp.src(opts.out + opts.js + "*.*")
//        .pipe(gulpIf(isDevelopment,sourcemaps.init()))
//        .pipe(babel())
//        .pipe(uglify())
//        .pipe(gulpIf(isDevelopment,sourcemaps.write(opts.map)))
//        .pipe(gulp.dest(opts.out + opts.js));
//});

gulp.task('image',function(){
    return gulp.src(opts.enter + opts.img + '**')
        .pipe(newer(opts.out + opts.img))
        .pipe(imagemin())
        .pipe(gulp.dest(opts.out + opts.img));

});
gulp.task('html', function(){
    return gulp.src(opts.enter + '**/*.html')
        .pipe(gulp.dest(opts.out));
});
gulp.task('other', function(){

    gulp.src(opts.enter + 'fonts/**/*.*')
        .pipe(gulp.dest(opts.out + "fonts"));
    gulp.src(opts.enter + opts.js+ 'lib/**/*.*')
        .pipe(gulp.dest(opts.out + opts.js+ 'lib'));
    gulp.src(opts.enter + 'res/**/*.*')
        .pipe(gulp.dest(opts.out + 'res'));
    return gulp.src(opts.enter + '*.*')
        .pipe(gulp.dest(opts.out));

});

gulp.task('clean',function(){
    return del(opts.out);
});



gulp.task('server', function(){
    browserSync.init({
        server:  opts.out

    });
    browserSync.watch(opts.out + "**/*.*").on('change',browserSync.reload)
});

gulp.task('watch', function(){
    gulp.watch([`${opts.enter}${opts.css}**`], gulp.series('sass'));
    gulp.watch([opts.enter + opts.js + "**"], gulp.series('js'));
    gulp.watch([opts.enter + "*.html"], gulp.series('html'));
    gulp.watch([opts.img + "**"], gulp.series('image','other'));
});

gulp.task('default',gulp.series('clean','sass',gulp.series('js'),'image','html','other',gulp.parallel('server','watch')));


