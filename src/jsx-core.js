//noinspection ThisExpressionReferencesGlobalObjectJS
(function(global, undefined) {
    "use strict";

    /**
     * A function that returns its parameter
     *
     * @param {*} value
     * @returns {*}
     */
    function idFunction(value) {

        return value;

    }

    /**
     *
     * @param {Arguments} argumentsObject
     * @returns {Array}
     */
    function argsToArray(argumentsObject) {

        return [].slice.call(argumentsObject, 0);

    }

    /**
     * Estende uma classe (construtor).
     *
     * @param {Function} sub Subclasse
     * @param {Function} base Superclasse
     * @param {Object} [prototype] Protótipo da subclasse
     * @param {Object} [staticMembers] Membros estáticos
     * @return {Function} Referência à subclasse, por conveniência
     */
    function extendCosntructor(sub, base, prototype, staticMembers) {

        var name;

        // Herdando membros estáticos
        for (name in base) {
            if (base.hasOwnProperty(name) && !(name in sub)) {
                sub[name] = base[name];
            }
        }

        // Sobrescrevendo membros estáticos
        for (name in staticMembers) {
            if (staticMembers.hasOwnProperty(name)) {
                sub[name] = staticMembers[name];
            }
        }

        // Herdando membros de instância
        function __() {
            try {
                Object.defineProperty(this, 'constructor', {
                    enumerable: false,
                    writable: true,
                    configurable: true
                });
            } finally {
                this.constructor = sub;
            }
        }
        __.prototype = base.prototype;
        sub.prototype = new __();

        // Sobrescrevendo membros de instância
        for (name in prototype) {
            if (prototype.hasOwnProperty(name)) {
                sub.prototype[name] = prototype[name];
            }
        }

        return sub;

    }


    /**
     * Adiciona caracteres à esquerda.
     *
     * @param {String} str
     * @param character
     * @param {Number} length
     * @returns {string}
     */
    function padLeft(str, character, length) {

        character = ensureString(character);
        str = ensureString(str);

        while (str.length < length) {
            str = character + str;
        }

        return str;

    }

    /**
     * Garante que um valor será sempre string.
     *
     * Se for null ou undefined, retornará uma string vazia.
     * Se for qualquer outra coisa, faz typecast para string.
     *
     * @param {*} valor
     * @returns {string}
     */
    function ensureString(valor) {

        return valor == null ? '' : '' + valor;

    }

    /**
     *
     * @param {string} text
     * @param {*} map
     * @param {string} [keyMask]
     * @returns {string}
     */
    function interpolateMap(text, map, keyMask) {

        var re,
            name;

        text = ensureString(text);
        keyMask = ensureString(keyMask);
        keyMask = keyMask || '\\{key\\}';

        for (name in map) {
            if (map.hasOwnProperty(name)) {
                re = new RegExp(keyMask.replace('key', name), "gm");
                text = text.replace(re, ensureString(map[name]));
            }
        }

        return text;
    }

    /**
     *
     * @param text
     * @param {...*} values
     * @returns {string}
     */
    function interpolate(text, values) {

        text = ensureString(text);

        var re,
            i = 1,
            len = arguments.length;
        for (; i < len; i++) {
            re = new RegExp('\\{' + (i - 1) + '\\}', "gm");
            text = text.replace(re, ensureString(arguments[i]));
        }

        return text;

    }

    /**
     *
     * @param {string} text
     * @param {RegExp} [stopwordsPattern]
     * @returns {string}
     */
    function toTitleCase(text, stopwordsPattern) {

        // a-Z, com/sem acentos (apenas os caracteres que tem correspondentes com/sem case)
        //[a-zA-Z\u00C0-\u00CF\u00D1-\u00DC\u00E0-\u00EF\u00F1-\u00FC]

        // A-Z
        // [A-Z\u00C0-\u00CF\u00D1-\u00DC]

        var _stopwordsPattern = stopwordsPattern == null ? toTitleCase.PORTUGUESE_STOPWORDS_PATTERN : stopwordsPattern;

        if (!(_stopwordsPattern instanceof RegExp)) {
            throw new Error('toTitleCase(): stopwordsPattern argument, if provided, must be a RegExp.');
        }

        text = ensureString(text);

        return text.replace(/([0-9a-zA-Z\u00C0-\u00CF\u00D1-\u00DC\u00E0-\u00EF\u00F1-\u00FC]+[^\s-]*) */g, function (e, n, r, i) {
            return r > 0 && r + n.length !== i.length && n.search(_stopwordsPattern) > -1 && i.charAt(r - 2) !== ":" && i.charAt(r - 1).search(/[^\s-]/) < 0 ? e.toLowerCase() : n.substr(1).search(/[A-Z\u00C0-\u00CF\u00D1-\u00DC]|\../) > -1 ? e : e.charAt(0).toUpperCase() + e.substr(1);
        });

    }
    toTitleCase.PORTUGUESE_STOPWORDS_PATTERN = /^(e|ou|[dn]?[ao](?:s|\(s\))?|[dn][ao]s?\([ao]s?\)|n?um(?:as?|a\(s?\)|\(as?\))?|em|de|para|por|pel[ao](?:s|\(s\))?|mas|etc|se(?:n(?:a|ã)o)?|como?|vs?\.?|via|n[º\.]|que|seja)$/i;

    /**
     *
     * @param {string} text
     * @returns {string}
     */
    var removeDiacritics = (function(){

        var diacritics = [
            [/[\u00C0-\u00C6]/g, 'A'],  //[/[\300-\306]/g, 'A'],
            [/[\u00E0-\u00E6]/g, 'a'],  //[/[\340-\346]/g, 'a'],
            [/[\u00C8-\u00CB]/g, 'E'],  //[/[\310-\313]/g, 'E'],
            [/[\u00E8-\u00EB]/g, 'e'],  //[/[\350-\353]/g, 'e'],
            [/[\u00CC-\u00CF]/g, 'I'],  //[/[\314-\317]/g, 'I'],
            [/[\u00EC-\u00EF]/g, 'i'],  //[/[\354-\357]/g, 'i'],
            [/[\u00D2-\u00D8]/g, 'O'],  //[/[\322-\330]/g, 'O'],
            [/[\u00F2-\u00F8]/g, 'o'],  //[/[\362-\370]/g, 'o'],
            [/[\u00D9-\u00DC]/g, 'U'],  //[/[\331-\334]/g, 'U'],
            [/[\u00F9-\u00FC]/g, 'u'],  //[/[\371-\374]/g, 'u'],
            [/[\u00D1]/g, 'N'],         //[/[\321]/g, 'N'],
            [/[\u00F1]/g, 'n'],         //[/[\361]/g, 'n'],
            [/[\u00C7]/g, 'C'],         //[/[\307]/g, 'C'],
            [/[\u00E7]/g, 'c'],         //[/[\347]/g, 'c'],
            [/[\u00FF]/g, 'y']          //[/[\377]/g, 'y']
        ];

        /**
         *
         * @param {string} text
         * @returns {string}
         */
        return function(text) {

            var i;

            text = ensureString(text);

            for (i = 0; i < diacritics.length; i++) {
                text = text.replace(diacritics[i][0], diacritics[i][1]);
            }

            return text;

        }

    })();


    /**
     * @type {function}
     * @param {*} value
     * @return {string}
     */
    var getType = (function() {

        var re = /\[object (.+)\]/;

        /**
         *
         * @private
         * @param {*} object
         * @returns {?string}
         */
        function getObjectConstructor(object) {

            var type = Object.prototype.toString.call(object),
                match = re.exec(type);

            return match === null ? null : match[1];

        }

        /**
         * @type {function}
         * @param {*} value
         * @return {string}
         */
        function getType(value) {

            var type = typeof value;

            switch (type) {
                case 'number':
                    if (isNaN(value)) {
                        return 'NaN'
                    }
                    break;

                case 'object':
                    if (value === null) {
                        return 'null'
                    }
                    else if (value.constructor === Object) {
                        return type;
                    }
                    else if (isFunction(value.constructor) && value.constructor.hasOwnProperty('name') && isString(value.constructor.name)) {
                        return value.constructor.name;
                    }

                    return getObjectConstructor(value);
                    break;
            }

            return type;

        }

        return getType;

    })();

    /**
     *
     * @param {*} value
     * @returns {string}
     */
    function dumpWithType(value) {

        return interpolate('{0} >>>{1}<<<', getType(value), value);

    }

    /**
     *
     * @param {*} value
     * @returns {boolean}
     */
    function isString(value) {

        return typeof value == 'string' || (value !== null && value instanceof String);

    }

    /**
     *
     * @param {*} value
     * @returns {boolean}
     */
    function isNumber(value) {

        return (value != null) && (typeof value == 'number' || value instanceof Number) && !isNaN(value) && isFinite(value);

    }

    /**
     *
     * @param {*} value
     * @returns {boolean}
     */
    function isInteger(value) {

        return isNumber(value) && (parseInt(value, 10) + '') === (value + '');

    }

    /**
     *
     * @param {*} value
     * @returns {boolean}
     */
    function isFloat(value) {

        return isNumber(value) && !isInteger(value);

    }

    /**
     *
     * @param {*} value
     * @param {string} [message]
     * @returns {*}
     */
    function assertParsableInteger(value, message) {

        var integer = parseInt(value, 10);

        if (!isNumber(integer) || String(integer) !== String(value)) {
            message = ensureString(message).trim() || 'Value is no parsable to integer or would loose precision: ' + dumpWithType(value);
            throw new IllegalTypeException(message);
        }

        return value;

    }

    /**
     *
     * @param {*} value
     * @returns {boolean}
     */
    function isParsableNumber(value) {

        var number = parseFloat(value);

        return isNumber(number) && (number === Number(value));

    }

    /**
     *
     * @param {*} value
     * @returns {boolean}
     */
    function isParsableInteger(value) {

        var number = parseInt(value, 10);

        return isInteger(number) && (number === Number(value));

    }

    /**
     *
     * @param {*} value
     * @returns {boolean}
     */
    function isParsableFloat(value) {

        var number = parseFloat(value);

        return isFloat(number) && (number === Number(value));

    }

    /**
     *
     * @param {*} value
     * @returns {boolean}
     */
    function isBoolean(value) {

        return typeof value == 'boolean' || (value != null && value instanceof Boolean);

    }

    /**
     *
     * @param {*} value
     * @returns {boolean}
     */
    function isFunction(value) {

        return typeof value == 'function';

    }

    /**
     *
     * @param {*} value
     * @returns {boolean}
     */
    function isArray(value) {

        return Array.isArray ? Array.isArray(value) : value && value instanceof Array;

    }

    /**
     *
     * @param {*} value
     * @returns {boolean}
     */
    function isObject(value) {

        return value && typeof value == 'object';

    }

    /**
     *
     * @param {*} value
     * @returns {boolean}
     */
    function isPojo(value) {

        return isObject(value) && value.constructor === {}.constructor;

    }

    /**
     * @type {Function}
     */
    var isPrimitive = (function() {

        var _primitivesRe = /^(string|number|boolean)$/;

        /**
         *
         * @param {*} value
         * @returns {boolean}
         */
        function isPrimitive(value) {

            return _primitivesRe.test(typeof value);

        }

        return isPrimitive;

    })();

    /**
     *
     * @param {...Function} funcs
     * @returns {Function}
     */
    function compose(funcs) {
        var fns = arguments;

        return function(arg){
            var n = fns.length;

            while (n--) {
                arg = fns[n].call(this, arg);
            }

            return arg;
        };
    }

    /**
     * @type {Function}
     */
    var clone = (function() {

        var _reMatcher = /\/(.*)\/([^\/]*)/;

        function _cloneStringObject(value) {

            var other = new String(value.valueOf());

            var key;
            for (key in value) {
                if (value.hasOwnProperty(key) && !other.hasOwnProperty(key)) {
                    other[key] = clone(value[key]);
                }
            }

            return other;

        }

        function _cloneArray(value) {

            var other = [];

            var i = 0, len = value.length;
            for (; i < len; i++) {
                other[i] = clone(value[i]);
            }

            var key;
            for (key in value) {
                if (value.hasOwnProperty(key) && !other.hasOwnProperty(key)) {
                    other[key] = clone(value[key]);
                }
            }

            return other;
        }

        /**
         *
         * @param {*} value
         * @returns {*}
         */
        function clone(value) {

            var other,
                aux;

            if (value == null || isPrimitive(value) || isFunction(value)) {
                return value;
            }
            else if (isFunction(value.clone)) {
                return value.clone();
            }
            else if (isArray(value)) {
                return _cloneArray(value);
            }
            else if (value instanceof String) {
                return _cloneStringObject(value);
            }
            else {
                if (value instanceof Date) {
                    other = new Date(value.getTime());
                }
                else if (value instanceof RegExp) {
                    aux = _reMatcher.exec(value);
                    other = new RegExp(aux[1], aux[2]);
                }
                else if (isPojo(value)) {
                    other = {};
                }
                else if (value instanceof Number) {
                    other = new Number(value.valueOf());
                }
                else if (value instanceof Boolean) {
                    other = new Boolean(value.valueOf());
                }
                else {
                    other = Object.create(value.constructor.prototype);
                }

                var key, desc, mode, setter, getter, args;
                for (key in value) {
                    if (value.hasOwnProperty(key)) {
                        args = [other, key];

                        desc = Object.getOwnPropertyDescriptor(value, key);
                        mode = 'c';
                        desc.hasOwnProperty('writable') && (mode += 'w');
                        desc.enumerable && (mode += 'e');
                        args.push(mode);

                        setter = desc.set ? (desc.set.hasOwnProperty('__setter__') ? desc.set.__setter__ : desc.set) : undefined;
                        setter && args.push(setter);

                        getter = desc.get ? (desc.get.hasOwnProperty('__getter__') ? desc.get.__getter__ : desc.get) : undefined;
                        getter && args.push(getter);

                        other[key] = clone(value[key]);
                        defineProperty.apply(null, args);
                    }
                }

                return other;

            }

        }

        return clone;

    })();

    /**
     * @param {Object} object
     * @param {boolean} [recursive=false]
     * @return {Object}
     */
    function freeze(object, recursive) {

        var name,
            value;

        for (name in object) {
            if (object.hasOwnProperty(name)) {
                value = object[name];

                if (recursive && jsx.isPojo(value)) {
                    freeze(value, recursive);
                }

            }
        }

        Object.freeze(object);
        return object;

    }

    /**
     * @param {Object} object
     * @param {boolean} [recursive=false]
     * @return {Object}
     */
    function seal(object, recursive) {

        var name,
            value;

        for (name in object) {
            if (object.hasOwnProperty(name)) {
                value = object[name];

                if (recursive && jsx.isPojo(value)) {
                    seal(value, recursive);
                }

            }
        }

        Object.seal(object);
        return object;

    }

    /**
     * @type {Function}
     */
    var serialize = (function() {

        var _reMatcher = /\/(.*)\/([^\/]*)/;

        function _cloneStringObject(value) {

            var other = new String(value.valueOf());

            var key;
            for (key in value) {
                if (value.hasOwnProperty(key) && !other.hasOwnProperty(key)) {
                    other[key] = clone(value[key]);
                }
            }

            return other;

        }

        function preSerializeArray(originalArray) {

            var newArray = [],
                props = {},
                desc = {
                    type : 'Array',
                    value : newArray,
                    props : props
                },
                pre = {
                    __$__ : desc
                };

            var i = 0, len = originalArray.length;
            for (; i < len; i++) {
                newArray[i] = preSerialize(originalArray[i]);
            }

            var key;
            for (key in originalArray) {
                if (!newArray.hasOwnProperty(key)) {
                    props[key] = preSerialize(originalArray[key]);
                }
            }

            return pre;

        }

        /**
         *
         * @param {*} value
         * @returns {undefined|string}
         */
        function preSerialize(value) {

            var props = {},
                desc = {
                    type : 'Object',
                    value : {},
                    props : props
                },
                pre = {
                    __$__ : desc
                };

            if (value == null || isPrimitive(value) || isFunction(value)) {
                pre = value;
            }
            else if (isFunction(value.serialize)) {
                desc.type = getType(value);
                desc.value = value.serialize();
            }
            else if (isArray(value)) {
                pre = preSerializeArray(value);
            }
            else {

                if (value instanceof Date) {
                    desc.type = 'Date';
                    desc.value = value.getTime();
                }
                else if (value instanceof RegExp) {
                    desc.type = 'RegExp';
                    desc.value = String(value);
                }
                else if (isPojo(value)) {
                    desc.type = 'Object';
                    //desc.value = {};
                }
                else if (value instanceof String) {
                    desc.type = 'String';
                    desc.value = value.valueOf();
                }
                else if (value instanceof Number) {
                    desc.type = 'Number';
                    desc.value = value.valueOf();
                }
                else if (value instanceof Boolean) {
                    desc.type = 'Boolean';
                    desc.value = value.valueOf();
                }
                else {
                    desc.type = getType(value);
                }

                var key;
                for (key in value) {
                    if (!isFunction(value[key])) {
                        props[key] = preSerialize(value[key]);
                    }
                }

            }

            return pre;

        }

        return function serialize(value) {

            value = preSerialize(value);

            if (value == null || isPrimitive(value)) {
                return String(value);
            }
            else if (isFunction(value)) {
                return undefined;
            }

            return JSON.stringify(value);

        };

    })();

    var unserialize = (function() {

        var _reMatcher = /\/(.*)\/([^\/]*)/;

        function postUnserialize(parsed, constructors) {

            var aux,
                descriptor,
                item,
                constructor;

            if (constructors != null) {
                jsx.asserts.assertPojo(constructors);
            }

            constructors = constructors || {};

            if (!isObject(parsed)) {
                return parsed;
            }

            descriptor = parsed.__$__;

            switch (descriptor.type) {
                case 'Object':
                    item = descriptor.value;
                    break;
                case 'Array':
                    item = descriptor.value;
                    var i = 0, len = item.length;
                    for (; i < len; i++) {
                        item[i] = postUnserialize(item[i], constructors);
                    }
                    break;
                case 'Date':
                    item = new Date(descriptor.value);
                    break;
                case 'String':
                    item = new String(descriptor.value);
                    break;
                case 'Number':
                    item = new Number(descriptor.value);
                    break;
                case 'Boolean':
                    item = new Boolean(descriptor.value);
                    break;
                case 'RegExp':
                    aux = _reMatcher.exec(descriptor.value);
                    item = new RegExp(aux[1], aux[2]);
                    break;
                default:
                    constructor = (constructors[descriptor.type] !== undefined) ? constructors[descriptor.type] :
                        (window[descriptor.type] !== undefined) ? window[descriptor.type] : undefined;

                    jsx.asserts.assertFunction(constructor, 'Could not find constructor for type ' + descriptor.type);

                    if (isFunction(constructor.unserialize)) {
                        return constructor.unserialize(descriptor.value);
                    }

                    item = Object.create(constructor.prototype);
            }

            var propName;
            for (propName in descriptor.props) {
                if (descriptor.props.hasOwnProperty(propName)) {
                    item[propName] = postUnserialize(descriptor.props[propName], constructors);
                }
            }

            return item;

        }

        return function unserialize(value, constructors) {

            var parsed = JSON.parse(value);

            if (isObject(parsed)) {
                parsed = postUnserialize(parsed, constructors);
            }

            return parsed;
        }

    })();

    /**
     *
     * @type {Function}
     */
    var defineProperty = (function() {

        function _defineProperty(context, name, mode, setter, getter) {

            var value = context[name],
                descriptor = {
                    enumerable   : mode.indexOf('e') > -1,
                    configurable : mode.indexOf('c') > -1
                };

            if (setter) {
                descriptor.set = function(newValue) {
                    if (!Object.isFrozen(context)) {
                        value = setter(newValue);
                    }
                };
                descriptor.set.__setter__ = setter;
                descriptor.get = getter ? function() { return getter(value) } : function() { return value };
                descriptor.get.__getter__ = getter;
            }
            else {
                descriptor.writable = mode.indexOf('w') > -1;
            }

            Object.defineProperty(context, name, descriptor);
        }

        /**
         *
         * defineProperty(context, name, mode)
         * defineProperty(context, name, mode, setter)
         * defineProperty(context, name, mode, setter, getter)
         * defineProperty(context, name, setter)
         * defineProperty(context, name, setter, getter)
         */
        function defineProperty(context, name) {

            var defs = [].slice.call(arguments, 2),
                mode = 'we',
                setter,
                getter;

            //#ifndef BUILD
            var asserts = jsx.asserts;

            asserts.assertRange(arguments.length, 2, 5);

            if (defs.length == 1) {
                asserts.assertTrue(isString(defs[0]) || isFunction(defs[0]))
            }
            else if (defs.length == 2) {
                asserts.assertTrue(isString(defs[0]) || isFunction(defs[0]));
                asserts.assertFunction(defs[1]);
            }
            else if (defs.length == 3) {
                asserts.assertString(defs[0]);
                asserts.assertFunction(defs[1]);
                asserts.assertFunction(defs[2]);
            }
            //#endif

            if (!isObject(context)) {
                throw new jsx.exceptions.NullPointerException('defineProperty called on non-object');
            }

            if (isString(defs[0])) {
                mode = defs[0].toLowerCase();
                setter = defs[1];
                getter = defs[2];
            }
            else if (isFunction(defs[0])) {
                setter = defs[0];
                getter = defs[1];
            }

            _defineProperty(context, name, mode, setter, getter);

            // Comodidade para permitir encadeamento
            return this;

        }

        return defineProperty;

    })();

    /**
     *
     * @param context
     * @returns {Function}
     */
    function getDefiner(context) {

        return function() {
            return defineProperty.apply(null, [context].concat(jsx.argsToArray(arguments)));
        }

    }


    var Enum = (function() {

        /**
         * @param {...string} value
         * @constructor
         */
        function Enum(value){

            var i = 0,
                len = arguments.length;
            for (; i < len; i++) {
                value = String(arguments[i]);
                this[value] = value;
                defineProperty(this, value, 'e');
            }

            seal(this, true);

        }

        /**
         *
         * @returns {string}
         */
        Enum.prototype.toString = function() {

            return '[object Enum]';

        };

        /**
         *
         * @returns {Array.<string>}
         */
        Enum.prototype.toArray = function() {

            var result = [];

            var key;
            for (key in this) {
                if (this.hasOwnProperty(key)) {
                    result.push(key);
                }
            }

            return result;

        };

        Enum.prototype.is = function(value){

            return this.hasOwnProperty(value);

        };

        return Enum;

    })();


    global.jsx = {
        Enum : Enum,
        extendCosntructor : extendCosntructor,

        idFunction : idFunction,

        clone : clone,
        argsToArray : argsToArray,
        padLeft : padLeft,
        ensureString : ensureString,
        toTitleCase : toTitleCase,
        removeDiacritics : removeDiacritics,
        interpolate: interpolate,
        interpolateMap: interpolateMap,
        dumpWithType : dumpWithType,
        getType : getType,
        compose : compose,

        isPojo : isPojo,

        isPrimitive : isPrimitive,
        isString : isString,
        isNumber : isNumber,
        isParsableNumber : isParsableNumber,
        isInteger : isInteger,
        isParsableInteger : isParsableInteger,
        isFloat : isFloat,
        isParsableFloat : isParsableFloat,
        isBoolean : isBoolean,
        isFunction : isFunction,
        isArray : isArray,
        isObject : isObject,

        seal : seal,
        freeze : freeze,

        getDefiner : getDefiner,
        defineProperty : defineProperty,

        serialize : serialize,
        unserialize : unserialize
    };

})(this);
