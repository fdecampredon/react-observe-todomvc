/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*jshint browser:true */
/*jshint node: true*/

'use strict';

var ObserveUtils = require('observe-utils');

function Todo() { }

if (!global.nativeObjectObserve) {
    ObserveUtils.defineObservableProperties(Todo.prototype, 'title', 'completed');
    Todo.prototype.toJSON = function () {
        return {
            title: this.title,
            completed: this.completed,
            id: this.id
        };
    };
}
module.exports = Todo;