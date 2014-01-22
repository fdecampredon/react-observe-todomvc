'use strict';

import ObserveUtils =  require('observe-utils');
import Utils = require('../utils/utils');
import List = ObserveUtils.List;
import Todo = require('../model/todo');
import routes = require('../routes');

class TodoAppPM {
    
    public allCompleted: boolean;
    public editing: string;
    public nowShowing: string;
    
    constructor(
        public todos: List<Todo>
    ){
        this.updateAllCompleted();
        Utils.deepObserve(todos, () => this.updateAllCompleted());
    }
    
    private updateAllCompleted() {
        this.allCompleted = this.todos.every(function (todo) {
            return todo.completed;
        });
    }
    
    get shownTodos(): List<Todo> {
        return this.todos.filter((todo) => {
            switch (this.nowShowing) {
                case routes.ACTIVE_TODOS:
                    return !todo.completed;
                case routes.COMPLETED_TODOS:
                    return todo.completed;
                default:
                    return true;
            }
        });
    }
    
    createTodo(title: string) {
        var todo = new Todo();
        todo.title = title;
        todo.completed = false;
        todo.id = Utils.uuid();
        this.todos.push(todo);
    }
    
    destroy(todo: Todo) {
        var index = this.todos.indexOf(todo);
        if (index !== -1) {
            this.todos.splice(index, 1);
        }
    }
    
    update(todo: Todo, title: string) {
        todo.title = title;
    }
    
    toggle(todo: Todo) {
        todo.completed = !todo.completed;
    }
    
    toggleAll(toggle: boolean) {
        this.todos.forEach(function (todo) {
            todo.completed = toggle;
        });
    }

}

if (!(<any>window).nativeObjectObserve) {
    ObserveUtils.defineObservableProperties(TodoAppPM.prototype, 'editing', 'todos', 'nowShowing', 'allCompleted');
}

export = TodoAppPM;