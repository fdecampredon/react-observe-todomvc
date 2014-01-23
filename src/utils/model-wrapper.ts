'use strict';

import ObserveUtils = require('observe-utils');


var Observer: {
    observe(target: any, callback: (changes: ObjectChangeRecord []) => void): any;
    unobserve(target: any, callback: (changes: ObjectChangeRecord []) => void): any;
} = <any>Object;



interface ChangeRecord {
    object: any;
    type: string;
}


interface ObjectChangeRecord extends ChangeRecord {
    name?: string;
    oldValue: any;
}

interface SpliceChangeRecord extends ChangeRecord {
    index: number;
    addedCount: number;
    removed: any[];
}

var push = Function.call.bind(Array.prototype.push);

function isArray(obj: any) {
    return Array.isArray(obj) || obj instanceof ObserveUtils.List;
}

function isObservable(obj: any) {
    return Object(obj) === obj && Object.isExtensible(obj);
}
    
class ModelWrapper {
    
    private map = new WeakMap<any, { rev:string; changes: ChangeRecord[]; parent: any}>();
    private revHelper: number = 0;
    private callbacks: { (): void }[] = [];
    
    constructor(
        private root: any,
        private idField = 'id'
    ) {
        if (!isObservable(root)) {
            throw new TypeError('wrapped model must be an extensible object, given : ' + root);
        }
        this.observe(root);
    }
    
    dispose() {
        this.unobserve(this.root);
    }
    
    getRev(target: any) {
        return isObservable(target) && this.map.has(target) && this.map.get(target).rev;
    }
    
    addChangeHandler(callback: () => void) {
        this.callbacks.push(callback);
    }
    
    private changeHandler = () => {
        this.callbacks.forEach(callback => callback());
    }
    
    private listObserver = (changes: ChangeRecord[])  => {
        var target: any;
        changes.forEach(change => {
            if (change.type === 'splice') {
                var spliceChange =  <SpliceChangeRecord> change;
                if (spliceChange.removed) {
                    spliceChange.removed.forEach(this.unobserve, this);
                }
                if (spliceChange.addedCount > 0) {
                    var i = 0, l = spliceChange.index + spliceChange.addedCount;
                    for (i = spliceChange.index; i < l; i++) {
                        this.unobserve(spliceChange.object[i]);
                    }
                }
            } else if (change.type === 'update') {
                var objectChange = <ObjectChangeRecord> change;
                if (objectChange.oldValue) {
                    this.unobserve(objectChange.oldValue);
                }
                this.observe(objectChange.object[objectChange.name]);
            }
            target = change.object;
        });
        this.update(target, changes);
        this.changeHandler();
    }
    
    private objectObserver = (changes: ObjectChangeRecord[]) => {
        var target: any;
        changes.forEach(change => {
            if (change.oldValue) {
                this.unobserve(change.oldValue);
            }
            this.observe(change.object[change.name]);
            target = change.object;
        });
        this.update(target, changes);
        this.changeHandler();
    }
    
    
    private observe(target: any, parent?: any) {
        if (isObservable(target)) {
            
            this.map.set(target, {
                rev: target[this.idField] + (this.revHelper++),
                changes: [],
                parent: parent
            });
            
            if (isArray(target)) {
                ObserveUtils.List.observe(target, this.listObserver);
                (<any []> target).forEach(item => {
                    this.observe(item, target);
                });
            } else {
                Observer.observe(target, this.objectObserver);
                Object.keys(target).forEach(key => {
                    this.observe(target[key], target);
                });
            }
        }
    }
    
    private unobserve(target: any) {
        if (isObservable(target)) {
            this.map.delete(target);
            if (isArray(target)) {
                Observer.unobserve(target, this.listObserver);
                (<any []> target).forEach(item => {
                    this.unobserve(item);
                });
            } else {
                Observer.unobserve(target, this.objectObserver);
                Object.keys(target).forEach(key => {
                    this.unobserve(target[key]);
                });
            }
        }
    }
    
    private update(target: any, changes?: ChangeRecord[]) {
        var desc = this.map.get(target);
        //later use push(desc.changes, changes);
        desc.rev = target[this.idField] + (this.revHelper++);
        if (desc.parent) {
            this.update(desc.parent)
        }
    }
}

export = ModelWrapper;