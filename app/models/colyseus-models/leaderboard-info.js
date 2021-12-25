const schema = require('@colyseus/schema');
const Schema = schema.Schema;

class LeaderboardInfo extends Schema {
  constructor(name, avatar, rank, value) {
    super();
    if (!avatar) {
      avatar = 'rattata';
    }
    this.assign({
      name: name,
      avatar: avatar,
      rank: rank,
      value: value
    });
  }
}

schema.defineTypes(LeaderboardInfo, {
  name: 'string',
  avatar: 'string',
  rank: 'uint16',
  value: 'uint16'
});

module.exports = LeaderboardInfo;
