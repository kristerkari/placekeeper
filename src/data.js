(function() {

    function hasLiveUpdatesAttrSetToFalse(element) {
        return element.getAttribute("data-placeholder-live") === "false";
    }

    function hasModeAttrSetToInput(element) {
        return element.getAttribute("data-placeholder-mode") === "input";
    }

    function hasEventsAttrSetToTrue(element) {
        return element.getAttribute("data-placeholder-has-events") === "true";
    }

    function hasActiveAttrSetToTrue(element) {
        return element.getAttribute("data-placeholder-active") === "true";
    }

    function hasSubmitAttrSetToTrue(element) {
        return element.getAttribute("data-placeholder-submit") === "true";
    }

    function hasCloneAttrSetToTrue(element) {
        return element.getAttribute("data-placeholder-clone") === "true";
    }

    function hasValueAttr(element) {
        return element.getAttribute("data-placeholder-value") != null;
    }

    function hasTypeAttrSetToPassword(element) {
        return element.getAttribute("data-placeholder-type") === "password";
    }

    function setSubmitAttr(element) {
        element.setAttribute("data-placeholder-submit", "true");
    }

    function setCloneAttr(element) {
        element.setAttribute("data-placeholder-clone", "true");
    }

    function setActiveAttr(element) {
        element.setAttribute("data-placeholder-active", "true");
    }

    function setEventsAttr(element) {
        element.setAttribute("data-placeholder-has-events", "true");
    }

    function setValueAttr(element, value) {
        element.setAttribute("data-placeholder-value", value);
    }

    function getValueAttr(element) {
        return element.getAttribute("data-placeholder-value");
    }

    function getMaxLengthAttr(element) {
        return element.getAttribute("data-placeholder-maxlength");
    }

    function setMaxLengthAttr(element) {
        element.setAttribute("data-placeholder-maxlength", element.maxLength);
    }

    function setTypeAttr(element, type) {
        element.setAttribute("data-placeholder-type", type);
    }

    function removeMaxLengthAttr(element) {
        element.removeAttribute("data-placeholder-maxlength");
    }

    function removeActiveAttr(element) {
        element.removeAttribute("data-placeholder-active");
    }

    function removeSubmitAttr(element) {
        element.removeAttribute("data-placeholder-submit");
    }

    function removeDataAttrs(element) {
        element.removeAttribute("data-placeholder-value");
        element.removeAttribute("data-placeholder-has-events");
        element.removeAttribute("data-placeholder-active");
        element.removeAttribute("data-placeholder-maxlength");
    }

    placekeeper.data = {
        hasLiveUpdatesAttrSetToFalse: hasLiveUpdatesAttrSetToFalse,
        hasModeAttrSetToInput: hasModeAttrSetToInput,
        hasEventsAttrSetToTrue: hasEventsAttrSetToTrue,
        hasActiveAttrSetToTrue: hasActiveAttrSetToTrue,
        hasSubmitAttrSetToTrue: hasSubmitAttrSetToTrue,
        hasCloneAttrSetToTrue: hasCloneAttrSetToTrue,
        hasValueAttr: hasValueAttr,
        hasTypeAttrSetToPassword: hasTypeAttrSetToPassword,
        getMaxLengthAttr: getMaxLengthAttr,
        getValueAttr: getValueAttr,
        setValueAttr: setValueAttr,
        setActiveAttr: setActiveAttr,
        setSubmitAttr: setSubmitAttr,
        setCloneAttr: setCloneAttr,
        setMaxLengthAttr: setMaxLengthAttr,
        setTypeAttr: setTypeAttr,
        setEventsAttr: setEventsAttr,
        removeSubmitAttr: removeSubmitAttr,
        removeMaxLengthAttr: removeMaxLengthAttr,
        removeActiveAttr: removeActiveAttr,
        removeDataAttrs: removeDataAttrs
    };

}());
