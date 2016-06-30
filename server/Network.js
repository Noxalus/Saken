'use strict';

const socketio = require('socket.io');
const uuid = require('node-uuid');
const logger = require('winston');

class Network {
  constructor(server) {
    this.socket = socketio(server);
    this.playerClients = new Map();
    this.clientPlayers = new Map();

    this.initializeSocket();
  }

  initializeSocket() {
    this.socket.on('connection', function(client) {
      client.userid = uuid();

      client.emit('onconnected', { id: client.userid });

      logger.info('Player ' + client.userid + ' connected');

      client.on('error', (err) => {
        logger.info('Client error', err);
      });

      client.on('disconnect', function () {
        logger.info('Client disconnected ' + client.userid);
      });
    });
  }

  addClientPlayer(client, player) {
    this.playerClients.set(player, client);
    this.clientPlayers.set(client, player);
  }

  removeClientPlayer(client) {
    const player = this.clientPlayers.get(client);

    this.clientPlayers.delete(client);
    this.playerClients.delete(player);
  }

  sendUpdates(getStateForPlayer) {
    for (const player of this.clientPlayers.values()) {
      const client = this.playerClients.get(player);

      client.emit('onServerUpdate', getStateForPlayer(player));
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
    return clientPlayers.get(client);
  }

  getClientByPlayer(player) {
    return playerClients.get(player);
  }
}

module.exports = Network;