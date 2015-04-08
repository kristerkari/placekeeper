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
