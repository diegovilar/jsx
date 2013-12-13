describe('isPojo', function () {
    "use strict";

    var undefined,
        isPojo = jsx.isPojo;

    it('should return true for plain old javascript object', function () {

        expect(isPojo({})).toBe(true);
        expect(isPojo(new Object())).toBe(true);

    });

    it('should return false for non-POJOs', function () {

        expect(isPojo()).toBe(false);
        expect(isPojo(undefined)).toBe(false);
        expect(isPojo(null)).toBe(false);
        expect(isPojo(1)).toBe(false);
        expect(isPojo('')).toBe(false);
        expect(isPojo(false)).toBe(false);
        expect(isPojo([])).toBe(false);
        expect(isPojo(function(){})).toBe(false);
        expect(isPojo(new String())).toBe(false);
        expect(isPojo(new Date())).toBe(false);
        expect(isPojo(new RegExp())).toBe(false);
        expect(isPojo(new Error())).toBe(false);

        function Animal(){}
        expect(isPojo(new Animal())).toBe(false);

    });

});
