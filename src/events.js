(function() {

    var utils = placekeeper.utils;
    var data = placekeeper.data;
    var mode = placekeeper.mode;
    var elems = placekeeper.elements;
    var polyfill = placekeeper.polyfill;
    var support = placekeeper.support;
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
        polyfill.__removePlaceholder(element, false);
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
        // Disabling placeholders before unloading the page
        // ensures that placeholder values are not stored
        // in browser's "form data" store.
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

    placekeeper.events = {
        handlers: handlers,
        addEventListeners: addEventListeners,
        addSubmitEvent: addSubmitEvent,
        addUnloadListener: addUnloadListener,
        removeEvents: removeEvents,
        removeSubmitEvent: removeSubmitEvent
    };

}());
