
import React = require('react/addons');
import ObserveUtils =  require('observe-utils');
import ObserverDecorator = require('../utils/observe-decorator');
import ReactTypescript = require('../utils/react-typescript');
import ReactControls = require('../utils/react-controller');
import Todo = require('../model/todo');
import routes = require('../routes');
import TodoItem = require('./todoItem');
import TodoFooter = require('./footer');


var html = React.DOM;
var ENTER_KEY = 13;   


class TodoApp extends ReactTypescript.ReactComponentBase<{
        todos: ObserveUtils.List<Todo>;
        nowShowing: string;
    }, { 
        editing: string; 
    }> {
    
    
    onCreate: (title: string) => void;
    onToggleAll: (check: boolean) => void;
    
    getInitialState() {
        return {
            editing: null
        }
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
            this.onCreate(val);
            this.getNewField().value = '';
        }

        return false;
    }
    
    toggleAll(event: React.FormEvent) {
        var checked: boolean = (<HTMLInputElement>event.target).checked;
        this.onToggleAll(checked);
    }
    
    render() {
        var footer: TodoFooter = null,
            main: React.ReactComponent<any, any> = null,
            todos = this.props.todos,
            shownTodos = todos.filter((todo) => {
                switch (this.props.nowShowing) {
                    case routes.ACTIVE_TODOS:
                        return !todo.completed;
                    case routes.COMPLETED_TODOS:
                        return todo.completed;
                    default:
                        return true;
                }
            });

        var todoItems = shownTodos.map(function (todo) {
            return new TodoItem({
                key: todo.id,
                todo: todo,
                editing: this.state.editing === todo.id,
            });
        }, this);
        
        var activeTodoCount = todos.reduce((accum: number, todo: Todo) => {
            return todo.completed ? accum : accum + 1;
        }, 0);
        var completedCount = todos.length - activeTodoCount;


        if (activeTodoCount || completedCount) {
            footer = new TodoFooter({ 
                nowShowing: this.props.nowShowing, 
                activeTodoCount: activeTodoCount,
                completedCount : completedCount
            });
            main = html.section(
                {id: 'main'},
                html.input(
                    {
                        id: 'toggle-all',
                        type: 'checkbox',
                        onChange: this.toggleAll,
                        checked: completedCount && !activeTodoCount
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

TodoApp.decorate(ObserverDecorator, ReactControls.ControlledDecorator);
TodoApp.register();
export = TodoApp;
