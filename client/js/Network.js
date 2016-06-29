'use strict';

const socketio = require('socket.io-client');

class Network {
  constructor(game) {
    this.socket = null;
    this.game = game;
  }

  initialize() {
    this.socket = socketio();

    this.initializeEvents();
  }

  initializeEvents() {
    let self = this;

    this.socket.on('onconnected', function(data) {
      console.log('Player is connected: ' + data.id);

      self.game.createPlayer(data.id);
    });
  }
}

module.exports = Network;