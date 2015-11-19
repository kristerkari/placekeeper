import * as support from "../support.js";

var originalGetValueMethod = Form.Element.Methods.getValue;
var originalGetValueStatic = Form.Element.getValue;
var originalGlobal = $F;

function getValue(originalFn, elem) {
  if (elem.getAttribute("data-placeholder-active")) {
    return "";
  }
  /*jshint validthis: true */
  return originalFn.call(this, elem);
}

if (!support.hasNativePlaceholderSupport()) {

  /*global $F:true */
  $F = function(elem) {
    return getValue.call(this, originalGlobal, elem);
  };

  Form.Element.getValue = function(elem) {
    return getValue.call(this, originalGetValueStatic, elem);
  };

  Element.addMethods(["INPUT", "TEXTAREA"], {
    getValue: function(elem) {
      return getValue.call(this, originalGetValueMethod, elem);
    }
  });
}
