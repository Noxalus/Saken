'use strict';

const socketio = require('socket.io-client');
const Player = require('./Player');

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

    this.socket.on('onConnected', function(data) {
      that.onConnected(data);
    });

    this.socket.on('onPlayerJoined', function(data) {
      that.onPlayerJoined(data);
    });

    this.socket.on('onServerUpdate', function(data) {
      // console.log('onServerUpdate', data);
    });
  }

  onConnected(data) {
    console.log('onConnected', data);

    const player = new Player(data.id, data.name, data.position.x, data.position.y, data.length);

    // this.game.addPlayer(player);
    this.game.setLocalPlayer(player);
  }

  onPlayerJoined(data) {
      console.log('onPlayerJoined: ', data);

      const player = new Player(data.id, data.name, data.position.x, data.position.y, data.length);

      this.game.addPlayer(player);
  }
}

module.exports = Network;