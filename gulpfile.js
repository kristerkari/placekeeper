"use strict";

var path = require("path");
var gulp = require("gulp");
var jscs = require("gulp-jscs");
var eslint = require("gulp-eslint");
var karma = require("karma").server;

gulp.task("default", function() {
    return gulp.src("*.js")
               .pipe(eslint({
                   useEslintrc: true
               }))
               .pipe(eslint.format())
               .pipe(eslint.failAfterError())
               .pipe(jscs());
});

gulp.task("test", function(done) {
    karma.start({
        configFile: path.join(__dirname, "/config/karma.conf.js"),
        singleRun: true
    }, done);
});
