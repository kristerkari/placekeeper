describe("elements.getElements", function() {
  "use strict";

  beforeEach(helpers.initialSetup);

  describe("when inputs are supported and textareas are not", function() {

    beforeEach(function() {
      spyOn(placekeeper.utils, "getElementsByTagName");
      placekeeper.support.isInputSupported.and.returnValue(true);
      placekeeper.support.isTextareaSupported.and.returnValue(false);
    });

    describe("and when called", function() {

      beforeEach(function() {
        placekeeper.elements.getElements();
      });

      it("should have gotten elements for textarea", function() {
        expect(placekeeper.utils.getElementsByTagName).toHaveBeenCalledWith("textarea");
      });

      it("should not have gotten elements for inputs", function() {
        expect(placekeeper.utils.getElementsByTagName).not.toHaveBeenCalledWith("input");
      });

    });

  });

  describe("when textareas are supported and inputs are not", function() {

    beforeEach(function() {
      spyOn(placekeeper.utils, "getElementsByTagName");
      placekeeper.support.isInputSupported.and.returnValue(false);
      placekeeper.support.isTextareaSupported.and.returnValue(true);
    });

    describe("and when called", function() {

      beforeEach(function() {
        placekeeper.elements.getElements();
      });

      it("should not have gotten elements for textarea", function() {
        expect(placekeeper.utils.getElementsByTagName).not.toHaveBeenCalledWith("textarea");
      });

      it("should have gotten elements for inputs", function() {
        expect(placekeeper.utils.getElementsByTagName).toHaveBeenCalledWith("input");
      });

    });
  });

  describe("when both inputs and textareas are supported", function() {

    beforeEach(function() {
      spyOn(placekeeper.utils, "getElementsByTagName");
      placekeeper.support.isInputSupported.and.returnValue(true);
      placekeeper.support.isTextareaSupported.and.returnValue(true);
    });

    describe("and when called", function() {

      beforeEach(function() {
        placekeeper.elements.getElements();
      });

      it("should not have gotten elements for textarea", function() {
        expect(placekeeper.utils.getElementsByTagName).not.toHaveBeenCalledWith("textarea");
      });

      it("should not have gotten elements for inputs", function() {
        expect(placekeeper.utils.getElementsByTagName).not.toHaveBeenCalledWith("input");
      });

    });

  });

  describe("when both inputs and textareas are missing support", function() {

    beforeEach(function() {
      spyOn(placekeeper.utils, "getElementsByTagName");
      placekeeper.support.isInputSupported.and.returnValue(false);
      placekeeper.support.isTextareaSupported.and.returnValue(false);
    });

    describe("and when called", function() {

      beforeEach(function() {
        placekeeper.elements.getElements();
      });

      it("should have gotten elements for textarea", function() {
        expect(placekeeper.utils.getElementsByTagName).toHaveBeenCalledWith("textarea");
      });

      it("should have gotten elements for inputs", function() {
        expect(placekeeper.utils.getElementsByTagName).toHaveBeenCalledWith("input");
      });

    });

  });

});
