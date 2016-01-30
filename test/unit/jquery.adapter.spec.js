import * as helpers from "../utils/helpers.js"
import * as placekeeper from "../../src/main.js"
import * as jq from "../../src/adapters/adapter.jquery.js"

describe("jQuery adapter", () => {
  "use strict"

  beforeEach(helpers.initialSetup)
  beforeEach(() => {
    helpers.spyOnNativeSupportAndReturn(false)
    jq.setup()
  })

  describe("when there is an input with a placeholder on the page", () => {
    let element

    beforeEach((done) => {
      element = helpers.createInputElement(true)
      placekeeper.setupPlaceholders()
      setTimeout(done, helpers.loopDurationForTests)
    })

    afterEach(() => {
      element.parentNode.removeChild(element)
    })

    it("should return empty value with .val()", () => {
      expect($("#elem").val()).toEqual("")
    })

    it("should return empty value with .prop('value')", () => {
      expect($("#elem").prop("value")).toEqual("")
    })

  })

  describe("When there is an input with a placeholder and existing value on the page", () => {
    let element

    beforeEach((done) => {
      element = helpers.createInputElementWithValue(true)
      placekeeper.setupPlaceholders()
      setTimeout(done, helpers.loopDurationForTests)
    })

    afterEach(() => {
      element.parentNode.removeChild(element)
    })

    it("should return value with .val()", () => {
      expect($("#elem").val()).toEqual("MyVal")
    })

    it("should return value with .prop('value')", () => {
      expect($("#elem").prop("value")).toEqual("MyVal")
    })

    describe("and when the value is removed", () => {

      beforeEach(() => {
        $("#elem").val("")
      })

      it("should return empty value with .val()", () => {
        expect($("#elem").val()).toEqual("")
      })

      it("should return empty value with .prop('value')", () => {
        expect($("#elem").prop("value")).toEqual("")
      })

    })

  })

  describe("when there is an input with a placeholder that has numeric value on the page", () => {
    let element

    beforeEach((done) => {
      element = helpers.createInputElementWithNumericPlaceholder(true)
      placekeeper.setupPlaceholders()
      setTimeout(done, helpers.loopDurationForTests)
    })

    afterEach(() => {
      element.parentNode.removeChild(element)
    })

    it("should return empty value with .val()", () => {
      expect($("#elem").val()).toEqual("")
    })

    it("should return empty value with .prop('value')", () => {
      expect($("#elem").prop("value")).toEqual("")
    })

  })

})
