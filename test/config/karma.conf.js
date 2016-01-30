var extend = require("lodash.assign");
var shared = require("./karma.shared.conf.js");
var istanbul = require("browserify-istanbul");

module.exports = function(config) {
  "use strict";

  config.set(extend(shared, {
    preprocessors: {
      "src/*.js": ["browserify"],
      "test/utils/helpers.js": ["browserify"],
      "test/utils/matchers.js": ["browserify"],
      "test/unit/*.spec.js": ["browserify"],
      "src/**/!(support).js": ["coverage"]
    },
    coverageReporter: {
      dir: "coverage/",
      reporters: [
        {
          type: "lcov"
        },
        {
          type: "text-summary"
        }
      ]
    },
    reporters: ["progress", "coverage"],
    browserify: {
      transform: [
        [
          "babelify"
        ],
        [
          istanbul({
            ignore: [
              "**/node_modules/**",
              "**/test/**"
            ]
          })
        ]
      ],
      debug: true
    },
    logLevel: config.LOG_DISABLE,
    browsers: ["PhantomJS"]
  }));
};
