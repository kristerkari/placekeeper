(function(global) {
    "use strict";

    global.placekeeper = global.placekeeper || {};

    // wrap `document.getElementsByTagName`
    // so that unit tests can correctly spy
    // on it in all browsers
    function getElementsByTagName(type) {
        return document.getElementsByTagName(type);
    }

    // Expose public methods
    global.placekeeper.utils = {
        getElementsByTagName: getElementsByTagName
    };

}(this));
