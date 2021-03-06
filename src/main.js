import * as support from "./support.js"
import * as data from "./data.js"
import * as mode from "./mode.js"
import * as utils from "./utils.js"
import * as elems from "./elements.js"
import * as events from "./events.js"
import * as polyfill from "./polyfill.js"

export let settings = {
  defaultLoopDuration: 100
}
let loopInterval = null

export function hasElementsThatNeedPlaceholder(elements) {

  if (!elements) {
    return false
  }

  for (let i = 0; i < elements.length; i++) {
    if (support.needsToShowPlaceHolder(elements[i])) {
      return true
    }
  }

  return false
}

function needsToSetPlaceholder() {
  let needsPlaceholder = hasElementsThatNeedPlaceholder(elems.getInputElements())

  if (needsPlaceholder === false) {
    needsPlaceholder = hasElementsThatNeedPlaceholder(elems.getTextareaElements())
  }

  return needsPlaceholder
}

function setupElement(element, placeholderValue) {
  data.setValueAttr(element, placeholderValue)
  data.setTypeAttr(element, utils.getElementType(element))
  data.setElementValueAttr(element, element.value)
  data.setEventsAttr(element)
  elems.createPasswordCloneIfNeeded(element)
  events.addSubmitEvent(elems.getForm(element))
  events.addEventListeners(element)
}

function restoreValue(element) {
  if (data.getElementValueAttr(element) != null) {
    element.value = data.getElementValueAttr(element)
  }
}

function cleanupElement(element, clone) {
  if (element == null) {
    return
  }
  if (clone) {
    element.removeAttribute("placeholder")
    restoreValue(clone)
  }
  restoreValue(element)
  events.removeEvents(element)
  data.removeDataAttrs(element)
  elems.removePasswordCloneIfExists(element)
  utils.removeClass(element, "placeholder")
}

function needsSetup(element) {
  return support.isSupportedType(utils.getElementType(element)) &&
         !data.hasEventsAttrSetToTrue(element)
}

function hasPlaceholderValueChanged(element, placeholder) {
  return data.hasValueAttr(element) &&
         data.getValueAttr(element) !== placeholder
}

function isActiveAndHasValueChanged(element, placeholder) {
  return data.hasActiveAttrSetToTrue(element) &&
         element.value !== "" && element.value !== placeholder
}

function hasValueOrIsActive(element) {
  return element.value !== "" || element === support.safeActiveElement()
}

function isClone(element) {
  return data.hasCloneAttrSetToTrue(element) && elems.getPasswordOriginal(element) != null
}

function hasChangedType(element) {
  const el = isClone(element) ? elems.getPasswordOriginal(element) : element
  return utils.getElementType(el) !== data.getTypeAttr(element)
}

function handleTypeChange(element) {

  if (!hasChangedType(element)) {
    return
  }

  const type = element.getAttribute("type")
  const typeAttr = data.getTypeAttr(element)

  if (type === "text" && typeAttr === "password") {
    return
  }

  if (isClone(element)) {
    element = elems.getPasswordOriginal(element)
    element.setAttribute("type", typeAttr)
  }

  cleanupElement(element)
}

function checkForPlaceholder(element) {

  if (!element) {
    return
  }

  const placeholder = utils.getPlaceholderValue(element)
  let clone

  if (elems.hasPasswordClone(element)) {
    clone = elems.getPasswordClone(element)
  }

  if (!placeholder || clone && !utils.getPlaceholderValue(clone)) {
    if (data.hasEventsAttrSetToTrue(element)) {
      cleanupElement(element, clone)
    }
    return
  }

  handleTypeChange(element)

  if (needsSetup(element)) {
    setupElement(element, placeholder)
  } else {

    if (clone) {
      if (element.disabled !== clone.disabled) {
        if (clone.style.display === "block") {
          element.disabled = clone.disabled
        }
        if (element.style.display === "block") {
          clone.disabled = element.disabled
        }
      }
    }

    if (hasPlaceholderValueChanged(element, placeholder)) {
      data.setValueAttr(element, placeholder)
      element.value = placeholder
      const original = elems.getPasswordOriginal(element)
      if (original && original.nodeType === 1) {
        original.setAttribute("placeholder", placeholder)
        data.setValueAttr(original, placeholder)
      }
    }
    if (data.getValueAttr(element) !== element.value) {
      data.setElementValueAttr(element, element.value)
    }
    if (isActiveAndHasValueChanged(element, placeholder)) {
      polyfill.hidePlaceholder(element)
    }
  }

  if (!hasValueOrIsActive(element)) {
    polyfill.showPlaceholder(element)
  }

}

export function setupPlaceholders() {
  elems.forEachElement(checkForPlaceholder)
}

function placekeeperLoop() {
  if (mode.hasFocusDisabled()) {
    mode.disableFocus()
  } else {
    mode.enableFocus()
  }

  if (needsToSetPlaceholder()) {
    mode.enable()
  } else {
    mode.disable()
  }

  if (support.hasNativePlaceholderSupport()) {
    return
  }

  setupPlaceholders()
}

export function init() {
  if (support.hasNativePlaceholderSupport()) {
    return
  }
  clearInterval(loopInterval)
  placekeeperLoop()
  if (!mode.hasWatchingDisabled()) {
    mode.enableWatching()
    // main loop
    loopInterval = setInterval(placekeeperLoop, settings.defaultLoopDuration)
  } else {
    mode.disableWatching()
  }
}

function disablePlacekeeper() {
  mode.disable()
  clearInterval(loopInterval)
  elems.forEachForm(events.removeSubmitEvent)
  elems.forEachElement(cleanupElement)
}

elems.getElements()
events.addUnloadListener()
init()

// Make sure that ES3 envs don't
// throw when Object.freeze is used.
if (!Object.freeze) {
  Object.freeze = (obj) => obj
}

// Expose public methods
export const isEnabled = mode.isPlacekeeperEnabled
export const enable = init
export const disable = disablePlacekeeper
export const isFocusEnabled = mode.isPlacekeeperFocusEnabled
export const isWatchingEnabled = mode.isPlacekeeperWatchingEnabled
