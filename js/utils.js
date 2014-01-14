
/*jshint browser: true */
/* global ObserveUtils*/

var app = app || {};

(function (window) {
    'use strict';

    var List = ObserveUtils.List;
    
    function listObserve(list, handler) {
        function objectObserver(changes) {
            handler(changes);
        }
        
        function listObserver(changes) {
            changes.forEach(function (change) {
                if (change.type === 'splice') {
                    if (change.removed) {
                        change.removed.forEach(function (object) {
                            if (Object(object) === object) {
                                Object.unobserve(object, objectObserver);
                            }
                        });
                    }
                    if (change.addedCount > 0) {
                        var i, l = change.index + change.addedCount;
                        for (i = change.index; i < l; i++) {
                            var item = list[i];
                            if (Object(item) === item) {
                                Object.observe(item, objectObserver);
                            }
                        }
                    }
                } else if (change.type === 'update') {
                    if (Object(change.oldValue) === change.oldValue) {
                        Object.unobserve(change.oldValue, objectObserver);
                    }
                    if (Object(list[change.name]) === list[change.name]) {
                        Object.unobserve(list[change.name], objectObserver);
                    }
                }
            });
            handler(changes);
        }
        
        List.observe(list, listObserver);
        
        list.forEach(function (object) {
            if (Object(object) === object) {
                Object.observe(object, objectObserver);
            }
        });
        
        return {
            dispose: function () {
                list.forEach(function (object) {
                    if (Object(object) === object) {
                        Object.unobserve(object, objectObserver);
                    }
                });
                Object.unobserve(list, listObserver);
            }
        };
    }
    
    function shallowEqual(objA, objB) {
        if (objA === objB) {
            return true;
        }
        var key;
        // Test for A's keys different from B.
        for (key in objA) {
            if (objA.hasOwnProperty(key) &&
                (!objB.hasOwnProperty(key) || objA[key] !== objB[key])) {
                return false;
            }
        }
      // Test for B'a keys missing from A.
      for (key in objB) {
            if (objB.hasOwnProperty(key) && !objA.hasOwnProperty(key)) {
                return false;
            }
      }
      return true;
    }

    
    
    var Utils = app.Utils = {
        uuid: function () {
            /*jshint bitwise:false */
            var i, random;
            var uuid = '';

            for (i = 0; i < 32; i++) {
                random = Math.random() * 16 | 0;
                if (i === 8 || i === 12 || i === 16 || i === 20) {
                    uuid += '-';
                }
                uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
                    .toString(16);
            }

            return uuid;
        },

        pluralize: function (count, word) {
            return count === 1 ? word : word + 's';
        },

        store: function (namespace, data) {
            if (data) {
                return localStorage.setItem(namespace, JSON.stringify(data));
            }

            var store = localStorage.getItem(namespace);
            return (store && JSON.parse(store)) || [];
        },

        assign: function (target, source) {
            return Object.keys(source).reduce(function(target, key) {
                target[key] = source[key];
                return target;
            }, target);
        },
        
        observe: function (object, handler) {
            if (object instanceof List) {
                List.observe(object, handler);
            } else {
                Object.observe(object, handler);
            }
            return {
                dispose: function () {
                    Object.unobserve(object, handler);
                }
            };
        },
        
        deepObserve: function (object, handler) {
            if (object instanceof List) {
                return listObserve(object, handler);
            } else {
                Object.observe(object, handler);
                return {
                    dispose: function () {
                        Object.unboserve(object, handler);
                    }
                };
            }
        },
        ObserveMixin : {
            observeObjects: function () {
                var self = this;
                this.onObservedChange = function (changes) {
                    self.forceUpdate();
                };
                if (typeof this.getObserveds === 'function') {
                    this.observeds = this.getObserveds();
                    this.observers = this.getObserveds().map(function (object) {
                        return Utils.observe(object, this.onObservedChange);
                    }, this);
                }
            },
            
            unobserveObjects: function () {
                if (this.observers) {
                    this.observers.forEach(function (observer) {
                        observer.dispose();
                    });
                } 
            },
            
            componentDidMount: function () {
                this.observeObjects();
            },
            
            componentDidUpdate: function () {
                if (typeof this.getObserveds === 'function') {
                    if (!shallowEqual(this.getObserveds(), this.observeds)) {
                        this.unobserveObjects();
                        this.observeObjects();
                    }
                }
            },
            
            shouldComponentUpdate: function(nextProps, nextState) {
                return !shallowEqual(this.props, nextProps) ||
                       !shallowEqual(this.state, nextState);
            },
            
            componentWillUnmount: function () {
                this.unobserveObjects();
            }
        }
    };
    
    

})(window);