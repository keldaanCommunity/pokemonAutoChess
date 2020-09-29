const Command = require('@colyseus/command').Command;
const uniqid = require('uniqid');
const User = require('../../models/user');

class OnJoinCommand extends Command {
  execute({client, options, auth}) {
    client.id = uniqid();
    this.state.users[client.id] = new User(client.id, auth.email, auth.metadata.avatar);
    this.room.broadcast('messages', {'name':'Server', 'message':`${ auth.email } joined.`});
  }
}

class OnGameStartCommand extends Command {
  execute({client, message}) {
    let allUsersReady = true;
    for (const id in this.state.users) {
      if (!this.state.users[id].ready) {
        allUsersReady = false;
      }
    }
    if (allUsersReady) {
      this.room.broadcast('game-start', message, {except: client});
    }
  }
}

class OnMessageCommand extends Command {
  execute({client, message}) {
    this.room.broadcast('messages', message);
  }
}

class OnLeaveCommand extends Command {
  execute({client, consented}) {
    this.room.broadcast('messages', {'name':'Server', 'message':`${ this.state.users[client.id].name } left.`});
    delete this.state.users[''+client.id];
  }
}

class OnToggleReadyCommand extends Command {
  execute(client) {
    this.state.users[client.id].ready = !this.state.users[client.id].ready;
  }
}

module.exports = {
  OnJoinCommand: OnJoinCommand,
  OnGameStartCommand: OnGameStartCommand,
  OnLeaveCommand: OnLeaveCommand,
  OnToggleReadyCommand: OnToggleReadyCommand,
  OnMessageCommand: OnMessageCommand
};
