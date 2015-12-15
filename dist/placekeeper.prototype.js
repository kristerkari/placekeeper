(function () { 'use strict';

  var babelHelpers = {};

  babelHelpers["typeof"] = function (obj) {
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  babelHelpers;
  function addEventListener(elem, event, fn) {
    if (elem.addEventListener) {
      return elem.addEventListener(event, fn, false);
    }
    if (elem.attachEvent && fn != null) {
      return elem.attachEvent("on" + event, function (e) {
        e.preventDefault = function () {
          e.returnValue = false;
        };
        e.stopPropagation = function () {
          e.cancelBubble = true;
        };
        fn.call(elem, e);
      });
    }
  }

  function removeEventListener(elem, event, fn) {
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

  function addClass(elem, className) {
    if (!hasClass(elem, className)) {
      elem.className = elem.className === "" ? className : elem.className + " " + className;
    }
  }

  function removeClass(elem, className) {
    elem.className = trim((" " + elem.className + " ").replace(" " + className + " ", " "));
  }

  function each(collection, iter, ctx) {

    if (!collection) {
      return;
    }

    for (var i = 0; i < collection.length; i++) {
      iter.call(ctx, collection[i], i, collection);
    }
  }

  function getAttributes(elem) {
    var copiedAttrs = {};

    each(elem.attributes, function (attr) {
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

  function setAttributes(elem, attrs) {
    for (var key in attrs) {
      elem.setAttribute(key, attrs[key]);
    }
  }

  function getElementType(element) {
    if (element.type === "textarea") {
      return element.type;
    }
    if (!element.getAttribute("type") && element.tagName.toLowerCase() === "input") {
      return "text";
    }
    return element.getAttribute("type");
  }

  // wrap `document.getElementsByTagName`
  // so that unit tests can correctly spy
  // on it in all browsers
  function getElementsByTagName(type) {
    return document.getElementsByTagName(type);
  }

  function preventDefault(evt) {
    evt.preventDefault();
  }

  // Check whether an item is in an array
  // (we don't use Array.prototype.indexOf
  // so we don't clobber any existing polyfills
  // - this is a really simple alternative)
  function inArray(arr, item) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === item) {
        return true;
      }
    }
    return false;
  }

  function moveCaret(elem, index) {
    if (elem.createTextRange) {
      var range = elem.createTextRange();
      range.move("character", index);
      range.select();
    } else if (elem.selectionStart) {
      elem.focus();
      elem.setSelectionRange(index, index);
    }
  }

  function getPlaceholderValue(element) {
    return "placeholder" in element && element.placeholder ||
    // IE10 emulating IE7 fails with getAttribute, hence the use of the attributes node
    // IE returns an empty object instead of undefined if the attribute is not present
    element.attributes.placeholder && element.attributes.placeholder.nodeValue;
  }

  function hasPlaceholderAttrSet(element) {
    return Boolean(getPlaceholderValue(element));
  }

  function some(items, fn) {
    for (var i = 0; i < items.length; i++) {
      if (items[i] != null && fn(items[i])) {
        return true;
      }
    }
    return false;
  }

  var supportedElementTypes = ["text", "search", "url", "tel", "email", "password", "number", "textarea"];

  // The list of keycodes that are not allowed when the polyfill is configured
  // to hide-on-input.
  var badKeys = [

  // The following keys all cause the caret to jump to the end of the input
  // value.

  27, // Escape
  33, // Page up
  34, // Page down
  35, // End
  36, // Home

  // Arrow keys allow you to move the caret manually, which should be
  // prevented when the placeholder is visible.

  37, // Left
  38, // Up
  39, // Right
  40, // Down

  // The following keys allow you to modify the placeholder text by removing
  // characters, which should be prevented when the placeholder is visible.

  8, // Backspace
  46 // Delete
  ];

  // Opera Mini v7 doesn't support placeholder although its DOM seems to indicate so
  var isOperaMini = Object.prototype.toString.call(window.operamini) === "[object OperaMini]";

  function isElementSupported(element) {
    return "placeholder" in document.createElement(element) && !isOperaMini;
  }

  function isInputSupported() {
    return isElementSupported("input");
  }

  function isTextareaSupported() {
    return isElementSupported("textarea");
  }

  function hasNativePlaceholderSupport() {
    return isInputSupported() || isTextareaSupported();
  }

  // Avoid IE9 activeElement of death when an iframe is used.
  //
  // More info:
  // - http://bugs.jquery.com/ticket/13393
  // - https://github.com/jquery/jquery/commit/85fc5878b3c6af73f42d61eedf73013e7faae408
  function safeActiveElement() {
    /*eslint-disable no-empty */
    try {
      return document.activeElement;
    } catch (ex) {}
    /*eslint-enable no-empty */
  }

  function isSupportedType(elementType) {
    return inArray(supportedElementTypes, elementType);
  }

  function isBadKey(keyCode) {
    return inArray(badKeys, keyCode);
  }

  function isIE9() {
    var ie9 = /MSIE 9/i;
    return ie9.test(window.navigator.userAgent);
  }

  function canChangeToType(elem, type) {
    // IE9 can change type from password to text,
    // but not back from text to password.
    if (isIE9()) {
      return false;
    }
    // Input type can not be changed in IE8 and below.
    try {
      var oldType = elem.type;
      elem.type = type;
      elem.type = oldType;
      return true;
    } catch (ex) {
      return false;
    }
  }

  function needsToShowPlaceHolder(elem) {
    return hasPlaceholderAttrSet(elem) && isSupportedType(getElementType(elem));
  }

  function hasWatchAttrSetToFalse(element) {
    return element.getAttribute("data-placeholder-watch") === "false";
  }

  function hasModeAttrSetToInput(element) {
    return element.getAttribute("data-placeholder-mode") === "input";
  }

  function hasEventsAttrSetToTrue(element) {
    return element.getAttribute("data-placeholder-has-events") === "true";
  }

  function hasActiveAttrSetToTrue(element) {
    return element.getAttribute("data-placeholder-active") === "true";
  }

  function hasSubmitAttrSetToTrue(element) {
    return element.getAttribute("data-placeholder-submit") === "true";
  }

  function hasCloneAttrSetToTrue(element) {
    return element.getAttribute("data-placeholder-clone") === "true";
  }

  function hasValueAttr(element) {
    return element.getAttribute("data-placeholder-value") != null;
  }

  function hasTypeAttrSetToPassword(element) {
    return element.getAttribute("data-placeholder-type") === "password";
  }

  function setSubmitAttr(element) {
    element.setAttribute("data-placeholder-submit", "true");
  }

  function setCloneAttr(element) {
    element.setAttribute("data-placeholder-clone", "true");
  }

  function setActiveAttr(element) {
    element.setAttribute("data-placeholder-active", "true");
  }

  function setEventsAttr(element) {
    element.setAttribute("data-placeholder-has-events", "true");
  }

  function setValueAttr(element, value) {
    element.setAttribute("data-placeholder-value", value);
  }

  function setElementValueAttr(element, value) {
    element.setAttribute("data-placeholder-element-value", value);
  }

  function getElementValueAttr(element) {
    return element.getAttribute("data-placeholder-element-value");
  }

  function getValueAttr(element) {
    return element.getAttribute("data-placeholder-value");
  }

  function getMaxLengthAttr(element) {
    return element.getAttribute("data-placeholder-maxlength");
  }

  function setMaxLengthAttr(element) {
    element.setAttribute("data-placeholder-maxlength", element.maxLength);
  }

  function getTypeAttr(element) {
    return element.getAttribute("data-placeholder-type");
  }

  function setTypeAttr(element, type) {
    element.setAttribute("data-placeholder-type", type);
  }

  function removeMaxLengthAttr(element) {
    element.removeAttribute("data-placeholder-maxlength");
  }

  function removeActiveAttr(element) {
    element.removeAttribute("data-placeholder-active");
  }

  function removeSubmitAttr(element) {
    element.removeAttribute("data-placeholder-submit");
  }

  function removeDataAttrs(element) {
    var attrs = ["value", "element-value", "has-events", "active", "maxlength", "type"];

    each(attrs, function (attr) {
      element.removeAttribute("data-placeholder-" + attr);
    });
  }

  var inputElements = [];
  var textareaElements = [];

  function getInputElements() {
    return inputElements;
  }

  function getTextareaElements() {
    return textareaElements;
  }

  function getForm(element) {
    var form = element.form;
    if (typeof form === "string") {
      form = document.getElementById(form);
    }
    return form;
  }

  function forEachForm(callback) {
    var forms = document.getElementsByTagName("form");
    each(forms, callback);
  }

  function forEachChildInput(element, callback) {
    var inputs = element.getElementsByTagName("input");
    var textareas = element.getElementsByTagName("textarea");
    each(inputs, callback);
    each(textareas, callback);
  }

  function forEachElement(callback) {
    each(inputElements, function (element) {
      callback(element);
    });
    each(textareaElements, function (element) {
      callback(element);
    });
  }

  function getElements() {
    // Get references to all the input and textarea elements currently in the DOM
    // (live NodeList objects to we only need to do this once)
    if (!isInputSupported()) {
      inputElements = getElementsByTagName("input");
    }
    if (!isTextareaSupported()) {
      textareaElements = getElementsByTagName("textarea");
    }
  }

  function swapId(from, to) {
    var id = from.id;
    if (id === "") {
      return;
    }
    from.removeAttribute("id");
    to.id = id;
  }

  function swapValue(from, to) {
    to.value = from.value;
    from.value = "";
  }

  function swapVisibility(from, to) {
    from.style.display = "none";
    to.style.display = "block";
  }

  function swapElements(from, to) {
    swapId(from, to);
    swapValue(from, to);
    swapVisibility(from, to);
  }

  function isClonedPasswordInput(element) {
    return element != null && element.nodeType === 1 && hasCloneAttrSetToTrue(element);
  }

  function getPasswordClone(element) {
    return element.previousSibling;
  }

  function getPasswordOriginal(element) {
    return element.nextSibling;
  }

  function hasPasswordClone(element) {
    return isClonedPasswordInput(getPasswordClone(element));
  }

  function createCloneElement(element) {
    var clone = document.createElement("input");
    setAttributes(clone, getAttributes(element));
    clone.type = "text";
    clone.removeAttribute("name");
    clone.style.display = "none";
    setCloneAttr(clone);
    return clone;
  }

  function createClone(element) {
    var clone = createCloneElement(element);
    element.parentNode.insertBefore(clone, element);
  }

  function removeClone(element) {
    var clone = getPasswordClone(element);
    swapElements(clone, element);
    element.style.display = "";
    clone.parentNode.removeChild(clone);
  }

  function isPasswordInputThatCanNotChange(elem) {
    return elem.type === "password" && !canChangeToType(elem, "text");
  }

  function createPasswordCloneIfNeeded(element) {
    if (isPasswordInputThatCanNotChange(element)) {
      createClone(element);
    }
  }

  function removePasswordCloneIfExists(element) {
    if (!hasPasswordClone(element)) {
      return;
    }
    removeClone(element);
  }

  var isEnabled$1 = false;
  var isFocusEnabled$1 = true;
  var isWatchingEnabled$1 = false;
  var modeElements = [document.documentElement, document.body];

  function isPlacekeeperEnabled() {
    return isEnabled$1;
  }

  function isPlacekeeperFocusEnabled() {
    return isFocusEnabled$1;
  }

  function isPlacekeeperWatchingEnabled() {
    return isWatchingEnabled$1;
  }

  function hasWatchingDisabled() {
    return some(modeElements, hasWatchAttrSetToFalse);
  }

  function hasFocusDisabled() {
    return some(modeElements, hasModeAttrSetToInput);
  }

  function enableFocus() {
    isFocusEnabled$1 = true;
  }

  function disableFocus() {
    isFocusEnabled$1 = false;
  }

  function enableWatching() {
    isWatchingEnabled$1 = true;
  }

  function disableWatching() {
    isWatchingEnabled$1 = false;
  }

  function disable$1() {
    isEnabled$1 = false;
  }

  function enable$1() {
    isEnabled$1 = true;
  }

  function hasMaxLength(element) {
    return element.attributes.maxLength && element.attributes.maxLength.specified;
  }

  function restoreMaxlength(element) {
    var maxLength = getMaxLengthAttr(element);
    if (!maxLength) {
      return;
    }
    element.setAttribute("maxLength", maxLength);
    removeMaxLengthAttr(element);
  }

  function storeMaxlength(element) {
    if (!hasMaxLength(element)) {
      return;
    }
    setMaxLengthAttr(element);
    // Removing maxLength will not work in IE7,
    // where a default value of 2147483647 is used instead.
    element.removeAttribute("maxLength");
  }

  function showPlaceholder(element) {
    var val = getValueAttr(element);

    if (element.value !== "" || val == null) {
      return;
    }

    if (element.type === "password") {
      if (hasPasswordClone(element)) {
        var clone = getPasswordClone(element);
        swapElements(element, clone);
        element = clone;
      } else {
        element.type = "text";
      }
    }

    element.value = val;
    setActiveAttr(element);
    addClass(element, "placeholder");
    storeMaxlength(element);
  }

  function removePlaceholder(element, replace) {
    element.value = replace ? element.value.replace(getValueAttr(element), "") : "";
    removeActiveAttr(element);
    removeClass(element, "placeholder");
    restoreMaxlength(element);
  }

  function hidePlaceholder$1(element) {

    if (hasTypeAttrSetToPassword(element)) {
      if (isClonedPasswordInput(element)) {
        var original = getPasswordOriginal(element);
        swapElements(element, original);
        element = original;
        element.focus();
      } else {
        element.type = "password";
      }
    }

    removePlaceholder(element, true);
  }

  var handlers = {};
  var keydownVal = undefined;

  function isActiveAndHasPlaceholderSet(element) {
    return hasActiveAttrSetToTrue(element) && element.value === getValueAttr(element);
  }

  function hidePlaceholderOnSubmit(element) {
    if (!isActiveAndHasPlaceholderSet(element)) {
      return;
    }
    hidePlaceholder$1(element);
  }

  function showPlaceholderAfterSubmit(element) {
    if (needsToShowPlaceHolder(element)) {
      showPlaceholder(element);
    }
  }

  function shouldNotHidePlaceholder(element) {
    return !isPlacekeeperFocusEnabled() && isActiveAndHasPlaceholderSet(element);
  }

  function createFocusHandler(element) {
    return function () {
      if (shouldNotHidePlaceholder(element)) {
        moveCaret(element, 0);
      } else if (isActiveAndHasPlaceholderSet(element)) {
        hidePlaceholder$1(element);
        if (element.value === "") {
          moveCaret(element, 0);
        }
      }
    };
  }

  function createBlurHandler(element) {
    return function () {
      if (isActiveAndHasPlaceholderSet(element)) {
        return;
      }
      showPlaceholder(element);
    };
  }

  function createSubmitHandler(form) {
    return function () {
      // Clear the placeholder values so they don't get submitted
      forEachChildInput(form, hidePlaceholderOnSubmit);
      setTimeout(function () {
        forEachChildInput(form, showPlaceholderAfterSubmit);
      }, 10);
    };
  }

  function createKeydownHandler(element) {
    return function (evt) {
      keydownVal = element.value;

      // Prevent the use of certain keys
      // (try to keep the cursor before the placeholder).
      if (isActiveAndHasPlaceholderSet(element) && isBadKey(evt.keyCode)) {
        preventDefault(evt);
        return false;
      }
    };
  }

  function createKeyupHandler(element) {
    return function () {
      if (keydownVal != null && keydownVal !== element.value) {
        hidePlaceholder$1(element);
      }

      // If the element is now empty we need to show the placeholder
      if (element.value === "") {
        element.blur();
        moveCaret(element, 0);
      }
    };
  }

  function createClickHandler(element) {
    return function () {
      if (element === safeActiveElement() && isActiveAndHasPlaceholderSet(element)) {
        moveCaret(element, 0);
      }
    };
  }

  var create = {
    keydown: createKeydownHandler,
    keyup: createKeyupHandler,
    click: createClickHandler,
    blur: createBlurHandler,
    focus: createFocusHandler,
    submit: createSubmitHandler
  };

  var hideOnInputEvents = ["keydown", "keyup", "click"];

  function createEventListener(element, evt) {
    handlers[evt] = create[evt](element);
    addEventListener(element, evt, handlers[evt]);
  }

  function destroyEventListener(element, evt) {
    removeEventListener(element, evt, handlers[evt]);
    delete handlers[evt];
  }

  function addEventListeners(element) {
    createEventListener(element, "blur");
    if (hasPasswordClone(element)) {
      element = getPasswordClone(element);
    }
    createEventListener(element, "focus");

    // If the placeholder should hide on input rather than on focus we need
    // additional event handlers
    if (!isPlacekeeperFocusEnabled()) {
      each(hideOnInputEvents, function (evt) {
        createEventListener(element, evt);
      });
    }
  }

  function hasHideOnInputHandlers() {
    return "keydown" in handlers && "keyup" in handlers && "click" in handlers;
  }

  function removeEventListeners(element) {
    destroyEventListener(element, "blur");
    if (hasPasswordClone(element)) {
      element = getPasswordClone(element);
    }
    destroyEventListener(element, "focus");
    if (hasHideOnInputHandlers()) {
      each(hideOnInputEvents, function (evt) {
        destroyEventListener(element, evt);
      });
    }
  }

  function addSubmitListener(form) {
    createEventListener(form, "submit");
  }

  function removeSubmitListener(form) {
    destroyEventListener(form, "submit");
  }

  function hidePlaceholder(element) {
    if (!isActiveAndHasPlaceholderSet(element)) {
      return;
    }
    removePlaceholder(element, false);
  }

  function clearPlaceholders() {
    forEachElement(hidePlaceholder);
  }

  function addSubmitEvent(form) {
    if (form == null || hasSubmitAttrSetToTrue(form)) {
      return;
    }
    addSubmitListener(form);
    // Set a flag on the form so we know it's been handled
    // (forms can contain multiple inputs).
    setSubmitAttr(form);
  }

  function addUnloadListener() {
    // Disabling placeholders before unloading the page
    // ensures that placeholder values are not stored
    // in browser's "form data" store.
    addEventListener(window, "beforeunload", clearPlaceholders);
  }

  function removeEvents(element) {
    if (!hasEventsAttrSetToTrue(element)) {
      return;
    }
    removeEventListeners(element);
  }

  function removeSubmitEvent(form) {
    if (!hasSubmitAttrSetToTrue(form)) {
      return;
    }
    removeSubmitListener(form);
    removeSubmitAttr(form);
  }

  var settings = {
    defaultLoopDuration: 100
  };
  var loopInterval = null;

  function hasElementsThatNeedPlaceholder(elements) {

    if (!elements) {
      return false;
    }

    for (var i = 0; i < elements.length; i++) {
      if (needsToShowPlaceHolder(elements[i])) {
        return true;
      }
    }

    return false;
  }

  function needsToSetPlaceholder() {
    var needsPlaceholder = hasElementsThatNeedPlaceholder(getInputElements());

    if (needsPlaceholder === false) {
      needsPlaceholder = hasElementsThatNeedPlaceholder(getTextareaElements());
    }

    return needsPlaceholder;
  }

  function setupElement(element, placeholderValue) {
    setValueAttr(element, placeholderValue);
    setTypeAttr(element, getElementType(element));
    setElementValueAttr(element, element.value);
    setEventsAttr(element);
    createPasswordCloneIfNeeded(element);
    addSubmitEvent(getForm(element));
    addEventListeners(element);
  }

  function restoreValue(element) {
    if (getElementValueAttr(element) != null) {
      element.value = getElementValueAttr(element);
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
    removeEvents(element);
    removeDataAttrs(element);
    removePasswordCloneIfExists(element);
    removeClass(element, "placeholder");
  }

  function needsSetup(element) {
    return isSupportedType(getElementType(element)) && !hasEventsAttrSetToTrue(element);
  }

  function hasPlaceholderValueChanged(element, placeholder) {
    return hasValueAttr(element) && getValueAttr(element) !== placeholder;
  }

  function isActiveAndHasValueChanged(element, placeholder) {
    return hasActiveAttrSetToTrue(element) && element.value !== "" && element.value !== placeholder;
  }

  function hasValueOrIsActive(element) {
    return element.value !== "" || element === safeActiveElement();
  }

  function isClone(element) {
    return hasCloneAttrSetToTrue(element) && getPasswordOriginal(element) != null;
  }

  function hasChangedType(element) {
    var el = isClone(element) ? getPasswordOriginal(element) : element;
    return getElementType(el) !== getTypeAttr(element);
  }

  function handleTypeChange(element) {

    if (!hasChangedType(element)) {
      return;
    }

    if (isClone(element)) {
      var type = getTypeAttr(element);
      element = getPasswordOriginal(element);
      element.setAttribute("type", type);
    }

    cleanupElement(element);
  }

  function checkForPlaceholder(element) {

    if (!element) {
      return;
    }

    var placeholder = getPlaceholderValue(element);
    var clone = undefined;

    if (hasPasswordClone(element)) {
      clone = getPasswordClone(element);
    }

    if (!placeholder || clone && !getPlaceholderValue(clone)) {
      if (hasEventsAttrSetToTrue(element)) {
        cleanupElement(element, clone);
      }
      return;
    }

    handleTypeChange(element);

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
        setValueAttr(element, placeholder);
        element.value = placeholder;
        var original = getPasswordOriginal(element);
        if (original && original.nodeType === 1) {
          original.setAttribute("placeholder", placeholder);
          setValueAttr(original, placeholder);
        }
      }
      if (getValueAttr(element) !== element.value) {
        setElementValueAttr(element, element.value);
      }
      if (isActiveAndHasValueChanged(element, placeholder)) {
        hidePlaceholder$1(element);
      }
    }

    if (!hasValueOrIsActive(element)) {
      showPlaceholder(element);
    }
  }

  function setupPlaceholders() {
    forEachElement(checkForPlaceholder);
  }

  function placekeeperLoop() {
    if (hasFocusDisabled()) {
      disableFocus();
    } else {
      enableFocus();
    }

    if (needsToSetPlaceholder()) {
      enable$1();
    } else {
      disable$1();
    }

    if (hasNativePlaceholderSupport()) {
      return;
    }

    setupPlaceholders();
  }

  function init() {
    if (hasNativePlaceholderSupport()) {
      return;
    }
    clearInterval(loopInterval);
    placekeeperLoop();
    if (!hasWatchingDisabled()) {
      enableWatching();
      // main loop
      loopInterval = setInterval(placekeeperLoop, settings.defaultLoopDuration);
    } else {
      disableWatching();
    }
  }

  function disablePlacekeeper() {
    disable$1();
    clearInterval(loopInterval);
    forEachForm(removeSubmitEvent);
    forEachElement(cleanupElement);
  }

  getElements();
  addUnloadListener();
  init();

  // Make sure that ES3 envs don't
  // throw when Object.freeze is used.
  if (!Object.freeze) {
    Object.freeze = function (obj) {
      return obj;
    };
  }

  // Expose public methods
  var isEnabled = isPlacekeeperEnabled;
  var enable = init;
  var disable = disablePlacekeeper;
  var isFocusEnabled = isPlacekeeperFocusEnabled;
  var isWatchingEnabled = isPlacekeeperWatchingEnabled;

  var placekeeper = Object.freeze({
    settings: settings,
    hasElementsThatNeedPlaceholder: hasElementsThatNeedPlaceholder,
    setupPlaceholders: setupPlaceholders,
    init: init,
    isEnabled: isEnabled,
    enable: enable,
    disable: disable,
    isFocusEnabled: isFocusEnabled,
    isWatchingEnabled: isWatchingEnabled
  });

  if (typeof define === "function" && define.amd) {
    define("placekeeper", [], function () {
      return placekeeper;
    });
  } else if ((typeof exports === "undefined" ? "undefined" : babelHelpers["typeof"](exports)) === "object") {
    module.exports = placekeeper;
  } else {
    window.placekeeper = placekeeper;
  }

  var originalGetValueMethod = Form.Element.Methods.getValue;
  var originalGetValueStatic = Form.Element.getValue;
  var originalGlobal = $F;

  function _getValue(originalFn, elem) {
    if (elem.getAttribute("data-placeholder-active")) {
      return "";
    }
    /*jshint validthis: true */
    return originalFn.call(this, elem);
  }

  if (!hasNativePlaceholderSupport()) {

    /*global $F:true */
    $F = function (elem) {
      return _getValue.call(this, originalGlobal, elem);
    };

    Form.Element.getValue = function (elem) {
      return _getValue.call(this, originalGetValueStatic, elem);
    };

    Element.addMethods(["INPUT", "TEXTAREA"], {
      getValue: function getValue(elem) {
        return _getValue.call(this, originalGetValueMethod, elem);
      }
    });
  }

})();