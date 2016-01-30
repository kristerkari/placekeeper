import * as helpers from "../utils/helpers.js"
import * as placekeeper from "../../src/main.js"
import * as polyfill from "../../src/polyfill.js"

describe("changing value", () => {
  "use strict"

  beforeEach(helpers.initialSetup)

  describe("when there is an input with placeholder and existing value on the page", () => {
    let element

    beforeEach((done) => {
      helpers.spyOnCanChangeToTypeAndReturn(false)
      helpers.spyOnNativeSupportAndReturn(false)
      element = helpers.createInputElementWithValue(true)
      setTimeout(done, helpers.loopDurationForTests)
      placekeeper.init()
    })

    afterEach(() => {
      element.parentNode.removeChild(element)
    })

    describe("when input value does not change", () => {

      beforeEach((done) => {
        spyOn(polyfill, "hidePlaceholder").and.callThrough()
        setTimeout(done, helpers.loopDurationForTests)
      })

      it("should not have called hidePlaceholder", () => {
        expect(polyfill.hidePlaceholder).not.toHaveBeenCalled()
        expect(polyfill.hidePlaceholder.calls.count()).toEqual(0)
      })

    })

    describe("when input value changes", () => {

      beforeEach((done) => {
        spyOn(polyfill, "hidePlaceholder").and.callThrough()
        element.value = "Changed"
        setTimeout(done, helpers.loopDurationForTests)
      })

      it("should not have called hidePlaceholder", () => {
        expect(polyfill.hidePlaceholder).not.toHaveBeenCalled()
        expect(polyfill.hidePlaceholder.calls.count()).toEqual(0)
      })

      it("should have changed element value", () => {
        expect(element.value).toEqual("Changed")
      })

    })

  })

})
