const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const ArraySchema = schema.ArraySchema;

class PokemonRecord extends Schema {
  constructor(mongoPokemon) {
    super();
    this.assign(
        {
          name: mongoPokemon.name,
          items: new ArraySchema()
        }
    );
    mongoPokemon.items.forEach((it)=>{
      this.items.push(it);
    });
  }
}

schema.defineTypes(PokemonRecord, {
  name: 'string',
  items: ['string']
});


class GameRecord extends Schema {
  constructor(time, rank, elo, pokemons) {
    super();
    this.assign({
      time: time,
      rank: rank,
      pokemons: new ArraySchema(),
      elo: elo
    });

    pokemons.forEach((pokemon) =>{
      this.pokemons.push(new PokemonRecord(pokemon));
    });
  }
}

schema.defineTypes(GameRecord, {
  time: 'uint64',
  rank: 'uint8',
  pokemons: [PokemonRecord],
  elo: 'uint16'
});

module.exports = GameRecord;
