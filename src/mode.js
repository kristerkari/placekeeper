(function() {

  var data = placekeeper.data;

  var isEnabled = false;
  var isFocusEnabled = true;
  var isWatchingEnabled = false;
  var modeElements = [
    document.documentElement,
    document.body
  ];

  function isPlacekeeperEnabled() {
    return isEnabled;
  }

  function isPlacekeeperFocusEnabled() {
    return isFocusEnabled;
  }

  function isPlacekeeperWatchingEnabled() {
    return isWatchingEnabled;
  }

  function some(elems, boolFn) {
    for (var i = 0; i < elems.length; i++) {
      if (elems[i] != null && boolFn(elems[i])) {
        return true;
      }
    }
    return false;
  }

  function hasWatchingDisabled() {
    return some(modeElements, data.hasWatchAttrSetToFalse);
  }

  function hasFocusDisabled() {
    return some(modeElements, data.hasModeAttrSetToInput);
  }

  function enableFocus() {
    isFocusEnabled = true;
  }

  function disableFocus() {
    isFocusEnabled = false;
  }

  function enableWatching() {
    isWatchingEnabled = true;
  }

  function disableWatching() {
    isWatchingEnabled = false;
  }

  function disable() {
    isEnabled = false;
  }

  function enable() {
    isEnabled = true;
  }

  placekeeper.mode = {
    isPlacekeeperEnabled: isPlacekeeperEnabled,
    isPlacekeeperFocusEnabled: isPlacekeeperFocusEnabled,
    isPlacekeeperWatchingEnabled: isPlacekeeperWatchingEnabled,
    hasWatchingDisabled: hasWatchingDisabled,
    hasFocusDisabled: hasFocusDisabled,
    enableFocus: enableFocus,
    disableFocus: disableFocus,
    enableWatching: enableWatching,
    disableWatching: disableWatching,
    disable: disable,
    enable: enable
  };

}());
