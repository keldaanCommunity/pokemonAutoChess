const schema = require('@colyseus/schema');
const Schema = schema.Schema;

class Message extends Schema {
  constructor(name, payload, avatar, time) {
    super();
    this.assign({
      name: name,
      payload: payload,
      avatar: avatar,
      time: time
    });
  }
}

schema.defineTypes(Message, {
  name: 'string',
  payload: 'string',
  avatar: 'string',
  time: 'uint64'
});

module.exports = Message;
