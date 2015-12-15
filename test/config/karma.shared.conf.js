var sharedKarmaConfig = {
  preprocessors: {
    "src/*.js": ["browserify"],
    "test/utils/helpers.js": ["browserify"],
    "test/unit/*.js": ["browserify"]
  },
  browserify: {
    debug: true,
    transform: [
      "babelify"
    ]
  },
  basePath: "../../",
  frameworks: ["browserify", "jasmine"],
  singleRun: true,
  colors: true,
  autoWatch: false,
  exclude: [],
  files: [
    "node_modules/jquery/dist/jquery.js",
    "test/utils/matchers.js",
    "test/utils/trigger-event.js",
    "test/unit/**/*.spec.js"
  ]
};

module.exports = sharedKarmaConfig;
