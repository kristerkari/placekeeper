import * as support from "../support.js"

const originalGetValueMethod = Form.Element.Methods.getValue
const originalGetValueStatic = Form.Element.getValue
const originalGlobal = $F

function getValue(originalFn, elem) {
  if (elem.getAttribute("data-placeholder-active")) {
    return ""
  }
  /*eslint-disable no-invalid-this */
  return originalFn.call(this, elem)
  /*eslint-enable no-invalid-this */
}

if (!support.hasNativePlaceholderSupport()) {

  $F = function(elem) {
    /*eslint-disable no-invalid-this */
    return getValue.call(this, originalGlobal, elem)
    /*eslint-enable no-invalid-this */
  }

  Form.Element.getValue = function(elem) {
    return getValue.call(this, originalGetValueStatic, elem)
  }

  Element.addMethods(["INPUT", "TEXTAREA"], {
    getValue(elem) {
      return getValue.call(this, originalGetValueMethod, elem)
    }
  })
}
