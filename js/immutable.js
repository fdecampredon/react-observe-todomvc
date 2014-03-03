/*jshint node:true*/
var Immutable = (function (){
    'use strict';

    var arrProto = Array.prototype,
        slice = Function.call.bind(arrProto.slice);

    if (typeof setImmediate === 'undefined') {
        var setImmediate = setTimeout;
    }

    function assign(target) {
        var rest = slice(arguments, 1);
        rest.forEach(function (object) {
            Object.keys(object).reduce(function(target, key) {
                target[key] = object[key];
                return target;
            }, target);       
        });
        return target;
    }

    function defineProperties(target, properties) {
        return Object.defineProperties(target,
           Object.keys(properties).reduce(function (propertiesDesc, key) {
                propertiesDesc[key] = {
                    value : properties[key], 
                    configurable: true, 
                    writable: true
                };
                return propertiesDesc;
            }, {}));
    }

    function createImmutable(target, parent, parentField) {
        return finalizeImmutable(prepareImmutable(target), parent, parentField);
    }


    function prepareImmutable(target) {
        var result;
        if (Array.isArray(target)) {
            result = createImmutableArray();
            assign(result, target.map(function (target, index) {
                return createImmutable(target, result, index);
            }));
        } else if (typeof target === 'object') {
            var prototype = Object.getPrototypeOf(target);
            result = Object.keys(target).reduce(function(result, key) {
                var value = target[key];
                if (typeof value === 'object') {
                    value = createImmutable(value, target, key);
                }
                result[key] = value;
                return result;
            }, Object.create(prototype, { update: { value: update }}));     

            if (prototype && prototype.constructor) {
                prototype.constructor.call(result);
            }

        } else {
            throw new TypeError('target accept an object or a function as prototype, given :' + target);
        }
        return result;
    }

    function finalizeImmutable(target, parent, parentField) {
        Object.defineProperty(target, '_parent', {value: parent});
        Object.defineProperty(target, '_parentField', {value: parentField});
        Object.freeze(target);
        return target;
    }


    function update(updates) {
        var isArr = Array.isArray(this);
        if (typeof updates === 'function') {
            var copy = isArr ? this.slice() : Object.create(copy);
            updates = updates(copy);

            if (typeof updates === 'undefined') {
                updates = copy;
            } else {
                if (isArr)  {
                    if (!Array.isArray(updates)) {
                        throw new TypeError('the function passed to update should return an array, return value obtained :' + updates);
                    }
                }
                else if (typeof updates !== 'object') {
                    throw new TypeError('the function passed to update should return an object, return value obtained :' + updates);
                }
            }
        } else {
            if (isArr)  {
                if (!Array.isArray(updates)) {
                    throw new TypeError('update accept an array or a function as parameter, given :' + updates);
                }
            }
            else if (typeof updates !== 'object') {
                throw new TypeError('update accept an object or a function as parameter, given :' + updates);
            }
        }


        var parent = this._parent,
            parentField = this._parentField,
            result = isArr? updates : assign(Object.create(Object.getPrototypeOf(this)), this, updates);

        result = prepareImmutable(result);

        return finalizeImmutable(result, parent.update(function (parent) {
            parent[parentField] = result;
        }), parentField);
    }


    function createImmutableArray() {
        return defineProperties([], {
            reverse: function reverse() {
                return this.slice().reverse();
            },

            splice: function splice() {
                var args = slice(arguments),
                    returnValue;
                this.update(function (array) {
                    returnValue = arrProto.splice.apply(array, args);
                });
                return returnValue;
            },

            sort: function sort(sortFunc) {
                return this.slice().sort(sortFunc);
            },

            push: function push() {
                var args = slice(arguments),
                    returnValue;
                this.update(function (array) {
                    returnValue = arrProto.push.apply(array, args);
                });
                return returnValue;
            },
            
            pop: function pop() {
                var args = slice(arguments),
                    returnValue;
                return this.update(function (array) {
                    returnValue = array.pop();
                });
                return returnValue;
            },
            
            
            remove: function remove(item) {
                return this.update(function (array) {
                    var index = array.indexOf(item);
                    if (index !== -1) {
                        array.splice(index, 1);
                    }
                });
            },

            shift: function shift() {
                var args = slice(arguments),
                    returnValue;
                this.update(function (array) {
                    returnValue = array.shift();
                });
                return returnValue;
            },

            unshift: function shift() {
                var args = slice(arguments),
                    returnValue;
                this.update(function (array) {
                    returnValue = arrProto.unshift.apply(array, args);
                });
                return returnValue;
            },

           
            update: update
        });
    }


    function Immutable(data) {
        var self = this;
        this._data = createImmutable(data, {
            get data() {},
            set data(value) {
                self._data = value;
                setImmediate(function () {
                    self.notifyChange();
                });
            },
            update: function(func) {
                func(this);
                return this;
            }
        }, 'data');
        this._changeListeners = [];
    }

    Immutable.prototype = {
        constructor: Immutable,
        get data() {
            return this._data;
        },

        addChangeListener: function (callback) {
            if (typeof callback !== 'function') {
                throw new TypeError('callback must be a function, given :' + callback);
            }
            this._changeListeners.push(callback);
        },

        removeChangeListener: function (callback) {
            if (typeof callback !== 'function') {
                throw new TypeError('callback must be a function, given :' + callback);
            }
            this._changeListeners = this._changeListeners.filter(function (listener) {
                return listener === callback;
            });
        },

        notifyChange: function (func) {
            this._changeListeners.forEach(function (listener) {
                listener();
            });
        }
    };
    
    
    return Immutable;

})();