const User = require('../../models/user');
const schema = require('@colyseus/schema');

class PreparationState extends schema.Schema {
  constructor() {
    super();
    this.users = new schema.MapSchema();
  }
}

schema.defineTypes(PreparationState, {
  users: {map: User}
});

module.exports = PreparationState;
