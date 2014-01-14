/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*jshint browser:true */
/*global React, ObserveUtils, Router */

var app = app || {};

(function (window, React) {
    'use strict';

    var html = React.DOM,
        TodoApp = app.TodoApp,
        FooterPM = app.FooterPM,
        TodoAppPM= app.TodoAppPM,
        Todo = app.Todo,
        Utils = app.Utils,
        List = ObserveUtils.List;
    
    var todos = List.fromArray(Utils.store('react-observe-todos').map(function (todo) {
        return Utils.assign(new Todo(), todo);
    }));
    
    
    
    // A nice way to listen any changes in our collections and save it
    Utils.deepObserve(todos, function () {
        Utils.store('react-observe-todos', todos);
    });
    
    
    var ALL_TODOS = app.ALL_TODOS = 'all',
        ACTIVE_TODOS = app.ACTIVE_TODOS = 'active', 
        COMPLETED_TODOS = app.COMPLETED_TODOS = 'completed';
    
    app.appModel = new TodoAppPM(todos);
    app.footerModel = new FooterPM(todos);
    
    
    
    var router = new Router({
        '/': function () {
            app.appModel.nowShowing = ALL_TODOS;
        },
        '/active': function () {
            app.appModel.nowShowing = ACTIVE_TODOS;
        },
        '/completed': function () {
            app.appModel.nowShowing = COMPLETED_TODOS;
        }
    });
    router.init();
    
    React.renderComponent(TodoApp(), document.getElementById('todoapp'));
    React.renderComponent(html.div(
        null,
        html.p(null, 'Double-click to edit a todo'),
        html.p(null, 'Created by ', html.a({href: 'http://github.com/petehunt/'}, 'petehunt')),
        html.p(null, 'Part of ', html.a({href: 'http://todomvc.com'}, 'TodoMVC'))
    ), document.getElementById('info'));
    
        
})(window, React);