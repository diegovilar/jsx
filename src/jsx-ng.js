(function(global, jsx) {
    "use strict";

    var argsToArray = utils.argsToArray;


    function createLazyModule() {

        var module = angular.module.apply(angular, argsToArray(arguments));

        module.config([

            '$provide',
            '$controllerProvider',
            '$compileProvider',
            '$filterProvider',
            '$animationProvider',

            function ($provide, $controllerProvider, $compileProvider, $filterProvider, $animationProvider) {

                // Externando métodos de $provide no módulo para lazyload
                ['constant', 'factory', 'provider', 'service', 'value'].forEach(function (method) {
                    module[method] = function () {
                        return $provide[method].apply($provide, argsToArray(arguments));
                    };
                });

                // Externando outros método para lazyload
                module.controller = function () {
                    return $controllerProvider.register.apply($controllerProvider, argsToArray(arguments));
                };
                module.directive = function () {
                    return $compileProvider.directive.apply($compileProvider, argsToArray(arguments));
                };
                module.filter = function () {
                    return $filterProvider.register.apply($filterProvider, argsToArray(arguments));
                };
                module.animation = function () {
                    return $animationProvider.register.apply($animationProvider, argsToArray(arguments));
                };

            }
        ]);

        return module;

    }



    /**
     * @type {Function}
     * @param {string} directive - The directive Javascript identifier
     */
    var directiveToAttribute = (function() {

        var directiveReplacePattern = /-(\w)/gi;

        function replace(match, letter) {
            return letter.toUpperCase();
        }

        return function(directive) {
            return directive.replace(directiveReplacePattern, replace);
        }

    })();




    var pinToScope = (function() {

        var pinners = {};

        function pinToScope(scope, subject, context) {

            var pinner = this.getPinner(scope);

            if (typeof subject == 'function') {
                return pinner(subject, context);
            }

            var key, member;
            for (key in subject) {
                //noinspection JSUnfilteredForInLoop
                member = subject[key];
                if (typeof member == 'function') {
                    //noinspection JSUnfilteredForInLoop
                    subject[key] = pinner(member, context || subject);
                }
            }

            return subject;

        }

        pinToScope.getPinner = function(scope) {

            var id = scope.$id,
                pinner = pinners[id];

            if (!pinner) {
                pinner = pinners[id] = function(subject, context) {
                    context = arguments.length < 2 ? null : context;
                    return function() {
                        if (pinners[id]) {
                            return subject.apply(context, argsToArray(arguments));
                        }
                    }
                };

                scope.$on('$destroy', function() {
                    delete pinners[id];
                });
            }

            return pinner;

        };

        return pinToScope;

    })();



    function isAngularInjectableFunction(value) {

        return jsx.isFunction(value) || (jsx.isArray(value) && value.length && jsx.isFunction(value[value.length-1]));

    }


    /**
     *
     * @param ngFormController
     */
    function triggerFormValidation(ngFormController) {

        var undefined,
            key,
            item;
        for (key in ngFormController) {
            //noinspection JSUnfilteredForInLoop
            item = ngFormController[key]; // unfiltered loop intencional (nasted forms)
            if (item.$setViewValue !== undefined) {
                item.$setViewValue(item.$modelValue);
            }
        }

    }


    jsx.ng = {
        createLazyModule : createLazyModule,
        directiveToAttribute : directiveToAttribute,
        pinToScope : pinToScope,
        isAngularInjectableFunction : isAngularInjectableFunction,
        triggerFormValidation : triggerFormValidation
    };

    /**
     * @deprecated
     */
    global.ngutils = jsx.ng;

})(window, window.jsx);
