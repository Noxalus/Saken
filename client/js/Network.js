'use strict';

const socketio = require('socket.io-client');

class Network {
  constructor(game) {
    this.socket = socketio();
    this.game = game;
  }

  initialize() {
    this.initializeEvents();
  }

  initializeEvents() {
    const that = this;

    this.socket.on('onconnected', function(data) {
      console.log('Player is connected: ' + data.id);

      that.game.createPlayer(data.id);
    });
  }
}

module.exports = Network;