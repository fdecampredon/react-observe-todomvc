/*jshint quotmark: false */
/*jshint white: false */
/*jshint trailing: false */
/*jshint newcap: false */
/*jshint browser: true */
/*global React */


var app = app || {};

(function (window) {
    'use strict';
    
    var Utils = app.Utils,
        html = React.DOM;

    var ESCAPE_KEY = 27;
    var ENTER_KEY = 13;

    app.TodoItem = React.createClass({
        mixins: [Utils.ObserveMixin],
        
        getObserveds: function () {
            return [this.props.todo];
        },
        
        handleSubmit: function () {
            if (this.props.editing) {
                var val = this.refs.editField.getDOMNode().value.trim();
                if (val) {
                    this.model.update(this.props.todo, val);
                } else {
                    this.onDestroy();
                }
                this.model.editing = null;
                return false;
            }
        },
        
        componentWillMount: function () {
            
            // We inject the model by global references here
            // However in more sophisticated architecture, 
            // we could use some kind of IOC container
            this.model = app.appModel;
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
            this.model.editing = this.props.todo.id;
        },

        handleKeyDown: function (event) {
            if (event.keyCode === ESCAPE_KEY) {
                this.model.editing = null;
            } else if (event.keyCode === ENTER_KEY) {
                this.handleSubmit();
            }
        },
        
        onToggle: function () {
            this.model.toggle(this.props.todo);
        },
        
        onDestroy: function () {
            this.model.destroy(this.props.todo);
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
})(window);