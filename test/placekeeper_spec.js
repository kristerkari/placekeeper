describe("placekeeper", function() {
    "use strict";

    var placekeeper = window.placekeeper;

    function spyOnNativeSupportAndReturn(bool) {
        spyOn(placekeeper.support, "hasNativePlaceholderSupport")
        .and.callFake(function() {
            return bool;
        });
    }

    function createInputElement(hasPlaceholder) {
        var element = document.createElement("input");
        element.type = "text";
        if (hasPlaceholder) {
            element.placeholder = "Test";
        }
        document.body.appendChild(element);
        return element;
    }

    describe("plugin options", function() {

        describe("element data attributes", function() {

            describe("root element data attributes", function() {

                describe("data-placeholder-live attribute", function() {

                    describe("when set to false in html element", function() {

                        beforeEach(function() {
                            document.documentElement.setAttribute("data-placeholder-live", "false");
                            spyOnNativeSupportAndReturn(false);
                            placekeeper.init();
                        });

                        afterEach(function() {
                            document.documentElement.removeAttribute("data-placeholder-live");
                        });

                        describe("and when an element with placeholder is added", function() {
                            var element;

                            beforeEach(function() {
                                element = createInputElement(true);
                            });

                            afterEach(function() {
                                element.parentNode.removeChild(element);
                                placekeeper.disable();
                            });

                            it("should have placekeeper disabled", function() {
                                expect(placekeeper.isEnabled()).toEqual(false);
                            });

                        });

                    });

                    describe("when set to true in html element", function() {

                        beforeEach(function() {
                            document.documentElement.setAttribute("data-placeholder-live", "true");
                            spyOnNativeSupportAndReturn(false);
                            placekeeper.init();
                        });

                        afterEach(function() {
                            document.documentElement.removeAttribute("data-placeholder-live");
                        });

                        describe("and when an element with placeholder is added", function() {
                            var element;

                            beforeEach(function(done) {
                                element = createInputElement(true);
                                setTimeout(done, 110);
                            });

                            afterEach(function() {
                                element.parentNode.removeChild(element);
                                placekeeper.disable();
                            });

                            it("should have placekeeper enabled", function() {
                                expect(placekeeper.isEnabled()).toEqual(true);
                            });

                        });

                    });

                    describe("when set to false in body element", function() {

                        beforeEach(function() {
                            document.body.setAttribute("data-placeholder-live", "false");
                            spyOnNativeSupportAndReturn(false);
                            placekeeper.init();
                        });

                        afterEach(function() {
                            document.body.removeAttribute("data-placeholder-live");
                        });

                        describe("and when an element with placeholder is added", function() {
                            var element;

                            beforeEach(function() {
                                element = createInputElement(true);
                            });

                            afterEach(function() {
                                element.parentNode.removeChild(element);
                                placekeeper.disable();
                            });

                            it("should have placekeeper disabled", function() {
                                expect(placekeeper.isEnabled()).toEqual(false);
                            });

                        });

                    });

                    describe("when set to true in body element", function() {

                        beforeEach(function() {
                            document.body.setAttribute("data-placeholder-live", "true");
                            spyOnNativeSupportAndReturn(false);
                            placekeeper.init();
                        });

                        afterEach(function() {
                            document.body.removeAttribute("data-placeholder-live");
                        });

                        describe("and when an element with placeholder is added", function() {
                            var element;

                            beforeEach(function(done) {
                                element = createInputElement(true);
                                setTimeout(done, 110);
                            });

                            afterEach(function() {
                                element.parentNode.removeChild(element);
                                placekeeper.disable();
                            });

                            it("should have placekeeper enabled", function() {
                                expect(placekeeper.isEnabled()).toEqual(true);
                            });

                        });

                    });

                });

            });

        });

    });

    describe("enable public method", function() {

        afterEach(function() {
            placekeeper.disable();
        });

        it("should be a function", function() {
            expect(typeof placekeeper.enable).toEqual("function");
        });

        describe("when called and there are no inputs or textareas on the page", function() {

            beforeEach(function() {
                placekeeper.init();
                spyOnNativeSupportAndReturn(false);
                placekeeper.enable();
            });

            it("should have called hasNativePlaceholderSupport method", function() {
                expect(placekeeper.support.hasNativePlaceholderSupport).toHaveBeenCalled();
            });

            it("should have placekeeper disabled", function() {
                expect(placekeeper.isEnabled()).toEqual(false);
            });

        });

        describe("when called and there is one input with placeholder attribute", function() {
            var element;

            beforeEach(function() {
                element = createInputElement(true);
                placekeeper.init();
                spyOnNativeSupportAndReturn(false);
                placekeeper.enable();
            });

            afterEach(function() {
                element.parentNode.removeChild(element);
            });

            it("should have called hasNativePlaceholderSupport method", function() {
                expect(placekeeper.support.hasNativePlaceholderSupport).toHaveBeenCalled();
            });

            it("should have placekeeper enabled", function() {
                expect(placekeeper.isEnabled()).toEqual(true);
            });

            describe("when placekeeper is disabled", function() {

                beforeEach(function() {
                    placekeeper.disable();
                });

                it("should have placekeeper disabled", function() {
                    expect(placekeeper.isEnabled()).toEqual(false);
                });

            });

        });

    });

    describe("isEnabled public method", function() {

        afterEach(function() {
            placekeeper.disable();
        });

        it("should be a function", function() {
            expect(typeof placekeeper.isEnabled).toEqual("function");
        });

        describe("when there are no inputs or textareas on the page", function() {

            it("should not have any inputs on the page", function() {
                expect(document.getElementsByTagName("input").length).toEqual(0);
            });

            it("should not have any textareas on the page", function() {
                expect(document.getElementsByTagName("textarea").length).toEqual(0);
            });

            describe("when HTML5 placeholder is supported for both inputs and textareas", function() {

                beforeEach(function() {
                    spyOnNativeSupportAndReturn(true);
                    placekeeper.init();
                });

                it("should have placekeeper disabled because of native support", function() {
                    expect(placekeeper.isEnabled()).toEqual(false);
                });

                describe("and when a text input element with placeholder attribute is inserted to the page", function() {
                    var element;

                    beforeEach(function(done) {
                        element = createInputElement(true);
                        setTimeout(done, 110);
                    });

                    afterEach(function() {
                        element.parentNode.removeChild(element);
                    });

                    it("should have one input on the page", function() {
                        expect(document.getElementsByTagName("input").length).toEqual(1);
                    });

                    it("should have placekeeper disabled because of native support", function() {
                        expect(placekeeper.isEnabled()).toEqual(false);
                    });

                });

            });

            describe("when HTML5 placeholder is not supported for both inputs and textareas", function() {

                beforeEach(function() {
                    spyOnNativeSupportAndReturn(false);
                    placekeeper.init();
                });

                it("should have placekeeper disabled since there are no inputs or textareas", function() {
                    expect(placekeeper.isEnabled()).toEqual(false);
                });

                describe("and when a text input element without placeholder attribute is inserted to the page", function() {
                    var element;

                    beforeEach(function(done) {
                        element = createInputElement(false);
                        setTimeout(done, 110);
                    });

                    afterEach(function() {
                        element.parentNode.removeChild(element);
                    });

                    it("should have one input on the page", function() {
                        expect(document.getElementsByTagName("input").length).toEqual(1);
                    });

                    it("should have placekeeper disabled since there is no placeholder attribute on the input", function() {
                        expect(placekeeper.isEnabled()).toEqual(false);
                    });

                });

                describe("and when a text input element with placeholder attribute is inserted to the page", function() {
                    var element;

                    beforeEach(function(done) {
                        element = createInputElement(true);
                        setTimeout(done, 110);
                    });

                    afterEach(function() {
                        element.parentNode.removeChild(element);
                    });

                    it("should have one input on the page", function() {
                        expect(document.getElementsByTagName("input").length).toEqual(1);
                    });

                    it("should have placekeeper enabled", function() {
                        expect(placekeeper.isEnabled()).toEqual(true);
                    });

                });

                describe("and when a textarea element with placeholder attribute is inserted to the page", function() {
                    var element;

                    beforeEach(function(done) {
                        element = document.createElement("textarea");
                        element.placeholder = "Test";
                        document.body.appendChild(element);
                        setTimeout(done, 110);
                    });

                    afterEach(function() {
                        element.parentNode.removeChild(element);
                    });

                    it("should have one textarea on the page", function() {
                        expect(document.getElementsByTagName("textarea").length).toEqual(1);
                    });

                    it("should have 0 inputs on the page", function() {
                        expect(document.getElementsByTagName("input").length).toEqual(0);
                    });

                    it("should have placekeeper enabled", function() {
                        expect(placekeeper.isEnabled()).toEqual(true);
                    });

                });

            });

        });

    });

});
