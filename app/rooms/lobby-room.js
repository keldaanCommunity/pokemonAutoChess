const colyseus = require("colyseus");
const schema = require("@colyseus/schema");
const social = require("@colyseus/social");
const User = require("../models/user");

class LobbyState extends schema.Schema {
  constructor() {
    super();
    this.users = new schema.MapSchema();
  }
}

schema.defineTypes(LobbyState, {
  users: { map: User }
});

class LobbyRoom extends colyseus.Room {

  onCreate(options) {
    this.setState(new LobbyState());
  }

  async onAuth(client, options, request) {
    console.log("client try to auth");
    let token = social.verifyToken(options.token);
    let user = await social.User.findById(token._id);
    return user;
  }

  onJoin(client, options, auth) {
    this.state.users[auth.facebookId] = new User(auth.facebookId, auth.username);
    console.log("client joined lobby");
  }

  onMessage(client, message) {
    console.log("message received:", message);
  }

  onLeave(client, consented) {
    console.log("client leaved lobby");
    delete this.state.users[client.auth.facebookId];
    
  }

  onDispose() {

  }
}

module.exports = LobbyRoom;