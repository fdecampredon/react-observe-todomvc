/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*jshint browser:true */
/*jshint node:true */

global.nativeObjectObserve = typeof Object.observe === 'function';
if (!global.nativeObjectObserve) {
    require('observe-utils');
    if  (typeof setImmediate === 'function') {
        require('setimmediate');
    } 
}
var React = require('react'),
    Router = require('director'),
    ObserveUtils = require('observe-utils'),
    Utils = require('./utils'),
    Todo = require('./model/Todo'),
    registry = require('./registry'),
    routes = require('./routes'),
    FooterPM = require('./views/footerPM'),
    TodoAppPM = require('./views/TodoAppPM'),
    TodoApp = require('./views/TodoApp'),
    html = React.html,
    List = ObserveUtils.List;

/*
var html = React.DOM,
    TodoApp = app.TodoApp,
    FooterPM = app.FooterPM,
    TodoAppPM= app.TodoAppPM,
    Todo = app.Todo,
    Utils = app.Utils,
    List = ObserveUtils.List;*/

var todos = List.fromArray(Utils.store('react-observe-todos').map(function (todo) {
    return Utils.assign(new Todo(), todo);
}));



// A nice way to listen any changes in our collections and save it
Utils.deepObserve(todos, function () {
    Utils.store('react-observe-todos', todos);
});



registry.appModel = new TodoAppPM(todos);
registry.footerModel = new FooterPM(todos);



var router = new Router({
    '/': function () {
        registry.appModel.nowShowing = routes.ALL_TODOS;
    },
    '/active': function () {
        registry.appModel.nowShowing = routes.ACTIVE_TODOS;
    },
    '/completed': function () {
        registry.appModel.nowShowing = routes.COMPLETED_TODOS;
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
    