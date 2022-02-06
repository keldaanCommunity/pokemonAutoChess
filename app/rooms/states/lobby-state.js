const schema = require('@colyseus/schema');
const Message = require('../../models/colyseus-models/message');
const LeaderboardInfo = require('../../models/colyseus-models/leaderboard-info');
const Chat = require('../../models/mongo-models/chat');
const LobbyUser = require('../../models/colyseus-models/lobby-user');

class LobbyState extends schema.Schema {
  constructor() {
    super();
    this.messages = new schema.ArraySchema();
    this.leaderboard = new schema.ArraySchema();
    this.botLeaderboard = new schema.ArraySchema();
    this.users = new schema.MapSchema();
  }

  addMessage(name, payload, avatar, time, save) {
    const message = new Message(name, payload, avatar, time);
    this.messages.push(message);
    if (save) {
      Chat.create({'name': message.name, 'avatar': message.avatar, 'payload': message.payload, 'time': message.time});
    }
  }
}

schema.defineTypes(LobbyState, {
  messages: [Message],
  users: {map: LobbyUser},
  leaderboard: [LeaderboardInfo],
  botLeaderboard: [LeaderboardInfo]
});

module.exports = LobbyState;
