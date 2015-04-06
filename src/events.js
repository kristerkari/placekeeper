(function(global) {
    "use strict";

    global.placekeeper = global.placekeeper || {};
    var utils = global.placekeeper.utils;
    var data = global.placekeeper.data;
    var elems = global.placekeeper.elements;
    var polyfill = global.placekeeper.polyfill;
    var support = global.placekeeper.support;
    var handlers = {};

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

    function createSubmitHandler(form) {
        return function() {
            // Clear the placeholder values so they don't get submitted
            elems.forEachChildInput(form, hidePlaceholderOnSubmit);
            setTimeout(function() {
                elems.forEachChildInput(form, showPlaceholderAfterSubmit);
            }, 10);
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
    }

    function removeEventListeners(element) {
        utils.removeEventListener(element, "blur", handlers.blur);
        if (elems.hasPasswordClone(element)) {
            element = elems.getPasswordClone(element);
        }
        utils.removeEventListener(element, "focus", handlers.focus);
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
