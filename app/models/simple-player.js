const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const ArraySchema = schema.ArraySchema;

class SimplePlayer extends Schema {
  constructor(id, name, avatar, rank, pokemons, exp) {
    super();
    this.assign({
      id: id,
      name: name,
      avatar: avatar,
      rank: rank,
      pokemons: new ArraySchema(),
      exp:exp
    });
    pokemons.forEach(pkm => {
        this.pokemons.push(pkm);
    });
  }
}

schema.defineTypes(SimplePlayer, {
  id: 'string',
  name: 'string',
  avatar: 'string',
  rank : 'uint8',
  pokemons: ['string'],
  exp: 'uint16'
});

module.exports = SimplePlayer;
