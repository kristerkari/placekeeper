(function() {

  var support = placekeeper.support;
  var utils = placekeeper.utils;
  var data = placekeeper.data;
  var inputElements = [];
  var textareaElements = [];

  function getInputElements() {
    return inputElements;
  }

  function getTextareaElements() {
    return textareaElements;
  }

  function getForm(element) {
    var form = element.form;
    if (typeof form === "string") {
      form = document.getElementById(form);
    }
    return form;
  }

  function loopElements(inputs, textareas, callback) {

    if (!inputs) {
      inputs = [];
    }

    if (!textareas) {
      textareas = [];
    }

    var length = inputs.length + textareas.length;
    for (var i = 0; i < length; i++) {
      var element = i < inputs.length ?
      inputs[i] :
      textareas[i - inputs.length];
      callback(element);
    }
  }

  function forEachForm(callback) {
    var forms = document.getElementsByTagName("form");
    for (var i = 0; i < forms.length; i++) {
      callback(forms[i]);
    }
  }

  function forEachChildInput(element, callback) {
    var inputs = element.getElementsByTagName("input");
    var textareas = element.getElementsByTagName("textarea");
    loopElements(inputs, textareas, callback);
  }

  function forEachElement(callback) {
    loopElements(inputElements, textareaElements, callback);
  }

  function getElements() {
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
    var id = from.id;
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

  function swapElements(from, to) {
    swapId(from, to);
    swapValue(from, to);
    swapVisibility(from, to);
  }

  function isClonedPasswordInput(element) {
    return element != null &&
           element.nodeType === 1 &&
           data.hasCloneAttrSetToTrue(element);
  }

  function getPasswordClone(element) {
    return element.previousSibling;
  }

  function getPasswordOriginal(element) {
    return element.nextSibling;
  }

  function hasPasswordClone(element) {
    return isClonedPasswordInput(getPasswordClone(element));
  }

  function createCloneElement(element) {
    var clone = document.createElement("input");
    utils.setAttributes(clone, utils.getAttributes(element));
    clone.type = "text";
    clone.removeAttribute("name");
    data.setCloneAttr(clone);
    return clone;
  }

  function createClone(element) {
    var clone = createCloneElement(element);
    element.parentNode.insertBefore(clone, element);
  }

  function removeClone(element) {
    var clone = getPasswordClone(element);
    swapElements(clone, element);
    element.style.display = "";
    clone.parentNode.removeChild(clone);
  }

  function isPasswordInputThatCanNotChange(elem) {
    return elem.type === "password" && !support.canChangeToType(elem, "text");
  }

  function createPasswordCloneIfNeeded(element) {
    if (isPasswordInputThatCanNotChange(element)) {
      createClone(element);
    }
  }

  function removePasswordCloneIfExists(element) {
    if (!hasPasswordClone(element)) {
      return;
    }
    removeClone(element);
  }

  placekeeper.elements = {
    getForm: getForm,
    getInputElements: getInputElements,
    getTextareaElements: getTextareaElements,
    getElements: getElements,
    getPasswordClone: getPasswordClone,
    getPasswordOriginal: getPasswordOriginal,
    forEachForm: forEachForm,
    forEachChildInput: forEachChildInput,
    forEachElement: forEachElement,
    createPasswordCloneIfNeeded: createPasswordCloneIfNeeded,
    removePasswordCloneIfExists: removePasswordCloneIfExists,
    isClonedPasswordInput: isClonedPasswordInput,
    swapElements: swapElements,
    hasPasswordClone: hasPasswordClone
  };

}());
