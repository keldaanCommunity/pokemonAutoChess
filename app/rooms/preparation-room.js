const colyseus = require('colyseus');
const {Dispatcher} = require('@colyseus/command');
const EloBot = require('../models/mongo-models/elo-bot');
const PreparationState = require('./states/preparation-state');
const Mongoose = require('mongoose');
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

class PreparationRoom extends colyseus.Room {
  constructor() {
    super();
    this.dispatcher = new Dispatcher(this);
    this.filter = new Filter();
    this.elos = new Map();
  }

  onCreate(options) {
    console.log('create preparation room');
    let self = this;
    this.setState(new PreparationState());
    this.maxClients = 8;

    Mongoose.connect(process.env.MONGO_URI, (err) => {
      EloBot.find({},(err, bots) => {
        bots.forEach(bot => {
          self.elos.set(bot.name, bot.elo);
        });
        self.dispatcher.dispatch(new OnAddBotCommand());
        self.dispatcher.dispatch(new OnAddBotCommand());
        self.dispatcher.dispatch(new OnAddBotCommand());
        self.dispatcher.dispatch(new OnAddBotCommand());
        self.dispatcher.dispatch(new OnAddBotCommand());
        self.dispatcher.dispatch(new OnAddBotCommand());
        self.dispatcher.dispatch(new OnAddBotCommand());
      });
    });

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
    console.log(`${client.auth.email} join preparation room`);
    this.dispatcher.dispatch(new OnJoinCommand(), {client, options, auth});
  }

  onLeave(client, consented) {
    console.log(`${client.auth.email} leave preparation room`);
    this.dispatcher.dispatch(new OnLeaveCommand(), {client, consented});
  }

  onDispose() {
    console.log('Dispose preparation room');
    this.dispatcher.stop();
  }
}

module.exports = PreparationRoom;
