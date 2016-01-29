beforeEach(() => {
  jasmine.addMatchers({
    toHaveNoDataAttributes() {
      return {
        compare(actual) {
          let dataAttrs = []
          for (let i = 0; i < actual.attributes.length; i++) {
            if ((/data\-/).test(actual.attributes[i].nodeName)) {
              dataAttrs.push(actual.attributes[i].nodeName)
            }
          }
          const passed = dataAttrs.length === 0
          return {
            message: "Expected element to have 0 data-attributes, but got " + dataAttrs,
            pass: passed
          }
        }
      }
    },
    toHaveClass() {
      return {
        compare(actual, expected) {
          const passed = actual.className.search(expected) > -1
          return {
            message: "Expected element" + (passed ? " not" : "") + " to have \"" + expected + "\" class",
            pass: passed
          }
        }
      }
    },
    toEqualNullOr2147483647() {
      return {
        compare(actual) {
          return {
            // IE7 has a default value of 2147483647 for maxLength attribute
            message: "Expected " + actual + " to be either 2147483647 or null",
            pass: actual === null || actual === 2147483647
          }
        }
      }
    }
  })
})
