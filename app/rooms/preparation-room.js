const colyseus = require("colyseus");
const schema = require("@colyseus/schema");
const social = require("@colyseus/social");
const User = require("../models/user");

class PreparationState extends schema.Schema {
  constructor() {
    super();
    this.users = new schema.MapSchema();
  }
}

schema.defineTypes(PreparationState, {
  users: { map: User }
});

class PreparationRoom extends colyseus.Room {

  onCreate(options) {
    this.setState(new PreparationState());
    this.maxClients = 8;
  }

  async onAuth(client, options, request) {
    let token = social.verifyToken(options.token);
    let user = await social.User.findById(token._id);
    return user;
  }

  onJoin(client, options, auth) {
    this.state.users[auth.facebookId] = new User(auth.facebookId, auth.username);
    console.log("client joined room");
    this.send(client, "Welcome !");
  }

  onMessage(client, message) {
    console.log("message received:", message);
    this.send(client, { text: "message ok" });
  }

  onLeave(client, consented) {
    console.log("client leaved room");
    delete this.state.users[client.auth.facebookId];
  }

  onDispose() {

  }
}

module.exports = PreparationRoom;