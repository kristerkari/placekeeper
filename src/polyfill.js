(function(global) {
    "use strict";

    global.placekeeper = global.placekeeper || {};
    var support = global.placekeeper.support;
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

    // TODO: get rid of this duplicate code.
    function createFocusHandler(element) {
        return function() {
            global.placekeeper.polyfill.__hidePlaceholder(element);
        };
    }

    function createClone(element) {
        var clone = document.createElement("input");
        utils.setAttributes(clone, utils.getAttributes(element));
        clone.type = "text";
        clone.removeAttribute("name");
        var focusHandler = createFocusHandler(clone);
        utils.addEventListener(clone, "focus", focusHandler);
        clone.setAttribute("data-placeholder-clone", "true");
        return clone;
    }

    function swapId(from, to) {
        var id = from.id;
        if (id === "") {
            return;
        }
        from.removeAttribute("id");
        to.id = id;
    }

    function swapElements(from, to) {
        swapId(from, to);
        from.style.display = "none";
        to.style.display = "block";
    }

    function isClonedPasswordInput(element) {
        return element != null &&
               element.nodeType === 1 &&
               element.getAttribute("data-placeholder-clone") === "true";
    }

    function isPasswordInput(element) {
        return element.getAttribute("data-placeholder-type") === "password";
    }

    function showPlaceholder(element) {
        var val = element.getAttribute("data-placeholder-value");

        if (element.value !== "" || val == null) {
            return;
        }

        if (element.type === "password") {
            if (support.canChangeToType(element, "text")) {
                element.type = "text";
            } else {
                var isExistingClone = isClonedPasswordInput(element.previousSibling);
                var clone = isExistingClone ? element.previousSibling : createClone(element);

                swapElements(element, clone);

                if (!isExistingClone) {
                    element.parentNode.insertBefore(clone, element);
                }

                element = clone;
            }
            element.setAttribute("data-placeholder-type", "password");
        }

        element.value = val;
        element.setAttribute("data-placeholder-active", "true");
        utils.addClass(element, "placeholder");
        storeMaxlength(element);
    }

    function hidePlaceholder(element) {

        if (element.getAttribute("data-placeholder-active") !== "true") {
            return;
        }

        if (isPasswordInput(element)) {
            if (isClonedPasswordInput(element)) {
                var original = element.nextSibling;
                swapElements(element, original);
                element = original;
                element.focus();
            } else {
                element.type = "password";
            }
        }

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
