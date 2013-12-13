describe('extendConstructor', function () {
    "use strict";

    var undefined,
        extendConstructor = jsx.extendConstructor,
        Base,
        Sub,
        Super;

    function callerForParams() {
        var args = [].slice.call(arguments, 0);

        return function() {
            return extendConstructor.apply(null, args);
        }
    }

    beforeEach(function () {

        Base = function Base(){};
        Super = function Super(){};
        Sub = function Sub(){};

    });

    it('should throw an error if less than 2 or more than 4 parameters are passed', function () {

        expect(callerForParams()).toThrow();
        expect(callerForParams(Sub)).toThrow();
        expect(callerForParams(Sub, Super)).not.toThrow();
        expect(callerForParams(Sub, Super, {})).not.toThrow();
        expect(callerForParams(Sub, Super, {}, {})).not.toThrow();
        expect(callerForParams(Sub, Super, {}, {}, {})).toThrow();

    });

    it('should only accept function for the first argument', function () {

        expect(callerForParams(Sub, Super)).not.toThrow();

        expect(callerForParams(undefined, Super)).toThrow();
        expect(callerForParams(null, Super)).toThrow();
        expect(callerForParams(1, Super)).toThrow();
        expect(callerForParams(false, Super)).toThrow();
        expect(callerForParams({}, Super)).toThrow();
        expect(callerForParams([], Super)).toThrow();

    });

    it('should only accept function/undefined/null for the second argument', function () {

        expect(callerForParams(Sub, undefined)).not.toThrow();
        expect(callerForParams(Sub, null)).not.toThrow();
        expect(callerForParams(Sub, Super)).not.toThrow();

        expect(callerForParams(Sub, 1)).toThrow();
        expect(callerForParams(Sub, false)).toThrow();
        expect(callerForParams(Sub, '')).toThrow();
        expect(callerForParams(Sub, {})).toThrow();
        expect(callerForParams(Sub, [])).toThrow();

    });

    it('should only accept object/null/undefined for the third parameter', function () {

        expect(callerForParams(Sub, null, undefined)).not.toThrow();
        expect(callerForParams(Sub, null, null)).not.toThrow();
        expect(callerForParams(Sub, null, {})).not.toThrow();
        expect(callerForParams(Sub, null, new Error())).not.toThrow();

        expect(callerForParams(Sub, null, 1)).toThrow();
        expect(callerForParams(Sub, null, true)).toThrow();
        expect(callerForParams(Sub, null, '')).toThrow();
        expect(callerForParams(Sub, null, function(){})).toThrow();

    });

    it('should only accept object/null/undefined for the fourth parameter', function () {

        expect(callerForParams(Sub, null, null, undefined)).not.toThrow();
        expect(callerForParams(Sub, null, null, null)).not.toThrow();
        expect(callerForParams(Sub, null, null, {})).not.toThrow();
        expect(callerForParams(Sub, null, null, new Error())).not.toThrow();

        expect(callerForParams(Sub, null, null, 1)).toThrow();
        expect(callerForParams(Sub, null, null, true)).toThrow();
        expect(callerForParams(Sub, null, null, '')).toThrow();
        expect(callerForParams(Sub, null, null, function(){})).toThrow();

    });

    describe('(inheritance)', function () {

        var a,
            b,
            c;

        beforeEach(function () {

            Base = function Base(){};
            Base.prop = 'Base.prop';
            Base.method = function(){ return 'Base.method' };
            Base.baseProp = 'Base.baseProp';
            Base.baseMethod = function(){ return 'Base.baseMethod' };
            Base.prototype.prop = 'Base.prototype.prop';
            Base.prototype.method = function(){ return 'Base.prototype.method' };
            Base.prototype.baseProp = 'Base.prototype.baseProp';
            Base.prototype.baseMethod = function() { return 'Base.prototype.baseMethod' };

            Super = function Super(){};
            extendConstructor(Super, Base, {
                prop : 'Super.prototype.prop',
                method : function(){ return 'Super.prototype.method' }
            }, {
                prop : 'Super.prop',
                method : function(){ return 'Super.method' }
            });
            Super.superProp = 'Super.superProp';
            Super.superMethod = function(){ return 'Super.superMethod' };
            Super.prototype.superProp = 'Super.prototype.superProp';
            Super.prototype.superMethod = function() { return 'Super.prototype.superMethod' };

            Sub = function Sub(){};
            extendConstructor(Sub, Super, {
                prop : 'Sub.prototype.prop',
                method : function(){ return 'Sub.prototype.method' }
            }, {
                prop : 'Sub.prop',
                method : function(){ return 'Sub.method' }
            });
            Sub.subProp = 'Sub.subProp';
            Sub.subMethod = function(){ return 'Sub.subMethod' };
            Sub.prototype.subProp = 'Sub.prototype.subProp';
            Sub.prototype.subMethod = function() { return 'Sub.prototype.subMethod' };

            a = new Base();
            b = new Super();
            c = new Sub();

        });

        it('should be instanceof compatible', function () {

            expect(a instanceof Base).toBe(true);
            expect(b instanceof Base).toBe(true);
            expect(c instanceof Base).toBe(true);

            expect(b instanceof Super).toBe(true);
            expect(c instanceof Super).toBe(true);

            expect(c instanceof Sub).toBe(true);

        });

        it('should not change the parent constructor in any way', function () {

            expect(Base.prop).toEqual('Base.prop');
            expect(Base.baseProp).toEqual('Base.baseProp');
            expect(Base.method()).toEqual('Base.method');
            expect(Base.baseMethod()).toEqual('Base.baseMethod');
            expect(Base.prototype.prop).toEqual('Base.prototype.prop');
            expect(Base.prototype.baseProp).toEqual('Base.prototype.baseProp');
            expect(Base.prototype.method()).toEqual('Base.prototype.method');
            expect(Base.prototype.baseMethod()).toEqual('Base.prototype.baseMethod');

        });

        it('should inherit instance members', function () {

            expect(b.baseProp).toEqual('Base.prototype.baseProp');
            expect(b.baseMethod()).toEqual('Base.prototype.baseMethod');

            expect(c.baseProp).toEqual('Base.prototype.baseProp');
            expect(c.superProp).toEqual('Super.prototype.superProp');
            expect(c.baseMethod()).toEqual('Base.prototype.baseMethod');
            expect(c.superMethod()).toEqual('Super.prototype.superMethod');

        });

        it('should inherit static members', function () {

            expect(Base.baseProp).toEqual('Base.baseProp');
            expect(Base.baseMethod()).toEqual('Base.baseMethod');

            expect(Super.baseProp).toEqual('Base.baseProp');
            expect(Super.superProp).toEqual('Super.superProp');
            expect(Super.baseMethod()).toEqual('Base.baseMethod');
            expect(Super.superMethod()).toEqual('Super.superMethod');

        });

        it('should override instance members', function () {

            expect(b.prop).toEqual('Super.prototype.prop');
            expect(b.method()).toEqual('Super.prototype.method');
            expect(c.prop).toEqual('Sub.prototype.prop');
            expect(c.method()).toEqual('Sub.prototype.method');

        });

        it('should override static members', function () {

            expect(Super.prop).toEqual('Super.prop');
            expect(Super.method()).toEqual('Super.method');
            expect(Sub.prop).toEqual('Sub.prop');
            expect(Sub.method()).toEqual('Sub.method');

        });

    });

});
