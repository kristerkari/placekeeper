(function() {
  "use strict";

  var path = require("path");
  var gulp = require("gulp");
  var concat = require("gulp-concat");
  var jscs = require("gulp-jscs");
  var jshint = require("gulp-jshint");
  var stylish = require("jshint-stylish");
  var eslint = require("gulp-eslint");
  var connect = require("gulp-connect");
  var indent = require("gulp-indent");
  var trimlines = require("gulp-trimlines");
  var wrap = require("gulp-wrap");
  var Server = require('karma').Server;
  var uglify = require("gulp-uglify");
  var rename = require("gulp-rename");
  var sizereport = require("gulp-sizereport");

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
      "src/data.js",
      "src/utils.js",
      "src/mode.js",
      "src/support.js",
      "src/elements.js",
      "src/polyfill.js",
      "src/events.js",
      "src/main.js",
      "src/module.js"
    ])
    .pipe(indent({
      amount: 2
    }))
    .pipe(concat("placekeeper.js"))
    .pipe(wrap("(function(global) {\n  \"use strict\";\n\n  var placekeeper = {};\n\n<%= contents %>\n}(this));\n\n"))
    .pipe(trimlines({
      leading: false
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
      "dist/placekeeper.js",
      "src/adapters/adapter." + adapter + ".js"
    ])
    .pipe(concat("placekeeper." + adapter + ".js"))
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

  gulp.task("lint", function() {
    return gulp.src("src/*.js")
               .pipe(jshint())
               .pipe(jshint.reporter(stylish))
               .pipe(jshint.reporter("fail"))
               .pipe(eslint({
                 useEslintrc: true
               }))
               .pipe(eslint.format())
               .pipe(eslint.failAfterError())
               .pipe(jscs());
  });

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
