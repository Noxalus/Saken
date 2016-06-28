const CELL_SIZE = 25;

// Cell class
function Cell(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = (width !== undefined) ? width : CELL_SIZE;
  this.height = (height !== undefined) ? height : CELL_SIZE;

  this.draw = function(context) {
    context.fillStyle = "blue";
    context.fillRect(this.x * this.width, this.y * this.height, this.width, this.height);
    context.strokeStyle = "white";
    context.strokeRect(this.x * this.width, this.y * this.height, this.width, this.height);
  };
};

module.exports = Cell;