// Karma configuration
// Generated on Thu Feb 26 2015 23:29:38 GMT+0200 (EET)

module.exports = function(config) {
  "use strict";

  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: "",

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ["jasmine"],

    // list of files / patterns to load in the browser
    files: [
      "../src/data.js",
      "../src/mode.js",
      "../src/utils.js",
      "../src/support.js",
      "../src/elements.js",
      "../src/polyfill.js",
      "../src/events.js",
      "../src/main.js",
      "../src/module.js",
      "../test/utils/*.js",
      "../test/**/*.spec.js"
    ],

    // list of files to exclude
    exclude: [
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      "../src/**/!(support).js": ["coverage"],
      "../src/*.js": ["wrap"]
    },

    wrapPreprocessor: {
      template: "(function(global) {\n\n\"use strict\";\n\n" +
                "global.placekeeper = global.placekeeper || {};\n\n" +
                "<%= contents %>\n\n}(window))"
    },

    // optionally, configure the reporter
    coverageReporter: {
      dir: "../coverage/",
      reporters: [
        {
          type: "lcov"
        },
        {
          type: "text-summary"
        }
      ]
    },

    // test results reporter to use
    // possible values: "dots", "progress"
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ["progress", "coverage"],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ["PhantomJS"],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  });
};
