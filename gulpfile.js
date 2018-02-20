const gulp = require('gulp');
const cache = require('gulp-cached');
const rigger = require('gulp-rigger');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');
const cleanCss = require('gulp-clean-css');
const less = require('gulp-less');
const newer = require('gulp-newer');
const imagemin = require('gulp-imagemin');
const iconfont = require('gulp-iconfont');
const iconfontCss = require('gulp-iconfont-css');
const concat = require('gulp-concat');
const fontgen = require('gulp-fontgen');
const rsync = require('gulp-rsync');
const php = require('gulp-connect-php');
const gulpif = require('gulp-if');
const browserSync = require("browser-sync");
const runSeq = require('run-sequence');
const rimraf = require('rimraf');

imagemin.jpegoptim = require('imagemin-jpegoptim');

const path = {
    src: {
        html: 'src/html/*.php',
        scripts: 'src/scripts/*.js',
        styles: {
            main: 'src/styles/main.less',
            editor: 'src/styles/editor.less'
        },
        images: 'src/assets/images/**/*.{png,jpg,gif,svg}',
        icons: 'src/assets/icons/**/*.svg',
        fonts: 'src/assets/fonts/**/*.*',
        root: ['src/assets/root/**/*.*', 'src/assets/root/**/.*'],
        vendor: 'vendor/**/*.*'
    },
    dest: {
        html: 'public/',
        js: 'public/js/',
        css: 'public/css/',
        img: 'public/img/',
        icons: 'public/icons/',
        fonts: 'public/fonts/',
        root: 'public/',
        vendor: 'public/libs/'
    },
    cache: {
        img: 'cache/img/',
        fonts: 'cache/fonts/'
    },
    watch: {
        html: 'src/html/**/*.*',
        scripts: 'src/scripts/**/*.*',
        styles: 'src/styles/**/*.*',
        images: 'src/assets/images/**/*.*',
        icons: 'src/assets/icons/**/*.*',
        fonts: 'src/assets/fonts/**/*.*',
        root: 'src/assets/root/**/*.*',
        vendor: 'vendor/**/*.*'
    },
    clear: {
        dest: 'public/'
    }
};

const config = {
    server: {
        base: "./public",
        keepalive: true,
        port: 8011
    },
    browsersync: {
        files: [
            path.dest.html + '**/*.*',
            path.dest.js + '**/*.*',
            path.dest.img + '**/*.*',
            path.dest.css + '**/*.*'
        ],
        proxy: '127.0.0.1:8011',
        port: 8081,
        open: true,
        notify: false
    },
    deploy: {
        root: path.dest.html,
        hostname: 'example.com',
        port: 22,
        username: 'username',
        incremental: true,
        progress: true,
        compress: true,
        recursive: true,
        clean: true,
        destination: '/'
    },
    icons: {
        fontname: 'icons',
        template: 'src/assets/icons/_icons.less.tpl',
        cssfile: '../../src/styles/common/icons.less',
        fontpath: '../fonts/',
    },
    fonts: {
        csspath: 'src/styles/common/',
        cssfile: 'fonts.less',
        fontpath: '../fonts/',
        subset: ['!','"','#','№','$','%','&','\'','(',')','*','+',',','-','.','/','0','1','2','3','4','5','6','7','8','9',':',';','<','=','>','?','@','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','[','\\',']','^','_','`','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','{','|','}','~','¢','£','¥','¨','©','«','®','´','¸','»','ˆ','˚','˜','Ѐ','Ё','Ђ','Ѓ','Є','Ѕ','І','Ї','Ј','Љ','Њ','Ћ','Ќ','Ѝ','Ў','Џ','А','Б','В','Г','Д','Е','Ж','З','И','Й','К','Л','М','Н','О','П','Р','С','Т','У','Ф','Х','Ц','Ч','Ш','Щ','Ъ','Ы','Ь','Э','Ю','Я','а','б','в','г','д','е','ж','з','и','й','к','л','м','н','о','п','р','с','т','у','ф','х','ц','ч','ш','щ','ъ','ы','ь','э','ю','я','ѐ','ё','ђ','ѓ','є','ѕ','і','ї','ј','љ','њ','ћ','ќ','ѝ','ў','џ','Ѡ','ѡ','Ѣ','ѣ','Ѥ','ѥ','Ѧ','ѧ','Ѩ','ѩ','Ѫ','ѫ','Ѭ','ѭ','Ѯ','ѯ','Ѱ','ѱ','Ѳ','ѳ','Ѵ','ѵ','Ѷ','ѷ','Ѹ','ѹ','Ѻ','ѻ','Ѽ','ѽ','Ѿ','ѿ','Ҁ','ҁ','҂','҃','҄','҅','҆','҇','҈','҉','Ҋ','ҋ','Ҍ','ҍ','Ҏ','ҏ','Ґ','ґ','Ғ','ғ','Ҕ','ҕ','Җ','җ','Ҙ','ҙ','Қ','қ','Ҝ','ҝ','Ҟ','ҟ','Ҡ','ҡ','Ң','ң','Ҥ','ҥ','Ҧ','ҧ','Ҩ','ҩ','Ҫ','ҫ','Ҭ','ҭ','Ү','ү','Ұ','ұ','Ҳ','ҳ','Ҵ','ҵ','Ҷ','ҷ','Ҹ','ҹ','Һ','һ','Ҽ','ҽ','Ҿ','ҿ','Ӏ','Ӂ','ӂ','Ӄ','ӄ','Ӆ','ӆ','Ӈ','ӈ','Ӊ','ӊ','Ӌ','ӌ','Ӎ','ӎ','ӏ','Ӑ','ӑ','Ӓ','ӓ','Ӕ','ӕ','Ӗ','ӗ','Ә','ә','Ӛ','ӛ','Ӝ','ӝ','Ӟ','ӟ','Ӡ','ӡ','Ӣ','ӣ','Ӥ','ӥ','Ӧ','ӧ','Ө','ө','Ӫ','ӫ','Ӭ','ӭ','Ӯ','ӯ','Ӱ','ӱ','Ӳ','ӳ','Ӵ','ӵ','Ӷ','ӷ','Ӹ','ӹ','Ӻ','ӻ','Ӽ','ӽ','Ӿ','ӿ','–','—','‘','’','‚','“','”','„','•','…','‹','›','€','™','₽','◂','▸']
    }
};

function wrapPipe(taskFn) {
    return function(done) {
        var onSuccess = function () {
            done();
        };
        var onError = function (err) {
            done(err);
        };
        var outStream = taskFn(onSuccess, onError);
        if (outStream && typeof outStream.on === 'function') {
            outStream.on('end', onSuccess);
        }
    };
}

/* HTML */
gulp.task('html:build', function () {
    return gulp.src(path.src.html)
        .pipe(cache('html'))
        .pipe(gulp.dest(path.dest.html))
});

/* Root files */
gulp.task('root:build', function () {
    return gulp.src(path.src.root)
        .pipe(cache('root'))
        .pipe(gulp.dest(path.dest.root))
});

/* Vendor */
gulp.task('vendor:build', function() {
    return gulp.src(path.src.vendor)
        .pipe(newer(path.dest.vendor))
        .pipe(gulp.dest(path.dest.vendor));
});

/* Scripts */
gulp.task('scripts:build', wrapPipe(function (success, error) {
    return gulp.src(path.src.scripts)
        .pipe(rigger().on('error', error))
        .pipe(sourcemaps.init().on('error', error))
        .pipe(uglify().on('error', error))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.dest.js))
}));

/* Main LESS-file */
gulp.task('styles.main:build', wrapPipe(function (success, error) {
    return gulp.src(path.src.styles.main)
        .pipe(sourcemaps.init().on('error', error))
        .pipe(less().on('error', error))
        .pipe(autoprefixer().on('error', error))
        .pipe(cleanCss().on('error', error))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.dest.css))
}));

/* Editor LESS-file */
gulp.task('styles.editor:build', wrapPipe(function (success, error) {
    return gulp.src(path.src.styles.editor)
        .pipe(sourcemaps.init().on('error', error))
        .pipe(less().on('error', error))
        .pipe(autoprefixer().on('error', error))
        .pipe(cleanCss().on('error', error))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.dest.css))
}));

/* Styles */
gulp.task('styles:build', ['styles.main:build', 'styles.editor:build']);

/* Images cache */
gulp.task('images:cache', function () {
    return gulp.src(path.src.images)
        .pipe(newer(path.cache.img))
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegoptim({progressive: true, max: 85}),
            imagemin.optipng({optimizationLevel: 7}),
            imagemin.svgo()
        ]))
        .pipe(gulp.dest(path.cache.img))
});

/* Images build */
gulp.task('images:build', ['images:cache'], function () {
    return gulp.src(path.cache.img + '**/*.*')
        .pipe(newer(path.dest.img))
        .pipe(gulp.dest(path.dest.img));
});

/* Icons build */
gulp.task('icons:build', function() {
    return gulp.src(path.src.icons)
        .pipe(imagemin([
            imagemin.svgo()
        ]))
        .pipe(gulp.dest(path.dest.icons))
        .pipe(iconfontCss({
            fontName: config.icons.fontname,
            path: config.icons.template,
            targetPath: config.icons.cssfile,
            fontPath: config.icons.fontpath
        }))
        .pipe(iconfont({
            formats: ['ttf', 'woff', 'woff2'],
            fontName: config.icons.fontname,
            normalize: true,
            autohint: true,
            fontHeight: 1001,
        }))
        .pipe(gulp.dest(path.dest.fonts));
});

/* Fonts cache */
gulp.task('fonts:cache', function() {
    return gulp.src(path.src.fonts)
        .pipe(newer(path.cache.fonts + 'src/'))
        .pipe(gulp.dest(path.cache.fonts + 'src/'))
        .pipe(gulpif(/\.(otf|ttf)$/, fontgen({
            dest: path.cache.fonts,
            css_fontpath: config.fonts.fontpath,
            subset: config.fonts.subset
        })));
});

/* Fonts CSS */
gulp.task('fonts:css', ['fonts:cache'], function () {
    return gulp.src(path.cache.fonts + '*.css')
        .pipe(concat(config.fonts.cssfile))
        .pipe(gulp.dest(config.fonts.csspath));
});

/* Fonts */
gulp.task('fonts:build', ['fonts:css'], function () {
    return gulp.src(path.cache.fonts + '*.*')
        .pipe(newer(path.dest.fonts))
        .pipe(gulp.dest(path.dest.fonts));
});

/* Build clear */
gulp.task('build:clear', function (cb) {
    return rimraf(path.clear.dest, cb);
});

/* Build */
gulp.task('build', function (cb) {
    return runSeq(
        'build:clear',
        [
            'icons:build',
            'fonts:build',
        ],
        [
            'root:build',
            'vendor:build',
            'images:build',
            'scripts:build',
            'html:build',
            'styles:build',
        ],
        cb
    );
});

/* Web server */
gulp.task('webserver', ['build'], function() {
    return php.server(config.server, function () {
        browserSync(config.browsersync);
    });
});

/* Deploy */
gulp.task('deploy', function () {
    return runSeq(
        'build',
        'upload'
    );
});

/* Upload */
gulp.task('upload', function () {
    return gulp.src(path.dest.html)
        .pipe(rsync(config.deploy));
});

/* Watch */
gulp.task('watch', ['webserver'], function() {
    gulp.watch(path.watch.html, ['html:build']);
    gulp.watch(path.watch.root, ['root:build']);
    gulp.watch(path.watch.styles, ['styles:build']);
    gulp.watch(path.watch.scripts, ['scripts:build']);
    gulp.watch(path.watch.images, ['images:build']);
    gulp.watch(path.watch.icons, ['icons:build']);
    gulp.watch(path.watch.fonts, ['fonts:build']);
    gulp.watch(path.watch.vendor, ['libs:build']);
});

gulp.task('default', ['watch']);
