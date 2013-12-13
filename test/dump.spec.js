describe('dump', function () {
    "use strict";

    var undefined,
        global = window,
        dump = jsx.dump

    it('should return correct types and string representation for primitives', function () {

        expect(dump(Infinity)).toBe('{number}<Infinity>');
        expect(dump(1)).toBe('{number}<1>');
        expect(dump('')).toBe('{string}<>');
        expect(dump(true)).toBe('{boolean}<true>');

    });

    it('should return correct types and string representation for undefined/null/NaN', function () {

        expect(dump()).toBe('{undefined}<undefined>');
        expect(dump(undefined)).toBe('{undefined}<undefined>');
        expect(dump(null)).toBe('{null}<null>');
        expect(dump(NaN)).toBe('{NaN}<NaN>');

    });

    it('should return correct types and string representation for native objects', function () {

        expect(dump({})).toBe('{object}<[object Object]>');
        expect(dump([])).toBe('{Array}<>');
        expect(dump([1,2])).toBe('{Array}<1,2>');
        expect(dump(/a/gi)).toBe('{RegExp}</a/gi>');

    });

    it('should return correct type for functions', function () {

        // We do not test for the whole return value because some platforms return
        // the function string representation differently

        var re = /\{function\}<.*>/;
        expect(re.test(dump(function(){}))).toBe(true);

    });

    it('should return correct type and string representation for objects that override toString', function () {

        function Animal(){}
        Animal.prototype.toString = function() {
            return 'Animal';
        };

        expect(dump(new Animal())).toBe('{Animal}<Animal>')

    });

    if (Object.hasOwnProperty('name')) {
        it('should return correct type and string representation for custom objects', function () {

            function Animal(){}
            expect(dump(new Animal())).toBe('{Animal}<[object Object]>')

        });
    }

    describe('(toConsole argument)', function () {

        // We can't really check if it really dumps to console, but we can check some scenarios
        // for possible exceptions

        var oldConsole = global.console;

        function callWithParams() {
            var args = [].slice.call(arguments, 0);

            return function() {
                return dump.apply(null, args);
            }
        }

        afterEach(function () {

            global.console = oldConsole;

        });

        it('should run smoothly if the console and both its log and debug methods are available', function () {

            global.console = {
                log : function(){},
                debug : function(){}
            };

            expect(callWithParams(null, true)).not.toThrow();

        });

        it('should run smoothly if the console and its log method are available, but not the debug method', function () {

            global.console = {
                log : function(){}
            };

            expect(callWithParams(null, true)).not.toThrow();

        });

        it('should run smoothly if the console method is available, but not the log and debug methods', function () {

            global.console = {
                log : function(){},
                debug : function(){}
            };

            expect(callWithParams(null, true)).not.toThrow();

        });

        it('should run smoothly if no console is avaiable', function () {

            global.console = null;

            expect(callWithParams(null, true)).not.toThrow();

        });

    });

});
