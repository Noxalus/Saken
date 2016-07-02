'use strict';

const Config = require('./Config');
const Timer = require('./Timer');

class AbstractGame {
  constructor() {
    this.players = new Map();
    this.timer = new Timer(Config.timerFrequency);
    this.eventsFired = [];

  	console.log('AbstractGame constructor');
  }

  initialize() {
  	console.log('AbstractGame initialize');
  }

  start() {

  }

  stop() {

  }

  getPlayerById(playerId) {
    return this.players.get(playerId);
  }

  getPlayers() {
    return this.players.values();
  }

  getTime() {
    return this.timer.getTime();
  }

  setTime(value) {
    this.timer.setTime(value);
  }

  addPlayer (player) {
    console.log('Add player from AbstractGame');

    // player.setEventHandler((eventData) => {
    //   playerEventHandler.onEvent(eventData, player);
    // });

    // player.setSpeed(options.playerSpeed);

    this.players.set(player.getId(), player);
    // collisionSystem.addPlayer(player);
  }

  removePlayer (playerId) {
    const player = this.players.get(playerId);

    // collisionSystem.removePlayer(player);
    this.players.delete(playerId);
  }

  clearPlayers () {
    this.players.clear();
  }

  getStateForPlayer(player) {
    if (!this)
      return null;

    return {
      serverTime: this.getTime(),
      ownPlayer: player.toJSON(),
      players: Array.from(this.players.values()).filter(otherPlayer => {
          return otherPlayer !== player;
      }).map(player => player.toJSON()),
      events: this.eventsFired.filter((event) => {
          return event.getFiredBy() !== player;
      }).map((event) => event.toJSON())
    };
  }

  clearEvents() {
    this.eventsFired = [];
  }
}

module.exports = AbstractGame;