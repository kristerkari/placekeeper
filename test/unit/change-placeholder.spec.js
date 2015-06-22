describe("changing placeholder", function() {
  "use strict";

  beforeEach(helpers.initialSetup);

  describe("when a password input with placeholder exists on the page", function() {
    var element;

    beforeEach(function(done) {
      helpers.spyOnCanChangeToTypeAndReturn(false);
      helpers.spyOnNativeSupportAndReturn(false);
      element = helpers.createInputElement(true, "password");
      setTimeout(function() {
        element = document.getElementById("elem");
        done();
      }, helpers.loopDurationForTests);
      placekeeper.priv.__init();
    });

    afterEach(function() {
      element.parentNode.removeChild(element);
    });

    it("should have data-placeholder-active set to true", function() {
      expect(element.getAttribute("data-placeholder-active")).toEqual("true");
    });

    it("should have placeholder class", function() {
      expect(element).toHaveClass("placeholder");
    });

    it("should have placeholder as value", function() {
      expect(element.value).toEqual("Test");
    });

    describe("and when placeholder is changed", function() {

      beforeEach(function(done) {
        element.setAttribute("placeholder", "Changed");
        setTimeout(function() {
          element = document.getElementById("elem");
          done();
        }, helpers.loopDurationForTests);
      });

      it("should have data-placeholder-active set to true", function() {
        expect(element.getAttribute("data-placeholder-active")).toEqual("true");
      });

      it("should have placeholder class", function() {
        expect(element).toHaveClass("placeholder");
      });

      it("should have placeholder as value", function() {
        expect(element.value).toEqual("Changed");
      });

    });

  });

  describe("when a text input with placeholder exists on the page", function() {
    var element;

    beforeEach(function(done) {
      helpers.spyOnCanChangeToTypeAndReturn(false);
      helpers.spyOnNativeSupportAndReturn(false);
      element = helpers.createInputElement(true);
      setTimeout(done, helpers.loopDurationForTests);
      placekeeper.priv.__init();
    });

    afterEach(function() {
      element.parentNode.removeChild(element);
    });

    it("should have data-placeholder-active set to true", function() {
      expect(element.getAttribute("data-placeholder-active")).toEqual("true");
    });

    it("should have placeholder class", function() {
      expect(element).toHaveClass("placeholder");
    });

    it("should have placeholder as value", function() {
      expect(element.value).toEqual("Test");
    });

    describe("and when placeholder is changed", function() {

      beforeEach(function(done) {
        element.setAttribute("placeholder", "Changed");
        setTimeout(done, helpers.loopDurationForTests);
      });

      it("should have data-placeholder-active set to true", function() {
        expect(element.getAttribute("data-placeholder-active")).toEqual("true");
      });

      it("should have placeholder class", function() {
        expect(element).toHaveClass("placeholder");
      });

      it("should have placeholder as value", function() {
        expect(element.value).toEqual("Changed");
      });

    });

  });

});
