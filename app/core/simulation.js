const Board = require('./board');
const schema = require('@colyseus/schema');
const Schema = schema.Schema;
const MapSchema = schema.MapSchema;
const PokemonEntity = require('./pokemon-entity');
const PokemonFactory = require('../models/pokemon-factory');
const ItemFactory = require('../models/item-factory');
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
    this.flowerSpawn = [false, false];

    if (blueTeam) {
      blueTeam.forEach((pokemon, key) => {
        if (pokemon.positionY != 0) {
          this.addPokemon(pokemon, pokemon.positionX, pokemon.positionY - 1, 0, blueTeam, redTeam);
        }
      });
    }

    if (redTeam) {
      redTeam.forEach((pokemon, key) => {
        if (pokemon.positionY != 0) {
          this.addPokemon(pokemon, pokemon.positionX, 5 - (pokemon.positionY - 1), 1, blueTeam, redTeam);
        }
      });
    }

    if (blueEffects && blueEffects.includes(EFFECTS.PRIMORDIAL_SEA)) {
      const kyogre = PokemonFactory.createPokemonFromName(PKM.KYOGRE);
      const coord = this.getFirstAvailablePlaceOnBoard(true);
      this.addPokemon(kyogre, coord[0], coord[1], 0);
    }

    if (blueEffects && blueEffects.includes(EFFECTS.SWARM)) {
      const bugTeam = [];
      blueTeam.forEach((pkm)=>{
        if (pkm.types.includes(TYPE.BUG) && pkm.positionY != 0) {
          bugTeam.push(pkm.name);
        }
      });
      const randomBug = bugTeam[Math.floor(Math.random() * bugTeam.length)];
      const bug = PokemonFactory.createPokemonFromName(randomBug);
      const coord = this.getFirstAvailablePlaceOnBoard(true);
      this.addPokemon(bug, coord[0], coord[1], 0);
    }

    if (blueEffects && blueEffects.includes(EFFECTS.STICKY_WEB)) {
      const bugTeam = [];
      blueTeam.forEach((pkm)=>{
        if (pkm.types.includes(TYPE.BUG) && pkm.positionY != 0) {
          bugTeam.push(pkm.name);
        }
      });
      bugTeam.forEach((b)=>{
        const bug = PokemonFactory.createPokemonFromName(b);
        const coord = this.getFirstAvailablePlaceOnBoard(true);
        this.addPokemon(bug, coord[0], coord[1], 0);
      });
    }


    if (redEffects && redEffects.includes(EFFECTS.PRIMORDIAL_SEA)) {
      const kyogre = PokemonFactory.createPokemonFromName(PKM.KYOGRE);
      const coord = this.getFirstAvailablePlaceOnBoard(false);
      this.addPokemon(kyogre, coord[0], coord[1], 1);
    }

    if (redEffects && redEffects.includes(EFFECTS.SWARM)) {
      const bugTeam = [];
      redTeam.forEach((pkm)=>{
        if (pkm.types.includes(TYPE.BUG) && pkm.positionY != 0) {
          bugTeam.push(pkm.name);
        }
      });
      const randomBug = bugTeam[Math.floor(Math.random() * bugTeam.length)];
      const bug = PokemonFactory.createPokemonFromName(randomBug);
      const coord = this.getFirstAvailablePlaceOnBoard(false);
      this.addPokemon(bug, coord[0], coord[1], 1);
    }

    if (redEffects && redEffects.includes(EFFECTS.STICKY_WEB)) {
      const bugTeam = [];
      redTeam.forEach((pkm)=>{
        if (pkm.types.includes(TYPE.BUG) && pkm.positionY != 0) {
          bugTeam.push(pkm.name);
        }
      });
      bugTeam.forEach((b)=>{
        const bug = PokemonFactory.createPokemonFromName(b);
        const coord = this.getFirstAvailablePlaceOnBoard(false);
        this.addPokemon(bug, coord[0], coord[1], 1);
      });
    }

    this.applyPostEffects();
  }

  addPokemon(pokemon, x, y, team, blueTeam, redTeam) {
    const pokemonEntity = new PokemonEntity(pokemon, x, y, team, this);
    // pokemonEntity.triggerSleep(5000);
    this.applyItemsEffects(pokemonEntity, pokemon.types);
    this.board.setValue(pokemonEntity.positionX, pokemonEntity.positionY, pokemonEntity);
    this.applySpecialCellsEffects(pokemonEntity);

    if (team == 0) {
      this.applyEffects(pokemonEntity, pokemon.types, this.blueEffects, this.redEffects, blueTeam, redTeam);
      const dps = new Dps(pokemonEntity.id, pokemonEntity.name);
      this.blueTeam.set(pokemonEntity.id, pokemonEntity);
      this.dpsMeter.set(pokemonEntity.id, dps);
    }
    if (team == 1) {
      this.applyEffects(pokemonEntity, pokemon.types, this.redEffects, this.blueEffects, redTeam, blueTeam);
      this.redTeam.set(pokemonEntity.id, pokemonEntity);
    }
    return pokemonEntity;
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
            pokemon.shield += Math.ceil(pokemon.hp * 0.3);
            break;

          case EFFECTS.ICE:
            pokemon.handleAttackSpeed(10);
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
    if (pokemon.items.count(ITEMS.WONDER_BOX) != 0) {
      pokemon.items.remove(ITEMS.WONDER_BOX);
      pokemon.items.add(ItemFactory.createRandomWonderBoxItem());
      pokemon.items.add(ItemFactory.createRandomWonderBoxItem());
    }

    if (pokemon.items.count(ITEMS.ASSAULT_VEST) != 0) {
      pokemon.speDef += Math.ceil(pokemon.baseSpeDef * 0.5) * pokemon.items.count(ITEMS.ASSAULT_VEST);
    }

    if (pokemon.items.count(ITEMS.SCOPE_LENS) != 0) {
      pokemon.addCritChance(50 * pokemon.items.count(ITEMS.SCOPE_LENS));
    }

    if (pokemon.items.count(ITEMS.RAZOR_FANG)) {
      pokemon.critDamage += 0.5 * pokemon.items.count(ITEMS.RAZOR_FANG);
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
      pokemon.handleAttackSpeed( 10 * pokemon.items.count(ITEMS.MOON_STONE));
    }

    if (pokemon.items.count(ITEMS.SILK_SCARF) != 0) {
      if (types.includes(TYPE.NORMAL)) {
        pokemon.atk += Math.ceil(pokemon.baseAtk * 0.5) * pokemon.items.count(ITEMS.SILK_SCARF);
      }
      pokemon.handleAttackSpeed( 10 * pokemon.items.count(ITEMS.SILK_SCARF));
    }

    if (pokemon.items.count(ITEMS.SOFT_SAND) != 0) {
      if (types.includes(TYPE.GROUND)) {
        pokemon.atk += Math.ceil(pokemon.baseAtk * 0.5) * pokemon.items.count(ITEMS.SOFT_SAND);
      }
      pokemon.handleAttackSpeed( 10 * pokemon.items.count(ITEMS.SOFT_SAND));
    }

    if (pokemon.items.count(ITEMS.NIGHT_STONE) != 0) {
      if (types.includes(TYPE.DARK)) {
        pokemon.atk += Math.ceil(pokemon.baseAtk * 0.5) * pokemon.items.count(ITEMS.NIGHT_STONE);
      }
      pokemon.handleAttackSpeed( 10 * pokemon.items.count(ITEMS.NIGHT_STONE));
    }

    if (pokemon.items.count(ITEMS.POISON_BARB) != 0) {
      if (types.includes(TYPE.POISON)) {
        pokemon.atk += Math.ceil(pokemon.baseAtk * 0.5) * pokemon.items.count(ITEMS.POISON_BARB);
      }
      pokemon.handleAttackSpeed( 10 * pokemon.items.count(ITEMS.POISON_BARB));
    }

    if (pokemon.items.count(ITEMS.DRAGON_FANG) != 0) {
      if (types.includes(TYPE.DRAGON)) {
        pokemon.atk += Math.ceil(pokemon.baseAtk * 0.5) * pokemon.items.count(ITEMS.DRAGON_FANG);
      }
      pokemon.handleAttackSpeed( 10 * pokemon.items.count(ITEMS.DRAGON_FANG));
    }

    if (pokemon.items.count(ITEMS.THUNDER_STONE) != 0) {
      if (types.includes(TYPE.ELECTRIC)) {
        pokemon.atk += Math.ceil(pokemon.baseAtk * 0.5) * pokemon.items.count(ITEMS.THUNDER_STONE);
      }
      pokemon.handleAttackSpeed( 10 * pokemon.items.count(ITEMS.THUNDER_STONE));
    }

    if (pokemon.items.count(ITEMS.METAL_SKIN) != 0) {
      if (types.includes(TYPE.METAL)) {
        pokemon.atk += Math.ceil(pokemon.baseAtk * 0.5) * pokemon.items.count(ITEMS.METAL_SKIN);
      }
      pokemon.handleAttackSpeed( 10 * pokemon.items.count(ITEMS.METAL_SKIN));
    }

    if (pokemon.items.count(ITEMS.WATER_STONE) != 0) {
      if (types.includes(TYPE.WATER)) {
        pokemon.atk += Math.ceil(pokemon.baseAtk * 0.5) * pokemon.items.count(ITEMS.WATER_STONE);
      }
      pokemon.handleAttackSpeed( 10 * pokemon.items.count(ITEMS.WATER_STONE));
    }

    if (pokemon.items.count(ITEMS.FIRE_STONE) != 0) {
      if (types.includes(TYPE.FIRE)) {
        pokemon.atk += Math.ceil(pokemon.baseAtk * 0.5) * pokemon.items.count(ITEMS.FIRE_STONE);
      }
      pokemon.handleAttackSpeed( 10 * pokemon.items.count(ITEMS.FIRE_STONE));
    }

    if (pokemon.items.count(ITEMS.ICY_ROCK) != 0) {
      if (types.includes(TYPE.ICE)) {
        pokemon.handleAttackSpeed( 10 * pokemon.items.count(ITEMS.ICY_ROCK));
      }
    }

    if (pokemon.items.count(ITEMS.LEAF_STONE) != 0) {
      if (types.includes(TYPE.GRASS)) {
        pokemon.atk += Math.ceil(pokemon.baseAtk * 0.5) * pokemon.items.count(ITEMS.LEAF_STONE);
      }
      pokemon.handleAttackSpeed( 10 * pokemon.items.count(ITEMS.LEAF_STONE));
    }

    if (pokemon.items.count(ITEMS.BLACK_BELT) != 0) {
      if (types.includes(TYPE.FIGHTING)) {
        pokemon.atk += Math.ceil(pokemon.baseAtk * 0.5) * pokemon.items.count(ITEMS.BLACK_BELT);
      }
      pokemon.handleAttackSpeed( 10 * pokemon.items.count(ITEMS.BLACK_BELT));
    }

    if (pokemon.items.count(ITEMS.DAWN_STONE) != 0) {
      if (types.includes(TYPE.PSYCHIC)) {
        pokemon.atk += Math.ceil(pokemon.baseAtk * 0.5) * pokemon.items.count(ITEMS.DAWN_STONE);
      }
      pokemon.handleAttackSpeed( 10 * pokemon.items.count(ITEMS.DAWN_STONE));
    }
  }

  applyPostEffects() {
    let blueImperialCount = 1;
    this.blueTeam.forEach((pokemon) =>{
      if (pokemon.effects.includes(EFFECTS.IRON_DEFENSE)) {
        if (blueImperialCount > 0) {
          pokemon.atk = pokemon.atk * 2;
          blueImperialCount --;
        } else {
          pokemon.effects.splice(pokemon.effects.findIndex((e) => e === EFFECTS.IRON_DEFENSE), 1);
        }
      }
      if (pokemon.effects.includes(EFFECTS.AUTOTOMIZE)) {
        pokemon.atk = pokemon.atk * 2;
      }
      let shieldBonus = 0;
      if (pokemon.effects.includes(EFFECTS.STAMINA)) {
        shieldBonus = 20;
      }
      if (pokemon.effects.includes(EFFECTS.STRENGTH)) {
        shieldBonus += 50;
      }
      if (pokemon.effects.includes(EFFECTS.PURE_POWER)) {
        shieldBonus += 100;
      }
      if (shieldBonus >= 0) {
        pokemon.shield += shieldBonus;
        const cells = this.board.getAdjacentCells(pokemon.positionX, pokemon.positionY);

        cells.forEach((cell) => {
          if (cell.value && pokemon.team == cell.value.team) {
            cell.value.shield += shieldBonus;
          }
        });
      }
    });

    let redImperialCount = 1;
    this.redTeam.forEach((pokemon) =>{
      if (pokemon.effects.includes(EFFECTS.IRON_DEFENSE)) {
        if (redImperialCount > 0) {
          pokemon.atk = pokemon.atk * 2;
          redImperialCount --;
        } else {
          pokemon.effects.splice(pokemon.effects.findIndex((e) => e === EFFECTS.IRON_DEFENSE), 1);
        }
      }
      if (pokemon.effects.includes(EFFECTS.AUTOTOMIZE)) {
        pokemon.atk = pokemon.atk * 2;
      }
      let shieldBonus = 0;
      if (pokemon.effects.includes(EFFECTS.STAMINA)) {
        shieldBonus = 20;
      }
      if (pokemon.effects.includes(EFFECTS.STRENGTH)) {
        shieldBonus += 30;
      }
      if (pokemon.effects.includes(EFFECTS.PURE_POWER)) {
        shieldBonus += 50;
      }
      if (shieldBonus >= 0) {
        pokemon.shield += shieldBonus;
        const cells = this.board.getAdjacentCells(pokemon.positionX, pokemon.positionY);

        cells.forEach((cell) => {
          if (cell.value && pokemon.team == cell.value.team) {
            cell.value.shield += shieldBonus;
          }
        });
      }
    });
  }

  applyEffects(pokemon, types, allyEffects, ennemyEffects, allyTeam, ennemyTeam) {
    allyEffects.forEach((effect) => {
      switch (effect) {
        case EFFECTS.HONE_CLAWS:
          if (types.includes(TYPE.DARK) && pokemon.items.length != 0) {
            pokemon.atk += 4 * pokemon.items.length;
            pokemon.shield += 20 * pokemon.items.length;
            pokemon.effects.push(EFFECTS.HONE_CLAWS);
          }
          break;

        case EFFECTS.ASSURANCE:
          if (types.includes(TYPE.DARK) && pokemon.items.length != 0) {
            pokemon.atk += 7 * pokemon.items.length;
            pokemon.shield += 30 * pokemon.items.length;
            pokemon.effects.push(EFFECTS.ASSURANCE);
          }
          break;

        case EFFECTS.BEAT_UP:
          if (types.includes(TYPE.DARK) && pokemon.items.length != 0) {
            pokemon.atk += 10 * pokemon.items.length;
            pokemon.shield += 50 * pokemon.items.length;
            pokemon.effects.push(EFFECTS.BEAT_UP);
          }
          break;

        case EFFECTS.ANCIENT_POWER:
          if (types.includes(TYPE.FOSSIL)) {
            pokemon.addCritChance(40);
            pokemon.critDamage += 0.8;
            pokemon.effects.push(EFFECTS.ANCIENT_POWER);
          }
          break;

        case EFFECTS.ELDER_POWER:
          if (types.includes(TYPE.FOSSIL)) {
            pokemon.addCritChance(70);
            pokemon.critDamage += 1.4;
            pokemon.effects.push(EFFECTS.ELDER_POWER);
          }
          break;

        case EFFECTS.UNOWN_GATHERINGS:
          if (types.includes(TYPE.FOSSIL)) {
            pokemon.addCritChance(100);
            pokemon.critDamage += 2.5;
            pokemon.effects.push(EFFECTS.UNOWN_GATHERINGS);
          }
          break;

        case EFFECTS.BLAZE:
          if (types.includes(TYPE.FIRE)) {
            pokemon.effects.push(EFFECTS.BLAZE);
          }
          break;

        case EFFECTS.DROUGHT:
          if (types.includes(TYPE.FIRE)) {
            pokemon.effects.push(EFFECTS.DROUGHT);
          }
          break;

        case EFFECTS.DESOLATE_LAND:
          if (types.includes(TYPE.FIRE)) {
            pokemon.effects.push(EFFECTS.DESOLATE_LAND);
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

        case EFFECTS.SPORE:
          if (types.includes(TYPE.GRASS)) {
            pokemon.effects.push(EFFECTS.SPORE);
          }
          break;

        case EFFECTS.DRIZZLE:
          if (types.includes(TYPE.WATER)) {
            pokemon.effects.push(EFFECTS.DRIZZLE);
            pokemon.atk += Math.ceil(pokemon.baseAtk * 0.33);
          }
          break;

        case EFFECTS.RAIN_DANCE:
          if (types.includes(TYPE.WATER)) {
            pokemon.effects.push(EFFECTS.RAIN_DANCE);
            pokemon.atk += Math.ceil(pokemon.baseAtk * 0.66);
          }
          break;

        case EFFECTS.PRIMORDIAL_SEA:
          if (types.includes(TYPE.WATER)) {
            pokemon.effects.push(EFFECTS.PRIMORDIAL_SEA);
            pokemon.atk += Math.ceil(pokemon.baseAtk * 0.66);
          }
          break;

        case EFFECTS.STAMINA:
          if (types.includes(TYPE.NORMAL)) {
            pokemon.effects.push(EFFECTS.STAMINA);
          }
          break;

        case EFFECTS.STRENGTH:
          if (types.includes(TYPE.NORMAL)) {
            pokemon.effects.push(EFFECTS.STRENGTH);
          }
          break;

        case EFFECTS.PURE_POWER:
          if (types.includes(TYPE.NORMAL)) {
            pokemon.effects.push(EFFECTS.PURE_POWER);
          }
          break;

        case EFFECTS.AGILITY:
          if (types.includes(TYPE.ELECTRIC)) {
            const pokemonNames = [];

            allyTeam.forEach((pkm, key) => {
              if (pkm.types.includes(TYPE.ELECTRIC) && pkm.positionY != 0) {
                const family = PokemonFactory.getPokemonFamily(pkm.name);
                if (!pokemonNames.includes(family)) {
                  pokemonNames.push(family);
                }
              }
            });

            const speedFactor = 14 * pokemonNames.length;
            pokemon.handleAttackSpeed(speedFactor);
            pokemon.effects.push(EFFECTS.AGILITY);
          }
          break;

        case EFFECTS.REVENGE:
          pokemon.effects.push(EFFECTS.REVENGE);
          break;

        case EFFECTS.PUNISHMENT:
          pokemon.effects.push(EFFECTS.PUNISHMENT);
          break;

        case EFFECTS.IRON_DEFENSE:
          if (types.includes(TYPE.METAL)) {
            pokemon.effects.push(EFFECTS.IRON_DEFENSE);
          }
          break;

        case EFFECTS.AUTOTOMIZE:
          if (types.includes(TYPE.METAL)) {
            pokemon.effects.push(EFFECTS.AUTOTOMIZE);
          }
          break;

        case EFFECTS.WORK_UP:
          if (types.includes(TYPE.FIELD)) {
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

        case EFFECTS.AMNESIA:
          pokemon.effects.push(EFFECTS.AMNESIA);
          pokemon.speDef += 5;
          break;

        case EFFECTS.LIGHT_SCREEN:
          pokemon.effects.push(EFFECTS.LIGHT_SCREEN);
          pokemon.speDef += 15;
          break;

        case EFFECTS.EERIE_SPELL:
          pokemon.effects.push(EFFECTS.EERIE_SPELL);
          pokemon.speDef += 35;
          break;

        case EFFECTS.MEDITATE:
          pokemon.atk += Math.ceil(pokemon.baseAtk * 0.15);
          pokemon.shield += Math.ceil(pokemon.hp * 0.15);
          pokemon.effects.push(EFFECTS.MEDITATE);
          break;

        case EFFECTS.FOCUS_ENERGY:
          pokemon.atk += Math.ceil(pokemon.baseAtk * 0.35);
          pokemon.shield += Math.ceil(pokemon.hp * 0.35);
          pokemon.effects.push(EFFECTS.FOCUS_ENERGY);
          break;

        case EFFECTS.CALM_MIND:
          pokemon.atk += Math.ceil(pokemon.baseAtk * 0.65);
          pokemon.shield += Math.ceil(pokemon.hp * 0.65);
          pokemon.effects.push(EFFECTS.CALM_MIND);
          break;

        case EFFECTS.TAILWIND:
          if (types.includes(TYPE.FLYING)) {
            pokemon.flyingProtection = true;
            pokemon.effects.push(EFFECTS.TAILWIND);
          }
          break;

        case EFFECTS.FEATHER_DANCE:
          if (types.includes(TYPE.FLYING)) {
            pokemon.flyingProtection = true;
            pokemon.effects.push(EFFECTS.FEATHER_DANCE);
          }
          break;

        case EFFECTS.MAX_AIRSTREAM:
          if (types.includes(TYPE.FLYING)) {
            pokemon.flyingProtection = true;
            pokemon.effects.push(EFFECTS.MAX_AIRSTREAM);
          }
          break;

        case EFFECTS.MAX_GUARD:
          if (types.includes(TYPE.FLYING)) {
            pokemon.flyingProtection = true;
            pokemon.effects.push(EFFECTS.MAX_GUARD);
          }
          break;

        case EFFECTS.SWIFT_SWIM:
          if (types.includes(TYPE.AQUATIC)) {
            pokemon.effects.push(EFFECTS.SWIFT_SWIM);
          }
          break;

        case EFFECTS.HYDRO_CANNON:
          if (types.includes(TYPE.AQUATIC)) {
            pokemon.effects.push(EFFECTS.HYDRO_CANNON);
          }
          break;

        case EFFECTS.ODD_FLOWER:
          if (types.includes(TYPE.FLORA)) {
            pokemon.effects.push(EFFECTS.ODD_FLOWER);
          }
          break;

        case EFFECTS.GLOOM_FLOWER:
          if (types.includes(TYPE.FLORA)) {
            pokemon.effects.push(EFFECTS.GLOOM_FLOWER);
          }
          break;

        case EFFECTS.VILE_FLOWER:
          if (types.includes(TYPE.FLORA)) {
            pokemon.effects.push(EFFECTS.VILE_FLOWER);
          }
          break;

        case EFFECTS.SUN_FLOWER:
          if (types.includes(TYPE.FLORA)) {
            pokemon.effects.push(EFFECTS.SUN_FLOWER);
          }
          break;

        case EFFECTS.BATTLE_ARMOR:
          if (types.includes(TYPE.MINERAL)) {
            pokemon.shield += 75;
            pokemon.effects.push(EFFECTS.BATTLE_ARMOR);
          }
          break;

        case EFFECTS.MOUTAIN_RESISTANCE:
          if (types.includes(TYPE.MINERAL)) {
            pokemon.shield += 150;
            pokemon.effects.push(EFFECTS.MOUTAIN_RESISTANCE);
          }
          break;

        case EFFECTS.DIAMOND_STORM:
          if (types.includes(TYPE.MINERAL)) {
            pokemon.shield += 300;
            pokemon.effects.push(EFFECTS.DIAMOND_STORM);
          }
          break;

        case EFFECTS.PHANTOM_FORCE:
          if (types.includes(TYPE.AMORPH)) {
            pokemon.handleAttackSpeed(15);
            pokemon.effects.push(EFFECTS.PHANTOM_FORCE);
          }
          break;

        case EFFECTS.CURSE:
          if (types.includes(TYPE.AMORPH)) {
            pokemon.effects.push(EFFECTS.CURSE);
          }

        case EFFECTS.AROMATIC_MIST:
          if (types.includes(TYPE.FAIRY)) {
            pokemon.effects.push(EFFECTS.AROMATIC_MIST);
          }
          break;

        case EFFECTS.FAIRY_WIND:
          if (types.includes(TYPE.FAIRY)) {
            pokemon.effects.push(EFFECTS.FAIRY_WIND);
          }
          break;

        case EFFECTS.STRANGE_STEAM:
          if (types.includes(TYPE.FAIRY)) {
            pokemon.effects.push(EFFECTS.STRANGE_STEAM);
          }
          break;

        case EFFECTS.DRAGON_ENERGY:
          if (types.includes(TYPE.DRAGON)) {
            pokemon.effects.push(EFFECTS.DRAGON_ENERGY);
          }
          break;

        case EFFECTS.DRAGON_DANCE:
          if (types.includes(TYPE.DRAGON)) {
            pokemon.effects.push(EFFECTS.DRAGON_DANCE);
          }
          break;

        case EFFECTS.SNOW:
          pokemon.effects.push(EFFECTS.SNOW);
          break;

        case EFFECTS.SHEER_COLD:
          pokemon.effects.push(EFFECTS.SHEER_COLD);
          break;

        case EFFECTS.POISON_GAS:
          if (types.includes(TYPE.POISON)) {
            pokemon.effects.push(EFFECTS.POISON_GAS);
          }
          break;

        case EFFECTS.TOXIC:
          if (types.includes(TYPE.POISON)) {
            pokemon.effects.push(EFFECTS.TOXIC);
          }
          break;

        case EFFECTS.LARGO:
          if (types.includes(TYPE.SOUND)) {
            pokemon.effects.push(EFFECTS.LARGO);
          }
          break;

        case EFFECTS.ALLEGRO:
          if (types.includes(TYPE.SOUND)) {
            pokemon.effects.push(EFFECTS.ALLEGRO);
          }
          break;

        case EFFECTS.PRESTO:
          if (types.includes(TYPE.SOUND)) {
            pokemon.effects.push(EFFECTS.PRESTO);
          }
          break;

        case EFFECTS.SWARM:
          if (types.includes(TYPE.BUG)) {
            pokemon.effects.push(EFFECTS.SWARM);
          }
          break;

        case EFFECTS.STICKY_WEB:
          if (types.includes(TYPE.BUG)) {
            pokemon.effects.push(EFFECTS.STICKY_WEB);
          }
          break;

        default:
          break;
      }
    });

    ennemyEffects.forEach((effect) => {
      switch (effect) {
        case EFFECTS.SPIKES:
          pokemon.handleDamage(Math.ceil(pokemon.hp * 0.1), this.board, ATTACK_TYPE.TRUE);
          pokemon.effects.push(EFFECTS.SPIKES);
          break;

        case EFFECTS.STEALTH_ROCK:
          pokemon.handleDamage(Math.ceil(pokemon.hp * 0.1), this.board, ATTACK_TYPE.TRUE);
          pokemon.effects.push(EFFECTS.STEALTH_ROCK);
          break;

        case EFFECTS.SANDSTORM:
          pokemon.effects.push(EFFECTS.SANDSTORM);
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
    if (this.blueEffects.includes(EFFECTS.SHEER_COLD) || this.redEffects.includes(EFFECTS.SHEER_COLD)) {
      climate = CLIMATE.SNOW;
    }
    if (this.blueEffects.includes(EFFECTS.RAIN_DANCE) || this.redEffects.includes(EFFECTS.RAIN_DANCE)) {
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
      if (!pkm.life) {
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
      if (!pkm.life) {
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
