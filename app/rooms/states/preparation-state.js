const GameUser = require('../../models/colyseus-models/game-user');
const schema = require('@colyseus/schema');

class PreparationState extends schema.Schema {
  constructor(ownerId) {
    super();
    this.users = new schema.MapSchema();
    this.assign({
      gameStarted: false,
      ownerId: ownerId,
      ownerName: ''
    });
  }
}

schema.defineTypes(PreparationState, {
  users: {map: GameUser},
  gameStarted: 'boolean',
  ownerId: 'string',
  ownerName: 'string'
});

module.exports = PreparationState;
