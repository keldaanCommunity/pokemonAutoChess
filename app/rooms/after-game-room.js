const colyseus = require('colyseus');
const SimplePlayer = require('../models/colyseus-models/simple-player');
const {Dispatcher} = require('@colyseus/command');
const AfterGameState = require('./states/after-game-state');
const UserMetadata = require('../models/mongo-models/user-metadata');
const Filter = require('bad-words');
const admin = require('firebase-admin');
const {
  OnJoinCommand,
  OnLeaveCommand,
  OnMessageCommand,
} = require('./commands/preparation-commands');

class AfterGameRoom extends colyseus.Room {
  constructor() {
    super();
    this.dispatcher = new Dispatcher(this);
    this.filter = new Filter();
  }

  onCreate(options) {
    console.log(`create after game`);
    this.setState(new AfterGameState());
    this.maxClients = 8;
    //console.log('before', this.state.players);
    if(options.players){
      options.players.forEach(plyr => {
        let player = new SimplePlayer(plyr.id, plyr.name, plyr.avatar, plyr.rank, plyr.pokemons, plyr.exp, plyr.alive);
        this.state.players.set(player.id, player);
      });
    }
    //console.log('after', this.state.players);
    this.onMessage('messages', (client, message) => {
      this.dispatcher.dispatch(new OnMessageCommand(), {client, message});
    });
  }

  async onAuth(client, options, request) {
    const token = await admin.auth().verifyIdToken(options.idToken);
    const user = await admin.auth().getUser(token.uid);
    return user;
  }

  onJoin(client, options, auth) {
    console.log(`${client.auth.email} join after game`);
    if(options.players){

      this.state.players.forEach((value, key)=> {
        this.state.players.delete(key);
      });
      
      options.players.forEach(plyr => {
        let player = new SimplePlayer(plyr.id, plyr.name, plyr.avatar, plyr.rank, plyr.pokemons, plyr.exp, plyr.alive);
        let pokemons = [];
        player.pokemons.forEach(pkm =>{
          pokemons.push(pkm);
        });
        this.state.players.set(player.id, player);
      });
      
    }
    this.dispatcher.dispatch(new OnJoinCommand(), {client, options, auth});
  }

  async onLeave(client, consented) {
    try {
      if (consented) {
          throw new Error("consented leave");
      }
  
      // allow disconnected client to reconnect into this room until 20 seconds
      await this.allowReconnection(client, 20);
  
    } catch (e) {
  
      console.log(`${client.auth.displayName} leave preparation room`);
      this.dispatcher.dispatch(new OnLeaveCommand(), {client, consented});
    }
  }

  onDispose() {
    console.log(`dispose after game`);
    this.dispatcher.stop();
  }
}

module.exports = AfterGameRoom;
