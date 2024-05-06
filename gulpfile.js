import gulp, { parallel } from 'gulp'; 
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import rename from 'gulp-rename';
import {deleteAsync} from 'del';
import svgSprite from 'gulp-svg-sprite';
import webpackStream from 'webpack-stream';
import browserSync from 'browser-sync';
import htmlmin from 'gulp-htmlmin';

const sass = gulpSass(dartSass);

function server() {
    browserSync.init({
        server: {
            baseDir: 'dist'
        }
    })
}

function watch() {
    gulp.watch(['src/style.scss', 'src/scss/*',], styles);
    gulp.watch(['src/app.js'], scripts);
    gulp.watch(['src/fonts', 'src/assnts/*',], copy);
}

function scripts() {
    return gulp.src('src/app.js')
    .pipe(webpackStream({
        mode: 'production', 
        module: {
            rules: [
              {
                test: /\.(?:js)$/,
                exclude: /node_modules/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: [
                      ['@babel/preset-env', { targets: "defaults" }]
                    ]
                  }
                }
              }
            ]
          }
    }))
    .pipe(rename('app.min.js'))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream())

}

function styles() {
    return gulp.src('src/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer(['last 15 version']))
    .pipe(cleanCSS())
    .pipe(htmlmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream())
}

function copy() {
    return gulp.src(['src/index.html', 'src/fonts/*', 'src/assets/*'], { base: 'src'})
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream({
        once: true
    }))
}

function clean() {
    return deleteAsync(['dist/**'])
}

function html(){
    return gulp.src('src/*.html')
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(gulp.dest('dist'));
  };

function svg () {
   return gulp.src('src/assets/*.svg')
   .pipe(svgSprite({
      mode: {
        symbol: {
            sprite: '../sprite.svg'
        }
      }  
   }))
   .pipe(gulp.dest('src/assets/'));
}

export { styles, clean, html, copy, svg, scripts, server, watch };

export default gulp.series(clean, gulp.parallel(copy, html,  styles, scripts ), gulp.parallel(server, watch))

export let build = gulp.series(clean, html, copy, styles, scripts );



//npm init
//npm i -D gulp
//npm install sass gulp-sass --save-dev
//gulp styles
//npm install --save-dev gulp-autoprefixer
//npm install gulp-clean-css --save-dev
//gulp styles
//npm i -D gulp-rename
//gulp styles
// npm install del -D
//gulp clean
//gulp cony
//npm install --save-dev gulp-svg-sprite
//gulp svg
//gulp svg
//gulp
//npm install --save-dev webpack-stream
//npm i babel-loader @babel/preset-env -D
//gulp scripts
//gulp scripts
//npm i browser-sync -D
//gulp
//gulp
//gulp build



//npm install --save gulp-htmlmin
//npm install --save gulp-htmlmin -D
//npm install --save-dev  gulp-htmlmin
//npm i gulp-htmlmin -D