const schema = require('@colyseus/schema');
const Schema = schema.Schema;

class User extends Schema {
  constructor(id, name) {
    super();
    this.id = id;
    this.name = name;
    this.ready = false;
  }

  toString() {
    return `id: ${this.id} name:${this.name}`;
  }
}

schema.defineTypes(User, {
  id: 'string',
  name: 'string',
  ready: 'boolean'
});

module.exports = User;
