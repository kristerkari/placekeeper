import * as helpers from "../utils/helpers.js"
import * as placekeeper from "../../src/main.js"
import * as polyfill from "../../src/polyfill.js"

describe("password inputs", () => {
  "use strict"

  beforeEach(helpers.initialSetup)

  describe("when there is a password input on the page and input type can be changed", () => {
    let element

    if (helpers.canActuallyChangeType) {
      beforeEach((done) => {
        helpers.spyOnCanChangeToTypeAndReturn(true)
        element = helpers.createInputElement(true, "password")
        placekeeper.setupPlaceholders()
        setTimeout(done, helpers.loopDurationForTests)
      })

      afterEach(() => {
        element.parentNode.removeChild(element)
      })

      it("should have changed password input type to text when there is no focus", () => {
        expect(element.getAttribute("type")).toEqual("text")
      })

      describe("and when input is focused", () => {

        beforeEach((done) => {
          spyOn(polyfill, "hidePlaceholder").and.callThrough()
          helpers.retryFocus(element, () => {
            setTimeout(done, helpers.loopDurationForTests)
          })
        })

        it("should have changed element type back to password", () => {
          expect(element.getAttribute("type")).toEqual("password")
        })

        it("should have called polyfill's hidePlaceholder method", () => {
          expect(polyfill.hidePlaceholder).toHaveBeenCalledWith(element)
          expect(polyfill.hidePlaceholder.calls.count()).toEqual(1)
        })

      })
    }

  })

  describe("when there is a disabled password input on the page and input type can not be changed", () => {
    let element
    let clone

    beforeEach((done) => {
      helpers.spyOnCanChangeToTypeAndReturn(false)
      element = helpers.createDisabledInputElement(true, "password")
      setTimeout(() => {
        clone = document.getElementById("elem")
        done()
      }, helpers.loopDurationForTests)
      placekeeper.setupPlaceholders()
    })

    afterEach(() => {
      element.parentNode.removeChild(element)
    })

    it("should have two inputs on the page", () => {
      expect(document.getElementsByTagName("input").length).toEqual(2)
    })

    it("should have changed password input type to text when there is no focus", () => {
      expect(clone.getAttribute("type")).toEqual("text")
    })

    it("should have added elem id to clone", () => {
      expect(clone.id).toEqual("elem")
    })

    it("should have replacement shown", () => {
      expect(clone.style.display).toEqual("block")
    })

    it("should have removed id from element", () => {
      expect(element.id).toEqual("")
    })

    it("should have element hidden", () => {
      expect(element.style.display).toEqual("none")
    })

    it("should have element disabled", () => {
      expect(element.disabled).toEqual(true)
    })

    it("should have clone disabled", () => {
      expect(clone.disabled).toEqual(true)
    })

    describe("and when input is enabled with prop", () => {

      beforeEach((done) => {
        clone.disabled = false
        placekeeper.setupPlaceholders()
        setTimeout(done, helpers.loopDurationForTests)
      })

      it("should have element enabled", () => {
        expect(element.disabled).toEqual(false)
      })

      it("should have clone enabled", () => {
        expect(clone.disabled).toEqual(false)
      })

    })

    describe("and when input is enabled with attribute", () => {

      beforeEach((done) => {
        clone.removeAttribute("disabled")
        placekeeper.setupPlaceholders()
        setTimeout(done, helpers.loopDurationForTests)
      })

      it("should have element enabled", () => {
        expect(element.disabled).toEqual(false)
      })

      it("should have clone enabled", () => {
        expect(clone.disabled).toEqual(false)
      })

      describe("and when input is focused", () => {

        beforeEach((done) => {
          spyOn(polyfill, "hidePlaceholder").and.callThrough()
          helpers.retryFocus(clone, () => {
            setTimeout(() => {
              element = document.getElementById("elem")
              done()
            }, helpers.loopDurationForTests)
          })
        })

        it("should have two inputs on the page", () => {
          expect(document.getElementsByTagName("input").length).toEqual(2)
        })

        it("should have changed element type back to password", () => {
          expect(element.getAttribute("type")).toEqual("password")
        })

        it("should have elem id back to element", () => {
          expect(element.id).toEqual("elem")
        })

        it("should have element shown", () => {
          expect(element.style.display).toEqual("block")
        })

        it("should have remove id from clone", () => {
          expect(clone.id).toEqual("")
        })

        it("should have clone hidden", () => {
          expect(clone.style.display).toEqual("none")
        })

        it("should have called polyfill's hidePlaceholder method", () => {
          expect(polyfill.hidePlaceholder).toHaveBeenCalledWith(clone)
        })

        describe("and when input is disabled", () => {

          beforeEach((done) => {
            element.disabled = true
            placekeeper.setupPlaceholders()
            setTimeout(done, helpers.loopDurationForTests)
          })

          it("should have element disabled", () => {
            expect(element.disabled).toEqual(true)
          })

          it("should have clone disabled", () => {
            expect(clone.disabled).toEqual(true)
          })

        })

        describe("and when there is a value and input is blurred", () => {

          beforeEach((done) => {
            spyOn(polyfill, "showPlaceholder").and.callThrough()
            element.value = "testing"
            helpers.blur(element)
            setTimeout(done, helpers.loopDurationForTests)
          })

          it("should have two inputs on the page", () => {
            expect(document.getElementsByTagName("input").length).toEqual(2)
          })

          it("should have elem id set to element", () => {
            expect(element.id).toEqual("elem")
          })

          it("should have element shown", () => {
            expect(element.style.display).toEqual("block")
          })

          it("should have remove id from clone", () => {
            expect(clone.id).toEqual("")
          })

          it("should have clone hidden", () => {
            expect(clone.style.display).toEqual("none")
          })

          it("should have called polyfill's showPlaceholder method", () => {
            expect(polyfill.showPlaceholder).toHaveBeenCalledWith(element)
          })

        })

        describe("and when the input is blurred after that", () => {

          beforeEach((done) => {
            spyOn(polyfill, "showPlaceholder").and.callThrough()
            helpers.blur(element)
            setTimeout(() => {
              clone = document.getElementById("elem")
              done()
            }, helpers.loopDurationForTests)
          })

          it("should have two inputs on the page", () => {
            expect(document.getElementsByTagName("input").length).toEqual(2)
          })

          it("should have changed password input type to text", () => {
            expect(clone.getAttribute("type")).toEqual("text")
          })

          it("should have added elem id to clone", () => {
            expect(clone.id).toEqual("elem")
          })

          it("should have clone shown", () => {
            expect(clone.style.display).toEqual("block")
          })

          it("should have removed id from element", () => {
            expect(element.id).toEqual("")
          })

          it("should have element hidden", () => {
            expect(element.style.display).toEqual("none")
          })

          it("should have called polyfill's showPlaceholder method", () => {
            expect(polyfill.showPlaceholder).toHaveBeenCalledWith(element)
          })

        })

      })

      describe("and when input is disabled again", () => {

        beforeEach((done) => {
          clone.disabled = true
          placekeeper.setupPlaceholders()
          setTimeout(done, helpers.loopDurationForTests)
        })

        it("should have element disabled", () => {
          expect(element.disabled).toEqual(true)
        })

        it("should have clone disabled", () => {
          expect(clone.disabled).toEqual(true)
        })

      })

    })

  })

  describe("when there is a password input on the page and input type can not be changed", () => {
    let element
    let clone

    beforeEach((done) => {
      helpers.spyOnCanChangeToTypeAndReturn(false)
      element = helpers.createInputElement(true, "password")
      setTimeout(() => {
        clone = document.getElementById("elem")
        done()
      }, helpers.loopDurationForTests)
      placekeeper.setupPlaceholders()
    })

    afterEach(() => {
      element.parentNode.removeChild(element)
    })

    it("should have two inputs on the page", () => {
      expect(document.getElementsByTagName("input").length).toEqual(2)
    })

    it("should have changed password input type to text when there is no focus", () => {
      expect(clone.getAttribute("type")).toEqual("text")
    })

    it("should have added elem id to clone", () => {
      expect(clone.id).toEqual("elem")
    })

    it("should have replacement shown", () => {
      expect(clone.style.display).toEqual("block")
    })

    it("should have removed id from element", () => {
      expect(element.id).toEqual("")
    })

    it("should have element hidden", () => {
      expect(element.style.display).toEqual("none")
    })

    describe("and when input is focused", () => {

      beforeEach((done) => {
        spyOn(polyfill, "hidePlaceholder").and.callThrough()
        helpers.retryFocus(clone, () => {
          setTimeout(() => {
            element = document.getElementById("elem")
            done()
          }, helpers.loopDurationForTests)
        })
      })

      it("should have two inputs on the page", () => {
        expect(document.getElementsByTagName("input").length).toEqual(2)
      })

      it("should have changed element type back to password", () => {
        expect(element.getAttribute("type")).toEqual("password")
      })

      it("should have elem id back to element", () => {
        expect(element.id).toEqual("elem")
      })

      it("should have element shown", () => {
        expect(element.style.display).toEqual("block")
      })

      it("should have remove id from clone", () => {
        expect(clone.id).toEqual("")
      })

      it("should have clone hidden", () => {
        expect(clone.style.display).toEqual("none")
      })

      it("should have called polyfill's hidePlaceholder method", () => {
        expect(polyfill.hidePlaceholder).toHaveBeenCalledWith(clone)
      })

      describe("and when there is a value and input is blurred", () => {

        beforeEach((done) => {
          spyOn(polyfill, "showPlaceholder").and.callThrough()
          element.value = "testing"
          helpers.blur(element)
          setTimeout(done, helpers.loopDurationForTests)
        })

        it("should have two inputs on the page", () => {
          expect(document.getElementsByTagName("input").length).toEqual(2)
        })

        it("should have elem id set to element", () => {
          expect(element.id).toEqual("elem")
        })

        it("should have element shown", () => {
          expect(element.style.display).toEqual("block")
        })

        it("should have remove id from clone", () => {
          expect(clone.id).toEqual("")
        })

        it("should have clone hidden", () => {
          expect(clone.style.display).toEqual("none")
        })

        it("should have called polyfill's showPlaceholder method", () => {
          expect(polyfill.showPlaceholder).toHaveBeenCalledWith(element)
        })

      })

      describe("and when the input is blurred after that", () => {

        beforeEach((done) => {
          spyOn(polyfill, "showPlaceholder").and.callThrough()
          helpers.blur(element)
          setTimeout(() => {
            clone = document.getElementById("elem")
            done()
          }, helpers.loopDurationForTests)
        })

        it("should have two inputs on the page", () => {
          expect(document.getElementsByTagName("input").length).toEqual(2)
        })

        it("should have changed password input type to text", () => {
          expect(clone.getAttribute("type")).toEqual("text")
        })

        it("should have added elem id to clone", () => {
          expect(clone.id).toEqual("elem")
        })

        it("should have clone shown", () => {
          expect(clone.style.display).toEqual("block")
        })

        it("should have removed id from element", () => {
          expect(element.id).toEqual("")
        })

        it("should have element hidden", () => {
          expect(element.style.display).toEqual("none")
        })

        it("should have called polyfill's showPlaceholder method", () => {
          expect(polyfill.showPlaceholder).toHaveBeenCalledWith(element)
        })

      })

    })

  })

  describe("when there is an input on the page that is not password or text type", () => {
    let element

    beforeEach((done) => {
      element = helpers.createInputElement(true, "email")
      placekeeper.setupPlaceholders()
      setTimeout(done, helpers.loopDurationForTests)
    })

    afterEach(() => {
      element.parentNode.removeChild(element)
    })

    it("should have changed password input type to text when there is no focus", () => {
      expect(element.getAttribute("type")).toEqual("email")
    })

    describe("and when input is focused", () => {

      beforeEach((done) => {
        spyOn(polyfill, "hidePlaceholder").and.callThrough()
        helpers.focus(element)
        setTimeout(done, helpers.loopDurationForTests)
      })

      it("should have changed element type back to password", () => {
        expect(element.getAttribute("type")).toEqual("email")
      })

      it("should have called polyfill's hidePlaceholder method", () => {
        expect(polyfill.hidePlaceholder).toHaveBeenCalledWith(element)
        expect(polyfill.hidePlaceholder.calls.count()).toEqual(1)
      })

    })

  })

})
