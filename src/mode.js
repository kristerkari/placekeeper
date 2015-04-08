(function(global) {
    "use strict";

    global.placekeeper = global.placekeeper || {};
    var data = global.placekeeper.data;

    var isEnabled = false;
    var isFocusEnabled = true;
    var isLiveUpdateEnabled = false;

    function isPlacekeeperEnabled() {
        return isEnabled;
    }

    function isPlacekeeperFocusEnabled() {
        return isFocusEnabled;
    }

    function isPlacekeeperLiveUpdateEnabled() {
        return isLiveUpdateEnabled;
    }

    function hasDisabledLiveUpdates() {
        return data.hasLiveUpdatesAttrSetToFalse(document.documentElement) ||
               data.hasLiveUpdatesAttrSetToFalse(document.body);
    }

    function hasFocusDisabled() {
        return data.hasFocusAttrSetToFalse(document.documentElement) ||
               data.hasFocusAttrSetToFalse(document.body);
    }

    function enableFocus() {
        isFocusEnabled = true;
    }

    function disableFocus() {
        isFocusEnabled = false;
    }

    function enableLive() {
        isLiveUpdateEnabled = true;
    }

    function disableLive() {
        isLiveUpdateEnabled = false;
    }

    function disable() {
        isEnabled = false;
    }

    function enable() {
        isEnabled = true;
    }

    global.placekeeper.mode = {
        isPlacekeeperEnabled: isPlacekeeperEnabled,
        isPlacekeeperFocusEnabled: isPlacekeeperFocusEnabled,
        isPlacekeeperLiveUpdateEnabled: isPlacekeeperLiveUpdateEnabled,
        hasDisabledLiveUpdates: hasDisabledLiveUpdates,
        hasFocusDisabled: hasFocusDisabled,
        enableFocus: enableFocus,
        disableFocus: disableFocus,
        enableLive: enableLive,
        disableLive: disableLive,
        disable: disable,
        enable: enable
    };

}(this));
