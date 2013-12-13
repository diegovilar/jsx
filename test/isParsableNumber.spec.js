describe('isParsableNumber', function () {
    "use strict";

    var undefined,
        isParsableNumber = jsx.isParsableNumber;

    it('should return true for values parsable to numbers', function () {

        expect(isParsableNumber(0)).toBe(true);
        expect(isParsableNumber(new Number('1'))).toBe(true);
        expect(isParsableNumber('0')).toBe(true);
        expect(isParsableNumber('55.2')).toBe(true);
        expect(isParsableNumber('-1')).toBe(true);
        expect(isParsableNumber('1e45')).toBe(true);
        expect(isParsableNumber('0xFF')).toBe(true);
        expect(isParsableNumber(String(Number.MAX_VALUE))).toBe(true);

    });

    it('should return false for NaN', function () {

        expect(isParsableNumber('NaN')).toBe(false);
        expect(isParsableNumber(NaN)).toBe(false);
        expect(isParsableNumber(new Number(NaN))).toBe(false);

    });

    it('should return false for (+-)Infinity', function () {

        expect(isParsableNumber('Infinity')).toBe(false);
        expect(isParsableNumber(Infinity)).toBe(false);
        expect(isParsableNumber(-Infinity)).toBe(false);

    });

    it('should return false for values not parsable to numbers', function () {

        expect(isParsableNumber()).toBe(false);
        expect(isParsableNumber(undefined)).toBe(false);
        expect(isParsableNumber(null)).toBe(false);
        expect(isParsableNumber(true)).toBe(false);
        expect(isParsableNumber({})).toBe(false);
        expect(isParsableNumber([])).toBe(false);
        expect(isParsableNumber(function(){})).toBe(false);

    });

});
