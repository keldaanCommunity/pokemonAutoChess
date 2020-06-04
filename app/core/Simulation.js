const Grid = require('./grid');
const schema = require("@colyseus/schema");
const Schema = schema.Schema;
const MapSchema = schema.MapSchema;
const PokemonEntity =require('./PokemonEntity');

class Simulation extends Schema{
    
    constructor(blueTeam, redTeam){
        super();
        this.grid = new Grid(9,3);
        this.redTeam = new MapSchema();
        this.blueTeam = new MapSchema();
        for (let id in blueTeam) {
            let pokemon = blueTeam[id];
            let pokemonEntity = new PokemonEntity(pokemon.name, pokemon.type, pokemon.x, pokemon.y);
            this.blueTeam[pokemonEntity.id] = pokemonEntity;
            this.grid.setValue(pokemonEntity.x, pokemonEntity.y, pokemonEntity);
        }
        for (let id in redTeam) {
            let pokemon = redTeam[id];
            let pokemonEntity = new PokemonEntity(pokemon.name, pokemon.type, pokemon.x, 2 - pokemon.y);
            this.redTeam[pokemonEntity.id] = pokemonEntity;
            this.grid.setValue(pokemonEntity.x, pokemonEntity.y, pokemonEntity);
        }
    }

    update(){
        for (let id in this.blueTeam) {
            this.blueTeam[id].update();
        }
        for (let id in this.redTeam) {
            this.redTeam[id].update();
        }
    }
}

schema.defineTypes(Simulation, {
    blueTeam: { map: PokemonEntity },
    redTeam: { map: PokemonEntity }
  });

module.exports = Simulation;