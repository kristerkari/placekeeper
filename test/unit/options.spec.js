describe("plugin options", function() {
  "use strict";

  beforeEach(helpers.initialSetup);

  describe("root element data attributes", function() {

    describe("data-placeholder-mode attribute", function() {

      describe("when set to \"input\" in html element", function() {

        beforeEach(function() {
          document.documentElement.setAttribute("data-placeholder-mode", "input");
          helpers.spyOnNativeSupportAndReturn(false);
          placekeeper.priv.__init();
        });

        afterEach(function() {
          document.documentElement.removeAttribute("data-placeholder-mode");
        });

        it("should have focus mode disabled", function() {
          expect(placekeeper.isFocusEnabled()).toEqual(false);
        });

      });

      describe("when set to \"input\" in body element", function() {

        beforeEach(function() {
          document.body.setAttribute("data-placeholder-mode", "input");
          helpers.spyOnNativeSupportAndReturn(false);
          placekeeper.priv.__init();
        });

        afterEach(function() {
          document.body.removeAttribute("data-placeholder-mode");
        });

        it("should have focus mode disabled", function() {
          expect(placekeeper.isFocusEnabled()).toEqual(false);
        });

      });

      describe("when set to \"focus\" in html element", function() {

        beforeEach(function() {
          document.documentElement.setAttribute("data-placeholder-mode", "focus");
          helpers.spyOnNativeSupportAndReturn(false);
          placekeeper.priv.__init();
        });

        afterEach(function() {
          document.documentElement.removeAttribute("data-placeholder-mode");
        });

        it("should have focus mode enabled", function() {
          expect(placekeeper.isFocusEnabled()).toEqual(true);
        });

      });

      describe("when set to \"focus\" in body element", function() {

        beforeEach(function() {
          document.body.setAttribute("data-placeholder-mode", "focus");
          helpers.spyOnNativeSupportAndReturn(false);
          placekeeper.priv.__init();
        });

        afterEach(function() {
          document.body.removeAttribute("data-placeholder-mode");
        });

        it("should have focus mode enabled", function() {
          expect(placekeeper.isFocusEnabled()).toEqual(true);
        });

      });

    });

    describe("data-placeholder-live attribute", function() {

      describe("when set to false in html element", function() {

        beforeEach(function() {
          document.documentElement.setAttribute("data-placeholder-live", "false");
          helpers.spyOnNativeSupportAndReturn(false);
          placekeeper.priv.__init();
        });

        afterEach(function() {
          document.documentElement.removeAttribute("data-placeholder-live");
        });

        describe("and when an element with placeholder is added", function() {
          var element;

          beforeEach(function() {
            element = helpers.createInputElement(true);
          });

          afterEach(function() {
            element.parentNode.removeChild(element);
            placekeeper.disable();
          });

          it("should have placekeeper disabled", function() {
            expect(placekeeper.isEnabled()).toEqual(false);
          });

        });

      });

      describe("when set to true in html element", function() {

        beforeEach(function() {
          document.documentElement.setAttribute("data-placeholder-live", "true");
          helpers.spyOnNativeSupportAndReturn(false);
          placekeeper.priv.__init();
        });

        afterEach(function() {
          document.documentElement.removeAttribute("data-placeholder-live");
        });

        describe("and when an element with placeholder is added", function() {
          var element;

          beforeEach(function(done) {
            element = helpers.createInputElement(true);
            setTimeout(done, 110);
          });

          afterEach(function() {
            element.parentNode.removeChild(element);
            placekeeper.disable();
          });

          it("should have placekeeper enabled", function() {
            expect(placekeeper.isEnabled()).toEqual(true);
          });

        });

      });

      describe("when set to false in body element", function() {

        beforeEach(function() {
          document.body.setAttribute("data-placeholder-live", "false");
          helpers.spyOnNativeSupportAndReturn(false);
          placekeeper.priv.__init();
        });

        afterEach(function() {
          document.body.removeAttribute("data-placeholder-live");
        });

        describe("and when an element with placeholder is added", function() {
          var element;

          beforeEach(function() {
            element = helpers.createInputElement(true);
          });

          afterEach(function() {
            element.parentNode.removeChild(element);
            placekeeper.disable();
          });

          it("should have placekeeper disabled", function() {
            expect(placekeeper.isEnabled()).toEqual(false);
          });

        });

      });

      describe("when set to true in body element", function() {

        beforeEach(function() {
          document.body.setAttribute("data-placeholder-live", "true");
          helpers.spyOnNativeSupportAndReturn(false);
          placekeeper.priv.__init();
        });

        afterEach(function() {
          document.body.removeAttribute("data-placeholder-live");
        });

        describe("and when an element with placeholder is added", function() {
          var element;

          beforeEach(function(done) {
            element = helpers.createInputElement(true);
            setTimeout(done, 110);
          });

          afterEach(function() {
            element.parentNode.removeChild(element);
            placekeeper.disable();
          });

          it("should have placekeeper enabled", function() {
            expect(placekeeper.isEnabled()).toEqual(true);
          });

        });

      });

    });

  });

});
