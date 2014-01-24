'use strict';
    
import Todo = require('../model/todo');
import TodoFooter = require('../views/footer');


class FooterController {
    
    constructor(
        private todos: ObserveUtils.List<Todo>
    ) {
        this.todos = todos;
    }

    componentDidMount(footer: TodoFooter) {
        footer.onClearCompleted = this.clearCompleted;
    }
    
    componentWillUnmount(footer: TodoFooter) {
        footer.onClearCompleted = null
    }
    
    clearCompleted = () => {
        var indexToRemoves: number[] = [];
        this.todos.forEach(function (todo, index) {
            if (todo.completed) {
               indexToRemoves.push(index);
            }
        });
        
        indexToRemoves.forEach(function (i, j) {
            this.todos.splice(i - j, 1);    
        }, this);
    }
    
}

export = FooterController;