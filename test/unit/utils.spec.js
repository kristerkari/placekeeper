describe("utils", function() {

  "use strict";

  beforeEach(helpers.initialSetup);

  describe("getAttributes", function() {

    it("should be able to copy element attributes", function() {
      expect(placekeeper.utils.getAttributes(helpers.createInputElementWithValue(true))).toEqual({
        id: "elem",
        placeholder: "Test",
        value: "MyVal"
      });
    });

  });

  describe("hasPlaceholderAttrSet", function() {

    describe("when called with an element that has placeholder attribute set", function() {
      var element;

      beforeEach(function(done) {
        element = helpers.createInputElement(true);
        setTimeout(done, helpers.loopDurationForTests);
      });

      afterEach(function() {
        element.parentNode.removeChild(element);
      });

      it("should return true", function() {
        expect(placekeeper.utils.hasPlaceholderAttrSet(element)).toEqual(true);
      });

    });

    describe("when called with an element that does not have have placeholder attribute set", function() {
      var element;

      beforeEach(function(done) {
        element = helpers.createInputElement(false);
        setTimeout(done, helpers.loopDurationForTests);
      });

      afterEach(function() {
        element.parentNode.removeChild(element);
      });

      it("should return false", function() {
        expect(placekeeper.utils.hasPlaceholderAttrSet(element)).toEqual(false);
      });

    });

  });

  describe("getElementType method", function() {

    describe("when there is an input with type text", function() {
      var element;

      beforeEach(function() {
        element = helpers.createInputElement(true);
      });

      afterEach(function() {
        element.parentNode.removeChild(element);
      });

      it("should return text for the type", function() {
        expect(placekeeper.utils.getElementType(element)).toEqual("text");
      });

    });

    describe("when there is an input without type", function() {
      var element;

      beforeEach(function() {
        element = helpers.createInputElementWithoutType(true);
      });

      afterEach(function() {
        element.parentNode.removeChild(element);
      });

      it("should return text for the type", function() {
        expect(placekeeper.utils.getElementType(element)).toEqual("text");
      });

    });

    describe("when there is an input with type email", function() {
      var element;

      beforeEach(function() {
        element = helpers.createInputElement(true, "email");
      });

      afterEach(function() {
        element.parentNode.removeChild(element);
      });

      it("should return text for the type", function() {
        expect(placekeeper.utils.getElementType(element)).toEqual("email");
      });

    });

    describe("when there is a textarea", function() {
      var element;

      beforeEach(function() {
        element = helpers.createTextareaElement(true);
      });

      afterEach(function() {
        element.parentNode.removeChild(element);
      });

      it("should return text for the type", function() {
        expect(placekeeper.utils.getElementType(element)).toEqual("textarea");
      });

    });

  });

});
