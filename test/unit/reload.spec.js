import * as helpers from "../utils/helpers.js";
import * as placekeeper from "../../src/main.js";
import * as polyfill from "../../src/polyfill.js";
import * as events from "../../src/events.js";
import * as utils from "../../src/utils.js";
import * as support from "../../src/support.js";

describe("reload", function() {
  "use strict";

  beforeEach(helpers.initialSetup);

  describe("when there is an element with placeholder on the page", function() {
    var element;

    beforeEach(function(done) {
      element = helpers.createInputElement(true);
      placekeeper.priv.__setupPlaceholders();
      setTimeout(done, helpers.loopDurationForTests);
    });

    afterEach(function() {
      element.parentNode.removeChild(element);
    });

    describe("when input has focus", function() {

      beforeEach(function(done) {
        helpers.retryFocus(element, done);
      });

      it("element should be activeElement", function() {
        expect(element).toEqual(support.safeActiveElement());
      });

      describe("and when the page is reloaded", function() {

        beforeEach(function() {
          helpers.setupFakeWindow();
          helpers.triggerFakePageReload();
        });

        afterEach(helpers.restoreRealWindow);

        it("should have removed element's value", function() {
          expect(element.value).toEqual("");
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

    describe("when input value is set and page reloaded", function() {

      beforeEach(function() {
        element.value = "MyVal";
        spyOn(polyfill, "removePlaceholder").and.callThrough();
        helpers.setupFakeWindow();
        helpers.triggerFakePageReload();
      });

      afterEach(helpers.restoreRealWindow);

      it("should not have called polyfill's removePlaceholder method", function() {
        expect(polyfill.removePlaceholder).not.toHaveBeenCalled();
        expect(polyfill.removePlaceholder.calls.count()).toEqual(0);
      });

      it("should not have removed element's value", function() {
        expect(element.value).toEqual("MyVal");
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

    describe("when page is reloaded", function() {

      beforeEach(function() {
        spyOn(polyfill, "removePlaceholder").and.callThrough();
        helpers.setupFakeWindow();
        helpers.triggerFakePageReload();
      });

      afterEach(helpers.restoreRealWindow);

      it("should have called polyfill's removePlaceholder method", function() {
        expect(polyfill.removePlaceholder).toHaveBeenCalledWith(element, false);
        expect(polyfill.removePlaceholder.calls.count()).toEqual(1);
      });

      it("should have removed element's value", function() {
        expect(element.value).toEqual("");
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

    describe("and when disable method is called", function() {
      var focusHandler;
      var blurHandler;

      beforeEach(function() {
        focusHandler = events.handlers.focus;
        blurHandler = events.handlers.blur;
        spyOn(utils, "removeEventListener");
        placekeeper.disable();
      });

      it("should have called utils.removeEventListener for focus handler", function() {
        expect(utils.removeEventListener)
        .toHaveBeenCalledWith(element, "focus", focusHandler);
      });

      it("should have called utils.removeEventListener for blur handler", function() {
        expect(utils.removeEventListener)
        .toHaveBeenCalledWith(element, "blur", blurHandler);
      });

      it("should have deleted the focus handler", function() {
        expect(events.handlers.focus).not.toBeDefined();
      });

      it("should have deleted the blur handler", function() {
        expect(events.handlers.blur).not.toBeDefined();
      });

      it("should not have data-placeholder-has-events attribute", function() {
        expect(element.getAttribute("data-placeholder-has-events")).toEqual(null);
      });

      it("should not have data-placeholder-value attribute", function() {
        expect(element.getAttribute("data-placeholder-value")).toEqual(null);
      });

    });

  });

  describe("when there is an element without placeholder on the page", function() {
    var element;

    beforeEach(function(done) {
      element = helpers.createInputElement(false);
      setTimeout(done, helpers.loopDurationForTests);
    });

    afterEach(function() {
      element.parentNode.removeChild(element);
    });

    describe("when page is reloaded", function() {

      beforeEach(function() {
        spyOn(polyfill, "hidePlaceholder");
        helpers.setupFakeWindow();
        helpers.triggerFakePageReload();
      });

      afterEach(helpers.restoreRealWindow);

      it("should not have called polyfill's hidePlaceholder method", function() {
        expect(polyfill.hidePlaceholder).not.toHaveBeenCalled();
        expect(polyfill.hidePlaceholder.calls.count()).toEqual(0);
      });

    });

  });

});
