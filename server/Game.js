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
    this.gameLoop = new Timer(Config.networkTimestep, function(delta) {
      that.update(delta);
    });
  }

  start() {
    this.gameLoop.start();
  }

  update(delta) {
    super.update(delta);

    this.network.sendUpdates();
    this.clearEvents();
  }

  stop() {
    super.stop();
  }

  addPlayer(player) {
    super.addPlayer(player);
  }
}

module.exports = Game;