let { src, dest, series, watch } = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const cleanCSS = require("gulp-clean-css");
const sync = require("browser-sync").create();

function compileCSS(cb) {
  src("./scss/**/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(autoprefixer({ grid: true }))
    .pipe(sourcemaps.write())
    .pipe(dest("css"));
  cb();
}

function minCSS(cb) {
  src([
    "node_modules/bootstrap/dist/css/bootstrap.min.css",
    "node_modules/lightslider/dist/css/lightslider.min.css",
    "css/style.css",
  ])
    .pipe(concat("style.min.css"))
    .pipe(cleanCSS())
    .pipe(dest("css/"))
    .pipe(sync.stream());
  cb();
}

function minJS(cb) {
  src([
    "node_modules/bootstrap/dist/js/bootstrap.min.js",
    "node_modules/jquery/dist/jquery.min.js",
    "node_modules/lightslider/dist/js/lightslider.min.js",
    "js/app.js",
  ])
    .pipe(concat("all.min.js"))
    .pipe(uglify())
    .pipe(dest("js"));
  cb();
}

function watchFiles(cb) {
  watch("scss/**.scss", series(compileCSS, minCSS));
  // watch(['js/*.js', '!node_modules/**'], minJS);
}

function browserSync(cb) {
  sync.init({
    server: {
      baseDir: "./",
    },
  });

  watch("scss/**.scss", series(compileCSS, minCSS));
  watch(["js/*.js", "!node_modules/**"], minJS);
  watch("**.html").on("change", sync.reload);
}

exports.scss = compileCSS;
exports.minCSS = minCSS;
exports.js = minJS;
exports.style = series(compileCSS, minCSS);
exports.default = series(compileCSS, minCSS,  minJS, browserSync)
exports.watch = browserSync;
