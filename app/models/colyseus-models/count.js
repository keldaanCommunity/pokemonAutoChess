const schema = require('@colyseus/schema');

class Count extends schema.Schema {
  constructor() {
    super();
    this.assign({
      crit: 0,
      ult: 0
    });
  }
}

schema.defineTypes(Count, {
  crit: 'uint8',
  ult: 'uint8'
});

module.exports = Count;
