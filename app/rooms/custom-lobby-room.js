const colyseus = require('colyseus');

class CustomLobbyRoom extends colyseus.LobbyRoom {
  constructor() {
    super();
  }

  onCreate (options) {
    super.onCreate(options);
    this.onMessage("messages", (client, message) => {
      this.broadcast('messages', message);
    });
}

onJoin (client, options, auth) {
  super.onJoin(client, options, auth);
  this.broadcast('messages', {'name':'Server', 'message':`User joined.`});
}

onLeave (client) {
  super.onLeave(client);
  this.broadcast('messages', {'name':'Server', 'message':`User left.`});
}

onDispose () {
  super.onDispose();
  console.log("Dispose ChatRoom");
}
}

module.exports = CustomLobbyRoom;
