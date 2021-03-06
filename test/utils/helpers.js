import * as support from "../../src/support.js"
import * as placekeeper from "../../src/main.js"
import * as elements from "../../src/elements.js"
import * as mode from "../../src/mode.js"
import * as utils from "../../src/utils.js"
import * as events from "../../src/events.js"

function getStyle(el, prop) {
  let style = window.getComputedStyle ? window.getComputedStyle(el, null) : el.currentStyle
  if (style) {
    return style [
      prop.replace(/-(\w)/gi, (word, letter) => {
        return letter.toUpperCase()
      })
    ]
  }
}

function isHidden(el) {
  return getStyle(el, "display") === "none"
}

export const loopDurationForTests = 14
export const fakeWindow = {
  events: {},
  dispatchEvent: (event) => {
    fakeWindow.events[event.type].call()
  },
  fireEvent: (event) => {
    fakeWindow.events[event.slice(2)].call()
  }
}
export const fakeUtils = {
  addEventListener: (elem, event, fn) => {
    fakeWindow.events[event] = fn
  }
}
export const canActuallyChangeType = (function() {
  const element = "<input id=\"pw\" type=\"password\">"
  document.body.innerHTML = element
  const can = support.canChangeToType(document.getElementById("pw"), "text")
  document.body.innerHTML = ""
  return can
}())
export const initialSetup = function() {
  spyOn(support, "isInputSupported")
  .and.callFake(() => {
    return false
  })
  spyOn(support, "isTextareaSupported")
  .and.callFake(() => {
    return false
  })
  placekeeper.settings.defaultLoopDuration = 6
  elements.getElements()
}
export const spyOnNativeSupportAndReturn = function(bool) {
  spyOn(support, "hasNativePlaceholderSupport")
  .and.callFake(() => {
    return bool
  })
}
export const spyOnCanChangeToTypeAndReturn = function(bool) {
  spyOn(support, "canChangeToType")
  .and.callFake(() => {
    return bool
  })
}
export const spyOnFocusEnabledAndReturn = function(bool) {
  spyOn(mode, "isPlacekeeperFocusEnabled")
  .and.callFake(() => {
    return bool
  })
}
export const triggerFakePageReload = function() {
  triggerEvent.html(fakeWindow, "beforeunload")
}
export const setupFakeWindow = function() {
  spyOn(utils, "addEventListener")
  .and.callFake(fakeUtils.addEventListener)
  // placekeeper.priv.__global = fakeWindow;
  events.addUnloadListener()
  placekeeper.setupPlaceholders()
}
export const restoreRealWindow = function() {
  // placekeeper.priv.__global = window;
}
export const focus = function(element) {
  triggerEvent.html(element, "focus")
  if (!isHidden(element) && element !== document.activeElement) {
    element.focus()
  }
}
export const retryFocus = function(element, done) {
  const tries = 5
  let nr = 0

  function f() {
    focus(element)
    if (element === document.activeElement) {
      done()
    } else if (nr++ < tries) {
      setTimeout(f, 4)
    } else {
      done()
    }
  }

  f()
}
export const blur = function(element) {
  triggerEvent.html(element, "blur")
}
export const createInputElementWithMaxLength = function(maxLength, maxLengthAttr) {
  let element = "<input type=\"text\" id=\"elem\""
  if (maxLength) {
    element += " maxlength=\"" + maxLength + "\""
  }
  if (maxLengthAttr) {
    element += " data-placeholder-maxlength=\"" + maxLengthAttr + "\""
  }
  element += ">"
  document.body.innerHTML = element
  return document.getElementById("elem")
}
export const createInputElementWithoutType = function(hasPlaceholder) {
  let element = "<input id=\"elem\" maxlength=\"12\""
  if (hasPlaceholder) {
    element += " placeholder=\"Test\""
  }
  element += ">"
  document.body.innerHTML = element
  return document.getElementById("elem")
}
export const createInputElementWithValue = function(hasPlaceholder, type) {
  let element = "<input type=\"" + (type || "text") +
                "\" id=\"elem\""
  if (hasPlaceholder) {
    element += " placeholder=\"Test\" value=\"MyVal\""
  }
  element += ">"
  document.body.innerHTML = element
  return document.getElementById("elem")
}
export const createInputElement = function(hasPlaceholder, type) {
  let element = "<input type=\"" + (type || "text") +
                "\" id=\"elem\" maxlength=\"12\""
  if (hasPlaceholder) {
    element += " placeholder=\"Test\""
  }
  element += ">"
  document.body.innerHTML = element
  return document.getElementById("elem")
}
export const createInputElementWithNumericPlaceholder = function(hasPlaceholder, type) {
  let element = "<input type=\"" + (type || "text") +
                "\" id=\"elem\" maxlength=\"12\""
  if (hasPlaceholder) {
    element += " placeholder=\"123456\""
  }
  element += ">"
  document.body.innerHTML = element
  return document.getElementById("elem")
}
export const createDisabledInputElement = function(hasPlaceholder, type) {
  let element = "<input type=\"" + (type || "text") +
                "\" id=\"elem\" maxlength=\"12\""
  if (hasPlaceholder) {
    element += " placeholder=\"Test\""
  }
  element += " disabled>"
  document.body.innerHTML = element
  return document.getElementById("elem")
}
export const createInputElementWithForm = function(hasPlaceholder, type) {
  let element = "<form method=get action=javascript:void(0);><input type=\"" + (type || "text") +
                "\" id=\"elem\" maxlength=\"12\""
  if (hasPlaceholder) {
    element += " placeholder=\"Test\""
  }
  element += "></form>"
  document.body.innerHTML = element
  return document.getElementById("elem")
}
export const createInputElementWithFormAttribute = function(hasPlaceholder, type) {
  let element = "<form method=get action=javascript:void(0); id=\"form1\">" +
                "<input type=\"" + (type || "text") +
                "\" id=\"elem\" maxlength=\"12\" form=\"form1\""
  if (hasPlaceholder) {
    element += " placeholder=\"Test\""
  }
  element += "></form>"
  document.body.innerHTML = element
  return document.getElementById("elem")
}
export const createTextareaElement = function(hasPlaceholder) {
  let element = "<textarea id=\"elem\""
  if (hasPlaceholder) {
    element += " placeholder=\"Test\""
  }
  element += "></textarea>"
  document.body.innerHTML = element
  return document.getElementById("elem")
}
export const createTextareaElementWithValue = function(hasPlaceholder) {
  let element = "<textarea id=\"elem\""
  if (hasPlaceholder) {
    element += " placeholder=\"Test\""
  }
  element += ">MyVal</textarea>"
  document.body.innerHTML = element
  return document.getElementById("elem")
}
