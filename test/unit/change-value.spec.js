describe("changing value", function() {
  "use strict";

  beforeEach(helpers.initialSetup);

  describe("when there is an input with placeholder and existing value on the page", function() {
    var element;

    beforeEach(function(done) {
      helpers.spyOnCanChangeToTypeAndReturn(false);
      helpers.spyOnNativeSupportAndReturn(false);
      element = helpers.createInputElementWithValue(true);
      setTimeout(done, helpers.loopDurationForTests);
      placekeeper.priv.__init();
    });

    afterEach(function() {
      element.parentNode.removeChild(element);
    });

    describe("when input value does not change", function() {

      beforeEach(function(done) {
        spyOn(placekeeper.polyfill, "hidePlaceholder").and.callThrough();
        setTimeout(done, helpers.loopDurationForTests);
      });

      it("should not have called hidePlaceholder", function() {
        expect(placekeeper.polyfill.hidePlaceholder).not.toHaveBeenCalled();
        expect(placekeeper.polyfill.hidePlaceholder.calls.count()).toEqual(0);
      });

    });

    describe("when input value changes", function() {

      beforeEach(function(done) {
        spyOn(placekeeper.polyfill, "hidePlaceholder").and.callThrough();
        element.value = "Changed";
        setTimeout(done, helpers.loopDurationForTests);
      });

      it("should not have called hidePlaceholder", function() {
        expect(placekeeper.polyfill.hidePlaceholder).not.toHaveBeenCalled();
        expect(placekeeper.polyfill.hidePlaceholder.calls.count()).toEqual(0);
      });

      it("should have changed element value", function() {
        expect(element.value).toEqual("Changed");
      });

    });

  });

});
