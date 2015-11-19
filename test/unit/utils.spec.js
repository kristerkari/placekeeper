import * as helpers from "../utils/helpers.js";
import * as utils from "../../src/utils.js";

describe("utils", () => {

  "use strict";

  describe("getAttributes", () => {

    it("should be able to copy element attributes", () => {
      expect(utils.getAttributes(helpers.createInputElementWithValue(true))).toEqual({
        placeholder: "Test",
        value: "MyVal"
      });
    });

  });

  describe("hasPlaceholderAttrSet", () => {

    describe("when called with an element that has placeholder attribute set", () => {
      var element;

      beforeEach((done) => {
        element = helpers.createInputElement(true);
        setTimeout(done, helpers.loopDurationForTests);
      });

      afterEach(() => {
        element.parentNode.removeChild(element);
      });

      it("should return true", () => {
        expect(utils.hasPlaceholderAttrSet(element)).toEqual(true);
      });

    });

    describe("when called with an element that does not have have placeholder attribute set", () => {
      var element;

      beforeEach((done) => {
        element = helpers.createInputElement(false);
        setTimeout(done, helpers.loopDurationForTests);
      });

      afterEach(() => {
        element.parentNode.removeChild(element);
      });

      it("should return false", () => {
        expect(utils.hasPlaceholderAttrSet(element)).toEqual(false);
      });

    });

  });

  describe("getElementType method", () => {

    describe("when there is an input with type text", () => {
      var element;

      beforeEach(() => {
        element = helpers.createInputElement(true);
      });

      afterEach(() => {
        element.parentNode.removeChild(element);
      });

      it("should return text for the type", () => {
        expect(utils.getElementType(element)).toEqual("text");
      });

    });

    describe("when there is an input without type", () => {
      var element;

      beforeEach(() => {
        element = helpers.createInputElementWithoutType(true);
      });

      afterEach(() => {
        element.parentNode.removeChild(element);
      });

      it("should return text for the type", () => {
        expect(utils.getElementType(element)).toEqual("text");
      });

    });

    describe("when there is an input with type email", () => {
      var element;

      beforeEach(() => {
        element = helpers.createInputElement(true, "email");
      });

      afterEach(() => {
        element.parentNode.removeChild(element);
      });

      it("should return text for the type", () => {
        expect(utils.getElementType(element)).toEqual("email");
      });

    });

    describe("when there is a textarea", () => {
      var element;

      beforeEach(() => {
        element = helpers.createTextareaElement(true);
      });

      afterEach(() => {
        element.parentNode.removeChild(element);
      });

      it("should return text for the type", () => {
        expect(utils.getElementType(element)).toEqual("textarea");
      });

    });

  });

});
