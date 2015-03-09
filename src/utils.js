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
        addEventListener: addEventListener,
        removeEventListener: removeEventListener,
        addClass: addClass,
        removeClass: removeClass,
        hasClass: hasClass,
        getElementsByTagName: getElementsByTagName,
        inArray: inArray
    };

}(this));
