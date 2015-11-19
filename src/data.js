import * as utils from "./utils.js";

export function hasWatchAttrSetToFalse(element) {
  return element.getAttribute("data-placeholder-watch") === "false";
}

export function hasModeAttrSetToInput(element) {
  return element.getAttribute("data-placeholder-mode") === "input";
}

export function hasEventsAttrSetToTrue(element) {
  return element.getAttribute("data-placeholder-has-events") === "true";
}

export function hasActiveAttrSetToTrue(element) {
  return element.getAttribute("data-placeholder-active") === "true";
}

export function hasSubmitAttrSetToTrue(element) {
  return element.getAttribute("data-placeholder-submit") === "true";
}

export function hasCloneAttrSetToTrue(element) {
  return element.getAttribute("data-placeholder-clone") === "true";
}

export function hasValueAttr(element) {
  return element.getAttribute("data-placeholder-value") != null;
}

export function hasTypeAttrSetToPassword(element) {
  return element.getAttribute("data-placeholder-type") === "password";
}

export function setSubmitAttr(element) {
  element.setAttribute("data-placeholder-submit", "true");
}

export function setCloneAttr(element) {
  element.setAttribute("data-placeholder-clone", "true");
}

export function setActiveAttr(element) {
  element.setAttribute("data-placeholder-active", "true");
}

export function setEventsAttr(element) {
  element.setAttribute("data-placeholder-has-events", "true");
}

export function setValueAttr(element, value) {
  element.setAttribute("data-placeholder-value", value);
}

export function setElementValueAttr(element, value) {
  element.setAttribute("data-placeholder-element-value", value);
}

export function getElementValueAttr(element) {
  return element.getAttribute("data-placeholder-element-value");
}

export function getValueAttr(element) {
  return element.getAttribute("data-placeholder-value");
}

export function getMaxLengthAttr(element) {
  return element.getAttribute("data-placeholder-maxlength");
}

export function setMaxLengthAttr(element) {
  element.setAttribute("data-placeholder-maxlength", element.maxLength);
}

export function getTypeAttr(element) {
  return element.getAttribute("data-placeholder-type");
}

export function setTypeAttr(element, type) {
  element.setAttribute("data-placeholder-type", type);
}

export function removeMaxLengthAttr(element) {
  element.removeAttribute("data-placeholder-maxlength");
}

export function removeActiveAttr(element) {
  element.removeAttribute("data-placeholder-active");
}

export function removeSubmitAttr(element) {
  element.removeAttribute("data-placeholder-submit");
}

export function removeDataAttrs(element) {
  var attrs = [
    "value",
    "element-value",
    "has-events",
    "active",
    "maxlength",
    "type"
  ];

  utils.each(attrs, function(attr) {
    element.removeAttribute("data-placeholder-" + attr);
  });
}
