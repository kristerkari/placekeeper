(function(global) {
    "use strict";

    global.placekeeper = global.placekeeper || {};

    var support = global.placekeeper.support;
    var isEnabled = false;
    var loopInterval = null;
    var isFocusEnabled = true;

    function isPlacekeeperEnabled() {
        return isEnabled;
    }

    function isPlacekeeperFocusEnabled() {
        return isFocusEnabled;
    }

    function hasPlaceholderAttrSet(element) {
        return "placeholder" in element && element.placeholder !== "";
    }

    function hasElementsThatNeedPlaceholder(elementType) {
        var elements = document.getElementsByTagName(elementType);

        for (var i = 0; i < elements.length; i++) {
            if (hasPlaceholderAttrSet(elements[i])) {
                return true;
            }
        }
        return false;
    }

    function needsToSetPlaceholder() {
        var needsPlaceholder = hasElementsThatNeedPlaceholder("input");

        if (needsPlaceholder === false) {
            needsPlaceholder = hasElementsThatNeedPlaceholder("textarea");
        }
        return needsPlaceholder;
    }

    function hasLiveUpdatesAttrSetToFalse(element) {
        return element.getAttribute("data-placeholder-live") === "false";
    }

    function hasFocusAttrSetToFalse(element) {
        return element.getAttribute("data-placeholder-focus") === "false";
    }

    function hasDisabledLiveUpdates() {
        return hasLiveUpdatesAttrSetToFalse(document.documentElement) ||
               hasLiveUpdatesAttrSetToFalse(document.body);
    }

    function hasFocusDisabled() {
        return hasFocusAttrSetToFalse(document.documentElement) ||
               hasFocusAttrSetToFalse(document.body);
    }

    function placekeeperLoop() {
        if (hasFocusDisabled()) {
            isFocusEnabled = false;
        }

        isEnabled = needsToSetPlaceholder();

        if (!isEnabled) {
            return;
        }

    }

    function init() {
        if (!support.hasNativePlaceholderSupport()) {
            clearInterval(loopInterval);
            placekeeperLoop();
            if (!hasDisabledLiveUpdates()) {
                // main loop
                loopInterval = setInterval(placekeeperLoop, 100);
            }
        }
    }

    function disablePlacekeeper() {
        isEnabled = false;
        clearInterval(loopInterval);
    }

    // Expose public methods
    global.placekeeper.init = init;
    global.placekeeper.isEnabled = isPlacekeeperEnabled;
    global.placekeeper.enable = init;
    global.placekeeper.disable = disablePlacekeeper;
    global.placekeeper.isFocusEnabled = isPlacekeeperFocusEnabled;

}(this));
