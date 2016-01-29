import * as helpers from "../utils/helpers.js"
import * as placekeeper from "../../src/main.js"

describe("plugin options", () => {
  "use strict"

  beforeEach(helpers.initialSetup)

  describe("root element data attributes", () => {

    describe("data-placeholder-mode attribute", () => {

      describe("when set to \"input\" in html element", () => {

        beforeEach(() => {
          document.documentElement.setAttribute("data-placeholder-mode", "input")
          helpers.spyOnNativeSupportAndReturn(false)
          placekeeper.init()
        })

        afterEach(() => {
          document.documentElement.removeAttribute("data-placeholder-mode")
        })

        it("should have focus mode disabled", () => {
          expect(placekeeper.isFocusEnabled()).toEqual(false)
        })

      })

      describe("when set to \"input\" in body element", () => {

        beforeEach(() => {
          document.body.setAttribute("data-placeholder-mode", "input")
          helpers.spyOnNativeSupportAndReturn(false)
          placekeeper.init()
        })

        afterEach(() => {
          document.body.removeAttribute("data-placeholder-mode")
        })

        it("should have focus mode disabled", () => {
          expect(placekeeper.isFocusEnabled()).toEqual(false)
        })

      })

      describe("when set to \"focus\" in html element", () => {

        beforeEach(() => {
          document.documentElement.setAttribute("data-placeholder-mode", "focus")
          helpers.spyOnNativeSupportAndReturn(false)
          placekeeper.init()
        })

        afterEach(() => {
          document.documentElement.removeAttribute("data-placeholder-mode")
        })

        it("should have focus mode enabled", () => {
          expect(placekeeper.isFocusEnabled()).toEqual(true)
        })

      })

      describe("when set to \"focus\" in body element", () => {

        beforeEach(() => {
          document.body.setAttribute("data-placeholder-mode", "focus")
          helpers.spyOnNativeSupportAndReturn(false)
          placekeeper.init()
        })

        afterEach(() => {
          document.body.removeAttribute("data-placeholder-mode")
        })

        it("should have focus mode enabled", () => {
          expect(placekeeper.isFocusEnabled()).toEqual(true)
        })

      })

    })

    describe("data-placeholder-live attribute", () => {

      describe("when set to false in html element", () => {

        beforeEach(() => {
          document.documentElement.setAttribute("data-placeholder-live", "false")
          helpers.spyOnNativeSupportAndReturn(false)
          placekeeper.init()
        })

        afterEach(() => {
          document.documentElement.removeAttribute("data-placeholder-live")
        })

        describe("and when an element with placeholder is added", () => {
          let element

          beforeEach(() => {
            element = helpers.createInputElement(true)
          })

          afterEach(() => {
            element.parentNode.removeChild(element)
            placekeeper.disable()
          })

          it("should have placekeeper disabled", () => {
            expect(placekeeper.isEnabled()).toEqual(false)
          })

        })

      })

      describe("when set to true in html element", () => {

        beforeEach(() => {
          document.documentElement.setAttribute("data-placeholder-live", "true")
          helpers.spyOnNativeSupportAndReturn(false)
          placekeeper.init()
        })

        afterEach(() => {
          document.documentElement.removeAttribute("data-placeholder-live")
        })

        describe("and when an element with placeholder is added", () => {
          let element

          beforeEach((done) => {
            element = helpers.createInputElement(true)
            setTimeout(done, 110)
          })

          afterEach(() => {
            element.parentNode.removeChild(element)
            placekeeper.disable()
          })

          it("should have placekeeper enabled", () => {
            expect(placekeeper.isEnabled()).toEqual(true)
          })

        })

      })

      describe("when set to false in body element", () => {

        beforeEach(() => {
          document.body.setAttribute("data-placeholder-live", "false")
          helpers.spyOnNativeSupportAndReturn(false)
          placekeeper.init()
        })

        afterEach(() => {
          document.body.removeAttribute("data-placeholder-live")
        })

        describe("and when an element with placeholder is added", () => {
          let element

          beforeEach(() => {
            element = helpers.createInputElement(true)
          })

          afterEach(() => {
            element.parentNode.removeChild(element)
            placekeeper.disable()
          })

          it("should have placekeeper disabled", () => {
            expect(placekeeper.isEnabled()).toEqual(false)
          })

        })

      })

      describe("when set to true in body element", () => {

        beforeEach(() => {
          document.body.setAttribute("data-placeholder-live", "true")
          helpers.spyOnNativeSupportAndReturn(false)
          placekeeper.init()
        })

        afterEach(() => {
          document.body.removeAttribute("data-placeholder-live")
        })

        describe("and when an element with placeholder is added", () => {
          let element

          beforeEach((done) => {
            element = helpers.createInputElement(true)
            setTimeout(done, 110)
          })

          afterEach(() => {
            element.parentNode.removeChild(element)
            placekeeper.disable()
          })

          it("should have placekeeper enabled", () => {
            expect(placekeeper.isEnabled()).toEqual(true)
          })

        })

      })

    })

  })

})
