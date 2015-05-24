(function(global) {
  "use strict";

  function trim(str) {
    return str.replace(/^\s+|\s+$/g, "");
  }

  var _initKeyboardEvent_type = (function() {

    try {
      var e = document.createEvent("KeyboardEvent");
      e.initKeyboardEvent(
          "keyup", // in DOMString typeArg
          false, // in boolean canBubbleArg
          false, // in boolean cancelableArg
          global, // in views::AbstractView viewArg
          "+", // [test]in DOMString keyIdentifierArg | webkit event.keyIdentifier | IE9 event.key
          3, // [test]in unsigned long keyLocationArg | webkit event.keyIdentifier | IE9 event.location
          true, // [test]in boolean ctrlKeyArg | webkit event.shiftKey | old webkit event.ctrlKey | IE9 event.modifiersList
          false, // [test]shift | alt
          true, // [test]shift | alt
          false, // meta
          false // altGraphKey
      );

      // Safari and IE9 throw Error here due keyCode, charCode and which is readonly
      delete e.keyCode;
      _Object_defineProperty(e, {
        writable: true, configurable: true, value: 9
      });
      delete e.charCode;
      _Object_defineProperty(e, {
        writable: true, configurable: true, value: 9
      });
      delete e.which;
      _Object_defineProperty(e, {
        writable: true, configurable: true, value: 9
      });

      return ((e.keyIdentifier || e.key) === "+" && (e.keyLocation || e.location) === 3) && (
        e.ctrlKey ?
          e.altKey ? // webkit
            1
            :
            3
          :
          e.shiftKey ?
            2 // webkit
            :
            4 // IE9
        ) || 9 // FireFox|w3c
        ;
    } catch (__e__) {
      _initKeyboardEvent_type = 0;
    }
  })();

  var _keyboardEvent_properties_dictionary = {
    "char": "",
    "key": "",
    "location": 0,
    "ctrlKey": false,
    "shiftKey": false,
    "altKey": false,
    "altGraphKey": false,
    "metaKey": false,
    "repeat": false,
    "locale": "",

    "detail": 0,
    "bubbles": false,
    "cancelable": false,

    // legacy properties
    "keyCode": 0,
    "charCode": 0,
    "which": 0
  };

  var _Object_defineProperty = Object.defineProperty || function(obj, prop, val) {
    if ("value" in val) {
      obj[prop] = val["value"];
    }
  };

  function triggerKeyboardEvent(target, type, keyCode) {
    var evt;

    // Don't do events on text and comment nodes
    if (target.nodeType === 3 || target.nodeType === 8) {
      return;
    }

    if (_initKeyboardEvent_type) {
      evt = document.createEvent("KeyboardEvent");
    } else if ("createEvent" in document) {
      evt = document.createEvent("Event");
    }

    try {
      delete evt.keyCode;
      _Object_defineProperty(evt, "keyCode", {
        "value": keyCode
      });
    } catch(ex) {}

    var _prop_name;
    var localDict = {};
    var dict = {
      key: keyCode
    };

    for (_prop_name in _keyboardEvent_properties_dictionary) {
      if (_keyboardEvent_properties_dictionary.hasOwnProperty(_prop_name)) {
        localDict[_prop_name] = (dict.hasOwnProperty(_prop_name) && dict || _keyboardEvent_properties_dictionary)[_prop_name];
      }
    }

    var _ctrlKey = localDict["ctrlKey"];
    var _shiftKey = localDict["shiftKey"];
    var _altKey = localDict["altKey"];
    var _metaKey = localDict["metaKey"];
    var _altGraphKey = localDict["altGraphKey"];

    function listArg() {
      return ((_ctrlKey ? "Control" : "") + (_shiftKey ? " Shift" : "") +
              (_altKey ? " Alt" : "") + (_metaKey ? " Meta" : "") +
              (_altGraphKey ? " AltGraph" : ""));
    }

    var _modifiersListArg = _initKeyboardEvent_type > 3 ? trim(listArg()) : null;

    var _key = localDict["key"] + "";
    var _char = localDict["char"] + "";
    var _location = localDict["location"];
    var _keyCode = localDict["keyCode"] || (localDict["keyCode"] = _key && _key.charCodeAt(0) || 0);
    var _charCode = localDict["charCode"] || (localDict["charCode"] = _char && _char.charCodeAt(0) || 0);

    var _bubbles = localDict["bubbles"];
    var _cancelable = localDict["cancelable"];

    var _repeat = localDict["repeat"];
    var _locale = localDict["locale"];
    var _view = global;

    localDict["which"] || (localDict["which"] = localDict["keyCode"]);

    try {
      if ("initKeyEvent" in evt) {// FF
        // https://developer.mozilla.org/en/DOM/event.initKeyEvent
        evt.initKeyEvent(type, _bubbles, _cancelable, _view, _ctrlKey, _altKey, _shiftKey, _metaKey, _keyCode, _charCode);
        target.dispatchEvent(evt);
      } else if (_initKeyboardEvent_type && "initKeyboardEvent" in evt) {
        // https://developer.mozilla.org/en/DOM/KeyboardEvent#initKeyboardEvent()
        if (_initKeyboardEvent_type === 1) { // webkit
          // http://stackoverflow.com/a/8490774/1437207
          // https://bugs.webkit.org/show_bug.cgi?id=13368
          evt.initKeyboardEvent(type, _bubbles, _cancelable, _view, _key,
          _location, _ctrlKey, _shiftKey, _altKey, _metaKey, _altGraphKey);
        } else if (_initKeyboardEvent_type === 2) { // old webkit
          // http://code.google.com/p/chromium/issues/detail?id=52408
          evt.initKeyboardEvent(type, _bubbles, _cancelable, _view, _ctrlKey, _altKey, _shiftKey, _metaKey, _keyCode, _charCode);
        } else if (_initKeyboardEvent_type === 3) { // webkit
          evt.initKeyboardEvent(type, _bubbles, _cancelable, _view, _key,
          _location, _ctrlKey, _altKey, _shiftKey, _metaKey, _altGraphKey);
        } else if (_initKeyboardEvent_type === 4) { // IE9
          // http://msdn.microsoft.com/en-us/library/ie/ff975297(v=vs.85).aspx
          evt.initKeyboardEvent(type, _bubbles, _cancelable, _view, _key, _location, _modifiersListArg, _repeat, _locale);
        } else { // FireFox|w3c
          // http://www.w3.org/TR/DOM-Level-3-Events/#events-KeyboardEvent-initKeyboardEvent
          // https://developer.mozilla.org/en/DOM/KeyboardEvent#initKeyboardEvent()
          evt.initKeyboardEvent(type, _bubbles, _cancelable, _view, _char, _key, _location, _modifiersListArg, _repeat, _locale);
        }
        target.dispatchEvent(evt);
      } else if ("initEvent" in evt) {
        evt.initEvent(type, _bubbles, _cancelable);
        target.dispatchEvent(evt);
      }
    } catch(ex) {
      if (target.fireEvent) {
        // Internet Explorer support
        var evt = document.createEventObject();
        evt.button = 1;
        evt.keyCode = keyCode;
        target.fireEvent("on" + type, evt);
      }
    }

    try {
      for (_prop_name in _keyboardEvent_properties_dictionary) {
        if (_keyboardEvent_properties_dictionary.hasOwnProperty(_prop_name)) {
          if (evt[_prop_name] !== localDict[_prop_name]) {
            try {
              delete evt[_prop_name];
              _Object_defineProperty(evt, _prop_name, {
                writable: true, "value": localDict[_prop_name]
              });
            }
            catch(e) {
              // Some properties is read-only
            }
          }
        }
      }
    } catch(ex) {}

  }

  function triggerHTMLEvent(target, event) {
    var evt;
    if (document.createEvent) {
      // dispatch for firefox + others
      evt = document.createEvent("HTMLEvents");
      evt.initEvent(event, true, true);
      target.dispatchEvent(evt);
    } else if (document.createEventObject) {
      // dispatch for IE
      evt = document.createEventObject();
      target.fireEvent("on" + event, evt);
    }
  }

  global.triggerEvent = {};
  global.triggerEvent.html = triggerHTMLEvent;
  global.triggerEvent.keyboard = triggerKeyboardEvent;

}(this));
