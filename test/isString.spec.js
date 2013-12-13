describe('isString', function () {
    "use strict";

    var undefined,
        isString = jsx.isString;

    it('should return true for primitive string values', function () {

        expect(isString('')).toBe(true);

    });

    it('should return true for wrapped string values', function () {

        expect(isString(new String())).toBe(true);

    });

    it('should return false for non-string values', function () {

        expect(isString()).toBe(false);
        expect(isString(undefined)).toBe(false);
        expect(isString(null)).toBe(false);
        expect(isString(1)).toBe(false);
        expect(isString(NaN)).toBe(false);
        expect(isString(Infinity)).toBe(false);
        expect(isString(true)).toBe(false);
        expect(isString({})).toBe(false);
        expect(isString([])).toBe(false);
        expect(isString(function(){})).toBe(false);

    });

});
