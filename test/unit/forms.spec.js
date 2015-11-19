import * as helpers from "../utils/helpers.js";
import * as placekeeper from "../../src/main.js";
import * as polyfill from "../../src/polyfill.js";
import * as utils from "../../src/utils.js";
import * as events from "../../src/events.js";

describe("forms", function() {
  "use strict";

  beforeEach(helpers.initialSetup);

  describe("when there is an element with placeholder and form attribute inside a form on the page", function() {
    var element;
    var form;

    beforeEach(function(done) {
      element = helpers.createInputElementWithFormAttribute(true);
      form = document.getElementsByTagName("form")[0];
      placekeeper.priv.__setupPlaceholders();
      setTimeout(done, helpers.loopDurationForTests);
    });

    afterEach(function() {
      element.parentNode.removeChild(element);
    });

    describe("and when that form is submitted", function() {

      beforeEach(function() {
        spyOn(polyfill, "hidePlaceholder");
        spyOn(polyfill, "showPlaceholder");
        triggerEvent.html(form, "submit");
      });

      it("should have added data-placeholder-submit to the form", function() {
        expect(form.getAttribute("data-placeholder-submit")).toEqual("true");
      });

      it("should have called polyfill's hidePlaceholder method", function() {
        expect(polyfill.hidePlaceholder).toHaveBeenCalledWith(element);
        expect(polyfill.hidePlaceholder.calls.count()).toEqual(1);
      });

      it("should not have called polyfill's showPlaceholder method", function() {
        expect(polyfill.showPlaceholder).not.toHaveBeenCalled();
        expect(polyfill.showPlaceholder.calls.count()).toEqual(0);
      });

      describe("and after 10ms (when form is submitted)", function() {

        beforeEach(function(done) {
          setTimeout(done, 10);
        });

        it("should have called polyfill's showPlaceholder method", function() {
          expect(polyfill.showPlaceholder).toHaveBeenCalledWith(element);
          expect(polyfill.showPlaceholder.calls.count()).toEqual(1);
        });

      });

    });

    describe("and when disable method is called", function() {
      var submitHandler;

      beforeEach(function() {
        submitHandler = events.handlers.submit;
        spyOn(utils, "removeEventListener");
        placekeeper.disable();
      });

      it("should have called utils.removeEventListener for submit handler", function() {
        expect(utils.removeEventListener)
        .toHaveBeenCalledWith(form, "submit", submitHandler);
      });

      it("should not have data-placeholder-submit set to the from", function() {
        expect(form.getAttribute("data-placeholder-submit")).toEqual(null);
      });

      it("should have deleted the submit handler", function() {
        expect(events.handlers.submit).not.toBeDefined();
      });

    });

  });

  describe("when there is an element without placeholder inside a form on the page", function() {
    var element;
    var form;

    beforeEach(function(done) {
      element = helpers.createInputElementWithForm(false);
      form = document.getElementsByTagName("form")[0];
      placekeeper.priv.__setupPlaceholders();
      setTimeout(done, helpers.loopDurationForTests);
    });

    afterEach(function() {
      element.parentNode.removeChild(element);
    });

    describe("and when that form is submitted", function() {

      beforeEach(function() {
        spyOn(polyfill, "hidePlaceholder");
        spyOn(polyfill, "showPlaceholder");
        triggerEvent.html(form, "submit");
      });

      it("should not have added data-placeholder-submit to the form", function() {
        expect(form.getAttribute("data-placeholder-submit")).toEqual(null);
      });

      it("should not have called polyfill's hidePlaceholder method", function() {
        expect(polyfill.hidePlaceholder).not.toHaveBeenCalled();
        expect(polyfill.hidePlaceholder.calls.count()).toEqual(0);
      });

      it("should not have called polyfill's showPlaceholder method", function() {
        expect(polyfill.showPlaceholder).not.toHaveBeenCalled();
        expect(polyfill.showPlaceholder.calls.count()).toEqual(0);
      });

    });

  });

  describe("when there is an element with placeholder inside a form on the page", function() {
    var element;
    var form;

    beforeEach(function(done) {
      element = helpers.createInputElementWithForm(true);
      form = document.getElementsByTagName("form")[0];
      placekeeper.priv.__setupPlaceholders();
      setTimeout(done, helpers.loopDurationForTests);
    });

    afterEach(function() {
      element.parentNode.removeChild(element);
    });

    describe("and when that form is submitted", function() {

      beforeEach(function() {
        spyOn(polyfill, "hidePlaceholder");
        spyOn(polyfill, "showPlaceholder");
        triggerEvent.html(form, "submit");
      });

      it("should have added data-placeholder-submit to the form", function() {
        expect(form.getAttribute("data-placeholder-submit")).toEqual("true");
      });

      it("should have called polyfill's hidePlaceholder method", function() {
        expect(polyfill.hidePlaceholder).toHaveBeenCalledWith(element);
        expect(polyfill.hidePlaceholder.calls.count()).toEqual(1);
      });

      it("should not have called polyfill's showPlaceholder method", function() {
        expect(polyfill.showPlaceholder).not.toHaveBeenCalled();
        expect(polyfill.showPlaceholder.calls.count()).toEqual(0);
      });

      describe("and after 10ms (when form is submitted)", function() {

        beforeEach(function(done) {
          setTimeout(done, 10);
        });

        it("should have called polyfill's showPlaceholder method", function() {
          expect(polyfill.showPlaceholder).toHaveBeenCalledWith(element);
          expect(polyfill.showPlaceholder.calls.count()).toEqual(1);
        });

      });

    });

    describe("and when disable method is called", function() {
      var submitHandler;

      beforeEach(function() {
        submitHandler = events.handlers.submit;
        spyOn(utils, "removeEventListener");
        placekeeper.disable();
      });

      it("should have called utils.removeEventListener for submit handler", function() {
        expect(utils.removeEventListener)
        .toHaveBeenCalledWith(form, "submit", submitHandler);
      });

      it("should not have data-placeholder-submit set to the from", function() {
        expect(form.getAttribute("data-placeholder-submit")).toEqual(null);
      });

      it("should have deleted the submit handler", function() {
        expect(events.handlers.submit).not.toBeDefined();
      });

    });

  });

});
