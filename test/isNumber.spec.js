describe('isNumber', function () {
    "use strict";

    var undefined,
        isNumber = jsx.isNumber;

    it('should return true for primitive number values', function () {

        expect(isNumber(0)).toBe(true);
        expect(isNumber(2e2)).toBe(true);
        expect(isNumber(0xFF)).toBe(true);
        expect(isNumber(1.1)).toBe(true);
        expect(isNumber(-1)).toBe(true);
        expect(isNumber(Number.MAX_VALUE)).toBe(true);

    });

    it('should return true for wrapped number values', function () {

        expect(isNumber(new Number('1'))).toBe(true);

    });

    it('should return false for NaN', function () {

        expect(isNumber(NaN)).toBe(false);
        expect(isNumber(new Number(NaN))).toBe(false);

    });

    it('should return false for (+-)Infinity', function () {

        expect(isNumber(Infinity)).toBe(false);
        expect(isNumber(-Infinity)).toBe(false);

    });

    it('should return false for non-number values', function () {

        expect(isNumber()).toBe(false);
        expect(isNumber(undefined)).toBe(false);
        expect(isNumber(null)).toBe(false);
        expect(isNumber('1')).toBe(false);
        expect(isNumber(true)).toBe(false);
        expect(isNumber({})).toBe(false);
        expect(isNumber([])).toBe(false);
        expect(isNumber(function(){})).toBe(false);

    });

});
