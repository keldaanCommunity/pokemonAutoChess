const colyseus = require('colyseus');
const social = require('@colyseus/social');

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


async onAuth(client, options, request) {
  super.onAuth(client, options, request);
  const token = social.verifyToken(options.token);
  const user = await social.User.findById(token._id);
  return user;
}

onJoin (client, options, auth) {
  super.onJoin(client, options, auth);
  this.broadcast('messages', {'name':'Server', 'message':`${auth.email} joined.`});
}

onLeave (client) {
  super.onLeave(client);
  this.broadcast('messages', {'name':'Server', 'message':`${client.auth.email} left.`});
}

onDispose () {
  super.onDispose();
  console.log("Dispose ChatRoom");
}
}

module.exports = CustomLobbyRoom;
