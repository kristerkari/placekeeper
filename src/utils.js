(function(global) {
    "use strict";

    global.placekeeper = global.placekeeper || {};

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
        getElementsByTagName: getElementsByTagName,
        inArray: inArray
    };

}(this));
