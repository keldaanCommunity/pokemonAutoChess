const colyseus = require('colyseus');
const {Dispatcher} = require('@colyseus/command');
const Bot = require('../models/mongo-models/bot');
const PreparationState = require('./states/preparation-state');
const Filter = require('bad-words');
const admin = require('firebase-admin');
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
    
    Bot.find({}, ['avatar','elo'], null, (err, bots) => {
      if(bots){
        bots.forEach(bot => {
          self.elos.set(bot.avatar, bot.elo);
        });
        self.dispatcher.dispatch(new OnAddBotCommand());
        self.dispatcher.dispatch(new OnAddBotCommand());
        self.dispatcher.dispatch(new OnAddBotCommand());
        self.dispatcher.dispatch(new OnAddBotCommand());
        self.dispatcher.dispatch(new OnAddBotCommand());
        self.dispatcher.dispatch(new OnAddBotCommand());
        self.dispatcher.dispatch(new OnAddBotCommand());
      }
    });

    this.onMessage('game-start', (client, message) => {
      try{
        this.dispatcher.dispatch(new OnGameStartCommand(), {client, message});
      }
      catch(error){
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
    this.onMessage('addBot', (client, message) => {
      try {
        this.dispatcher.dispatch(new OnAddBotCommand());
      } catch (error) {
        console.log(error);
      }
    });
    this.onMessage('removeBot', (client, message) => {
      try {
        this.dispatcher.dispatch(new OnRemoveBotCommand());
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
    if(client && client.auth && client.auth.displayName){
      console.log(`${client.auth.displayName} ${client.id} join game room`);
      this.dispatcher.dispatch(new OnJoinCommand(), {client, options, auth});
    }
  }

  async onLeave (client, consented) {
    
    if(client && client.auth && client.auth.displayName){
      console.log(`${client.auth.displayName} ${client.id} is leaving preparation room`);
    }
    try {
      if (consented) {
          throw new Error("consented leave");
      }
  
      // allow disconnected client to reconnect into this room until 20 seconds
      await this.allowReconnection(client, 60);
  
    } catch (e) {
  
      if(client && client.auth && client.auth.displayName){
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
