const gulp = require("gulp");
const babel = require("gulp-babel");
const imagemin = require('gulp-imagemin');
const sass = require("gulp-sass");
const ejs = require("gulp-ejs");
const connect = require("gulp-connect");
const rename = require("gulp-rename");

sass.compiler = require('node-sass');

function Html(done) {
   gulp.src("src/html/templates/*.ejs")
      .pipe(ejs())
      .pipe(rename(function (path) {
         if (path.basename != "index") {
            path.dirname = path.basename;
            path.basename = "index";
         }
         path.extname = ".html"
      }))
      .pipe(gulp.dest("./dist"))
      .pipe(connect.reload());
   done()
}

function Scss(done) {
   gulp.src("src/scss/**/*.scss")
      .pipe(sass())
      .pipe(gulp.dest("dist/assets/css"))
      .pipe(connect.reload());
   done();
}

function Javascript(done) {
   gulp.src('src/javascript/**/*.js')
      .pipe(babel({
         presets: ['@babel/env']
      }))
      .pipe(gulp.dest('dist/assets/javascript'))
      .pipe(connect.reload());
   done();
}

function Json(done) {
   gulp.src('src/json/*.json')
      .pipe(gulp.dest('dist/assets/data'))
      .pipe(connect.reload());
   done();
}

function Images(done) {
   gulp.src("src/images/**/*.*")
      .pipe(imagemin())
      .pipe(gulp.dest('dist/assets/images'))
      .pipe(connect.reload());
   done();
}

function Fonts(done) {
   gulp.src("src/fonts/**/*.*")
      .pipe(gulp.dest('dist/assets/fonts'))
      .pipe(connect.reload());
   done();
}

function watch() {
   gulp.watch("src/images/**/*.*", { ignoreInitial: false }, Images);
   gulp.watch("src/fonts/**/*.*", { ignoreInitial: false }, Fonts);
   gulp.watch("./src/html/**/*.ejs", { ignoreInitial: false }, Html);
   gulp.watch("./src/scss/**/*.scss", { ignoreInitial: false }, Scss);
   gulp.watch("./src/javascript/**/*.js", { ignoreInitial: false }, Javascript);
   gulp.watch("src/json/**/*.json", { ignoreInitial: false }, Json);
}

gulp.task("dev", function (done) {
   watch();
   connect.server({
      livereload: true,
      root: "dist"
   });
   done();
});