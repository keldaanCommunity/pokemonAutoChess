const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const CollectionSchema = schema.CollectionSchema;

class Inventory extends Schema {
  constructor() {
    super();
    
    this.items = new CollectionSchema()
  }

  add(item)
  {
    this.items.add(item)
  }

  remove(item)
  {
    this.items.delete(item)
  }

  has(item)
  {
    return this.items.has(item)
  }


}

schema.defineTypes(Inventory, {
  items: { collection: 'string' }

});

module.exports = Inventory;
