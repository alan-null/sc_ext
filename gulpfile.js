var gulp = require('gulp');
var livereload = require('gulp-livereload');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var runSequence = require('run-sequence');
var del = require('del');
var _if = require('gulp-if')
var cleanCss = require('gulp-clean-css')
var uglify = require('gulp-uglify')
var htmlmin = require('gulp-htmlmin')
var zip = require('gulp-zip')
var size = require('gulp-size')

function typescript(src, dest, concatFile) {
    var tsResult = gulp.src(src)
        .pipe(sourcemaps.init())
        .pipe(ts({ sortOutput: true }));

    concatFile = (concatFile || '|');
    return tsResult.js
        .pipe(_if(concatFile != '|', concat(concatFile)))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dest));
}

gulp.task('typescript_sc_ext', () => {
    return typescript('app/sc_ext/**/*.ts', 'app/sc_ext', 'sc_ext.js');
});

gulp.task('typescript_chrome', () => {
    return typescript('app/chrome/**/*.ts', 'app/chrome', null);
});

gulp.task('typescript_options', () => {
    return typescript('app/options/**/*.ts', 'app/options', 'app.js');
});

gulp.task('typescript_common', () => {
    return typescript('app/options/providers/OptionsProvider.ts', 'app/common', 'optionsProvider.js')
});

gulp.task('typescript_all', ['cleanup_dev'], (callback) => {
    runSequence('typescript_sc_ext', 'typescript_chrome', 'typescript_options', 'typescript_common', callback);
});

gulp.task('sass_sc_ext', () => {
    return gulp.src('./app/sc_ext/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./app/sc_ext'));
});

gulp.task('sass_all', (callback) => {
    runSequence('sass_sc_ext', callback);
});

gulp.task('cleanup_dev', () => {
    del(
        [
            'app/chrome/**/*.js', 'app/chrome/**/*.js.map',
            'app/options/*.js', 'app/options/*.js.map',
            'app/sc_ext/*.js', 'app/sc_ext/*.js.map'
        ]
        , { dryRun: false }).then(paths => {
            console.log('Files and folders that would be deleted:\n', paths.join('\n'));
        });
});

gulp.task('cleanup_release', del.bind(null, ['.tmp', 'dist']));

gulp.task('watch', ['typescript_all', 'sass_all'], () => {
    livereload.listen();

    gulp.watch('app/sc_ext/**/*.ts', ['typescript_sc_ext']);
    gulp.watch('app/sc_ext/styles/**/*.scss', ['sass_sc_ext']);
    gulp.watch('app/chrome/**/*.ts', ['typescript_chrome']);
    gulp.watch('app/options/**/*.ts', ['typescript_options', 'typescript_common']);
});

gulp.task('extras', () => {
    return gulp.src([
        'app/*.*',
        'app/_locales/**',
    ], {
            base: 'app',
            dot: true
        }).pipe(gulp.dest('dist'));
});

gulp.task('get_package_size', () => {
    return gulp.src('dist/**/*').pipe(size({
        title: 'build',
        gzip: true
    }));
});

function publish(src, dest) {
    return gulp.src(src)
        .pipe(_if('*.css', cleanCss({
            compatibility: '*'
        })))
        .pipe(_if('*.js', sourcemaps.init()))
        .pipe(_if('*.js', uglify()))
        .pipe(_if('*.js', sourcemaps.write('.')))
        .pipe(_if('*.html', htmlmin({
            removeComments: true,
            collapseWhitespace: true
        })))
        .pipe(gulp.dest(dest));
}

gulp.task('publish_sc_ext', () => {
    return publish([
        'app/sc_ext/**/*.js',
        'app/sc_ext/**/*.css',
        'app/sc_ext/**/*.png',
        'app/sc_ext/**/*.html'
    ], './dist/sc_ext')
});

gulp.task('publish_chrome', () => {
    return publish([
        'app/chrome/*.js',
        'app/chrome/**/*.css',
        'app/chrome/**/*.png',
        'app/chrome/**/*.html'
    ], './dist/chrome');
});

gulp.task('publish_options', () => {
    return publish([
        'app/options/**/*.js',
        'app/options/**/*.css',
        'app/options/**/*.png',
        'app/options/**/*.html'
    ], './dist/options');
});

gulp.task('publish_all', (callback) => {
    runSequence('publish_sc_ext', 'publish_chrome', 'publish_options', callback);
});

gulp.task('build', ['cleanup_release'], (callback) => {
    runSequence(
        'typescript_all', 'sass_all',
        'extras',
        'publish_all',
        'get_package_size', callback);
});

gulp.task('package', ['build'], () => {
    var manifest = require('./dist/manifest.json');
    return gulp.src('dist/**')
        .pipe(zip('sc-ext-' + manifest.version + '.zip'))
        .pipe(gulp.dest('package'));
});

gulp.task('default', callback => {
    runSequence('build', callback);
});