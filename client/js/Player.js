'use strict';

const Cell = require('./Cell');
const DIRECTION = require('./Direction');

const CELL_SIZE = 25;

class Player {
  constructor(id, x, y, length, game) {
    this.x = x;
    this.y = y;
    this.realX = x;
    this.realY = y;
    this.id = id;
    this.cells = [];
    this.currentDirection = DIRECTION.RIGHT;
    this.nextDirection = this.currentDirection;
    this.speed = 5;
    this.game = game;

    this.initialize(length);
  }

  initialize(length) {
    for (let i = 0; i < length; i++) {
      const cell = new Cell(this.x - i, this.y);

      this.cells.push(cell);
    }
  }

  changeDirection(direction) {
    this.nextDirection = direction;
  }

  checkBodyCollision() {
    for (let i = 0; i < this.cells.length; i++) {
      if (this.x === this.cells[i].x && this.y === this.cells[i].y) {
        return true;
      }
    }

    return false;
  }

  getNexDirection() {
    const nextDirection = {
      x: 0,
      y: 0
    };

    switch (this.currentDirection) {
      case DIRECTION.RIGHT:
        nextDirection.x++;
        break;
      case DIRECTION.LEFT:
        nextDirection.x--;
        break;
      case DIRECTION.UP:
        nextDirection.y--;
        break;
      case DIRECTION.DOWN:
        nextDirection.y++;
        break;
      default:
        break;
    }

    return nextDirection;
  }

  getNexPosition(head, nextDirection, delta) {
    const nextPosition = {
      x: this.realX + (nextDirection.x * (1 / delta) * this.speed),
      y: this.realY + (nextDirection.y * (1 / delta) * this.speed),
    };

    // Make sure that we don't skip cells
    if (nextPosition.x > head.x + 1) {
      nextPosition.x = head.x + 1;
    } else if (nextPosition.x < head.x - 1) {
      nextPosition.x = head.x - 1;
    } else if (nextPosition.y > head.y + 1) {
      nextPosition.y = head.y + 1;
    } else if (nextPosition.y < head.y - 1) {
      nextPosition.y = head.y - 1;
    }

    return nextPosition;
  }

  update(delta) {
    const nextDirection = this.getNexDirection();

    const head = this.cells[0];

    const nextPosition = this.getNexPosition(head, nextDirection, delta);

    if (nextPosition.x <= -1 || nextPosition.x >= this.game.getCanvas().width / CELL_SIZE ||
        nextPosition.y <= -1 || nextPosition.y >= this.game.getCanvas().height / CELL_SIZE) {
      this.game.reset();

      return;
    }

    // Moved to a new cell
    if (nextPosition.x === head.x + 1 || nextPosition.x === head.x - 1 ||
        nextPosition.y === head.y + 1 || nextPosition.y === head.y - 1) {
      if (this.currentDirection !== this.nextDirection) {
        this.currentDirection = this.nextDirection;
      }

      this.x = nextPosition.x;
      this.y = nextPosition.y;

      let tail = null;

      if (this.game.checkFoodCollision()) {
        tail = new Cell(nextPosition.x, nextPosition.y);

        this.game.generateFood();
        this.game.increaseScore();
      } else if (this.checkBodyCollision()) {
        this.game.reset();

        return;
      } else {
        tail = this.cells.pop();

        tail.x = nextPosition.x;
        tail.y = nextPosition.y;
      }

      this.cells.unshift(tail);
    }

    this.realX = nextPosition.x;
    this.realY = nextPosition.y;
  }

  draw() {
    for (let i = 0; i < this.cells.length; i++) {
      const cell = this.cells[i];

      cell.draw(this.game.getCanvas().context);
    }
  }
}

module.exports = Player;