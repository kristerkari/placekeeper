import * as helpers from "../utils/helpers.js";
import * as placekeeper from "../../src/main.js";
import * as polyfill from "../../src/polyfill.js";

describe("changing value", function() {
  "use strict";

  beforeEach(helpers.initialSetup);

  describe("when there is an input with placeholder and existing value on the page", function() {
    var element;

    beforeEach((done) => {
      helpers.spyOnCanChangeToTypeAndReturn(false);
      helpers.spyOnNativeSupportAndReturn(false);
      element = helpers.createInputElementWithValue(true);
      setTimeout(done, helpers.loopDurationForTests);
      placekeeper.init();
    });

    afterEach(function() {
      element.parentNode.removeChild(element);
    });

    describe("when input value does not change", function() {

      beforeEach((done) => {
        spyOn(polyfill, "hidePlaceholder").and.callThrough();
        setTimeout(done, helpers.loopDurationForTests);
      });

      it("should not have called hidePlaceholder", function() {
        expect(polyfill.hidePlaceholder).not.toHaveBeenCalled();
        expect(polyfill.hidePlaceholder.calls.count()).toEqual(0);
      });

    });

    describe("when input value changes", function() {

      beforeEach((done) => {
        spyOn(polyfill, "hidePlaceholder").and.callThrough();
        element.value = "Changed";
        setTimeout(done, helpers.loopDurationForTests);
      });

      it("should not have called hidePlaceholder", function() {
        expect(polyfill.hidePlaceholder).not.toHaveBeenCalled();
        expect(polyfill.hidePlaceholder.calls.count()).toEqual(0);
      });

      it("should have changed element value", function() {
        expect(element.value).toEqual("Changed");
      });

    });

  });

});
