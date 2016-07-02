'use strict';

const AbstractPlayer = require('../lib/AbstractPlayer');

class Player extends AbstractPlayer {
  constructor(id, name, x, y, length) {
    super(id, name, x, y, length);
  }
}

module.exports = Player;