describe('isArray', function () {
    "use strict";

    var undefined,
        isArray = jsx.isArray;

    it('should return true for arrays', function () {

        expect(isArray([])).toBe(true);

    });

    it('should return false for the arguments object', function () {

        expect(isArray(arguments)).toBe(false);

    });

    it('should return false for non-arrays', function () {

        expect(isArray()).toBe(false);
        expect(isArray(undefined)).toBe(false);
        expect(isArray(null)).toBe(false);
        expect(isArray(1)).toBe(false);
        expect(isArray('')).toBe(false);
        expect(isArray(false)).toBe(false);
        expect(isArray({})).toBe(false);
        expect(isArray(function(){})).toBe(false);

    });

});
