import * as helpers from "../utils/helpers.js"
import * as placekeeper from "../../src/main.js"
import * as polyfill from "../../src/polyfill.js"
import * as utils from "../../src/utils.js"
import * as events from "../../src/events.js"

describe("forms", () => {
  "use strict"

  beforeEach(helpers.initialSetup)

  describe("when there is an element with placeholder and form attribute inside a form on the page", () => {
    let element
    let form

    beforeEach((done) => {
      element = helpers.createInputElementWithFormAttribute(true)
      form = document.getElementsByTagName("form")[0]
      placekeeper.setupPlaceholders()
      setTimeout(done, helpers.loopDurationForTests)
    })

    afterEach(() => {
      element.parentNode.removeChild(element)
    })

    describe("and when that form is submitted", () => {

      beforeEach(() => {
        spyOn(polyfill, "hidePlaceholder")
        spyOn(polyfill, "showPlaceholder")
        triggerEvent.html(form, "submit")
      })

      it("should have added data-placeholder-submit to the form", () => {
        expect(form.getAttribute("data-placeholder-submit")).toEqual("true")
      })

      it("should have called polyfill's hidePlaceholder method", () => {
        expect(polyfill.hidePlaceholder).toHaveBeenCalledWith(element)
        expect(polyfill.hidePlaceholder.calls.count()).toEqual(1)
      })

      it("should not have called polyfill's showPlaceholder method", () => {
        expect(polyfill.showPlaceholder).not.toHaveBeenCalled()
        expect(polyfill.showPlaceholder.calls.count()).toEqual(0)
      })

      describe("and after 10ms (when form is submitted)", () => {

        beforeEach((done) => {
          setTimeout(done, 10)
        })

        it("should have called polyfill's showPlaceholder method", () => {
          expect(polyfill.showPlaceholder).toHaveBeenCalledWith(element)
          expect(polyfill.showPlaceholder.calls.count()).toEqual(1)
        })

      })

    })

    describe("and when disable method is called", () => {
      let submitHandler

      beforeEach(() => {
        submitHandler = events.handlers.submit
        spyOn(utils, "removeEventListener")
        placekeeper.disable()
      })

      it("should have called utils.removeEventListener for submit handler", () => {
        expect(utils.removeEventListener)
        .toHaveBeenCalledWith(form, "submit", submitHandler)
      })

      it("should not have data-placeholder-submit set to the from", () => {
        expect(form.getAttribute("data-placeholder-submit")).toEqual(null)
      })

      it("should have deleted the submit handler", () => {
        expect(events.handlers.submit).not.toBeDefined()
      })

    })

  })

  describe("when there is an element without placeholder inside a form on the page", () => {
    let element
    let form

    beforeEach((done) => {
      element = helpers.createInputElementWithForm(false)
      form = document.getElementsByTagName("form")[0]
      placekeeper.setupPlaceholders()
      setTimeout(done, helpers.loopDurationForTests)
    })

    afterEach(() => {
      element.parentNode.removeChild(element)
    })

    describe("and when that form is submitted", () => {

      beforeEach(() => {
        spyOn(polyfill, "hidePlaceholder")
        spyOn(polyfill, "showPlaceholder")
        triggerEvent.html(form, "submit")
      })

      it("should not have added data-placeholder-submit to the form", () => {
        expect(form.getAttribute("data-placeholder-submit")).toEqual(null)
      })

      it("should not have called polyfill's hidePlaceholder method", () => {
        expect(polyfill.hidePlaceholder).not.toHaveBeenCalled()
        expect(polyfill.hidePlaceholder.calls.count()).toEqual(0)
      })

      it("should not have called polyfill's showPlaceholder method", () => {
        expect(polyfill.showPlaceholder).not.toHaveBeenCalled()
        expect(polyfill.showPlaceholder.calls.count()).toEqual(0)
      })

    })

  })

  describe("when there is an element with placeholder inside a form on the page", () => {
    let element
    let form

    beforeEach((done) => {
      element = helpers.createInputElementWithForm(true)
      form = document.getElementsByTagName("form")[0]
      placekeeper.setupPlaceholders()
      setTimeout(done, helpers.loopDurationForTests)
    })

    afterEach(() => {
      element.parentNode.removeChild(element)
    })

    describe("and when that form is submitted", () => {

      beforeEach(() => {
        spyOn(polyfill, "hidePlaceholder")
        spyOn(polyfill, "showPlaceholder")
        triggerEvent.html(form, "submit")
      })

      it("should have added data-placeholder-submit to the form", () => {
        expect(form.getAttribute("data-placeholder-submit")).toEqual("true")
      })

      it("should have called polyfill's hidePlaceholder method", () => {
        expect(polyfill.hidePlaceholder).toHaveBeenCalledWith(element)
        expect(polyfill.hidePlaceholder.calls.count()).toEqual(1)
      })

      it("should not have called polyfill's showPlaceholder method", () => {
        expect(polyfill.showPlaceholder).not.toHaveBeenCalled()
        expect(polyfill.showPlaceholder.calls.count()).toEqual(0)
      })

      describe("and after 10ms (when form is submitted)", () => {

        beforeEach((done) => {
          setTimeout(done, 10)
        })

        it("should have called polyfill's showPlaceholder method", () => {
          expect(polyfill.showPlaceholder).toHaveBeenCalledWith(element)
          expect(polyfill.showPlaceholder.calls.count()).toEqual(1)
        })

      })

    })

    describe("and when disable method is called", () => {
      let submitHandler

      beforeEach(() => {
        submitHandler = events.handlers.submit
        spyOn(utils, "removeEventListener")
        placekeeper.disable()
      })

      it("should have called utils.removeEventListener for submit handler", () => {
        expect(utils.removeEventListener)
        .toHaveBeenCalledWith(form, "submit", submitHandler)
      })

      it("should not have data-placeholder-submit set to the from", () => {
        expect(form.getAttribute("data-placeholder-submit")).toEqual(null)
      })

      it("should have deleted the submit handler", () => {
        expect(events.handlers.submit).not.toBeDefined()
      })

    })

  })

})
