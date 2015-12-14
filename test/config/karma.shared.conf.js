var sharedKarmaConfig = {
  preprocessors: {
    "src/*.js": ["browserify"],
    "test/utils/helpers.js": ["browserify"],
    "test/unit/*.js": ["browserify"]
  },
  browserify: {
    debug: true,
    transform: [
      [
        "babelify",
        {
          presets: ["es2015-loose"],
          plugins: [
            "transform-es2015-arrow-functions",
            "transform-es2015-constants",
            "transform-es2015-literals",
            "transform-es2015-block-scoping",
            "transform-es3-member-expression-literals",
            "transform-es3-property-literals"
          ]
        }
      ]
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
