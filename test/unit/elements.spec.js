import * as helpers from "../utils/helpers.js";
import * as utils from "../../src/utils.js";
import * as support from "../../src/support.js";
import * as elements from "../../src/elements.js";

describe("elements.getElements", () => {
  "use strict";

  beforeEach(helpers.initialSetup);

  describe("when inputs are supported and textareas are not", () => {

    beforeEach(() => {
      spyOn(utils, "getElementsByTagName");
      support.isInputSupported.and.returnValue(true);
      support.isTextareaSupported.and.returnValue(false);
    });

    describe("and when called", () => {

      beforeEach(() => {
        elements.getElements();
      });

      it("should have gotten elements for textarea", () => {
        expect(utils.getElementsByTagName).toHaveBeenCalledWith("textarea");
      });

      it("should not have gotten elements for inputs", () => {
        expect(utils.getElementsByTagName).not.toHaveBeenCalledWith("input");
      });

    });

  });

  describe("when textareas are supported and inputs are not", () => {

    beforeEach(() => {
      spyOn(utils, "getElementsByTagName");
      support.isInputSupported.and.returnValue(false);
      support.isTextareaSupported.and.returnValue(true);
    });

    describe("and when called", () => {

      beforeEach(() => {
        elements.getElements();
      });

      it("should not have gotten elements for textarea", () => {
        expect(utils.getElementsByTagName).not.toHaveBeenCalledWith("textarea");
      });

      it("should have gotten elements for inputs", () => {
        expect(utils.getElementsByTagName).toHaveBeenCalledWith("input");
      });

    });
  });

  describe("when both inputs and textareas are supported", () => {

    beforeEach(() => {
      spyOn(utils, "getElementsByTagName");
      support.isInputSupported.and.returnValue(true);
      support.isTextareaSupported.and.returnValue(true);
    });

    describe("and when called", () => {

      beforeEach(() => {
        elements.getElements();
      });

      it("should not have gotten elements for textarea", () => {
        expect(utils.getElementsByTagName).not.toHaveBeenCalledWith("textarea");
      });

      it("should not have gotten elements for inputs", () => {
        expect(utils.getElementsByTagName).not.toHaveBeenCalledWith("input");
      });

    });

  });

  describe("when both inputs and textareas are missing support", () => {

    beforeEach(() => {
      spyOn(utils, "getElementsByTagName");
      support.isInputSupported.and.returnValue(false);
      support.isTextareaSupported.and.returnValue(false);
    });

    describe("and when called", () => {

      beforeEach(() => {
        elements.getElements();
      });

      it("should have gotten elements for textarea", () => {
        expect(utils.getElementsByTagName).toHaveBeenCalledWith("textarea");
      });

      it("should have gotten elements for inputs", () => {
        expect(utils.getElementsByTagName).toHaveBeenCalledWith("input");
      });

    });

  });

});
