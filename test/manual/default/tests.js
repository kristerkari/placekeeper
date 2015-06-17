var form = document.getElementById("form1");
var newInput = document.createElement("input");

setTimeout(function() {
  "use strict";

  // Test changing placeholder attribute value
  document
  .getElementById("handle1")
  .setAttribute("placeholder", "This value has changed");
  document
  .getElementById("handle2")
  .setAttribute("placeholder", "This value has changed");

  // Test created placeholder attribute value
  document
  .getElementById("handle3")
  .setAttribute("placeholder", "This value has been added");
  document
  .getElementById("handle4")
  .setAttribute("placeholder", "This value has been added");

  // Test new input element added to the DOM after page load
  newInput.setAttribute("type", "text");
  newInput.setAttribute("placeholder", "Test created element");
  document.body.appendChild(newInput);

  // Test input type changing after page load
  /*eslint-disable no-empty */
  try {
    document.getElementById("handle5").type = "password";
    document.getElementById("handle6").type = "text";
  } catch (e) {
    // This will fail in IE < 9
  }
  /*eslint-enable no-empty */

  // Test removed placeholder attribute value
  document.getElementById("handle7").removeAttribute("placeholder");
  document.getElementById("handle8").removeAttribute("placeholder");

  document.getElementById("d1").disabled = false;
  document.getElementById("d2").disabled = false;

  document.getElementById("e1").disabled = true;
  document.getElementById("e2").disabled = true;

}, 1000);

// Bind a submit event handler to the test form
function submitHandler(e) {
  "use strict";

  if (e.preventDefault) {
    e.preventDefault();
  } else {
    e.returnValue = false;
  }

  return false;
}

if (form.addEventListener) {
  form.addEventListener("submit", submitHandler);
} else if (form.attachEvent) {
  form.attachEvent("onsubmit", submitHandler);
}
