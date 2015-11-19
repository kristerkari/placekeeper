import * as helpers from "../utils/helpers.js";
import * as placekeeper from "../../src/main.js";
import * as polyfill from "../../src/polyfill.js";

describe("private methods", () => {
  "use strict";

  beforeEach(helpers.initialSetup);

  describe("storeMaxlength", () => {

    describe("when called with an element that has maxLength attribute set", () => {
      var element;

      beforeEach((done) => {
        element = helpers.createInputElementWithMaxLength(10);
        polyfill.storeMaxlength(element);
        setTimeout(done, helpers.loopDurationForTests);
      });

      afterEach(() => {
        element.parentNode.removeChild(element);
      });

      it("should have added data-placeholder-maxlength attribute to the element", () => {
        expect(parseInt(element.getAttribute("data-placeholder-maxlength"), 10)).toEqual(10);
      });

      it("should have removed maxLength attribute", () => {
        expect(element.getAttribute("maxlength")).toEqualNullOr2147483647();
      });

    });

    describe("when called with an element that does not have maxLength attribute set", () => {
      var element;

      beforeEach((done) => {
        element = helpers.createInputElementWithMaxLength();
        polyfill.storeMaxlength(element);
        setTimeout(done, helpers.loopDurationForTests);
      });

      afterEach(() => {
        element.parentNode.removeChild(element);
      });

      it("should not have added data-placeholder-maxlength attribute to the element", () => {
        expect(element.getAttribute("data-placeholder-maxlength")).toEqual(null);
      });

    });

  });

  describe("restoreMaxlength", () => {

    describe("when called with an element that has maxLength data attribute set", () => {
      var element;

      beforeEach((done) => {
        element = helpers.createInputElementWithMaxLength(false, 10);
        polyfill.restoreMaxlength(element);
        setTimeout(done, helpers.loopDurationForTests);
      });

      afterEach(() => {
        element.parentNode.removeChild(element);
      });

      it("should not have added data-placeholder-maxlength attribute to the element", () => {
        expect(element.getAttribute("data-placeholder-maxlength")).toEqual(null);
      });

      it("should have added maxLength attribute back", () => {
        expect(parseInt(element.getAttribute("maxlength"), 10)).toEqual(10);
      });

    });

    describe("when called with an element that does not have maxLength data attribute set", () => {
      var element;

      beforeEach((done) => {
        element = helpers.createInputElementWithMaxLength();
        polyfill.restoreMaxlength(element);
        setTimeout(done, helpers.loopDurationForTests);
      });

      afterEach(() => {
        element.parentNode.removeChild(element);
      });

      it("should not have added data-placeholder-maxlength attribute to the element", () => {
        expect(element.getAttribute("data-placeholder-maxlength")).toEqual(null);
      });

      it("should not have added maxLength attribute", () => {
        expect(element.getAttribute("maxlength")).toEqualNullOr2147483647();
      });

    });

  });

  describe("setupPlaceholders", () => {

    describe("when there is a text input without a placeholder value set", () => {
      var element;

      beforeEach((done) => {
        element = helpers.createInputElement(false);
        setTimeout(done, helpers.loopDurationForTests);
      });

      afterEach(() => {
        element.parentNode.removeChild(element);
      });

      describe("and when called", () => {

        beforeEach(() => {
          placekeeper.setupPlaceholders();
        });

        it("should have one input in DOM", () => {
          expect(document.getElementsByTagName("input").length).toEqual(1);
        });

        it("should not have added data-placeholder-value to the element", () => {
          expect(element.getAttribute("data-placeholder-value")).toEqual(null);
        });

      });

    });

    describe("when there is a text input with a placeholder value set", () => {
      var element;

      beforeEach((done) => {
        element = helpers.createInputElement(true);
        setTimeout(done, helpers.loopDurationForTests);
      });

      afterEach(() => {
        element.parentNode.removeChild(element);
      });

      describe("and when called", () => {

        beforeEach(() => {
          placekeeper.setupPlaceholders();
        });

        it("should have one input in DOM", () => {
          expect(document.getElementsByTagName("input").length).toEqual(1);
        });

        it("should have added data-placeholder-value to the element", () => {
          expect(element.getAttribute("data-placeholder-value")).toEqual("Test");
        });

      });

    });

    describe("when there is a date input with a placeholder value set", () => {
      var element;

      beforeEach((done) => {
        element = helpers.createInputElement(true, "date");
        setTimeout(done, helpers.loopDurationForTests);
      });

      afterEach(() => {
        element.parentNode.removeChild(element);
      });

      describe("and when called", () => {

        beforeEach(() => {
          placekeeper.setupPlaceholders();
        });

        it("should not have added data-placeholder-value to the element", () => {
          expect(element.getAttribute("data-placeholder-value")).not.toEqual("Test");
        });

      });

    });

  });

  describe("hasElementsThatNeedPlaceholder", () => {

    it("should return false when called without parameters", () => {
      expect(placekeeper.hasElementsThatNeedPlaceholder()).toEqual(false);
    });

    it("should return false when called with null", () => {
      expect(placekeeper.hasElementsThatNeedPlaceholder(null)).toEqual(false);
    });

    describe("when called and there is an element that has placeholder attribute set but the type is not supported", () => {
      var element;
      var elements;

      beforeEach(() => {
        element = helpers.createInputElement(true, "range");
        elements = document.getElementsByTagName("input");
      });

      afterEach(() => {
        element.parentNode.removeChild(element);
      });

      it("should return false", () => {
        expect(placekeeper.hasElementsThatNeedPlaceholder(elements)).toEqual(false);
      });

    });

    describe("when called and there is an element that has placeholder attribute set", () => {
      var element;
      var elements;

      beforeEach(() => {
        element = helpers.createInputElement(true);
        elements = document.getElementsByTagName("input");
      });

      afterEach(() => {
        element.parentNode.removeChild(element);
      });

      it("should return true", () => {
        expect(placekeeper.hasElementsThatNeedPlaceholder(elements)).toEqual(true);
      });

    });

    describe("when called and there is an element that does not have placeholder attribute set", () => {
      var element;
      var elements;

      beforeEach(() => {
        element = helpers.createInputElement(false);
        elements = document.getElementsByTagName("input");
      });

      afterEach(() => {
        element.parentNode.removeChild(element);
      });

      it("should return false", () => {
        expect(placekeeper.hasElementsThatNeedPlaceholder(elements)).toEqual(false);
      });

    });

  });

});
