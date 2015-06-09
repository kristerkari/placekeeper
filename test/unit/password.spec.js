describe("password inputs", function() {
  "use strict";

  beforeEach(helpers.initialSetup);

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

      it("should have changed password input type to text when there is no focus", function() {
        expect(element.getAttribute("type")).toEqual("text");
      });

      describe("and when input is focused", function() {

        beforeEach(function(done) {
          spyOn(placekeeper.polyfill, "hidePlaceholder").and.callThrough();
          helpers.retryFocus(element, function() {
            setTimeout(done, helpers.loopDurationForTests);
          });
        });

        it("should have changed element type back to password", function() {
          expect(element.getAttribute("type")).toEqual("password");
        });

        it("should have called polyfill's hidePlaceholder method", function() {
          expect(placekeeper.polyfill.hidePlaceholder).toHaveBeenCalledWith(element);
          expect(placekeeper.polyfill.hidePlaceholder.calls.count()).toEqual(1);
        });

      });
    }

  });

  describe("when there is a disabled password input on the page and input type can not be changed", function() {
    var element;
    var clone;

    beforeEach(function(done) {
      helpers.spyOnCanChangeToTypeAndReturn(false);
      element = helpers.createDisabledInputElement(true, "password");
      setTimeout(function() {
        clone = document.getElementById("elem");
        done();
      }, helpers.loopDurationForTests);
      placekeeper.priv.__setupPlaceholders();
    });

    afterEach(function() {
      element.parentNode.removeChild(element);
    });

    it("should have two inputs on the page", function() {
      expect(document.getElementsByTagName("input").length).toEqual(2);
    });

    it("should have changed password input type to text when there is no focus", function() {
      expect(clone.getAttribute("type")).toEqual("text");
    });

    it("should have added elem id to clone", function() {
      expect(clone.id).toEqual("elem");
    });

    it("should have replacement shown", function() {
      expect(clone.style.display).toEqual("block");
    });

    it("should have removed id from element", function() {
      expect(element.id).toEqual("");
    });

    it("should have element hidden", function() {
      expect(element.style.display).toEqual("none");
    });

    it("should have element disabled", function() {
      expect(element.disabled).toEqual(true);
    });

    it("should have clone disabled", function() {
      expect(clone.disabled).toEqual(true);
    });

    describe("and when input is enabled with prop", function() {

      beforeEach(function(done) {
        clone.disabled = false;
        placekeeper.priv.__setupPlaceholders();
        setTimeout(done, helpers.loopDurationForTests);
      });

      it("should have element enabled", function() {
        expect(element.disabled).toEqual(false);
      });

      it("should have clone enabled", function() {
        expect(clone.disabled).toEqual(false);
      });

    });

    describe("and when input is enabled with attribute", function() {

      beforeEach(function(done) {
        clone.removeAttribute("disabled");
        placekeeper.priv.__setupPlaceholders();
        setTimeout(done, helpers.loopDurationForTests);
      });

      it("should have element enabled", function() {
        expect(element.disabled).toEqual(false);
      });

      it("should have clone enabled", function() {
        expect(clone.disabled).toEqual(false);
      });

      describe("and when input is focused", function() {

        beforeEach(function(done) {
          spyOn(placekeeper.polyfill, "hidePlaceholder").and.callThrough();
          helpers.retryFocus(clone, function() {
            setTimeout(function() {
              element = document.getElementById("elem");
              done();
            }, helpers.loopDurationForTests);
          });
        });

        it("should have two inputs on the page", function() {
          expect(document.getElementsByTagName("input").length).toEqual(2);
        });

        it("should have changed element type back to password", function() {
          expect(element.getAttribute("type")).toEqual("password");
        });

        it("should have elem id back to element", function() {
          expect(element.id).toEqual("elem");
        });

        it("should have element shown", function() {
          expect(element.style.display).toEqual("block");
        });

        it("should have remove id from clone", function() {
          expect(clone.id).toEqual("");
        });

        it("should have clone hidden", function() {
          expect(clone.style.display).toEqual("none");
        });

        it("should have called polyfill's hidePlaceholder method", function() {
          expect(placekeeper.polyfill.hidePlaceholder).toHaveBeenCalledWith(clone);
        });

        describe("and when input is disabled", function() {

          beforeEach(function(done) {
            element.disabled = true;
            placekeeper.priv.__setupPlaceholders();
            setTimeout(done, helpers.loopDurationForTests);
          });

          it("should have element disabled", function() {
            expect(element.disabled).toEqual(true);
          });

          it("should have clone disabled", function() {
            expect(clone.disabled).toEqual(true);
          });

        });

        describe("and when there is a value and input is blurred", function() {

          beforeEach(function(done) {
            spyOn(placekeeper.polyfill, "showPlaceholder").and.callThrough();
            element.value = "testing";
            helpers.blur(element);
            setTimeout(done, helpers.loopDurationForTests);
          });

          it("should have two inputs on the page", function() {
            expect(document.getElementsByTagName("input").length).toEqual(2);
          });

          it("should have elem id set to element", function() {
            expect(element.id).toEqual("elem");
          });

          it("should have element shown", function() {
            expect(element.style.display).toEqual("block");
          });

          it("should have remove id from clone", function() {
            expect(clone.id).toEqual("");
          });

          it("should have clone hidden", function() {
            expect(clone.style.display).toEqual("none");
          });

          it("should have called polyfill's showPlaceholder method", function() {
            expect(placekeeper.polyfill.showPlaceholder).toHaveBeenCalledWith(element);
          });

        });

        describe("and when the input is blurred after that", function() {

          beforeEach(function(done) {
            spyOn(placekeeper.polyfill, "showPlaceholder").and.callThrough();
            helpers.blur(element);
            setTimeout(function() {
              clone = document.getElementById("elem");
              done();
            }, helpers.loopDurationForTests);
          });

          it("should have two inputs on the page", function() {
            expect(document.getElementsByTagName("input").length).toEqual(2);
          });

          it("should have changed password input type to text", function() {
            expect(clone.getAttribute("type")).toEqual("text");
          });

          it("should have added elem id to clone", function() {
            expect(clone.id).toEqual("elem");
          });

          it("should have clone shown", function() {
            expect(clone.style.display).toEqual("block");
          });

          it("should have removed id from element", function() {
            expect(element.id).toEqual("");
          });

          it("should have element hidden", function() {
            expect(element.style.display).toEqual("none");
          });

          it("should have called polyfill's showPlaceholder method", function() {
            expect(placekeeper.polyfill.showPlaceholder).toHaveBeenCalledWith(element);
          });

        });

      });

      describe("and when input is disabled again", function() {

        beforeEach(function(done) {
          clone.disabled = true;
          placekeeper.priv.__setupPlaceholders();
          setTimeout(done, helpers.loopDurationForTests);
        });

        it("should have element disabled", function() {
          expect(element.disabled).toEqual(true);
        });

        it("should have clone disabled", function() {
          expect(clone.disabled).toEqual(true);
        });

      });

    });

  });

  describe("when there is a password input on the page and input type can not be changed", function() {
    var element;
    var clone;

    beforeEach(function(done) {
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

    it("should have two inputs on the page", function() {
      expect(document.getElementsByTagName("input").length).toEqual(2);
    });

    it("should have changed password input type to text when there is no focus", function() {
      expect(clone.getAttribute("type")).toEqual("text");
    });

    it("should have added elem id to clone", function() {
      expect(clone.id).toEqual("elem");
    });

    it("should have replacement shown", function() {
      expect(clone.style.display).toEqual("block");
    });

    it("should have removed id from element", function() {
      expect(element.id).toEqual("");
    });

    it("should have element hidden", function() {
      expect(element.style.display).toEqual("none");
    });

    describe("and when input is focused", function() {

      beforeEach(function(done) {
        spyOn(placekeeper.polyfill, "hidePlaceholder").and.callThrough();
        helpers.retryFocus(clone, function() {
          setTimeout(function() {
            element = document.getElementById("elem");
            done();
          }, helpers.loopDurationForTests);
        });
      });

      it("should have two inputs on the page", function() {
        expect(document.getElementsByTagName("input").length).toEqual(2);
      });

      it("should have changed element type back to password", function() {
        expect(element.getAttribute("type")).toEqual("password");
      });

      it("should have elem id back to element", function() {
        expect(element.id).toEqual("elem");
      });

      it("should have element shown", function() {
        expect(element.style.display).toEqual("block");
      });

      it("should have remove id from clone", function() {
        expect(clone.id).toEqual("");
      });

      it("should have clone hidden", function() {
        expect(clone.style.display).toEqual("none");
      });

      it("should have called polyfill's hidePlaceholder method", function() {
        expect(placekeeper.polyfill.hidePlaceholder).toHaveBeenCalledWith(clone);
      });

      describe("and when there is a value and input is blurred", function() {

        beforeEach(function(done) {
          spyOn(placekeeper.polyfill, "showPlaceholder").and.callThrough();
          element.value = "testing";
          helpers.blur(element);
          setTimeout(done, helpers.loopDurationForTests);
        });

        it("should have two inputs on the page", function() {
          expect(document.getElementsByTagName("input").length).toEqual(2);
        });

        it("should have elem id set to element", function() {
          expect(element.id).toEqual("elem");
        });

        it("should have element shown", function() {
          expect(element.style.display).toEqual("block");
        });

        it("should have remove id from clone", function() {
          expect(clone.id).toEqual("");
        });

        it("should have clone hidden", function() {
          expect(clone.style.display).toEqual("none");
        });

        it("should have called polyfill's showPlaceholder method", function() {
          expect(placekeeper.polyfill.showPlaceholder).toHaveBeenCalledWith(element);
        });

      });

      describe("and when the input is blurred after that", function() {

        beforeEach(function(done) {
          spyOn(placekeeper.polyfill, "showPlaceholder").and.callThrough();
          helpers.blur(element);
          setTimeout(function() {
            clone = document.getElementById("elem");
            done();
          }, helpers.loopDurationForTests);
        });

        it("should have two inputs on the page", function() {
          expect(document.getElementsByTagName("input").length).toEqual(2);
        });

        it("should have changed password input type to text", function() {
          expect(clone.getAttribute("type")).toEqual("text");
        });

        it("should have added elem id to clone", function() {
          expect(clone.id).toEqual("elem");
        });

        it("should have clone shown", function() {
          expect(clone.style.display).toEqual("block");
        });

        it("should have removed id from element", function() {
          expect(element.id).toEqual("");
        });

        it("should have element hidden", function() {
          expect(element.style.display).toEqual("none");
        });

        it("should have called polyfill's showPlaceholder method", function() {
          expect(placekeeper.polyfill.showPlaceholder).toHaveBeenCalledWith(element);
        });

      });

    });

  });

  describe("when there is an input on the page that is not password or text type", function() {
    var element;

    beforeEach(function(done) {
      element = helpers.createInputElement(true, "email");
      placekeeper.priv.__setupPlaceholders();
      setTimeout(done, helpers.loopDurationForTests);
    });

    afterEach(function() {
      element.parentNode.removeChild(element);
    });

    it("should have changed password input type to text when there is no focus", function() {
      expect(element.getAttribute("type")).toEqual("email");
    });

    describe("and when input is focused", function() {

      beforeEach(function(done) {
        spyOn(placekeeper.polyfill, "hidePlaceholder").and.callThrough();
        helpers.focus(element);
        setTimeout(done, helpers.loopDurationForTests);
      });

      it("should have changed element type back to password", function() {
        expect(element.getAttribute("type")).toEqual("email");
      });

      it("should have called polyfill's hidePlaceholder method", function() {
        expect(placekeeper.polyfill.hidePlaceholder).toHaveBeenCalledWith(element);
        expect(placekeeper.polyfill.hidePlaceholder.calls.count()).toEqual(1);
      });

    });

  });

});
