const Command = require('@colyseus/command').Command;
const uniqid = require('uniqid');
const GameUser = require('../../models/colyseus-models/game-user');
const UserMetadata = require('../../models/mongo-models/user-metadata');
const BOT_AVATAR = require('../../models/enum').BOT_AVATAR;
const POKEMON_BOT = require('../../models/enum').POKEMON_BOT;

class OnJoinCommand extends Command {
  execute({client, options, auth}) {
    UserMetadata.findOne({'uid':auth.uid},(err, user)=>{
      if(user){
        this.state.users[client.auth.uid] = new GameUser(user.uid, user.displayName, user.elo, user.avatar, false, false);
        this.room.broadcast('messages', {
          'name': 'Server',
          'payload': `${ user.displayName } joined.`,
          'avatar': user.avatar,
          'time': Date.now()
        });
        if (this.state.users.size > 8) {
          return [new OnRemoveBotCommand()];
        }
      }
    });
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

    if (allUsersReady && !this.state.gameStarted) {
      this.state.gameStarted = true;
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
      'payload': `${ this.state.users[client.auth.uid].name } left.`,
      'avatar': 'magnemite',
      'time':Date.now()
    });
    delete this.state.users[''+client.auth.uid];
  }
}

class OnToggleReadyCommand extends Command {
  execute(client) {
    this.state.users[client.auth.uid].ready = !this.state.users[client.auth.uid].ready;
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

      this.state.users[id] = new GameUser(id, BOT_AVATAR[bot], this.room.elos.get(bot), BOT_AVATAR[bot], true, true);
      this.room.broadcast('messages', {
        'name': 'Server',
         'payload': `Bot ${ BOT_AVATAR[bot] } added.`,
          'avatar': 'magnemite',
          'time':Date.now()
        });
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
        this.room.broadcast('messages', {
          'name': 'Server',
           'payload': `Bot removed.`,
            'avatar': 'magnemite',
            'time':Date.now()
          });
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
