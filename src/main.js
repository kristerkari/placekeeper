(function(global) {
    "use strict";

    global.placekeeper = global.placekeeper || {};

    var support = global.placekeeper.support;
    var utils = global.placekeeper.utils;
    var polyfill = global.placekeeper.polyfill;
    var isEnabled = false;
    var loopInterval = null;
    var isFocusEnabled = true;
    var inputElements = [];
    var textareaElements = [];

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

    function getPlaceholderValue(element) {
        return "placeholder" in element &&
               element.placeholder ||
               // IE10 emulating IE7 fails with getAttribute, hence the use of the attributes node
               // IE returns an empty object instead of undefined if the attribute is not present
               element.attributes.placeholder &&
               element.attributes.placeholder.nodeValue;
    }

    function hasPlaceholderAttrSet(element) {
        return Boolean(getPlaceholderValue(element));
    }

    function hasMaxLength(element) {
        return element.attributes.maxLength && element.attributes.maxLength.specified;
    }

    function restoreMaxlength(element) {
        var maxLength = element.getAttribute("data-placeholder-maxlength");
        if (!maxLength) {
            return;
        }
        element.setAttribute("maxLength", maxLength);
        element.removeAttribute("data-placeholder-maxlength");
    }

    function storeMaxlength(element) {
        if (!hasMaxLength(element)) {
            return;
        }
        element.setAttribute("data-placeholder-maxlength", element.maxLength);
        // Removing maxLength will not work in IE7,
        // where a default value of 2147483647 is used instead.
        element.removeAttribute("maxLength");
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

    function hasAttrSetToFalse(element, attr) {
        return element.getAttribute(attr) === "false";
    }

    function hasLiveUpdatesAttrSetToFalse(element) {
        return hasAttrSetToFalse(element, "data-placeholder-live");
    }

    function hasFocusAttrSetToFalse(element) {
        return hasAttrSetToFalse(element, "data-placeholder-focus");
    }

    function hasEventsAttrSetToTrue(element) {
        return element.getAttribute("data-placeholder-has-events") === "true";
    }

    function hasDisabledLiveUpdates() {
        return hasLiveUpdatesAttrSetToFalse(document.documentElement) ||
               hasLiveUpdatesAttrSetToFalse(document.body);
    }

    function hasFocusDisabled() {
        return hasFocusAttrSetToFalse(document.documentElement) ||
               hasFocusAttrSetToFalse(document.body);
    }

    function setupEvents(element) {
        utils.addEventListener(element, "focus", function() {
            polyfill.__hidePlaceholder(element);
        });

        utils.addEventListener(element, "blur", function() {
            polyfill.__showPlaceholder(element);
        });
    }

    function setupElement(element, placeholderValue) {
        element.setAttribute("data-placeholder-value", placeholderValue);
        element.setAttribute("data-placeholder-has-events", "true");
        setupEvents(element);
        polyfill.__showPlaceholder(element);
    }

    function checkForPlaceholder(element) {
        var placeholder = getPlaceholderValue(element);
        if (placeholder &&
            isSupportedType(getElementType(element)) &&
            !hasEventsAttrSetToTrue(element)) {
            setupElement(element, placeholder);
        }
    }

    function setupPlaceholders() {
        var length = inputElements.length + textareaElements.length;
        for (var i = 0; i < length; i++) {
            var element = i < inputElements.length ? inputElements[i] : textareaElements[i - inputElements.length];
            checkForPlaceholder(element);
        }
    }

    function placekeeperLoop() {
        if (hasFocusDisabled()) {
            isFocusEnabled = false;
        }

        isEnabled = needsToSetPlaceholder();

        if (!isEnabled) {
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
        if (!hasDisabledLiveUpdates()) {
            // main loop
            loopInterval = setInterval(placekeeperLoop, 100);
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
        __storeMaxlength: storeMaxlength,
        __restoreMaxlength: restoreMaxlength,
        __setupPlaceholders: setupPlaceholders,
        __hasElementsThatNeedPlaceholder: hasElementsThatNeedPlaceholder
    };

}(this));
