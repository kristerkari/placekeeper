import * as utils from "./utils.js";
import * as support from "./support.js";
import * as data from "./data.js";

let inputElements = [];
let textareaElements = [];

export function getInputElements() {
  return inputElements;
}

export function getTextareaElements() {
  return textareaElements;
}

export function getForm(element) {
  let { form } = element;
  if (typeof form === "string") {
    form = document.getElementById(form);
  }
  return form;
}

export function forEachForm(callback) {
  const forms = document.getElementsByTagName("form");
  utils.each(forms, callback);
}

export function forEachChildInput(element, callback) {
  const inputs = element.getElementsByTagName("input");
  const textareas = element.getElementsByTagName("textarea");
  utils.each(inputs, callback);
  utils.each(textareas, callback);
}

export function forEachElement(callback) {
  utils.each(inputElements, (element) => {
    callback(element);
  });
  utils.each(textareaElements, (element) => {
    callback(element);
  });
}

export function getElements() {
  // Get references to all the input and textarea elements currently in the DOM
  // (live NodeList objects to we only need to do this once)
  if (!support.isInputSupported()) {
    inputElements = utils.getElementsByTagName("input");
  }
  if (!support.isTextareaSupported()) {
    textareaElements = utils.getElementsByTagName("textarea");
  }
}

function swapId(from, to) {
  const { id } = from;
  if (id === "") {
    return;
  }
  from.removeAttribute("id");
  to.id = id;
}

function swapValue(from, to) {
  to.value = from.value;
  from.value = "";
}

function swapVisibility(from, to) {
  from.style.display = "none";
  to.style.display = "block";
}

export function swapElements(from, to) {
  swapId(from, to);
  swapValue(from, to);
  swapVisibility(from, to);
}

export function isClonedPasswordInput(element) {
  return element != null &&
         element.nodeType === 1 &&
         data.hasCloneAttrSetToTrue(element);
}

export function getPasswordClone(element) {
  return element.previousSibling;
}

export function getPasswordOriginal(element) {
  return element.nextSibling;
}

export function hasPasswordClone(element) {
  return isClonedPasswordInput(getPasswordClone(element));
}

function createCloneElement(element) {
  let clone = document.createElement("input");
  utils.setAttributes(clone, utils.getAttributes(element));
  clone.type = "text";
  clone.removeAttribute("name");
  clone.style.display = "none";
  data.setCloneAttr(clone);
  return clone;
}

function createClone(element) {
  const clone = createCloneElement(element);
  element.parentNode.insertBefore(clone, element);
}

function removeClone(element) {
  const clone = getPasswordClone(element);
  swapElements(clone, element);
  element.style.display = "";
  clone.parentNode.removeChild(clone);
}

function isPasswordInputThatCanNotChange(elem) {
  return elem.type === "password" && !support.canChangeToType(elem, "text");
}

export function createPasswordCloneIfNeeded(element) {
  if (isPasswordInputThatCanNotChange(element)) {
    createClone(element);
  }
}

export function removePasswordCloneIfExists(element) {
  if (!hasPasswordClone(element)) {
    return;
  }
  removeClone(element);
}
