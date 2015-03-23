(function(global) {
    "use strict";

    global.placekeeper = global.placekeeper || {};
    var utils = global.placekeeper.utils;

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

    function showPlaceholder(element) {
        var val = element.getAttribute("data-placeholder-value");
        if (element.value === "" && val != null) {
            element.value = val;
            element.setAttribute("data-placeholder-active", "true");
            utils.addClass(element, "placeholder");
            storeMaxlength(element);
        }
    }

    function hidePlaceholder(element) {
        element.value = element.value.replace(element.getAttribute("data-placeholder-value"), "");
        element.removeAttribute("data-placeholder-active");
        utils.removeClass(element, "placeholder");
        restoreMaxlength(element);
    }

    // Expose public methods
    global.placekeeper.polyfill = {
        __storeMaxlength: storeMaxlength,
        __restoreMaxlength: restoreMaxlength,
        __showPlaceholder: showPlaceholder,
        __hidePlaceholder: hidePlaceholder
    };

}(this));
