const colyseus = require("colyseus");
const schema = require("@colyseus/schema");
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
    console.log("create new lobby room");
    this.setState(new LobbyState());
  }

  // Authorize client based on provided options before WebSocket handshake is complete
  async onAuth(client, options) {
    console.log("client try to auth");
    console.log(options);
    const response = await superagent
      .get(`https://graph.facebook.com/debug_token`)
      .set("Accept", "application/json")
      .query({
        "input_token": options.token,
        "access_token": process.env.FACEBOOK_APP_TOKEN
      });
    return response.body.data;
  }

  // When client successfully join the room
  onJoin(client, options, auth) {
    console.log("client joined");
    this.playerCount++;
  }

  // When a client sends a message
  onMessage(client, message) {

  }

  // When a client leaves the room
  onLeave(client, consented) {
    this.playerCount--;
  }

  // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
  onDispose() {

  }
}

module.export = LobbyRoom;