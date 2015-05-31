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
    data.setEventsAttr(element);
    elems.createPasswordCloneIfNeeded(element);
    events.addSubmitEvent(elems.getForm(element));
    events.addEventListeners(element);
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

    if (!placeholder) {
      return;
    }

    if (needsSetup(element)) {
      setupElement(element, placeholder);
    } else {

      if (elems.hasPasswordClone(element)) {
        var clone = elems.getPasswordClone(element);
        if (element.disabled !== clone.disabled) {
          clone.disabled = element.disabled;
        }
      }

      if (hasPlaceholderValueChanged(element, placeholder)) {
        data.setValueAttr(element, placeholder);
      }
      if (hasValueChanged(element, placeholder)) {
        polyfill.__hidePlaceholder(element);
      }
    }

    if (!hasValueOrIsActive(element)) {
      polyfill.__showPlaceholder(element);
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
    if (!mode.hasDisabledLiveUpdates()) {
      mode.enableLive();
      // main loop
      loopInterval = setInterval(placekeeperLoop, settings.defaultLoopDuration);
    } else {
      mode.disableLive();
    }
  }

  function disablePlacekeeper() {
    mode.disable();
    clearInterval(loopInterval);
    elems.forEachForm(events.removeSubmitEvent);
    elems.forEachElement(events.removeEvents);
    elems.forEachElement(data.removeDataAttrs);
    elems.forEachElement(elems.removePasswordCloneIfExists);
  }

  elems.getElements();
  events.addUnloadListener();
  init();

  // Expose public methods
  placekeeper.isEnabled = mode.isPlacekeeperEnabled;
  placekeeper.enable = init;
  placekeeper.disable = disablePlacekeeper;
  placekeeper.isFocusEnabled = mode.isPlacekeeperFocusEnabled;
  placekeeper.isLiveUpdateEnabled = mode.isPlacekeeperLiveUpdateEnabled;

  // Exposed private methods
  placekeeper.priv = {
    __global: global,
    __init: init,
    __settings: settings,
    __setupPlaceholders: setupPlaceholders,
    __hasElementsThatNeedPlaceholder: hasElementsThatNeedPlaceholder
  };

}());
