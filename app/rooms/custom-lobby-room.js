const colyseus = require('colyseus');
const social = require('@colyseus/social');
const LobbyState = require('./states/lobby-state');
const Mongoose = require('mongoose');
const Chat = require('../models/chat');

class CustomLobbyRoom extends colyseus.LobbyRoom {
  constructor() {
    super();
  }

  onCreate (options) {
    let self = this;
    super.onCreate(options);
    this.setState(new LobbyState());
  
    Mongoose.connect(process.env.MONGO_URI , (err) => {
      Chat.find({'time': { $gt: Date.now() - 3600000 }},(err, messages)=> {
          if(err){
            console.log(err);
          }
          else{
            messages.forEach(message => {
              self.state.addMessage(message.name, message.payload, message.avatar, message.time, false);
          });
          }
      });
    });
    
    this.onMessage("new-message", (client, message) => {
      this.state.addMessage(message.name, message.payload, message.avatar,Date.now(), true);
    });
}

async onAuth(client, options, request) {
  super.onAuth(client, options, request);
  const token = social.verifyToken(options.token);
  const user = await social.User.findById(token._id);
  return user;
}

onJoin (client, options, auth) {
  super.onJoin(client, options, auth);
  const time = new Date(Date.now());
  this.state.addMessage('Server',`${auth.email} joined.`, 'magnemite', Date.now(), true);
  this.clients.forEach(cli => {
    if(cli.auth.email == client.auth.email && client.sessionId != cli.sessionId){

      cli.send('to-lobby',{});
    }
  });
}

onLeave (client) {
  super.onLeave(client);
  const time = new Date(Date.now());
  this.state.addMessage('Server',`${client.auth.email} left.`, 'magnemite',Date.now(), true);
}

onDispose () {
  super.onDispose();
  console.log('Dispose LobbyRoom');
}
}

module.exports = CustomLobbyRoom;
