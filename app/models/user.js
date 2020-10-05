const schema = require('@colyseus/schema');
const Schema = schema.Schema;

class User extends Schema {
  constructor(id, name, avatar, isBot, ready) {
    super();
    this.id = id;
    this.name = name;
    this.avatar = avatar;
    this.ready = ready;
    this.isBot = isBot;
  }

  toString() {
    return `id: ${this.id} name:${this.name}`;
  }
}

schema.defineTypes(User, {
  id: 'string',
  name: 'string',
  avatar: 'string',
  ready: 'boolean',
  isBot: 'boolean'
});

module.exports = User;
