'use strict';

const Config = {
  world: {
  	width: 1000,
  	height: 1000,
  	cellSize: 25
  },
  player: {
  	defaultSpeed: 10, // Number of cell per second
  	defaultLength: 5
  },
  timerFrequency: 1000 / 250
};

module.exports = Config;