"use strict";

var gulp = require("gulp");
var jscs = require("gulp-jscs");
var eslint = require("gulp-eslint");

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
    console.log("running test task");
});
