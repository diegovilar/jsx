(function(global, jsx, exceptions, asserts, undefined) {
    "use strict";

    var ensureString = jsx.ensureString,
        toTitleCase = jsx.toTitleCase;



    function toString(value) {
        return ensureString(value);
    }

    function toTrimmedString(value) {
        return toString(value).trim();
    }

    function toLowerCaseString(value) {
        return toString(value).toLowerCase();
    }

    function toUpperCaseString(value) {
        return toString(value).toUpperCase();
    }

    function toTitleCaseString(value) {
        return toTitleCase(toLowerCaseString(value));
    }

    function toTrimmedLowerCaseString(value) {
        return toLowerCaseString(value).trim();
    }

    function toTrimmedUpperCaseString(value) {
        return toUpperCaseString(value).trim();
    }

    function toTrimmedTitleCaseString(value) {
        return toTitleCaseString(value).trim();
    }

    function toInteger(value) {
        return parseInt(value, 10) || 0;
    }

    function toFloat(value) {
        return parseFloat(value) || 0;
    }

    function toBoolean(value) {
        if (value == null || value === false) {
            return false;
        }
        else if (typeof value == 'string') {
            value = value.trim().toLowerCase();
            switch (value) {
                case 's':
                case 'y':
                case 'v':
                case 'sim':
                case 'yes':
                case 'true':
                case 'verdadeiro':
                    return true;
                    break;
                case 'n':
                case 'f':
                case 'nao':
                case 'não':
                case 'no':
                case 'false':
                case 'falso':
                case 'null':
                case 'nulo':
                    return false;
                    break;
                default:
                    return !!value;
            }
        }
        else {
            return !!value;
        }
    }

    function toJson(value) {
        return JSON.stringify(value);
    }

    var toSafeInteger = jsx.compose(toInteger, asserts.assertParsableInteger);
    var toSafeFloat = jsx.compose(toFloat, asserts.assertParsableNumber);



    jsx.converters = {
        toString : toString,
        toTrimmedString : toTrimmedString,
        toLowerCaseString : toLowerCaseString,
        toUpperCaseString : toUpperCaseString,
        toTitleCaseString : toTitleCaseString,
        toTrimmedLowerCaseString : toTrimmedLowerCaseString,
        toTrimmedUpperCaseString : toTrimmedUpperCaseString,
        toTrimmedTitleCaseString : toTrimmedTitleCaseString,
        toInteger : toInteger,
        toSafeInteger : toSafeInteger,
        toFloat : toFloat,
        toSafeFloat : toSafeFloat,
        toBoolean : toBoolean,
        toJson : toJson
    };

})(this, jsx, jsx.exceptions, jsx.asserts);
