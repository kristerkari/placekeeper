(function(global) {
    "use strict";

    global.placekeeper = global.placekeeper || {};

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

    // Expose public methods
    global.placekeeper.support = {
        canChangeToType: canChangeToType,
        isInputSupported: isInputSupported,
        isTextareaSupported: isTextareaSupported,
        hasNativePlaceholderSupport: hasNativePlaceholderSupport
    };

}(this));

(function(global) {
    "use strict";

    global.placekeeper = global.placekeeper || {};

    function addEventListener(elem, event, fn) {
        if (elem.addEventListener) {
            return elem.addEventListener(event, fn, false);
        }
        if (elem.attachEvent) {
            return elem.attachEvent("on" + event, fn);
        }
    }

    function removeEventListener(elem, event, fn) {
        if (elem.removeEventListener) {
            return elem.removeEventListener(event, fn, false);
        }
        if (elem.detachEvent) {
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

    function getAttributes(elem) {
        var newAttrs = {};
        var attrs = elem.attributes;
        for (var i = 0; i < attrs.length; i++) {
            // old IEs will throw an error if you try to copy "type" attribute.
            if (attrs[i].specified && attrs[i].name !== "type") {
                newAttrs[attrs[i].name] = attrs[i].value;
            }
        }
        return newAttrs;
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
        if (!element.getAttribute("type") &&
            element.tagName.toLowerCase() === "input") {
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

    // Check whether an item is in an array
    // (we don't use Array.prototype.indexOf
    // so we don't clobber any existing polyfills
    // - this is a really simple alternative)
    function inArray(arr, item) {
        var len = arr.length;
        for (var i = 0; i < len; i++) {
            if (arr[i] === item) {
                return true;
            }
        }
        return false;
    }

    // Expose public methods
    global.placekeeper.utils = {
        getAttributes: getAttributes,
        setAttributes: setAttributes,
        getElementType: getElementType,
        addEventListener: addEventListener,
        removeEventListener: removeEventListener,
        addClass: addClass,
        removeClass: removeClass,
        hasClass: hasClass,
        getElementsByTagName: getElementsByTagName,
        inArray: inArray
    };

}(this));

(function(global) {
    "use strict";

    global.placekeeper = global.placekeeper || {};
    var support = global.placekeeper.support;
    var utils = global.placekeeper.utils;
    var handlers = {};

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

    // TODO: refactor clone/event handling.
    function createFocusHandler(element) {
        return function() {
            global.placekeeper.polyfill.__hidePlaceholder(element);
        };
    }

    function createClone(element) {
        var clone = document.createElement("input");
        utils.setAttributes(clone, utils.getAttributes(element));
        clone.type = "text";
        clone.removeAttribute("name");
        handlers.focus = createFocusHandler(clone);
        utils.addEventListener(clone, "focus", handlers.focus);
        clone.setAttribute("data-placeholder-clone", "true");
        return clone;
    }

    function swapId(from, to) {
        var id = from.id;
        if (id === "") {
            return;
        }
        from.removeAttribute("id");
        to.id = id;
    }

    function swapElements(from, to) {
        swapId(from, to);
        from.style.display = "none";
        to.style.display = "block";
    }

    function isClonedPasswordInput(element) {
        return element != null &&
               element.nodeType === 1 &&
               element.getAttribute("data-placeholder-clone") === "true";
    }

    function isPasswordInput(element) {
        return element.getAttribute("data-placeholder-type") === "password";
    }

    // TODO: refactor clone/event handling.
    function removeEventListeners(element) {
        utils.removeEventListener(element, "focus", handlers.focus);
    }

    // TODO: refactor clone/event handling.
    function removeClone(element) {
        var clone = element.previousSibling;
        if (isClonedPasswordInput(clone)) {
            removeEventListeners(clone);
            swapElements(clone, element);
            element.style.display = "";
            clone.parentNode.removeChild(clone);
        }
    }

    function showPlaceholder(element) {
        var val = element.getAttribute("data-placeholder-value");

        if (element.value !== "" || val == null) {
            return;
        }

        if (element.type === "password") {
            if (support.canChangeToType(element, "text")) {
                element.type = "text";
            } else {
                var isExistingClone = isClonedPasswordInput(element.previousSibling);
                var clone = isExistingClone ? element.previousSibling : createClone(element);

                swapElements(element, clone);

                if (!isExistingClone) {
                    element.parentNode.insertBefore(clone, element);
                }

                element = clone;
            }
            element.setAttribute("data-placeholder-type", "password");
        }

        element.value = val;
        element.setAttribute("data-placeholder-active", "true");
        utils.addClass(element, "placeholder");
        storeMaxlength(element);
    }

    function hidePlaceholder(element) {

        if (element.getAttribute("data-placeholder-active") !== "true") {
            return;
        }

        if (isPasswordInput(element)) {
            if (isClonedPasswordInput(element)) {
                var original = element.nextSibling;
                swapElements(element, original);
                element = original;
                element.focus();
            } else {
                element.type = "password";
            }
        }

        element.value = element.value.replace(element.getAttribute("data-placeholder-value"), "");
        element.removeAttribute("data-placeholder-active");
        utils.removeClass(element, "placeholder");
        restoreMaxlength(element);
    }

    // Expose public methods
    global.placekeeper.polyfill = {
        __handlers: handlers,
        __removeClone: removeClone,
        __storeMaxlength: storeMaxlength,
        __restoreMaxlength: restoreMaxlength,
        __showPlaceholder: showPlaceholder,
        __hidePlaceholder: hidePlaceholder
    };

}(this));

(function(global) {
    "use strict";

    global.placekeeper = global.placekeeper || {};

    var support = global.placekeeper.support;
    var utils = global.placekeeper.utils;
    var polyfill = global.placekeeper.polyfill;
    var isEnabled = false;
    var hasUnloadEventListener = false;
    var settings = {
        defaultLoopTime: 100
    };
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
        utils.removeEventListener(element, "blur", handlers.blur);
        // TODO: refactor clone/event handling.
        if (isPasswordInputThatNeedsToBeCloned(element)) {
            polyfill.__removeClone(element);
        } else {
            utils.removeEventListener(element, "focus", handlers.focus);
        }
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
            loopInterval = setInterval(placekeeperLoop, settings.defaultLoopTime);
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
        __settings: settings,
        __getElements: getElements,
        __hasPlaceholderAttrSet: hasPlaceholderAttrSet,
        __setupPlaceholders: setupPlaceholders,
        __handlers: handlers,
        __hasElementsThatNeedPlaceholder: hasElementsThatNeedPlaceholder
    };

}(this));
