describe('isPrimitive', function () {
    "use strict";

    var undefined,
        isPrimitive = jsx.isPrimitive;

    it('should return true for primitive values', function () {

        expect(isPrimitive(0)).toBe(true);
        expect(isPrimitive('')).toBe(true);
        expect(isPrimitive(false)).toBe(true);

    });

    it('should return false for non-primitive values', function () {

        expect(isPrimitive()).toBe(false);
        expect(isPrimitive(undefined)).toBe(false);
        expect(isPrimitive(null)).toBe(false);
        expect(isPrimitive(NaN)).toBe(false);
        expect(isPrimitive(Infinity)).toBe(false);
        expect(isPrimitive(-Infinity)).toBe(false);
        expect(isPrimitive({})).toBe(false);
        expect(isPrimitive([])).toBe(false);
        expect(isPrimitive(new Number())).toBe(false);
        expect(isPrimitive(new String())).toBe(false);
        expect(isPrimitive(new Boolean())).toBe(false);
        expect(isPrimitive(function(){})).toBe(false);

    });

});
