'use strict';

import React = require('react/addons');
import ObserverDecorator = require('../utils/observe-decorator');
import ReactTypescript = require('../utils/react-typescript');
import ReactControls = require('../utils/react-controller');
import Todo = require('../model/todo');
var html = React.DOM;

var ESCAPE_KEY = 27;
var ENTER_KEY = 13;



class TodoItem extends ReactTypescript.ReactComponentBase< { todo: Todo; editing: boolean; }, void > {
    
    onUpdate: (todo: Todo, title: string) => void;
    onEdit: (id: string) => void;
    onToggle: (todo: Todo) => void;
    onDestroy: (todo: Todo) => void;
    
    getEditField() {
        return (<HTMLInputElement>this.refs['editField'].getDOMNode());
    }

    handleSubmit() {
        if (this.props.editing) {
            var val = this.getEditField().value.trim();
            if (val) {
                this.onUpdate(this.props.todo, val);
            } else {
                this.destroyHandler();
            }
            this.onEdit(null);
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
        this.onEdit(this.props.todo.id);
    }

    handleKeyDown(event: React.KeyboardEvent) {
        if (event.keyCode === ESCAPE_KEY) {
            this.onEdit(null);
        } else if (event.keyCode === ENTER_KEY) {
            this.handleSubmit();
        }
    }
    
    onToggleChange() {
        this.onToggle(this.props.todo);
    }
    
    destroyHandler() {
        this.onDestroy(this.props.todo);
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
                    onChange: this.onToggleChange
                }),
                html.label(
                    {onDoubleClick: this.handleEdit},
                    this.props.todo.title
                ),
                html.button({className: 'destroy', onClick: this.destroyHandler})  
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

TodoItem.decorate(ObserverDecorator, ReactControls.ControlledDecorator);
TodoItem.register();
export = TodoItem;


