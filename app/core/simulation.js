const Board = require('./board');
const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const MapSchema = schema.MapSchema;
const PokemonEntity = require('./pokemon-entity');
const CLIMATE = require('../models/enum').CLIMATE;
const EFFECTS = require('../models/enum').EFFECTS;
const TYPE = require('../models/enum').TYPE;

class Simulation extends Schema {
  constructor(blueTeam, redTeam, blueEffects, redEffects) {
    super();
    this.board = new Board(9, 6);
    this.redTeam = new MapSchema();
    this.blueTeam = new MapSchema();
    this.blueEffects = [];
    this.redEffects = [];
    if(blueEffects){
      this.blueEffects = blueEffects;
    }
    if(redEffects){
      this.redEffects = redEffects;
    }
    this.climate = this.getClimate();
    this.finished = false;
    for (const id in blueTeam) {
      const pokemon = blueTeam[id];
      // console.log("x",pokemon.positionX, "y", pokemon.positionY); // 0 for blue, 1 for red
      if (pokemon.positionY != 0) {
        const pokemonEntity = new PokemonEntity(pokemon.name, pokemon.index, pokemon.positionX, pokemon.positionY - 1, pokemon.hp, pokemon.atk, pokemon.range, 0, pokemon.attackSprite, pokemon.rarity, pokemon.types);
        this.applyEffects(pokemonEntity, pokemon.types);
        this.blueTeam[pokemonEntity.id] = pokemonEntity;
        // console.log("entity x",pokemonEntity.positionX, "y", pokemonEntity.positionY);
        this.board.setValue(pokemonEntity.positionX, pokemonEntity.positionY, pokemonEntity);
      }
    }
    for (const id in redTeam) {
      const pokemon = redTeam[id];
      // console.log("x",pokemon.positionX, "y", pokemon.positionY);
      if (pokemon.positionY != 0) {
        const pokemonEntity = new PokemonEntity(pokemon.name, pokemon.index, pokemon.positionX, 5 - (pokemon.positionY - 1), pokemon.hp, pokemon.atk, pokemon.range, 1, pokemon.attackSprite, pokemon.rarity, pokemon.types);
        this.applyEffects(pokemonEntity, pokemon.types);
        this.redTeam[pokemonEntity.id] = pokemonEntity;
        // console.log("entity x",pokemonEntity.positionX, "y", pokemonEntity.positionY);
        this.board.setValue(pokemonEntity.positionX, pokemonEntity.positionY, pokemonEntity);
      }
    }
  }

  applyEffects(pokemon, types){
    if (this.climate == CLIMATE.RAIN && types.includes(TYPE.WATER)){
      pokemon.attack = pokemon.attack * 1.3;
    }
    if(this.climate == CLIMATE.SUN && types.includes(TYPE.SUN)){
      pokemon.attack = pokemon.attack * 1.35;
    }
  }

  getClimate() {
    let climate = CLIMATE.SANDSTORM;
    if (this.blueEffects.includes(EFFECTS.DRIZZLE) || this.redEffects.includes(EFFECTS.DRIZZLE)) {
      climate = CLIMATE.RAIN;
    }
    if (this.blueEffects.includes(EFFECTS.DROUGHT) || this.redEffects.includes(EFFECTS.DROUGHT)) {
      climate = CLIMATE.SUN;
    }
    if (this.blueEffects.includes(EFFECTS.SANDSTORM) || this.redEffects.includes(EFFECTS.SANDSTORM)) {
      climate = CLIMATE.SANDSTORM;
    }
    if (this.blueEffects.includes(EFFECTS.PRIMORDIAL_SEA) || this.redEffects.includes(EFFECTS.PRIMORDIAL_SEA)) {
      climate = CLIMATE.RAIN;
    }
    return climate;
  }

  update(dt) {
    if (Object.keys(this.blueTeam).length == 0 || Object.keys(this.redTeam).length == 0) {
      this.finished = true;
    }

    for (const id in this.blueTeam) {
      if (this.blueTeam[id].life <= 0) {
        delete this.blueTeam[id];
      } else {
        this.blueTeam[id].update(dt, this.board, this.climate);
      }
    }
    for (const id in this.redTeam) {
      if (this.redTeam[id].life <= 0) {
        delete this.redTeam[id];
      } else {
        this.redTeam[id].update(dt, this.board, this.climate);
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
    this.climate = CLIMATE.NEUTRAL;
  }
}

schema.defineTypes(Simulation, {
  blueTeam: {map: PokemonEntity},
  redTeam: {map: PokemonEntity},
  climate:"string"
});

module.exports = Simulation;
