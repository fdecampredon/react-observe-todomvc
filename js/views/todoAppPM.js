/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*jshint browser:true */
/*global ObserveUtils */

var app = app || {};

(function (window) {
    'use strict';
    var List = ObserveUtils.List;
    
    var Utils = app.Utils, 
        Todo = app.Todo;
    
    
    function updateAllCompleted(todoAppPM) {
        todoAppPM.allCompleted = todoAppPM.todos.every(function (todo) {
            return todo.completed;
        });
    }
    
    
    
    function TodoAppPM(todos) {
        this.todos = todos;
        this.editing = null;
        updateAllCompleted(this);
    }
    
    Object.defineProperty(TodoAppPM.prototype, 'shownTodos', {
        get: function () {
            return this.todos.filter(function (todo) {
                switch (this.nowShowing) {
                    case app.ACTIVE_TODOS:
                        return !todo.completed;
                    case app.COMPLETED_TODOS:
                        return todo.completed;
                    default:
                        return true;
                }
            }, this);
        }
    });
    
        
    TodoAppPM.prototype.createTodo = function (title) {
        var todo = new Todo();
        todo.title = title;
        todo.completed = false;
        todo.id = Utils.uuid();
        this.todos.push(todo);
    };
    
    TodoAppPM.prototype.destroy = function (todo) {
        var index = this.todos.indexOf(todo);
        if (index !== -1) {
            this.todos.splice(index, 1);
        }
    };
    
    TodoAppPM.prototype.update = function (todo, title) {
        todo.title = title;
    };
    
    TodoAppPM.prototype.toggle = function (todo) {
        todo.completed = !todo.completed;
        updateAllCompleted(this);
    };
    
    TodoAppPM.prototype.toggleAll = function (toggle) {
        this.todos.forEach(function (todo) {
            todo.completed = toggle;
        });
        this.allCompleted = toggle;
    };
    
    
    if (!window.nativeObjectObserve) {
        ObserveUtils.defineObservableProperties(TodoAppPM.prototype, 'editing', 'todos', 'nowShowing', 'allCompleted');
    }
    
    app.TodoAppPM = TodoAppPM;
    
    
})(window);