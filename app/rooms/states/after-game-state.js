const GameUser = require('../../models/colyseus-models/game-user');
const SimplePlayer = require('../../models/colyseus-models/simple-player');
const schema = require('@colyseus/schema');

class AfterGameState extends schema.Schema {
  constructor() {
    super();
    this.users = new schema.MapSchema();
    this.players = new schema.MapSchema();
  }
}

schema.defineTypes(AfterGameState, {
  users: {map: GameUser},
  players: {map: SimplePlayer}
  
});

module.exports = AfterGameState;
