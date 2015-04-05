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
