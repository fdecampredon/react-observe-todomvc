/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*jshint browser:true */
/*global ObserveUtils */

var app = app || {};

(function (window) {
    'use strict';
    
    var Utils = app.Utils, 
        Todo = app.Todo;
    
    
    function FooterPM(todos) {
        this.todos = todos;
        var self = this;
        function updateCounts() {
            self.activeTodoCount = self.todos.reduce(function (accum, todo) {
                return todo.completed ? accum : accum + 1;
            }, 0);

            self.completedCount = self.todos.length - self.activeTodoCount;
        }
        updateCounts();
        
        Utils.deepObserve(this.todos, function () {
            updateCounts();
        });
    }
    
    FooterPM.prototype.clearCompleted = function () {
        var indexToRemoves = [];
        this.todos.forEach(function (todo, index) {
            if (todo.completed) {
               indexToRemoves.push(index);
            }
        });
        
        indexToRemoves.forEach(function (i, j) {
            this.todos.splice(i - j, 1);    
        }, this);
    };
    
    if (!window.nativeObjectObserve) {
        ObserveUtils.defineObservableProperties(FooterPM.prototype, 'activeTodoCount', 'completedCount');
    }
    
    app.FooterPM = FooterPM;
    
})(window);