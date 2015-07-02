describe("existing value", function() {
  "use strict";

  beforeEach(helpers.initialSetup);

  describe("when input type can not be changed, and there is a password input with placeholder and existing value on the page", function() {
    var element;
    var clone;

    beforeEach(function(done) {
      spyOn(placekeeper.polyfill, "showPlaceholder").and.callThrough();
      helpers.spyOnCanChangeToTypeAndReturn(false);
      helpers.spyOnNativeSupportAndReturn(false);
      element = helpers.createInputElementWithValue(true, "password");
      setTimeout(function() {
        clone = document.getElementById("elem");
        done();
      }, helpers.loopDurationForTests);
      placekeeper.priv.__init();
    });

    afterEach(function() {
      element.parentNode.removeChild(element);
    });

    it("should not have called polyfill's showPlaceholder method", function() {
      expect(placekeeper.polyfill.showPlaceholder).not.toHaveBeenCalled();
      expect(placekeeper.polyfill.showPlaceholder.calls.count()).toEqual(0);
    });

    it("should keep element value as it is", function() {
      expect(clone.value).toEqual("MyVal");
    });

    it("should not have set data-placeholder-active", function() {
      expect(clone.getAttribute("data-placeholder-active")).toEqual(null);
    });

    it("should not have added placeholder class", function() {
      expect(clone).not.toHaveClass("placeholder");
    });

    it("should have element hidden", function() {
      expect(element.style.display).toEqual("none");
    });

    it("should have id set", function() {
      expect(clone.id).toEqual("elem");
    });

    it("should have removed id from element", function() {
      expect(element.id).toEqual("");
    });

    it("should have changed password input type to text when there is no focus", function() {
      expect(clone.getAttribute("type")).toEqual("text");
    });

    describe("and when element is focused", function() {

      beforeEach(function() {
        spyOn(placekeeper.utils, "moveCaret");
        helpers.focus(clone);
      });

      it("should not have moved the caret to the beginning of the text field", function() {
        expect(placekeeper.utils.moveCaret).not.toHaveBeenCalled();
      });

      it("should keep element value as it is", function() {
        expect(clone.value).toEqual("MyVal");
      });

    });

    describe("and when value is changed", function() {

      beforeEach(function(done) {
        clone.value = "Changed";
        setTimeout(function() {
          element = document.getElementById("elem");
          done();
        }, helpers.loopDurationForTests);
      });

      it("should have kept element's value", function() {
        expect(element.value).toEqual("Changed");
      });

      it("should not have set data-placeholder-active", function() {
        expect(element.getAttribute("data-placeholder-active")).toEqual(null);
      });

      it("should not have added placeholder class", function() {
        expect(element).not.toHaveClass("placeholder");
      });

    });

    describe("and when value is removed", function() {

      beforeEach(function(done) {
        clone.value = "";
        setTimeout(function() {
          element = document.getElementById("elem");
          done();
        }, helpers.loopDurationForTests);
      });

      it("should have set element's value to placeholder value (Test)", function() {
        expect(element.value).toEqual("Test");
      });

      it("should have set data-placeholder-active to true", function() {
        expect(element.getAttribute("data-placeholder-active")).toEqual("true");
      });

      it("should have added placeholder class", function() {
        expect(element).toHaveClass("placeholder");
      });

    });

  });

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
