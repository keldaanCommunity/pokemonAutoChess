const Board = require('./board');
const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const MapSchema = schema.MapSchema;
const PokemonEntity = require('./pokemon-entity');
const PokemonFactory = require('../models/pokemon-factory');
const {CLIMATE, EFFECTS, TYPE, ITEMS, ATTACK_TYPE, PKM} = require('../models/enum');
const Dps = require('./dps');

class Simulation extends Schema {
  constructor(specialCells, mapType) {
    super();
    this.mapType = mapType;
    this.specialCells = specialCells;
    this.assign({
      blueSpikes: false,
      redSpikes: false,
      blueRocks: false,
      redRocks: false,
      blueEffects: [],
      redEffects: [],
      board: new Board(8, 6),
      redTeam: new MapSchema(),
      blueTeam: new MapSchema(),
      dpsMeter: new MapSchema()
    });
    this.initialize();
  }

  initialize(blueTeam, redTeam, blueEffects, redEffects) {
    this.board = new Board(8, 6);
    if (blueEffects) {
      this.blueEffects = blueEffects;
    }
    if (redEffects) {
      this.redEffects = redEffects;
    }
    // console.log('blueEffects', blueEffects);
    // console.log('redEffects', redEffects);
    this.climate = this.getClimate();
    this.getEntryHazards();
    this.finished = false;

    if (blueTeam) {
      blueTeam.forEach((pokemon, key) => {
        if (pokemon.positionY != 0) {
          this.addPokemon(pokemon, pokemon.positionX, pokemon.positionY - 1, 0);
        }
      });
    }

    if (redTeam) {
      redTeam.forEach((pokemon, key) => {
        if (pokemon.positionY != 0) {
          this.addPokemon(pokemon, pokemon.positionX, 5 - (pokemon.positionY - 1), 1);
        }
      });
    }

    if (blueEffects && blueEffects.includes(EFFECTS.PRIMORDIAL_SEA)) {
      const kyogre = PokemonFactory.createPokemonFromName(PKM.KYOGRE);
      const coord = this.getFirstAvailablePlaceOnBoard(true);
      this.addPokemon(kyogre, coord[0], coord[1], 0);
      

    }
    if (redEffects && redEffects.includes(EFFECTS.PRIMORDIAL_SEA)) {
      const kyogre = PokemonFactory.createPokemonFromName(PKM.KYOGRE);
      const coord = this.getFirstAvailablePlaceOnBoard(false);
      this.addPokemon(kyogre, coord[0], coord[1], 1);
    }
  }

  addPokemon(pokemon, x, y, team){
    const pokemonEntity = new PokemonEntity(pokemon, x, y, team, this);

    this.applyItemsEffects(pokemonEntity, pokemon.types);
    this.board.setValue(pokemonEntity.positionX, pokemonEntity.positionY, pokemonEntity);

    if(team == 0){
      this.applyEffects(pokemonEntity, pokemon.types, this.blueEffects, this.redEffects, this.blueTeam, this.redTeam);
      this.applySpecialCellsEffects(pokemonEntity);
      const dps = new Dps(pokemonEntity.id, pokemonEntity.name);
      this.blueTeam.set(pokemonEntity.id, pokemonEntity);
      this.dpsMeter.set(pokemonEntity.id, dps);
    }
    if(team == 1){
      this.applyEffects(pokemonEntity, pokemon.types, this.redEffects, this.blueEffects, this.redTeam, this.blueTeam);
      this.redTeam.set(pokemonEntity.id, pokemonEntity);
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

  applySpecialCellsEffects(pokemon) {
    this.specialCells.forEach((cell)=>{
      if (cell.positionX == pokemon.positionX && cell.positionY == pokemon.positionY) {
        switch (EFFECTS[this.mapType]) {
          case EFFECTS.FIRE:
            pokemon.atk += Math.ceil(pokemon.baseAtk * 0.2);
            break;

          case EFFECTS.WATER:
            pokemon.speDef += Math.ceil(pokemon.baseSpeDef * 0.2);
            break;

          case EFFECTS.NORMAL:
            pokemon.life += Math.ceil(pokemon.hp * 0.3);
            break;

          case EFFECTS.ICE:
            pokemon.atkSpeed = Math.max(400, pokemon.atkSpeed * 0.9);
            break;

          case EFFECTS.GROUND:
            pokemon.def += Math.ceil(pokemon.baseDef * 0.2);
            break;

          default:
            break;
        }
        pokemon.effects.push(EFFECTS[this.mapType]);
      }
    });
  }

  applyItemsEffects(pokemon, types) {

    if(pokemon.items.count(ITEMS.WONDER_BOX) != 0){
      pokemon.items.remove(ITEMS.WONDER_BOX);
      pokemon.items.add(Object.keys(ITEMS)[Math.floor(Math.random() * Object.keys(ITEMS).length)]);
      pokemon.items.add(Object.keys(ITEMS)[Math.floor(Math.random() * Object.keys(ITEMS).length)]);
    }

    if(pokemon.items.count(ITEMS.ASSAULT_VEST) != 0){
      pokemon.speDef += Math.ceil(pokemon.baseSpeDef * 0.5) * pokemon.items.count(ITEMS.ASSAULT_VEST);
    }

    if (pokemon.items.count(ITEMS.SCOPE_LENS) != 0) {
      pokemon.critChance += 50 * pokemon.items.count(ITEMS.SCOPE_LENS);
    }

    if (pokemon.items.count(ITEMS.WHITE_GLASSES) != 0) {
      if (pokemon.attackType == ATTACK_TYPE.SPECIAL) {
        pokemon.atk += Math.ceil(pokemon.baseAtk * 0.3) * pokemon.items.count(ITEMS.WHITE_GLASSES);
      }
    }

    if (pokemon.items.count(ITEMS.MUSCLE_BAND) != 0) {
      if (pokemon.attackType == ATTACK_TYPE.PHYSICAL) {
        pokemon.atk += Math.ceil(pokemon.baseAtk * 0.3) * pokemon.items.count(ITEMS.MUSCLE_BAND);
      }
    }

    if (pokemon.items.count(ITEMS.LIFE_ORB) != 0) {
      pokemon.atk += Math.ceil(pokemon.baseAtk) * pokemon.items.count(ITEMS.LIFE_ORB);
    }

    if (pokemon.items.count(ITEMS.MOON_STONE) != 0) {
      if (types.includes(TYPE.FAIRY)) {
        pokemon.atk += Math.ceil(pokemon.baseAtk * 0.5) * pokemon.items.count(ITEMS.MOON_STONE);
      }
      pokemon.atkSpeed = Math.max(400, pokemon.atkSpeed * (1 - 0.1* pokemon.items.count(ITEMS.MOON_STONE)));
    }

    if (pokemon.items.count(ITEMS.SILK_SCARF) != 0) {
      if (types.includes(TYPE.NORMAL)) {
        pokemon.atk += Math.ceil(pokemon.baseAtk * 0.5) * pokemon.items.count(ITEMS.SILK_SCARF);
      }
      pokemon.atkSpeed = Math.max(400, pokemon.atkSpeed * (1 - 0.1 * pokemon.items.count(ITEMS.SILK_SCARF)));
    }

    if (pokemon.items.count(ITEMS.SOFT_SAND) != 0) {
      if (types.includes(TYPE.GROUND)) {
        pokemon.atk += Math.ceil(pokemon.baseAtk * 0.5) * pokemon.items.count(ITEMS.SOFT_SAND);
      }
      pokemon.atkSpeed = Math.max(400, pokemon.atkSpeed * (1 - 0.1 * pokemon.items.count(ITEMS.SOFT_SAND)));
    }

    if (pokemon.items.count(ITEMS.NIGHT_STONE) != 0) {
      if (types.includes(TYPE.DARK)) {
        pokemon.atk += Math.ceil(pokemon.baseAtk * 0.5) * pokemon.items.count(ITEMS.NIGHT_STONE);
      }
      pokemon.atkSpeed = Math.max(400, pokemon.atkSpeed * (1 - 0.1 * pokemon.items.count(ITEMS.NIGHT_STONE)));
    }

    if (pokemon.items.count(ITEMS.POISON_BARB) != 0) {
      if (types.includes(TYPE.POISON)) {
        pokemon.atk += Math.ceil(pokemon.baseAtk * 0.5) * pokemon.items.count(ITEMS.POISON_BARB);
      }
      pokemon.atkSpeed = Math.max(400, pokemon.atkSpeed * (1 - 0.1 * pokemon.items.count(ITEMS.POISON_BARB)));
    }

    if (pokemon.items.count(ITEMS.DRAGON_FANG) != 0) {
      if (types.includes(TYPE.DRAGON)) {
        pokemon.atk += Math.ceil(pokemon.baseAtk * 0.5) * pokemon.items.count(ITEMS.DRAGON_FANG);
      }
      pokemon.atkSpeed = Math.max(400, pokemon.atkSpeed * (1 - 0.1 * pokemon.items.count(ITEMS.DRAGON_FANG)));
    }

    if (pokemon.items.count(ITEMS.THUNDER_STONE) != 0) {
      if (types.includes(TYPE.ELECTRIC)) {
        pokemon.atk += Math.ceil(pokemon.baseAtk * 0.5) * pokemon.items.count(ITEMS.THUNDER_STONE);
      }
      pokemon.atkSpeed = Math.max(400, pokemon.atkSpeed * (1 - 0.1 * pokemon.items.count(ITEMS.THUNDER_STONE)));
    }

    if (pokemon.items.count(ITEMS.METAL_SKIN) != 0) {
      if (types.includes(TYPE.METAL)) {
        pokemon.atk += Math.ceil(pokemon.baseAtk * 0.5) * pokemon.items.count(ITEMS.METAL_SKIN);
      }
      pokemon.atkSpeed = Math.max(400, pokemon.atkSpeed * (1 - 0.1 * pokemon.items.count(ITEMS.METAL_SKIN)));
    }

    if (pokemon.items.count(ITEMS.WATER_STONE) != 0) {
      if (types.includes(TYPE.WATER)) {
        pokemon.atk += Math.ceil(pokemon.baseAtk * 0.5) * pokemon.items.count(ITEMS.WATER_STONE);
      }
      pokemon.atkSpeed = Math.max(400, pokemon.atkSpeed * (1 - 0.1 * pokemon.items.count(ITEMS.WATER_STONE)));
    }

    if (pokemon.items.count(ITEMS.FIRE_STONE) != 0) {
      if (types.includes(TYPE.FIRE)) {
        pokemon.atk += Math.ceil(pokemon.baseAtk * 0.5) * pokemon.items.count(ITEMS.FIRE_STONE);
      }
      pokemon.atkSpeed = Math.max(400, pokemon.atkSpeed * (1 - 0.1 * pokemon.items.count(ITEMS.FIRE_STONE)));
    }

    if (pokemon.items.count(ITEMS.ICY_ROCK) != 0) {
      if (types.includes(TYPE.ICE)) {
        pokemon.atk += Math.ceil(pokemon.baseAtk * 0.5) * pokemon.items.count(ITEMS.ICY_ROCK);
      }
    }

    if (pokemon.items.count(ITEMS.LEAF_STONE) != 0) {
      if (types.includes(TYPE.GRASS)) {
        pokemon.atk += Math.ceil(pokemon.baseAtk * 0.5) * pokemon.items.count(ITEMS.LEAF_STONE);
      }
      pokemon.atkSpeed = Math.max(400, pokemon.atkSpeed * (1 - 0.1 * pokemon.items.count(ITEMS.LEAF_STONE)));
    }

    if (pokemon.items.count(ITEMS.BLACK_BELT) != 0) {
      if (types.includes(TYPE.FIGHTING)) {
        pokemon.atk += Math.ceil(pokemon.baseAtk * 0.5) * pokemon.items.count(ITEMS.BLACK_BELT);
      }
      pokemon.atkSpeed = Math.max(400, pokemon.atkSpeed * (1 - 0.1 * pokemon.items.count(ITEMS.BLACK_BELT)));
    }

    if (pokemon.items.count(ITEMS.DAWN_STONE) != 0) {
      if (types.includes(TYPE.PSYCHIC)) {
        pokemon.atk += Math.ceil(pokemon.baseAtk * 0.5) * pokemon.items.count(ITEMS.DAWN_STONE);
      }
      pokemon.atkSpeed = Math.max(400, pokemon.atkSpeed * (1 - 0.1 * pokemon.items.count(ITEMS.DAWN_STONE)));
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
            pokemon.atk += Math.ceil(pokemon.baseAtk * 0.5);
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
            const pokemonNames = [];

            allyTeam.forEach((pkm, key) => {
              if (pkm.types.includes(TYPE.ELECTRIC)) {
                const family = PokemonFactory.getPokemonFamily(pkm.name);
                if (!pokemonNames.includes(family)) {
                  pokemonNames.push(family);
                }
              }
            });

            const speedFactor = 1- 0.1 * pokemonNames.length;
            pokemon.atkSpeed = Math.max(400, pokemon.atkSpeed * speedFactor);
            pokemon.effects.push(EFFECTS.AGILITY);
          }
          break;

        case EFFECTS.REVENGE:
          if (types.includes(TYPE.FIGHTING) && ennemyTeam.size > allyTeam.size) {
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
          if (types.includes(TYPE.METAL)) {
            pokemon.def += Math.ceil(pokemon.baseDef * 0.5);
            pokemon.effects.push(EFFECTS.IRON_DEFENSE);
          }
          break;

        case EFFECTS.AUTOTOMIZE:
          if (types.includes(TYPE.METAL)) {
            pokemon.atkSpeed = Math.max(400, pokemon.atkSpeed * 0.5);
            pokemon.effects.push(EFFECTS.AUTOTOMIZE);
          }
          break;

        case EFFECTS.WORK_UP:
          if (types.includes(TYPE.FIELD)) {
            pokemon.atk += Math.ceil(pokemon.baseAtk * ennemyTeam.size * 0.06);
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
            pokemon.atkSpeed = Math.max(400, pokemon.atkSpeed * 0.5);
          }
          break;

        case EFFECTS.PURSUIT:
          pokemon.effects.push(EFFECTS.PURSUIT);

          break;

        case EFFECTS.BRUTAL_SWING:
          pokemon.effects.push(EFFECTS.BRUTAL_SWING);

          break;

        case EFFECTS.POWER_TRIP:
          pokemon.effects.push(EFFECTS.POWER_TRIP);
          break;

        case EFFECTS.AMNESIA:
          pokemon.effects.push(EFFECTS.AMNESIA);
          pokemon.speDef += 5;
          break;
        
        case EFFECTS.LIGHT_SCREEN:
          pokemon.effects.push(EFFECTS.LIGHT_SCREEN);
          pokemon.speDef += 10;
          break;
        
        case EFFECTS.EERIE_SPELL:
          pokemon.effects.push(EFFECTS.EERIE_SPELL);
          pokemon.speDef += 20;
          break;

        case EFFECTS.MEDITATE:
          pokemon.atk += Math.ceil(pokemon.baseAtk * 0.15);
          pokemon.life += Math.ceil(pokemon.hp * 0.15);
          pokemon.effects.push(EFFECTS.MEDITATE);
          break;

        case EFFECTS.FOCUS_ENERGY:
          pokemon.atk += Math.ceil(pokemon.baseAtk * 0.2);
          pokemon.life += Math.ceil(pokemon.hp * 0.2);
          pokemon.effects.push(EFFECTS.FOCUS_ENERGY);
          break;

        case EFFECTS.CALM_MIND:
          pokemon.atk += Math.ceil(pokemon.baseAtk * 0.3);
          pokemon.life += Math.ceil(pokemon.hp * 0.3);
          pokemon.effects.push(EFFECTS.CALM_MIND);
          break;

        case EFFECTS.TAILWIND:
          if(types.includes(TYPE.FLYING)){
            pokemon.critChance += 10;
            pokemon.effects.push(EFFECTS.TAILWIND);
          }
          break;

        case EFFECTS.FEATHER_DANCE:
          if(types.includes(TYPE.FLYING)){
            pokemon.critChance += 20;
            pokemon.effects.push(EFFECTS.FEATHER_DANCE);
          }
          break;

        case EFFECTS.MAX_AIRSTREAM:
          if(types.includes(TYPE.FLYING)){
            pokemon.critChance += 40;
            pokemon.effects.push(EFFECTS.MAX_AIRSTREAM);
          }
          break;

        case EFFECTS.SWIFT_SWIM:
          if (types.includes(TYPE.AQUATIC)) {
            pokemon.atkSpeed = Math.max(400, pokemon.atkSpeed * 0.7);
            pokemon.effects.push(EFFECTS.SWIFT_SWIM);
          }
          break;

        case EFFECTS.HYDO_CANNON:
          if (types.includes(TYPE.AQUATIC)) {
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
            pokemon.def += Math.ceil(pokemon.baseDef * 0.5);
            pokemon.effects.push(EFFECTS.BATTLE_ARMOR);
          }
          break;

        case EFFECTS.MOUTAIN_RESISTANCE:
          if (types.includes(TYPE.MINERAL)) {
            pokemon.speDef += Math.ceil(pokemon.baseSpeDef * 0.5);
            pokemon.life += Math.ceil(pokemon.hp);
            pokemon.effects.push(EFFECTS.MOUTAIN_RESISTANCE);
          }
          break;

        case EFFECTS.PHANTOM_FORCE:
          if (types.includes(TYPE.AMORPH)) {
            pokemon.atkSpeed = Math.max(400, pokemon.atkSpeed * 0.85);
            pokemon.effects.push(EFFECTS.PHANTOM_FORCE);
          }
          break;

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
          pokemon.speDef += Math.ceil(pokemon.baseSpeDef * 0.5);
          pokemon.speDef += Math.ceil(pokemon.baseDef * 0.5);
          pokemon.effects.push(EFFECTS.FLOWER_SHIELD);
          break;

        case EFFECTS.DRAGON_DANCE:
          if (types.includes(TYPE.DRAGON)) {
            pokemon.effects.push(EFFECTS.DRAGON_DANCE);
          }
          break;

        case EFFECTS.SNOW:
          if(this.climate == CLIMATE.SNOW){
            pokemon.effects.push(EFFECTS.SNOW);
          }
          break;

        case EFFECTS.SHEER_COLD:
          if(this.climate == CLIMATE.SNOW){
            pokemon.effects.push(EFFECTS.SHEER_COLD);
          }
          break;

        case EFFECTS.POISON_GAS:
          if(types.includes(TYPE.POISON)){
            pokemon.effects.push(EFFECTS.POISON_GAS);
          }
          break;

        case EFFECTS.TOXIC:
          if(types.includes(TYPE.POISON)){
            pokemon.effects.push(EFFECTS.TOXIC);
          }
          break;

        default:
          break;
      }
    });

    ennemyEffects.forEach((effect) => {
      switch (effect) {
        case EFFECTS.SPORE:
          pokemon.atkSpeed = pokemon.atkSpeed * 1.3;
          pokemon.effects.push(EFFECTS.SPORE);
          break;

        case EFFECTS.MEAN_LOOK:
          pokemon.def = Math.max(0, Math.floor(pokemon.baseDef * 0.8));
          pokemon.effects.push(EFFECTS.MEAN_LOOK);
          break;

        case EFFECTS.SCARY_FACE:
          pokemon.def = Math.max(0, Math.floor(pokemon.baseDef * 0.8));
          pokemon.effects.push(EFFECTS.SCARY_FACE);
          break;

        case EFFECTS.SPIKES:
          pokemon.handleDamage(Math.ceil(pokemon.hp * 0.1), this.board, ATTACK_TYPE.TRUE);
          pokemon.effects.push(EFFECTS.SPIKES);
          break;

        case EFFECTS.STEALTH_ROCK:
          pokemon.handleDamage(Math.ceil(pokemon.hp * 0.1), this.board, ATTACK_TYPE.TRUE);
          pokemon.effects.push(EFFECTS.STEALTH_ROCK);
          break;

        case EFFECTS.INTIMIDATE:
          pokemon.atk -= Math.ceil(pokemon.baseAtk * 0.3);
          pokemon.effects.push(EFFECTS.INTIMIDATE);
          break;

        case EFFECTS.STICKY_WEB:
          pokemon.atkSpeed = pokemon.atkSpeed * 1.3;
          pokemon.effects.push(EFFECTS.STICKY_WEB);
          break;

        default:
          break;
      }
    });
  }

  getClimate() {
    let climate = CLIMATE.NEUTRAL;
    if (this.blueEffects.includes(EFFECTS.SNOW) || this.redEffects.includes(EFFECTS.SNOW)) {
      climate = CLIMATE.SNOW;
    }
    if (this.blueEffects.includes(EFFECTS.DRIZZLE) || this.redEffects.includes(EFFECTS.DRIZZLE)) {
      climate = CLIMATE.RAIN;
    }
    if (this.blueEffects.includes(EFFECTS.SANDSTORM) || this.redEffects.includes(EFFECTS.SANDSTORM)) {
      climate = CLIMATE.SANDSTORM;
    }
    if (this.blueEffects.includes(EFFECTS.DROUGHT) || this.redEffects.includes(EFFECTS.DROUGHT)) {
      climate = CLIMATE.SUN;
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
    if (this.blueTeam.size == 0 || this.redTeam.size == 0) {
      this.finished = true;
    }

    this.blueTeam.forEach((pkm, key) => {
      if(!pkm.life){
        this.blueTeam.delete(key);
      }
      if (pkm.life <= 0) {
        this.blueTeam.delete(key);
      } else {
        pkm.update(dt, this.board, this.climate);
        this.dpsMeter.get(key).changeDamage(pkm.damageDone);
      }
    });


    this.redTeam.forEach((pkm, key) => {
      if(!pkm.life){
        this.redTeam.delete(key);
      }
      if (pkm.life <= 0) {
        this.redTeam.delete(key);
      } else {
        pkm.update(dt, this.board, this.climate);
      }
    });
  }

  stop() {
    this.blueTeam.forEach((pokemon, key) => {
      // console.log('deleting ' + pokemon.name);
      this.blueTeam.delete(key);
    });

    this.redTeam.forEach((pokemon, key) => {
      // console.log('deleting ' + pokemon.name);
      this.redTeam.delete(key);
    });

    this.dpsMeter.forEach((dps, key) => {
      // console.log('deleting ' + dps.name);
      this.dpsMeter.delete(key);
    });

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
  dpsMeter: {map: Dps},
  climate: 'string',
  blueSpikes: 'boolean',
  redSpikes: 'boolean',
  blueRocks: 'boolean',
  redRocks: 'boolean'
});

module.exports = Simulation;
