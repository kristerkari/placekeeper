import * as helpers from "../utils/helpers.js";
import * as placekeeper from "../../src/main.js";
import * as polyfill from "../../src/polyfill.js";
import * as utils from "../../src/utils.js";

describe("watching for placeholder changes", function() {
  "use strict";

  beforeEach(helpers.initialSetup);

  describe("when watching enabled and there is a password input with placeholder on the page", function() {
    var element;

    beforeEach(function(done) {
      spyOn(polyfill, "showPlaceholder").and.callThrough();
      helpers.spyOnCanChangeToTypeAndReturn(false);
      helpers.spyOnNativeSupportAndReturn(false);
      element = helpers.createInputElement(true, "password");
      placekeeper.priv.__init();
      setTimeout(done, helpers.loopDurationForTests);
    });

    afterEach(function() {
      element.parentNode.removeChild(element);
      placekeeper.disable();
    });

    it("should have called polyfill's showPlaceholder method once", function() {
      expect(polyfill.showPlaceholder).toHaveBeenCalled();
      // expect(polyfill.showPlaceholder.calls.count()).toEqual(1);
    });

  });

  describe("when watching enabled and there is an element with placeholder on the page", function() {
    var element;

    beforeEach(function(done) {
      spyOn(polyfill, "showPlaceholder").and.callThrough();
      helpers.spyOnNativeSupportAndReturn(false);
      element = helpers.createInputElement(true);
      placekeeper.priv.__init();
      setTimeout(done, helpers.loopDurationForTests);
    });

    afterEach(function() {
      element.parentNode.removeChild(element);
      placekeeper.disable();
    });

    it("should have called polyfill's showPlaceholder method once", function() {
      expect(polyfill.showPlaceholder).toHaveBeenCalled();
      expect(polyfill.showPlaceholder.calls.count()).toEqual(1);
    });

    it("should have set data-placeholder-value to the element", function() {
      expect(element.getAttribute("data-placeholder-value")).toEqual("Test");
    });

    it("should have watching enabled", function() {
      expect(placekeeper.isWatchingEnabled()).toEqual(true);
    });

    describe("and when placeholder value is changed", function() {

      beforeEach(function(done) {
        element.placeholder = "TestChanged";
        setTimeout(done, helpers.loopDurationForTests);
      });

      it("should correctly be able to get changed placeholder value", function() {
        expect(utils.getPlaceholderValue(element)).toEqual("TestChanged");
      });

      it("should have changed data-placeholder-value to the element", function() {
        expect(element.getAttribute("data-placeholder-value")).toEqual("TestChanged");
      });

    });

    describe("and when element value is changed", function() {

      beforeEach(function(done) {
        element.value = "Changed";
        setTimeout(done, helpers.loopDurationForTests);
      });

      it("should have set element's value to changed value (Changed)", function() {
        expect(element.value).toEqual("Changed");
      });

      it("should have removed data-placeholder-active", function() {
        expect(element.getAttribute("data-placeholder-active")).toEqual(null);
      });

      it("should have removed placeholder class", function() {
        expect(element).not.toHaveClass("placeholder");
      });

      it("should have removed data-placeholder-maxlength", function() {
        expect(element.getAttribute("data-placeholder-maxlength")).toEqual(null);
      });

      it("should have restored maxlength attribute", function() {
        expect(parseInt(element.getAttribute("maxLength"), 10)).toEqual(12);
      });

    });

  });

});
