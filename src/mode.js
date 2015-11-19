import * as data from "./data.js";
import * as utils from "./utils.js";

var isEnabled = false;
var isFocusEnabled = true;
var isWatchingEnabled = false;
var modeElements = [
  document.documentElement,
  document.body
];

export function isPlacekeeperEnabled() {
  return isEnabled;
}

export function isPlacekeeperFocusEnabled() {
  return isFocusEnabled;
}

export function isPlacekeeperWatchingEnabled() {
  return isWatchingEnabled;
}

export function hasWatchingDisabled() {
  return utils.some(modeElements, data.hasWatchAttrSetToFalse);
}

export function hasFocusDisabled() {
  return utils.some(modeElements, data.hasModeAttrSetToInput);
}

export function enableFocus() {
  isFocusEnabled = true;
}

export function disableFocus() {
  isFocusEnabled = false;
}

export function enableWatching() {
  isWatchingEnabled = true;
}

export function disableWatching() {
  isWatchingEnabled = false;
}

export function disable() {
  isEnabled = false;
}

export function enable() {
  isEnabled = true;
}
