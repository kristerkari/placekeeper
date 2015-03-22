(function(global) {
    "use strict";

    global.placekeeper = global.placekeeper || {};

    function showPlaceholder(element) {
        var val = element.getAttribute("data-placeholder-value");
        if (element.value === "" && val != null) {
            element.value = val;
            element.setAttribute("data-placeholder-active", "true");
        }
    }

    function hidePlaceholder(element) {
        element.value = element.value.replace(element.getAttribute("data-placeholder-value"), "");
        element.removeAttribute("data-placeholder-active");
    }

    // Expose public methods
    global.placekeeper.polyfill = {
        __showPlaceholder: showPlaceholder,
        __hidePlaceholder: hidePlaceholder
    };

}(this));
