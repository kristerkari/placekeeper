describe("placekeeper", function() {
    "use strict";

    var placekeeper = window.placekeeper;

    function initialSetup() {
        spyOn(placekeeper.support, "isInputSupported")
        .and.callFake(function() {
            return false;
        });
        spyOn(placekeeper.support, "isTextareaSupported")
        .and.callFake(function() {
            return false;
        });
        placekeeper.priv.__getElements();
    }

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

    beforeEach(initialSetup);

    describe("plugin options", function() {

        describe("element data attributes", function() {

            describe("root element data attributes", function() {

                describe("data-placeholder-focus attribute", function() {

                    describe("when set to false in html element", function() {

                        beforeEach(function() {
                            document.documentElement.setAttribute("data-placeholder-focus", "false");
                            spyOnNativeSupportAndReturn(false);
                            placekeeper.priv.__init();
                        });

                        afterEach(function() {
                            document.documentElement.removeAttribute("data-placeholder-focus");
                        });

                        it("should have focus mode disabled", function() {
                            expect(placekeeper.isFocusEnabled()).toEqual(false);
                        });

                    });

                    describe("when set to false in body element", function() {

                        beforeEach(function() {
                            document.body.setAttribute("data-placeholder-focus", "false");
                            spyOnNativeSupportAndReturn(false);
                            placekeeper.priv.__init();
                        });

                        afterEach(function() {
                            document.body.removeAttribute("data-placeholder-focus");
                        });

                        it("should have focus mode disabled", function() {
                            expect(placekeeper.isFocusEnabled()).toEqual(false);
                        });

                    });
                });

                describe("data-placeholder-live attribute", function() {

                    describe("when set to false in html element", function() {

                        beforeEach(function() {
                            document.documentElement.setAttribute("data-placeholder-live", "false");
                            spyOnNativeSupportAndReturn(false);
                            placekeeper.priv.__init();
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
                            placekeeper.priv.__init();
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
                            placekeeper.priv.__init();
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
                            placekeeper.priv.__init();
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

    describe("private methods", function() {

        describe("__hasElementsThatNeedPlaceholder", function() {

            it("should return false when called without parameters", function() {
                expect(placekeeper.priv.__hasElementsThatNeedPlaceholder()).toEqual(false);
            });

            it("should return false when called with null", function() {
                expect(placekeeper.priv.__hasElementsThatNeedPlaceholder(null)).toEqual(false);
            });

            describe("when called and there is an element that has placeholder attribute set", function() {
                var element;
                var elements;

                beforeEach(function() {
                    element = createInputElement(true);
                    elements = document.getElementsByTagName("input");
                });

                afterEach(function() {
                    element.parentNode.removeChild(element);
                });

                it("should return true", function() {
                    expect(placekeeper.priv.__hasElementsThatNeedPlaceholder(elements)).toEqual(true);
                });

            });

            describe("when called and there is an element that does not have placeholder attribute set", function() {
                var element;
                var elements;

                beforeEach(function() {
                    element = createInputElement(false);
                    elements = document.getElementsByTagName("input");
                });

                afterEach(function() {
                    element.parentNode.removeChild(element);
                });

                it("should return false", function() {
                    expect(placekeeper.priv.__hasElementsThatNeedPlaceholder(elements)).toEqual(false);
                });

            });

        });

        describe("__getElements", function() {

            describe("when inputs are supported and textareas are not", function() {

                beforeEach(function() {
                    spyOn(placekeeper.utils, "getElementsByTagName");
                    placekeeper.support.isInputSupported.and.returnValue(true);
                    placekeeper.support.isTextareaSupported.and.returnValue(false);
                });

                describe("and when called", function() {

                    beforeEach(function() {
                        placekeeper.priv.__getElements();
                    });

                    it("should have gotten elements for textarea", function() {
                        expect(placekeeper.utils.getElementsByTagName).toHaveBeenCalledWith("textarea");
                    });

                    it("should not have gotten elements for inputs", function() {
                        expect(placekeeper.utils.getElementsByTagName).not.toHaveBeenCalledWith("input");
                    });

                });

            });

            describe("when textareas are supported and inputs are not", function() {

                beforeEach(function() {
                    spyOn(placekeeper.utils, "getElementsByTagName");
                    placekeeper.support.isInputSupported.and.returnValue(false);
                    placekeeper.support.isTextareaSupported.and.returnValue(true);
                });

                describe("and when called", function() {

                    beforeEach(function() {
                        placekeeper.priv.__getElements();
                    });

                    it("should not have gotten elements for textarea", function() {
                        expect(placekeeper.utils.getElementsByTagName).not.toHaveBeenCalledWith("textarea");
                    });

                    it("should have gotten elements for inputs", function() {
                        expect(placekeeper.utils.getElementsByTagName).toHaveBeenCalledWith("input");
                    });

                });
            });

            describe("when both inputs and textareas are supported", function() {

                beforeEach(function() {
                    spyOn(placekeeper.utils, "getElementsByTagName");
                    placekeeper.support.isInputSupported.and.returnValue(true);
                    placekeeper.support.isTextareaSupported.and.returnValue(true);
                });

                describe("and when called", function() {

                    beforeEach(function() {
                        placekeeper.priv.__getElements();
                    });

                    it("should not have gotten elements for textarea", function() {
                        expect(placekeeper.utils.getElementsByTagName).not.toHaveBeenCalledWith("textarea");
                    });

                    it("should not have gotten elements for inputs", function() {
                        expect(placekeeper.utils.getElementsByTagName).not.toHaveBeenCalledWith("input");
                    });

                });

            });

            describe("when both inputs and textareas are missing support", function() {

                beforeEach(function() {
                    spyOn(placekeeper.utils, "getElementsByTagName");
                    placekeeper.support.isInputSupported.and.returnValue(false);
                    placekeeper.support.isTextareaSupported.and.returnValue(false);
                });

                describe("and when called", function() {

                    beforeEach(function() {
                        placekeeper.priv.__getElements();
                    });

                    it("should have gotten elements for textarea", function() {
                        expect(placekeeper.utils.getElementsByTagName).toHaveBeenCalledWith("textarea");
                    });

                    it("should have gotten elements for inputs", function() {
                        expect(placekeeper.utils.getElementsByTagName).toHaveBeenCalledWith("input");
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
                    placekeeper.enable();
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
                    placekeeper.enable();
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
