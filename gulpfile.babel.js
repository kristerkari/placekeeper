(function() {
  "use strict"

  const path = require("path")
  const gulp = require("gulp")
  const jscs = require("gulp-jscs")
  const eslint = require("gulp-eslint")
  const connect = require("gulp-connect")
  const { Server } = require("karma")
  const uglify = require("gulp-uglify")
  const rename = require("gulp-rename")
  const sizereport = require("gulp-sizereport")
  const rollup = require("gulp-rollup")
  const babel = require("rollup-plugin-babel")
  const dereserve = require("gulp-dereserve")

  const adapters = [
    "jquery",
    "prototype",
    "yui3"
  ]

  gulp.task("server", () => {
    connect.server({
      root: ["test/manual", "."],
      livereload: true
    })
  })

  gulp.task("source", () => {
    return gulp.src([
      "src/module.js"
    ])
    .pipe(rollup({
      plugins: [
        babel()
      ],
      format: "iife",
      sourceMap: false
    }))
    .pipe(dereserve())
    .pipe(rename({
      basename: "placekeeper"
    }))
    .pipe(gulp.dest("dist"))
    .pipe(uglify({
      mangle: true
    }))
    .pipe(rename({
      extname: ".min.js"
    }))
    .pipe(gulp.dest("dist"))
  })

  function buildAdapter(adapter) {
    return gulp.src([
      "src/adapters/module." + adapter + ".js"
    ])
    .pipe(rollup({
      plugins: [
        babel()
      ],
      format: "iife",
      sourceMap: false
    }))
    .pipe(dereserve())
    .pipe(rename({
      basename: "placekeeper." + adapter
    }))
    .pipe(gulp.dest("dist"))
    .pipe(uglify({
      mangle: true
    }))
    .pipe(rename({
      extname: ".min.js"
    }))
    .pipe(gulp.dest("dist"))
  }

  gulp.task("adapters", ["source"], () => {
    return adapters.forEach(buildAdapter)
  })

  gulp.task("build", ["source", "adapters"])

  gulp.task("eslint", () => {
    return gulp.src(["src/**/*.js", "test/unit/*.spec.js"])
               .pipe(eslint({
                 useEslintrc: true
               }))
               .pipe(eslint.format())
               .pipe(eslint.failAfterError())
  })

  gulp.task("jscs", () => {
    return gulp.src(["src/**/*.js", "test/unit/*.spec.js"])
               .pipe(jscs())
               .pipe(jscs.reporter())
  })

  gulp.task("lint", ["eslint", "jscs"])

  gulp.task("default", ["lint"])

  gulp.task("test", (done) => {
    new Server({
      configFile: path.join(__dirname, "/config/karma.conf.js"),
      singleRun: true
    }, done).start()
  })

  gulp.task("tdd", (done) => {
    new Server({
      configFile: path.join(__dirname, "/config/karma.conf.js"),
      singleRun: false,
      autoWatch: true
    }, done).start()
  })

  gulp.task("size", () => {
    return gulp.src("./dist/*")
               .pipe(sizereport({
                  gzip: true
                }))
  })

}())
