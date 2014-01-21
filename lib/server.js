/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*jshint node:true */

var path = require('path'),
    express = require('express'),
    React = require('react/addons'),
    TodoApp = require('./views/TodoAPP'),
    routes = require('./routes'),
    app = express();


var config = {
  port: 8000
};



// views
app.set('views', __dirname);
app.set('view engine', 'ejs');

// routing and static files
app.use(app.router);
app.use(express.static(path.join(__dirname, '../public')));



var todos = [];

function renderReact(req, res) {
    React.renderComponentToString(TodoApp({ todos: todos, route: req.params.name }), function (str) {
        res.render('index', { reactContent: str, data: JSON.stringify(todos) });
    });
}

Object.keys(routes).forEach(function (route) {
    app.get(routes[route], renderReact);
});

app.post('/todo', function (req, res) {
    todos.push({
        id: req.body.id,
        title: req.body.title,
        completed: req.body.completed
    });
    res.send(req.body.id);
});




// start the server
app.listen(config.port, function (err) {
    console.info("Server started; listening on port " + config.port);
});