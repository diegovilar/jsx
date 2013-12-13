describe('idFunction', function () {
    "use strict";

    var undefined,
        idFunction = jsx.idFunction;

    it('should return whatever is passed as the first argument', function () {

        expect(idFunction()).toBe(undefined);
        expect(idFunction(undefined)).toBe(undefined);
        expect(idFunction(null)).toBe(null);
        expect(idFunction(0)).toBe(0);
        expect(idFunction(1, 2)).toBe(1);

    });

});
