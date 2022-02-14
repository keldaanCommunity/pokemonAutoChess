const schema = require('@colyseus/schema');
const Schema = schema.Schema;

class BattleResult extends Schema {
  constructor(name, result, avatar, isPVE=false) {
    super();
    this.assign({
      name: name,
      result: result,
      avatar: avatar,
      isPVE: isPVE 
    });
  }
}

schema.defineTypes(BattleResult, {
  name: 'string',
  result: 'string',
  avatar: 'string',
  isPVE: 'boolean'
});

module.exports = BattleResult;
