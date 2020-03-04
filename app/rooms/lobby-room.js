const colyseus = require("colyseus");
const schema = require("@colyseus/schema");
const superagent = require("superagent");

class LobbyState extends schema.Schema {
  constructor() {
    super();
    this.playerCount = 0;
    this.name = "Super lobby";
  }
}

schema.defineTypes(LobbyState, {
  playerCount: "number",
  name: "string"
});

class LobbyRoom extends colyseus.Room {

  onCreate(options) {
    this.setState(new LobbyState());
  }

  async onAuth(client, options, request) {
    console.log("client try to auth");
    if (options.type == "fb") {
      const response = await superagent
        .get(`https://graph.facebook.com/debug_token`)
        .set("Accept", "application/json")
        .query({
          "input_token": options.token,
          "access_token": process.env.FACEBOOK_APP_TOKEN
        });
      console.log(response);
      return response.body.data.is_valid;
    }
    if (options.type == "user") {
      // TODO: implement login with username & password
      return (String(options.username) == "a" && String(options.password) == "b");
    }
    return false;
  }

  onJoin(client, options, auth) {
    this.state.playerCount = this.state.playerCount + 1;
    console.log("client joined", this.state.playerCount);
  }

  onMessage(client, message) {

  }

  onLeave(client, consented) {
    this.state.playerCount = this.state.playerCount - 1;
    console.log("client joined", this.state.playerCount);
  }

  onDispose() {

  }
}

module.exports = LobbyRoom;