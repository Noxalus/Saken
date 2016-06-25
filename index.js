var gameport = process.env.PORT || 4242;
var staticFolder = 'public';

var http = require('http');
var express = require('express');
var logger = require('winston');
var socketio = require('socket.io');
var uuid = require('node-uuid');

var app = express();
app.use(express.static(staticFolder));

var server = http.Server(app);

app.get('/*' , function(req, res, next) {
    var file = req.params[0]; 

    logger.info('File requested: ' + file);

    res.sendFile(__dirname + '/' + staticFolder + '/' + file);
});

var socketio = socketio(server);

socketio.on('connection', function(client) {
    client.userid = uuid();

    client.emit('onconnected', { id: client.userid });

    logger.info('Player ' + client.userid + ' connected');

    client.on('disconnect', function () {
        logger.info('Client disconnected ' + client.userid);
    });
});

server.listen(gameport, function(){
    logger.info('listening on *:' + gameport);
});