const colyseus = require("colyseus");
const schema = require("@colyseus/schema");
const social = require("@colyseus/social");
const superagent = require("superagent");

class LobbyState extends schema.Schema {
  constructor() {
    super();
    this.playerCount = 0;
  }
}

schema.defineTypes(LobbyState, {
  playerCount: "number"
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
    this.state.playerCount++;
    console.log("client joined", this.state.playerCount);
    console.log("auth data:");
    console.log(auth);
    this.send(client, "Welcome !");
  }

  onMessage(client, message) {
    console.log("message received:", message);
    this.send(client, { text: "message ok" });
  }

  onLeave(client, consented) {
    this.state.playerCount--;
    console.log("client joined", this.state.playerCount);
  }

  onDispose() {

  }
}

module.exports = LobbyRoom;