describe("public methods", function() {
  "use strict";

  beforeEach(helpers.initialSetup);

  describe("disable method", function() {

    describe("when there is a password input on the page and input type can not be changed", function() {
      var element;
      var clone;

      beforeEach(function(done) {
        helpers.spyOnCanChangeToTypeAndReturn(false);
        element = helpers.createInputElement(true, "password");
        placekeeper.priv.__setupPlaceholders();
        setTimeout(function() {
          clone = document.getElementById("elem");
          done();
        }, helpers.loopDurationForTests);
      });

      afterEach(function() {
        element.parentNode.removeChild(element);
      });

      it("should have two inputs on the page", function() {
        expect(document.getElementsByTagName("input").length).toEqual(2);
      });

      describe("and when disable is called", function() {

        beforeEach(function(done) {
          spyOn(placekeeper.utils, "removeEventListener");
          placekeeper.disable();
          setTimeout(function() {
            element = document.getElementById("elem");
            done();
          }, helpers.loopDurationForTests);
        });

        it("should have one input on the page", function() {
          expect(document.getElementsByTagName("input").length).toEqual(1);
        });

        it("should have changed element type back to password", function() {
          expect(element.getAttribute("type")).toEqual("password");
        });

        it("should have elem id back to element", function() {
          expect(element.id).toEqual("elem");
        });

        it("should not have element display attribute set to anything", function() {
          expect(element.style.display).toEqual("");
        });

        it("should have remove all data-attributes from element", function() {
          expect(element).toHaveNoDataAttributes();
        });

        // In IE7 element is `null`
        // for some reason.
        // TODO: find out why
        if (clone != null) {
          it("should have called utils.removeEventListener for focus handler", function() {
            expect(placekeeper.utils.removeEventListener)
            .toHaveBeenCalledWith(clone, "focus", placekeeper.events.handlers.focus);
          });
        }

        // In IE7 element is `null`
        // for some reason.
        // TODO: find out why
        if (element != null) {
          it("should have called utils.removeEventListener for blur handler", function() {
            expect(placekeeper.utils.removeEventListener)
            .toHaveBeenCalledWith(element, "blur", placekeeper.events.handlers.blur);
          });
        }

      });

    });

    describe("when there is a password input on the page and input type can be changed", function() {
      var element;

      if (helpers.canActuallyChangeType) {

        beforeEach(function(done) {
          helpers.spyOnCanChangeToTypeAndReturn(true);
          element = helpers.createInputElement(true, "password");
          placekeeper.priv.__setupPlaceholders();
          setTimeout(done, helpers.loopDurationForTests);
        });

        afterEach(function() {
          element.parentNode.removeChild(element);
        });

        it("should have one on the page", function() {
          expect(document.getElementsByTagName("input").length).toEqual(1);
        });

        describe("and when disable is called", function() {

          beforeEach(function() {
            spyOn(placekeeper.utils, "removeEventListener");
            placekeeper.disable();
          });

          it("should have remove all data-attributes from element", function() {
            expect(element).toHaveNoDataAttributes();
          });

          it("should have called utils.removeEventListener for focus handler", function() {
            expect(placekeeper.utils.removeEventListener)
            .toHaveBeenCalledWith(element, "focus", placekeeper.events.handlers.focus);
          });

          it("should have called utils.removeEventListener for blur handler", function() {
            expect(placekeeper.utils.removeEventListener)
            .toHaveBeenCalledWith(element, "blur", placekeeper.events.handlers.blur);
          });

        });
      }
    });

  });

  describe("enable public method", function() {

    afterEach(function() {
      placekeeper.disable();
    });

    it("should be a function", function() {
      expect(typeof placekeeper.enable).toEqual("function");
    });

    describe("when called and there are no inputs or textareas on the page", function() {

      beforeEach(function() {
        helpers.spyOnNativeSupportAndReturn(false);
        placekeeper.enable();
      });

      it("should have called hasNativePlaceholderSupport method", function() {
        expect(placekeeper.support.hasNativePlaceholderSupport).toHaveBeenCalled();
      });

      it("should have placekeeper disabled", function() {
        expect(placekeeper.isEnabled()).toEqual(false);
      });

    });

    describe("when called and there is one input with placeholder attribute", function() {
      var element;

      beforeEach(function() {
        element = helpers.createInputElement(true);
        helpers.spyOnNativeSupportAndReturn(false);
        placekeeper.enable();
      });

      afterEach(function() {
        element.parentNode.removeChild(element);
      });

      it("should have called hasNativePlaceholderSupport method", function() {
        expect(placekeeper.support.hasNativePlaceholderSupport).toHaveBeenCalled();
      });

      it("should have placekeeper enabled", function() {
        expect(placekeeper.isEnabled()).toEqual(true);
      });

      describe("when placekeeper is disabled", function() {

        beforeEach(function() {
          placekeeper.disable();
        });

        it("should have placekeeper disabled", function() {
          expect(placekeeper.isEnabled()).toEqual(false);
        });

      });

    });

  });

  describe("isEnabled public method", function() {

    afterEach(function() {
      placekeeper.disable();
    });

    it("should be a function", function() {
      expect(typeof placekeeper.isEnabled).toEqual("function");
    });

    describe("when there are no inputs or textareas on the page", function() {

      it("should not have any inputs on the page", function() {
        expect(document.getElementsByTagName("input").length).toEqual(0);
      });

      it("should not have any textareas on the page", function() {
        expect(document.getElementsByTagName("textarea").length).toEqual(0);
      });

      describe("when HTML5 placeholder is supported for both inputs and textareas", function() {

        beforeEach(function() {
          helpers.spyOnNativeSupportAndReturn(true);
          placekeeper.enable();
        });

        it("should have placekeeper disabled because of native support", function() {
          expect(placekeeper.isEnabled()).toEqual(false);
        });

        describe("and when a text input element with placeholder attribute is inserted to the page", function() {
          var element;

          beforeEach(function(done) {
            element = helpers.createInputElement(true);
            setTimeout(done, helpers.loopDurationForTests);
          });

          afterEach(function() {
            element.parentNode.removeChild(element);
          });

          it("should have one input on the page", function() {
            expect(document.getElementsByTagName("input").length).toEqual(1);
          });

          it("should have placekeeper disabled because of native support", function() {
            expect(placekeeper.isEnabled()).toEqual(false);
          });

        });

      });

      describe("when HTML5 placeholder is not supported for both inputs and textareas", function() {

        beforeEach(function() {
          helpers.spyOnNativeSupportAndReturn(false);
          placekeeper.enable();
        });

        it("should have placekeeper disabled since there are no inputs or textareas", function() {
          expect(placekeeper.isEnabled()).toEqual(false);
        });

        describe("and when a text input element without placeholder attribute is inserted to the page", function() {
          var element;

          beforeEach(function(done) {
            element = helpers.createInputElement(false);
            setTimeout(done, helpers.loopDurationForTests);
          });

          afterEach(function() {
            element.parentNode.removeChild(element);
          });

          it("should have one input on the page", function() {
            expect(document.getElementsByTagName("input").length).toEqual(1);
          });

          it("should have placekeeper disabled since there is no placeholder attribute on the input", function() {
            expect(placekeeper.isEnabled()).toEqual(false);
          });

        });

        describe("and when a text input element with placeholder attribute is inserted to the page", function() {
          var element;

          beforeEach(function(done) {
            element = helpers.createInputElement(true);
            setTimeout(done, helpers.loopDurationForTests);
          });

          afterEach(function() {
            element.parentNode.removeChild(element);
          });

          it("should have one input on the page", function() {
            expect(document.getElementsByTagName("input").length).toEqual(1);
          });

          it("should have placekeeper enabled", function() {
            expect(placekeeper.isEnabled()).toEqual(true);
          });

        });

        describe("and when a textarea element with placeholder attribute is inserted to the page", function() {
          var element;

          beforeEach(function(done) {
            element = helpers.createTextareaElement(true);
            setTimeout(done, helpers.loopDurationForTests);
          });

          afterEach(function() {
            element.parentNode.removeChild(element);
          });

          it("should have one textarea on the page", function() {
            expect(document.getElementsByTagName("textarea").length).toEqual(1);
          });

          it("should have 0 inputs on the page", function() {
            expect(document.getElementsByTagName("input").length).toEqual(0);
          });

          it("should have placekeeper enabled", function() {
            expect(placekeeper.isEnabled()).toEqual(true);
          });

        });

      });

    });

  });

});
