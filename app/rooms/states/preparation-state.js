const GameUser = require('../../models/game-user');
const schema = require('@colyseus/schema');

class PreparationState extends schema.Schema {
  constructor() {
    super();
    this.users = new schema.MapSchema();
  }
}

schema.defineTypes(PreparationState, {
  users: {map: GameUser}
});

module.exports = PreparationState;
