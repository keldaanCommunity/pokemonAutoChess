const colyseus = require('colyseus');
const social = require('@colyseus/social');
const {Dispatcher} = require('@colyseus/command');
const AfterGameState = require('./states/after-game-state');
const Filter = require('bad-words');
const {
  OnGameStartCommand,
  OnJoinCommand,
  OnLeaveCommand,
  OnToggleReadyCommand,
  OnMessageCommand,
  OnAddBotCommand,
  OnRemoveBotCommand
} = require('./commands/preparation-commands');

class AfterGameRoom extends colyseus.Room {
  constructor() {
    super();
    this.dispatcher = new Dispatcher(this);
    this.filter = new Filter();
  }

  onCreate(options) {
    this.setState(new AfterGameState());
    this.maxClients = 8;
    this.dispatcher.dispatch(new OnAddBotCommand());

    this.onMessage('game-start', (client, message) => {
      this.dispatcher.dispatch(new OnGameStartCommand(), {client, message});
    });
    this.onMessage('toggle-ready', (client, message) => {
      this.dispatcher.dispatch(new OnToggleReadyCommand(), client);
    });
    this.onMessage('messages', (client, message) => {
      this.dispatcher.dispatch(new OnMessageCommand(), {client, message});
    });
    this.onMessage('addBot', (client, message) => {
      this.dispatcher.dispatch(new OnAddBotCommand());
    });
    this.onMessage('removeBot', (client, message) => {
      this.dispatcher.dispatch(new OnRemoveBotCommand());
    });
  }

  async onAuth(client, options, request) {
    const token = social.verifyToken(options.token);
    const user = await social.User.findById(token._id);
    return user;
  }

  onJoin(client, options, auth) {
    // console.log(client);
    this.dispatcher.dispatch(new OnJoinCommand(), {client, options, auth});
  }

  onLeave(client, consented) {
    this.dispatcher.dispatch(new OnLeaveCommand(), {client, consented});
  }

  onDispose() {
    this.dispatcher.stop();
  }
}

module.exports = AfterGameRoom;
