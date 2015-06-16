(function() {

  var data = placekeeper.data;
  var utils = placekeeper.utils;

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

  function hasWatchingDisabled() {
    return utils.some(modeElements, data.hasWatchAttrSetToFalse);
  }

  function hasFocusDisabled() {
    return utils.some(modeElements, data.hasModeAttrSetToInput);
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
