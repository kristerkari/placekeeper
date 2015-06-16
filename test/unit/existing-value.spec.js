describe("existing value", function() {
  "use strict";

  beforeEach(helpers.initialSetup);

  describe("when there is an input with placeholder and existing value on the page", function() {
    var element;

    beforeEach(function(done) {
      element = helpers.createInputElementWithValue(true);
      placekeeper.priv.__setupPlaceholders();
      setTimeout(done, helpers.loopDurationForTests);
    });

    afterEach(function() {
      element.parentNode.removeChild(element);
    });

    it("should keep element value as it is", function() {
      expect(element.value).toEqual("MyVal");
    });

    it("should not have set data-placeholder-active", function() {
      expect(element.getAttribute("data-placeholder-active")).toEqual(null);
    });

    it("should not have added placeholder class", function() {
      expect(element).not.toHaveClass("placeholder");
    });

    describe("and when element is focused", function() {

      beforeEach(function() {
        spyOn(placekeeper.utils, "moveCaret");
        helpers.focus(element);
      });

      it("should not have moved the caret to the beginning of the text field", function() {
        expect(placekeeper.utils.moveCaret).not.toHaveBeenCalled();
      });

    });

  });

  describe("when there is a textarea with placeholder and existing value on the page", function() {
    var element;

    beforeEach(function(done) {
      element = helpers.createTextareaElementWithValue(true);
      placekeeper.priv.__setupPlaceholders();
      setTimeout(done, helpers.loopDurationForTests);
    });

    afterEach(function() {
      element.parentNode.removeChild(element);
    });

    it("should keep element value as it is", function() {
      expect(element.value).toEqual("MyVal");
    });

    it("should not have set data-placeholder-active", function() {
      expect(element.getAttribute("data-placeholder-active")).toEqual(null);
    });

    it("should not have added placeholder class", function() {
      expect(element).not.toHaveClass("placeholder");
    });

  });

});
