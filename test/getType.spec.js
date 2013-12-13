describe('getType', function () {
    "use strict";

    var undefined,
        getType = jsx.getType,
        UNDEFINED = 'undefined',
        NULL = 'null',
        NAN = 'NaN',
        STRING = 'string',
        O_STRING = 'String',
        BOOLEAN = 'boolean',
        O_BOOLEAN = 'Boolean',
        NUMBER = 'number',
        O_NUMBER = 'Number',
        FUNCTION = 'function',
        OBJECT = 'object',
        ARRAY = 'Array',
        DATE = 'Date',
        ERROR = 'Error',
        REGEXP = 'RegExp',
        ANIMAL = 'Animal';

    function Animal(){}

    it('should return correct types for primitives', function () {

        expect(getType(1)).toBe(NUMBER);
        expect(getType('1')).toBe(STRING);
        expect(getType(true)).toBe(BOOLEAN);

    });

    it('should return correct type for functions', function () {

        expect(getType(function(){})).toBe(FUNCTION);

    });

    it('should return correct types for native objects', function () {

        expect(getType({})).toBe(OBJECT);
        expect(getType([])).toBe(ARRAY);
        expect(getType(new Date())).toBe(DATE);
        expect(getType(new Error())).toBe(ERROR);
        expect(getType(new RegExp())).toBe(REGEXP);
        expect(getType(new Number())).toBe(O_NUMBER);
        expect(getType(new Boolean())).toBe(O_BOOLEAN);
        expect(getType(new String())).toBe(O_STRING);

    });

    it('should return "NaN" for NaN', function () {

        expect(getType(NaN)).toBe(NAN);

    });

    it('should return "undefined" for undefined', function () {

        expect(getType(undefined)).toBe(UNDEFINED);

    });

    it('should return "null" for null', function () {

        expect(getType(null)).toBe(NULL);

    });

    if (Object.hasOwnProperty('name')) {
        it('should return the constructor\'s name if the there is a "name" property on the constructor', function () {

            expect(getType(new Animal())).toBe(ANIMAL);

        });
    }
    else {
        it('should return "object" if the there is no "name" property on the constructor', function () {

            expect(getType(new Animal())).toBe(OBJECT);

        });
    }

    it('should return the prototype\'s constructor name of an object', function () {

        function Plant(){}
        Plant.prototype = new Date();

        expect(getType(new Plant())).toBe(DATE);

    });

});
