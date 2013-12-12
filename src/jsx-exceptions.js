//noinspection ThisExpressionReferencesGlobalObjectJS
(function(global, jsx) {
    "use strict";

    // Imports
    var extendCosntructor = jsx.extendCosntructor,
        argsToArray       = jsx.argsToArray,
        ensureString      = jsx.ensureString;

    /**
     * @const
     * @type {boolean}
     */
    var IS_V8_ENGINE = encodeURI(navigator.javaEnabled.toString()) === 'function%20javaEnabled()%20%7B%20%5Bnative%20code%5D%20%7D';



    // Silenciosamente, padronizamos algumas propridades no protótipo de Error
    // para fazer com que os erros criados automaticamente pelo runtime se comportem semelhantemente
    // os nossos erros customizados
    /*try {
        Object.defineProperty(Error.prototype, 'name', {
            configurable: true,
            enumerable: true,
            writable: true
        });

        Object.defineProperty(Error.prototype, 'message', {
            value: '',
            configurable: true,
            enumerable: true,
            writable: true
        });
    } catch (e) {}*/

    function Exception(message) {
        try {
            Object.defineProperty(this, 'name', {
                configurable: true,
                enumerable: true,
                writable: true
            });

            Object.defineProperty(this, 'message', {
                configurable: true,
                enumerable: true,
                writable: true
            });
        } finally {
            this.name = 'Exception';
            this.message = arguments.length ? message : '';
        }

        // Só criamos stack se estivermos na V8
        // Au fazê-lo, nos excluímos do stack (https://code.google.com/p/v8/wiki/JavaScriptStackTraceApi)
        if (IS_V8_ENGINE) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
    extendCosntructor(Exception, Error);

    Exception.createFromCause = (function() {
        var createFromCause;

        return createFromCause = function(cause) {

            var instance = new this('' + cause);

            // Só tratamos do stack se estivermos na V8
            if (IS_V8_ENGINE) {
                Error.captureStackTrace(instance, createFromCause);

                // Juntamos os stack da causa e o do novo erro
                if ((cause instanceof Error) && cause.hasOwnProperty('stack')) {
                    instance.stack += '\n\ncaused by\n\n' + cause.stack;
                }
            }

            return instance;
        }
    })();



    function NullPointerException(message) {
        Exception.apply(this, argsToArray(arguments));
        this.name = 'NullPointerException';
    }
    extendCosntructor(NullPointerException, Exception);

    function IllegalTypeException(message) {
        Exception.apply(this, argsToArray(arguments));
        this.name = 'IllegalTypeException';
    }
    extendCosntructor(IllegalTypeException, Exception);

    function OutOfRangeException(message) {
        Exception.apply(this, argsToArray(arguments));
        this.name = 'OutOfRangeException';
    }
    extendCosntructor(OutOfRangeException, Exception);

    function IllegalStateException(message) {
        Exception.apply(this, argsToArray(arguments));
        this.name = 'IllegalStateException';
    }
    extendCosntructor(IllegalStateException, Exception);

    function IllegalArgumentException(message) {
        IllegalTypeException.apply(this, argsToArray(arguments));
        this.name = 'IllegalArgumentException';
    }
    extendCosntructor(IllegalArgumentException, IllegalTypeException);

    function NotEnoughArgumentsException(message) {
        Exception.apply(this, argsToArray(arguments));
        this.name = 'NotEnoughArgumentsException';
    }
    extendCosntructor(NotEnoughArgumentsException, Exception);



    function NotImplementedException(message) {
        Exception.apply(this, argsToArray(arguments));
        this.name = 'NotImplementedException';
    }
    extendCosntructor(NotImplementedException, Exception);



    function PrivateConstructorException(message) {
        Exception.apply(this, argsToArray(arguments));
        this.name = 'PrivateConstructorException';

        // FIXME nao ta funcionando?
        if (!this.message) {
            this.message = 'This constructor cannot be instantiated directly.';
        }
    }
    extendCosntructor(PrivateConstructorException, Exception);



    function TransformationException(message) {
        Exception.apply(this, argsToArray(arguments));
        this.name = 'TransformationException';
    }
    extendCosntructor(TransformationException, Exception);



    function IOException(message) {
        Exception.apply(this, argsToArray(arguments));
        this.name = 'IOException';
    }
    extendCosntructor(IOException, Exception);



    function NetworkException(message) {
        IOException.apply(this, argsToArray(arguments));
        this.name = 'NetworkException';
    }
    extendCosntructor(NetworkException, IOException);



    function HTTPException(message) {
        NetworkException.apply(this, argsToArray(arguments));
        this.name = 'HTTPException';
    }
    extendCosntructor(HTTPException, NetworkException);



    /**
     *
     * @param {number} statusCode
     * @param {string} [message]
     * @returns {HTTPException}
     */
    HTTPException.createFromHttpStatusCode = function(statusCode, message) {

        // TODO http://en.wikipedia.org/wiki/List_of_HTTP_status_codes#5xx_Server_Error

        var erro;

        message = ensureString(message).trim();

        switch (statusCode) {
            case 401:
                erro = new HTTPUnauthorizedException(message);
                break;

            case 403:
                erro = new HTTPForbiddenException(message);
                break;

            case 404:
                erro = new HTTPNotFoundException(message);
                break;

            case 500:
                erro = new HTTInternalServerException(message);
                break;

            case 502:
                erro = new HTTPBadGatewayException(message);
                break;

            case 503:
                erro = new HTTPServiceUnavailableException(message);
                break;

            default:
                erro = new HTTPException(message);
        }

        return erro;

    };



    // 401
    function HTTPUnauthorizedException(message) {
        HTTPException.apply(this, argsToArray(arguments));
        this.name = 'HTTPUnauthorizedException';
    }
    extendCosntructor(HTTPUnauthorizedException, HTTPException);



    // 403
    function HTTPForbiddenException(message) {
        HTTPException.apply(this, argsToArray(arguments));
        this.name = 'HTTPForbiddenException';
    }
    extendCosntructor(HTTPForbiddenException, HTTPException);



    // 404
    function HTTPNotFoundException(message) {
        HTTPException.apply(this, argsToArray(arguments));
        this.name = 'HTTPNotFoundException';
    }
    extendCosntructor(HTTPNotFoundException, HTTPException);



    // 500
    function HTTInternalServerException(message) {
        HTTPException.apply(this, argsToArray(arguments));
        this.name = 'HTTInternalServerException';
    }
    extendCosntructor(HTTInternalServerException, HTTPException);



    // 502
    function HTTPBadGatewayException(message) {
        HTTPException.apply(this, argsToArray(arguments));
        this.name = 'HTTPBadGatewayException';
    }
    extendCosntructor(HTTPBadGatewayException, HTTPException);



    // 503
    function HTTPServiceUnavailableException(message) {
        HTTPException.apply(this, argsToArray(arguments));
        this.name = 'HTTPServiceUnavailableException';
    }
    extendCosntructor(HTTPServiceUnavailableException, HTTPException);




    jsx.exceptions = {
        Exception : Exception,
        NullPointerException : NullPointerException,
        IllegalTypeException : IllegalTypeException,
        IllegalStateException : IllegalStateException,
        OutOfRangeException : OutOfRangeException,
        IllegalArgumentException : IllegalArgumentException,
        NotEnoughArgumentsException : NotEnoughArgumentsException,
        NotImplementedException : NotImplementedException,
        PrivateConstructorException : PrivateConstructorException,
        TransformationException : TransformationException,
        IOException : IOException,
        NetworkException : NetworkException,
        HTTPException : HTTPException,
        HTTPUnauthorizedException : HTTPUnauthorizedException,
        HTTPForbiddenException : HTTPForbiddenException,
        HTTPNotFoundException : HTTPNotFoundException,
        HTTPBadGatewayException : HTTPBadGatewayException,
        HTTPServiceUnavailableException : HTTPServiceUnavailableException
    };

    /**
     * @deprecated
     */
    global.exceptions = jsx.exceptions;

})(this, this.jsx);
