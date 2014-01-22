'use strict';
    
import React = require('react/addons');
import Utils = require('../utils/utils');
import ObserverDecorator = require('../utils/observe-decorator');
import ReactTypescript = require('../utils/react-typescript');
import Todo = require('../model/todo');
import routes = require('../routes');
import registry = require('../registry');
import FooterPM = require('./footerPM');
var html = React.DOM;

export interface TodoFooterProps {
    nowShowing: string;
}

export class TodoFooterClass  extends ReactTypescript.ReactComponentBase<TodoFooterProps, void> {
    
    private model: FooterPM;
    
    getObservedObjects() {
        return [this.model];
    }
    
    componentWillMount() {
        
        
        // We injec the model by global references here
        // However in more sophisticated architecture, 
        // we could use some kind of IOC container
        this.model = registry.footerModel;
    }
    
    clearCompleted() {
        this.model.clearCompleted();
    }
    
    render() {
        var activeTodoWord = Utils.pluralize(this.model.activeTodoCount, 'item');
        var clearButton = this.model.completedCount > 0 ? 
                html.button(
                    {
                        id: 'clear-completed',
                        onClick: this.clearCompleted
                    },
                    ' Clear completed (' + this.model.completedCount + ') ' 
                ):
                null;

        var show: { [index: string]: string } = {};
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
}


export var TodoFooter = ReactTypescript.registerComponent<TodoFooterClass, TodoFooterProps>(TodoFooterClass, ObserverDecorator);