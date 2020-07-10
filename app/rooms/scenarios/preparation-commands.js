const Command = require("@colyseus/command").Command;
const uniqid = require("uniqid");
const User = require("../../models/user");

class OnJoinCommand extends Command {
    execute({client, options, auth}) {
      client.id = uniqid();
      this.state.users[client.id] = new User(client.id, auth.email);
      console.log("client joined room");
    }
  }

class OnGameStartCommand extends Command {
  execute({client, message}) {
    this.room.broadcast("game-start", message, {except: client});
  }
}

class OnLeaveCommand extends Command{
  execute({client, consented}) {
    console.log("client leaved room");
    delete this.state.users[new String(client.id)];
  }
}

module.exports = {
  OnJoinCommand: OnJoinCommand,
  OnGameStartCommand: OnGameStartCommand,
  OnLeaveCommand: OnLeaveCommand
}