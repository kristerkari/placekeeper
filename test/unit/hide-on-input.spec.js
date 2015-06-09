describe("hide on input mode", function() {
  "use strict";

  beforeEach(helpers.initialSetup);

  describe("hide on input mode", function() {

    describe("when there is a password input on the page and input type can not be changed", function() {
      var element;
      var clone;

      beforeEach(function(done) {
        helpers.spyOnFocusEnabledAndReturn(false);
        helpers.spyOnCanChangeToTypeAndReturn(false);
        element = helpers.createInputElement(true, "password");
        setTimeout(function() {
          clone = document.getElementById("elem");
          done();
        }, helpers.loopDurationForTests);
        placekeeper.priv.__setupPlaceholders();
      });

      afterEach(function() {
        element.parentNode.removeChild(element);
      });

      describe("and when input is focused", function() {

        beforeEach(function(done) {
          spyOn(placekeeper.polyfill, "hidePlaceholder").and.callThrough();
          spyOn(placekeeper.polyfill, "showPlaceholder").and.callThrough();
          helpers.retryFocus(clone, function() {
            setTimeout(function() {
              element = document.getElementById("elem");
              done();
            }, helpers.loopDurationForTests);
          });
        });

        describe("and when user writes letter 'a' (keydown, value, keyup)", function() {

          beforeEach(function(done) {
            triggerEvent.keyboard(element, "keydown", 65);
            element.value = "a";
            triggerEvent.keyboard(element, "keyup", 65);
            setTimeout(function() {
              element = document.getElementById("elem");
              done();
            }, helpers.loopDurationForTests);
          });

          it("should have element value as 'a'", function() {
            expect(element.value).toEqual("a");
          });

          it("should have clone value empty", function() {
            expect(clone.value).toEqual("");
          });

          it("should have removed data-placeholder-active", function() {
            expect(element.getAttribute("data-placeholder-active")).toEqual(null);
          });

          it("should have removed placeholder class", function() {
            expect(element).not.toHaveClass("placeholder");
          });

          it("should have called polyfill's hidePlaceholder method once", function() {
            expect(placekeeper.polyfill.hidePlaceholder).toHaveBeenCalledWith(clone);
            expect(placekeeper.polyfill.hidePlaceholder.calls.count()).toEqual(1);
          });

          it("should not have called polyfill's showPlaceholder method", function() {
            expect(placekeeper.polyfill.showPlaceholder).not.toHaveBeenCalled();
            expect(placekeeper.polyfill.showPlaceholder.calls.count()).toEqual(0);
          });

        });

      });

    });

    describe("when data-placeholder-focus is set to false and there is an input on the page", function() {
      var element;

      beforeEach(function() {
        spyOn(placekeeper.utils, "addEventListener").and.callThrough();
        helpers.spyOnFocusEnabledAndReturn(false);
        element = helpers.createInputElement(true);
        placekeeper.priv.__setupPlaceholders();
        placekeeper.mode.enableWatching();
      });

      afterEach(function() {
        element.parentNode.removeChild(element);
      });

      it("should have watching enabled", function() {
        expect(placekeeper.isWatchingEnabled()).toEqual(true);
      });

      it("should have called utils.addEventListener for keydown handler", function() {
        expect(placekeeper.utils.addEventListener)
        .toHaveBeenCalledWith(element, "keydown", placekeeper.events.handlers.keydown);
      });

      it("should have called utils.addEventListener for keyup handler", function() {
        expect(placekeeper.utils.addEventListener)
        .toHaveBeenCalledWith(element, "keyup", placekeeper.events.handlers.keyup);
      });

      it("should have called utils.addEventListener for click handler", function() {
        expect(placekeeper.utils.addEventListener)
        .toHaveBeenCalledWith(element, "click", placekeeper.events.handlers.click);
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

      describe("and when disable is called", function() {

        beforeEach(function() {
          spyOn(placekeeper.utils, "removeEventListener").and.callThrough();
          placekeeper.disable();
        });

        it("should have called utils.removeEventListener for keydown handler", function() {
          expect(placekeeper.utils.removeEventListener)
          .toHaveBeenCalledWith(element, "keydown", placekeeper.events.handlers.keydown);
        });

        it("should have called utils.removeEventListener for keyup handler", function() {
          expect(placekeeper.utils.removeEventListener)
          .toHaveBeenCalledWith(element, "keyup", placekeeper.events.handlers.keyup);
        });

        it("should have called utils.removeEventListener for click handler", function() {
          expect(placekeeper.utils.removeEventListener)
          .toHaveBeenCalledWith(element, "click", placekeeper.events.handlers.click);
        });

      });

      describe("and when a click event is triggered on the element", function() {

        beforeEach(function() {
          spyOn(placekeeper.utils, "moveCaret");
          triggerEvent.html(element, "click");
        });

        it("should not have called moveCaret method", function() {
          expect(placekeeper.utils.moveCaret).not.toHaveBeenCalled();
          expect(placekeeper.utils.moveCaret.calls.count()).toEqual(0);
        });

      });

      describe("and when click event is triggered after element is focused", function() {

        beforeEach(function() {
          triggerEvent.html(element, "focus");
          element.focus();
          spyOn(placekeeper.utils, "moveCaret");
          triggerEvent.html(element, "click");
        });

        it("element should be activeElement", function() {
          expect(element).toEqual(placekeeper.support.safeActiveElement());
        });

        it("should have called moveCaret method", function() {
          expect(placekeeper.utils.moveCaret).toHaveBeenCalledWith(element, 0);
          expect(placekeeper.utils.moveCaret.calls.count()).toEqual(1);
        });

      });

      describe("and when input is focused", function() {

        beforeEach(function() {
          spyOn(placekeeper.utils, "moveCaret").and.callThrough();
          spyOn(placekeeper.polyfill, "hidePlaceholder").and.callThrough();
          triggerEvent.html(element, "focus");
          element.focus();
        });

        it("element should be activeElement", function() {
          expect(element).toEqual(placekeeper.support.safeActiveElement());
        });

        it("should not have called polyfill's hidePlaceholder method", function() {
          expect(placekeeper.polyfill.hidePlaceholder).not.toHaveBeenCalled();
          expect(placekeeper.polyfill.hidePlaceholder.calls.count()).toEqual(0);
        });

        it("should have moved caret to the beginning", function() {
          expect(placekeeper.utils.moveCaret).toHaveBeenCalledWith(element, 0);
        });

        it("should not have emptied the placeholder value", function() {
          expect(element.value).toEqual("Test");
        });

        it("should have set data-placeholder-active to true", function() {
          expect(element.getAttribute("data-placeholder-active")).toEqual("true");
        });

        it("should have added placeholder class", function() {
          expect(element).toHaveClass("placeholder");
        });

        describe("when enter is pressed and value does not change (keydown, keyup)", function() {

          beforeEach(function() {
            triggerEvent.keyboard(element, "keydown", 13);
            triggerEvent.keyboard(element, "keyup", 13);
          });

          it("should not have called polyfill's hidePlaceholder method", function() {
            expect(placekeeper.polyfill.hidePlaceholder).not.toHaveBeenCalled();
            expect(placekeeper.polyfill.hidePlaceholder.calls.count()).toEqual(0);
          });

          it("should not have emptied the placeholder value", function() {
            expect(element.value).toEqual("Test");
          });

          it("should have set data-placeholder-active to true", function() {
            expect(element.getAttribute("data-placeholder-active")).toEqual("true");
          });

          it("should have added placeholder class", function() {
            expect(element).toHaveClass("placeholder");
          });

        });

        describe("and when user writes letter 'a' (keydown, value, keyup)", function() {

          beforeEach(function() {
            triggerEvent.keyboard(element, "keydown", 65);
            element.value = "a";
            triggerEvent.keyboard(element, "keyup", 65);
          });

          it("should have called polyfill's hidePlaceholder method", function() {
            expect(placekeeper.polyfill.hidePlaceholder).toHaveBeenCalledWith(element);
            expect(placekeeper.polyfill.hidePlaceholder.calls.count()).toEqual(1);
          });

          it("should have element value as 'a'", function() {
            expect(element.value).toEqual("a");
          });

          it("should have removed data-placeholder-active", function() {
            expect(element.getAttribute("data-placeholder-active")).toEqual(null);
          });

          it("should have removed placeholder class", function() {
            expect(element).not.toHaveClass("placeholder");
          });

        });

        describe("and when user presses backspace on the input (keyup, keydown)", function() {

          beforeEach(function() {
            spyOn(placekeeper.utils, "preventDefault");
            triggerEvent.keyboard(element, "keydown", 8);
            triggerEvent.keyboard(element, "keyup", 8);
          });

          it("should have called utils.preventDefault method", function() {
            expect(placekeeper.utils.preventDefault).toHaveBeenCalled();
            expect(placekeeper.utils.preventDefault.calls.count()).toEqual(1);
          });

          it("should not have called polyfill's hidePlaceholder method", function() {
            expect(placekeeper.polyfill.hidePlaceholder).not.toHaveBeenCalled();
            expect(placekeeper.polyfill.hidePlaceholder.calls.count()).toEqual(0);
          });

        });

      });

      describe("and when disable is called", function() {

        beforeEach(function() {
          spyOn(placekeeper.utils, "removeEventListener").and.callThrough();
          placekeeper.disable();
        });

        it("should have remove all data-attributes from element", function() {
          expect(element).toHaveNoDataAttributes();
        });

        it("should have called utils.removeEventListener for keydown handler", function() {
          expect(placekeeper.utils.removeEventListener)
          .toHaveBeenCalledWith(element, "keydown", placekeeper.events.handlers.keydown);
        });

        it("should have called utils.removeEventListener for keyup handler", function() {
          expect(placekeeper.utils.removeEventListener)
          .toHaveBeenCalledWith(element, "keyup", placekeeper.events.handlers.keyup);
        });

        it("should have called utils.removeEventListener for click handler", function() {
          expect(placekeeper.utils.removeEventListener)
          .toHaveBeenCalledWith(element, "click", placekeeper.events.handlers.click);
        });

      });

    });

  });

});
