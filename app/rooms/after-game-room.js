const colyseus = require('colyseus');
const social = require('@colyseus/social');
const SimplePlayer = require('../models/simple-player');
const {Dispatcher} = require('@colyseus/command');
const AfterGameState = require('./states/after-game-state');
const Filter = require('bad-words');
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
    const token = social.verifyToken(options.token);
    const user = await social.User.findById(token._id);
    return user;
  }

  onJoin(client, options, auth) {
    console.log('join after game');
    if(options.players){

      this.state.players.forEach((value, key)=> {
        this.state.players.delete(key);
      });
      
      options.players.forEach(plyr => {
        let player = new SimplePlayer(plyr.id, plyr.name, plyr.avatar, plyr.rank, plyr.pokemons, plyr.exp, plyr.alive);
        this.state.players.set(player.id, player);
      });
      
    }
    this.dispatcher.dispatch(new OnJoinCommand(), {client, options, auth});
  }

  onLeave(client, consented) {
    console.log('leave after game');
    this.dispatcher.dispatch(new OnLeaveCommand(), {client, consented});
  }

  onDispose() {
    this.dispatcher.stop();
    console.log('dispose after game');
  }
}

module.exports = AfterGameRoom;
