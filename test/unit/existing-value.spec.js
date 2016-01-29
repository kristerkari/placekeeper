import * as helpers from "../utils/helpers.js"
import * as placekeeper from "../../src/main.js"
import * as polyfill from "../../src/polyfill.js"
import * as utils from "../../src/utils.js"

describe("existing value", () => {
  "use strict"

  beforeEach(helpers.initialSetup)

  describe("when input type can not be changed, and there is a password input with placeholder and existing value on the page", () => {
    let element
    let clone

    beforeEach((done) => {
      spyOn(polyfill, "showPlaceholder").and.callThrough()
      helpers.spyOnCanChangeToTypeAndReturn(false)
      helpers.spyOnNativeSupportAndReturn(false)
      element = helpers.createInputElementWithValue(true, "password")
      setTimeout(() => {
        clone = element.previousSibling
        done()
      }, helpers.loopDurationForTests)
      placekeeper.init()
    })

    afterEach(() => {
      clone.parentNode.removeChild(clone)
      element.parentNode.removeChild(element)
    })

    it("should not have called polyfill's showPlaceholder method", () => {
      expect(polyfill.showPlaceholder).not.toHaveBeenCalled()
      expect(polyfill.showPlaceholder.calls.count()).toEqual(0)
    })

    it("should keep element value as it is", () => {
      expect(element.value).toEqual("MyVal")
    })

    it("should not have set data-placeholder-active", () => {
      expect(element.getAttribute("data-placeholder-active")).toEqual(null)
    })

    it("should not have added placeholder class", () => {
      expect(element).not.toHaveClass("placeholder")
    })

    it("should not have element hidden", () => {
      expect(element.style.display).not.toEqual("none")
    })

    it("should have clone hidden", () => {
      expect(clone.style.display).toEqual("none")
    })

    it("should have id set", () => {
      expect(element.id).toEqual("elem")
    })

    it("should not have clone id set", () => {
      expect(clone.id).toEqual("")
    })

    it("should have set password input type to password", () => {
      expect(element.getAttribute("type")).toEqual("password")
    })

    describe("and when element is focused", () => {

      beforeEach(() => {
        spyOn(utils, "moveCaret")
        helpers.focus(element)
      })

      it("should not have moved the caret to the beginning of the text field", () => {
        expect(utils.moveCaret).not.toHaveBeenCalled()
      })

      it("should keep element value as it is", () => {
        expect(element.value).toEqual("MyVal")
      })

      it("should keep type as it is", () => {
        expect(element.getAttribute("type")).toEqual("password")
      })

      it("should not have set data-placeholder-active", () => {
        expect(element.getAttribute("data-placeholder-active")).toEqual(null)
      })

      it("should not have added placeholder class", () => {
        expect(element).not.toHaveClass("placeholder")
      })

      it("should not have element hidden", () => {
        expect(element.style.display).not.toEqual("none")
      })

      it("should have clone hidden", () => {
        expect(clone.style.display).toEqual("none")
      })

      it("should have id set", () => {
        expect(element.id).toEqual("elem")
      })

      it("should not have clone id set", () => {
        expect(clone.id).toEqual("")
      })

    })

    describe("and when value is changed", () => {

      beforeEach((done) => {
        element.value = "Changed"
        setTimeout(done, helpers.loopDurationForTests)
      })

      it("should have kept element's value", () => {
        expect(element.value).toEqual("Changed")
      })

      it("should not have set data-placeholder-active", () => {
        expect(element.getAttribute("data-placeholder-active")).toEqual(null)
      })

      it("should not have added placeholder class", () => {
        expect(element).not.toHaveClass("placeholder")
      })

    })

    describe("and when value is removed", () => {

      beforeEach((done) => {
        element.value = ""
        setTimeout(() => {
          clone = element.previousSibling
          done()
        }, helpers.loopDurationForTests)
      })

      it("should have set clone's value to placeholder value (Test)", () => {
        expect(clone.value).toEqual("Test")
      })

      it("should have set data-placeholder-active to true", () => {
        expect(clone.getAttribute("data-placeholder-active")).toEqual("true")
      })

      it("should have added placeholder class", () => {
        expect(clone).toHaveClass("placeholder")
      })

      it("should not have id set", () => {
        expect(element.id).toEqual("")
      })

      it("should have clone id set", () => {
        expect(clone.id).toEqual("elem")
      })

      it("should have element hidden", () => {
        expect(element.style.display).toEqual("none")
      })

      it("should not have clone hidden", () => {
        expect(clone.style.display).not.toEqual("none")
      })

    })

  })

  describe("when there is an input with placeholder and existing value on the page", () => {
    let element

    beforeEach((done) => {
      element = helpers.createInputElementWithValue(true)
      placekeeper.setupPlaceholders()
      setTimeout(done, helpers.loopDurationForTests)
    })

    afterEach(() => {
      element.parentNode.removeChild(element)
    })

    it("should keep element value as it is", () => {
      expect(element.value).toEqual("MyVal")
    })

    it("should not have set data-placeholder-active", () => {
      expect(element.getAttribute("data-placeholder-active")).toEqual(null)
    })

    it("should not have added placeholder class", () => {
      expect(element).not.toHaveClass("placeholder")
    })

    describe("and when element is focused", () => {

      beforeEach(() => {
        spyOn(utils, "moveCaret")
        helpers.focus(element)
      })

      it("should not have moved the caret to the beginning of the text field", () => {
        expect(utils.moveCaret).not.toHaveBeenCalled()
      })

    })

  })

  describe("when there is a textarea with placeholder and existing value on the page", () => {
    let element

    beforeEach((done) => {
      element = helpers.createTextareaElementWithValue(true)
      placekeeper.setupPlaceholders()
      setTimeout(done, helpers.loopDurationForTests)
    })

    afterEach(() => {
      element.parentNode.removeChild(element)
    })

    it("should keep element value as it is", () => {
      expect(element.value).toEqual("MyVal")
    })

    it("should not have set data-placeholder-active", () => {
      expect(element.getAttribute("data-placeholder-active")).toEqual(null)
    })

    it("should not have added placeholder class", () => {
      expect(element).not.toHaveClass("placeholder")
    })

  })

})
