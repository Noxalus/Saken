const http = require('http');
const express = require('express');
const logger = require('winston');
const socketio = require('socket.io');
const uuid = require('node-uuid');
const fs = require('fs');

let serverConfig = {};
const gameConfig = require('../lib/config.js');

function initializeSocket(server) {
  let io = socketio(server);
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
  let app = express();
  app.use(express.static(serverConfig.staticFolder));

  let server = http.Server(app);

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

    run();
});