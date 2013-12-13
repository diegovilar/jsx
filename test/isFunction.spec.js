describe('isFunction', function () {
    "use strict";

    var undefined,
        isFunction = jsx.isFunction;

    it('should return true for literal functions', function () {

        expect(isFunction(function(){})).toBe(true);

    });

    it('should return true for wrapped functions', function () {

        expect(isFunction(new Function())).toBe(true);

    });

    it('should return true for native functions', function () {

        expect(isFunction(Object)).toBe(true);

    });

    it('should return false for non-function values', function () {

        expect(isFunction()).toBe(false);
        expect(isFunction(undefined)).toBe(false);
        expect(isFunction(null)).toBe(false);
        expect(isFunction(1)).toBe(false);
        expect(isFunction('')).toBe(false);
        expect(isFunction({})).toBe(false);
        expect(isFunction([])).toBe(false);

    });

});
