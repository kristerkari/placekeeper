import * as helpers from "../utils/helpers.js";
import * as placekeeper from "../../src/main.js";
import * as polyfill from "../../src/polyfill.js";
import * as utils from "../../src/utils.js";

describe("focusing and blurring an element with placeholder", () => {
  "use strict";

  beforeEach(helpers.initialSetup);

  describe("when there is an input that is already focused", () => {
    var element;

    beforeEach((done) => {
      spyOn(polyfill, "showPlaceholder").and.callThrough();
      element = helpers.createInputElement(true);
      helpers.retryFocus(element, () => {
        setTimeout(done, helpers.loopDurationForTests);
        placekeeper.setupPlaceholders();
      });
    });

    afterEach(() => {
      element.parentNode.removeChild(element);
    });

    it("should not have called polyfill's showPlaceholder method", () => {
      expect(polyfill.showPlaceholder).not.toHaveBeenCalled();
      expect(polyfill.showPlaceholder.calls.count()).toEqual(0);
    });

  });

  describe("when there is an input with placeholder value set", () => {
    var element;

    beforeEach((done) => {
      spyOn(polyfill, "showPlaceholder").and.callThrough();
      element = helpers.createInputElement(true);
      setTimeout(done, helpers.loopDurationForTests);
      placekeeper.setupPlaceholders();
    });

    afterEach(() => {
      element.parentNode.removeChild(element);
    });

    it("should have added data-placeholder-events attribute to the element", () => {
      expect(element.getAttribute("data-placeholder-has-events")).toEqual("true");
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

    it("should have called polyfill's showPlaceholder method", () => {
      expect(polyfill.showPlaceholder).toHaveBeenCalledWith(element);
      expect(polyfill.showPlaceholder.calls.count()).toEqual(1);
    });

    it("should have set data-placeholder-maxlength to 12", () => {
      expect(parseInt(element.getAttribute("data-placeholder-maxlength"), 10)).toEqual(12);
    });

    it("should have removed maxlength attribute", () => {
      expect(element.getAttribute("maxLength")).toEqualNullOr2147483647();
    });

    describe("and when element is focused", () => {

      beforeEach(() => {
        spyOn(utils, "moveCaret");
        spyOn(polyfill, "hidePlaceholder").and.callThrough();
        helpers.focus(element);
      });

      it("should have called polyfill's hidePlaceholder method", () => {
        expect(polyfill.hidePlaceholder).toHaveBeenCalledWith(element);
        expect(polyfill.hidePlaceholder.calls.count()).toEqual(1);
      });

      it("should have remove element's value", () => {
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

      it("should have moved the caret to the beginning of the text field", () => {
        expect(utils.moveCaret).toHaveBeenCalledWith(element, 0);
      });

      describe("and when a value is given to the element", () => {

        beforeEach(() => {
          element.value = "MyValue";
        });

        describe("and when element is blurred after that", () => {

          beforeEach(() => {
            helpers.blur(element);
          });

          it("should have called polyfill's showPlaceholder method", () => {
            expect(polyfill.showPlaceholder).toHaveBeenCalledWith(element);
            expect(polyfill.showPlaceholder.calls.count()).toEqual(2);
          });

          it("should have set element's value to Test", () => {
            expect(element.value).toEqual("MyValue");
          });

          it("should have set data-placeholder-active to true", () => {
            expect(element.getAttribute("data-placeholder-active")).toEqual(null);
          });

          it("should have removed placeholder class", () => {
            expect(element).not.toHaveClass("placeholder");
          });

        });

      });

      describe("and when element is blurred after that", () => {

        beforeEach(() => {
          helpers.blur(element);
        });

        it("should have called polyfill's showPlaceholder method", () => {
          expect(polyfill.showPlaceholder).toHaveBeenCalledWith(element);
          expect(polyfill.showPlaceholder.calls.count()).toEqual(2);
        });

        it("should have set element's value to Test", () => {
          expect(element.value).toEqual("Test");
        });

        it("should have set data-placeholder-active to true", () => {
          expect(element.getAttribute("data-placeholder-active")).toEqual("true");
        });

        it("should have added placeholder class", () => {
          expect(element).toHaveClass("placeholder");
        });

      });

    });

  });

});
