const Command = require('@colyseus/command').Command;
const GameUser = require('../../models/colyseus-models/game-user');
const UserMetadata = require('../../models/mongo-models/user-metadata');
const Bot = require('../../models/mongo-models/bot');

class OnJoinCommand extends Command {
  execute({client, options, auth}) {
    UserMetadata.findOne({'uid': auth.uid}, (err, user)=>{
      if (user) {
        this.state.users.set(client.auth.uid, new GameUser(user.uid, user.displayName, user.elo, user.avatar, false, false, user.map));

        if (user.uid == this.state.ownerId) {
          console.log(user.displayName);
          this.state.ownerName = user.displayName;
        }
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
    this.room.broadcast('messages', message);
  }
}

class OnLeaveCommand extends Command {
  execute({client, consented}) {
    if (client && client.auth && client.auth.displayName) {
      this.room.broadcast('messages', {
        'name': 'Server',
        'payload': `${ client.auth.displayName } left.`,
        'avatar': 'magnemite',
        'time': Date.now()
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

class InitializeBotsCommand extends Command {
  execute(ownerId) {
    
    UserMetadata.findOne({'uid': ownerId}, (err, user)=>{
      if(!user){
        return
      }

      const difficulty = { $gt: user.elo - 100, $lt: user.elo + 100 }

      Bot.find({ elo: difficulty}, ['avatar', 'elo'], null)
      .limit(7)
      .exec(
        (err, bots) => {
          if(!bots){
            return
          }
          bots.forEach((bot) => {
            this.state.users.set(bot.avatar, new GameUser(
              bot.avatar,
              bot.avatar,
              bot.elo,
              bot.avatar,
              true,
              true,
              {}
            ));
          })
        }
      )

    })
  }
}

class OnAddBotCommand extends Command {
  execute(message) {
    if(this.state.users.size >= 8){
      return
    }

    const userArray = []

    this.state.users.forEach((value, key) => {
      if(value.isBot){
        userArray.push(key)
      }
    })
    
    let difficulty = null;
    switch(message.difficulty){
      case 'easy':
        difficulty = { $lt: 800 }
        break
      case 'normal':
        difficulty = { $gt: 800, $lt: 1100 }
        break
      case 'hard':
        difficulty = { $gt: 1100 }
        break
    }
    
    Bot.find({ avatar: {$nin: userArray}, elo: difficulty}, ['avatar', 'elo'], null, (err, bots) => {
      if(bots.length <= 0){
        this.room.broadcast('messages', {
          'name': 'Server',
          'payload': `Error: No bots found`,
          'avatar': 'magnemite',
          'time': Date.now()
        });
        return
      }

      const bot = bots[Math.floor(Math.random() * bots.length)]
      this.state.users.set(bot.avatar, new GameUser(
        bot.avatar,
        bot.avatar,
        bot.elo,
        bot.avatar,
        true,
        true,
        {}
      ));


      this.room.broadcast('messages', {
        'name': 'Server',
        'payload': `Bot ${ bot.avatar } added.`,
        'avatar': 'magnemite',
        'time': Date.now()
      });

    })
  }
}



class OnRemoveBotCommand extends Command {
  execute(message) {
    //if no message, delete a random bot
    if(!message){
      let botDeleted = false
      const keys = this.state.users.keys()
      while(!keys.done) {
        let key = keys.next().value
        if(this.state.users.get(key).isBot){
          this.room.broadcast('messages', {
            'name': 'Server',
            'payload': `Bot ${key} removed to make room for new player.`,
            'avatar': 'magnemite',
            'time': Date.now()
          });
          this.state.users.delete(key)
          botDeleted = true
          return
        }
      }
      console.log('error, no bots in lobby')
      return
    }



    if(this.state.users.delete(message.target)){
      this.room.broadcast('messages', {
        'name': 'Server',
        'payload': `Bot ${message.target} removed.`,
        'avatar': 'magnemite',
        'time': Date.now()
      });
    }
  }
}

module.exports = {
  OnJoinCommand: OnJoinCommand,
  OnGameStartCommand: OnGameStartCommand,
  OnLeaveCommand: OnLeaveCommand,
  OnToggleReadyCommand: OnToggleReadyCommand,
  OnMessageCommand: OnMessageCommand,
  InitializeBotsCommand: InitializeBotsCommand,
  OnAddBotCommand: OnAddBotCommand,
  OnRemoveBotCommand: OnRemoveBotCommand
};

