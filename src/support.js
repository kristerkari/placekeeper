(function(global) {
    "use strict";

    global.placekeeper = global.placekeeper || {};
    var utils = global.placekeeper.utils;

    var supportedElementTypes = [
        "text",
        "search",
        "url",
        "tel",
        "email",
        "password",
        "number",
        "textarea"
    ];

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

    function isInputSupported() {
        return "placeholder" in document.createElement("input") && !isOperaMini;
    }

    function isTextareaSupported() {
        return "placeholder" in document.createElement("textarea") && !isOperaMini;
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
        return utils.inArray(supportedElementTypes, elementType);
    }

    function isBadKey(keyCode) {
        return utils.inArray(badKeys, keyCode);
    }

    function canChangeToType(elem, type) {
        // IE9 can change type from password to text,
        // but not back from text to password.
        // Input type can not be changed in IE8 and below.
        try {
            var oldType = elem.type;
            elem.type = type;
            elem.type = oldType;
            return true;
        } catch(ex) {
            return false;
        }
    }

    function needsToShowPlaceHolder(elem) {
        return utils.hasPlaceholderAttrSet(elem) &&
               isSupportedType(utils.getElementType(elem));
    }

    global.placekeeper.support = {
        needsToShowPlaceHolder: needsToShowPlaceHolder,
        isSupportedType: isSupportedType,
        isBadKey: isBadKey,
        safeActiveElement: safeActiveElement,
        canChangeToType: canChangeToType,
        isInputSupported: isInputSupported,
        isTextareaSupported: isTextareaSupported,
        hasNativePlaceholderSupport: hasNativePlaceholderSupport
    };

}(this));
