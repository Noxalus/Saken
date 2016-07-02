'use strict';

const AbstractPlayer = require('../lib/AbstractPlayer');

class Player extends AbstractPlayer {
  constructor(id, name, x, y, length) {
    super(id, name, x, y, length);
  }

  getName() {
    return this.name;
  }
}

module.exports = Player;