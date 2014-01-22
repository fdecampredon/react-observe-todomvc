'use strict';

import ObserveUtils = require('observe-utils');
import List = ObserveUtils.List;

//prevent typescript bug that does not import a module when only alias are present on the body of the file
ObserveUtils.defineObservableProperties;

// simple function that will observe a list
// and all object contained in this list (if they are observable)
function listObserve(list: List<any>, handler: (... rest: any[]) => void): { dispose(): void } {
    function objectObserver(changes: any[]) {
        handler(changes);
    }
    
    function listObserver(changes?: any[]) {
        changes.forEach(function (change) {
            if (change.type === 'splice') {
                if (change.removed) {
                    change.removed.forEach((object: any) => {
                        if (Object(object) === object) {
                            (<any>Object).unobserve(object, objectObserver);
                        }
                    });
                }
                if (change.addedCount > 0) {
                    var i = 0, l = change.index + change.addedCount;
                    for (i = change.index; i < l; i++) {
                        var item = list[i];
                        if (Object(item) === item) {
                            (<any>Object).observe(item, objectObserver);
                        }
                    }
                }
            } else if (change.type === 'update') {
                if (Object(change.oldValue) === change.oldValue) {
                    (<any>Object).unobserve(change.oldValue, objectObserver);
                }
                if (Object(list[change.name]) === list[change.name]) {
                    (<any>Object).unobserve(list[change.name], objectObserver);
                }
            }
        });
        handler(changes);
    }
    
    List.observe(list, listObserver);
    
    list.forEach(function (object) {
        if (Object(object) === object) {
            (<any>Object).observe(object, objectObserver);
        }
    });
    
    return {
        dispose: function () {
            list.forEach(function (object) {
                if (Object(object) === object) {
                    (<any>Object).unobserve(object, objectObserver);
                }
            });
            (<any>Object).unobserve(list, listObserver);
        }
    };
}




export function uuid() {
    /*jshint bitwise:false */
    var i: number, random: number;
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
}

export function pluralize(count: number, word: string) {
    return count === 1 ? word : word + 's';
}

export function store(namespace: string, data?: any) {
    if (data) {
        return localStorage.setItem(namespace, JSON.stringify(data));
    }

    var store = localStorage.getItem(namespace);
    return (store && JSON.parse(store)) || [];
}

export function assign(target: any, source: any) {
    return Object.keys(source).reduce(function(target, key) {
        target[key] = source[key];
        return target;
    }, target);
}

export function observe(object: any, handler: () => void) {
    if (object instanceof List) {
        List.observe(object, handler);
    } else {
        (<any>Object).observe(object, handler);
    }
}

//Observe a list and all objects in this list
export function deepObserve(object: any, handler: () => void): { dispose(): void} {
    if (object instanceof List) {
        return listObserve(object, handler);
    } else {
        (<any>Object).observe(object, handler);
        return {
            dispose: function () {
                (<any>Object).unobserve(object, handler);
            }
        };
    }
}

