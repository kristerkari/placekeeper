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
        expect(element).toEqual(placekeeper.support.safeActiveElement());
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
        spyOn(placekeeper.polyfill, "removePlaceholder").and.callThrough();
        helpers.setupFakeWindow();
        helpers.triggerFakePageReload();
      });

      afterEach(helpers.restoreRealWindow);

      it("should not have called polyfill's removePlaceholder method", function() {
        expect(placekeeper.polyfill.removePlaceholder).not.toHaveBeenCalled();
        expect(placekeeper.polyfill.removePlaceholder.calls.count()).toEqual(0);
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
        spyOn(placekeeper.polyfill, "removePlaceholder").and.callThrough();
        helpers.setupFakeWindow();
        helpers.triggerFakePageReload();
      });

      afterEach(helpers.restoreRealWindow);

      it("should have called polyfill's removePlaceholder method", function() {
        expect(placekeeper.polyfill.removePlaceholder).toHaveBeenCalledWith(element, false);
        expect(placekeeper.polyfill.removePlaceholder.calls.count()).toEqual(1);
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

      beforeEach(function() {
        spyOn(placekeeper.utils, "removeEventListener");
        placekeeper.disable();
      });

      it("should have called utils.removeEventListener for focus handler", function() {
        expect(placekeeper.utils.removeEventListener)
        .toHaveBeenCalledWith(element, "focus", placekeeper.events.handlers.focus);
      });

      it("should have called utils.removeEventListener for blur handler", function() {
        expect(placekeeper.utils.removeEventListener)
        .toHaveBeenCalledWith(element, "blur", placekeeper.events.handlers.blur);
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
        spyOn(placekeeper.polyfill, "hidePlaceholder");
        helpers.setupFakeWindow();
        helpers.triggerFakePageReload();
      });

      afterEach(helpers.restoreRealWindow);

      it("should not have called polyfill's hidePlaceholder method", function() {
        expect(placekeeper.polyfill.hidePlaceholder).not.toHaveBeenCalled();
        expect(placekeeper.polyfill.hidePlaceholder.calls.count()).toEqual(0);
      });

    });

  });

});
