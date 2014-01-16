/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*jshint browser:true */
/*jshint node : true */

'use strict';

var React = require('react'),
    Utils = require('../utils'),
    registry = require('../registry'),
    routes = require('../routes'),
    html = React.DOM;

module.exports  = React.createClass({
    
    mixins: [Utils.ObserveMixin],
    
    getObservedObjects: function () {
        return [this.model];
    },
    
    componentWillMount: function () {
        
        
        // We injec the model by global references here
        // However in more sophisticated architecture, 
        // we could use some kind of IOC container
        this.model = registry.footerModel;
    },
    
    clearCompleted: function () {
        this.model.clearCompleted();
    },
    
    render: function () {
        var activeTodoWord = Utils.pluralize(this.model.activeTodoCount, 'item');
        var clearButton = null;

        if (this.model.completedCount > 0) {
            clearButton = html.button(
                {
                    id: 'clear-completed',
                    onClick: this.clearCompleted
                },
                ' Clear completed (' + this.model.completedCount + ') ' 
            );
        }

        var show = {
            ALL_TODOS: '',
            ACTIVE_TODOS: '',
            COMPLETED_TODOS: ''
        };
        show[this.props.nowShowing] = 'selected';

        return html.footer(
            {id: 'footer'},
            html.span(
                {id: 'todo-count'},
                html.strong(null, this.model.activeTodoCount),
                ' ' + activeTodoWord + ' left'
            ),
            html.ul(
                {id: 'filters'},
                html.li(null, html.a({href: '#/', className: show[routes.ALL_TODOS]}, 'All')), ' ',
                html.li(null,html.a({href: '#/active', className: show[routes.ACTIVE_TODOS]}, 'Active')), ' ',
                html.li(null,html.a({href: '#/completed', className: show[routes.COMPLETED_TODOS]}, 'Completed'))
            ),
            clearButton
        );
    }
});