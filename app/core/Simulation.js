const Grid = require('./grid');
const schema = require("@colyseus/schema");
const Schema = schema.Schema;
const MapSchema = schema.MapSchema;
const Pokemon = require('./Pokemon');

class Simulation extends Schema{
    constructor(blueTeam, redTeam){
        this.grid = new Grid(9,3);
        this.pokemons = new MapSchema();
    }
}

schema.defineTypes(Player, {
    pokemons: { map: Pokemon }
  });

module.exports = Simulation;