/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*jshint browser:true */
/*jshint node : true */

'use strict';

var React = require('react/addons'),
    Utils = require('../utils'),
    html = React.DOM;

var ESCAPE_KEY = 27;
var ENTER_KEY = 13;

module.exports = React.createClass({
    mixins: [Utils.ObserveMixin, Utils.EventDispatcherMixin],
    
    getObservedObjects: function () {
        return [this.props.todo];
    },
    
    handleSubmit: function () {
        if (this.props.editing) {
            var title = this.refs.editField.getDOMNode().value.trim();
            if (title) {
                var saveTodoEvent = new CustomEvent('saveTodo', { 
                    bubbles: true, 
                    cancelable: false, 
                    detail: {
                        todo: this.props.todo,
                        title: title
                    }
                });
                this.dispatchEvent(saveTodoEvent);
            } else {
                this.onDestroy();
            }
            return false;
        }
    },
    
    componentDidUpdate: function () {
        if (this.props.editing) {
            var node = this.refs.editField.getDOMNode();
            node.focus();
            node.value = this.props.todo.title;
            node.setSelectionRange(node.value.length, node.value.length);
        }
    },

    handleEdit: function () {
        var editTodoEvent = new CustomEvent('editTodo', { 
            bubbles: true, 
            cancelable: false, 
            detail: this.props.todo
        });
        this.dispatchEvent(editTodoEvent);
    },

    handleKeyDown: function (event) {
        if (event.keyCode === ESCAPE_KEY) {
            var editTodoEvent = new CustomEvent('cancelEdition', { 
                bubbles: true, 
                cancelable: false, 
                detail: this.props.todo
            });
            this.dispatchEvent(editTodoEvent);
        } else if (event.keyCode === ENTER_KEY) {
            this.handleSubmit();
        }
    },
    
    onToggle: function () {
        var toggleTodoEvent = new CustomEvent('toggleTodo', { 
            bubbles: true, 
            cancelable: false, 
            detail: this.props.todo
        });
        this.dispatchEvent(toggleTodoEvent);
    },
    
    onDestroy: function () {
        var toggleTodoEvent = new CustomEvent('destroyTodo', { 
            bubbles: true, 
            cancelable: false, 
            detail: this.props.todo
        });
        this.dispatchEvent(toggleTodoEvent);
    },
    
    render: function () {
        return html.li({ 
                className: React.addons.classSet({
                    completed: this.props.todo.completed,
                    editing: this.props.editing
                })
            },
            html.div(
                {className: 'view'},
                html.input({
                    className: 'toggle',
                    type: 'checkbox',
                    checked: this.props.todo.completed ? 'checked' : '',
                    onChange: this.onToggle
                }),
                html.label(
                    {onDoubleClick: this.handleEdit},
                    this.props.todo.title
                ),
                html.button({className: 'destroy', onClick: this.onDestroy})  
            ),
            html.input({
                ref: 'editField',
                className: 'edit',
                defaultValue: this.props.todo.title,
                onBlur: this.handleSubmit,
                onKeyDown: this.handleKeyDown
            })
        );
    }
});