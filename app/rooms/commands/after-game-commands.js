const Command = require('@colyseus/command').Command;
const GameUser = require('../../models/colyseus-models/game-user');

class OnJoinCommand extends Command {
  execute({client, options, auth}) {
    UserMetadata.findOne({'uid': auth.uid}, (err, user)=>{
      if (user) {
        this.state.users.set(client.auth.uid, new GameUser(user.uid,
            user.displayName,
            user.elo,
            user.avatar,
            false,
            ''));

        this.room.broadcast('messages', {
          'name': 'Server',
          'payload': `${ user.displayName } joined.`,
          'avatar': user.avatar,
          'time': Date.now()
        });
      }
    });
  }
}

class OnMessageCommand extends Command {
  execute({client, message}) {
    let safePayload = message.payload;
    try {
      safePayload = this.room.filter.clean(safePayload);
    } catch (error) {
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
      'payload': `${ this.state.users.get(client.auth.uid).name } left.`,
      'avatar': 'magnemite',
      'time': Date.now()
    });
    this.state.users.delete(client.auth.uid);
  }
}

module.exports = {
  OnJoinCommand: OnJoinCommand,
  OnLeaveCommand: OnLeaveCommand,
  OnMessageCommand: OnMessageCommand
};
