const schema = require('@colyseus/schema');
const Schema = schema.Schema;

class LeaderboardPlayer extends Schema {
  constructor(name, avatar, rank, lvl) {
    super();
    this.assign({
      name: name,
      avatar: avatar,
      rank: rank,
      lvl:lvl
    });
  }
}

schema.defineTypes(LeaderboardPlayer, {
  name: 'string',
  avatar: 'string',
  rank : 'uint8',
  lvl: 'uint8'
});

module.exports = LeaderboardPlayer;
