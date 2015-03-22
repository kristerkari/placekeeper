(function(global) {
    "use strict";

    global.placekeeper = global.placekeeper || {};
    var utils = global.placekeeper.utils;

    function showPlaceholder(element) {
        var val = element.getAttribute("data-placeholder-value");
        if (element.value === "" && val != null) {
            element.value = val;
            element.setAttribute("data-placeholder-active", "true");
            utils.addClass(element, "placeholder");
        }
    }

    function hidePlaceholder(element) {
        element.value = element.value.replace(element.getAttribute("data-placeholder-value"), "");
        element.removeAttribute("data-placeholder-active");
        utils.removeClass(element, "placeholder");
    }

    // Expose public methods
    global.placekeeper.polyfill = {
        __showPlaceholder: showPlaceholder,
        __hidePlaceholder: hidePlaceholder
    };

}(this));
