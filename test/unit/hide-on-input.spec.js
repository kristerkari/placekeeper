import * as helpers from "../utils/helpers.js";
import * as placekeeper from "../../src/main.js";
import * as polyfill from "../../src/polyfill.js";
import * as utils from "../../src/utils.js";
import * as events from "../../src/events.js";
import * as mode from "../../src/mode.js";
import * as support from "../../src/support.js";

describe("hide on input mode", () => {
  "use strict";

  beforeEach(helpers.initialSetup);

  describe("hide on input mode", () => {

    describe("when there is a password input on the page and input type can not be changed", () => {
      var element;
      var clone;

      beforeEach((done) => {
        helpers.spyOnFocusEnabledAndReturn(false);
        helpers.spyOnCanChangeToTypeAndReturn(false);
        element = helpers.createInputElement(true, "password");
        setTimeout(() => {
          clone = document.getElementById("elem");
          done();
        }, helpers.loopDurationForTests);
        placekeeper.setupPlaceholders();
      });

      afterEach(() => {
        element.parentNode.removeChild(element);
      });

      describe("and when input is focused", () => {

        beforeEach((done) => {
          spyOn(polyfill, "hidePlaceholder").and.callThrough();
          spyOn(polyfill, "showPlaceholder").and.callThrough();
          helpers.retryFocus(clone, () => {
            setTimeout(() => {
              element = document.getElementById("elem");
              done();
            }, helpers.loopDurationForTests);
          });
        });

        describe("and when user writes letter 'a' (keydown, value, keyup)", () => {

          beforeEach((done) => {
            triggerEvent.keyboard(element, "keydown", 65);
            element.value = "a";
            triggerEvent.keyboard(element, "keyup", 65);
            setTimeout(() => {
              element = document.getElementById("elem");
              done();
            }, helpers.loopDurationForTests);
          });

          it("should have element value as 'a'", () => {
            expect(element.value).toEqual("a");
          });

          it("should have clone value empty", () => {
            expect(clone.value).toEqual("");
          });

          it("should have removed data-placeholder-active", () => {
            expect(element.getAttribute("data-placeholder-active")).toEqual(null);
          });

          it("should have removed placeholder class", () => {
            expect(element).not.toHaveClass("placeholder");
          });

          it("should have called polyfill's hidePlaceholder method once", () => {
            expect(polyfill.hidePlaceholder).toHaveBeenCalledWith(clone);
            expect(polyfill.hidePlaceholder.calls.count()).toEqual(1);
          });

          it("should not have called polyfill's showPlaceholder method", () => {
            expect(polyfill.showPlaceholder).not.toHaveBeenCalled();
            expect(polyfill.showPlaceholder.calls.count()).toEqual(0);
          });

        });

      });

    });

    describe("when data-placeholder-focus is set to false and there is an input on the page", () => {
      var element;

      beforeEach(() => {
        spyOn(utils, "addEventListener").and.callThrough();
        helpers.spyOnFocusEnabledAndReturn(false);
        element = helpers.createInputElement(true);
        placekeeper.setupPlaceholders();
        mode.enableWatching();
      });

      afterEach(() => {
        element.parentNode.removeChild(element);
      });

      it("should have watching enabled", () => {
        expect(placekeeper.isWatchingEnabled()).toEqual(true);
      });

      it("should have called utils.addEventListener for keydown handler", () => {
        expect(utils.addEventListener)
        .toHaveBeenCalledWith(element, "keydown", events.handlers.keydown);
      });

      it("should have called utils.addEventListener for keyup handler", () => {
        expect(utils.addEventListener)
        .toHaveBeenCalledWith(element, "keyup", events.handlers.keyup);
      });

      it("should have called utils.addEventListener for click handler", () => {
        expect(utils.addEventListener)
        .toHaveBeenCalledWith(element, "click", events.handlers.click);
      });

      it("should have set element's value to placeholder value (Test)", () => {
        expect(element.value).toEqual("Test");
      });

      it("should have set data-placeholder-active to true", () => {
        expect(element.getAttribute("data-placeholder-active")).toEqual("true");
      });

      it("should have added placeholder class", () => {
        expect(element).toHaveClass("placeholder");
      });

      describe("and when disable is called", () => {
        var keyupHandler;
        var keydownHandler;
        var clickHandler;

        beforeEach(() => {
          keyupHandler = events.handlers.keyup;
          keydownHandler = events.handlers.keydown;
          clickHandler = events.handlers.click;
          spyOn(utils, "removeEventListener").and.callThrough();
          placekeeper.disable();
        });

        it("should have called utils.removeEventListener for keydown handler", () => {
          expect(utils.removeEventListener)
          .toHaveBeenCalledWith(element, "keydown", keydownHandler);
        });

        it("should have called utils.removeEventListener for keyup handler", () => {
          expect(utils.removeEventListener)
          .toHaveBeenCalledWith(element, "keyup", keyupHandler);
        });

        it("should have called utils.removeEventListener for click handler", () => {
          expect(utils.removeEventListener)
          .toHaveBeenCalledWith(element, "click", clickHandler);
        });

        it("should have deleted the keyup handler", () => {
          expect(events.handlers.keyup).not.toBeDefined();
        });

        it("should have deleted the keydown handler", () => {
          expect(events.handlers.keydown).not.toBeDefined();
        });

        it("should have deleted the click handler", () => {
          expect(events.handlers.click).not.toBeDefined();
        });

      });

      describe("and when a click event is triggered on the element", () => {

        beforeEach(() => {
          spyOn(utils, "moveCaret");
          triggerEvent.html(element, "click");
        });

        it("should not have called moveCaret method", () => {
          expect(utils.moveCaret).not.toHaveBeenCalled();
          expect(utils.moveCaret.calls.count()).toEqual(0);
        });

      });

      describe("and when click event is triggered after element is focused", () => {

        beforeEach(() => {
          triggerEvent.html(element, "focus");
          element.focus();
          spyOn(utils, "moveCaret");
          triggerEvent.html(element, "click");
        });

        it("element should be activeElement", () => {
          expect(element).toEqual(support.safeActiveElement());
        });

        it("should have called moveCaret method", () => {
          expect(utils.moveCaret).toHaveBeenCalledWith(element, 0);
          expect(utils.moveCaret.calls.count()).toEqual(1);
        });

      });

      describe("and when input is focused", () => {

        beforeEach(() => {
          spyOn(utils, "moveCaret").and.callThrough();
          spyOn(polyfill, "hidePlaceholder").and.callThrough();
          triggerEvent.html(element, "focus");
          element.focus();
        });

        it("element should be activeElement", () => {
          expect(element).toEqual(support.safeActiveElement());
        });

        it("should not have called polyfill's hidePlaceholder method", () => {
          expect(polyfill.hidePlaceholder).not.toHaveBeenCalled();
          expect(polyfill.hidePlaceholder.calls.count()).toEqual(0);
        });

        it("should have moved caret to the beginning", () => {
          expect(utils.moveCaret).toHaveBeenCalledWith(element, 0);
        });

        it("should not have emptied the placeholder value", () => {
          expect(element.value).toEqual("Test");
        });

        it("should have set data-placeholder-active to true", () => {
          expect(element.getAttribute("data-placeholder-active")).toEqual("true");
        });

        it("should have added placeholder class", () => {
          expect(element).toHaveClass("placeholder");
        });

        describe("when enter is pressed and value does not change (keydown, keyup)", () => {

          beforeEach(() => {
            triggerEvent.keyboard(element, "keydown", 13);
            triggerEvent.keyboard(element, "keyup", 13);
          });

          it("should not have called polyfill's hidePlaceholder method", () => {
            expect(polyfill.hidePlaceholder).not.toHaveBeenCalled();
            expect(polyfill.hidePlaceholder.calls.count()).toEqual(0);
          });

          it("should not have emptied the placeholder value", () => {
            expect(element.value).toEqual("Test");
          });

          it("should have set data-placeholder-active to true", () => {
            expect(element.getAttribute("data-placeholder-active")).toEqual("true");
          });

          it("should have added placeholder class", () => {
            expect(element).toHaveClass("placeholder");
          });

        });

        describe("and when user writes letter 'a' (keydown, value, keyup)", () => {

          beforeEach(() => {
            triggerEvent.keyboard(element, "keydown", 65);
            element.value = "a";
            triggerEvent.keyboard(element, "keyup", 65);
          });

          it("should have called polyfill's hidePlaceholder method", () => {
            expect(polyfill.hidePlaceholder).toHaveBeenCalledWith(element);
            expect(polyfill.hidePlaceholder.calls.count()).toEqual(1);
          });

          it("should have element value as 'a'", () => {
            expect(element.value).toEqual("a");
          });

          it("should have removed data-placeholder-active", () => {
            expect(element.getAttribute("data-placeholder-active")).toEqual(null);
          });

          it("should have removed placeholder class", () => {
            expect(element).not.toHaveClass("placeholder");
          });

        });

        describe("and when user presses backspace on the input (keyup, keydown)", () => {

          beforeEach(() => {
            spyOn(utils, "preventDefault");
            triggerEvent.keyboard(element, "keydown", 8);
            triggerEvent.keyboard(element, "keyup", 8);
          });

          it("should have called utils.preventDefault method", () => {
            expect(utils.preventDefault).toHaveBeenCalled();
            expect(utils.preventDefault.calls.count()).toEqual(1);
          });

          it("should not have called polyfill's hidePlaceholder method", () => {
            expect(polyfill.hidePlaceholder).not.toHaveBeenCalled();
            expect(polyfill.hidePlaceholder.calls.count()).toEqual(0);
          });

        });

      });

      describe("and when disable is called", () => {
        var keyupHandler;
        var keydownHandler;
        var clickHandler;

        beforeEach(() => {
          keyupHandler = events.handlers.keyup;
          keydownHandler = events.handlers.keydown;
          clickHandler = events.handlers.click;
          spyOn(utils, "removeEventListener").and.callThrough();
          placekeeper.disable();
        });

        it("should have remove all data-attributes from element", () => {
          expect(element).toHaveNoDataAttributes();
        });

        it("should have called utils.removeEventListener for keydown handler", () => {
          expect(utils.removeEventListener)
          .toHaveBeenCalledWith(element, "keydown", keydownHandler);
        });

        it("should have called utils.removeEventListener for keyup handler", () => {
          expect(utils.removeEventListener)
          .toHaveBeenCalledWith(element, "keyup", keyupHandler);
        });

        it("should have called utils.removeEventListener for click handler", () => {
          expect(utils.removeEventListener)
          .toHaveBeenCalledWith(element, "click", clickHandler);
        });

        it("should have deleted the keyup handler", () => {
          expect(events.handlers.keyup).not.toBeDefined();
        });

        it("should have deleted the keydown handler", () => {
          expect(events.handlers.keydown).not.toBeDefined();
        });

        it("should have deleted the click handler", () => {
          expect(events.handlers.click).not.toBeDefined();
        });

      });

    });

  });

});
