'use strict';

const Config = require('./Config');

class AbstractPlayer {
    constructor(id, name, x, y, length) {
      this.id = id;
      this.name = name;
      this.position = { x, y };
      this.speed = Config.player.defaultSpeed;
    }

    getId() {
      return this.id;
    }

    getName() {
      return this.name;
    }

    getPosition() {
      return this.position;
    }

    setPosition(x, y) {
      this.position = { x, y };
    }
}

module.exports = AbstractPlayer;