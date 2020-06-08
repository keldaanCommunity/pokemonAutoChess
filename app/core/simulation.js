const Board = require('./board');
const schema = require("@colyseus/schema");
const Schema = schema.Schema;
const MapSchema = schema.MapSchema;
const PokemonEntity = require('./pokemon-entity');

class Simulation extends Schema {
    
    constructor(blueTeam, redTeam) {
        super();
        this.board = new Board(9,3);
        this.redTeam = new MapSchema();
        this.blueTeam = new MapSchema();
        for (let id in blueTeam) {
            let pokemon = blueTeam[id];
            if(pokemon.positionY != 0){
                let pokemonEntity = new PokemonEntity(pokemon.index, pokemon.type, pokemon.positionX, pokemon.positionY - 1);
                this.blueTeam[pokemonEntity.id] = pokemonEntity;
                this.board.setValue(pokemonEntity.x, pokemonEntity.y, pokemonEntity);
            }
        }
        for (let id in redTeam) {
            let pokemon = redTeam[id];
            if(pokemon.positionY != 0){
                let pokemonEntity = new PokemonEntity(pokemon.index, pokemon.type, pokemon.positionX, 3 + (pokemon.positionY - 1));
                this.redTeam[pokemonEntity.id] = pokemonEntity;
                this.board.setValue(pokemonEntity.x, pokemonEntity.y, pokemonEntity);
            }
        }
    }

    update() {
        for (let id in this.blueTeam) {
            this.blueTeam[id].update();
        }
        for (let id in this.redTeam) {
            this.redTeam[id].update();
        }
    }

    stop() {
        for (let id in this.blueTeam) {
            delete this.blueTeam[id];
        }
        for (let id in this.redTeam) {
            delete this.redTeam[id];
        }
    }
}

schema.defineTypes(Simulation, {
    blueTeam: { map: PokemonEntity },
    redTeam: { map: PokemonEntity }
});

module.exports = Simulation;