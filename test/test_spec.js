"use strict";

describe("test", function() {

    it("should be defined", function() {
        expect(window.test).toBeDefined();
    });

    it("should return true when called with test", function() {
        expect(window.test("test")).toEqual(true);
    });

});
