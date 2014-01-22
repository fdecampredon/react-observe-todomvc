'use strict';

import React = require('react/addons');
import ObserveUtils = require('observe-utils');
import routes = require('./routes');
import registry = require('./registry');
import Utils = require('./utils/utils');
import Todo = require('./model/todo');
import TodoAppPM = require('./views/todoAppPM');
import FooterPM = require('./views/footerPM');
import app = require('./views/todoApp');



declare var require:any;
declare var setImmediate: any;

if (typeof (<any>Object).observe !== 'function') {
    require('observe-shim');
    if (typeof setImmediate !== 'function') {
        require('setimmediate');
    }
}


var Router= require('director').Router,
    html = React.DOM,
    List = ObserveUtils.List;
   

var todoArr: Todo[] = Utils.store('react-observe-todos').map((todo: any) => {
    return Utils.assign(new Todo(), todo);
});

var todos: ObserveUtils.List<Todo> = List.fromArray(todoArr);



// A nice way to listen any changes in our collections and save it
Utils.deepObserve(todos, function () {
    Utils.store('react-observe-todos', todos);
});


registry.appModel = new TodoAppPM(todos);
registry.footerModel = new FooterPM(todos);



var router: any = new Router({
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


React.renderComponent(app.TodoApp(), document.getElementById('todoapp'));
React.renderComponent(html.div(
    null,
    html.p(null, 'Double-click to edit a todo'),
    html.p(null, 'Created by ', html.a({href: 'http://github.com/petehunt/'}, 'petehunt')),
    html.p(null, 'Part of ', html.a({href: 'http://todomvc.com'}, 'TodoMVC'))
), document.getElementById('info'));
