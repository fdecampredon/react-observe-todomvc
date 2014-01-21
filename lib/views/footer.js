/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*jshint browser:true */
/*jshint node : true */

'use strict';

var React = require('react/addons'),
    Utils = require('../utils'),
    routes = require('../routes'),
    html = React.DOM;

module.exports  = React.createClass({
    mixins: [Utils.EventDispatcherMixin],
    
    clearCompleted: function () {
        var clearCompletedEvent = new CustomEvent('clearCompleted', {bubbles: true});
        this.dispatchEvent(clearCompletedEvent);
    },
    
    linkClickHandler: function (event) {
        if (event.target.href !== this.props.nowShowing) {
            var href= event.target.href;
            if (typeof history !== 'undefined' && typeof history.pushState === 'function') {
                history.pushState(null, null, href);
            } else {
                location.hash = href;
            }
            event.preventDefault();
        }
    },
    
    render: function () {
        var activeTodoWord = Utils.pluralize(this.props.count, 'item');
        var clearButton = null;

        if (this.props.completedCount > 0) {
            clearButton = html.button(
                {
                    id: 'clear-completed',
                    onClick: this.clearCompleted
                },
                ' Clear completed (' + this.props.completedCount + ') ' 
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
                html.strong(null, this.props.count),
                ' ' + activeTodoWord + ' left'
            ),
            html.ul(
                {id: 'filters'},
                html.li(null, html.a({href: '/', className: show[routes.ALL_TODOS], onClick: this.linkClickHandler}, 'All')), ' ',
                html.li(null,html.a({href: '/active', className: show[routes.ACTIVE_TODOS], onClick: this.linkClickHandler}, 'Active')), ' ',
                html.li(null,html.a({href: '/completed', className: show[routes.COMPLETED_TODOS], onClick: this.linkClickHandler}, 'Completed'))
            ),
            clearButton
        );
    }
});