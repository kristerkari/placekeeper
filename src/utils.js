export function addEventListener(elem, event, fn) {
  if (elem.addEventListener) {
    return elem.addEventListener(event, fn, false);
  }
  if (elem.attachEvent && fn != null) {
    return elem.attachEvent("on" + event, function(e) {
      e.preventDefault = function() {
        e.returnValue = false;
      };
      e.stopPropagation = function() {
        e.cancelBubble = true;
      };
      fn.call(elem, e);
    });
  }
}

export function removeEventListener(elem, event, fn) {
  if (elem.removeEventListener) {
    return elem.removeEventListener(event, fn, false);
  }
  if (elem.detachEvent && fn != null) {
    return elem.detachEvent("on" + event, fn);
  }
}

function trim(str) {
  return str.replace(/^\s+|\s+$/g, "");
}

function hasClass(elem, className) {
  return (" " + elem.className + " ").indexOf(" " + className + " ") !== -1;
}

export function addClass(elem, className) {
  if (!hasClass(elem, className)) {
    elem.className = elem.className === "" ? className : elem.className + " " + className;
  }
}

export function removeClass(elem, className) {
  elem.className = trim((" " + elem.className + " ").replace(" " + className + " ", " "));
}

export function each(collection, iter, ctx) {

  if (!collection) {
    return;
  }

  for (var i = 0; i < collection.length; i++) {
    iter.call(ctx, collection[i], i, collection);
  }
}

export function getAttributes(elem) {
  var copiedAttrs = {};

  each(elem.attributes, function(attr) {
    // old IEs will throw an error if you try to copy "type" attribute.
    if (attr.specified && attr.name !== "type" && attr.name !== "id") {
      copiedAttrs[attr.name] = attr.value;
    }
  });

  // value attribute does not get copied in IE7
  // so copy it manually
  if (copiedAttrs.value == null && elem.value !== "") {
    copiedAttrs.value = elem.value;
  }

  return copiedAttrs;
}

export function setAttributes(elem, attrs) {
  for (var key in attrs) {
    elem.setAttribute(key, attrs[key]);
  }
}

export function getElementType(element) {
  if (element.type === "textarea") {
    return element.type;
  }
  if (!element.getAttribute("type") &&
      element.tagName.toLowerCase() === "input") {
    return "text";
  }
  return element.getAttribute("type");
}

// wrap `document.getElementsByTagName`
// so that unit tests can correctly spy
// on it in all browsers
export function getElementsByTagName(type) {
  return document.getElementsByTagName(type);
}

export function preventDefault(evt) {
  evt.preventDefault();
}

// Check whether an item is in an array
// (we don't use Array.prototype.indexOf
// so we don't clobber any existing polyfills
// - this is a really simple alternative)
export function inArray(arr, item) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] === item) {
      return true;
    }
  }
  return false;
}

export function moveCaret(elem, index) {
  if (elem.createTextRange) {
    var range = elem.createTextRange();
    range.move("character", index);
    range.select();
  } else if (elem.selectionStart) {
    elem.focus();
    elem.setSelectionRange(index, index);
  }
}

export function getPlaceholderValue(element) {
  return "placeholder" in element &&
         element.placeholder ||
         // IE10 emulating IE7 fails with getAttribute, hence the use of the attributes node
         // IE returns an empty object instead of undefined if the attribute is not present
         element.attributes.placeholder &&
         element.attributes.placeholder.nodeValue;
}

export function hasPlaceholderAttrSet(element) {
  return Boolean(getPlaceholderValue(element));
}

export function some(items, fn) {
  for (var i = 0; i < items.length; i++) {
    if (items[i] != null && fn(items[i])) {
      return true;
    }
  }
  return false;
}
