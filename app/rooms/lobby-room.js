const colyseus = require("colyseus");
const schema = require("@colyseus/schema");
const social = require("@colyseus/social");
const User = require('../models/user');
const MapSchema = schema.MapSchema;

class LobbyState extends schema.Schema {
  constructor() {
    super();
    this.users = new MapSchema();
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
    console.log(options);
    let token = social.verifyToken(options.token);
    let user = await social.User.findById(token._id);
    return user;
  }

  onJoin(client, options, auth) {
    this.state.users[auth.facebookId] = new User(auth.facebookId, auth.username);
    console.log("client joined with auth data:", auth);
    this.send(client, "Welcome !");
  }

  onMessage(client, message) {
    console.log("message received:", message);
    this.send(client, { text: "message ok" });
  }

  onLeave(client, consented) {
    console.log("client leaved", client);
    delete this.state.users[client.auth.facebookId];
    
  }

  onDispose() {

  }
}

module.exports = LobbyRoom;