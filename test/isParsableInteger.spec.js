describe('isParsableInteger', function () {
    "use strict";

    var undefined,
        isParsableInteger = jsx.isParsableInteger;

    it('should return true for primitive integer values', function () {

        expect(isParsableInteger(0)).toBe(true);
        expect(isParsableInteger(2e2)).toBe(true);
        expect(isParsableInteger(0xFF)).toBe(true);
        expect(isParsableInteger(-1)).toBe(true);

    });

    it('should return true for wrapped integer values', function () {

        expect(isParsableInteger(new Number('1'))).toBe(true);
        expect(isParsableInteger(new Number('-1'))).toBe(true);
        expect(isParsableInteger(new Number('2e2'))).toBe(true);

    });

    it('should return true for values parsable to integer', function () {

        expect(isParsableInteger('0')).toBe(true);
        expect(isParsableInteger('2e2')).toBe(true);
        expect(isParsableInteger('0xFF')).toBe(true);
        expect(isParsableInteger('-1')).toBe(true);

    });

    it('should return false for NaN', function () {

        expect(isParsableInteger('NaN')).toBe(false);
        expect(isParsableInteger(NaN)).toBe(false);
        expect(isParsableInteger(new Number(NaN))).toBe(false);

    });

    it('should return false for (+-)Infinity', function () {

        expect(isParsableInteger('Infinity')).toBe(false);
        expect(isParsableInteger(Infinity)).toBe(false);
        expect(isParsableInteger(-Infinity)).toBe(false);

    });

    it('should return false for values not parsable to integers', function () {

        expect(isParsableInteger()).toBe(false);
        expect(isParsableInteger(undefined)).toBe(false);
        expect(isParsableInteger(null)).toBe(false);
        expect(isParsableInteger(true)).toBe(false);
        expect(isParsableInteger(0.4)).toBe(false);
        expect(isParsableInteger('1.4')).toBe(false);
        expect(isParsableInteger({})).toBe(false);
        expect(isParsableInteger([])).toBe(false);
        expect(isParsableInteger(function(){})).toBe(false);

    });

});
