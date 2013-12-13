describe('isObject', function () {
    "use strict";

    var undefined,
        isObject = jsx.isObject;

    it('should return true for objects', function () {

        expect(isObject({})).toBe(true);
        expect(isObject([])).toBe(true);
        expect(isObject(new Error())).toBe(true);
        expect(isObject(new Date())).toBe(true);
        expect(isObject(new Number())).toBe(true);

    });

    it('should return false for null', function () {

        expect(isObject(null)).toBe(false);

    });

    it('should return false for non-objects', function () {

        expect(isObject()).toBe(false);
        expect(isObject(undefined)).toBe(false);
        expect(isObject(null)).toBe(false);
        expect(isObject(1)).toBe(false);
        expect(isObject('')).toBe(false);
        expect(isObject(false)).toBe(false);
        expect(isObject(function(){})).toBe(false);

    });

});
