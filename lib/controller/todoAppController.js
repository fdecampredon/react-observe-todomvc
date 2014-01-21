/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*jshint browser:true */
/*jshint node : true */

'use strict';

var Utils = require('../utils'), 
    Todo = require('../model/todo');




function TodoAppController(todos) {
    this.todos = todos;
    
    var self = this;
    this.newTodoHandler = function (event) {
        var todo = new Todo();
        todo.title = event.detail;
        todo.completed = false;
        todo.id = Utils.uuid();
        todos.push(todo);
    };
    
    this.toggleAllTodoHandler = function (event) {
        var toggle = event.detail;
        todos.forEach(function (todo) {
            todo.completed = toggle;
        });
    };
    
    this.destroyTodoHandler = function (event) {
        var todo = event.detail;
        var index = self.todos.indexOf(todo);
        if (index !== -1) {
            self.todos.splice(index, 1);
        }
    };
    
    this.editTodo = function (event) {
        var todo = event.detail;
        self.todoApp.setEditing(todo.id);
    };
    
    this.cancelEditionHandler = function (event) {
        self.todoApp.setEditing(null);
    };
    
     
    this.saveTodoHandler = function (event) {
        var todo = event.detail.todo,
            title = event.detail.title;
        todo.title = title;
        self.todoApp.setEditing(null);
    };
    
    this.toggleTodoHandler = function (event) {
        var todo = event.detail;
        todo.completed = !todo.completed;
    };
    
    
    this.clearCompletedHandler = function (event) {
        var indexToRemoves = [];
        self.todos.forEach(function (todo, index) {
            if (todo.completed) {
               indexToRemoves.push(index);
            }
        });
        
        indexToRemoves.forEach(function (i, j) {
            self.todos.splice(i - j, 1);    
        });
    };
   

}

TodoAppController.prototype.viewMounted = function (todoApp) {
    this.todoApp = todoApp;
    todoApp.addEventListener('newTodo', this.newTodoHandler);
    todoApp.addEventListener('toggleAllTodo', this.toggleAllTodoHandler);
    todoApp.addEventListener('destroyTodo', this.destroyTodoHandler);
    todoApp.addEventListener('editTodo', this.editTodo);
    todoApp.addEventListener('cancelEdition', this.cancelEditionHandler);
    todoApp.addEventListener('saveTodo', this.saveTodoHandler);
    todoApp.addEventListener('toggleTodo', this.toggleTodoHandler);
    todoApp.addEventListener('clearCompleted', this.clearCompletedHandler);
};


module.exports = TodoAppController;

    