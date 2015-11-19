import * as data from "./data.js";
import * as elems from "./elements.js";
import * as utils from "./utils.js";

function hasMaxLength(element) {
  return element.attributes.maxLength && element.attributes.maxLength.specified;
}

export function restoreMaxlength(element) {
  var maxLength = data.getMaxLengthAttr(element);
  if (!maxLength) {
    return;
  }
  element.setAttribute("maxLength", maxLength);
  data.removeMaxLengthAttr(element);
}

export function storeMaxlength(element) {
  if (!hasMaxLength(element)) {
    return;
  }
  data.setMaxLengthAttr(element);
  // Removing maxLength will not work in IE7,
  // where a default value of 2147483647 is used instead.
  element.removeAttribute("maxLength");
}

export function showPlaceholder(element) {
  var val = data.getValueAttr(element);

  if (element.value !== "" || val == null) {
    return;
  }

  if (element.type === "password") {
    if (elems.hasPasswordClone(element)) {
      var clone = elems.getPasswordClone(element);
      elems.swapElements(element, clone);
      element = clone;
    } else {
      element.type = "text";
    }
  }

  element.value = val;
  data.setActiveAttr(element);
  utils.addClass(element, "placeholder");
  storeMaxlength(element);
}

export function removePlaceholder(element, replace) {
  element.value = replace ? element.value.replace(data.getValueAttr(element), "") : "";
  data.removeActiveAttr(element);
  utils.removeClass(element, "placeholder");
  restoreMaxlength(element);
}

export function hidePlaceholder(element) {

  if (data.hasTypeAttrSetToPassword(element)) {
    if (elems.isClonedPasswordInput(element)) {
      var original = elems.getPasswordOriginal(element);
      elems.swapElements(element, original);
      element = original;
      element.focus();
    } else {
      element.type = "password";
    }
  }

  removePlaceholder(element, true);
}
