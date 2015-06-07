var extend = require("lodash.assign");
var shared = require("./karma.shared.conf.js");

module.exports = function(config) {
  "use strict";

  config.set(extend(shared, {
    preprocessors: {
      "../src/**/!(support).js": ["coverage"],
      "../src/*.js": ["wrap"]
    },
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
    reporters: ["progress", "coverage"],
    logLevel: config.LOG_INFO,
    browsers: ["PhantomJS"]
  }));
};
