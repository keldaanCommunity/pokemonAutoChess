const schema = require('@colyseus/schema');
const Schema = schema.Schema;

class GameUser extends Schema {
  constructor(id, name, elo, avatar, isBot, ready) {
    super();
    this.assign({
      id: id,
      name: name,
      avatar: avatar,
      ready: ready,
      isBot: isBot,
      elo: elo
    });
  }

  toString() {
    return `id: ${this.id} name:${this.name}`;
  }
}

schema.defineTypes(GameUser, {
  id: 'string',
  name: 'string',
  avatar: 'string',
  ready: 'boolean',
  isBot: 'boolean',
  elo: 'uint16'
});

module.exports = GameUser;
