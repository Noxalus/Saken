var http = require('http');
var express = require('express');
var logger = require('winston');
var socketio = require('socket.io');
var uuid = require('node-uuid');
var fs = require('fs');

var serverConfig = {};
var gameConfig = {};

function initializeSocket(server) {
  var io = socketio(server);
  io.on('connection', function(client) {
      client.userid = uuid();

      client.emit('onconnected', { id: client.userid });

      logger.info('Player ' + client.userid + ' connected');

      client.on('disconnect', function () {
          logger.info('Client disconnected ' + client.userid);
      });
  });
}

function run() {
  var app = express();
  app.use(express.static(serverConfig.staticFolder));

  var server = http.Server(app);

  initializeSocket(server);

  server.listen(serverConfig.port, function(){
      logger.info('listening on *:' + serverConfig.port);
  });
}

// Load server config file
fs.readFile('./server/config.json', function (err, config) {
    if (err) {
        logger.error('Error loading server config file: ' + err);
        return;
    }

    serverConfig = JSON.parse(config);

    if (!serverConfig.port) {
        winston.error('Error loading config file: port is missing!');
        return;
    }

    // Load game config file
    fs.readFile('./lib/config.json', function (err, config) {
        if (err) {
            logger.error('Error loading game config file: ' + err);
            return;
        }

        gameConfig = JSON.parse(config);

        run();
    });
});