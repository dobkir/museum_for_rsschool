"use strict";

const { src, dest } = require("gulp");
const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const cssbeautify = require("gulp-cssbeautify");
const removeComments = require("gulp-strip-css-comments");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const cssnano = require("gulp-cssnano");
const uglify = require("gulp-uglify");
const plumber = require("gulp-plumber");
const panini = require("panini");
const imagemin = require("gulp-imagemin");
const del = require("del");
const notify = require("gulp-notify");
const webpack = require("webpack");
const webpackStream = require("webpack-stream");
const browserSync = require("browser-sync").create();
const ghPages = require("gulp-gh-pages");


/* Paths */
const srcPath = "src/";
const distPath = "dist/";

const path = {
    build: {
        html: distPath,
        js: distPath + "js/",
        css: distPath + "css/",
        img: distPath + "assets/img/",
        fonts: distPath + "assets/fonts/",
        video: distPath + "assets/video/"
    },
    src: {
        html: srcPath + "html/pages/**/*.{html,hbs,handlebars}",
        js: srcPath + "js/*.js",
        css: srcPath + "scss/*.scss",
        img: srcPath + "assets/img/**/*.{jpg,png,svg,gif,ico,webp,webmanifest,xml,json}",
        fonts: srcPath + "assets/fonts/**/*.{eot,woff,woff2,ttf,svg}",
        video: srcPath + "assets/video/**/*.{jpg, mp4, webm}"
    },
    watch: {
        html: srcPath + "html/**/*.{html,hbs,handlebars}",
        js: srcPath + "js/**/*.js",
        css: srcPath + "scss/**/*.scss",
        img: srcPath + "assets/img/**/*.{jpg,png,svg,gif,ico,webp,webmanifest,xml,json}",
        fonts: srcPath + "assets/fonts/**/*.{eot,woff,woff2,ttf,svg}",
        video: srcPath + "assets/video/**/*.{jpg, mp4, webm}"
    },
    clean: "./" + distPath
}

/* Tasks */

function server() {
    browserSync.init({
        server: {
            baseDir: "./" + distPath
        }
    });
}

function html(cb) {
    panini.refresh();
    return src(path.src.html, { base: srcPath + "html/pages/" })
        .pipe(plumber())
        .pipe(panini({
            root: srcPath + "html/pages/",
            layouts: srcPath + "html/layouts/",
            partials: srcPath + "html/partials/",
            helpers: srcPath + "html/helpers/",
            data: srcPath + "html/data/"
        }))
        .pipe(dest(path.build.html))
        .pipe(browserSync.reload({ stream: true }));

    cb();
}

function css(cb) {
    return src(path.src.css, { base: srcPath + "scss/" })
        .pipe(plumber({
            errorHandler: function (err) {
                notify.onError({
                    title: "SCSS Error",
                    message: "Error: <%= error.message %>"
                })(err);
                this.emit("end");
            }
        }))
        .pipe(sass({
            includePaths: "./node_modules/"
        }))
        .pipe(autoprefixer({
            cascade: true
        }))
        .pipe(cssbeautify())
        .pipe(dest(path.build.css))
        .pipe(cssnano({
            zindex: false,
            discardComments: {
                removeAll: true
            }
        }))
        .pipe(removeComments())
        .pipe(rename({
            suffix: ".min",
            extname: ".css"
        }))
        .pipe(dest(path.build.css))
        .pipe(browserSync.reload({ stream: true }));

    cb();
}

function cssWatch(cb) {
    return src(path.src.css, { base: srcPath + "scss/" })
        .pipe(plumber({
            errorHandler: function (err) {
                notify.onError({
                    title: "SCSS Error",
                    message: "Error: <%= error.message %>"
                })(err);
                this.emit("end");
            }
        }))
        .pipe(sass({
            includePaths: "./node_modules/"
        }))
        .pipe(rename({
            suffix: ".min",
            extname: ".css"
        }))
        .pipe(dest(path.build.css))
        .pipe(browserSync.reload({ stream: true }));

    cb();
}

function js(cb) {
    return src(path.src.js, { base: srcPath + "js/" })
        .pipe(plumber({
            errorHandler: function (err) {
                notify.onError({
                    title: "JS Error",
                    message: "Error: <%= error.message %>"
                })(err);
                this.emit("end");
            }
        }))
        .pipe(webpackStream({
            mode: "production",
            output: {
                filename: "index.js",
            },
            module: {
                rules: [
                    {
                        test: /\.(js)$/,
                        exclude: /(node_modules)/,
                        loader: "babel-loader",
                        query: {
                            presets: ["@babel/preset-env"]
                        }
                    }
                ]
            }
        }))
        .pipe(dest(path.build.js))
        .pipe(browserSync.reload({ stream: true }));

    cb();
}

function jsWatch(cb) {
    return src(path.src.js, { base: srcPath + "js/" })
        .pipe(plumber({
            errorHandler: function (err) {
                notify.onError({
                    title: "JS Error",
                    message: "Error: <%= error.message %>"
                })(err);
                this.emit("end");
            }
        }))
        .pipe(webpackStream({
            mode: "development",
            output: {
                filename: "index.js",
            }
        }))
        .pipe(dest(path.build.js))
        .pipe(browserSync.reload({ stream: true }));

    cb();
}

function img(cb) {
    return src(path.src.img)
        .pipe(imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.mozjpeg({ quality: 95, progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imagemin.svgo({
                plugins: [
                    { removeViewBox: true },
                    { cleanupIDs: false }
                ]
            })
        ]))
        .pipe(dest(path.build.img))
        .pipe(browserSync.reload({ stream: true }));

    cb();
}

function fonts(cb) {
    return src(path.src.fonts)
        .pipe(dest(path.build.fonts))
        .pipe(browserSync.reload({ stream: true }));

    cb();
}

function video(cb) {
    return src(path.src.video)
        .pipe(dest(path.build.video))
        .pipe(browserSync.reload({ stream: true }));

    cb();
}

function clean(cb) {
    return del(path.clean);

    cb();
}

function deploy() {
    return gulp.src("./dist/**/*")
        .pipe(ghPages());
};

function watchFiles() {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], cssWatch);
    gulp.watch([path.watch.js], jsWatch);
    gulp.watch([path.watch.img], img);
    gulp.watch([path.watch.fonts], fonts);
    gulp.watch([path.watch.video], video);
}

const build = gulp.series(clean, gulp.parallel(html, css, js, img, fonts, video));
const watch = gulp.parallel(build, watchFiles, server);

/* Exports Tasks */
exports.html = html;
exports.css = css;
exports.js = js;
exports.img = img;
exports.fonts = fonts;
exports.video = video;
exports.clean = clean;
exports.deploy = deploy;
exports.build = build;
exports.watch = watch;
exports.default = watch;
