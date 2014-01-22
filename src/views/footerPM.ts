'use strict';
    
import ObserveUtils =  require('observe-utils');
import Utils = require('../utils/utils');
import List = ObserveUtils.List;
import Todo = require('../model/todo');


class FooterPM {
    
    public activeTodoCount: number;
    public completedCount: number;
    constructor(
        private todos: List<Todo>
    ) {
        this.todos = todos;
        var self = this;
        this.updateCounts();
        
        Utils.deepObserve(this.todos,  this.updateCounts);
    }

    clearCompleted() {
        var indexToRemoves: number[] = [];
        this.todos.forEach(function (todo, index) {
            if (todo.completed) {
               indexToRemoves.push(index);
            }
        });
        
        indexToRemoves.forEach(function (i, j) {
            this.todos.splice(i - j, 1);    
        }, this);
    }
    
    private updateCounts = () => {
        this.activeTodoCount = this.todos.reduce((accum: number, todo: Todo) => {
            return todo.completed ? accum : accum + 1;
        }, 0);

        this.completedCount = this.todos.length - this.activeTodoCount;
    }
}

if (!(<any>window).nativeObjectObserve) {
    ObserveUtils.defineObservableProperties(FooterPM.prototype, 'activeTodoCount', 'completedCount');
}

export = FooterPM;