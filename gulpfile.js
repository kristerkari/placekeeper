"use strict";

var gulp = require("gulp");
var jscs = require("gulp-jscs");
var eslint = require("gulp-eslint");
var karma = require("gulp-karma");

gulp.task("default", function() {
    return gulp.src("*.js")
               .pipe(eslint({
                   useEslintrc: true
               }))
               .pipe(eslint.format())
               .pipe(eslint.failAfterError())
               .pipe(jscs());
});

gulp.task("test", function() {
    return gulp.src("test/**/*_spec.js")
    .pipe(karma({
        configFile: "config/karma.conf.js",
        action: "run"
    }))
    .on("error", function(err) {
        throw err;
    });
});
