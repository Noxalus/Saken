const Cell = require('./Cell');

const CELL_SIZE = 25;

const DIRECTION = {
  LEFT: { value: 0, name: 'left' },
  UP: { value: 1, name: 'up' },
  RIGHT: { value: 2, name: 'right' },
  DOWN: { value: 3, name: 'down' }
};

// Player class
function Player(id, x, y, length, game) {
  this.x = x;
  this.y = y;
  this.realX = x;
  this.realY = y;
  this.id = id;
  this.cells = [];
  this.currentDirection = DIRECTION.RIGHT;
  this.nextDirection = this.currentDirection;
  this.speed = 5;

  for (let i = 0; i < length; i++) {
    let cell = new Cell(x - i, y);
    this.cells.push(cell);
  }

  this.changeDirection = function(direction) {
    this.nextDirection = direction;
  }

  this.checkBodyCollision = function() {
    for (let i = 0; i < this.cells.length; i++) {
      if (this.x == this.cells[i].x && this.y == this.cells[i].y)
        return true;
    }

    return false;
  }

  this.update = function(delta) {
    let nextDirection = {
      x: 0,
      y: 0
    };

    if (this.currentDirection.value == DIRECTION.RIGHT.value)
      nextDirection.x++;
    else if (this.currentDirection.value == DIRECTION.LEFT.value)
      nextDirection.x--;
    else if (this.currentDirection.value == DIRECTION.UP.value)
      nextDirection.y--;
    else if (this.currentDirection.value == DIRECTION.DOWN.value)
      nextDirection.y++;

    const head = this.cells[0];

    let nextPosition = {
      x: this.realX + (nextDirection.x * (1 / delta) * this.speed),
      y: this.realY + (nextDirection.y * (1 / delta) * this.speed),
    }

    // Make sure that we don't skip cells
    if (nextPosition.x > head.x + 1)
      nextPosition.x = head.x + 1;
    else if (nextPosition.x < head.x - 1)
      nextPosition.x = head.x - 1;
    else if (nextPosition.y > head.y + 1)
      nextPosition.y = head.y + 1;
    else if (nextPosition.y < head.y - 1)
      nextPosition.y = head.y - 1;

    if(nextPosition.x <= -1 || nextPosition.x >= game.getCanvas().width / CELL_SIZE || 
       nextPosition.y <= -1 || nextPosition.y >= game.getCanvas().height / CELL_SIZE)
    {
      game.reset();
      return;
    }

    // Moved to a new cell
    if (nextPosition.x == head.x + 1 || nextPosition.x == head.x - 1 ||
        nextPosition.y == head.y + 1 || nextPosition.y == head.y - 1)
    {
      if (this.currentDirection != this.nextDirection)
        this.currentDirection = this.nextDirection;

      this.x = nextPosition.x;
      this.y = nextPosition.y;

      let tail = null;

      if (game.checkFoodCollision())
      {
        tail = new Cell(nextPosition.x, nextPosition.y);
        
        game.generateFood();
        game.increaseScore();
      }
      else if (this.checkBodyCollision())
      {
        game.reset();
        return;
      }
      else
      {
        tail = this.cells.pop();

        tail.x = nextPosition.x; 
        tail.y = nextPosition.y;
      }

      this.cells.unshift(tail);
    }

    this.realX = nextPosition.x;
    this.realY = nextPosition.y;
  };

  this.draw = function() {
    for (let i = 0; i < this.cells.length; i++) {
      let cell = this.cells[i];

      cell.draw(game.getCanvas().context);
    }
  };
};

module.exports = Player;