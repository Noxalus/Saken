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
    this.inputSeq = 0;
    this.canvas = {
      canvas: null,
      context: null,
      width: 0,
      height: 0
    };

    this.clientTime = 0;
    this.serverTime = 0;
  }

  initialize() {
    this.initializeCanvas();
    this.initializeNetwork();
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

    if (this.localPlayer) {
      this.inputSeq += 1;

      this.localPlayer.pushInput({
        key: key,
        time: this.getTime(),
        seq: this.inputSeq
      });

      if (this.network) {
        let data = '';

        data += key + '.';
        data += this.getTime().toString().replace('.', '-') + '.';
        data += this.inputSeq;

        this.network.send(data);
      }
    }
  }

  increaseScore() {
    this.score++;
  }

  update(delta) {
    super.update(delta);

    if (this.localPlayer)
    {
      // console.log('Player: ', this.localPlayer.position);
      this.localPlayer.update(delta);
    }
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

    if (this.network) {
      $('#debug').html('Ping: ' + this.network.getPing());
    }
  }
}

module.exports = Game;