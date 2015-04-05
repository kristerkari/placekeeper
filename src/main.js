(function(global) {
    "use strict";

    global.placekeeper = global.placekeeper || {};

    var support = global.placekeeper.support;
    var utils = global.placekeeper.utils;
    var polyfill = global.placekeeper.polyfill;
    var isEnabled = false;
    var hasUnloadEventListener = false;
    var handlers = {};
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

    function isSupportedType(elementType) {
        return utils.inArray(supportedElementTypes, elementType);
    }

    function hasElementsThatNeedPlaceholder(elements) {

        if (!elements) {
            return false;
        }

        for (var i = 0; i < elements.length; i++) {
            if (hasPlaceholderAttrSet(elements[i]) && isSupportedType(utils.getElementType(elements[i]))) {
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

    function hasActiveAttrSetToTrue(element) {
        return element.getAttribute("data-placeholder-active") === "true";
    }

    function hasSubmitAttrSetToTrue(element) {
        return element.getAttribute("data-placeholder-submit") === "true";
    }

    function hasDisabledLiveUpdates() {
        return hasLiveUpdatesAttrSetToFalse(document.documentElement) ||
               hasLiveUpdatesAttrSetToFalse(document.body);
    }

    function hasFocusDisabled() {
        return hasFocusAttrSetToFalse(document.documentElement) ||
               hasFocusAttrSetToFalse(document.body);
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

    function createFocusHandler(element) {
        return function() {
            polyfill.__hidePlaceholder(element);
        };
    }

    function createBlurHandler(element) {
        return function() {
            polyfill.__showPlaceholder(element);
        };
    }

    function loopElements(inputs, textareas, callback) {
        var length = inputs.length + textareas.length;
        for (var i = 0; i < length; i++) {
            var element = i < inputs.length ?
            inputs[i] :
            textareas[i - inputs.length];
            callback(element);
        }
    }

    function forEachChildInput(element, callback) {
        var inputs = element.getElementsByTagName("input");
        var textareas = element.getElementsByTagName("textarea");
        loopElements(inputs, textareas, callback);
    }

    function forEachForm(callback) {
        var forms = document.getElementsByTagName("form");
        var length = forms.length;
        for (var i = 0; i < length; i++) {
            callback(forms[i]);
        }
    }

    function hidePlaceholderOnSubmit(element) {
        if (!hasActiveAttrSetToTrue(element)) {
            return;
        }
        polyfill.__hidePlaceholder(element);
    }

    function showPlaceholderAfterSubmit(element) {
        if (hasPlaceholderAttrSet(element) &&
            isSupportedType(utils.getElementType(element))) {
            polyfill.__showPlaceholder(element);
        }
    }

    function createSubmitHandler(form) {
        return function() {
            // Clear the placeholder values so they don't get submitted
            forEachChildInput(form, hidePlaceholderOnSubmit);
            setTimeout(function() {
                forEachChildInput(form, showPlaceholderAfterSubmit);
            }, 10);
        };
    }

    function isPasswordInputThatNeedsToBeCloned(element) {
        return element.type === "password" &&
               !support.canChangeToType(element, "text");
    }

    function addEventListeners(element) {
        handlers.blur = createBlurHandler(element);
        utils.addEventListener(element, "blur", handlers.blur);
        // password input clones will get their own focus handler,
        // so the original input won't need one.
        if (!isPasswordInputThatNeedsToBeCloned(element)) {
            handlers.focus = createFocusHandler(element);
            utils.addEventListener(element, "focus", handlers.focus);
        }
    }

    function removeEventListeners(element) {
        utils.removeEventListener(element, "focus", handlers.focus);
        utils.removeEventListener(element, "blur", handlers.blur);
    }

    function removeDataAttrs(element) {
        element.removeAttribute("data-placeholder-value");
        element.removeAttribute("data-placeholder-has-events");
    }

    function addSubmitListener(form) {
        handlers.submit = createSubmitHandler(form);
        utils.addEventListener(form, "submit", handlers.submit);
    }

    function removeSubmitListener(form) {
        utils.removeEventListener(form, "submit", handlers.submit);
    }

    function addSubmitEvent(form) {
        if (form == null || hasSubmitAttrSetToTrue(form)) {
            return;
        }
        addSubmitListener(form);
        // Set a flag on the form so we know it's been handled
        // (forms can contain multiple inputs).
        form.setAttribute("data-placeholder-submit", "true");
    }

    function removeSubmitEvent(form) {
        if (!hasSubmitAttrSetToTrue(form)) {
            return;
        }
        removeSubmitListener(form);
    }

    function setupElement(element, placeholderValue) {
        element.setAttribute("data-placeholder-value", placeholderValue);
        element.setAttribute("data-placeholder-has-events", "true");
        addSubmitEvent(element.form);
        addEventListeners(element);
        if (element !== safeActiveElement()) {
            polyfill.__showPlaceholder(element);
        }
    }

    function checkForPlaceholder(element) {
        var placeholder = getPlaceholderValue(element);
        if (placeholder &&
            isSupportedType(utils.getElementType(element)) &&
            !hasEventsAttrSetToTrue(element)) {
            setupElement(element, placeholder);
        }
    }

    function forEachElement(callback) {
        loopElements(inputElements, textareaElements, callback);
    }

    function hidePlaceholder(element) {
        if (!hasActiveAttrSetToTrue(element)) {
            return;
        }
        polyfill.__hidePlaceholder(element);
    }

    function removeEvents(element) {
        if (!hasEventsAttrSetToTrue(element)) {
            return;
        }
        removeEventListeners(element);
    }

    function clearPlaceholders() {
        forEachElement(hidePlaceholder);
    }

    function setupPlaceholders() {
        forEachElement(checkForPlaceholder);

        if (hasUnloadEventListener) {
            utils.removeEventListener(global, "beforeunload", clearPlaceholders);
        }

        // Disabling placeholders before unloading the page prevents flash of
        // unstyled placeholders on load if the page was refreshed.
        utils.addEventListener(global, "beforeunload", clearPlaceholders);
        hasUnloadEventListener = true;
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
        forEachForm(removeSubmitEvent);
        forEachElement(removeEvents);
        forEachElement(removeDataAttrs);
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
        __global: global,
        __init: init,
        __getElements: getElements,
        __hasPlaceholderAttrSet: hasPlaceholderAttrSet,
        __setupPlaceholders: setupPlaceholders,
        __handlers: handlers,
        __hasElementsThatNeedPlaceholder: hasElementsThatNeedPlaceholder
    };

}(this));
