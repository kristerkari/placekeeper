var gulp = require("gulp");
var jscs = require("gulp-jscs");

gulp.task("default", function() {
    return gulp.src("*.js")
               .pipe(jscs());
});

gulp.task("test", function() {
    console.log("running test task");
});
