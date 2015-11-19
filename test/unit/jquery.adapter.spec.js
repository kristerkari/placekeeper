import * as helpers from "../utils/helpers.js";
import * as placekeeper from "../../src/main.js";
import * as jq from "../../src/adapters/adapter.jquery.js";

describe("jQuery adapter", function() {
  "use strict";

  beforeEach(helpers.initialSetup);
  beforeEach(function() {
    helpers.spyOnNativeSupportAndReturn(false);
    jq.setup();
  });

  describe("when there is an input with a placeholder on the page", function() {
    var element;

    beforeEach(function(done) {
      element = helpers.createInputElement(true);
      placekeeper.priv.__setupPlaceholders();
      setTimeout(done, helpers.loopDurationForTests);
    });

    afterEach(function() {
      element.parentNode.removeChild(element);
    });

    it("should return empty value with .val()", function() {
      expect($("#elem").val()).toEqual("");
    });

    it("should return empty value with .prop('value')", function() {
      expect($("#elem").prop("value")).toEqual("");
    });

  });

  describe("When there is an input with a placeholder and existing value on the page", function() {
    var element;

    beforeEach(function(done) {
      element = helpers.createInputElementWithValue(true);
      placekeeper.priv.__setupPlaceholders();
      setTimeout(done, helpers.loopDurationForTests);
    });

    afterEach(function() {
      element.parentNode.removeChild(element);
    });

    it("should return value with .val()", function() {
      expect($("#elem").val()).toEqual("MyVal");
    });

    it("should return value with .prop('value')", function() {
      expect($("#elem").prop("value")).toEqual("MyVal");
    });

    describe("and when the value is removed", function() {

      beforeEach(function() {
        $("#elem").val("");
      });

      it("should return empty value with .val()", function() {
        expect($("#elem").val()).toEqual("");
      });

      it("should return empty value with .prop('value')", function() {
        expect($("#elem").prop("value")).toEqual("");
      });

    });

  });

  describe("when there is an input with a placeholder that has numeric value on the page", function() {
    var element;

    beforeEach(function(done) {
      element = helpers.createInputElementWithNumericPlaceholder(true);
      placekeeper.priv.__setupPlaceholders();
      setTimeout(done, helpers.loopDurationForTests);
    });

    afterEach(function() {
      element.parentNode.removeChild(element);
    });

    it("should return empty value with .val()", function() {
      expect($("#elem").val()).toEqual("");
    });

    it("should return empty value with .prop('value')", function() {
      expect($("#elem").prop("value")).toEqual("");
    });

  });

});
