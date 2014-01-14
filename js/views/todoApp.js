/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*jshint browser:true */
/*global React*/

var app = app || {};

(function (window, React) {
    'use strict';
    
    var Utils = app.Utils,
        html = React.DOM,
        ACTIVE_TODOS = app.ACTIVE_TODOS,
        COMPLETED_TODOS = app.COMPLETED_TODOS,
        TodoItem = app.TodoItem,
        TodoFooter = app.TodoFooter;

    var ENTER_KEY = 13;   
    
    app.TodoApp = React.createClass({
        mixins: [Utils.ObserveMixin],
        
        getObserveds: function () {
            return [this.model, this.model.todos];
        },
        
        componentWillMount: function () {
            // We inject the model by global references here
            // However in more sophisticated architecture, 
            // we could use some kind of IOC container
            this.model = app.appModel;
        },
        
        componentDidMount: function () {
            this.refs.newField.getDOMNode().focus();
        },
        
        handleNewTodoKeyDown: function (event) {
            if (event.which !== ENTER_KEY) {
                return;
            }
    
            var val = this.refs.newField.getDOMNode().value.trim();
            if (val) {
                this.model.createTodo(val);
                this.refs.newField.getDOMNode().value = '';
            }
    
            return false;
        },
    
        toggleAll: function (event) {
            var checked = event.target.checked;
            this.model.toggleAll(checked);
        },
    
    
        render: function () {
            var footer = null,
                main = null,
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
    });
                
})(window, React);