const Command = require("@colyseus/command").Command;
const uniqid = require("uniqid");
const User = require("../../models/user");

class OnJoinCommand extends Command {
    execute({client, options, auth}) {
      client.id = uniqid();
      this.state.users[client.id] = new User(client.id, auth.email);
    }
  }

class OnGameStartCommand extends Command {
  execute({client, message}) {
    let allUsersReady = true;
    for(let id in this.state.users){
      if(!this.state.users[id].ready){
        allUsersReady = false;
      }
    }
    if(allUsersReady){
      this.room.broadcast("game-start", message, {except: client});
    }
  }
}

class OnLeaveCommand extends Command{
  execute({client, consented}) {
    delete this.state.users[new String(client.id)];
  }
}

class OnToggleReadyCommand extends Command{
  execute(client){
    this.state.users[client.id].ready = !this.state.users[client.id].ready;
  }
}

module.exports = {
  OnJoinCommand: OnJoinCommand,
  OnGameStartCommand: OnGameStartCommand,
  OnLeaveCommand: OnLeaveCommand,
  OnToggleReadyCommand: OnToggleReadyCommand
}