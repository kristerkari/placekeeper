describe("placekeeper", function() {
    "use strict";

    var placekeeper = window.placekeeper;
    var loopDurationForTests = 14;

    var fakeWindow = {
        events: {},
        dispatchEvent: function(event) {
            this.events[event.type].call();
        },
        fireEvent: function(event) {
            this.events[event.slice(2)].call();
        }
    };

    var fakeUtils = {
        addEventListener: function(elem, event, fn) {
            fakeWindow.events[event] = fn;
        }
    };

    var canActuallyChangeType = (function() {
        var element = "<input id=\"pwel\" type=\"password\">";
        document.body.innerHTML = element;
        var can = placekeeper.support.canChangeToType(document.getElementById("pwel"), "text");
        document.body.innerHTML = "";
        return can;
    }());

    function trigger(target, event) {
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

    function initialSetup() {
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
    }

    function spyOnNativeSupportAndReturn(bool) {
        spyOn(placekeeper.support, "hasNativePlaceholderSupport")
        .and.callFake(function() {
            return bool;
        });
    }

    function spyOnCanChangeToTypeAndReturn(bool) {
        spyOn(placekeeper.support, "canChangeToType")
        .and.callFake(function() {
            return bool;
        });
    }

    function triggerFakePageReload() {
        trigger(fakeWindow, "beforeunload");
    }

    function setupFakeWindow() {
        spyOn(placekeeper.utils, "addEventListener")
        .and.callFake(fakeUtils.addEventListener);
        placekeeper.priv.__global = fakeWindow;
        placekeeper.priv.__setupPlaceholders();
    }

    function restoreRealWindow() {
        placekeeper.priv.__global = window;
    }

    function createInputElementWithMaxLength(maxLength, maxLengthAttr) {
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
    }

    function createInputElementWithoutType(hasPlaceholder) {
        var element = "<input id=\"elem\" maxlength=\"12\"";
        if (hasPlaceholder) {
            element += " placeholder=\"Test\"";
        }
        element += ">";
        document.body.innerHTML = element;
        return document.getElementById("elem");
    }

    function createInputElement(hasPlaceholder, type) {
        var element = "<input type=\"" + (type || "text") +
                      "\" id=\"elem\" maxlength=\"12\"";
        if (hasPlaceholder) {
            element += " placeholder=\"Test\"";
        }
        element += ">";
        document.body.innerHTML = element;
        return document.getElementById("elem");
    }

    function createInputElementWithForm(hasPlaceholder, type) {
        var element = "<form method=get action=javascript:void(0);><input type=\"" + (type || "text") +
                      "\" id=\"elem\" maxlength=\"12\"";
        if (hasPlaceholder) {
            element += " placeholder=\"Test\"";
        }
        element += "></form>";
        document.body.innerHTML = element;
        return document.getElementById("elem");
    }

    function createTextareaElement(hasPlaceholder) {
        var element = "<textarea id=\"elem\"";
        if (hasPlaceholder) {
            element += " placeholder=\"Test\"";
        }
        element += "></textarea>";
        document.body.innerHTML = element;
        return document.getElementById("elem");
    }

    beforeEach(function() {
        jasmine.addMatchers({
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

    beforeEach(initialSetup);

    describe("password inputs", function() {

        describe("when there is a password input on the page and input type can be changed", function() {
            var element;

            if (canActuallyChangeType) {
                beforeEach(function(done) {
                    spyOnCanChangeToTypeAndReturn(true);
                    element = createInputElement(true, "password");
                    placekeeper.priv.__setupPlaceholders();
                    setTimeout(done, loopDurationForTests);
                });

                afterEach(function() {
                    element.parentNode.removeChild(element);
                });

                it("should have changed password input type to text when there is no focus", function() {
                    expect(element.getAttribute("type")).toEqual("text");
                });

                describe("and when input is focused", function() {

                    beforeEach(function(done) {
                        spyOn(placekeeper.polyfill, "__hidePlaceholder").and.callThrough();
                        element.focus();
                        setTimeout(done, loopDurationForTests);
                    });

                    it("should have changed element type back to password", function() {
                        expect(element.getAttribute("type")).toEqual("password");
                    });

                    it("should have called polyfill's __hidePlaceholder method", function() {
                        expect(placekeeper.polyfill.__hidePlaceholder).toHaveBeenCalledWith(element);
                        expect(placekeeper.polyfill.__hidePlaceholder.calls.count()).toEqual(1);
                    });

                });
            }

        });

        describe("when there is a password input on the page and input type can not be changed", function() {
            var element;
            var clone;

            beforeEach(function(done) {
                spyOnCanChangeToTypeAndReturn(false);
                element = createInputElement(true, "password");
                setTimeout(function() {
                    clone = document.getElementById("elem");
                    done();
                }, loopDurationForTests);
                placekeeper.priv.__setupPlaceholders();
            });

            afterEach(function() {
                element.parentNode.removeChild(element);
            });

            it("should have two inputs on the page", function() {
                expect(document.getElementsByTagName("input").length).toEqual(2);
            });

            it("should have changed password input type to text when there is no focus", function() {
                expect(clone.getAttribute("type")).toEqual("text");
            });

            it("should have added elem id to clone", function() {
                expect(clone.id).toEqual("elem");
            });

            it("should have replacement shown", function() {
                expect(clone.style.display).toEqual("block");
            });

            it("should have removed id from element", function() {
                expect(element.id).toEqual("");
            });

            it("should have element hidden", function() {
                expect(element.style.display).toEqual("none");
            });

            describe("and when input is focused", function() {

                beforeEach(function(done) {
                    spyOn(placekeeper.polyfill, "__hidePlaceholder").and.callThrough();
                    trigger(clone, "focus");
                    setTimeout(function() {
                        element = document.getElementById("elem");
                        done();
                    }, loopDurationForTests);
                });

                it("should have two inputs on the page", function() {
                    expect(document.getElementsByTagName("input").length).toEqual(2);
                });

                it("should have changed element type back to password", function() {
                    expect(element.getAttribute("type")).toEqual("password");
                });

                it("should have elem id back to element", function() {
                    expect(element.id).toEqual("elem");
                });

                it("should have element shown", function() {
                    expect(element.style.display).toEqual("block");
                });

                it("should have remove id from clone", function() {
                    expect(clone.id).toEqual("");
                });

                it("should have clone hidden", function() {
                    expect(clone.style.display).toEqual("none");
                });

                it("should have called polyfill's __hidePlaceholder method", function() {
                    expect(placekeeper.polyfill.__hidePlaceholder).toHaveBeenCalledWith(clone);
                    expect(placekeeper.polyfill.__hidePlaceholder.calls.count()).toEqual(1);
                });

                describe("and when there is a value and input is blurred", function() {

                    beforeEach(function(done) {
                        spyOn(placekeeper.polyfill, "__showPlaceholder").and.callThrough();
                        element.value = "testing";
                        trigger(element, "blur");
                        setTimeout(done, 110);
                    });

                    it("should have two inputs on the page", function() {
                        expect(document.getElementsByTagName("input").length).toEqual(2);
                    });

                    it("should have elem id set to element", function() {
                        expect(element.id).toEqual("elem");
                    });

                    it("should have element shown", function() {
                        expect(element.style.display).toEqual("block");
                    });

                    it("should have remove id from clone", function() {
                        expect(clone.id).toEqual("");
                    });

                    it("should have clone hidden", function() {
                        expect(clone.style.display).toEqual("none");
                    });

                    it("should have called polyfill's __showPlaceholder method", function() {
                        expect(placekeeper.polyfill.__showPlaceholder).toHaveBeenCalledWith(element);
                        expect(placekeeper.polyfill.__showPlaceholder.calls.count()).toEqual(1);
                    });

                });

                describe("and when the input is blurred after that", function() {

                    beforeEach(function(done) {
                        spyOn(placekeeper.polyfill, "__showPlaceholder").and.callThrough();
                        trigger(element, "blur");
                        setTimeout(function() {
                            clone = document.getElementById("elem");
                            done();
                        }, loopDurationForTests);
                    });

                    it("should have two inputs on the page", function() {
                        expect(document.getElementsByTagName("input").length).toEqual(2);
                    });

                    it("should have changed password input type to text", function() {
                        expect(clone.getAttribute("type")).toEqual("text");
                    });

                    it("should have added elem id to clone", function() {
                        expect(clone.id).toEqual("elem");
                    });

                    it("should have clone shown", function() {
                        expect(clone.style.display).toEqual("block");
                    });

                    it("should have removed id from element", function() {
                        expect(element.id).toEqual("");
                    });

                    it("should have element hidden", function() {
                        expect(element.style.display).toEqual("none");
                    });

                    it("should have called polyfill's __showPlaceholder method", function() {
                        expect(placekeeper.polyfill.__showPlaceholder).toHaveBeenCalledWith(element);
                    });

                });

            });

        });

        describe("when there is an input on the page that is not password or text type", function() {
            var element;

            beforeEach(function(done) {
                element = createInputElement(true, "email");
                placekeeper.priv.__setupPlaceholders();
                setTimeout(done, loopDurationForTests);
            });

            afterEach(function() {
                element.parentNode.removeChild(element);
            });

            it("should have changed password input type to text when there is no focus", function() {
                expect(element.getAttribute("type")).toEqual("email");
            });

            describe("and when input is focused", function() {

                beforeEach(function(done) {
                    spyOn(placekeeper.polyfill, "__hidePlaceholder").and.callThrough();
                    trigger(element, "focus");
                    setTimeout(done, loopDurationForTests);
                });

                it("should have changed element type back to password", function() {
                    expect(element.getAttribute("type")).toEqual("email");
                });

                it("should have called polyfill's __hidePlaceholder method", function() {
                    expect(placekeeper.polyfill.__hidePlaceholder).toHaveBeenCalledWith(element);
                    expect(placekeeper.polyfill.__hidePlaceholder.calls.count()).toEqual(1);
                });

            });
        });

    });

    describe("focusing and blurring an element with placeholder", function() {

        describe("when there is an input that is already focused", function() {
            var element;

            beforeEach(function(done) {
                spyOn(placekeeper.polyfill, "__showPlaceholder").and.callThrough();
                element = createInputElement(true);
                element.focus();
                setTimeout(done, loopDurationForTests);
                placekeeper.priv.__setupPlaceholders();
            });

            afterEach(function() {
                element.parentNode.removeChild(element);
            });

            it("should not have called polyfill's __showPlaceholder method", function() {
                expect(placekeeper.polyfill.__showPlaceholder).not.toHaveBeenCalled();
                expect(placekeeper.polyfill.__showPlaceholder.calls.count()).toEqual(0);
            });

        });

        describe("when there is an input with placeholder value set", function() {
            var element;

            beforeEach(function(done) {
                spyOn(placekeeper.polyfill, "__showPlaceholder").and.callThrough();
                element = createInputElement(true);
                setTimeout(done, loopDurationForTests);
                placekeeper.priv.__setupPlaceholders();
            });

            afterEach(function() {
                element.parentNode.removeChild(element);
            });

            it("should have added data-placeholder-events attribute to the element", function() {
                expect(element.getAttribute("data-placeholder-has-events")).toEqual("true");
            });

            it("should have set element's value to placeholder value (Test)", function() {
                expect(element.value).toEqual("Test");
            });

            it("should have set data-placeholder-active to true", function() {
                expect(element.getAttribute("data-placeholder-active")).toEqual("true");
            });

            it("should have added placeholder class", function() {
                expect(element).toHaveClass("placeholder");
            });

            it("should have called polyfill's __showPlaceholder method", function() {
                expect(placekeeper.polyfill.__showPlaceholder).toHaveBeenCalledWith(element);
                expect(placekeeper.polyfill.__showPlaceholder.calls.count()).toEqual(1);
            });

            it("should have set data-placeholder-maxlength to 12", function() {
                expect(parseInt(element.getAttribute("data-placeholder-maxlength"), 10)).toEqual(12);
            });

            it("should have removed maxlength attribute", function() {
                expect(element.getAttribute("maxLength")).toEqualNullOr2147483647();
            });

            describe("and when element is focused", function() {

                beforeEach(function() {
                    spyOn(placekeeper.polyfill, "__hidePlaceholder").and.callThrough();
                    trigger(element, "focus");
                });

                it("should have called polyfill's __hidePlaceholder method", function() {
                    expect(placekeeper.polyfill.__hidePlaceholder).toHaveBeenCalledWith(element);
                    expect(placekeeper.polyfill.__hidePlaceholder.calls.count()).toEqual(1);
                });

                it("should have remove element's value", function() {
                    expect(element.value).toEqual("");
                });

                it("should have removed data-placeholder-active", function() {
                    expect(element.getAttribute("data-placeholder-active")).toEqual(null);
                });

                it("should have removed placeholder class", function() {
                    expect(element).not.toHaveClass("placeholder");
                });

                it("should have removed data-placeholder-maxlength", function() {
                    expect(element.getAttribute("data-placeholder-maxlength")).toEqual(null);
                });

                it("should have restored maxlength attribute", function() {
                    expect(parseInt(element.getAttribute("maxLength"), 10)).toEqual(12);
                });

                describe("and when a value is given to the element", function() {

                    beforeEach(function() {
                        element.value = "MyValue";
                    });

                    describe("and when element is blurred after that", function() {

                        beforeEach(function() {
                            trigger(element, "blur");
                        });

                        it("should have called polyfill's __showPlaceholder method", function() {
                            expect(placekeeper.polyfill.__showPlaceholder).toHaveBeenCalledWith(element);
                            expect(placekeeper.polyfill.__showPlaceholder.calls.count()).toEqual(2);
                        });

                        it("should have set element's value to Test", function() {
                            expect(element.value).toEqual("MyValue");
                        });

                        it("should have set data-placeholder-active to true", function() {
                            expect(element.getAttribute("data-placeholder-active")).toEqual(null);
                        });

                        it("should have removed placeholder class", function() {
                            expect(element).not.toHaveClass("placeholder");
                        });

                    });

                });

                describe("and when element is blurred after that", function() {

                    beforeEach(function() {
                        trigger(element, "blur");
                    });

                    it("should have called polyfill's __showPlaceholder method", function() {
                        expect(placekeeper.polyfill.__showPlaceholder).toHaveBeenCalledWith(element);
                        expect(placekeeper.polyfill.__showPlaceholder.calls.count()).toEqual(2);
                    });

                    it("should have set element's value to Test", function() {
                        expect(element.value).toEqual("Test");
                    });

                    it("should have set data-placeholder-active to true", function() {
                        expect(element.getAttribute("data-placeholder-active")).toEqual("true");
                    });

                    it("should have added placeholder class", function() {
                        expect(element).toHaveClass("placeholder");
                    });

                });

            });

        });

    });

    describe("utils", function() {

        describe("getElementType method", function() {

            describe("when there is an input with type text", function() {
                var element;

                beforeEach(function() {
                    element = createInputElement(true);
                });

                afterEach(function() {
                    element.parentNode.removeChild(element);
                });

                it("should return text for the type", function() {
                    expect(placekeeper.utils.getElementType(element)).toEqual("text");
                });

            });

            describe("when there is an input without type", function() {
                var element;

                beforeEach(function() {
                    element = createInputElementWithoutType(true);
                });

                afterEach(function() {
                    element.parentNode.removeChild(element);
                });

                it("should return text for the type", function() {
                    expect(placekeeper.utils.getElementType(element)).toEqual("text");
                });

            });

            describe("when there is an input with type email", function() {
                var element;

                beforeEach(function() {
                    element = createInputElement(true, "email");
                });

                afterEach(function() {
                    element.parentNode.removeChild(element);
                });

                it("should return text for the type", function() {
                    expect(placekeeper.utils.getElementType(element)).toEqual("email");
                });

            });

            describe("when there is a textarea", function() {
                var element;

                beforeEach(function() {
                    element = createTextareaElement(true);
                });

                afterEach(function() {
                    element.parentNode.removeChild(element);
                });

                it("should return text for the type", function() {
                    expect(placekeeper.utils.getElementType(element)).toEqual("textarea");
                });

            });

        });

    });

    describe("disable method", function() {

        describe("when there is a password input on the page and input type can not be changed", function() {
            var element;
            var clone;

            beforeEach(function(done) {
                spyOnCanChangeToTypeAndReturn(false);
                element = createInputElement(true, "password");
                placekeeper.priv.__setupPlaceholders();
                setTimeout(function() {
                    clone = document.getElementById("elem");
                    done();
                }, loopDurationForTests);
            });

            afterEach(function() {
                element.parentNode.removeChild(element);
            });

            it("should have two inputs on the page", function() {
                expect(document.getElementsByTagName("input").length).toEqual(2);
            });

            describe("and when disable is called", function() {

                beforeEach(function(done) {
                    spyOn(placekeeper.utils, "removeEventListener");
                    placekeeper.disable();
                    setTimeout(function() {
                        element = document.getElementById("elem");
                        done();
                    }, loopDurationForTests);
                });

                it("should have one input on the page", function() {
                    expect(document.getElementsByTagName("input").length).toEqual(1);
                });

                it("should have changed element type back to password", function() {
                    expect(element.getAttribute("type")).toEqual("password");
                });

                it("should have elem id back to element", function() {
                    expect(element.id).toEqual("elem");
                });

                it("should not have element display attribute set to anything", function() {
                    expect(element.style.display).toEqual("");
                });

                it("should not have data-placeholder-has-events attribute", function() {
                    expect(element.getAttribute("data-placeholder-has-events")).toEqual(null);
                });

                it("should not have data-placeholder-value attribute", function() {
                    expect(element.getAttribute("data-placeholder-value")).toEqual(null);
                });

                // In IE7 element is `null`
                // for some reason.
                // TODO: find out why
                if (clone != null) {
                    it("should have called utils.removeEventListener for focus handler", function() {
                        expect(placekeeper.utils.removeEventListener)
                        .toHaveBeenCalledWith(clone, "focus", placekeeper.events.handlers.focus);
                    });
                }

                // In IE7 element is `null`
                // for some reason.
                // TODO: find out why
                if (element != null) {
                    it("should have called utils.removeEventListener for blur handler", function() {
                        expect(placekeeper.utils.removeEventListener)
                        .toHaveBeenCalledWith(element, "blur", placekeeper.events.handlers.blur);
                    });
                }

            });

        });

        describe("when there is a password input on the page and input type can be changed", function() {
            var element;

            if (canActuallyChangeType) {

                beforeEach(function(done) {
                    spyOnCanChangeToTypeAndReturn(true);
                    element = createInputElement(true, "password");
                    placekeeper.priv.__setupPlaceholders();
                    setTimeout(done, loopDurationForTests);
                });

                afterEach(function() {
                    element.parentNode.removeChild(element);
                });

                it("should have one on the page", function() {
                    expect(document.getElementsByTagName("input").length).toEqual(1);
                });

                describe("and when disable is called", function() {

                    beforeEach(function() {
                        spyOn(placekeeper.utils, "removeEventListener");
                        placekeeper.disable();
                    });

                    it("should not have data-placeholder-has-events attribute", function() {
                        expect(element.getAttribute("data-placeholder-has-events")).toEqual(null);
                    });

                    it("should not have data-placeholder-value attribute", function() {
                        expect(element.getAttribute("data-placeholder-value")).toEqual(null);
                    });

                    it("should have called utils.removeEventListener for focus handler", function() {
                        expect(placekeeper.utils.removeEventListener)
                        .toHaveBeenCalledWith(element, "focus", placekeeper.events.handlers.focus);
                    });

                    it("should have called utils.removeEventListener for blur handler", function() {
                        expect(placekeeper.utils.removeEventListener)
                        .toHaveBeenCalledWith(element, "blur", placekeeper.events.handlers.blur);
                    });

                });
            }
        });

    });

    describe("when there is an element without placeholder inside a form on the page", function() {
        var element;
        var form;

        beforeEach(function(done) {
            element = createInputElementWithForm(false);
            form = document.getElementsByTagName("form")[0];
            placekeeper.priv.__setupPlaceholders();
            setTimeout(done, loopDurationForTests);
        });

        afterEach(function() {
            element.parentNode.removeChild(element);
        });

        describe("and when that form is submitted", function() {

            beforeEach(function() {
                spyOn(placekeeper.polyfill, "__hidePlaceholder");
                spyOn(placekeeper.polyfill, "__showPlaceholder");
                trigger(form, "submit");
            });

            it("should not have added data-placeholder-submit to the form", function() {
                expect(form.getAttribute("data-placeholder-submit")).toEqual(null);
            });

            it("should not have called polyfill's __hidePlaceholder method", function() {
                expect(placekeeper.polyfill.__hidePlaceholder).not.toHaveBeenCalled();
                expect(placekeeper.polyfill.__hidePlaceholder.calls.count()).toEqual(0);
            });

            it("should not have called polyfill's __showPlaceholder method", function() {
                expect(placekeeper.polyfill.__showPlaceholder).not.toHaveBeenCalled();
                expect(placekeeper.polyfill.__showPlaceholder.calls.count()).toEqual(0);
            });

        });

    });

    describe("when there is an element with placeholder inside a form on the page", function() {
        var element;
        var form;

        beforeEach(function(done) {
            element = createInputElementWithForm(true);
            form = document.getElementsByTagName("form")[0];
            placekeeper.priv.__setupPlaceholders();
            setTimeout(done, loopDurationForTests);
        });

        afterEach(function() {
            element.parentNode.removeChild(element);
        });

        describe("and when that form is submitted", function() {

            beforeEach(function() {
                spyOn(placekeeper.polyfill, "__hidePlaceholder");
                spyOn(placekeeper.polyfill, "__showPlaceholder");
                trigger(form, "submit");
            });

            it("should have added data-placeholder-submit to the form", function() {
                expect(form.getAttribute("data-placeholder-submit")).toEqual("true");
            });

            it("should have called polyfill's __hidePlaceholder method", function() {
                expect(placekeeper.polyfill.__hidePlaceholder).toHaveBeenCalledWith(element);
                expect(placekeeper.polyfill.__hidePlaceholder.calls.count()).toEqual(1);
            });

            it("should not have called polyfill's __showPlaceholder method", function() {
                expect(placekeeper.polyfill.__showPlaceholder).not.toHaveBeenCalled();
                expect(placekeeper.polyfill.__showPlaceholder.calls.count()).toEqual(0);
            });

            describe("and after 10ms (when form is submitted)", function() {

                beforeEach(function(done) {
                    setTimeout(done, 10);
                });

                it("should have called polyfill's __showPlaceholder method", function() {
                    expect(placekeeper.polyfill.__showPlaceholder).toHaveBeenCalledWith(element);
                    expect(placekeeper.polyfill.__showPlaceholder.calls.count()).toEqual(1);
                });

            });

        });

        describe("and when disable method is called", function() {

            beforeEach(function() {
                spyOn(placekeeper.utils, "removeEventListener");
                placekeeper.disable();
            });

            it("should have called utils.removeEventListener for submit handler", function() {
                expect(placekeeper.utils.removeEventListener)
                .toHaveBeenCalledWith(form, "submit", placekeeper.events.handlers.submit);
            });

            it("should not have data-placeholder-submit set to the from", function() {
                expect(form.getAttribute("data-placeholder-submit")).toEqual(null);
            });

        });

    });

    describe("when there is an element with placeholder on the page", function() {
        var element;

        beforeEach(function(done) {
            element = createInputElement(true);
            placekeeper.priv.__setupPlaceholders();
            setTimeout(done, loopDurationForTests);
        });

        afterEach(function() {
            element.parentNode.removeChild(element);
        });

        describe("when page is reloaded", function() {

            beforeEach(function() {
                spyOn(placekeeper.polyfill, "__hidePlaceholder");
                setupFakeWindow();
                triggerFakePageReload();
            });

            afterEach(restoreRealWindow);

            it("should have called polyfill's __hidePlaceholder method", function() {
                expect(placekeeper.polyfill.__hidePlaceholder).toHaveBeenCalledWith(element);
                expect(placekeeper.polyfill.__hidePlaceholder.calls.count()).toEqual(1);
            });

        });

        describe("and when disable method is called", function() {

            beforeEach(function() {
                spyOn(placekeeper.utils, "removeEventListener");
                placekeeper.disable();
            });

            it("should have called utils.removeEventListener for focus handler", function() {
                expect(placekeeper.utils.removeEventListener)
                .toHaveBeenCalledWith(element, "focus", placekeeper.events.handlers.focus);
            });

            it("should have called utils.removeEventListener for blur handler", function() {
                expect(placekeeper.utils.removeEventListener)
                .toHaveBeenCalledWith(element, "blur", placekeeper.events.handlers.blur);
            });

            it("should not have data-placeholder-has-events attribute", function() {
                expect(element.getAttribute("data-placeholder-has-events")).toEqual(null);
            });

            it("should not have data-placeholder-value attribute", function() {
                expect(element.getAttribute("data-placeholder-value")).toEqual(null);
            });

        });

    });

    describe("when there is an element without placeholder on the page", function() {
        var element;

        beforeEach(function(done) {
            element = createInputElement(false);
            setTimeout(done, loopDurationForTests);
        });

        afterEach(function() {
            element.parentNode.removeChild(element);
        });

        describe("when page is reloaded", function() {

            beforeEach(function() {
                spyOn(placekeeper.polyfill, "__hidePlaceholder");
                setupFakeWindow();
                triggerFakePageReload();
            });

            afterEach(restoreRealWindow);

            it("should not have called polyfill's __hidePlaceholder method", function() {
                expect(placekeeper.polyfill.__hidePlaceholder).not.toHaveBeenCalled();
                expect(placekeeper.polyfill.__hidePlaceholder.calls.count()).toEqual(0);
            });

        });

    });

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

        describe("__storeMaxlength", function() {

            describe("when called with an element that has maxLength attribute set", function() {
                var element;

                beforeEach(function(done) {
                    element = createInputElementWithMaxLength(10);
                    placekeeper.polyfill.__storeMaxlength(element);
                    setTimeout(done, loopDurationForTests);
                });

                afterEach(function() {
                    element.parentNode.removeChild(element);
                });

                it("should have added data-placeholder-maxlength attribute to the element", function() {
                    expect(parseInt(element.getAttribute("data-placeholder-maxlength"), 10)).toEqual(10);
                });

                it("should have removed maxLength attribute", function() {
                    expect(element.getAttribute("maxlength")).toEqualNullOr2147483647();
                });

            });

            describe("when called with an element that does not have maxLength attribute set", function() {
                var element;

                beforeEach(function(done) {
                    element = createInputElementWithMaxLength();
                    placekeeper.polyfill.__storeMaxlength(element);
                    setTimeout(done, loopDurationForTests);
                });

                afterEach(function() {
                    element.parentNode.removeChild(element);
                });

                it("should not have added data-placeholder-maxlength attribute to the element", function() {
                    expect(element.getAttribute("data-placeholder-maxlength")).toEqual(null);
                });

            });

        });

        describe("__restoreMaxlength", function() {

            describe("when called with an element that has maxLength data attribute set", function() {
                var element;

                beforeEach(function(done) {
                    element = createInputElementWithMaxLength(false, 10);
                    placekeeper.polyfill.__restoreMaxlength(element);
                    setTimeout(done, loopDurationForTests);
                });

                afterEach(function() {
                    element.parentNode.removeChild(element);
                });

                it("should not have added data-placeholder-maxlength attribute to the element", function() {
                    expect(element.getAttribute("data-placeholder-maxlength")).toEqual(null);
                });

                it("should have added maxLength attribute back", function() {
                    expect(parseInt(element.getAttribute("maxlength"), 10)).toEqual(10);
                });

            });

            describe("when called with an element that does not have maxLength data attribute set", function() {
                var element;

                beforeEach(function(done) {
                    element = createInputElementWithMaxLength();
                    placekeeper.polyfill.__restoreMaxlength(element);
                    setTimeout(done, loopDurationForTests);
                });

                afterEach(function() {
                    element.parentNode.removeChild(element);
                });

                it("should not have added data-placeholder-maxlength attribute to the element", function() {
                    expect(element.getAttribute("data-placeholder-maxlength")).toEqual(null);
                });

                it("should not have added maxLength attribute", function() {
                    expect(element.getAttribute("maxlength")).toEqualNullOr2147483647();
                });

            });

        });

        describe("utils.hasPlaceholderAttrSet", function() {

            describe("when called with an element that has placeholder attribute set", function() {
                var element;

                beforeEach(function(done) {
                    element = createInputElement(true);
                    setTimeout(done, loopDurationForTests);
                });

                afterEach(function() {
                    element.parentNode.removeChild(element);
                });

                it("should return true", function() {
                    expect(placekeeper.utils.hasPlaceholderAttrSet(element)).toEqual(true);
                });

            });

            describe("when called with an element that does not have have placeholder attribute set", function() {
                var element;

                beforeEach(function(done) {
                    element = createInputElement(false);
                    setTimeout(done, loopDurationForTests);
                });

                afterEach(function() {
                    element.parentNode.removeChild(element);
                });

                it("should return false", function() {
                    expect(placekeeper.utils.hasPlaceholderAttrSet(element)).toEqual(false);
                });

            });

        });

        describe("__setupPlaceholders", function() {

            describe("when there is a text input without a placeholder value set", function() {
                var element;

                beforeEach(function(done) {
                    element = createInputElement(false);
                    setTimeout(done, loopDurationForTests);
                });

                afterEach(function() {
                    element.parentNode.removeChild(element);
                });

                describe("and when called", function() {

                    beforeEach(function() {
                        placekeeper.priv.__setupPlaceholders();
                    });

                    it("should have one input in DOM", function() {
                        expect(document.getElementsByTagName("input").length).toEqual(1);
                    });

                    it("should not have added data-placeholder-value to the element", function() {
                        expect(element.getAttribute("data-placeholder-value")).toEqual(null);
                    });

                });

            });

            describe("when there is a text input with a placeholder value set", function() {
                var element;

                beforeEach(function(done) {
                    element = createInputElement(true);
                    setTimeout(done, loopDurationForTests);
                });

                afterEach(function() {
                    element.parentNode.removeChild(element);
                });

                describe("and when called", function() {

                    beforeEach(function() {
                        placekeeper.priv.__setupPlaceholders();
                    });

                    it("should have one input in DOM", function() {
                        expect(document.getElementsByTagName("input").length).toEqual(1);
                    });

                    it("should have added data-placeholder-value to the element", function() {
                        expect(element.getAttribute("data-placeholder-value")).toEqual("Test");
                    });

                });

            });

            describe("when there is a date input with a placeholder value set", function() {
                var element;

                beforeEach(function(done) {
                    element = createInputElement(true, "date");
                    setTimeout(done, loopDurationForTests);
                });

                afterEach(function() {
                    element.parentNode.removeChild(element);
                });

                describe("and when called", function() {

                    beforeEach(function() {
                        placekeeper.priv.__setupPlaceholders();
                    });

                    it("should not have added data-placeholder-value to the element", function() {
                        expect(element.getAttribute("data-placeholder-value")).not.toEqual("Test");
                    });

                });

            });

        });

        describe("__hasElementsThatNeedPlaceholder", function() {

            it("should return false when called without parameters", function() {
                expect(placekeeper.priv.__hasElementsThatNeedPlaceholder()).toEqual(false);
            });

            it("should return false when called with null", function() {
                expect(placekeeper.priv.__hasElementsThatNeedPlaceholder(null)).toEqual(false);
            });

            describe("when called and there is an element that has placeholder attribute set but the type is not supported", function() {
                var element;
                var elements;

                beforeEach(function() {
                    element = createInputElement(true, "range");
                    elements = document.getElementsByTagName("input");
                });

                afterEach(function() {
                    element.parentNode.removeChild(element);
                });

                it("should return false", function() {
                    expect(placekeeper.priv.__hasElementsThatNeedPlaceholder(elements)).toEqual(false);
                });

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

        describe("elemens.getElements", function() {

            describe("when inputs are supported and textareas are not", function() {

                beforeEach(function() {
                    spyOn(placekeeper.utils, "getElementsByTagName");
                    placekeeper.support.isInputSupported.and.returnValue(true);
                    placekeeper.support.isTextareaSupported.and.returnValue(false);
                });

                describe("and when called", function() {

                    beforeEach(function() {
                        placekeeper.elements.getElements();
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
                        placekeeper.elements.getElements();
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
                        placekeeper.elements.getElements();
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
                        placekeeper.elements.getElements();
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
                        setTimeout(done, loopDurationForTests);
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
                        setTimeout(done, loopDurationForTests);
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
                        setTimeout(done, loopDurationForTests);
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
                        element = createTextareaElement(true);
                        setTimeout(done, loopDurationForTests);
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
