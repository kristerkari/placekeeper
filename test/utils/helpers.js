function getStyle(el, prop) {
  var style = window.getComputedStyle ? window.getComputedStyle(el, null) : el.currentStyle;
  if (style) {
    return style [
      prop.replace(/-(\w)/gi, function(word, letter) {
        return letter.toUpperCase();
      })
    ];
  }
}

function isHidden(el) {
  return getStyle(el, "display") === "none";
}

var helpers = {
  loopDurationForTests: 14,
  fakeWindow: {
    events: {},
    dispatchEvent: function(event) {
      this.events[event.type].call();
    },
    fireEvent: function(event) {
      this.events[event.slice(2)].call();
    }
  },
  fakeUtils: {
    addEventListener: function(elem, event, fn) {
      helpers.fakeWindow.events[event] = fn;
    }
  },
  canActuallyChangeType: (function() {
    var element = "<input id=\"pw\" type=\"password\">";
    document.body.innerHTML = element;
    var can = placekeeper.support.canChangeToType(document.getElementById("pw"), "text");
    document.body.innerHTML = "";
    return can;
  }()),
  initialSetup: function() {
    spyOn(placekeeper.support, "isInputSupported")
    .and.callFake(function() {
      return false;
    });
    spyOn(placekeeper.support, "isTextareaSupported")
    .and.callFake(function() {
      return false;
    });
    placekeeper.priv.__settings.defaultLoopDuration = 6;
    placekeeper.elements.getElements();
  },
  spyOnNativeSupportAndReturn: function(bool) {
    spyOn(placekeeper.support, "hasNativePlaceholderSupport")
    .and.callFake(function() {
      return bool;
    });
  },
  spyOnCanChangeToTypeAndReturn: function(bool) {
    spyOn(placekeeper.support, "canChangeToType")
    .and.callFake(function() {
      return bool;
    });
  },
  spyOnFocusEnabledAndReturn: function(bool) {
    spyOn(placekeeper.mode, "isPlacekeeperFocusEnabled")
    .and.callFake(function() {
      return bool;
    });
  },
  triggerFakePageReload: function() {
    triggerEvent.html(helpers.fakeWindow, "beforeunload");
  },
  setupFakeWindow: function() {
    spyOn(placekeeper.utils, "addEventListener")
    .and.callFake(helpers.fakeUtils.addEventListener);
    placekeeper.priv.__global = helpers.fakeWindow;
    placekeeper.events.addUnloadListener();
    placekeeper.priv.__setupPlaceholders();
  },
  restoreRealWindow: function() {
    placekeeper.priv.__global = window;
  },
  focus: function(element) {
    triggerEvent.html(element, "focus");
    if (!isHidden(element) && element !== document.activeElement) {
      element.focus();
    }
  },
  retryFocus: function(element, done) {
    var tries = 5;
    var nr = 0;

    function f() {
      helpers.focus(element);
      if (element === document.activeElement) {
        done();
      } else if (nr++ < tries) {
        setTimeout(f, 4);
      } else {
        done();
      }
    }

    f();
  },
  blur: function(element) {
    triggerEvent.html(element, "blur");
  },
  createInputElementWithMaxLength: function(maxLength, maxLengthAttr) {
    var element = "<input type=\"text\" id=\"elem\"";
    if (maxLength) {
      element += " maxlength=\"" + maxLength + "\"";
    }
    if (maxLengthAttr) {
      element += " data-placeholder-maxlength=\"" + maxLengthAttr + "\"";
    }
    element += ">";
    document.body.innerHTML = element;
    return document.getElementById("elem");
  },
  createInputElementWithoutType: function(hasPlaceholder) {
    var element = "<input id=\"elem\" maxlength=\"12\"";
    if (hasPlaceholder) {
      element += " placeholder=\"Test\"";
    }
    element += ">";
    document.body.innerHTML = element;
    return document.getElementById("elem");
  },
  createInputElementWithValue: function(hasPlaceholder, type) {
    var element = "<input type=\"" + (type || "text") +
                  "\" id=\"elem\"";
    if (hasPlaceholder) {
      element += " placeholder=\"Test\" value=\"MyVal\"";
    }
    element += ">";
    document.body.innerHTML = element;
    return document.getElementById("elem");
  },
  createInputElement: function(hasPlaceholder, type) {
    var element = "<input type=\"" + (type || "text") +
                  "\" id=\"elem\" maxlength=\"12\"";
    if (hasPlaceholder) {
      element += " placeholder=\"Test\"";
    }
    element += ">";
    document.body.innerHTML = element;
    return document.getElementById("elem");
  },
  createInputElementWithNumericPlaceholder: function(hasPlaceholder, type) {
    var element = "<input type=\"" + (type || "text") +
                  "\" id=\"elem\" maxlength=\"12\"";
    if (hasPlaceholder) {
      element += " placeholder=\"123456\"";
    }
    element += ">";
    document.body.innerHTML = element;
    return document.getElementById("elem");
  },
  createDisabledInputElement: function(hasPlaceholder, type) {
    var element = "<input type=\"" + (type || "text") +
                  "\" id=\"elem\" maxlength=\"12\"";
    if (hasPlaceholder) {
      element += " placeholder=\"Test\"";
    }
    element += " disabled>";
    document.body.innerHTML = element;
    return document.getElementById("elem");
  },
  createInputElementWithForm: function(hasPlaceholder, type) {
    var element = "<form method=get action=javascript:void(0);><input type=\"" + (type || "text") +
                  "\" id=\"elem\" maxlength=\"12\"";
    if (hasPlaceholder) {
      element += " placeholder=\"Test\"";
    }
    element += "></form>";
    document.body.innerHTML = element;
    return document.getElementById("elem");
  },
  createInputElementWithFormAttribute: function(hasPlaceholder, type) {
    var element = "<form method=get action=javascript:void(0); id=\"form1\">" +
                  "<input type=\"" + (type || "text") +
                  "\" id=\"elem\" maxlength=\"12\" form=\"form1\"";
    if (hasPlaceholder) {
      element += " placeholder=\"Test\"";
    }
    element += "></form>";
    document.body.innerHTML = element;
    return document.getElementById("elem");
  },
  createTextareaElement: function(hasPlaceholder) {
    var element = "<textarea id=\"elem\"";
    if (hasPlaceholder) {
      element += " placeholder=\"Test\"";
    }
    element += "></textarea>";
    document.body.innerHTML = element;
    return document.getElementById("elem");
  },
  createTextareaElementWithValue: function(hasPlaceholder) {
    var element = "<textarea id=\"elem\"";
    if (hasPlaceholder) {
      element += " placeholder=\"Test\"";
    }
    element += ">MyVal</textarea>";
    document.body.innerHTML = element;
    return document.getElementById("elem");
  }
};
