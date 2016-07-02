'use strict';

const GameConfig = require('./Config');

// Cell class
class Cell {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = (typeof width !== 'undefined') ? width : GameConfig.world.cellSize;
    this.height = (typeof height !== 'undefined') ? height : GameConfig.world.cellSize;
  }

  draw(context) {
    context.fillStyle = 'blue';
    context.fillRect(this.x * this.width, this.y * this.height, this.width, this.height);
    context.strokeStyle = 'white';
    context.strokeRect(this.x * this.width, this.y * this.height, this.width, this.height);
  }
}

module.exports = Cell;