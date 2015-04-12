(function(global) {
    "use strict";

    global.placekeeper = global.placekeeper || {};
    var data = global.placekeeper.data;
    var elems = global.placekeeper.elements;
    var utils = global.placekeeper.utils;

    function hasMaxLength(element) {
        return element.attributes.maxLength && element.attributes.maxLength.specified;
    }

    function restoreMaxlength(element) {
        var maxLength = data.getMaxLengthAttr(element);
        if (!maxLength) {
            return;
        }
        element.setAttribute("maxLength", maxLength);
        data.removeMaxLengthAttr(element);
    }

    function storeMaxlength(element) {
        if (!hasMaxLength(element)) {
            return;
        }
        data.setMaxLengthAttr(element);
        // Removing maxLength will not work in IE7,
        // where a default value of 2147483647 is used instead.
        element.removeAttribute("maxLength");
    }

    function showPlaceholder(element) {
        var val = data.getValueAttr(element);

        if (element.value !== "" || val == null) {
            return;
        }

        if (element.type === "password") {
            if (elems.hasPasswordClone(element)) {
                var clone = elems.getPasswordClone(element);
                elems.swapElements(element, clone);
                element = clone;
            } else {
                element.type = "text";
            }
            data.setTypeAttr(element, "password");
        }

        element.value = val;
        data.setActiveAttr(element);
        utils.addClass(element, "placeholder");
        storeMaxlength(element);
    }

    function removePlaceholder(element, replace) {
        element.value = replace ? element.value.replace(data.getValueAttr(element), "") : "";
        data.removeActiveAttr(element);
        utils.removeClass(element, "placeholder");
        restoreMaxlength(element);
    }

    function hidePlaceholder(element) {

        if (!data.hasActiveAttrSetToTrue(element)) {
            return;
        }

        if (data.hasTypeAttrSetToPassword(element)) {
            if (elems.isClonedPasswordInput(element)) {
                var original = elems.getPasswordOriginal(element);
                elems.swapElements(element, original);
                element = original;
                element.focus();
            } else {
                element.type = "password";
            }
        }

        removePlaceholder(element, true);
    }

    global.placekeeper.polyfill = {
        __storeMaxlength: storeMaxlength,
        __restoreMaxlength: restoreMaxlength,
        __removePlaceholder: removePlaceholder,
        __showPlaceholder: showPlaceholder,
        __hidePlaceholder: hidePlaceholder
    };

}(this));
