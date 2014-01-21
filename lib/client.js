/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*jshint browser:true */
/*jshint node:true */

global.nativeObjectObserve = typeof Object.observe === 'function';
if (!global.nativeObjectObserve) {
    require('observe-shim');
    if  (typeof setImmediate === 'function') {
        require('setimmediate');
    } 
}
var React = require('react/addons'),
    Router = require('director').Router,
    ObserveUtils = require('observe-utils'),
    Utils = require('./utils'),
    Todo = require('./model/Todo'),
    routes = require('./routes'),
    TodoAppController = require('./controller/todoAppController'),
    TodoApp = require('./views/todoApp'),
    html = React.DOM,
    List = ObserveUtils.List;


var jsonData;
try {
    jsonData = JSON.parse(document.getElementById('react-data').innerHTML);
} catch(e) {
    jsonData = [];
}

var todos = List.fromArray(jsonData.map(function (todo) {
    return Utils.assign(new Todo(), todo);
}));

var todoApp = TodoApp({todos: todos, route: window.location.pathname}),
    todoAppController = new TodoAppController(todos);

var routerOptions = {};
if (typeof history !== 'undefined' && typeof history.pushState === 'function') {
    routerOptions.html5history = true;
    routerOptions.run_handler_in_init  = false;
}

var router = new Router({
    '/': function () {
        todoApp.setProps({route: routes.ALL_TODOS});
    },
    '/active': function () {
        todoApp.setProps({route: routes.ACTIVE_TODOS});
    },
    '/completed': function () {
        todoApp.setProps({route: routes.COMPLETED_TODOS});
    }
});
router.configure(routerOptions);
router.init();

Utils.MediatorRegistry.registerMediator('TodoApp', todoAppController);


React.renderComponent(todoApp, document.getElementById('todoapp'));
React.renderComponent(html.div(
    null,
    html.p(null, 'Double-click to edit a todo'),
    html.p(null, 'Created by ', html.a({href: 'http://github.com/petehunt/'}, 'petehunt')),
    html.p(null, 'Part of ', html.a({href: 'http://todomvc.com'}, 'TodoMVC'))
), document.getElementById('info'));
    