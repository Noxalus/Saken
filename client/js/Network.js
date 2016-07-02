'use strict';

const socketio = require('socket.io-client');
const Player = require('./Player');
const ClientConfig = require('./Config');

class Network {
  constructor(game) {
    this.socket = socketio();
    this.game = game;
    this.netLatency = 0;
    this.netPing = 0;
  }

  getPing() {
    return this.netPing;
  }

  initialize() {
    this.initializeEvents();

    // Ping the server
    const that = this;
    const pingInterval = setInterval(() => {
      const previousPing = new Date().getTime();
      that.socket.emit('clientPing', previousPing);
    }, ClientConfig.pingTimeout);
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
      that.onServerUpdate(data);
    });

    this.socket.on('serverPing', (data) => {
      that.netPing = new Date().getTime() - data;
      that.netLatency = that.netPing / 2;
    });
  }

  onConnected(data) {
    console.log('onConnected', data);

    const player = new Player(data.id, data.name, data.position.x, data.position.y, data.length);

    this.game.setLocalPlayer(player);
  }

  onPlayerJoined(data) {
      console.log('onPlayerJoined: ', data);

      const player = new Player(data.id, data.name, data.position.x, data.position.y, data.length);

      this.game.addPlayer(player);
  }

  onServerUpdate(data) {
    // console.log('onServerUpdate', data);
  }

  getNetLatency() {
    return this.netLatency;
  }

  getNetPing() {
    return this.netPing;
  }

  send(data) {
    this.socket.send(data);
  }
}

module.exports = Network;