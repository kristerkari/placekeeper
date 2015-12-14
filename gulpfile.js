(function() {
  "use strict";

  var path = require("path");
  var gulp = require("gulp");
  var jscs = require("gulp-jscs");
  var jshint = require("gulp-jshint");
  var stylish = require("jshint-stylish");
  var eslint = require("gulp-eslint");
  var connect = require("gulp-connect");
  var Server = require("karma").Server;
  var uglify = require("gulp-uglify");
  var rename = require("gulp-rename");
  var sizereport = require("gulp-sizereport");
  var rollup = require("gulp-rollup");
  var babel = require("rollup-plugin-babel");
  var dereserve = require("gulp-dereserve");

  var adapters = [
    "jquery",
    "prototype",
    "yui3"
  ];

  gulp.task("server", function() {
    connect.server({
      root: ["test/manual", "."],
      livereload: true
    });
  });

  gulp.task("source", function() {
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
    .pipe(gulp.dest("dist"));
  });

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
    .pipe(gulp.dest("dist"));
  }

  gulp.task("adapters", ["source"], function() {
    return adapters.forEach(buildAdapter);
  });

  gulp.task("build", ["source", "adapters"]);

  gulp.task("jshint", function() {
    return gulp.src("src/*.js")
              .pipe(jshint())
              .pipe(jshint.reporter(stylish))
              .pipe(jshint.reporter("fail"));
  });

  gulp.task("eslint", function() {
    return gulp.src("src/*.js")
               .pipe(eslint({
                 useEslintrc: true
               }))
               .pipe(eslint.format())
               .pipe(eslint.failAfterError());
  });

  gulp.task("jscs", function() {
    return gulp.src("src/*.js")
               .pipe(jscs())
               .pipe(jscs.reporter());
  });

  gulp.task("lint", ["eslint", "jshint", "jscs"]);

  gulp.task("default", ["lint"]);

  gulp.task("test", function(done) {
    new Server({
      configFile: path.join(__dirname, "/config/karma.conf.js"),
      singleRun: true
    }, done).start();
  });

  gulp.task("tdd", function(done) {
    new Server({
      configFile: path.join(__dirname, "/config/karma.conf.js"),
      singleRun: false,
      autoWatch: true
    }, done).start();
  });

  gulp.task("size", function() {
    return gulp.src("./dist/*")
               .pipe(sizereport({
                  gzip: true
                }));
  });

}());
