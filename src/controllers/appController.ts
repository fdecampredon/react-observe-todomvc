'use strict';

import ObserveUtils =  require('observe-utils');
import Utils = require('../utils/utils');
import Todo = require('../model/todo');
import routes = require('../routes');
import app = require('../views/todoApp');
import item = require('../views/todoItem');

class TodoAppController {
    
    
    private application: app.TodoAppClass;
    
    constructor(
        public todos: ObserveUtils.List<Todo>
    ){ }
    
    componentDidMount(component: any) {
        if (component.displayName === app.TodoAppClass['name']) {
            this.application = component;
            this.application.onCreate = this.createTodo;
            this.application.onToggleAll = this.toggleAll;
        } else {
            var item: item.TodoItemClass = component;
            item.onDestroy = this.destroy;
            item.onEdit = this.edit;
            item.onToggle = this.toggle;
            item.onUpdate = this.update;
        }
    }
    
    componentWillUnmount(component: any) {
        if (component.displayName === app.TodoAppClass['name']) {
            this.application.onCreate = null;
            this.application.onToggleAll = null;
            this.application = null;
        } else {
            var item: item.TodoItemClass = component;
            item.onDestroy = null;
            item.onEdit = null;
            item.onToggle = null;
            item.onUpdate = null;
        }
    }

    
    createTodo = (title: string) => {
        var todo = new Todo();
        todo.title = title;
        todo.completed = false;
        todo.id = Utils.uuid();
        this.todos.push(todo);
    }
    
    destroy = (todo: Todo) => {
        var index = this.todos.indexOf(todo);
        if (index !== -1) {
            this.todos.splice(index, 1);
        }
    }
    
    edit = (id: string) => {
        this.application.setState({ editing: id });
    }
    
    update = (todo: Todo, title: string) => {
        todo.title = title;
    }
    
    toggle = (todo: Todo) => {
        todo.completed = !todo.completed;
    }
    
    toggleAll = (toggle: boolean) => {
        this.todos.forEach(function (todo) {
            todo.completed = toggle;
        });
    }

}

export = TodoAppController;