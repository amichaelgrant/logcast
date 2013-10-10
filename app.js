
/**
 * Module dependencies.
 */
var fs = require('fs');
var express = require('express');
var routes = require('./routes');
var logcast = require('./routes/logcast');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 8000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());

app.use( function(req, res, next){
	var username = req.query["username"];
	var password = req.query["password"];
	var userList = [];
	// try{
	// 	jsonFile = fs.readFileSync("user.json");
 //        userList = JSON.parse(jsonFile);
	// }catch(error){
	// 	next(error);
	// }

	// userList.forEach(function(row){
	// 	if(row.username == username && row.password == password)
	// 		next();
	// });

	next();
});

app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/logcast', logcast.index);

var appo = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


var harvester = require('./harvester.js').Harvester;
var io = require('socket.io').listen(appo);
io.sockets.on('connection', function (socket) {
    console.dir("connection etablished");

    socket.emit('logcast.init', { message: 'welcome to the logcast' });
    harvester(socket);
    
    socket.on('logcast', function (data) {     
        console.dir("data" + data); 
        io.sockets.emit('logcast', data); 
    });
});


