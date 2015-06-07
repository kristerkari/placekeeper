describe("private methods", function() {
  "use strict";

  beforeEach(helpers.initialSetup);

  describe("storeMaxlength", function() {

    describe("when called with an element that has maxLength attribute set", function() {
      var element;

      beforeEach(function(done) {
        element = helpers.createInputElementWithMaxLength(10);
        placekeeper.polyfill.storeMaxlength(element);
        setTimeout(done, helpers.loopDurationForTests);
      });

      afterEach(function() {
        element.parentNode.removeChild(element);
      });

      it("should have added data-placeholder-maxlength attribute to the element", function() {
        expect(parseInt(element.getAttribute("data-placeholder-maxlength"), 10)).toEqual(10);
      });

      it("should have removed maxLength attribute", function() {
        expect(element.getAttribute("maxlength")).toEqualNullOr2147483647();
      });

    });

    describe("when called with an element that does not have maxLength attribute set", function() {
      var element;

      beforeEach(function(done) {
        element = helpers.createInputElementWithMaxLength();
        placekeeper.polyfill.storeMaxlength(element);
        setTimeout(done, helpers.loopDurationForTests);
      });

      afterEach(function() {
        element.parentNode.removeChild(element);
      });

      it("should not have added data-placeholder-maxlength attribute to the element", function() {
        expect(element.getAttribute("data-placeholder-maxlength")).toEqual(null);
      });

    });

  });

  describe("restoreMaxlength", function() {

    describe("when called with an element that has maxLength data attribute set", function() {
      var element;

      beforeEach(function(done) {
        element = helpers.createInputElementWithMaxLength(false, 10);
        placekeeper.polyfill.restoreMaxlength(element);
        setTimeout(done, helpers.loopDurationForTests);
      });

      afterEach(function() {
        element.parentNode.removeChild(element);
      });

      it("should not have added data-placeholder-maxlength attribute to the element", function() {
        expect(element.getAttribute("data-placeholder-maxlength")).toEqual(null);
      });

      it("should have added maxLength attribute back", function() {
        expect(parseInt(element.getAttribute("maxlength"), 10)).toEqual(10);
      });

    });

    describe("when called with an element that does not have maxLength data attribute set", function() {
      var element;

      beforeEach(function(done) {
        element = helpers.createInputElementWithMaxLength();
        placekeeper.polyfill.restoreMaxlength(element);
        setTimeout(done, helpers.loopDurationForTests);
      });

      afterEach(function() {
        element.parentNode.removeChild(element);
      });

      it("should not have added data-placeholder-maxlength attribute to the element", function() {
        expect(element.getAttribute("data-placeholder-maxlength")).toEqual(null);
      });

      it("should not have added maxLength attribute", function() {
        expect(element.getAttribute("maxlength")).toEqualNullOr2147483647();
      });

    });

  });

  describe("__setupPlaceholders", function() {

    describe("when there is a text input without a placeholder value set", function() {
      var element;

      beforeEach(function(done) {
        element = helpers.createInputElement(false);
        setTimeout(done, helpers.loopDurationForTests);
      });

      afterEach(function() {
        element.parentNode.removeChild(element);
      });

      describe("and when called", function() {

        beforeEach(function() {
          placekeeper.priv.__setupPlaceholders();
        });

        it("should have one input in DOM", function() {
          expect(document.getElementsByTagName("input").length).toEqual(1);
        });

        it("should not have added data-placeholder-value to the element", function() {
          expect(element.getAttribute("data-placeholder-value")).toEqual(null);
        });

      });

    });

    describe("when there is a text input with a placeholder value set", function() {
      var element;

      beforeEach(function(done) {
        element = helpers.createInputElement(true);
        setTimeout(done, helpers.loopDurationForTests);
      });

      afterEach(function() {
        element.parentNode.removeChild(element);
      });

      describe("and when called", function() {

        beforeEach(function() {
          placekeeper.priv.__setupPlaceholders();
        });

        it("should have one input in DOM", function() {
          expect(document.getElementsByTagName("input").length).toEqual(1);
        });

        it("should have added data-placeholder-value to the element", function() {
          expect(element.getAttribute("data-placeholder-value")).toEqual("Test");
        });

      });

    });

    describe("when there is a date input with a placeholder value set", function() {
      var element;

      beforeEach(function(done) {
        element = helpers.createInputElement(true, "date");
        setTimeout(done, helpers.loopDurationForTests);
      });

      afterEach(function() {
        element.parentNode.removeChild(element);
      });

      describe("and when called", function() {

        beforeEach(function() {
          placekeeper.priv.__setupPlaceholders();
        });

        it("should not have added data-placeholder-value to the element", function() {
          expect(element.getAttribute("data-placeholder-value")).not.toEqual("Test");
        });

      });

    });

  });

  describe("__hasElementsThatNeedPlaceholder", function() {

    it("should return false when called without parameters", function() {
      expect(placekeeper.priv.__hasElementsThatNeedPlaceholder()).toEqual(false);
    });

    it("should return false when called with null", function() {
      expect(placekeeper.priv.__hasElementsThatNeedPlaceholder(null)).toEqual(false);
    });

    describe("when called and there is an element that has placeholder attribute set but the type is not supported", function() {
      var element;
      var elements;

      beforeEach(function() {
        element = helpers.createInputElement(true, "range");
        elements = document.getElementsByTagName("input");
      });

      afterEach(function() {
        element.parentNode.removeChild(element);
      });

      it("should return false", function() {
        expect(placekeeper.priv.__hasElementsThatNeedPlaceholder(elements)).toEqual(false);
      });

    });

    describe("when called and there is an element that has placeholder attribute set", function() {
      var element;
      var elements;

      beforeEach(function() {
        element = helpers.createInputElement(true);
        elements = document.getElementsByTagName("input");
      });

      afterEach(function() {
        element.parentNode.removeChild(element);
      });

      it("should return true", function() {
        expect(placekeeper.priv.__hasElementsThatNeedPlaceholder(elements)).toEqual(true);
      });

    });

    describe("when called and there is an element that does not have placeholder attribute set", function() {
      var element;
      var elements;

      beforeEach(function() {
        element = helpers.createInputElement(false);
        elements = document.getElementsByTagName("input");
      });

      afterEach(function() {
        element.parentNode.removeChild(element);
      });

      it("should return false", function() {
        expect(placekeeper.priv.__hasElementsThatNeedPlaceholder(elements)).toEqual(false);
      });

    });

  });

});
