'use strict';

const socketio = require('socket.io-client');

function Network(game) {
  this.socket = null;

  this.initialize = function() {
    this.socket = socketio();

    this.initializeEvents();
  };

  this.initializeEvents = function() {
    this.socket.on('onconnected', function(data) {
      console.log('Player is connected: ' + data.id);

      game.createPlayer(data.id);
    });
  };
}

module.exports = Network;
