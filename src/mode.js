(function() {

  var data = placekeeper.data;

  var isEnabled = false;
  var isFocusEnabled = true;
  var isWatchingEnabled = false;

  function isPlacekeeperEnabled() {
    return isEnabled;
  }

  function isPlacekeeperFocusEnabled() {
    return isFocusEnabled;
  }

  function isPlacekeeperWatchingEnabled() {
    return isWatchingEnabled;
  }

  function hasWatchingDisabled() {
    return data.hasWatchAttrSetToFalse(document.documentElement) ||
           data.hasWatchAttrSetToFalse(document.body);
  }

  function hasFocusDisabled() {
    return data.hasModeAttrSetToInput(document.documentElement) ||
           data.hasModeAttrSetToInput(document.body);
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
