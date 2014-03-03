/**
 * @jsx React.DOM
 */
/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React */
var app = app || {};

(function () {
	'use strict';

	app.TodoFooter = React.createClass({displayName: 'TodoFooter',
		render: function () {
			var activeTodoWord = app.Utils.pluralize(this.props.count, 'item');
			var clearButton = null;

			if (this.props.completedCount > 0) {
				clearButton = (
					React.DOM.button(
						{id:"clear-completed",
						onClick:this.props.onClearCompleted}, 
						"Clear completed (",this.props.completedCount,")"
					)
				);
			}

			// React idiom for shortcutting to `classSet` since it'll be used often
			var cx = React.addons.classSet;
			var nowShowing = this.props.nowShowing;
			return (
				React.DOM.footer( {id:"footer"}, 
					React.DOM.span( {id:"todo-count"}, 
						React.DOM.strong(null, this.props.count), " ", activeTodoWord, " left"
					),
					React.DOM.ul( {id:"filters"}, 
						React.DOM.li(null, 
							React.DOM.a(
								{href:"#/",
								className:cx({selected: nowShowing === app.ALL_TODOS})}, 
									"All"
							)
						),
						' ',
						React.DOM.li(null, 
							React.DOM.a(
								{href:"#/active",
								className:cx({selected: nowShowing === app.ACTIVE_TODOS})}, 
									"Active"
							)
						),
						' ',
						React.DOM.li(null, 
							React.DOM.a(
								{href:"#/completed",
								className:cx({selected: nowShowing === app.COMPLETED_TODOS})}, 
									"Completed"
							)
						)
					),
					clearButton
				)
			);
		}
	});
})();
