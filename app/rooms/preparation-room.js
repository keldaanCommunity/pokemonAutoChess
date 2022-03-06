const colyseus = require('colyseus');
const {Dispatcher} = require('@colyseus/command');
const PreparationState = require('./states/preparation-state');
const admin = require('firebase-admin');
const {
  OnGameStartCommand,
  OnJoinCommand,
  OnLeaveCommand,
  OnToggleReadyCommand,
  OnMessageCommand,
  OnAddBotCommand,
  OnRemoveBotCommand,
  InitializeBotsCommand
} = require('./commands/preparation-commands');

class PreparationRoom extends colyseus.Room {
  constructor() {
    super();
    this.dispatcher = new Dispatcher(this);
    this.elos = new Map();
  }

  onCreate(options) {
    console.log('create preparation room');
    // console.log(options);
    const self = this;
    this.setState(new PreparationState(options.ownerId));
    this.maxClients = 8;

    self.dispatcher.dispatch(new InitializeBotsCommand(), options.ownerId);

    this.onMessage('game-start', (client, message) => {
      try {
        this.dispatcher.dispatch(new OnGameStartCommand(), {client, message});
      } catch (error) {
        console.log(error);
      }
    });
    this.onMessage('toggle-ready', (client, message) => {
      try {
        this.dispatcher.dispatch(new OnToggleReadyCommand(), client);
      } catch (error) {
        console.log(error);
      }
    });
    this.onMessage('new-message', (client, message) => {
      try {
        this.dispatcher.dispatch(new OnMessageCommand(), {client, message});
      } catch (error) {
        console.log(error);
      }
    });
    this.onMessage('addBot', (client, difficulty) => {
      try {
        this.dispatcher.dispatch(new OnAddBotCommand(), {difficulty: difficulty});
      } catch (error) {
        console.log(error);
      }
    });
    this.onMessage('removeBot', (client, target) => {
      try {
        this.dispatcher.dispatch(new OnRemoveBotCommand(), {target: target});
      } catch (error) {
        console.log(error);
      }
    });
  }

  async onAuth(client, options, request) {
    const token = await admin.auth().verifyIdToken(options.idToken);
    const user = await admin.auth().getUser(token.uid);
    return user;
  }

  onJoin(client, options, auth) {
    if (client && client.auth && client.auth.displayName) {
      console.log(`${client.auth.displayName} ${client.id} join game room`);
      this.dispatcher.dispatch(new OnJoinCommand(), {client, options, auth});
    }
  }

  async onLeave(client, consented) {
    if (client && client.auth && client.auth.displayName) {
      console.log(`${client.auth.displayName} ${client.id} is leaving preparation room`);
    }
    try {
      if (consented) {
        throw new Error('consented leave');
      }

      // allow disconnected client to reconnect into this room until 20 seconds
      await this.allowReconnection(client, 5);
    } catch (e) {
      if (client && client.auth && client.auth.displayName) {
        console.log(`${client.auth.displayName} ${client.id} leave preparation room`);
      }
      this.dispatcher.dispatch(new OnLeaveCommand(), {client, consented});
    }
  }

  onDispose() {
    console.log('Dispose preparation room');
    this.dispatcher.stop();
  }
}

module.exports = PreparationRoom;
