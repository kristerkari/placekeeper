import * as helpers from "../utils/helpers.js"
import * as placekeeper from "../../src/main.js"

describe("changing element type", () => {
  "use strict"

  beforeEach(helpers.initialSetup)

  if (helpers.canActuallyChangeType) {

    describe("when input type can be changed", () => {

      beforeEach(() => {
        helpers.spyOnCanChangeToTypeAndReturn(true)
        helpers.spyOnNativeSupportAndReturn(false)
      })

      describe("when a password input with placeholder exists on the page", () => {
        let element

        beforeEach((done) => {
          element = helpers.createInputElement(true, "password")
          setTimeout(done, helpers.loopDurationForTests)
          placekeeper.init()
        })

        afterEach(() => {
          element.parentNode.removeChild(element)
        })

        describe("and when its type is changed to text with a data attribute", () => {

          beforeEach((done) => {
            element.setAttribute("data-placeholder-type", "text")
            setTimeout(done, helpers.loopDurationForTests)
          })

          it("should have one input on the page", () => {
            expect(document.getElementsByTagName("input").length).toEqual(1)
          })

          it("should have element type set to text", () => {
            expect(element.type).toEqual("text")
          })

        })

      })

      describe("when a text input with placeholder exists on the page", () => {
        let element

        beforeEach((done) => {
          element = helpers.createInputElement(true)
          setTimeout(done, helpers.loopDurationForTests)
          placekeeper.init()
        })

        afterEach(() => {
          element.parentNode.removeChild(element)
        })

        describe("and when its type is changed to password", () => {

          beforeEach((done) => {
            element.type = "password"
            setTimeout(done, helpers.loopDurationForTests)
          })

          it("should have one input on the page", () => {
            expect(document.getElementsByTagName("input").length).toEqual(1)
          })

          it("should have element type set to text (so that placeholder is visible)", () => {
            expect(element.type).toEqual("text")
          })

          it("should changed data-placeholder-type attribute to password", () => {
            expect(element.getAttribute("data-placeholder-type")).toEqual("password")
          })

          describe("and when the element is focused", () => {

            beforeEach((done) => {
              helpers.retryFocus(element, () => {
                setTimeout(done, helpers.loopDurationForTests)
              })
            })

            it("should have one input on the page", () => {
              expect(document.getElementsByTagName("input").length).toEqual(1)
            })

            it("should have element type set to password", () => {
              expect(element.type).toEqual("password")
            })

            it("should have data-placeholder-type attribute set to password", () => {
              expect(element.getAttribute("data-placeholder-type")).toEqual("password")
            })

            describe("and when element is blurred after that", () => {

              beforeEach(() => {
                helpers.blur(element)
              })

              it("should have one input on the page", () => {
                expect(document.getElementsByTagName("input").length).toEqual(1)
              })

              it("should have element type set to text", () => {
                expect(element.type).toEqual("text")
              })

              it("should have data-placeholder-type attribute set to password", () => {
                expect(element.getAttribute("data-placeholder-type")).toEqual("password")
              })

            })

          })

        })

      })

    })

    describe("when input type can not be changed", () => {

      beforeEach(() => {
        helpers.spyOnCanChangeToTypeAndReturn(false)
        helpers.spyOnNativeSupportAndReturn(false)
      })

      describe("when a password input with placeholder exists on the page", () => {
        let element

        beforeEach((done) => {
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

        describe("and when its type is changed to text with a data attribute", () => {

          beforeEach((done) => {
            element.setAttribute("data-placeholder-type", "text")
            setTimeout(() => {
              element = document.getElementById("elem")
              done()
            }, helpers.loopDurationForTests)
          })

          it("should have one input on the page", () => {
            expect(document.getElementsByTagName("input").length).toEqual(1)
          })

          it("should have element type set to text", () => {
            expect(element.type).toEqual("text")
          })

        })

      })

      describe("when a text input with placeholder exists on the page", () => {
        let element

        beforeEach((done) => {
          element = helpers.createInputElement(true)
          placekeeper.init()
          setTimeout(done, helpers.loopDurationForTests)
        })

        afterEach(() => {
          element.parentNode.removeChild(element)
        })

        describe("and when its type is changed to password", () => {

          beforeEach((done) => {
            element.type = "password"
            setTimeout(() => {
              element = document.getElementById("elem")
              done()
            }, helpers.loopDurationForTests)
          })

          it("should have two inputs on the page", () => {
            expect(document.getElementsByTagName("input").length).toEqual(2)
          })

          it("should have element type set to text", () => {
            expect(element.type).toEqual("text")
          })

          describe("and when the element is focused", () => {

            beforeEach((done) => {
              helpers.retryFocus(element, () => {
                setTimeout(() => {
                  element = document.getElementById("elem")
                  done()
                }, helpers.loopDurationForTests)
              })
            })

            it("should have element type set to password", () => {
              expect(element.type).toEqual("password")
            })

          })

        })

      })

    })

  }

})
