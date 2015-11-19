import * as helpers from "../utils/helpers.js";
import * as placekeeper from "../../src/main.js";
import * as polyfill from "../../src/polyfill.js";
import * as utils from "../../src/utils.js";

describe("existing value", function() {
  "use strict";

  beforeEach(helpers.initialSetup);

  describe("when input type can not be changed, and there is a password input with placeholder and existing value on the page", function() {
    var element;
    var clone;

    beforeEach(function(done) {
      spyOn(polyfill, "showPlaceholder").and.callThrough();
      helpers.spyOnCanChangeToTypeAndReturn(false);
      helpers.spyOnNativeSupportAndReturn(false);
      element = helpers.createInputElementWithValue(true, "password");
      setTimeout(function() {
        clone = element.previousSibling;
        done();
      }, helpers.loopDurationForTests);
      placekeeper.priv.__init();
    });

    afterEach(function() {
      clone.parentNode.removeChild(clone);
      element.parentNode.removeChild(element);
    });

    it("should not have called polyfill's showPlaceholder method", function() {
      expect(polyfill.showPlaceholder).not.toHaveBeenCalled();
      expect(polyfill.showPlaceholder.calls.count()).toEqual(0);
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

    it("should not have element hidden", function() {
      expect(element.style.display).not.toEqual("none");
    });

    it("should have clone hidden", function() {
      expect(clone.style.display).toEqual("none");
    });

    it("should have id set", function() {
      expect(element.id).toEqual("elem");
    });

    it("should not have clone id set", function() {
      expect(clone.id).toEqual("");
    });

    it("should have set password input type to password", function() {
      expect(element.getAttribute("type")).toEqual("password");
    });

    describe("and when element is focused", function() {

      beforeEach(function() {
        spyOn(utils, "moveCaret");
        helpers.focus(element);
      });

      it("should not have moved the caret to the beginning of the text field", function() {
        expect(utils.moveCaret).not.toHaveBeenCalled();
      });

      it("should keep element value as it is", function() {
        expect(element.value).toEqual("MyVal");
      });

      it("should keep type as it is", function() {
        expect(element.getAttribute("type")).toEqual("password");
      });

      it("should not have set data-placeholder-active", function() {
        expect(element.getAttribute("data-placeholder-active")).toEqual(null);
      });

      it("should not have added placeholder class", function() {
        expect(element).not.toHaveClass("placeholder");
      });

      it("should not have element hidden", function() {
        expect(element.style.display).not.toEqual("none");
      });

      it("should have clone hidden", function() {
        expect(clone.style.display).toEqual("none");
      });

      it("should have id set", function() {
        expect(element.id).toEqual("elem");
      });

      it("should not have clone id set", function() {
        expect(clone.id).toEqual("");
      });

    });

    describe("and when value is changed", function() {

      beforeEach(function(done) {
        element.value = "Changed";
        setTimeout(done, helpers.loopDurationForTests);
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
        element.value = "";
        setTimeout(function() {
          clone = element.previousSibling;
          done();
        }, helpers.loopDurationForTests);
      });

      it("should have set clone's value to placeholder value (Test)", function() {
        expect(clone.value).toEqual("Test");
      });

      it("should have set data-placeholder-active to true", function() {
        expect(clone.getAttribute("data-placeholder-active")).toEqual("true");
      });

      it("should have added placeholder class", function() {
        expect(clone).toHaveClass("placeholder");
      });

      it("should not have id set", function() {
        expect(element.id).toEqual("");
      });

      it("should have clone id set", function() {
        expect(clone.id).toEqual("elem");
      });

      it("should have element hidden", function() {
        expect(element.style.display).toEqual("none");
      });

      it("should not have clone hidden", function() {
        expect(clone.style.display).not.toEqual("none");
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
        spyOn(utils, "moveCaret");
        helpers.focus(element);
      });

      it("should not have moved the caret to the beginning of the text field", function() {
        expect(utils.moveCaret).not.toHaveBeenCalled();
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
