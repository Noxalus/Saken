const DIRECTION = {
  LEFT: { value: 0, name: 'left' },
  UP: { value: 1, name: 'up' },
  RIGHT: { value: 2, name: 'right' },
  DOWN: { value: 3, name: 'down' }
}

const CELL_SIZE = 10;

Socket = {
  socket: null,

  initialize: function() {
    this.socket = io();

    this.initializeEvents();
  },

  initializeEvents: function() {
    var self = this;
    this.socket.on('onconnected', function(data){
      console.log('Player is connected: ' + data.id);
      
      Game.createPlayer(data.id);
    });
  }
}

// Cell class
function Cell(x, y, width = CELL_SIZE, height = CELL_SIZE) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
};

Cell.prototype.draw = function() {
  Game.canvas.context.fillStyle = "blue";
  Game.canvas.context.fillRect(this.x * this.width, this.y * this.height, this.width, this.height);
  Game.canvas.context.strokeStyle = "white";
  Game.canvas.context.strokeRect(this.x * this.width, this.y * this.height, this.width, this.height);
};

// Player class
function Player(id, x, y, length) {
  this.x = x;
  this.y = y;
  this.realX = x;
  this.realY = y;
  this.id = id;
  this.cells = [];
  this.currentDirection = DIRECTION.RIGHT;
  this.nextDirection = this.currentDirection;
  this.speed = 100;

  for (var i = 0; i < length; i++) {
    var cell = new Cell(x - i, y);
    this.cells.push(cell);
  }
};

Player.prototype.changeDirection = function(direction) {
  this.nextDirection = direction;
}

Player.prototype.update = function(delta) {
  var nextDirection = {
    x: 0,
    y: 0
  };

  if (this.currentDirection == DIRECTION.RIGHT)
    nextDirection.x++;
  else if (this.currentDirection == DIRECTION.LEFT)
    nextDirection.x--;
  else if (this.currentDirection == DIRECTION.UP)
    nextDirection.y--;
  else if (this.currentDirection == DIRECTION.DOWN)
    nextDirection.y++;

  var head = this.cells[0];

  var nextPosition = {
    x: this.realX + (nextDirection.x * (delta / 1000) * this.speed),
    y: this.realY + (nextDirection.y * (delta / 1000) * this.speed),
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

  if(nextPosition.x <= -1 || nextPosition.x >= Game.canvas.width / CELL_SIZE || 
     nextPosition.y <= -1 || nextPosition.y >= Game.height / CELL_SIZE)
  {
    Game.reset();
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

    if (Game.checkFoodCollision())
    {
      var tail = new Cell(nextPosition.x, nextPosition.y);
      
      Game.generateFood(10);
    }
    else
    {
      var tail = this.cells.pop();

      tail.x = nextPosition.x; 
      tail.y = nextPosition.y;

    }

    this.cells.unshift(tail);
  }

  this.realX = nextPosition.x;
  this.realY = nextPosition.y;
};

Player.prototype.draw = function() {
  for (var i = 0; i < this.cells.length; i++) {
    var cell = this.cells[i];

    cell.draw();
  }
};

Game = {
  initialize: function() {
    console.log('Initialize');

    this.initializeCanvas();
    this.initializeInputs();
    
    Socket.initialize();

    this.reset();

    this.initialized = true;
  },

  reset: function() {
    Game.cells = [];
    Game.generateFood(10);

    if (Game.player) {
      var id = Game.player.id;
      Game.createPlayer(Game.player.id);
    }
  },

  initializeCanvas: function() {
    this.canvas.canvas = $("#canvas")[0];
    this.canvas.canvas.width = window.innerWidth;
    this.canvas.canvas.height = window.innerHeight;
    this.canvas.context = canvas.getContext("2d");
    this.canvas.width = $("#canvas").width();
    this.canvas.height = $("#canvas").height();
  },

  initializeInputs: function() {
    $(document).keydown(this.handleInputs);
  },

  createPlayer: function(id) {
    var randomPosition = this.generateRandomPosition();
    this.player = new Player(id, randomPosition.x, randomPosition.y, 5);
  },

  generateRandomPosition: function() {
    var position = {};

    position.x = Math.round(Math.random() * ((this.canvas.width - CELL_SIZE) / CELL_SIZE));
    position.y = Math.round(Math.random() * ((this.canvas.height - CELL_SIZE) / CELL_SIZE));
    
    return position;
  },

  generateFood: function(number = 1) {
    for (var i = 0; i < number; i++) {
      var randomPosition = Game.generateRandomPosition();
      var cell = new Cell(randomPosition.x, randomPosition.y);
      Game.cells.push(cell);
    }
  },

  handleInputs: function(event) {
      var key = event.which;

      if(key == '37' && Game.player.currentDirection != DIRECTION.RIGHT) 
        Game.player.changeDirection(DIRECTION.LEFT);
      else if(key == '38' && Game.player.currentDirection != DIRECTION.DOWN) 
        Game.player.changeDirection(DIRECTION.UP);
      else if(key == '39' && Game.player.currentDirection != DIRECTION.LEFT) 
        Game.player.changeDirection(DIRECTION.RIGHT);
      else if(key == '40' && Game.player.currentDirection != DIRECTION.UP) 
        Game.player.changeDirection(DIRECTION.DOWN);
  },

  checkFoodCollision: function() {
    for (var i = 0; i < Game.cells.length; i++)
    {
      if (Game.player.x == Game.cells[i].x && Game.player.y == Game.cells[i].y)
      {
        Game.cells.splice(i, 1);

        return true;
      }
    }

    return false;
  },

  frameBegin: function() {
  },

  update: function(delta) {
    if (!Game.initialized)
      return;

    if (Game.player) {
      Game.player.update(delta);
    }
  },

  draw: function(delta) {
    if (!Game.initialized)
      return;

    Game.canvas.context.clearRect(0, 0, Game.canvas.width, Game.canvas.height);

    // Draw cells
    for (var i = 0; i < Game.cells.length; i++) {
      Game.cells[i].draw();
    }

    // Draw player
    if (Game.player) {
      Game.player.draw();
    }
  },

  frameEnd: function() {
  },

  initialized: false,
  canvas: {
      canvas: null,
      context: null,
      width: 0,
      height: 0
  },
  cells: [],
  player: null
}

$(document).ready(function() {
  Game.initialize();

  MainLoop.setBegin(Game.frameBegin);
  MainLoop.setUpdate(Game.update);
  MainLoop.setDraw(Game.draw);
  MainLoop.setEnd(Game.frameEnd);
  MainLoop.start();
});