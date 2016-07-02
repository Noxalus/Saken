'use strict';

const $ = require('jquery');

const Network = require('./Network');
const DIRECTION = require('../../lib/Direction');
const GameConfig = require('../../lib/Config');
const AbstractGame = require('../../lib/AbstractGame');
const Utils = require('../../lib/Utils');

class Game extends AbstractGame {
  constructor() {
    super();

    this.network = null;
    this.localPlayer = null;
    this.score = 0;
    this.canvas = {
      canvas: null,
      context: null,
      width: 0,
      height: 0
    };
  }

  initialize() {
    this.initializeCanvas();
    this.initializeNetwork();

    // this.reset();
  }

  // reset() {
  //   this.cells = [];
  //   this.generateFood(10);

  //   if (this.player) {
  //     this.createPlayer(this.player.id);
  //   }

  //   this.score = 0;
  // }

  initializeCanvas() {
    const c = $('#canvas')[0];

    c.width = window.innerWidth;
    c.height = window.innerHeight;

    this.canvas.canvas = c;
    this.canvas.context = c.getContext('2d');
    this.canvas.width = $('#canvas').width();
    this.canvas.height = $('#canvas').height();
  }

  initializeNetwork() {
    this.network = new Network(this);
    this.network.initialize();
  }

  getLocalPlayer(player) {
    return this.localPlayer;
  }

  setLocalPlayer(player) {
    this.localPlayer = player;
  }

  handleInput(event) {
    if (!this.localPlayer)
      return;

    const key = event.which;

    if (key === 37 && this.localPlayer.getDirection() !== DIRECTION.RIGHT) {
      this.localPlayer.changeDirection(DIRECTION.LEFT);
    } else if (key === 38 && this.localPlayer.getDirection() !== DIRECTION.DOWN) {
      this.localPlayer.changeDirection(DIRECTION.UP);
    } else if (key === 39 && this.localPlayer.getDirection() !== DIRECTION.LEFT) {
      this.localPlayer.changeDirection(DIRECTION.RIGHT);
    } else if (key === 40 && this.localPlayer.getDirection() !== DIRECTION.UP) {
      this.localPlayer.changeDirection(DIRECTION.DOWN);
    }
  }

  increaseScore() {
    this.score++;
  }

  update(delta) {
    super.update(delta);

    if (this.localPlayer)
      this.localPlayer.update(delta);
  }

  draw() {
    this.canvas.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw cells
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i].draw(this.canvas.context);
    }

    // Draw player
    for (const player of this.players.values()) {
      player.draw(this.canvas.context);
    }

    if (this.localPlayer)
      this.localPlayer.draw(this.canvas.context);

    const scoreText = 'Score: ' + this.score;

    $('#score').html(scoreText);
  }
}

module.exports = Game;