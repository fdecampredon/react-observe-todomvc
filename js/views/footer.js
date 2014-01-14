/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*jshint browser:true */
/*global React */

var app = app || {};

(function (window) {
    'use strict';
    
    var html = React.DOM,
        Utils = app.Utils;

    app.TodoFooter = React.createClass({
        
        mixins: [Utils.ObserveMixin],
        
        getObserveds: function () {
            return [this.model];
        },
        
        componentWillMount: function () {
            
            
            // We injec the model by global references here
            // However in more sophisticated architecture, 
            // we could use some kind of IOC container
            this.model = app.footerModel;
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
                    html.li(null, html.a({href: '#/', className: show[app.ALL_TODOS]}, 'All')), ' ',
                    html.li(null,html.a({href: '#/active', className: show[app.ACTIVE_TODOS]}, 'Active')), ' ',
                    html.li(null,html.a({href: '#/completed', className: show[app.COMPLETED_TODOS]}, 'Completed'))
                ),
                clearButton
            );
        }
    });
})(window);