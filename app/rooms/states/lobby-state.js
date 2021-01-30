const schema = require('@colyseus/schema');
const Message = require('../../models/message');
const Chat = require('../../models/chat');

class LobbyState extends schema.Schema {
  constructor() {
    super();
    this.messages = new schema.ArraySchema();
  }

  addMessage(name, payload, avatar, time, save) {
    if (this.messages.length > 200) {
      this.messages.splice(0, 1);
    }
    const safeName = name.split('@')[0];
    const message = new Message(safeName, payload, avatar, time);
    this.messages.push(message);
    // console.log(message.name);
    if (save) {
      Chat.create({'name': message.name, 'avatar': message.avatar, 'payload': message.payload, 'time': message.time});
    }
  }
}

schema.defineTypes(LobbyState, {
  messages: [Message]
});

module.exports = LobbyState;
