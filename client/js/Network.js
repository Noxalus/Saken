const socketio = require('socket.io-client');

const Game = require('./Game');

function Network ({game}) {
  let socket = null;

  this.initialize = function() {
    this.socket = socketio();

    this.initializeEvents();
  };

  this.initializeEvents = function() {
    this.socket.on('onconnected', function(data){
      console.log('Player is connected: ' + data.id);

      game.createPlayer(data.id);
    });
  };

  this.initialize();
}

module.exports = Network;