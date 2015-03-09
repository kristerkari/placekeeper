(function(global) {
    "use strict";

    global.placekeeper = global.placekeeper || {};

    var support = global.placekeeper.support;
    var utils = global.placekeeper.utils;
    var isEnabled = false;
    var loopInterval = null;
    var isFocusEnabled = true;
    var inputElements = null;
    var textareaElements = null;

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

    function isPlacekeeperEnabled() {
        return isEnabled;
    }

    function isPlacekeeperFocusEnabled() {
        return isFocusEnabled;
    }

    function hasPlaceholderAttrSet(element) {
        return Boolean("placeholder" in element &&
               element.placeholder !== "" ||
               element.attributes.placeholder &&
               element.attributes.placeholder.nodeValue !== "");
    }

    function getElementType(element) {
        if (element.type === "textarea") {
            return element.type;
        }
        return element.getAttribute("type");
    }

    function isSupportedType(elementType) {
        return utils.inArray(supportedElementTypes, elementType);
    }

    function hasElementsThatNeedPlaceholder(elements) {

        if (!elements) {
            return false;
        }

        for (var i = 0; i < elements.length; i++) {
            if (hasPlaceholderAttrSet(elements[i]) && isSupportedType(getElementType(elements[i]))) {
                return true;
            }
        }

        return false;
    }

    function needsToSetPlaceholder() {
        var needsPlaceholder = hasElementsThatNeedPlaceholder(inputElements);

        if (needsPlaceholder === false) {
            needsPlaceholder = hasElementsThatNeedPlaceholder(textareaElements);
        }

        return needsPlaceholder;
    }

    function hasLiveUpdatesAttrSetToFalse(element) {
        return element.getAttribute("data-placeholder-live") === "false";
    }

    function hasFocusAttrSetToFalse(element) {
        return element.getAttribute("data-placeholder-focus") === "false";
    }

    function hasDisabledLiveUpdates() {
        return hasLiveUpdatesAttrSetToFalse(document.documentElement) ||
               hasLiveUpdatesAttrSetToFalse(document.body);
    }

    function hasFocusDisabled() {
        return hasFocusAttrSetToFalse(document.documentElement) ||
               hasFocusAttrSetToFalse(document.body);
    }

    function placekeeperLoop() {
        if (hasFocusDisabled()) {
            isFocusEnabled = false;
        }

        isEnabled = needsToSetPlaceholder();

        if (!isEnabled) {
            return;
        }

    }

    function init() {
        if (!support.hasNativePlaceholderSupport()) {
            clearInterval(loopInterval);
            placekeeperLoop();
            if (!hasDisabledLiveUpdates()) {
                // main loop
                loopInterval = setInterval(placekeeperLoop, 100);
            }
        }
    }

    function disablePlacekeeper() {
        isEnabled = false;
        clearInterval(loopInterval);
    }

    function getElements() {
        // Get references to all the input and textarea elements currently in the DOM
        // (live NodeList objects to we only need to do this once)
        if (!support.isInputSupported()) {
            inputElements = utils.getElementsByTagName("input");
        }
        if (!support.isTextareaSupported()) {
            textareaElements = utils.getElementsByTagName("textarea");
        }
    }

    getElements();
    init();

    // Expose public methods
    global.placekeeper.isEnabled = isPlacekeeperEnabled;
    global.placekeeper.enable = init;
    global.placekeeper.disable = disablePlacekeeper;
    global.placekeeper.isFocusEnabled = isPlacekeeperFocusEnabled;

    // Exposed private methods
    global.placekeeper.priv = {
        __init: init,
        __getElements: getElements,
        __hasPlaceholderAttrSet: hasPlaceholderAttrSet,
        __hasElementsThatNeedPlaceholder: hasElementsThatNeedPlaceholder
    };

}(this));
