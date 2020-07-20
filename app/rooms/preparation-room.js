const colyseus = require("colyseus");
const PreparationState = require("./states/preparation-state");
const Dispatcher = require("@colyseus/command").Dispatcher;
const social = require("@colyseus/social");
const OnJoinCommand = require("./commands/preparation-commands").OnJoinCommand;
const OnGameStartCommand = require("./commands/preparation-commands").OnGameStartCommand;
const OnLeaveCommand = require("./commands/preparation-commands").OnLeaveCommand;
const OnToggleReadyCommand = require("./commands/preparation-commands").OnToggleReadyCommand;

class PreparationRoom extends colyseus.Room {

  constructor(){
    super();
    this.dispatcher = new Dispatcher(this);
  }

  onCreate(options) {
    this.setState(new PreparationState());
    this.maxClients = 8;
    this.onMessage("game-start", (client, message) => {
      this.dispatcher.dispatch(new OnGameStartCommand(), { client, message });
    });

    this.onMessage("toggle-ready", (client, message) => {
      this.dispatcher.dispatch(new OnToggleReadyCommand(), client);
    });
  }

  async onAuth(client, options, request) {
    let token = social.verifyToken(options.token);
    let user = await social.User.findById(token._id);
    return user;
  }

  onJoin(client, options, auth) {
    this.dispatcher.dispatch(new OnJoinCommand(), { client, options, auth });
  }

  onLeave(client, consented) {
    this.dispatcher.dispatch(new OnLeaveCommand(), { client, consented });
  }

  onDispose() {
    this.dispatcher.stop();
  }
}

module.exports = PreparationRoom;