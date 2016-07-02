'use strict';

const $ = require('jquery');

const Network = require('./Network');
const Player = require('./Player');
const DIRECTION = require('../../lib/Direction');
const GameConfig = require('../../lib/Config');
const AbstractGame = require('../../lib/AbstractGame');
const Utils = require('../../lib/Utils');

class Game extends AbstractGame {
  constructor() {
    super();

    this.network = null;
    this.player = null;
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

    this.reset();
  }

  reset() {
    this.cells = [];
    this.generateFood(10);

    if (this.player) {
      this.createPlayer(this.player.id);
    }

    this.score = 0;
  }

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

  createPlayer(id) {
    const randomPosition = Utils.generateRandomPosition();

    this.player = new Player(id, '[NAME]', randomPosition.x, randomPosition.y, GameConfig.player.defaultLength);
    super.addPlayer(this.player);
  }

  handleInput(event) {
    const key = event.which;

    if (key === 37 && this.player.currentDirection !== DIRECTION.RIGHT) {
      this.player.changeDirection(DIRECTION.LEFT);
    } else if (key === 38 && this.player.currentDirection !== DIRECTION.DOWN) {
      this.player.changeDirection(DIRECTION.UP);
    } else if (key === 39 && this.player.currentDirection !== DIRECTION.LEFT) {
      this.player.changeDirection(DIRECTION.RIGHT);
    } else if (key === 40 && this.player.currentDirection !== DIRECTION.UP) {
      this.player.changeDirection(DIRECTION.DOWN);
    }
  }

  increaseScore() {
    this.score++;
  }

  update(delta) {
    super.update(delta);
  }

  draw() {
    this.canvas.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw cells
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i].draw(this.canvas.context);
    }

    // Draw player
    if (this.player) {
      this.player.draw(this.canvas.context);
    }

    const scoreText = 'Score: ' + this.score;

    $('#score').html(scoreText);
  }
}

module.exports = Game;