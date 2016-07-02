'use strict';

const GameConfig = require('../lib/Config');
const Config = require('./Config');
const AbstractGame = require('../lib/AbstractGame');
const Timer = require('../lib/Timer');
const Player = require('./Player');
const Network = require('./Network');

class Game extends AbstractGame {
  constructor(server) {
    super();

    const that = this;

    this.network = new Network(this, server);
    this.gameLoop = new Timer(Config.networkTimestep, function() {
        // console.log('Update network loop');
        const playerState = that.getStateForPlayer;
        that.network.sendUpdates(playerState);
        // game.clearEvents();
      }
    );
  }

  start() {
    super.start();

    this.network.start();
    this.gameLoop.start();
  }

  stop() {
    super.stop();
  }

  addPlayer(player) {
    super.addPlayer(player);
  }
}

module.exports = Game;