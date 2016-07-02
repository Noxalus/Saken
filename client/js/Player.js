'use strict';

const GameConfig = require('../../lib/Config');
const AbstractPlayer = require('../../lib/AbstractPlayer');

class Player extends AbstractPlayer {
  constructor(id, name, x, y, length) {
    super(id, name, x, y, length);
  }

  update(delta) {
    super.update(delta);
  }

  draw(context) {
    for (let i = 0; i < this.cells.length; i++) {
      const cell = this.cells[i];

      cell.draw(context);
    }
  }
}

module.exports = Player;