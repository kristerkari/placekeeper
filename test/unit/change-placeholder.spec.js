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

      describe("and when input is focused after that", function() {

        beforeEach(function(done) {
          helpers.retryFocus(element, function() {
            setTimeout(function() {
              element = document.getElementById("elem");
              done();
            }, helpers.loopDurationForTests);
          });
        });

        it("should have removed element's value", function() {
          expect(element.value).toEqual("");
        });

        it("should have removed data-placeholder-active", function() {
          expect(element.getAttribute("data-placeholder-active")).toEqual(null);
        });

        it("should have removed placeholder class", function() {
          expect(element).not.toHaveClass("placeholder");
        });

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
