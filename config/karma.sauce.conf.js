module.exports = function(config) {
    "use strict";

    var customLaunchers = {
        iOSSafari: {
            base: "SauceLabs",
            browserName: "iphone",
            version: "5.1"
        },
        ie7: {
            base: "SauceLabs",
            browserName: "internet explorer",
            version: "7.0"
        },
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
        ff3dot6: {
            base: "SauceLabs",
            browserName: "firefox",
            platform: "Windows XP",
            version: "3.6"
        },
        opera11: {
            base: "SauceLabs",
            browserName: "opera",
            platform: "Windows XP",
            version: "11"
        },
        safari5: {
            base: "SauceLabs",
            browserName: "safari",
            platform: "OS X 10.6",
            version: "5"
        }
    };

    config.set({
        basePath: "",
        frameworks: ["jasmine"],
        captureTimeout: 120000,
        browserNoActivityTimeout: 60000,
        files: [
            "../src/support.js",
            "../src/utils.js",
            "../src/polyfill.js",
            "../src/main.js",
            "../test/**/*_spec.js"
        ],
        sauceLabs: {
            testName: "HTML5 placeholder polyfill"
        },
        customLaunchers: customLaunchers,
        browsers: Object.keys(customLaunchers),
        reporters: ["dots", "saucelabs"],
        singleRun: true
    });
};
