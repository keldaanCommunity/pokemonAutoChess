const Board = require('./board');
const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const MapSchema = schema.MapSchema;
const PokemonEntity = require('./pokemon-entity');
const PokemonFactory = require('../models/pokemon-factory');
const {CLIMATE, EFFECTS, TYPE, ITEMS, ATTACK_TYPE} = require('../models/enum');

class Simulation extends Schema {
  constructor(blueTeam, redTeam, blueEffects, redEffects) {
    super();
    this.board = new Board(9, 6);
    this.redTeam = new MapSchema();
    this.blueTeam = new MapSchema();
    this.blueSpikes = false;
    this.redSpikes = false;
    this.blueRocks = false;
    this.redRocks = false;
    this.blueEffects = [];
    this.redEffects = [];
    if (blueEffects) {
      this.blueEffects = blueEffects;
    }
    if (redEffects) {
      this.redEffects = redEffects;
    }
    //console.log('blueEffects', blueEffects);
    //console.log('redEffects', redEffects);
    this.climate = this.getClimate();
    this.getEntryHazards();
    this.finished = false;
    for (const id in blueTeam) {
      const pokemon = blueTeam[id];
      // console.log("x",pokemon.positionX, "y", pokemon.positionY); // 0 for blue, 1 for red
      if (pokemon.positionY != 0) {
        const pokemonEntity = new PokemonEntity(pokemon.name, pokemon.index, pokemon.positionX, pokemon.positionY - 1, pokemon.hp, pokemon.atk, pokemon.def, pokemon.speDef, pokemon.attackType, pokemon.range, 0, pokemon.attackSprite, pokemon.rarity, pokemon.types, pokemon.items);
        this.applyEffects(pokemonEntity, pokemon.types, blueEffects, redEffects, blueTeam, redTeam);
        this.applyItemsEffects(pokemonEntity, pokemon.types);
        this.blueTeam[pokemonEntity.id] = pokemonEntity;
        // console.log("entity x",pokemonEntity.positionX, "y", pokemonEntity.positionY);
        this.board.setValue(pokemonEntity.positionX, pokemonEntity.positionY, pokemonEntity);
      }
    }
    for (const id in redTeam) {
      const pokemon = redTeam[id];
      // console.log("x",pokemon.positionX, "y", pokemon.positionY);
      if (pokemon.positionY != 0) {
        const pokemonEntity = new PokemonEntity(pokemon.name, pokemon.index, pokemon.positionX, 5 - (pokemon.positionY - 1), pokemon.hp, pokemon.atk, pokemon.def, pokemon.speDef, pokemon.attackType, pokemon.range, 1, pokemon.attackSprite, pokemon.rarity, pokemon.types, pokemon.items);
        this.applyEffects(pokemonEntity, pokemon.types, redEffects, blueEffects, redTeam, blueTeam);
        this.applyItemsEffects(pokemonEntity, pokemon.types);
        this.redTeam[pokemonEntity.id] = pokemonEntity;
        // console.log("entity x",pokemonEntity.positionX, "y", pokemonEntity.positionY);
        this.board.setValue(pokemonEntity.positionX, pokemonEntity.positionY, pokemonEntity);
      }
    }
    if (blueEffects.includes(EFFECTS.PRIMORDIAL_SEA)) {
      const kyogre = PokemonFactory.createPokemonFromName('kyogre');
      const coord = this.getFirstAvailablePlaceOnBoard(true);
      const pokemonEntity = new PokemonEntity(kyogre.name, kyogre.index, coord[0], coord[1], kyogre.hp, kyogre.atk, kyogre.def, kyogre.speDef, kyogre.attackType, kyogre.range, 0, kyogre.attackSprite, kyogre.rarity, kyogre.types, kyogre.items);
      this.applyEffects(pokemonEntity, kyogre.types, blueEffects, redEffects, blueTeam, redTeam);
      this.blueTeam[pokemonEntity.id] = pokemonEntity;
      this.board.setValue(coord[0], coord[1], pokemonEntity);
    }
    if (redEffects.includes(EFFECTS.PRIMORDIAL_SEA)) {
      const kyogre = PokemonFactory.createPokemonFromName('kyogre');
      const coord = this.getFirstAvailablePlaceOnBoard(false);
      const pokemonEntity = new PokemonEntity(kyogre.name, kyogre.index, coord[0], coord[1], kyogre.hp, kyogre.atk, kyogre.def, kyogre.speDef, kyogre.attackType, kyogre.range, 1, kyogre.attackSprite, kyogre.rarity, kyogre.types, kyogre.items);
      this.applyEffects(pokemonEntity, kyogre.types, blueEffects, redEffects, redTeam, blueTeam);
      this.redTeam[pokemonEntity.id] = pokemonEntity;
      this.board.setValue(coord[0], coord[1], pokemonEntity);
    }
  }

  getFirstAvailablePlaceOnBoard(ascending) {
    let row = 0;
    let column = 0;
    if (ascending) {
      outerloop:
      for (let x = 0; x < this.board.rows; x++) {
        for (let y = 0; y < this.board.columns; y++) {
          if (this.board.getValue(x, y) === undefined) {
            row = x;
            column = y;
            break outerloop;
          }
        }
      }
    } else {
      outerloop:
      for (let x = 0; x < this.board.rows; x++) {
        for (let y = this.board.columns - 1; y >= 0; y--) {
          if (this.board.getValue(x, y) === undefined) {
            row = x;
            column = y;
            break outerloop;
          }
        }
      }
    }
    return [row, column];
  }

  applyItemsEffects(pokemon,types){

    if(pokemon.items.count(ITEMS.WHITE_GLASSES) != 0){
      if(pokemon.attackType == ATTACK_TYPE.SPECIAL){
        pokemon.atk += Math.ceil(pokemon.baseAtk * 0.1) * pokemon.items.count(ITEMS.WHITE_GLASSES);
      }
    }

    if(pokemon.items.count(ITEMS.MUSCLE_BAND) != 0){
      if(pokemon.attackType == ATTACK_TYPE.PHYSICAL){
        pokemon.atk += Math.ceil(pokemon.baseAtk * 0.1) * pokemon.items.count(ITEMS.MUSCLE_BAND);
      }
    }

    if(pokemon.items.count(ITEMS.LIFE_ORB) != 0){
      pokemon.atk += Math.ceil(pokemon.baseAtk * 0.2) * pokemon.items.count(ITEMS.LIFE_ORB);
    }

    if(pokemon.items.count(ITEMS.MOON_STONE) != 0){
      if(types.includes(TYPE.FAIRY)){
        pokemon.atk += Math.ceil(pokemon.baseAtk * 0.5) * pokemon.items.count(ITEMS.MOON_STONE);
      }
    }

    if(pokemon.items.count(ITEMS.SILK_SCARF) != 0){
      if(types.includes(TYPE.NORMAL)){
        pokemon.atk += Math.ceil(pokemon.baseAtk * 0.5) * pokemon.items.count(ITEMS.SILK_SCARF);
      }
    }

    if(pokemon.items.count(ITEMS.SOFT_SAND) != 0){
      if(types.includes(TYPE.GROUND)){
        pokemon.atk += Math.ceil(pokemon.baseAtk * 0.5) * pokemon.items.count(ITEMS.SOFT_SAND);
      }
    }

    if(pokemon.items.count(ITEMS.NIGHT_STONE) != 0){
      if(types.includes(TYPE.DARK)){
        pokemon.atk += Math.ceil(pokemon.baseAtk * 0.5) * pokemon.items.count(ITEMS.NIGHT_STONE);
      }
    }
    
    if(pokemon.items.count(ITEMS.POISON_BARB) != 0){
      if(types.includes(TYPE.POISON)){
        pokemon.atk += Math.ceil(pokemon.baseAtk * 0.5) * pokemon.items.count(ITEMS.POISON_BARB);
      }
    }

    if(pokemon.items.count(ITEMS.DRAGON_FANG) != 0){
      if(types.includes(TYPE.DRAGON)){
        pokemon.atk += Math.ceil(pokemon.baseAtk * 0.5) * pokemon.items.count(ITEMS.DRAGON_FANG);
      }
    }

    if(pokemon.items.count(ITEMS.THUNDER_STONE) != 0){
      if(types.includes(TYPE.ELECTRIC)){
        pokemon.atk += Math.ceil(pokemon.baseAtk * 0.5) * pokemon.items.count(ITEMS.THUNDER_STONE);
      }
    }

    if(pokemon.items.count(ITEMS.METAL_SKIN) != 0){
      if(types.includes(TYPE.METAL)){
        pokemon.atk += Math.ceil(pokemon.baseAtk * 0.5) * pokemon.items.count(ITEMS.METAL_SKIN);
      }
    }

    if(pokemon.items.count(ITEMS.WATER_STONE) != 0){
      if(types.includes(TYPE.WATER)){
        pokemon.atk += Math.ceil(pokemon.baseAtk * 0.5) * pokemon.items.count(ITEMS.WATER_STONE);
      }
    }

    if(pokemon.items.count(ITEMS.FIRE_STONE) != 0){
      if(types.includes(TYPE.FIRE)){
        pokemon.atk += Math.ceil(pokemon.baseAtk * 0.5) * pokemon.items.count(ITEMS.FIRE_STONE);
      }
    }

    if(pokemon.items.count(ITEMS.LEAF_STONE) != 0){
      if(types.includes(TYPE.GRASS)){
        pokemon.atk += Math.ceil(pokemon.baseAtk * 0.5) * pokemon.items.count(ITEMS.LEAF_STONE);
      }
    }

    if(pokemon.items.count(ITEMS.BLACK_BELT) != 0){
      if(types.includes(TYPE.FIGHTING)){
        pokemon.atk += Math.ceil(pokemon.baseAtk * 0.5) * pokemon.items.count(ITEMS.BLACK_BELT);
      }
    }
  }

  applyEffects(pokemon, types, allyEffects, ennemyEffects, allyTeam, ennemyTeam) {
    allyEffects.forEach((effect) => {
      switch (effect) {
        case EFFECTS.BLAZE:
          if (types.includes(TYPE.FIRE)) {
            pokemon.effects.push(EFFECTS.BLAZE);
          }
          break;

        case EFFECTS.DROUGHT:
          if (this.climate == CLIMATE.SUN && types.includes(TYPE.FIRE)) {
            pokemon.effects.push(EFFECTS.DROUGHT);
            pokemon.atk += Math.ceil(pokemon.baseAtk * 0.33);
          }
          break;

        case EFFECTS.INGRAIN:
          if (types.includes(TYPE.GRASS)) {
            pokemon.effects.push(EFFECTS.INGRAIN);
          }
          break;

        case EFFECTS.GROWTH:
          if (types.includes(TYPE.GRASS)) {
            pokemon.effects.push(EFFECTS.GROWTH);
            pokemon.def += Math.ceil(pokemon.baseDef * 0.25);
          }
          break;

        case EFFECTS.DRIZZLE:
          if (this.climate == CLIMATE.RAIN && types.includes(TYPE.WATER)) {
            pokemon.effects.push(EFFECTS.DRIZZLE);
            pokemon.atk += Math.ceil(pokemon.baseAtk * 0.33);
          }
          break;

        case EFFECTS.RAIN_DANCE:
          if (this.climate == CLIMATE.RAIN && types.includes(TYPE.WATER)) {
            pokemon.effects.push(EFFECTS.RAIN_DANCE);
            pokemon.atk += Math.ceil(pokemon.baseAtk * 0.33);
          }
          break;

        case EFFECTS.STAMINA:
          if (types.includes(TYPE.NORMAL)) {
            pokemon.effects.push(EFFECTS.STAMINA);
            pokemon.life += Math.ceil(pokemon.hp * 0.3);
          }
          break;

        case EFFECTS.STRENGTH:
          if (types.includes(TYPE.NORMAL)) {
            pokemon.atk += Math.ceil(pokemon.baseAtk * 0.1);
            pokemon.def += Math.ceil(pokemon.baseDef * 0.1);
            pokemon.speDef += Math.ceil(pokemon.baseSpeDef * 0.1);
            pokemon.effects.push(EFFECTS.STRENGTH);
          }
          break;

        case EFFECTS.PURE_POWER:
          pokemon.atk += Math.ceil(pokemon.baseAtk);
          pokemon.effects.push(EFFECTS.PURE_POWER);
          break;

        case EFFECTS.AGILITY:
          if (types.includes(TYPE.ELECTRIC)) {
            let speedFactor = 1;
            for (const id in allyTeam) {
              if (allyTeam[id].types.includes(TYPE.ELECTRIC)) {
                speedFactor -= 0.1;
              }
            }
            pokemon.atkSpeed = Math.max(300,pokemon.atkSpeed * speedFactor);
            pokemon.effects.push(EFFECTS.AGILITY);
          }
          break;

        case EFFECTS.REVENGE:
          if (types.includes(TYPE.FIGHTING) && Object.keys(ennemyTeam).length > Object.keys(allyTeam).length) {
            pokemon.atk += Math.ceil(pokemon.baseAtk * 0.2);
            pokemon.effects.push(EFFECTS.REVENGE);
          }
          break;

        case EFFECTS.PUNISHMENT:
          if (types.includes(TYPE.FIGHTING)) {
            ennemyEffects.forEach((effect) =>{
              pokemon.atk += Math.ceil(pokemon.baseAtk * 0.1);
            });
            pokemon.effects.push(EFFECTS.PUNISHMENT);
          }
          break;

        case EFFECTS.IRON_DEFENSE:
          if (types.includes(TYPE.MINERAL)) {
            pokemon.def += Math.ceil(pokemon.baseDef * 0.5);
            pokemon.effects.push(EFFECTS.IRON_DEFENSE);
          }
          break;

        case EFFECTS.AUTOTOMIZE:
          if (types.includes(TYPE.MINERAL)) {
            pokemon.atkSpeed = Math.max(300, pokemon.atkSpeed * 0.5);
            pokemon.effects.push(EFFECTS.AUTOTOMIZE);
          }
          break;

        case EFFECTS.WORK_UP:
          if (types.includes(TYPE.FIELD)) {
            pokemon.atk += Math.ceil(pokemon.baseAtk * Object.keys(ennemyTeam).length * 0.04);
            pokemon.effects.push(EFFECTS.WORK_UP);
          }
          break;

        case EFFECTS.RAGE:
          if (types.includes(TYPE.FIELD)) {
            pokemon.effects.push(EFFECTS.RAGE);
          }
          break;

        case EFFECTS.ANGER_POINT:
          if (types.includes(TYPE.FIELD)) {
            pokemon.effects.push(EFFECTS.ANGER_POINT);
          }
          break;
          
        case EFFECTS.PURSUIT:
          if (types.includes(TYPE.MONSTER)) {
            pokemon.effects.push(EFFECTS.PURSUIT);
          }
          break;

        case EFFECTS.BRUTAL_SWING:
          if (types.includes(TYPE.MONSTER)) {
            pokemon.effects.push(EFFECTS.BRUTAL_SWING);
          }
          break;

        case EFFECTS.POWER_TRIP:
          if (types.includes(TYPE.MONSTER)) {
            pokemon.effects.push(EFFECTS.POWER_TRIP);
          }
          break;

        case EFFECTS.MEDITATE:
          pokemon.atk += Math.ceil(pokemon.baseAtk * 0.15);
          pokemon.def += Math.ceil(pokemon.baseDef * 0.15);
          pokemon.effects.push(EFFECTS.MEDITATE);
          break;

        case EFFECTS.FOCUS_ENERGY:
          pokemon.effects.push(EFFECTS.FOCUS_ENERGY);
          break;

        case EFFECTS.CALM_MIND:
          pokemon.atk += Math.ceil(pokemon.baseAtk * 0.3);
          pokemon.def += Math.ceil(pokemon.baseDef * 0.3);
          pokemon.effects.push(EFFECTS.CALM_MIND);
          break;

        case EFFECTS.SWIFT_SWIM:
          if (types.includes(TYPE.WATER) && this.climate == CLIMATE.RAIN) {
            pokemon.atkSpeed = Math.max(300,pokemon.atkSpeed * 0.7);
            pokemon.effects.push(EFFECTS.SWIFT_SWIM);
          }
          break;

        case EFFECTS.HYDO_CANNON:
          if (types.includes(TYPE.WATER) && this.climate == CLIMATE.RAIN) {
            pokemon.atk += Math.ceil(pokemon.baseAtk * 0.3);
            pokemon.effects.push(EFFECTS.HYDO_CANNON);
          }
          break;

        case EFFECTS.RAIN_DISH:
          if (types.includes(TYPE.FLORA) && this.climate == CLIMATE.RAIN) {
            pokemon.effects.push(EFFECTS.RAIN_DISH);
          }
          break;

        case EFFECTS.BATTLE_ARMOR:
          if (types.includes(TYPE.MINERAL)) {
            pokemon.def += Math.ceil(pokemon.baseDef * 0.25);
            pokemon.effects.push(EFFECTS.BATTLE_ARMOR);
          }
          break;

        case EFFECTS.PHANTOM_FORCE:
          if (types.includes(TYPE.AMORPH)) {
            pokemon.effects.push(EFFECTS.PHANTOM_FORCE);
          }

        case EFFECTS.ATTRACT:
          if (types.includes(TYPE.FAIRY)) {
            pokemon.effects.push(EFFECTS.ATTRACT);
          }
          break;

        case EFFECTS.BABY_DOLL_EYES:
          if (types.includes(TYPE.FAIRY)) {
            pokemon.effects.push(EFFECTS.BABY_DOLL_EYES);
          }
          break;

        case EFFECTS.FLOWER_SHIELD:
          pokemon.speDef += Math.ceil(pokemon.baseSpeDef * 0.3);
          pokemon.effects.push(EFFECTS.FLOWER_SHIELD);
          break;

        default:
          break;
      }
    });

    ennemyEffects.forEach((effect) => {
      switch (effect) {
        case EFFECTS.SPORE:
          pokemon.atkSpeed = pokemon.atkSpeed * 1.5;
          pokemon.effects.push(EFFECTS.SPORE);
          break;

        case EFFECTS.PSYWAVE:
          pokemon.speDef = Math.max(0, Math.ceil(pokemon.baseSpeDef * 0.7));
          pokemon.effects.push(EFFECTS.PSYWAVE);
          break;

        case EFFECTS.MAGIC_ROOM:
          pokemon.speDef = Math.max(0, Math.ceil(pokemon.baseSpeDef * 0.7));
          pokemon.effects.push(EFFECTS.MAGIC_ROOM);
          break;

        case EFFECTS.MEAN_LOOK:
          pokemon.def = Math.max(0, Math.ceil(pokemon.baseDef * 0.8));
          pokemon.effects.push(EFFECTS.MEAN_LOOK);
          break;

        case EFFECTS.SCARY_FACE:
          pokemon.def = Math.max(0, Math.ceil(pokemon.baseDef * 0.8));
          pokemon.effects.push(EFFECTS.SCARY_FACE);
          break;

        case EFFECTS.SPIKES:
          pokemon.life -= Math.ceil(pokemon.hp * 0.1);
          pokemon.effects.push(EFFECTS.SPIKES);
          break;

        case EFFECTS.STEALTH_ROCK:
          pokemon.life -= Math.ceil(pokemon.hp * 0.1);
          pokemon.effects.push(EFFECTS.STEALTH_ROCK);
          break;

        case EFFECTS.POISON_GAS:
          if (Math.random() > 0.9) {
            pokemon.effects.push(EFFECTS.POISON_GAS);
          }
          break;

        case EFFECTS.TOXIC:
          pokemon.effects.push(EFFECTS.TOXIC);
          break;

        case EFFECTS.INTIMIDATE:
          pokemon.atk -= Math.ceil(pokemon.baseAtk * 0.3);
          pokemon.effects.push(EFFECTS.INTIMIDATE);
          break;

        case EFFECTS.DRACO_METEOR:
          pokemon.life -= Math.ceil(pokemon.hp * 0.1);
          pokemon.effects.push(EFFECTS.DRACO_METEOR);

        case EFFECTS.STICKY_WEB:
          pokemon.atkSpeed = pokemon.atkSpeed * 1.3;
          pokemon.effects.push(EFFECTS.STICKY_WEB);
          break;

        case EFFECTS.RAZOR_WIND:
          pokemon.life -= Math.ceil(pokemon.hp * 0.1);
          pokemon.effects.push(EFFECTS.RAZOR_WIND);
          break;

        case EFFECTS.HURRICANE:
          pokemon.life -= Math.ceil(pokemon.hp * 0.1);
          pokemon.effects.push(EFFECTS.RAZOR_WIND);
          break;

        default:
          break;
      }
    });
  }

  getClimate() {
    let climate = CLIMATE.NEUTRAL;
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

  getEntryHazards() {
    if (this.blueEffects.includes(EFFECTS.SPIKES)) {
      this.redSpikes = true;
    }
    if (this.redEffects.includes(EFFECTS.SPIKES)) {
      this.blueSpikes = true;
    }
    if (this.blueEffects.includes(EFFECTS.STEALTH_ROCK)) {
      this.redRocks = true;
    }
    if (this.redEffects.includes(EFFECTS.STEALTH_ROCK)) {
      this.blueRocks = true;
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
    this.blueSpikes = false;
    this.redSpikes = false;
    this.blueRocks = false;
    this.redRocks = false;
  }
}

schema.defineTypes(Simulation, {
  blueTeam: {map: PokemonEntity},
  redTeam: {map: PokemonEntity},
  climate: 'string',
  blueSpikes: 'boolean',
  redSpikes: 'boolean',
  blueRocks: 'boolean',
  redRocks: 'boolean'
});

module.exports = Simulation;
