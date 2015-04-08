(function(global) {
    "use strict";

    global.placekeeper = global.placekeeper || {};

    function hasLiveUpdatesAttrSetToFalse(element) {
        return element.getAttribute("data-placeholder-live") === "false";
    }

    function hasFocusAttrSetToFalse(element) {
        return element.getAttribute("data-placeholder-focus") === "false";
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

    function getValueAttr(element) {
        return element.getAttribute("data-placeholder-value");
    }

    function getMaxLengthAttr(element) {
        return element.getAttribute("data-placeholder-maxlength");
    }

    function setMaxLengthAttr(element) {
        element.setAttribute("data-placeholder-maxlength", element.maxLength);
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
        element.removeAttribute("data-placeholder-value");
        element.removeAttribute("data-placeholder-has-events");
        element.removeAttribute("data-placeholder-active");
        element.removeAttribute("data-placeholder-maxlength");
    }

    global.placekeeper.data = {
        hasLiveUpdatesAttrSetToFalse: hasLiveUpdatesAttrSetToFalse,
        hasFocusAttrSetToFalse: hasFocusAttrSetToFalse,
        hasEventsAttrSetToTrue: hasEventsAttrSetToTrue,
        hasActiveAttrSetToTrue: hasActiveAttrSetToTrue,
        hasSubmitAttrSetToTrue: hasSubmitAttrSetToTrue,
        hasCloneAttrSetToTrue: hasCloneAttrSetToTrue,
        hasValueAttr: hasValueAttr,
        hasTypeAttrSetToPassword: hasTypeAttrSetToPassword,
        getMaxLengthAttr: getMaxLengthAttr,
        getValueAttr: getValueAttr,
        setValueAttr: setValueAttr,
        setActiveAttr: setActiveAttr,
        setSubmitAttr: setSubmitAttr,
        setCloneAttr: setCloneAttr,
        setMaxLengthAttr: setMaxLengthAttr,
        setTypeAttr: setTypeAttr,
        setEventsAttr: setEventsAttr,
        removeSubmitAttr: removeSubmitAttr,
        removeMaxLengthAttr: removeMaxLengthAttr,
        removeActiveAttr: removeActiveAttr,
        removeDataAttrs: removeDataAttrs
    };

}(this));

(function(global) {
    "use strict";

    global.placekeeper = global.placekeeper || {};
    var data = global.placekeeper.data;

    var isEnabled = false;
    var isFocusEnabled = true;
    var isLiveUpdateEnabled = false;

    function isPlacekeeperEnabled() {
        return isEnabled;
    }

    function isPlacekeeperFocusEnabled() {
        return isFocusEnabled;
    }

    function isPlacekeeperLiveUpdateEnabled() {
        return isLiveUpdateEnabled;
    }

    function hasDisabledLiveUpdates() {
        return data.hasLiveUpdatesAttrSetToFalse(document.documentElement) ||
               data.hasLiveUpdatesAttrSetToFalse(document.body);
    }

    function hasFocusDisabled() {
        return data.hasFocusAttrSetToFalse(document.documentElement) ||
               data.hasFocusAttrSetToFalse(document.body);
    }

    function enableFocus() {
        isFocusEnabled = true;
    }

    function disableFocus() {
        isFocusEnabled = false;
    }

    function enableLive() {
        isLiveUpdateEnabled = true;
    }

    function disableLive() {
        isLiveUpdateEnabled = false;
    }

    function disable() {
        isEnabled = false;
    }

    function enable() {
        isEnabled = true;
    }

    global.placekeeper.mode = {
        isPlacekeeperEnabled: isPlacekeeperEnabled,
        isPlacekeeperFocusEnabled: isPlacekeeperFocusEnabled,
        isPlacekeeperLiveUpdateEnabled: isPlacekeeperLiveUpdateEnabled,
        hasDisabledLiveUpdates: hasDisabledLiveUpdates,
        hasFocusDisabled: hasFocusDisabled,
        enableFocus: enableFocus,
        disableFocus: disableFocus,
        enableLive: enableLive,
        disableLive: disableLive,
        disable: disable,
        enable: enable
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
            return elem.attachEvent("on" + event, function(e) {
                e.preventDefault = function() {
                    e.returnValue = false;
                };
                e.stopPropagation = function() {
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

    function preventDefault(evt) {
        evt.preventDefault();
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

    global.placekeeper.utils = {
        moveCaret: moveCaret,
        getPlaceholderValue: getPlaceholderValue,
        hasPlaceholderAttrSet: hasPlaceholderAttrSet,
        getAttributes: getAttributes,
        setAttributes: setAttributes,
        getElementType: getElementType,
        addEventListener: addEventListener,
        removeEventListener: removeEventListener,
        addClass: addClass,
        removeClass: removeClass,
        hasClass: hasClass,
        preventDefault: preventDefault,
        getElementsByTagName: getElementsByTagName,
        inArray: inArray
    };

}(this));

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

(function(global) {
    "use strict";

    global.placekeeper = global.placekeeper || {};
    var support = global.placekeeper.support;
    var utils = global.placekeeper.utils;
    var data = global.placekeeper.data;
    var inputElements = [];
    var textareaElements = [];

    function getInputElements() {
        return inputElements;
    }

    function getTextareaElements() {
        return textareaElements;
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

    function forEachForm(callback) {
        var forms = document.getElementsByTagName("form");
        var length = forms.length;
        for (var i = 0; i < length; i++) {
            callback(forms[i]);
        }
    }

    function forEachChildInput(element, callback) {
        var inputs = element.getElementsByTagName("input");
        var textareas = element.getElementsByTagName("textarea");
        loopElements(inputs, textareas, callback);
    }

    function forEachElement(callback) {
        loopElements(inputElements, textareaElements, callback);
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
               data.hasCloneAttrSetToTrue(element);
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
        utils.setAttributes(clone, utils.getAttributes(element));
        clone.type = "text";
        clone.removeAttribute("name");
        data.setCloneAttr(clone);
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
        return elem.type === "password" && !support.canChangeToType(elem, "text");
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

    global.placekeeper.elements = {
        getInputElements: getInputElements,
        getTextareaElements: getTextareaElements,
        getElements: getElements,
        getPasswordClone: getPasswordClone,
        getPasswordOriginal: getPasswordOriginal,
        forEachForm: forEachForm,
        forEachChildInput: forEachChildInput,
        forEachElement: forEachElement,
        createPasswordCloneIfNeeded: createPasswordCloneIfNeeded,
        removePasswordCloneIfExists: removePasswordCloneIfExists,
        isClonedPasswordInput: isClonedPasswordInput,
        swapElements: swapElements,
        hasPasswordClone: hasPasswordClone
    };

}(this));

(function(global) {
    "use strict";

    global.placekeeper = global.placekeeper || {};
    var data = global.placekeeper.data;
    var elems = global.placekeeper.elements;
    var utils = global.placekeeper.utils;

    function hasMaxLength(element) {
        return element.attributes.maxLength && element.attributes.maxLength.specified;
    }

    function restoreMaxlength(element) {
        var maxLength = data.getMaxLengthAttr(element);
        if (!maxLength) {
            return;
        }
        element.setAttribute("maxLength", maxLength);
        data.removeMaxLengthAttr(element);
    }

    function storeMaxlength(element) {
        if (!hasMaxLength(element)) {
            return;
        }
        data.setMaxLengthAttr(element);
        // Removing maxLength will not work in IE7,
        // where a default value of 2147483647 is used instead.
        element.removeAttribute("maxLength");
    }

    function showPlaceholder(element) {
        var val = data.getValueAttr(element);

        if (element.value !== "" || val == null) {
            return;
        }

        if (element.type === "password") {
            if (elems.hasPasswordClone(element)) {
                var clone = elems.getPasswordClone(element);
                elems.swapElements(element, clone);
                element = clone;
            } else {
                element.type = "text";
            }
            data.setTypeAttr(element, "password");
        }

        element.value = val;
        data.setActiveAttr(element);
        utils.addClass(element, "placeholder");
        storeMaxlength(element);
    }

    function hidePlaceholder(element) {

        if (!data.hasActiveAttrSetToTrue(element)) {
            return;
        }

        if (data.hasTypeAttrSetToPassword(element)) {
            if (elems.isClonedPasswordInput(element)) {
                var original = elems.getPasswordOriginal(element);
                elems.swapElements(element, original);
                element = original;
                element.focus();
            } else {
                element.type = "password";
            }
        }

        element.value = element.value.replace(data.getValueAttr(element), "");
        data.removeActiveAttr(element);
        utils.removeClass(element, "placeholder");
        restoreMaxlength(element);
    }

    global.placekeeper.polyfill = {
        __storeMaxlength: storeMaxlength,
        __restoreMaxlength: restoreMaxlength,
        __showPlaceholder: showPlaceholder,
        __hidePlaceholder: hidePlaceholder
    };

}(this));

(function(global) {
    "use strict";

    global.placekeeper = global.placekeeper || {};
    var utils = global.placekeeper.utils;
    var data = global.placekeeper.data;
    var mode = global.placekeeper.mode;
    var elems = global.placekeeper.elements;
    var polyfill = global.placekeeper.polyfill;
    var support = global.placekeeper.support;
    var handlers = {};
    var keydownVal;

    function hidePlaceholderOnSubmit(element) {
        if (!data.hasActiveAttrSetToTrue(element)) {
            return;
        }
        polyfill.__hidePlaceholder(element);
    }

    function showPlaceholderAfterSubmit(element) {
        if (support.needsToShowPlaceHolder(element)) {
            polyfill.__showPlaceholder(element);
        }
    }

    function isActiveAndHasPlaceholderSet(element) {
        return data.hasActiveAttrSetToTrue(element) &&
               element.value === data.getValueAttr(element);
    }

    function shouldNotHidePlaceholder(element) {
        return !mode.isPlacekeeperFocusEnabled() &&
                isActiveAndHasPlaceholderSet(element);
    }

    function createFocusHandler(element) {
        return function() {
            if (shouldNotHidePlaceholder(element)) {
                utils.moveCaret(element, 0);
            } else {
                polyfill.__hidePlaceholder(element);
            }
        };
    }

    function createBlurHandler(element) {
        return function() {
            polyfill.__showPlaceholder(element);
        };
    }

    function createSubmitHandler(form) {
        return function() {
            // Clear the placeholder values so they don't get submitted
            elems.forEachChildInput(form, hidePlaceholderOnSubmit);
            setTimeout(function() {
                elems.forEachChildInput(form, showPlaceholderAfterSubmit);
            }, 10);
        };
    }

    function createKeydownHandler(element) {
        return function(evt) {
            keydownVal = element.value;

            // Prevent the use of certain keys
            // (try to keep the cursor before the placeholder).
            if (isActiveAndHasPlaceholderSet(element) && support.isBadKey(evt.keyCode)) {
                utils.preventDefault(evt);
                return false;
            }
        };
    }

    function createKeyupHandler(element) {
        return function() {
            if (keydownVal != null && keydownVal !== element.value) {
                polyfill.__hidePlaceholder(element);
            }

            // If the element is now empty we need to show the placeholder
            if (element.value === "") {
                element.blur();
                utils.moveCaret(element, 0);
            }
        };
    }

    function createClickHandler(element) {
        return function() {
            if (element === support.safeActiveElement() &&
                isActiveAndHasPlaceholderSet(element)) {
                utils.moveCaret(element, 0);
            }
        };
    }

    function addEventListeners(element) {
        handlers.blur = createBlurHandler(element);
        utils.addEventListener(element, "blur", handlers.blur);
        if (elems.hasPasswordClone(element)) {
            element = elems.getPasswordClone(element);
        }
        handlers.focus = createFocusHandler(element);
        utils.addEventListener(element, "focus", handlers.focus);

        // If the placeholder should hide on input rather than on focus we need
        // additional event handlers
        if (!mode.isPlacekeeperFocusEnabled()) {
            handlers.keydown = createKeydownHandler(element);
            handlers.keyup = createKeyupHandler(element);
            handlers.click = createClickHandler(element);
            utils.addEventListener(element, "keydown", handlers.keydown);
            utils.addEventListener(element, "keyup", handlers.keyup);
            utils.addEventListener(element, "click", handlers.click);
        }

    }

    function hasHideOnInputHandlers() {
        return "keydown" in handlers &&
               "keyup" in handlers &&
               "click" in handlers;
    }

    function removeEventListeners(element) {
        utils.removeEventListener(element, "blur", handlers.blur);
        if (elems.hasPasswordClone(element)) {
            element = elems.getPasswordClone(element);
        }
        utils.removeEventListener(element, "focus", handlers.focus);
        if (hasHideOnInputHandlers()) {
            utils.removeEventListener(element, "keydown", handlers.keydown);
            utils.removeEventListener(element, "keyup", handlers.keyup);
            utils.removeEventListener(element, "click", handlers.click);
        }
    }

    function addSubmitListener(form) {
        handlers.submit = createSubmitHandler(form);
        utils.addEventListener(form, "submit", handlers.submit);
    }

    function removeSubmitListener(form) {
        utils.removeEventListener(form, "submit", handlers.submit);
    }

    function hidePlaceholder(element) {
        if (!data.hasActiveAttrSetToTrue(element)) {
            return;
        }
        polyfill.__hidePlaceholder(element);
    }

    function clearPlaceholders() {
        elems.forEachElement(hidePlaceholder);
    }

    function addSubmitEvent(form) {
        if (form == null || data.hasSubmitAttrSetToTrue(form)) {
            return;
        }
        addSubmitListener(form);
        // Set a flag on the form so we know it's been handled
        // (forms can contain multiple inputs).
        data.setSubmitAttr(form);
    }

    function addUnloadListener() {
        // Disabling placeholders before unloading the page prevents flash of
        // unstyled placeholders on load if the page was refreshed.
        utils.addEventListener(global, "beforeunload", clearPlaceholders);
    }

    function removeEvents(element) {
        if (!data.hasEventsAttrSetToTrue(element)) {
            return;
        }
        removeEventListeners(element);
    }

    function removeSubmitEvent(form) {
        if (!data.hasSubmitAttrSetToTrue(form)) {
            return;
        }
        removeSubmitListener(form);
        data.removeSubmitAttr(form);
    }

    global.placekeeper.events = {
        handlers: handlers,
        addEventListeners: addEventListeners,
        addSubmitEvent: addSubmitEvent,
        addUnloadListener: addUnloadListener,
        removeEvents: removeEvents,
        removeSubmitEvent: removeSubmitEvent
    };

}(this));

(function(global) {
    "use strict";

    global.placekeeper = global.placekeeper || {};

    var support = global.placekeeper.support;
    var data = global.placekeeper.data;
    var mode = global.placekeeper.mode;
    var utils = global.placekeeper.utils;
    var elems = global.placekeeper.elements;
    var events = global.placekeeper.events;
    var polyfill = global.placekeeper.polyfill;
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
        events.addSubmitEvent(element.form);
        events.addEventListeners(element);
        if (element !== support.safeActiveElement()) {
            polyfill.__showPlaceholder(element);
        }
    }

    function needsSetup(element) {
        return support.isSupportedType(utils.getElementType(element)) &&
               !data.hasEventsAttrSetToTrue(element);
    }

    function hasPlaceholderValueChanged(element, placeholder) {
        return data.hasValueAttr(element) &&
               data.getValueAttr(element) !== placeholder;
    }

    function checkForPlaceholder(element) {
        var placeholder = utils.getPlaceholderValue(element);

        if (!placeholder) {
            return;
        }

        if (needsSetup(element)) {
            setupElement(element, placeholder);
            return;
        }

        if (hasPlaceholderValueChanged(element, placeholder)) {
            data.setValueAttr(element, placeholder);
        }
    }

    function setupPlaceholders() {
        elems.forEachElement(checkForPlaceholder);
    }

    function placekeeperLoop() {
        if (mode.hasFocusDisabled()) {
            mode.disableFocus();
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
    global.placekeeper.isEnabled = mode.isPlacekeeperEnabled;
    global.placekeeper.enable = init;
    global.placekeeper.disable = disablePlacekeeper;
    global.placekeeper.isFocusEnabled = mode.isPlacekeeperFocusEnabled;
    global.placekeeper.isLiveUpdateEnabled = mode.isPlacekeeperLiveUpdateEnabled;

    // Exposed private methods
    global.placekeeper.priv = {
        __global: global,
        __init: init,
        __settings: settings,
        __setupPlaceholders: setupPlaceholders,
        __hasElementsThatNeedPlaceholder: hasElementsThatNeedPlaceholder
    };

}(this));
