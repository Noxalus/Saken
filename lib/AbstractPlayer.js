'use strict';

const Config = require('./Config');
const Cell = require('./Cell');
const DIRECTION = require('./Direction');

class AbstractPlayer {
    constructor(id, name, x, y, length) {
      this.id = id;
      this.name = name;
      this.position = { x, y };
      this.realPosition = { x, y };
      this.direction = DIRECTION.RIGHT;
      this.nextDirection = this.direction;
      this.speed = Config.player.defaultSpeed;

      this.cells = [];

      for (let i = 0; i < length; i++) {
        const cell = new Cell(x - i, y);

        this.cells.push(cell);
      }
    }

    toJSON() {
      return {
        id: this.id,
        name: this.name,
        position: Object.assign({}, this.position),
        length: this.cells.length
      };
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

    getDirection() {
      return this.direction;
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

      switch (this.direction) {
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
        x: this.realPosition.x + (nextDirection.x * (delta / 1000) * this.speed),
        y: this.realPosition.y + (nextDirection.y * (delta / 1000) * this.speed),
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

      // // Die touching the border
      // if (nextPosition.x <= -1 || nextPosition.x >= GameConfig.world.width / GameConfig.world.cellSize ||
      //     nextPosition.y <= -1 || nextPosition.y >= GameConfig.world.height / GameConfig.world.cellSize) {
      //   this.game.reset();

      //   return;
      // }

      // Moved to a new cell
      if (nextPosition.x === head.x + 1 || nextPosition.x === head.x - 1 ||
          nextPosition.y === head.y + 1 || nextPosition.y === head.y - 1) {
        if (this.direction !== this.nextDirection) {
          this.direction = this.nextDirection;
        }

        this.x = nextPosition.x;
        this.y = nextPosition.y;

        let tail = null;

        // if (this.game.checkFoodCollision()) {
        //   tail = new Cell(nextPosition.x, nextPosition.y);

        //   this.game.generateFood();
        //   this.game.increaseScore();
        // } else if (this.checkBodyCollision()) {
        //   this.game.reset();

        //   return;
        // } else {
          tail = this.cells.pop();

          tail.x = nextPosition.x;
          tail.y = nextPosition.y;
        // }

        this.position.x = nextPosition.x;
        this.position.y = nextPosition.y;

        this.cells.unshift(tail);
      }

      this.realPosition.x = nextPosition.x;
      this.realPosition.y = nextPosition.y;
    }
  }

module.exports = AbstractPlayer;