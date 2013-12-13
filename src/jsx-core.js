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



    var _primitivesRe = /^(string|number|boolean)$/;

    /**
     * Tests if the passed value is a primitive one.
     *
     * The following values are considered to be primitive:
     * * Primitive string values;
     * * Primitive boolean values;
     * * Primitive number values, excluding NaN, +Infinity and -Infinity
     *
     * @param {*} value
     * @returns {boolean}
     */
    function isPrimitive(value) {

        var type = typeof value;
        return _primitivesRe.test(type) && (type != 'number' || !isNaN(value) && isFinite(value));

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
    function isBoolean(value) {

        return typeof value == 'boolean' || (value != null && value instanceof Boolean);

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

        return isNumber(value) && parseInt(Number(value), 10) == value;

    }



    /**
     *
     * @param {*} value
     * @returns {boolean}
     */
    function isParsableNumber(value) {

        var strValue = String(value).trim(),
            number = Number(strValue);

        return (strValue.length > 0) && isNumber(number) && (number == value);

    }



    /**
     *
     * @param {*} value
     * @returns {boolean}
     */
    function isParsableInteger(value) {

        var number = Number(value);

        return isParsableNumber(value) && isInteger(number);

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

        return Array.isArray(value);

    }



    /**
     *
     * @param {*} value
     * @returns {boolean}
     */
    function isObject(value) {

        return (value != null) && typeof value == 'object';

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
     * @type {function}
     * @param {*} value
     * @return {string}
     */
    var getType = (function() {

        var reObjectName = /\[object (.+)\]/,
            toString = Object.prototype.toString,
            OBJECT = 'object';


        /**
         *
         * @private
         * @param {*} object
         * @returns {?string}
         */
        function getObjectConstructor(object) {

            var objectString = toString.call(object),
                match = reObjectName.exec(objectString);

            return match === null ? OBJECT : match[1] === 'Object' ? OBJECT : match[1];

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

                case OBJECT:
                    if (value === null) {
                        return 'null'
                    }
                    else if (value.constructor === Object) {
                        return type;
                    }
                    else if (isFunction(value.constructor) && value.constructor.hasOwnProperty('name')) {
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
     * @param {boolean} [toConsole=false]
     * @returns {string}
     */
    function dump(value, toConsole) {

        var text = '{' + getType(value) + '}<' + value + '>';

        if (toConsole && console) {
            isFunction(console.log) && console.log(text);
            isFunction(console.debug) && console.debug(value);
        }

        return text;

    }



    /**
     * Estende uma classe (construtor).
     *
     * @param {function} subConstructor Subclasse
     * @param {?function} [superConstructor] Superclasse
     * @param {?object} [instanceMembers] Protótipo da subclasse
     * @param {?object} [staticMembers] Membros estáticos
     * @return {function} Referência à subclasse, por conveniência
     */
    function extendConstructor(subConstructor, superConstructor, instanceMembers, staticMembers) {

        var name,
            asserts = jsx.asserts;

        //#ifndef BUILD
        asserts.assertRange(arguments.length, 2, 4);
        //#endif

        asserts.assertFunction(subConstructor);
        superConstructor != null && asserts.assertFunction(superConstructor);
        instanceMembers != null && asserts.assertObject(instanceMembers);
        staticMembers != null && asserts.assertObject(staticMembers);

        // Estamos estendendo um superConstrutor?
        if (superConstructor) {
            // Herdando membros estáticos
            for (name in superConstructor) {
                if (superConstructor.hasOwnProperty(name) && !(name in subConstructor)) {
                    subConstructor[name] = superConstructor[name];
                }
            }

            // Herdando membros de instância
            subConstructor.prototype = Object.create(superConstructor.prototype);
            subConstructor.prototype.constructor = subConstructor;
        }

        // Sobrescrevendo membros estáticos
        if (staticMembers) {
            for (name in staticMembers) {
                if (staticMembers.hasOwnProperty(name)) {
                    subConstructor[name] = staticMembers[name];
                }
            }
        }

        // Sobrescrevendo membros de instância
        if (instanceMembers) {
            for (name in instanceMembers) {
                if (instanceMembers.hasOwnProperty(name)) {
                    subConstructor.prototype[name] = instanceMembers[name];
                }
            }
        }

        return subConstructor;

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
     * @param {*} value
     * @param {string} [message]
     * @returns {*}
     */
    function assertParsableInteger(value, message) {

        var integer = parseInt(value, 10);

        if (!isNumber(integer) || String(integer) !== String(value)) {
            message = ensureString(message).trim() || 'Value is no parsable to integer or would loose precision: ' + dump(value);
            throw new IllegalTypeException(message);
        }

        return value;

    }









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

        if (recursive) {
            for (name in object) {
                if (object.hasOwnProperty(name)) {
                    value = object[name];

                    if (isObject(value)) {
                        freeze(value, true);
                    }

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

        if (recursive) {
            for (name in object) {
                if (object.hasOwnProperty(name)) {
                    value = object[name];

                    if (isObject(value)) {
                        seal(value, true);
                    }

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
        idFunction : idFunction,
        isPrimitive : isPrimitive,
        isString : isString,
        isBoolean : isBoolean,
        isNumber : isNumber,
        isInteger : isInteger,
        isParsableNumber : isParsableNumber,
        isParsableInteger : isParsableInteger,
        isFunction : isFunction,
        isArray : isArray,
        isObject : isObject,
        isPojo : isPojo,
        getType : getType,
        dump : dump,
        extendConstructor : extendConstructor,

        Enum : Enum,

        clone : clone,
        argsToArray : argsToArray,
        ensureString : ensureString,
        interpolate: interpolate,
        interpolateMap: interpolateMap,
        compose : compose,

        seal : seal,
        freeze : freeze,

        getDefiner : getDefiner,
        defineProperty : defineProperty,

        serialize : serialize,
        unserialize : unserialize
    };


})(window);
