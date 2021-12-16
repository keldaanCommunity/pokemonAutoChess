const Command = require('@colyseus/command').Command;
const uniqid = require('uniqid');
const GameUser = require('../../models/colyseus-models/game-user');
const UserMetadata = require('../../models/mongo-models/user-metadata');

class OnJoinCommand extends Command {
  execute({client, options, auth}) {

    UserMetadata.findOne({'uid':auth.uid},(err, user)=>{
      if(user){
        this.state.users.set(client.auth.uid, new GameUser(user.uid, user.displayName, user.elo, user.avatar, false, false, user.map));
        this.room.broadcast('messages', {
          'name': 'Server',
          'payload': `${ user.displayName } joined.`,
          'avatar': user.avatar,
          'time': Date.now()
        });
      }
    });

    if (this.state.users.size >= 8) {
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
    if(client && client.auth && client.auth.displayName){
      this.room.broadcast('messages', {
        'name': 'Server',
        'payload': `${ client.auth.displayName } left.`,
        'avatar': 'magnemite',
        'time':Date.now()
      }); 
    this.state.users.delete(client.auth.uid);
    }
  }
}

class OnToggleReadyCommand extends Command {
  execute(client) {
    this.state.users.get(client.auth.uid).ready = !this.state.users.get(client.auth.uid).ready;
  }
}

class OnAddBotCommand extends Command {
  execute() {
    if (this.state.users.size < 8) {
      let botList = [];
      this.room.elos.forEach((value, key)=>{
        botList.push(key);
      });
      let bot;
      const actualBotList = [];
      const potentialBotList = [];

      this.state.users.forEach((user, key) => {
        if (user.isBot) {
          actualBotList.push(user.id);
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

      this.state.users.set(bot, new GameUser(
        bot,
        bot,
        this.room.elos.get(bot),
        bot,
        true,
        true,
        {          
          FIRE: 'FIRE0',
          ICE:'ICE0',
          GROUND:'GROUND0',
          NORMAL:'NORMAL0',
          GRASS:'GRASS0',
          WATER:'WATER0'
        }));
      this.room.broadcast('messages', {
        'name': 'Server',
         'payload': `Bot ${ bot } added.`,
          'avatar': 'magnemite',
          'time':Date.now()
        });
    }
  }
}

class OnRemoveBotCommand extends Command {
  execute() {
    console.log('remove bot');
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
