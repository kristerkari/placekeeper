import * as helpers from "../utils/helpers.js"
import * as placekeeper from "../../src/main.js"

describe("changing placeholder", () => {
  "use strict"

  beforeEach(helpers.initialSetup)

  describe("when a password input with placeholder exists on the page", () => {
    let element

    beforeEach((done) => {
      helpers.spyOnCanChangeToTypeAndReturn(false)
      helpers.spyOnNativeSupportAndReturn(false)
      element = helpers.createInputElement(true, "password")
      setTimeout(() => {
        element = document.getElementById("elem")
        done()
      }, helpers.loopDurationForTests)
      placekeeper.init()
    })

    afterEach(() => {
      element.parentNode.removeChild(element)
    })

    it("should have data-placeholder-active set to true", () => {
      expect(element.getAttribute("data-placeholder-active")).toEqual("true")
    })

    it("should have placeholder class", () => {
      expect(element).toHaveClass("placeholder")
    })

    it("should have placeholder as value", () => {
      expect(element.value).toEqual("Test")
    })

    describe("and when placeholder is changed", () => {

      beforeEach((done) => {
        element.setAttribute("placeholder", "Changed")
        setTimeout(() => {
          element = document.getElementById("elem")
          done()
        }, helpers.loopDurationForTests)
      })

      it("should have data-placeholder-active set to true", () => {
        expect(element.getAttribute("data-placeholder-active")).toEqual("true")
      })

      it("should have placeholder class", () => {
        expect(element).toHaveClass("placeholder")
      })

      it("should have placeholder as value", () => {
        expect(element.value).toEqual("Changed")
      })

      describe("and when input is focused after that", () => {

        beforeEach((done) => {
          helpers.retryFocus(element, () => {
            setTimeout(() => {
              element = document.getElementById("elem")
              done()
            }, helpers.loopDurationForTests)
          })
        })

        it("should have removed element's value", () => {
          expect(element.value).toEqual("")
        })

        it("should have removed data-placeholder-active", () => {
          expect(element.getAttribute("data-placeholder-active")).toEqual(null)
        })

        it("should have removed placeholder class", () => {
          expect(element).not.toHaveClass("placeholder")
        })

      })

    })

  })

  describe("when a text input with placeholder exists on the page", () => {
    let element

    beforeEach((done) => {
      helpers.spyOnCanChangeToTypeAndReturn(false)
      helpers.spyOnNativeSupportAndReturn(false)
      element = helpers.createInputElement(true)
      setTimeout(done, helpers.loopDurationForTests)
      placekeeper.init()
    })

    afterEach(() => {
      element.parentNode.removeChild(element)
    })

    it("should have data-placeholder-active set to true", () => {
      expect(element.getAttribute("data-placeholder-active")).toEqual("true")
    })

    it("should have placeholder class", () => {
      expect(element).toHaveClass("placeholder")
    })

    it("should have placeholder as value", () => {
      expect(element.value).toEqual("Test")
    })

    describe("and when placeholder is changed", () => {

      beforeEach((done) => {
        element.setAttribute("placeholder", "Changed")
        setTimeout(done, helpers.loopDurationForTests)
      })

      it("should have data-placeholder-active set to true", () => {
        expect(element.getAttribute("data-placeholder-active")).toEqual("true")
      })

      it("should have placeholder class", () => {
        expect(element).toHaveClass("placeholder")
      })

      it("should have placeholder as value", () => {
        expect(element.value).toEqual("Changed")
      })

    })

  })

})
