const GameUser = require('../../models/game-user');
const schema = require('@colyseus/schema');

class AfterGameState extends schema.Schema {
  constructor() {
    super();
    this.users = new schema.MapSchema();
  }
}

schema.defineTypes(AfterGameState, {
  users: {map: GameUser}
});

module.exports = AfterGameState;
