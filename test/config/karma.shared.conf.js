var sharedKarmaConfig = {
  basePath: "../../",
  frameworks: ["jasmine"],
  singleRun: true,
  colors: true,
  autoWatch: false,
  exclude: [],
  files: [
    "node_modules/jquery/dist/jquery.js",
    "src/data.js",
    "src/mode.js",
    "src/utils.js",
    "src/support.js",
    "src/elements.js",
    "src/polyfill.js",
    "src/events.js",
    "src/main.js",
    "src/module.js",
    "src/adapters/adapter.jquery.js",
    "test/utils/*.js",
    "test/**/*.spec.js"
  ],
  wrapPreprocessor: {
    template: "(function(global) {\n\n\"use strict\";\n\n" +
              "global.placekeeper = global.placekeeper || {};\n\n" +
              "<%= contents %>\n\n}(window))"
  }
};

module.exports = sharedKarmaConfig;
