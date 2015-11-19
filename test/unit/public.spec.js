import * as helpers from "../utils/helpers.js";
import * as placekeeper from "../../src/main.js";
import * as utils from "../../src/utils.js";
import * as events from "../../src/events.js";
import * as support from "../../src/support.js";

describe("public methods", () => {
  "use strict";

  beforeEach(helpers.initialSetup);

  describe("disable method", () => {

    describe("when there is a password input on the page and input type can not be changed", () => {
      var element;
      var clone;

      beforeEach((done) => {
        helpers.spyOnCanChangeToTypeAndReturn(false);
        element = helpers.createInputElement(true, "password");
        placekeeper.setupPlaceholders();
        setTimeout(() => {
          clone = document.getElementById("elem");
          done();
        }, helpers.loopDurationForTests);
      });

      afterEach(() => {
        element.parentNode.removeChild(element);
      });

      it("should have two inputs on the page", () => {
        expect(document.getElementsByTagName("input").length).toEqual(2);
      });

      describe("and when disable is called", () => {
        var focusHandler;
        var blurHandler;

        beforeEach((done) => {
          focusHandler = events.handlers.focus;
          blurHandler = events.handlers.blur;
          spyOn(utils, "removeEventListener");
          placekeeper.disable();
          setTimeout(() => {
            element = document.getElementById("elem");
            done();
          }, helpers.loopDurationForTests);
        });

        it("should have one input on the page", () => {
          expect(document.getElementsByTagName("input").length).toEqual(1);
        });

        it("should have changed element type back to password", () => {
          expect(element.getAttribute("type")).toEqual("password");
        });

        it("should have elem id back to element", () => {
          expect(element.id).toEqual("elem");
        });

        it("should not have element display attribute set to anything", () => {
          expect(element.style.display).toEqual("");
        });

        it("should have remove all data-attributes from element", () => {
          expect(element).toHaveNoDataAttributes();
        });

        // In IE7 element is `null`
        // for some reason.
        // TODO: find out why
        if (clone != null) {
          it("should have called utils.removeEventListener for focus handler", () => {
            expect(utils.removeEventListener)
            .toHaveBeenCalledWith(clone, "focus", focusHandler);
          });

          it("should have deleted the focus handler", () => {
            expect(events.handlers.focus).not.toBeDefined();
          });

        }

        // In IE7 element is `null`
        // for some reason.
        // TODO: find out why
        if (element != null) {
          it("should have called utils.removeEventListener for blur handler", () => {
            expect(utils.removeEventListener)
            .toHaveBeenCalledWith(element, "blur", blurHandler);
          });

          it("should have deleted the blur handler", () => {
            expect(events.handlers.blur).not.toBeDefined();
          });

        }

      });

    });

    describe("when there is a password input on the page and input type can be changed", () => {
      var element;

      if (helpers.canActuallyChangeType) {

        beforeEach((done) => {
          helpers.spyOnCanChangeToTypeAndReturn(true);
          element = helpers.createInputElement(true, "password");
          placekeeper.setupPlaceholders();
          setTimeout(done, helpers.loopDurationForTests);
        });

        afterEach(() => {
          element.parentNode.removeChild(element);
        });

        it("should have one on the page", () => {
          expect(document.getElementsByTagName("input").length).toEqual(1);
        });

        describe("and when disable is called", () => {
          var focusHandler;
          var blurHandler;

          beforeEach(() => {
            focusHandler = events.handlers.focus;
            blurHandler = events.handlers.blur;
            spyOn(utils, "removeEventListener");
            placekeeper.disable();
          });

          it("should have remove all data-attributes from element", () => {
            expect(element).toHaveNoDataAttributes();
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

        });
      }
    });

  });

  describe("enable public method", () => {

    afterEach(() => {
      placekeeper.disable();
    });

    it("should be a function", () => {
      expect(typeof placekeeper.enable).toEqual("function");
    });

    describe("when called and there are no inputs or textareas on the page", () => {

      beforeEach(() => {
        helpers.spyOnNativeSupportAndReturn(false);
        placekeeper.enable();
      });

      it("should have called hasNativePlaceholderSupport method", () => {
        expect(support.hasNativePlaceholderSupport).toHaveBeenCalled();
      });

      it("should have placekeeper disabled", () => {
        expect(placekeeper.isEnabled()).toEqual(false);
      });

    });

    describe("when called and there is one input with placeholder attribute", () => {
      var element;

      beforeEach(() => {
        element = helpers.createInputElement(true);
        helpers.spyOnNativeSupportAndReturn(false);
        placekeeper.enable();
      });

      afterEach(() => {
        element.parentNode.removeChild(element);
      });

      it("should have called hasNativePlaceholderSupport method", () => {
        expect(support.hasNativePlaceholderSupport).toHaveBeenCalled();
      });

      it("should have placekeeper enabled", () => {
        expect(placekeeper.isEnabled()).toEqual(true);
      });

      describe("when placekeeper is disabled", () => {

        beforeEach(() => {
          placekeeper.disable();
        });

        it("should have placekeeper disabled", () => {
          expect(placekeeper.isEnabled()).toEqual(false);
        });

      });

    });

  });

  describe("isEnabled public method", () => {

    afterEach(() => {
      placekeeper.disable();
    });

    it("should be a function", () => {
      expect(typeof placekeeper.isEnabled).toEqual("function");
    });

    describe("when there are no inputs or textareas on the page", () => {

      it("should not have any inputs on the page", () => {
        expect(document.getElementsByTagName("input").length).toEqual(0);
      });

      it("should not have any textareas on the page", () => {
        expect(document.getElementsByTagName("textarea").length).toEqual(0);
      });

      describe("when HTML5 placeholder is supported for both inputs and textareas", () => {

        beforeEach(() => {
          helpers.spyOnNativeSupportAndReturn(true);
          placekeeper.enable();
        });

        it("should have placekeeper disabled because of native support", () => {
          expect(placekeeper.isEnabled()).toEqual(false);
        });

        describe("and when a text input element with placeholder attribute is inserted to the page", () => {
          var element;

          beforeEach((done) => {
            element = helpers.createInputElement(true);
            setTimeout(done, helpers.loopDurationForTests);
          });

          afterEach(() => {
            element.parentNode.removeChild(element);
          });

          it("should have one input on the page", () => {
            expect(document.getElementsByTagName("input").length).toEqual(1);
          });

          it("should have placekeeper disabled because of native support", () => {
            expect(placekeeper.isEnabled()).toEqual(false);
          });

        });

      });

      describe("when HTML5 placeholder is not supported for both inputs and textareas", () => {

        beforeEach(() => {
          helpers.spyOnNativeSupportAndReturn(false);
          placekeeper.enable();
        });

        it("should have placekeeper disabled since there are no inputs or textareas", () => {
          expect(placekeeper.isEnabled()).toEqual(false);
        });

        describe("and when a text input element without placeholder attribute is inserted to the page", () => {
          var element;

          beforeEach((done) => {
            element = helpers.createInputElement(false);
            setTimeout(done, helpers.loopDurationForTests);
          });

          afterEach(() => {
            element.parentNode.removeChild(element);
          });

          it("should have one input on the page", () => {
            expect(document.getElementsByTagName("input").length).toEqual(1);
          });

          it("should have placekeeper disabled since there is no placeholder attribute on the input", () => {
            expect(placekeeper.isEnabled()).toEqual(false);
          });

        });

        describe("and when a text input element with placeholder attribute is inserted to the page", () => {
          var element;

          beforeEach((done) => {
            element = helpers.createInputElement(true);
            setTimeout(done, helpers.loopDurationForTests);
          });

          afterEach(() => {
            element.parentNode.removeChild(element);
          });

          it("should have one input on the page", () => {
            expect(document.getElementsByTagName("input").length).toEqual(1);
          });

          it("should have placekeeper enabled", () => {
            expect(placekeeper.isEnabled()).toEqual(true);
          });

        });

        describe("and when a textarea element with placeholder attribute is inserted to the page", () => {
          var element;

          beforeEach((done) => {
            element = helpers.createTextareaElement(true);
            setTimeout(done, helpers.loopDurationForTests);
          });

          afterEach(() => {
            element.parentNode.removeChild(element);
          });

          it("should have one textarea on the page", () => {
            expect(document.getElementsByTagName("textarea").length).toEqual(1);
          });

          it("should have 0 inputs on the page", () => {
            expect(document.getElementsByTagName("input").length).toEqual(0);
          });

          it("should have placekeeper enabled", () => {
            expect(placekeeper.isEnabled()).toEqual(true);
          });

        });

      });

    });

  });

});
