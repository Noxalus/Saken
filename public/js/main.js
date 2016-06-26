var DIRECTION = {
  LEFT: { value: 0, name: 'left' },
  UP: { value: 1, name: 'up' },
  RIGHT: { value: 2, name: 'right' },
  DOWN: { value: 3, name: 'down' }
}

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
function Cell(x, y, width = 10, height = 10) {
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
  this.id = id;
  this.cells = [];
  this.currentDirection = DIRECTION.RIGHT;

  for (var i = 0; i < length; i++) {
    var cell = new Cell(this.x - i, y);

    this.cells.push(cell);
  }
};

Player.prototype.setCurrentDirection = function(direction) {
  this.currentDirection = direction;
}

Player.prototype.update = function(delta) {
  var nextPosition = { 
    x: this.cells[0].x, 
    y: this.cells[0].y 
  };

  if (this.currentDirection == DIRECTION.RIGHT)
    nextPosition.x++;
  else if (this.currentDirection == DIRECTION.LEFT)
    nextPosition.x--;
  else if (this.currentDirection == DIRECTION.UP)
    nextPosition.y--;
  else if (this.currentDirection == DIRECTION.DOWN)
    nextPosition.y++;

  if(nextPosition.x == -1 || nextPosition.x == Game.canvas.width / 10 || 
     nextPosition.y == -1 || nextPosition.y == Game.height / 10)
  {
    Game.reset();
    return;
  }

  var tail = this.cells.pop();
  tail.x = nextPosition.x; 
  tail.y = nextPosition.y;

  this.cells.unshift(tail);
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
    // Generate random cells
    for (var i = 0; i < 10; i++) {
      var randomPosition = this.generateRandomPosition();
      var cell = new Cell(randomPosition.x, randomPosition.y);

      Game.cells.push(cell);
    }

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

    position.x = Math.round(Math.random() * ((this.canvas.width - 10) / 10));
    position.y = Math.round(Math.random() * ((this.canvas.height - 10) / 10));
    
    return position;
  },

  handleInputs: function(event) {
      var key = event.which;

      if(key == '37' && Game.player.currentDirection != DIRECTION.RIGHT) 
        Game.player.setCurrentDirection(DIRECTION.LEFT);
      else if(key == '38' && Game.player.currentDirection != DIRECTION.DOWN) 
        Game.player.setCurrentDirection(DIRECTION.UP);
      else if(key == '39' && Game.player.currentDirection != DIRECTION.LEFT) 
        Game.player.setCurrentDirection(DIRECTION.RIGHT);
      else if(key == '40' && Game.player.currentDirection != DIRECTION.UP) 
        Game.player.setCurrentDirection(DIRECTION.DOWN);
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

    // Game.canvas.context.fillStyle = "white";
    // Game.canvas.context.fillRect(0, 0, Game.canvas.width, Game.canvas.height);
    // Game.canvas.context.strokeStyle = "black";
    // Game.canvas.context.strokeRect(0, 0, Game.canvas.width, Game.canvas.height);

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