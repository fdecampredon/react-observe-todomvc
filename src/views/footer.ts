'use strict';
    
import React = require('react/addons');
import Utils = require('../utils/utils');
import ReactControls = require('../utils/react-controller');
import ReactTypescript = require('../utils/react-typescript');
import Todo = require('../model/todo');
import routes = require('../routes');
import registry = require('../registry');
var html = React.DOM;

export interface TodoFooterProps {
    nowShowing: string;
    activeTodoCount: number;
    completedCount: number;
}

export class TodoFooterClass extends ReactTypescript.ReactComponentBase<TodoFooterProps, void> {
    
    
    onClearCompleted: () => void;
    
    shouldComponentUpdate(nextProps: TodoFooterProps, nextState: any): boolean {
        return (
            this.props.nowShowing !== nextProps.nowShowing ||
            this.props.activeTodoCount !== nextProps.activeTodoCount ||
            this.props.completedCount !== nextProps.completedCount
        )
    }
 
    render() {
        var activeTodoWord = Utils.pluralize(this.props.activeTodoCount, 'item');
        var clearButton = this.props.completedCount > 0 ? 
                html.button(
                    {
                        id: 'clear-completed',
                        onClick: this.onClearCompleted
                    },
                    ' Clear completed (' + this.props.completedCount + ') ' 
                ):
                null;

        var show: { [index: string]: string } = {};
        show[this.props.nowShowing] = 'selected';

        return html.footer(
            {id: 'footer'},
            html.span(
                {id: 'todo-count'},
                html.strong(null, this.props.activeTodoCount),
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
}


export var TodoFooter = ReactTypescript.registerComponent<TodoFooterClass, TodoFooterProps>(TodoFooterClass, ReactControls.ControlledDecorator);