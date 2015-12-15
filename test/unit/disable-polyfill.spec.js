import * as helpers from "../utils/helpers.js";
import * as placekeeper from "../../src/main.js";

describe("disabling polyfill", () => {
  "use strict";

  beforeEach(helpers.initialSetup);

  describe("when a password input with placeholder exists on the page", () => {
    var element;

    beforeEach((done) => {
      helpers.spyOnCanChangeToTypeAndReturn(false);
      helpers.spyOnNativeSupportAndReturn(false);
      element = helpers.createInputElement(true, "password");
      setTimeout(() => {
        element = document.getElementById("elem");
        done();
      }, helpers.loopDurationForTests);
      placekeeper.init();
    });

    afterEach(() => {
      element.parentNode.removeChild(element);
    });

    it("should have set data-placeholder-active to true", () => {
      expect(element.getAttribute("data-placeholder-active")).toEqual("true");
    });

    it("should have added placeholder class", () => {
      expect(element).toHaveClass("placeholder");
    });

    it("should have two inputs on the page", () => {
      expect(document.getElementsByTagName("input").length).toEqual(2);
    });

    describe("and when a value is changed", () => {

      beforeEach((done) => {
        element.value = "Changed";
        setTimeout(() => {
          element = document.getElementById("elem");
          done();
        }, helpers.loopDurationForTests);
      });

      describe("and when placeholder attribute is removed from the input", () => {

        beforeEach((done) => {
          element.removeAttribute("placeholder");
          setTimeout(() => {
            element = document.getElementById("elem");
            done();
          }, helpers.loopDurationForTests);
        });

        it("it should not have placeholder attribute set", () => {
          expect(element.getAttribute("placeholder")).not.toEqual("Test");
        });

        it("should have element id set to elem", () => {
          expect(element.id).toEqual("elem");
        });

        it("should show element", () => {
          expect(element.style.display).not.toEqual("none");
        });

        it("should have element type set to password", () => {
          expect(element.type).toEqual("password");
        });

        it("should have removed placeholder class", () => {
          expect(element).not.toHaveClass("placeholder");
        });

        it("should have kept the value", () => {
          expect(element.value).toEqual("Changed");
        });

        it("should have remove all data-attributes from element", () => {
          expect(element).toHaveNoDataAttributes();
        });

        it("should have one input on the page", () => {
          expect(document.getElementsByTagName("input").length).toEqual(1);
        });

      });

    });

    describe("and when placeholder attribute is removed from the input", () => {

      beforeEach((done) => {
        element.removeAttribute("placeholder");
        setTimeout(() => {
          element = document.getElementById("elem");
          done();
        }, helpers.loopDurationForTests);
      });

      it("it should not have placeholder attribute set", () => {
        expect(element.getAttribute("placeholder")).not.toEqual("Test");
      });

      it("should have element id set to elem", () => {
        expect(element.id).toEqual("elem");
      });

      it("should show element", () => {
        expect(element.style.display).not.toEqual("none");
      });

      it("should have element type set to password", () => {
        expect(element.type).toEqual("password");
      });

      it("should have removed placeholder class", () => {
        expect(element).not.toHaveClass("placeholder");
      });

      it("should not have any value", () => {
        expect(element.value).toEqual("");
      });

      it("should have remove all data-attributes from element", () => {
        expect(element).toHaveNoDataAttributes();
      });

      it("should have one input on the page", () => {
        expect(document.getElementsByTagName("input").length).toEqual(1);
      });

    });

  });

  describe("when a text input with placeholder exists on the page", () => {
    var element;

    beforeEach((done) => {
      helpers.spyOnNativeSupportAndReturn(false);
      element = helpers.createInputElement(true);
      setTimeout(done, helpers.loopDurationForTests);
      placekeeper.init();
    });

    afterEach(() => {
      element.parentNode.removeChild(element);
    });

    it("should have watching enabled", () => {
      expect(placekeeper.isWatchingEnabled()).toEqual(true);
    });

    it("should have set data-placeholder-active to true", () => {
      expect(element.getAttribute("data-placeholder-active")).toEqual("true");
    });

    it("should have added placeholder class", () => {
      expect(element).toHaveClass("placeholder");
    });

    it("should have one input on the page", () => {
      expect(document.getElementsByTagName("input").length).toEqual(1);
    });

    describe("and when a value is changed", () => {

      beforeEach((done) => {
        element.value = "Changed";
        setTimeout(done, helpers.loopDurationForTests);
      });

      describe("and when placeholder attribute is removed from the input", () => {

        beforeEach((done) => {
          element.removeAttribute("placeholder");
          setTimeout(done, helpers.loopDurationForTests);
        });

        it("should have removed placeholder class", () => {
          expect(element).not.toHaveClass("placeholder");
        });

        it("should have kept the value", () => {
          expect(element.value).toEqual("Changed");
        });

        it("should have remove all data-attributes from element", () => {
          expect(element).toHaveNoDataAttributes();
        });

      });

    });

    describe("and when placeholder attribute is removed from the input", () => {

      beforeEach((done) => {
        element.removeAttribute("placeholder");
        setTimeout(done, helpers.loopDurationForTests);
      });

      it("should have removed placeholder class", () => {
        expect(element).not.toHaveClass("placeholder");
      });

      it("should not have any value", () => {
        expect(element.value).toEqual("");
      });

      it("should have remove all data-attributes from element", () => {
        expect(element).toHaveNoDataAttributes();
      });

    });

  });

  describe("when a textarea with placeholder exists on the page", () => {
    var element;

    beforeEach((done) => {
      helpers.spyOnNativeSupportAndReturn(false);
      element = helpers.createTextareaElement(true);
      setTimeout(done, helpers.loopDurationForTests);
      placekeeper.init();
    });

    afterEach(() => {
      element.parentNode.removeChild(element);
    });

    it("should have watching enabled", () => {
      expect(placekeeper.isWatchingEnabled()).toEqual(true);
    });

    it("should have set data-placeholder-active to true", () => {
      expect(element.getAttribute("data-placeholder-active")).toEqual("true");
    });

    it("should have added placeholder class", () => {
      expect(element).toHaveClass("placeholder");
    });

    it("should have one textarea on the page", () => {
      expect(document.getElementsByTagName("textarea").length).toEqual(1);
    });

    describe("and when a value is changed", () => {

      beforeEach((done) => {
        element.value = "Changed";
        setTimeout(done, helpers.loopDurationForTests);
      });

      describe("and when placeholder attribute is removed from the input", () => {

        beforeEach((done) => {
          element.removeAttribute("placeholder");
          setTimeout(done, helpers.loopDurationForTests);
        });

        it("should have removed placeholder class", () => {
          expect(element).not.toHaveClass("placeholder");
        });

        it("should have kept the value", () => {
          expect(element.value).toEqual("Changed");
        });

        it("should have remove all data-attributes from element", () => {
          expect(element).toHaveNoDataAttributes();
        });

      });

    });

    describe("and when placeholder attribute is removed from the input", () => {

      beforeEach((done) => {
        element.removeAttribute("placeholder");
        setTimeout(done, helpers.loopDurationForTests);
      });

      it("should have removed placeholder class", () => {
        expect(element).not.toHaveClass("placeholder");
      });

      it("should not have any value", () => {
        expect(element.value).toEqual("");
      });

      it("should have remove all data-attributes from element", () => {
        expect(element).toHaveNoDataAttributes();
      });

    });

  });

});
