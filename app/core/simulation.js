const Board = require('./board');
const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const MapSchema = schema.MapSchema;
const PokemonEntity = require('./pokemon-entity');

class Simulation extends Schema {
  constructor(blueTeam, redTeam) {
    super();
    this.board = new Board(9, 6);
    this.redTeam = new MapSchema();
    this.blueTeam = new MapSchema();
    this.finished = false;
    for (const id in blueTeam) {
      const pokemon = blueTeam[id];
      // console.log("x",pokemon.positionX, "y", pokemon.positionY); // 0 for blue, 1 for red
      if (pokemon.positionY != 0) {
        const pokemonEntity = new PokemonEntity(pokemon.name, pokemon.index, pokemon.positionX, pokemon.positionY - 1, pokemon.hp, pokemon.atk, pokemon.range, 0, pokemon.attackSprite, pokemon.rarity);
        this.blueTeam[pokemonEntity.id] = pokemonEntity;
        // console.log("entity x",pokemonEntity.positionX, "y", pokemonEntity.positionY);
        this.board.setValue(pokemonEntity.positionX, pokemonEntity.positionY, pokemonEntity);
      }
    }
    for (const id in redTeam) {
      const pokemon = redTeam[id];
      // console.log("x",pokemon.positionX, "y", pokemon.positionY);
      if (pokemon.positionY != 0) {
        const pokemonEntity = new PokemonEntity(pokemon.name, pokemon.index, pokemon.positionX, 5 - (pokemon.positionY - 1), pokemon.hp, pokemon.atk, pokemon.range, 1, pokemon.attackSprite, pokemon.rarity);
        this.redTeam[pokemonEntity.id] = pokemonEntity;
        // console.log("entity x",pokemonEntity.positionX, "y", pokemonEntity.positionY);
        this.board.setValue(pokemonEntity.positionX, pokemonEntity.positionY, pokemonEntity);
      }
    }
  }

  update(dt) {
    if (Object.keys(this.blueTeam).length == 0 || Object.keys(this.redTeam).length == 0) {
      this.finished = true;
    }

    for (const id in this.blueTeam) {
      if (this.blueTeam[id].life <= 0) {
        delete this.blueTeam[id];
      } else {
        this.blueTeam[id].update(dt, this.board);
      }
    }
    for (const id in this.redTeam) {
      if (this.redTeam[id].life <= 0) {
        delete this.redTeam[id];
      } else {
        this.redTeam[id].update(dt, this.board);
      }
    }
  }

  stop() {
    for (const id in this.blueTeam) {
      delete this.blueTeam[id];
    }
    for (const id in this.redTeam) {
      delete this.redTeam[id];
    }
  }
}

schema.defineTypes(Simulation, {
  blueTeam: {map: PokemonEntity},
  redTeam: {map: PokemonEntity}
});

module.exports = Simulation;
