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
      Player.id = data.id;
    });
  }
}

// Cell class
function Cell(x, y, width = 10, height = 10) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
}

Cell.prototype.draw = function() {
  Game.canvas.context.fillStyle = "blue";
  Game.canvas.context.fillRect(this.x * this.width, this.y * this.height, this.width, this.height);
  Game.canvas.context.strokeStyle = "white";
  Game.canvas.context.strokeRect(this.x * this.width, this.y * this.height, this.width, this.height);
}

Player = {
  id: null
}

Game = {
  initialize: function() {
    console.log('Initialize');

    this.initializeCanvas();
    
    Socket.initialize();

    Game.cells = [];
    // Generate random cells
    for (var i = 0; i < 10000; i++) {
      var cell = new Cell(
        Math.round(Math.random() * ((this.canvas.width - 10) / 10)),
        Math.round(Math.random() * ((this.canvas.height - 10) / 10))
      );

      Game.cells.push(cell);
    }

    this.initialized = true;
  },

  initializeCanvas: function() {
    this.canvas.canvas = $("#canvas")[0];
    this.canvas.canvas.width = window.innerWidth;
    this.canvas.canvas.height = window.innerHeight;
    this.canvas.context = canvas.getContext("2d");
    this.canvas.width = $("#canvas").width();
    this.canvas.height = $("#canvas").height();
  },

  frameBegin: function() {
  },

  update: function(delta) {
    if (!Game.initialized)
      return;
  },

  draw: function(delta) {
    if (!Game.initialized)
      return;

    // Game.canvas.context.clearRect(0, 0, Game.canvas.width, Game.canvas.height);

    Game.canvas.context.fillStyle = "white";
    Game.canvas.context.fillRect(0, 0, Game.canvas.width, Game.canvas.height);
    Game.canvas.context.strokeStyle = "black";
    Game.canvas.context.strokeRect(0, 0, Game.canvas.width, Game.canvas.height);

    for (var i = 0; i < Game.cells.length; i++) {
      Game.cells[i].draw();
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
  cells: []
}

$(document).ready(function() {
  Game.initialize();

  MainLoop.setBegin(Game.frameBegin);
  MainLoop.setUpdate(Game.update);
  MainLoop.setDraw(Game.draw);
  MainLoop.setEnd(Game.frameEnd);
  MainLoop.start();
});