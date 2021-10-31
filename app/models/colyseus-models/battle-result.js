const schema = require('@colyseus/schema');
const Schema = schema.Schema;

class BattleResult extends Schema {
  constructor(name, result, avatar) {
    super();
    this.assign({
        name: name,
        result: result,
        avatar: avatar
    });
    }
}

schema.defineTypes(BattleResult, {
    name: 'string',
    result: 'string',
    avatar: 'string'
});

module.exports = BattleResult;
