'use strict';

const GameConfig = require('../../lib/Config');
const AbstractPlayer = require('../../lib/AbstractPlayer');
const DIRECTION = require('../../lib/Direction');

class Player extends AbstractPlayer {
  constructor(id, name, x, y, length) {
    super(id, name, x, y, length);
  }

  draw(context) {
    for (let i = 0; i < this.cells.length; i++) {
      const cell = this.cells[i];
      cell.draw(context);
    }

    context.fillStyle = 'white';
    context.fillText(
      this.name,
      this.position.x * GameConfig.world.cellSize,
      this.position.y * GameConfig.world.cellSize - 10
    );
  }
}

module.exports = Player;