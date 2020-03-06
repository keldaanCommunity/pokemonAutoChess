const schema = require("@colyseus/schema");
const Schema = schema.Schema;

class User extends Schema {
  constructor(id, name) {
    super();
    this.id = id;
    this.name = name;
  }

  toString(){
      return `id: ${this.id} name:${this.name}`;
  }

}

schema.defineTypes(User, {
  id: "string",
  name: "string"
});

module.exports = User;