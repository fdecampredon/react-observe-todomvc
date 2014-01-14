/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*jshint browser:true */
/*global ObserveUtils  */

var app = app || {};

(function (window, React) {
    'use strict';

    function Todo() { }
    
    if (!window.nativeObjectObserve) {
        ObserveUtils.defineObservableProperties(Todo.prototype, 'title', 'completed');
        Todo.prototype.toJSON = function () {
            return {
                title: this.title,
                completed: this.completed,
                id: this.id
            };
        };
    }
    app.Todo = Todo;
    
})(window);