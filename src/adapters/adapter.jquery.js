(function($, global) {
  "use strict";

  var originalValFn = $.fn.val;
  var originalPropFn = $.fn.prop;

  function setup() {
    if (!global.placekeeper.support.hasNativePlaceholderSupport()) {

      $.fn.val = function(val) {
        var originalValue = originalValFn.apply(this, arguments);
        var placeholder = this.eq(0).data("placeholder-value");
        if (
          val === undefined &&
          this.eq(0).data("placeholder-active") &&
          originalValue === String(placeholder)
        ) {
          return "";
        }
        return originalValue;
      };

      $.fn.prop = function(name, val) {
        if (
          val === undefined &&
          this.eq(0).data("placeholder-active") &&
          name === "value"
        ) {
          return "";
        }
        return originalPropFn.apply(this, arguments);
      };

    }
  }

  setup();

  global.placekeeper.jQuery = {
    setup: setup
  };

}(this.jQuery, this));
