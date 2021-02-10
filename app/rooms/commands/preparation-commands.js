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

class OnGameStartCommand extends Command {
  execute({client, message}) {
    let allUsersReady = true;

    this.state.users.forEach((user, key) => {
      if (!user.ready) {
        allUsersReady = false;
      }
    });

    if (allUsersReady) {
      this.room.broadcast('game-start', message, {except: client});
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

class OnToggleReadyCommand extends Command {
  execute(client) {
    this.state.users[client.id].ready = !this.state.users[client.id].ready;
  }
}

class OnAddBotCommand extends Command {
  execute() {
    if (this.state.users.size < 8) {
      const id = uniqid();
      const botList = Object.keys(BOT_AVATAR);
      let bot;
      const actualBotList = [];
      const potentialBotList = [];

      this.state.users.forEach((user, key) => {
        if (user.isBot) {
          actualBotList.push(POKEMON_BOT[user.avatar]);
        }
      });

      for (let i = 0; i < botList.length; i++) {
        if (!actualBotList.includes(botList[i])) {
          potentialBotList.push(botList[i]);
        }
      }
      bot = potentialBotList[Math.floor(Math.random() * potentialBotList.length)];

      if (bot === undefined) {
        bot = botList[Math.floor(Math.random() * botList.length)];
      }

      this.state.users[id] = new GameUser(id, `BOT ${BOT_AVATAR[bot]}`, BOT_AVATAR[bot], true, true);
      this.room.broadcast('messages', {'name': 'Server', 'payload': `Bot ${ BOT_AVATAR[bot] } added.`, 'avatar': 'magnemite'});
    }
  }
}

class OnRemoveBotCommand extends Command {
  execute() {
    let botFound = false;
    this.state.users.forEach((user, key) => {
      if (user.isBot && !botFound) {
        this.state.users.delete(key);
        botFound = true;
        this.room.broadcast('messages', {'name': 'Server', 'payload': `Bot removed.`, 'avatar': 'magnemite'});
      }
    });
  }
}

module.exports = {
  OnJoinCommand: OnJoinCommand,
  OnGameStartCommand: OnGameStartCommand,
  OnLeaveCommand: OnLeaveCommand,
  OnToggleReadyCommand: OnToggleReadyCommand,
  OnMessageCommand: OnMessageCommand,
  OnAddBotCommand: OnAddBotCommand,
  OnRemoveBotCommand: OnRemoveBotCommand
};
