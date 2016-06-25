Socket = {
  initialize: function() {
    this.vars.socket = io();

    this.initializeEvents();
  },

  initializeEvents: function() {
    this.vars.socket.on('onconnected', function(data){
      console.log('Player is connected: ' + data.id);
    });
  },

  vars: {
    socket: null
  }
}

Snake = {
  initialize: function() {
    console.log('Initialize');

    Socket.initialize();
  }
}

$(document).ready(function() {
  Snake.initialize();
});