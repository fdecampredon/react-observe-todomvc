/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*jshint browser:true */
/*jshint node : true */

'use strict';
    
var Utils = require('../utils'),
    React = require('react/addons'),
    html = React.DOM,
    routes = require('../routes'),
    ACTIVE_TODOS = routes.ACTIVE_TODOS,
    COMPLETED_TODOS = routes.COMPLETED_TODOS,
    TodoItem = require('./todoItem'),
    TodoFooter = require('./footer');

var ENTER_KEY = 13;   

module.exports = React.createClass({
    id: 'TodoApp',
    mixins: [Utils.ObserveMixin, Utils.EventDispatcherMixin, Utils.ManagedMixin],
    
    getObservedObjects: function () {
        return [this.props.todos];
    },
    
    getInitialState: function () {
        return {
            editing: null
        };
    },
    
    componentDidMount: function () {
        this.refs.newField.getDOMNode().focus();
    },
    
    handleNewTodoKeyDown: function (event) {
        if (event.which !== ENTER_KEY) {
            return;
        }

        var title = this.refs.newField.getDOMNode().value.trim();
        if (title) {
            var newTodoEvent = new CustomEvent('newTodo', { 
                bubbles: false, 
                cancelable: false, 
                detail: title
            });
            this.dispatchEvent(newTodoEvent);
            this.refs.newField.getDOMNode().value = '';
        }

        return false;
    },

    toggleAll: function (event) {
        var checked = event.target.checked;
        var newTodoEvent = new CustomEvent('toggleAllTodo', { 
            bubbles: false, 
            cancelable: false, 
            detail: checked
        });
        this.dispatchEvent(newTodoEvent);
    },
    
    setEditing: function(id) {
        this.setState({editing: id});
    },

    render: function () {
        var footer = null,
            main = null,
            todos = this.props.todos,
            shownTodos = todos.filter(function (todo) {
                switch (this.props.route) {
                    case routes.ACTIVE_TODOS:
                        return !todo.completed;
                    case routes.COMPLETED_TODOS:
                        return todo.completed;
                    default:
                        return true;
                }
            }, this);

        var todoItems = shownTodos.map(function (todo) {
            return TodoItem({
                key: todo.id,
                todo: todo,
                editing: this.state.editing === todo.id
            });
        }, this);
        
        var activeTodoCount = todos.reduce(function(accum, todo) {
                return todo.completed ? accum : accum + 1;
        }, 0);

        var completedCount = todos.length - activeTodoCount;

        if (activeTodoCount || completedCount) {
            footer = TodoFooter({ 
                nowShowing: this.props.route,
                count: activeTodoCount,
                completedCount: completedCount,
            });
            main = html.section(
                {id: 'main'},
                html.input(
                    {
                        id: 'toggle-all',
                        type: 'checkbox',
                        onChange: this.toggleAll,
                        checked: activeTodoCount === 0
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
});