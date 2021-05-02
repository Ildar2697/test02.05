const { src, dest, series, watch } = require('gulp');
const concat = require('gulp-concat');
const htmlMin = require('gulp-htmlmin');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create();
const svgSprite = require('gulp-svg-sprite');
const image = require('gulp-image');
const uglify = require('gulp-uglify-es').default;
const babel = require('gulp-babel');
const notify = require('gulp-notify');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const less = require('gulp-less')


const clean = () => {
    return del(['dist'])
}

const resources = () => {
    return src('src/resources/**')
        .pipe(dest('dist'))
}

const styles = () => {
    return src('src/styles/main.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        // .pipe(concat('main.css'))
        .pipe(autoprefixer({
            cascade: false,
        }))
        .pipe(cleanCSS({
            level: 2,
        }))
        .pipe(sourcemaps.write())
        .pipe(dest('dist'))
        .pipe(browserSync.stream())
}
const htmlMinify = () => {
    return src('src/**/*.html')
        .pipe(htmlMin({
            collapseWhitespace: true,
        }))
        .pipe(dest('dist'))
        .pipe(browserSync.stream())
}

const svgSprites = () => {
    return src('src/images/svg/**/*.svg')
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: '../sprite.svg'
                }
            }
        }))
        .pipe(dest('dist/images'))
}
const scripts = () => {
    return src([
        'src/js/components/**/*.js',
        'src/js/main.js'
    ])
    .pipe(sourcemaps.init())
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(concat('app.js'))
    .pipe(uglify().on('error', notify.onError()))
    .pipe(sourcemaps.write())
    .pipe(dest('dist'))
    .pipe(browserSync.stream())
}
const watchFiles = () => {
    browserSync.init({
        server: {
            baseDir: 'dist'
        },
    })
}
const images = () => {
    return src([
        'src/images/**/*.jpg',
        'src/images/**/*.png',
        'src/images/*.svg',
        'src/images/**/*.jpeg',
    ])
    .pipe(image())
    .pipe(dest('dist/images'))
}
const fonts = () => {
    return src('src/fonts/**/*')
        .pipe(dest('dist/fonts'))
}


watch('src/**/*.html', htmlMinify)
watch('src/styles/**/*.less', styles)
watch('src/images/svg/**/*.svg', svgSprites)
watch('src/js/**/*.js', scripts)
watch('src/resources/**', resources)
watch('src/fonts/**/*', fonts)

exports.fonts = fonts
exports.styles = styles
exports.scripts = scripts
exports.htmlMinify = htmlMinify
exports.default = series(clean, resources, htmlMinify, scripts, styles, images, fonts, svgSprites, watchFiles)