var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var del = require('del');
var runSequence = require('run-sequence');
var wiredep = require('wiredep');
var fs = require('fs');
var ts = require('gulp-typescript');
var merge = require('merge2');

const $ = gulpLoadPlugins();

gulp.task('typescript', function () {
    var tsResult = gulp.src('app/scripts.ts/*.ts')
        .pipe(ts({
            declaration: true,
            noExternalResolve: true,
        }));

    return merge([
        tsResult.dts.pipe(gulp.dest('app/definitions')),
        tsResult.js.pipe(gulp.dest('app/scripts'))
    ]);
});


gulp.task('extras', () => {
    return gulp.src([
        'app/*.*',
        'app/_locales/**',
        '!app/scripts.babel',
        '!app/*.json',
        '!app/*.html',
    ], {
            base: 'app',
            dot: true
        }).pipe(gulp.dest('dist'));
});

function lint(files, options) {
    return () => {
        return gulp.src(files)
            .pipe($.eslint(options))
            .pipe($.eslint.format());
    };
}

gulp.task('lint', lint('app/scripts.babel/**/*.js', {
    env: {
        es6: true
    }
}));

gulp.task('images', () => {
    return gulp.src('app/images/**/*')
        .pipe($.if($.if.isFile, $.cache($.imagemin({
            progressive: true,
            interlaced: true,
            // don't remove IDs = require ( SVGs, they are often use)d
            // as hooks for embedding and styling
            svgoPlugins: [{ cleanupIDs: false }]
        }))
            .on('error', function (err) {
                console.log(err);
                this.end();
            })))
        .pipe(gulp.dest('dist/images'));
});

gulp.task('html', () => {
    return gulp.src('app/*.html')
        .pipe($.useref({ searchPath: ['.tmp', 'app', '.'] }))
        .pipe($.sourcemaps.init())
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', $.cleanCss({ compatibility: '*' })))
        .pipe($.sourcemaps.write())
        .pipe($.if('*.html', $.htmlmin({ removeComments: true, collapseWhitespace: true })))
        .pipe(gulp.dest('dist'));
});

gulp.task('chromeManifest', () => {
    return gulp.src('app/manifest.json')
        .pipe($.chromeManifest({
            buildnumber: true,
            background: {
                target: 'scripts/background.js',
                exclude: [
                    'scripts/chromereload.js'
                ]
            }
        }))
        .pipe($.if('*.css', $.cleanCss({ compatibility: '*' })))
        .pipe($.if('*.js', $.sourcemaps.init()))
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.js', $.sourcemaps.write('.')))
        .pipe(gulp.dest('dist'));
});


gulp.task('web_accessible_resources', () => {
    fs.readFile('./app/manifest.json', function (err, _data) {
        if (err) {
            console.log(err);
            return;
        }
        var resources = JSON.parse(_data).web_accessible_resources;
        for (var index = 0; index < resources.length; index++) {
            resources[index] = "app/" + resources[index]
        }
        return gulp.src(resources)
            .pipe($.if('*.css', $.cleanCss({ compatibility: '*' })))
            .pipe($.if('*.js', $.sourcemaps.init()))
            .pipe($.if('*.js', $.uglify()))
            .pipe($.if('*.js', $.sourcemaps.write('.')))
            .pipe($.if('*.js', gulp.dest("dist/scripts")))
            .pipe($.if('*.js.map', gulp.dest("dist/scripts")))
            .pipe($.if('*.css', gulp.dest("dist/styles")))
    });
});

gulp.task('babel', () => {
    return gulp.src('app/scripts.babel/**/*.js')
        .pipe($.babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('app/scripts'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('watch', ['lint', 'babel', 'typescript', 'html'], () => {
    $.livereload.listen();

    gulp.watch([
        'app/*.html',
        'app/scripts/**/*.js',
        'app/images/**/*',
        'app/styles/**/*',
        'app/_locales/**/*.json'
    ]).on('change', $.livereload.reload);

    gulp.watch('app/scripts.babel/**/*.js', ['lint', 'babel']);
    gulp.watch('app/scripts.ts/**/*.ts', ['lint', 'typescript']);
    gulp.watch('bower.json', ['wiredep']);
});

gulp.task('size', () => {
    return gulp.src('dist/**/*').pipe($.size({ title: 'build', gzip: true }));
});

gulp.task('wiredep', () => {
    gulp.src('app/*.html')
        .pipe(wiredep({
            ignorePath: /^(\.\.\/)*\.\./
        }))
        .pipe(gulp.dest('app'));
});

gulp.task('package', function () {
    var manifest = require('./dist/manifest.json');
    return gulp.src('dist/**')
        .pipe($.zip('sc ext-' + manifest.version + '.zip'))
        .pipe(gulp.dest('package'));
});

gulp.task('build', (cb) => {
    runSequence(
        'lint', 'typescript', 'chromeManifest',
        ['html', 'images', 'extras'],
        'web_accessible_resources',
        'size', cb);
});

gulp.task('default', ['clean'], cb => {
    runSequence('build', cb);
});