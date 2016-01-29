import * as placekeeper from "./main.js"

if (typeof define === "function" && define.amd) {
  define("placekeeper", [], () => {
    return placekeeper
  })
} else if (typeof exports === "object") {
  module.exports = placekeeper
} else {
  window.placekeeper = placekeeper
}
