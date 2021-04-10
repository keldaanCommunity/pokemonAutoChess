const schema = require('@colyseus/schema');
const GameRecord = require('./game-record');
const Schema = schema.Schema;

class DetailledGameUser extends Schema {
  constructor(id, name, elo, avatar, isBot, ready, history) {
    super();
    this.assign({
      id: id,
      name: name,
      avatar: avatar,
      ready: ready,
      isBot: isBot,
      elo: elo,
      history: history
    });
  }

  toString() {
    return `id: ${this.id} name:${this.name}`;
  }
}

schema.defineTypes(DetailledGameUser, {
  id: 'string',
  name: 'string',
  avatar: 'string',
  ready: 'boolean',
  isBot: 'boolean',
  elo: 'uint16',
  history: [GameRecord]
});

module.exports = DetailledGameUser;
