(function() {
    "use strict";

    var path = require("path");
    var gulp = require("gulp");
    var concat = require('gulp-concat');
    var jscs = require("gulp-jscs");
    var eslint = require("gulp-eslint");
    var connect = require("gulp-connect");
    var karma = require("karma").server;

    gulp.task("server", function() {
        connect.server({
            root: ["test/manual", "."],
            livereload: true
        });
    });

    gulp.task("build", function() {
        return gulp.src([
            "src/data.js",
            "src/utils.js",
            "src/support.js",
            "src/elements.js",
            "src/polyfill.js",
            "src/events.js",
            "src/main.js"
        ])
        .pipe(concat("placekeeper.js"))
        .pipe(gulp.dest('.'));
    });

    gulp.task("lint", function() {
        return gulp.src("src/*.js")
                   .pipe(eslint({
                       useEslintrc: true
                   }))
                   .pipe(eslint.format())
                   .pipe(eslint.failAfterError())
                   .pipe(jscs());
    });

    gulp.task("default", ["lint"]);

    gulp.task("test", function(done) {
        karma.start({
            configFile: path.join(__dirname, "/config/karma.conf.js"),
            singleRun: true
        }, done);
    });

    gulp.task("tdd", function(done) {
        karma.start({
            configFile: path.join(__dirname, "/config/karma.conf.js"),
            singleRun: false,
            autoWatch: true
        }, done);
    });

}());
