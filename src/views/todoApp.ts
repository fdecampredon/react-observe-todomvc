
import React = require('react/addons');
import Utils = require('../utils/utils');
import ObserverDecorator = require('../utils/observe-decorator');
import ReactTypescript = require('../utils/react-typescript');
import Todo = require('../model/todo');
import registry = require('../registry');
import TodoAppPM = require('./todoAppPM');
import todoItem = require('./todoItem');
import footer = require('./footer');

var TodoItem = todoItem.TodoItem;
var TodoFooter = footer.TodoFooter;

var html = React.DOM;
var ENTER_KEY = 13;   

export class TodoAppClass extends ReactTypescript.ReactComponentBase<{}, void> {
    private model: TodoAppPM;
    getObservedObjects() {
        return [this.model, this.model.todos];
    }
    
    componentWillMount() {
        // We inject the model by global references here
        // However in more sophisticated architecture, 
        // we could use some kind of IOC container
        this.model = registry.appModel;
    }
    
    getNewField() {
        return (<HTMLInputElement>this.refs['newField'].getDOMNode());
    }
    
    componentDidMount() {
        this.getNewField().focus();
    }
    
    handleNewTodoKeyDown(event: React.KeyboardEvent) {
        if (event.which !== ENTER_KEY) {
            return;
        }

        var val = this.getNewField().value.trim();
        if (val) {
            this.model.createTodo(val);
            this.getNewField().value = '';
        }

        return false;
    }
    
    toggleAll(event: React.FormEvent) {
        var checked: boolean = (<HTMLInputElement>event.target).checked;
        this.model.toggleAll(checked);
    }
    
    render() {
        var footer: footer.TodoFooterClass = null,
            main: React.ReactComponent<any, any> = null,
            todos = this.model.todos;

        var todoItems = this.model.shownTodos.map(function (todo) {
            return TodoItem({
                key: todo.id,
                todo: todo,
                editing: this.model.editing === todo.id,
            });
        }, this);


        if (todos.length) {
            footer = TodoFooter({ nowShowing: this.model.nowShowing });
            main = html.section(
                {id: 'main'},
                html.input(
                    {
                        id: 'toggle-all',
                        type: 'checkbox',
                        onChange: this.toggleAll,
                        checked: this.model.allCompleted
                    }
                ),
                html.ul(
                    { id: 'todo-list'},
                    todoItems
                )
            );
        }

        return html.div(
            null,
            html.header(
                {id: 'header'},
                html.h1(null, 'todos'),
                html.input({
                    ref: 'newField',
                    id: 'new-todo',
                    placeholder: 'What needs to be done?',
                    onKeyDown: this.handleNewTodoKeyDown
                })
            ),
            main,
            footer
        );
    }
}

export var TodoApp = ReactTypescript.registerComponent<TodoAppClass, {}>(TodoAppClass, ObserverDecorator);

