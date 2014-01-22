'use strict';

import ObserveUtils = require('observe-utils');

class Todo {
    id: string;
    title: string;
    completed: boolean;
    
    toJSON() {
        return {
            title: this.title,
            completed: this.completed,
            id: this.id
        }
    }
}

if (!(<any>window).nativeObjectObserve) {
    ObserveUtils.defineObservableProperties(Todo.prototype, 'title', 'completed');
} else {
    delete Todo.prototype.toJSON;
}

export = Todo;