describe('isBoolean', function () {
    "use strict";

    var undefined,
        isBoolean = jsx.isBoolean;

    it('should return true for primitive boolean values', function () {

        expect(isBoolean(true)).toBe(true);
        expect(isBoolean(false)).toBe(true);

    });

    it('should return true for wrapped boolean values', function () {

        expect(isBoolean(new Boolean())).toBe(true);

    });

    it('should return false for non-boolean values', function () {

        expect(isBoolean()).toBe(false);
        expect(isBoolean(undefined)).toBe(false);
        expect(isBoolean(null)).toBe(false);
        expect(isBoolean(1)).toBe(false);
        expect(isBoolean(NaN)).toBe(false);
        expect(isBoolean(Infinity)).toBe(false);
        expect(isBoolean('')).toBe(false);
        expect(isBoolean({})).toBe(false);
        expect(isBoolean([])).toBe(false);
        expect(isBoolean(function(){})).toBe(false);

    });

});
