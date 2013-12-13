(function(global, jsx, undefined) {
    "use strict";

    var ensureString = jsx.ensureString,
        interpolate = jsx.interpolate,
        isString = jsx.isString,
        isNumber = jsx.isNumber,
        isInteger = jsx.isInteger,
        isFloat = jsx.isNumber,// ?????
        isBoolean = jsx.isBoolean,
        isFunction = jsx.isFunction,
        isArray = jsx.isArray,
        isObject = jsx.isObject,
        isPojo = jsx.isPojo,
        dump = jsx.dump,
        INFINITY = Infinity;


    /**
     *
     * @param {*} value
     * @param {string} [message]
     * @returns {string}
     */
    function assertString(value, message) {

        if (!isString(value)) {
            message = ensureString(message).trim() || 'Value is not a string: ' + dump(value);
            throw new TypeError(message);
        }

        return value;

    }

    /**
     *
     * @param {*} value
     * @param {number} min
     * @param {number} [max=Infinity]
     * @param {string} [message]
     * @returns {string}
     */
    function assertStringLength(value, min, max, message) {

        assertRange(arguments.length, 2, 4);
        assertString(value);
        assertRange(min, 0, Infinity);

        if (arguments.length > 2) {
            assertRange(max, min + 1, Infinity,'Parameter "max" must be a number: ' + dump(max));
        }
        else {
            max = Infinity;
        }

        var len = value.length;
        if (len < min || len > max) {
            message = ensureString(message).trim() || interpolate('Value\'s length is out of range {0},{1}: {2}', min, max, len);
            throw new RangeError(message);
        }

        return value;

    }

    /**
     *
     * @param {*} value
     * @param {number} min
     * @param {number} [max=Number.MAX_VALUE]
     * @param {string} [message]
     * @returns {string}
     */
    function assertStringTrimmedLength(value, min, max, message) {

        assertString(value, message);
        assertNumber(min, 'Parameter "min" must be a number: ' + dump(min));

        if (arguments.length >= 3) {
            assertNumber(max, 'Parameter "max" must be a number: ' + dump(max));
        }
        else {
            max = Number.MAX_VALUE;
        }

        var len = value.trim().length;
        if (len < min || len > max) {
            message = ensureString(message).trim() || interpolate('Value\'s trimmed length is out of range {0},{1}: {2}', min, max, len);
            throw new RangeError(message);
        }

        return value.trim();

    }

    /**
     *
     * @param {*} value
     * @param {string} [message]
     * @returns {number}
     */
    function assertParsableNumber(value, message) {

        if (!jsx.isParsableNumber(value)) {
            message = ensureString(message).trim() || 'Value is no parsable to number: ' + dump(value);
            throw new TypeError(message);
        }

        return Number(value);

    }

    /**
     *
     * @param {*} value
     * @param {string} [message]
     * @returns {number}
     */
    function assertParsableInteger(value, message) {

        if (!jsx.isParsableInteger(value)) {
            message = ensureString(message).trim() || 'Value is no parsable to integer or would loose precision: ' + dump(value);
            throw new TypeError(message);
        }

        return parseInt(value, 10);

    }

    /**
     *
     * @param {*} value
     * @param {String} [message]
     */
    function assertNumber(value, message) {

        if (!isNumber(value)) {
            message = ensureString(message).trim() || 'Value is not a number: ' + dump(value);
            throw new TypeError(message);
        }

        return value;

    }

    /**
     *
     * @param {*} value
     * @param {String} [message]
     */
    function assertFloat(value, message) {

        if (!isFloat(value)) {
            message = ensureString(message).trim() || 'Value is not a float: ' + dump(value);
            throw new TypeError(message);
        }

        return value;

    }

    /**
     *
     * @param {*} value
     * @param {String} [message]
     */
    function assertInteger(value, message) {

        if (!isNumber(value)) {
            message = ensureString(message).trim() || 'Value is not an integer: ' + dump(value);
            throw new TypeError(message);
        }

        return value;

    }

    /**
     *
     * @param {*} value
     * @param {Number} min
     * @param {Number} max
     * @param {String} [message]
     */
    function assertRange(value, min, max, message) {

        assertNumber(min, 'Parameter "min" must be a number: ' + dump(min));
        assertNumber(max, 'Parameter "max" must be a number: ' + dump(max));

        assertNumber(value, message);

        if (value < min || value > max) {
            message = ensureString(message).trim() || interpolate('Value is out of range {0},{1}: {2}', min, max, value);
            throw new RangeError(message);
        }

        return value;

    }

    /**
     *
     * @param {*} value
     * @param {String} [message]
     */
    function assertBoolean(value, message) {

        if (!isBoolean(value)) {
            message = ensureString(message).trim() || 'Value is not a boolean: ' + dump(value);
            throw new TypeError(message);
        }

        return value;

    }

    /**
     *
     * @param {*} value
     * @param {String} [message]
     */
    function assertTrue(value, message) {

        if (!isBoolean(value) || !value) {
            message = ensureString(message).trim() || 'Value is not boolean true: ' + dump(value);
            throw new TypeError(message);
        }

        return value;

    }

    /**
     *
     * @param {*} value
     * @param {String} [message]
     */
    function assertFalse(value, message) {

        if (!isBoolean(value) || value) {
            message = ensureString(message).trim() || 'Value is not boolean false: ' + dump(value);
            throw new TypeError(message);
        }

        return value;

    }

    /**
     *
     * @param {*} value
     * @param {String} [message]
     */
    function assertTruthy(value, message) {

        if (!value) {
            message = ensureString(message).trim() || 'Value cannot be coarced to boolean true: ' + dump(value);
            throw new TypeError(message);
        }

        return value;

    }

    /**
     *
     * @param {*} value
     * @param {String} [message]
     */
    function assertFalsy(value, message) {

        if (value) {
            message = ensureString(message).trim() || 'Value cannot be coarced to boolean false: ' + dump(value);
            throw new TypeError(message);
        }

        return value;

    }

    /**
     *
     * @param {*} valueA
     * @param {*} valueB
     * @param {String} [message]
     */
    function assertEqual(valueA, valueB, message) {

        message = ensureString(message).trim() || interpolate('Values are not equal (==): {0} and {1}', dump(valueA), dump(valueA));
        assertTrue(valueA == valueB, message);

    }

    /**
     *
     * @param {*} value
     * @param {Array} options
     * @param {String} [message]
     */
    function assertEqualOption(value, options, message) {

        assertArray(options, 'Parameter "options" must be an array: ' + dump(options));

        var i = 0,
            len = options.length;
        for (; i < len; i++) {
            if (value == options[i]) {
                return value;
            }
        }

        message = ensureString(message).trim() || interpolate('Value should be equal (==) to one of [{0}], but got: {1}', options, dump(value));
        throw new TypeError(message);

    }

    /**
     *
     * @param {*} value
     * @param {Array} options
     * @param {String} [message]
     */
    function assertExactlyEqualOption(value, options, message) {

        assertArray(options, 'Parameter "options" must be an array: ' + dump(options));

        var i = 0,
            len = options.length;
        for (; i < len; i++) {
            if (value === options[i]) {
                return value;
            }
        }

        message = ensureString(message).trim() || interpolate('Value should be exactly equal (===) to one of [{0}]', options, dump(value));
        throw new TypeError(message);

    }

    /**
     *
     * @param {*} valueA
     * @param {*} valueB
     * @param {String} [message]
     */
    function assertExactlyEqual(valueA, valueB, message) {

        message = ensureString(message).trim() || interpolate('Values are not exactly equal (===): {0} and {1}', dump(valueA), dump(valueA));
        assertTrue(valueA === valueB, message);

    }

    /**
     *
     * @param {*} value
     * @param {String} [message]
     */
    function assertArray(value, message) {

        if (!isArray(value)) {
            message = ensureString(message).trim() || 'Value is not an array: ' + dump(value);
            throw new TypeError(message);
        }

        return value;

    }

    /**
     *
     * @param {*} value
     * @param {String} [message]
     */
    function assertNonEmptyArray(value, message) {

        assertArray(value, message);

        if (!value.length) {
            message = ensureString(message).trim() || 'Array is empty';
            throw new TypeError(message);
        }

        return value;

    }

    /**
     *
     * @param {*} value
     * @param {String} [message]
     */
    function assertObject(value, message) {

        if (!isObject(value)) {
            message = ensureString(message).trim() || 'Value is not an object: ' + dump(value);
            throw new TypeError(message);
        }

        return value;

    }

    /**
     *
     * @param {*} value
     * @param {String} [message]
     */
    function assertPojo(value, message) {

        if (!isPojo(value)) {
            message = ensureString(message).trim() || 'Value is not a POJO: ' + dump(value);
            throw new TypeError(message);
        }

        return value;

    }

    /**
     *
     * @param {*} value
     * @param {String} [message]
     */
    function assertFunction(value, message) {

        if (!isFunction(value)) {
            message = ensureString(message).trim() || 'Value is not a function: ' + dump(value);
            throw new TypeError(message);
        }

        return value;

    }

    /**
     *
     * @param {*} value
     * @param {String} [message]
     */
    function assertDefined(value, message) {

        if (value === undefined) {
            message = ensureString(message).trim() || 'Value is undefined';
            throw new TypeError(message);
        }

        return value;

    }

    /**
     *
     * @param {*} value
     * @param {string} [message]
     * @returns {Date}
     */
    function assertDate(value, message) {

        if (!(value instanceof Date)) {
            message = ensureString(message).trim() || 'Value is not a Date: ' + dump(value);
            throw new TypeError(message);
        }

        return value;

    }

    /**
     *
     * @param {*} value
     * @param {string} [message]
     * @returns {?Date}
     */
    function assertNullableDate(value, message) {

        if (value != null) {
            assertDate(value, message);
        }

        return value;

    }

    /**
     *
     * @param {Function} constructor
     * @param {*} value
     * @param {string} [message]
     * @returns {*}
     */
    function assertInstance(constructor, value, message) {

        assertFunction(constructor, 'Parameter "constructor" must be a function: ' + dump(constructor));

        if (!(value instanceof constructor)) {
            message = ensureString(message).trim() || 'Value is not an instance of the required type: ' + dump(value);
            throw new TypeError(message);
        }

        return value;

    }

    /**
     *
     * @param {Function} constructor
     * @param {*} value
     * @param {string} [message]
     * @returns {?*}
     */
    function assertNullableInstance(constructor, value, message) {

        if (value != null) {
            return assertInstance(constructor, value, message);
        }

        return value;

    }

    /**
     *
     * @param {Enum} enumType
     * @param {*} value
     * @param {string} [message]
     * @returns {*}
     */
    function assertEnum(enumType, value, message) {

        assertInstance(jsx.Enum, enumType, 'Parameter "enumType" must an Enum: ' + dump(enumType));

        if (!enumType.is(value)) {
            message = ensureString(message).trim() || 'Value is a valid value for the Enum: ' + dump(value);
            throw new TypeError(message);
        }

        return value;

    }

    /**
     *
     * @param {Enum} enumType
     * @param {*} value
     * @param {String} [message]
     * @returns {?*}
     */
    function assertNullableEnum(enumType, value, message) {

        if (value != null) {
            return assertEnum(enumType, value, message);
        }

        return value;

    }



    jsx.asserts = {
        assertString: assertString,
        assertStringLength: assertStringLength,
        assertStringTrimmedLength: assertStringTrimmedLength,
        assertNumber: assertNumber,
        assertFloat: assertFloat,
        assertInteger: assertInteger,
        assertParsableInteger : assertParsableInteger,
        assertParsableNumber : assertParsableNumber,
        assertRange: assertRange,
        assertBoolean: assertBoolean,
        assertTrue: assertTrue,
        assertFalse: assertFalse,
        assertTruthy: assertTruthy,
        assertFalsy: assertFalsy,
        assertEqual: assertEqual,
        assertExactlyEqual: assertExactlyEqual,
        assertFunction: assertFunction,
        assertArray: assertArray,
        assertNonEmptyArray: assertNonEmptyArray,
        assertEqualOption: assertEqualOption,
        assertExactlyEqualOption: assertExactlyEqualOption,
        assertObject: assertObject,
        assertPojo: assertPojo,
        assertDefined: assertDefined,
        assertDate: assertDate,
        assertNullableDate: assertNullableDate,
        assertInstance: assertInstance,
        assertNullableInstance: assertNullableInstance,
        assertEnum: assertEnum,
        assertNullableEnum: assertNullableEnum
    };

})(this, jsx);
