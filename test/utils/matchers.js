beforeEach(function() {
  jasmine.addMatchers({
    toHaveNoDataAttributes: function() {
      return {
        compare: function(actual) {
          var dataAttrs = [];
          for (var i = 0; i < actual.attributes.length; i++) {
            if ((/data\-/).test(actual.attributes[i].nodeName)) {
              dataAttrs.push(actual.attributes[i].nodeName);
            }
          }
          var pass = dataAttrs.length === 0;
          return {
            message: "Expected element to have 0 data-attributes, but got " + dataAttrs,
            pass: pass
          };
        }
      };
    },
    toHaveClass: function() {
      return {
        compare: function(actual, expected) {
          var pass = actual.className.search(expected) > -1;
          return {
            message: "Expected element" + (pass ? " not" : "") + " to have \"" + expected + "\" class",
            pass: pass
          };
        }
      };
    },
    toEqualNullOr2147483647: function() {
      return {
        compare: function(actual) {
          return {
            // IE7 has a default value of 2147483647 for maxLength attribute
            message: "Expected " + actual + " to be either 2147483647 or null",
            pass: actual === null || actual === 2147483647
          };
        }
      };
    }
  });
});
