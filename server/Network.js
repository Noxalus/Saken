'use strict';

const logger = require('winston');
const socketio = require('socket.io');

const Client = require('./Client');
const Player = require('./Player');
const GameConfig = require('../lib/Config');
const Utils = require('../lib/Utils');

class Network {
  constructor(game, server) {
    this.game = game;
    this.socket = socketio(server);
    this.clients = new Map();
    this.playerClients = new Map();
    this.clientPlayers = new Map();

    this.initializeSocketListeners();
  }

  initializeSocketListeners() {
    const that = this;

    this.socket.on('connection', function(socket) {
      let client = new Client(socket);

      that.addClient(client);
    });
  }

  start() {

  }

  listenToClient(client) {
    const that = this;

    client.on('error', (err) => {
      logger.info('Client error', err);
    });

    client.on('disconnect', function () {
      that.removeClient(client)
    });

    client.on('message', (message) => {
      that.handleClientMessage(client, message);
    });
  }

  handleClientMessage(client, message) {
    console.log('New client message: ' + message);
  }

  addClient(client) {
    this.clients.set(client.getId(), client);
    this.listenToClient(client);

    // Set random position
    const randomPosition = Utils.generateRandomPosition();
    const player = new Player(client.getId(), '[NAME]', randomPosition.x, randomPosition.y, GameConfig.player.defaultLength);

    this.game.addPlayer(player);
    this.addClientPlayer(client, player);
  }

  removeClient (client) {
    const clientId = client.getId();
    logger.info('Client disconnected ' + clientId);
    this.clients.delete(clientId);

    const player = this.getPlayerByClient(client);

    this.game.removePlayer(player.getId());
    this.removeClientPlayer(client);
  }

  addClientPlayer(client, player) {
    this.playerClients.set(player, client);
    this.clientPlayers.set(client, player);
  }

  removeClientPlayer(client) {
    console.log('Remove client: ' + client.getId());
    const player = this.clientPlayers.get(client);

    this.clientPlayers.delete(client);
    this.playerClients.delete(player);
  }

  sendUpdates(getStateForPlayer) {
    console.log('Client #: ' + this.clientPlayers.size);

    for (const player of this.clientPlayers.values()) {
      const client = this.playerClients.get(player);

      // console.log('Player: ', player);
      // console.log('Player state: ', getStateForPlayer(player));

      // client.emit('onServerUpdate', getStateForPlayer(player));
    }
  }

  receiveClientInput(client, input, inputTime, inputSeq) {
    const player = this.clientPlayers.get(client);

    // player.pushInput({
    //     inputs: input,
    //     time: inputTime,
    //     seq: inputSeq
    // });
  }

  getPlayerByClient(client) {
    return this.clientPlayers.get(client);
  }

  getClientByPlayer(player) {
    return this.playerClients.get(player);
  }
}

module.exports = Network;