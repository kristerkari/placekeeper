var extend = require("lodash.assign");
var shared = require("./karma.shared.conf.js");

module.exports = function(config) {
  "use strict";

  var customLaunchers = {
    // iOSSafari: {
    //   base: "SauceLabs",
    //   browserName: "iphone",
    //   version: "5.1"
    // },
    // ie7: {
    //   base: "SauceLabs",
    //   browserName: "internet explorer",
    //   version: "7.0"
    // },
    ie8: {
      base: "SauceLabs",
      browserName: "internet explorer",
      version: "8.0"
    },
    ie9: {
      base: "SauceLabs",
      browserName: "internet explorer",
      version: "9.0"
    },
    ff4: {
      base: "SauceLabs",
      browserName: "firefox",
      platform: "Windows XP",
      version: "4"
    },
    opera11: {
      base: "SauceLabs",
      browserName: "opera",
      platform: "Windows XP",
      version: "12"
    },
    safari6: {
      base: "SauceLabs",
      browserName: "safari",
      platform: "OS X 10.8",
      version: "6"
    }
  };

  config.set(extend(shared, {
    captureTimeout: 120000,
    browserNoActivityTimeout: 60000,
    sauceLabs: {
      testName: "HTML5 placeholder polyfill"
    },
    customLaunchers: customLaunchers,
    browsers: Object.keys(customLaunchers),
    reporters: ["dots", "saucelabs"]
  }));
};
