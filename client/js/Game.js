const $ = require('jquery');

const Network = require('./Network');
const Cell = require('./Cell');
const Player = require('./Player');

const CELL_SIZE = 25;
const DIRECTION = {
  LEFT: { value: 0, name: 'left' },
  UP: { value: 1, name: 'up' },
  RIGHT: { value: 2, name: 'right' },
  DOWN: { value: 3, name: 'down' }
};

function Game() {
  let initialized = false;
  let network = null;
  let cells = [];
  let player = null;
  let score = 0;
  let canvas = {
      canvas: null,
      context: null,
      width: 0,
      height: 0
  };

  this.initialize = function() {
    console.log('Initialize');

    this.initializeCanvas();
    this.initializeInputs();
    
    this.network = new Network({game: this});

    this.reset();

    initialized = true;
  };

  this.reset = function() {
    cells = [];
    this.generateFood(10);

    if (player) {
      let id = player.id;
      this.createPlayer(player.id);
    }

    score = 0;
  };

  this.initializeCanvas = function() {
    let c = $("#canvas")[0];
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    
    canvas.canvas = c;
    canvas.context = c.getContext("2d");
    canvas.width = $("#canvas").width();
    canvas.height = $("#canvas").height();
  };

  this.initializeInputs = function() {
    $(document).keydown(this.handleInputs);
  };

  this.createPlayer = function(id) {
    let randomPosition = this.generateRandomPosition();
    player = new Player(id, randomPosition.x, randomPosition.y, 5, this);
  };

  this.generateRandomPosition = function() {
    let position = {};

    position.x = Math.round(Math.random() * ((canvas.width - CELL_SIZE) / CELL_SIZE));
    position.y = Math.round(Math.random() * ((canvas.height - CELL_SIZE) / CELL_SIZE));
    
    return position;
  };

  this.getCanvas = function() {
    return canvas;
  }

  this.generateFood = function(number) {
    if (number === undefined)
      number = 1;

    for (let i = 0; i < number; i++) {
      let randomPosition = this.generateRandomPosition();
      let cell = new Cell(randomPosition.x, randomPosition.y);
      cells.push(cell);
    }
  };

  this.handleInputs = function(event) {
      let key = event.which;

      if(key == '37' && player.currentDirection != DIRECTION.RIGHT) 
        player.changeDirection(DIRECTION.LEFT);
      else if(key == '38' && player.currentDirection != DIRECTION.DOWN) 
        player.changeDirection(DIRECTION.UP);
      else if(key == '39' && player.currentDirection != DIRECTION.LEFT) 
        player.changeDirection(DIRECTION.RIGHT);
      else if(key == '40' && player.currentDirection != DIRECTION.UP) 
        player.changeDirection(DIRECTION.DOWN);
  };

  this.checkFoodCollision = function() {
    for (let i = 0; i < cells.length; i++)
    {
      if (player.x == cells[i].x && player.y == cells[i].y)
      {
        cells.splice(i, 1);

        return true;
      }
    }

    return false;
  };

  this.increaseScore = function() {
    score++;
  };

  this.update = function(delta) {
    if (!initialized)
      return;

    if (player) {
      player.update(delta);
    }
  };

  this.draw = function(delta) {
    if (!initialized)
      return;

    canvas.context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw cells
    for (let i = 0; i < cells.length; i++) {
      cells[i].draw(canvas.context);
    }

    // Draw player
    if (player) {
      player.draw();
    }

    canvas.context.fillStyle = "white";
    canvas.context.strokeStyle = "black";
    let scoreText = "Score: " + score;
    canvas.context.fillText(scoreText, 5, canvas.height - 5);
  };
}

module.exports = Game;