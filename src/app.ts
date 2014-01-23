'use strict';

import React = require('react/addons');
import ObserveUtils = require('observe-utils');
import routes = require('./routes');
import registry = require('./registry');
import Utils = require('./utils/utils');
import Todo = require('./model/todo');
import ModelWrapper = require('./utils/model-wrapper');
import control = require('./utils/react-controller');
import FooterController = require('./controllers/footerController');
import TodoAppController = require('./controllers/appController');
import app = require('./views/todoApp');
import footer = require('./views/footer');
import item = require('./views/todoItem');



declare var require:any;
declare var setImmediate: any;

(<any>window).WeakMap = require('weak-map');
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

(<any>todos).id = "todoList";

var rootModel = {
    todos: todos,
    nowShowing : routes.ALL_TODOS
}
ObserveUtils.defineObservableProperties(rootModel, 'todos', 'nowShowing');

registry.modelWrapper = new ModelWrapper(rootModel);
registry.modelWrapper.addChangeHandler(() => {
    Utils.store('react-observe-todos', todos);
    requestAnimationFrame(() => {
        //(<any>application).performUpdateIfNecessary();
        application.forceUpdate();
    });
});

var appContoller = new TodoAppController(todos);
control.ControllerRegistry.instance.registerController(footer.TodoFooterClass, new FooterController(todos));
control.ControllerRegistry.instance.registerController(app.TodoAppClass, appContoller);
control.ControllerRegistry.instance.registerController(item.TodoItemClass, appContoller);


var router: any = new Router({
    '/': function () {
        rootModel.nowShowing = routes.ALL_TODOS;
    },
    '/active': function () {
        rootModel.nowShowing = routes.ACTIVE_TODOS;
    },
    '/completed': function () {
        rootModel.nowShowing = routes.COMPLETED_TODOS;
    }
});
router.init();

var application = app.TodoApp(rootModel);
React.renderComponent(application, document.getElementById('todoapp'));
React.renderComponent(html.div(
    null,
    html.p(null, 'Double-click to edit a todo'),
    html.p(null, 'Created by ', html.a({href: 'http://github.com/petehunt/'}, 'petehunt')),
    html.p(null, 'Part of ', html.a({href: 'http://todomvc.com'}, 'TodoMVC'))
), document.getElementById('info'));
