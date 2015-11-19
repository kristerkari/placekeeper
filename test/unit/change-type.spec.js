import * as helpers from "../utils/helpers.js";
import * as placekeeper from "../../src/main.js";

describe("changing element type", function() {
  "use strict";

  beforeEach(helpers.initialSetup);

  if (helpers.canActuallyChangeType) {

    describe("when input type can be changed", function() {

      beforeEach(function() {
        helpers.spyOnCanChangeToTypeAndReturn(true);
        helpers.spyOnNativeSupportAndReturn(false);
      });

      describe("when a password input with placeholder exists on the page", function() {
        var element;

        beforeEach((done) => {
          element = helpers.createInputElement(true, "password");
          setTimeout(done, helpers.loopDurationForTests);
          placekeeper.init();
        });

        afterEach(function() {
          element.parentNode.removeChild(element);
        });

        describe("and when its type is changed to text with a data attribute", function() {

          beforeEach((done) => {
            element.setAttribute("data-placeholder-type", "text");
            setTimeout(done, helpers.loopDurationForTests);
          });

          it("should have one input on the page", function() {
            expect(document.getElementsByTagName("input").length).toEqual(1);
          });

          it("should have element type set to text", function() {
            expect(element.type).toEqual("text");
          });

        });

      });

      describe("when a text input with placeholder exists on the page", function() {
        var element;

        beforeEach((done) => {
          element = helpers.createInputElement(true);
          setTimeout(done, helpers.loopDurationForTests);
          placekeeper.init();
        });

        afterEach(function() {
          element.parentNode.removeChild(element);
        });

        describe("and when its type is changed to password", function() {

          beforeEach((done) => {
            element.type = "password";
            setTimeout(done, helpers.loopDurationForTests);
          });

          it("should have one input on the page", function() {
            expect(document.getElementsByTagName("input").length).toEqual(1);
          });

          it("should have element type set to text (so that placeholder is visible)", function() {
            expect(element.type).toEqual("text");
          });

          /* This test is failing
             TODO: find out why
          describe("and when the element is focused", function() {

            beforeEach((done) => {
              helpers.retryFocus(element, function() {
                setTimeout(done, helpers.loopDurationForTests);
              });
            });

            it("should have element type set to password", function() {
              expect(element.type).toEqual("password");
            });

          });
          */

        });

      });

    });

    describe("when input type can not be changed", function() {

      beforeEach(function() {
        helpers.spyOnCanChangeToTypeAndReturn(false);
        helpers.spyOnNativeSupportAndReturn(false);
      });

      describe("when a password input with placeholder exists on the page", function() {
        var element;

        beforeEach((done) => {
          element = helpers.createInputElement(true, "password");
          setTimeout(function() {
            element = document.getElementById("elem");
            done();
          }, helpers.loopDurationForTests);
          placekeeper.init();
        });

        afterEach(function() {
          element.parentNode.removeChild(element);
        });

        describe("and when its type is changed to text with a data attribute", function() {

          beforeEach((done) => {
            element.setAttribute("data-placeholder-type", "text");
            setTimeout(function() {
              element = document.getElementById("elem");
              done();
            }, helpers.loopDurationForTests);
          });

          it("should have one input on the page", function() {
            expect(document.getElementsByTagName("input").length).toEqual(1);
          });

          it("should have element type set to text", function() {
            expect(element.type).toEqual("text");
          });

        });

      });

      describe("when a text input with placeholder exists on the page", function() {
        var element;

        beforeEach((done) => {
          element = helpers.createInputElement(true);
          placekeeper.init();
          setTimeout(done, helpers.loopDurationForTests);
        });

        afterEach(function() {
          element.parentNode.removeChild(element);
        });

        describe("and when its type is changed to password", function() {

          beforeEach((done) => {
            element.type = "password";
            setTimeout(function() {
              element = document.getElementById("elem");
              done();
            }, helpers.loopDurationForTests);
          });

          it("should have two inputs on the page", function() {
            expect(document.getElementsByTagName("input").length).toEqual(2);
          });

          it("should have element type set to text", function() {
            expect(element.type).toEqual("text");
          });

          describe("and when the element is focused", function() {

            beforeEach((done) => {
              helpers.retryFocus(element, function() {
                setTimeout(function() {
                  element = document.getElementById("elem");
                  done();
                }, helpers.loopDurationForTests);
              });
            });

            it("should have element type set to password", function() {
              expect(element.type).toEqual("password");
            });

          });

        });

      });

    });

  }

});
