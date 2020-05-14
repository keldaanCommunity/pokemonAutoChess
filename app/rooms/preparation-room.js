const colyseus = require("colyseus");
const schema = require("@colyseus/schema");
const social = require("@colyseus/social");
const User = require("../models/user");
const uniqid = require("uniqid");

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

    this.onMessage("game-start", (client, message) => {
      this.broadcast("game-start", message, {except: client});
    });

  }

  async onAuth(client, options, request) {
    let token = social.verifyToken(options.token);
    let user = await social.User.findById(token._id);
    return user;
  }

  onJoin(client, options, auth) {

    client.id = uniqid();
    this.state.users[client.id] = new User(client.id, auth.email);
    console.log("client joined room");
  }

  onLeave(client, consented) {
    console.log("client leaved room");
    delete this.state.users[new String(client.id)];
  }

  onDispose() {

  }
}

module.exports = PreparationRoom;