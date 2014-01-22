'use strict';

import React = require('react/addons');
import ObserverDecorator = require('../utils/observe-decorator');
import ReactTypescript = require('../utils/react-typescript');
import Todo = require('../model/todo');
import registry = require('../registry');
import TodoAppPM = require('./todoAppPM');
var html = React.DOM;

var ESCAPE_KEY = 27;
var ENTER_KEY = 13;


export interface TodoItemProps {
    todo: Todo;
    editing: boolean;
}


export class TodoItemClass extends ReactTypescript.ReactComponentBase<TodoItemProps, void> {
    model: TodoAppPM;
    
    getEditField() {
        return (<HTMLInputElement>this.refs['editField'].getDOMNode());
    }
    
    getObservedObjects() {
        return [this.props.todo];
    }
    
    componentWillMount() {
        // We inject the model by global references here
        // However in more sophisticated architecture, 
        // we could use some kind of IOC container
        this.model = registry.appModel;
    }
    
    handleSubmit() {
        if (this.props.editing) {
            var val = this.getEditField().value.trim();
            if (val) {
                this.model.update(this.props.todo, val);
            } else {
                this.onDestroy();
            }
            this.model.editing = null;
            return false;
        }
    }
    
    componentDidUpdate() {
        if (this.props.editing) {
            var node = this.getEditField()
            node.focus();
            node.value = this.props.todo.title;
            node.setSelectionRange(node.value.length, node.value.length);
        }
    }

    handleEdit() {
        this.model.editing = this.props.todo.id;
    }

    handleKeyDown(event: React.KeyboardEvent) {
        if (event.keyCode === ESCAPE_KEY) {
            this.model.editing = null;
        } else if (event.keyCode === ENTER_KEY) {
            this.handleSubmit();
        }
    }
    
    onToggle() {
        this.model.toggle(this.props.todo);
    }
    
    onDestroy() {
        this.model.destroy(this.props.todo);
    }
    
    render() {
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
}

export var TodoItem = ReactTypescript.registerComponent<TodoItemClass, TodoItemProps>(TodoItemClass, ObserverDecorator);

