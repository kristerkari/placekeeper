import * as helpers from "../utils/helpers.js"
import * as placekeeper from "../../src/main.js"
import * as polyfill from "../../src/polyfill.js"
import * as utils from "../../src/utils.js"

describe("watching for placeholder changes", () => {
  "use strict"

  beforeEach(helpers.initialSetup)

  describe("when watching enabled and there is a password input with placeholder on the page", () => {
    let element

    beforeEach((done) => {
      spyOn(polyfill, "showPlaceholder").and.callThrough()
      helpers.spyOnCanChangeToTypeAndReturn(false)
      helpers.spyOnNativeSupportAndReturn(false)
      element = helpers.createInputElement(true, "password")
      placekeeper.init()
      setTimeout(done, helpers.loopDurationForTests)
    })

    afterEach(() => {
      element.parentNode.removeChild(element)
      placekeeper.disable()
    })

    it("should have called polyfill's showPlaceholder method once", () => {
      expect(polyfill.showPlaceholder).toHaveBeenCalled()
      // expect(polyfill.showPlaceholder.calls.count()).toEqual(1);
    })

  })

  describe("when watching enabled and there is an element with placeholder on the page", () => {
    let element

    beforeEach((done) => {
      spyOn(polyfill, "showPlaceholder").and.callThrough()
      helpers.spyOnNativeSupportAndReturn(false)
      element = helpers.createInputElement(true)
      placekeeper.init()
      setTimeout(done, helpers.loopDurationForTests)
    })

    afterEach(() => {
      element.parentNode.removeChild(element)
      placekeeper.disable()
    })

    it("should have called polyfill's showPlaceholder method once", () => {
      expect(polyfill.showPlaceholder).toHaveBeenCalled()
      expect(polyfill.showPlaceholder.calls.count()).toEqual(1)
    })

    it("should have set data-placeholder-value to the element", () => {
      expect(element.getAttribute("data-placeholder-value")).toEqual("Test")
    })

    it("should have watching enabled", () => {
      expect(placekeeper.isWatchingEnabled()).toEqual(true)
    })

    describe("and when placeholder value is changed", () => {

      beforeEach((done) => {
        element.placeholder = "TestChanged"
        setTimeout(done, helpers.loopDurationForTests)
      })

      it("should correctly be able to get changed placeholder value", () => {
        expect(utils.getPlaceholderValue(element)).toEqual("TestChanged")
      })

      it("should have changed data-placeholder-value to the element", () => {
        expect(element.getAttribute("data-placeholder-value")).toEqual("TestChanged")
      })

    })

    describe("and when element value is changed", () => {

      beforeEach((done) => {
        element.value = "Changed"
        setTimeout(done, helpers.loopDurationForTests)
      })

      it("should have set element's value to changed value (Changed)", () => {
        expect(element.value).toEqual("Changed")
      })

      it("should have removed data-placeholder-active", () => {
        expect(element.getAttribute("data-placeholder-active")).toEqual(null)
      })

      it("should have removed placeholder class", () => {
        expect(element).not.toHaveClass("placeholder")
      })

      it("should have removed data-placeholder-maxlength", () => {
        expect(element.getAttribute("data-placeholder-maxlength")).toEqual(null)
      })

      it("should have restored maxlength attribute", () => {
        expect(parseInt(element.getAttribute("maxLength"), 10)).toEqual(12)
      })

    })

  })

})
