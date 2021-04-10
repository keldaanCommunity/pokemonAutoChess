const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const ArraySchema = schema.ArraySchema;

class GameRecord extends Schema {
  constructor(time, rank, elo, pokemons) {
    super();
    this.assign({
        time: time,
        rank: rank,
        pokemons: new ArraySchema(),
        elo: elo
    });

    pokemons.forEach(pokemon =>{
        this.pokemons.push(pokemon);
    });
    }
}

schema.defineTypes(GameRecord, {
    time: 'uint64',
    rank: 'uint8',
    pokemons: ['string'],
    elo: 'uint16'
});

module.exports = GameRecord;
