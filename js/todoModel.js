/**
 * @jsx React.DOM
 */
/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global ImmutableWrapper*/
var app = app || {};

(function () {
	'use strict';

	var Utils = app.Utils;
	// Generic "model" object. You can use whatever
	// framework you want. For this application it
	// may not even be worth separating this logic
	// out, but we do this to demonstrate one way to
	// separate out parts of your application.
	app.TodoModel = function (key) {
		this.key = key;
        this.wrapper = new Immutable(Utils.store(key) || []);
		this.todos = this.wrapper.data;
		this.onChanges = [];
        this.wrapper.addChangeListener(function () {
            this.todos = this.wrapper.data;
            Utils.store(this.key, this.todos);
        }.bind(this));
	};

	app.TodoModel.prototype.subscribe = function (onChange) {
		this.wrapper.addChangeListener(onChange);
	};


	app.TodoModel.prototype.addTodo = function (title) {
		this.todos.push({
			id: Utils.uuid(),
			title: title,
			completed: false
		});
	};

	app.TodoModel.prototype.toggleAll = function (checked) {
        this.todos.forEach(function (todo) {
            todo.update({completed: checked});
        });
	};

	app.TodoModel.prototype.toggle = function (todoToToggle) {
		todoToToggle.update({completed: !todoToToggle.completed});
	};

	app.TodoModel.prototype.destroy = function (todo) {
		this.todos.remove(todo);
	};

	app.TodoModel.prototype.save = function (todoToSave, text) {
		todoToSave.update({title: text});
	};

	app.TodoModel.prototype.clearCompleted = function () {
		this.todos.update(this.todos.filter(function (todo) {
			return !todo.completed;
		}));
	};

})();