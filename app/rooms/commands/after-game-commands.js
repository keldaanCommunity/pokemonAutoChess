const Command = require('@colyseus/command').Command;
const uniqid = require('uniqid');
const GameUser = require('../../models/game-user');
const BOT_AVATAR = require('../../models/enum').BOT_AVATAR;
const POKEMON_BOT = require('../../models/enum').POKEMON_BOT;

class OnJoinCommand extends Command {
  execute({client, options, auth}) {
    this.state.users[client.sessionId] = new GameUser(client.sessionId, auth.email.slice(0, auth.email.indexOf('@')), auth.metadata.avatar, false, false);
    this.room.broadcast('messages', {
      'name': 'Server',
      'payload': `${ auth.email.split('@')[0] } joined.`,
      'avatar': auth.metadata.avatar,
      'time': Date.now()
    });
    if (this.state.users.size > 8) {
      return [new OnRemoveBotCommand()];
    }
  }
}

class OnMessageCommand extends Command {
  execute({client, message}) {
    let safePayload = message.payload;
    try{
      safePayload = this.room.filter.clean(safePayload);
    }
    catch(error){
      console.error('bad words library error');
    }
    message.payload = safePayload;
    this.room.broadcast('messages', message);
  }
}

class OnLeaveCommand extends Command {
  execute({client, consented}) {
    this.room.broadcast('messages', {
      'name': 'Server',
      'payload': `${ this.state.users[client.id].name } left.`,
      'avatar': 'magnemite',
      'time':Date.now()
    });
    delete this.state.users[''+client.id];
  }
}

module.exports = {
  OnJoinCommand: OnJoinCommand,
  OnLeaveCommand: OnLeaveCommand,
  OnMessageCommand: OnMessageCommand
};
