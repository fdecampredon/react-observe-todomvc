'use strict';




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


