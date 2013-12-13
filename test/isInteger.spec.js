describe('isInteger', function () {
    "use strict";

    var undefined,
        isInteger = jsx.isInteger;

    it('should return true for primitive integer values', function () {

        expect(isInteger(0)).toBe(true);
        expect(isInteger(2e2)).toBe(true);
        expect(isInteger(0xFF)).toBe(true);
        expect(isInteger(-1)).toBe(true);

    });

    it('should return true for wrapped integer values', function () {

        expect(isInteger(new Number('1'))).toBe(true);
        expect(isInteger(new Number('-1'))).toBe(true);
        expect(isInteger(new Number('2e2'))).toBe(true);

    });

    it('should return false for integers too big for Javascript to handle without loosing precion', function () {

        expect(isInteger(9999999999999999999999)).toBe(false);

    });

    it('should return false for NaN', function () {

        expect(isInteger(NaN)).toBe(false);
        expect(isInteger(new Number(NaN))).toBe(false);

    });

    it('should return false for (+-)Infinity', function () {

        expect(isInteger(Infinity)).toBe(false);
        expect(isInteger(-Infinity)).toBe(false);

    });

    it('should return false for non-integer values', function () {

        expect(isInteger()).toBe(false);
        expect(isInteger(undefined)).toBe(false);
        expect(isInteger(null)).toBe(false);
        expect(isInteger('1')).toBe(false);
        expect(isInteger(1.1)).toBe(false);
        expect(isInteger(1e50)).toBe(false);
        expect(isInteger(true)).toBe(false);
        expect(isInteger({})).toBe(false);
        expect(isInteger([])).toBe(false);
        expect(isInteger(function(){})).toBe(false);

    });

});
