/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*jshint node:true */

var path = require('path'),
    express = require('express'),
    TodoApp = require('./views/TodoAPP'),
    React = require('react'),
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



app.get('/', function (req, res) {
    React.renderComponentToString(TodoApp({ todos: [] }), function (str) {
        res.render('layout', { reactOutput: str });
    });
});


// start the server
app.listen(config.port, function (err) {
    console.info("Server started; listening on port " + config.port);
});