(function() {

  var support = placekeeper.support;
  var data = placekeeper.data;
  var mode = placekeeper.mode;
  var utils = placekeeper.utils;
  var elems = placekeeper.elements;
  var events = placekeeper.events;
  var polyfill = placekeeper.polyfill;
  var settings = {
    defaultLoopDuration: 100
  };
  var loopInterval = null;

  function hasElementsThatNeedPlaceholder(elements) {

    if (!elements) {
      return false;
    }

    for (var i = 0; i < elements.length; i++) {
      if (support.needsToShowPlaceHolder(elements[i])) {
        return true;
      }
    }

    return false;
  }

  function needsToSetPlaceholder() {
    var needsPlaceholder = hasElementsThatNeedPlaceholder(elems.getInputElements());

    if (needsPlaceholder === false) {
      needsPlaceholder = hasElementsThatNeedPlaceholder(elems.getTextareaElements());
    }

    return needsPlaceholder;
  }

  function setupElement(element, placeholderValue) {
    data.setValueAttr(element, placeholderValue);
    data.setElementValueAttr(element, element.value);
    data.setEventsAttr(element);
    elems.createPasswordCloneIfNeeded(element);
    events.addSubmitEvent(elems.getForm(element));
    events.addEventListeners(element);
  }

  function restoreValue(element) {
    if (data.getElementValueAttr(element) != null) {
      element.value = data.getElementValueAttr(element);
    }
  }

  function cleanupElement(element, clone) {
    if (element == null) {
      return;
    }
    if (clone) {
      element.removeAttribute("placeholder");
      restoreValue(clone);
    }
    restoreValue(element);
    events.removeEvents(element);
    data.removeDataAttrs(element);
    elems.removePasswordCloneIfExists(element);
    utils.removeClass(element, "placeholder");
  }

  function needsSetup(element) {
    return support.isSupportedType(utils.getElementType(element)) &&
           !data.hasEventsAttrSetToTrue(element);
  }

  function hasPlaceholderValueChanged(element, placeholder) {
    return data.hasValueAttr(element) &&
           data.getValueAttr(element) !== placeholder;
  }

  function hasValueChanged(element, placeholder) {
    return element.value !== "" && element.value !== placeholder;
  }

  function hasValueOrIsActive(element) {
    return element.value !== "" || element === support.safeActiveElement();
  }

  function checkForPlaceholder(element) {
    var placeholder = utils.getPlaceholderValue(element);
    var clone;

    if (elems.hasPasswordClone(element)) {
      clone = elems.getPasswordClone(element);
    }

    if (!placeholder || clone && !utils.getPlaceholderValue(clone)) {
      if (data.hasEventsAttrSetToTrue(element)) {
        cleanupElement(element, clone);
      }
      return;
    }

    if (needsSetup(element)) {
      setupElement(element, placeholder);
    } else {

      if (clone) {
        if (element.disabled !== clone.disabled) {
          if (clone.style.display === "block") {
            element.disabled = clone.disabled;
          }
          if (element.style.display === "block") {
            clone.disabled = element.disabled;
          }
        }
      }

      if (hasPlaceholderValueChanged(element, placeholder)) {
        data.setValueAttr(element, placeholder);
      }
      if (data.getValueAttr(element) !== element.value) {
        data.setElementValueAttr(element, element.value);
      }
      if (hasValueChanged(element, placeholder)) {
        polyfill.hidePlaceholder(element);
      }
    }

    if (!clone && !hasValueOrIsActive(element)) {
      polyfill.showPlaceholder(element);
    }

  }

  function setupPlaceholders() {
    elems.forEachElement(checkForPlaceholder);
  }

  function placekeeperLoop() {
    if (mode.hasFocusDisabled()) {
      mode.disableFocus();
    } else {
      mode.enableFocus();
    }

    if (needsToSetPlaceholder()) {
      mode.enable();
    } else {
      mode.disable();
    }

    if (support.hasNativePlaceholderSupport()) {
      return;
    }

    setupPlaceholders();
  }

  function init() {
    if (support.hasNativePlaceholderSupport()) {
      return;
    }
    clearInterval(loopInterval);
    placekeeperLoop();
    if (!mode.hasWatchingDisabled()) {
      mode.enableWatching();
      // main loop
      loopInterval = setInterval(placekeeperLoop, settings.defaultLoopDuration);
    } else {
      mode.disableWatching();
    }
  }

  function disablePlacekeeper() {
    mode.disable();
    clearInterval(loopInterval);
    elems.forEachForm(events.removeSubmitEvent);
    elems.forEachElement(cleanupElement);
  }

  elems.getElements();
  events.addUnloadListener();
  init();

  // Expose public methods
  placekeeper.isEnabled = mode.isPlacekeeperEnabled;
  placekeeper.enable = init;
  placekeeper.disable = disablePlacekeeper;
  placekeeper.isFocusEnabled = mode.isPlacekeeperFocusEnabled;
  placekeeper.isWatchingEnabled = mode.isPlacekeeperWatchingEnabled;

  // Exposed private methods
  placekeeper.priv = {
    __global: global,
    __init: init,
    __settings: settings,
    __setupPlaceholders: setupPlaceholders,
    __hasElementsThatNeedPlaceholder: hasElementsThatNeedPlaceholder
  };

}());
