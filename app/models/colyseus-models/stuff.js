// UNUSED

const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const ArraySchema = schema.ArraySchema;

class Stuff extends Schema {
  constructor() {
    super();
    this.items = new ArraySchema()
  }

  add(item)
  {
    this.items.add(item)
  }

  remove(item)
  {
    const index = this.items.indexOf(item)
    if(index >= 0)
    {
      let i
      for(; i < this.items.length - 1; i++){
        this.items[i] = this.items[i + 1]
      }

      this.items[i] = ''
    }
  }

}

schema.defineTypes(Stuff, {
  items: [ 'string ']

});

module.exports = Stuff;
