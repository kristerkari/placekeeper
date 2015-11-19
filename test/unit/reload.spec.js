import * as helpers from "../utils/helpers.js";
import * as placekeeper from "../../src/main.js";
import * as polyfill from "../../src/polyfill.js";
import * as events from "../../src/events.js";
import * as utils from "../../src/utils.js";
import * as support from "../../src/support.js";

describe("reload", () => {
  "use strict";

  beforeEach(helpers.initialSetup);

  describe("when there is an element with placeholder on the page", () => {
    var element;

    beforeEach((done) => {
      element = helpers.createInputElement(true);
      placekeeper.setupPlaceholders();
      setTimeout(done, helpers.loopDurationForTests);
    });

    afterEach(() => {
      element.parentNode.removeChild(element);
    });

    describe("when input has focus", () => {

      beforeEach((done) => {
        helpers.retryFocus(element, done);
      });

      it("element should be activeElement", () => {
        expect(element).toEqual(support.safeActiveElement());
      });

      describe("and when the page is reloaded", () => {

        beforeEach(() => {
          helpers.setupFakeWindow();
          helpers.triggerFakePageReload();
        });

        afterEach(helpers.restoreRealWindow);

        it("should have removed element's value", () => {
          expect(element.value).toEqual("");
        });

        it("should have removed data-placeholder-active", () => {
          expect(element.getAttribute("data-placeholder-active")).toEqual(null);
        });

        it("should have removed placeholder class", () => {
          expect(element).not.toHaveClass("placeholder");
        });

        it("should have removed data-placeholder-maxlength", () => {
          expect(element.getAttribute("data-placeholder-maxlength")).toEqual(null);
        });

        it("should have restored maxlength attribute", () => {
          expect(parseInt(element.getAttribute("maxLength"), 10)).toEqual(12);
        });

      });

    });

    describe("when input value is set and page reloaded", () => {

      beforeEach(() => {
        element.value = "MyVal";
        spyOn(polyfill, "removePlaceholder").and.callThrough();
        helpers.setupFakeWindow();
        helpers.triggerFakePageReload();
      });

      afterEach(helpers.restoreRealWindow);

      it("should not have called polyfill's removePlaceholder method", () => {
        expect(polyfill.removePlaceholder).not.toHaveBeenCalled();
        expect(polyfill.removePlaceholder.calls.count()).toEqual(0);
      });

      it("should not have removed element's value", () => {
        expect(element.value).toEqual("MyVal");
      });

      it("should have removed data-placeholder-active", () => {
        expect(element.getAttribute("data-placeholder-active")).toEqual(null);
      });

      it("should have removed placeholder class", () => {
        expect(element).not.toHaveClass("placeholder");
      });

      it("should have removed data-placeholder-maxlength", () => {
        expect(element.getAttribute("data-placeholder-maxlength")).toEqual(null);
      });

      it("should have restored maxlength attribute", () => {
        expect(parseInt(element.getAttribute("maxLength"), 10)).toEqual(12);
      });

    });

    describe("when page is reloaded", () => {

      beforeEach(() => {
        spyOn(polyfill, "removePlaceholder").and.callThrough();
        helpers.setupFakeWindow();
        helpers.triggerFakePageReload();
      });

      afterEach(helpers.restoreRealWindow);

      it("should have called polyfill's removePlaceholder method", () => {
        expect(polyfill.removePlaceholder).toHaveBeenCalledWith(element, false);
        expect(polyfill.removePlaceholder.calls.count()).toEqual(1);
      });

      it("should have removed element's value", () => {
        expect(element.value).toEqual("");
      });

      it("should have removed data-placeholder-active", () => {
        expect(element.getAttribute("data-placeholder-active")).toEqual(null);
      });

      it("should have removed placeholder class", () => {
        expect(element).not.toHaveClass("placeholder");
      });

      it("should have removed data-placeholder-maxlength", () => {
        expect(element.getAttribute("data-placeholder-maxlength")).toEqual(null);
      });

      it("should have restored maxlength attribute", () => {
        expect(parseInt(element.getAttribute("maxLength"), 10)).toEqual(12);
      });

    });

    describe("and when disable method is called", () => {
      var focusHandler;
      var blurHandler;

      beforeEach(() => {
        focusHandler = events.handlers.focus;
        blurHandler = events.handlers.blur;
        spyOn(utils, "removeEventListener");
        placekeeper.disable();
      });

      it("should have called utils.removeEventListener for focus handler", () => {
        expect(utils.removeEventListener)
        .toHaveBeenCalledWith(element, "focus", focusHandler);
      });

      it("should have called utils.removeEventListener for blur handler", () => {
        expect(utils.removeEventListener)
        .toHaveBeenCalledWith(element, "blur", blurHandler);
      });

      it("should have deleted the focus handler", () => {
        expect(events.handlers.focus).not.toBeDefined();
      });

      it("should have deleted the blur handler", () => {
        expect(events.handlers.blur).not.toBeDefined();
      });

      it("should not have data-placeholder-has-events attribute", () => {
        expect(element.getAttribute("data-placeholder-has-events")).toEqual(null);
      });

      it("should not have data-placeholder-value attribute", () => {
        expect(element.getAttribute("data-placeholder-value")).toEqual(null);
      });

    });

  });

  describe("when there is an element without placeholder on the page", () => {
    var element;

    beforeEach((done) => {
      element = helpers.createInputElement(false);
      setTimeout(done, helpers.loopDurationForTests);
    });

    afterEach(() => {
      element.parentNode.removeChild(element);
    });

    describe("when page is reloaded", () => {

      beforeEach(() => {
        spyOn(polyfill, "hidePlaceholder");
        helpers.setupFakeWindow();
        helpers.triggerFakePageReload();
      });

      afterEach(helpers.restoreRealWindow);

      it("should not have called polyfill's hidePlaceholder method", () => {
        expect(polyfill.hidePlaceholder).not.toHaveBeenCalled();
        expect(polyfill.hidePlaceholder.calls.count()).toEqual(0);
      });

    });

  });

});
