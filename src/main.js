(function(global) {
    "use strict";

    global.placekeeper = global.placekeeper || {};

    var support = global.placekeeper.support;
    var isEnabled = false;
    var loopInterval = null;

    function isPlacekeeperEnabled() {
        return isEnabled;
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

    function placekeeperLoop() {
        isEnabled = needsToSetPlaceholder();

        if (!isEnabled) {
            return;
        }

    }

    function init() {
        if (!support.hasNativePlaceholderSupport()) {
            // main loop
            placekeeperLoop();
            loopInterval = setInterval(placekeeperLoop, 100);
        }
    }

    function disablePlacekeeper() {
        isEnabled = false;
        clearInterval(loopInterval);
    }

    init();

    // Expose public methods
    global.placekeeper.isEnabled = isPlacekeeperEnabled;
    global.placekeeper.enable = init;
    global.placekeeper.disable = disablePlacekeeper;

}(this));
