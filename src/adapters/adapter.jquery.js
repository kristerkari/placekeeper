import * as support from "../support.js"

const originalValFn = $.fn.val
const originalPropFn = $.fn.prop

export function setup() {
  if (!support.hasNativePlaceholderSupport()) {

    $.fn.val = function(val) {
      const originalValue = originalValFn.apply(this, arguments)
      const placeholder = this.eq(0).data("placeholder-value")
      if (
        val === undefined &&
        this.eq(0).data("placeholder-active") &&
        originalValue === String(placeholder)
      ) {
        return ""
      }
      return originalValue
    }

    $.fn.prop = function(name, val) {
      if (
        val === undefined &&
        this.eq(0).data("placeholder-active") &&
        name === "value"
      ) {
        return ""
      }
      return originalPropFn.apply(this, arguments)
    }

  }
}

setup()
