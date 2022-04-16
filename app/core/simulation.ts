import Board from './board';
import {Schema, MapSchema, type} from '@colyseus/schema';
import PokemonEntity from './pokemon-entity';
import PokemonFactory from '../models/pokemon-factory';
import {CLIMATE, EFFECTS, TYPE, ATTACK_TYPE, ITEM} from '../models/enum';
import Dps from'./dps';
import DpsHeal from './dps-heal';
import ItemFactory from '../models/item-factory';
import { ISimulation, IPokemonEntity, IPokemon } from '../types';

export default class Simulation extends Schema implements ISimulation{
  @type('string') climate: string;
  @type(['string']) blueEffects: string[];
  @type(['string']) redEffects: string[];
  @type({map: PokemonEntity}) blueTeam = new MapSchema<IPokemonEntity>();
  @type({map: PokemonEntity}) redTeam = new MapSchema<IPokemonEntity>();
  @type({map: Dps}) blueDpsMeter = new MapSchema<Dps>();
  @type({map: Dps}) redDpsMeter = new MapSchema<Dps>();
  @type({map: DpsHeal}) blueHealDpsMeter = new MapSchema<DpsHeal>();
  @type({map: DpsHeal}) redHealDpsMeter = new MapSchema<DpsHeal>();
  board: Board = new Board(8,6);
  finished: boolean;
  flowerSpawn: boolean[];

  initialize(blueTeam: MapSchema<IPokemon>, redTeam: MapSchema<IPokemon>, blueEffects: string[], redEffects: string[]) {
    this.blueDpsMeter.forEach((dps, key) => {
      this.blueDpsMeter.delete(key);
    });

    this.redDpsMeter.forEach((dps, key) => {
      this.redDpsMeter.delete(key);
    });

    this.blueHealDpsMeter.forEach((dps, key) => {
      this.blueHealDpsMeter.delete(key);
    });

    this.redHealDpsMeter.forEach((dps, key) => {
      this.redHealDpsMeter.delete(key);
    });

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
    this.finished = false;
    this.flowerSpawn = [false, false];

    if (blueTeam) {
      blueTeam.forEach((pokemon) => {
        if (pokemon.positionY != 0) {
          this.addPokemon(pokemon, pokemon.positionX, pokemon.positionY - 1, 0);
        }
      });
    }

    if (redTeam) {
      redTeam.forEach((pokemon) => {
        if (pokemon.positionY != 0) {
          this.addPokemon(pokemon, pokemon.positionX, 5 - (pokemon.positionY - 1), 1);
        }
      });
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

  addPokemon(pokemon: IPokemon, x: number, y: number, team: number) {
    const pokemonEntity = new PokemonEntity(pokemon, x, y, team, this);
    // pokemonEntity.triggerSleep(5000);
    this.applyItemsEffects(pokemonEntity);
    this.board.setValue(pokemonEntity.positionX, pokemonEntity.positionY, pokemonEntity);

    if (team == 0) {
      this.applyEffects(pokemonEntity, pokemon.types, this.blueEffects);
      const dps = new Dps(pokemonEntity.id, this.getPath(pokemonEntity));
      const dpsHeal = new DpsHeal(pokemonEntity.id, this.getPath(pokemonEntity));
      this.blueTeam.set(pokemonEntity.id, pokemonEntity);
      this.blueDpsMeter.set(pokemonEntity.id, dps);
      this.blueHealDpsMeter.set(pokemonEntity.id, dpsHeal);
    }
    if (team == 1) {
      this.applyEffects(pokemonEntity, pokemon.types, this.redEffects);
      const dps = new Dps(pokemonEntity.id, this.getPath(pokemonEntity));
      const dpsHeal = new DpsHeal(pokemonEntity.id, this.getPath(pokemonEntity));
      this.redTeam.set(pokemonEntity.id, pokemonEntity);
      this.redDpsMeter.set(pokemonEntity.id, dps);
      this.redHealDpsMeter.set(pokemonEntity.id, dpsHeal);
    }
    return pokemonEntity;
  }

  getPath(pokemon: IPokemonEntity) {
    let pokemonPath = '';
    const index = pokemon.index;
    pokemonPath += index + '/';

    if(pokemon.shiny){
        pokemonPath += '0000/0001/';
    }
    pokemonPath += pokemon.emotion;
    return pokemonPath;
}


  addPokemonEntity(p: PokemonEntity, x: number, y:number, team: number) {
    const pokemon = PokemonFactory.createPokemonFromName(p.name);
    p.items.forEach(i=>{
      pokemon.items.add(i);
    });
    return this.addPokemon(pokemon, x, y, team);
  }

  getFirstAvailablePlaceOnBoard(ascending: boolean) {
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

  applyItemsEffects(pokemon: PokemonEntity) {
    if (pokemon.items.has(ITEM.TWISTED_SPOON)) {
      pokemon.addSpellDamage(10);
    }
    if (pokemon.items.has(ITEM.MYSTIC_WATER)) {
      pokemon.mana += 15;
    }
    if (pokemon.items.has(ITEM.MAGNET)) {
      pokemon.handleAttackSpeed(15);
    }
    if (pokemon.items.has(ITEM.BLACK_GLASSES)) {
      pokemon.addCritChance(5);
    }
    if (pokemon.items.has(ITEM.MIRACLE_SEED)) {
      pokemon.handleShield(15, pokemon);
    }
    if (pokemon.items.has(ITEM.NEVER_MELT_ICE)) {
      pokemon.speDef += 2;
    }
    if (pokemon.items.has(ITEM.CHARCOAL)) {
      pokemon.atk += 1;
    }
    if (pokemon.items.has(ITEM.HEART_SCALE)) {
      pokemon.def += 1;
    }
    if (pokemon.items.has(ITEM.CHOICE_SPECS)) {
      pokemon.addSpellDamage(75);
    }
    if (pokemon.items.has(ITEM.SOUL_DEW)) {
      pokemon.status.triggerSoulDew(5000);
    }
    if (pokemon.items.has(ITEM.WONDER_BOX)) {
      pokemon.items.delete(ITEM.WONDER_BOX);
      for (let i = 0; i <2; i++) {
        if (pokemon.items.size < 3) {
          pokemon.items.add(ItemFactory.createRandomItem());
        }
      }
    }
    if (pokemon.items.has(ITEM.AQUA_EGG)) {
      pokemon.setMana(pokemon.mana + 50);
    }
    if (pokemon.items.has(ITEM.BLUE_ORB)) {
      pokemon.handleAttackSpeed(10);
    }
    if (pokemon.items.has(ITEM.ZOOM_LENS)) {
      pokemon.atk += 4;
      pokemon.addSpellDamage(40);
    }
    if (pokemon.items.has(ITEM.BRIGHT_POWDER)) {
      pokemon.status.triggerBrightPowder(5000);
    }
    if (pokemon.items.has(ITEM.XRAY_VISION)) {
      pokemon.range += 1;
      pokemon.handleAttackSpeed(55);
    }
    if (pokemon.items.has(ITEM.WIDE_LENS)) {
      pokemon.handleAttackSpeed(20);
    }
    if (pokemon.items.has(ITEM.RAZOR_CLAW)) {
      pokemon.critDamage += 0.1;
      pokemon.addCritChance(75);
    }
    if (pokemon.items.has(ITEM.ORAN_BERRY)) {
      pokemon.handleShield(100, pokemon);
    }
    if (pokemon.items.has(ITEM.FLAME_ORB)) {
      pokemon.status.triggerFlameOrb(2000);
    }
    if (pokemon.items.has(ITEM.ASSAULT_VEST)) {
      pokemon.speDef += 30;
    }
    if (pokemon.items.has(ITEM.POKE_DOLL)) {
      pokemon.def += 5;
      pokemon.speDef += 5;
    }
    if (pokemon.items.has(ITEM.RED_ORB)) {
      pokemon.atk += 8;
    }
    if (pokemon.items.has(ITEM.ROCKY_HELMET)) {
      pokemon.def += 10;
    }
  }

  applyPostEffects() {
    let blueImperialCount = 1;
    let blueVoidCount = 1;
    this.blueTeam.forEach((pokemon) =>{
      if (pokemon.effects.includes(EFFECTS.IRON_DEFENSE)) {
        if (blueImperialCount > 0) {
          pokemon.atk = pokemon.atk * 2;
          blueImperialCount --;
        } else {
          pokemon.effects.splice(pokemon.effects.findIndex((e) => e === EFFECTS.IRON_DEFENSE), 1);
        }
      }
      if (pokemon.effects.includes(EFFECTS.PHANTOM_FORCE)) {
        if (blueVoidCount > 0) {
          pokemon.attackType = ATTACK_TYPE.TRUE;
          blueVoidCount --;
        } else {
          pokemon.effects.splice(pokemon.effects.findIndex((e) => e === EFFECTS.PHANTOM_FORCE), 1);
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
        shieldBonus += 40;
      }
      if (pokemon.effects.includes(EFFECTS.PURE_POWER)) {
        shieldBonus += 80;
      }
      if (shieldBonus >= 0) {
        pokemon.handleShield(shieldBonus, pokemon);
        const cells = this.board.getAdjacentCells(pokemon.positionX, pokemon.positionY);

        cells.forEach((cell) => {
          if (cell.value && pokemon.team == cell.value.team) {
            cell.value.handleShield(shieldBonus, pokemon);
          }
        });
      }
      if (pokemon.items.has(ITEM.LUCKY_EGG)) {
        [-2, -1, 0, 1, 2].forEach( (offset)=>{
          const value = this.board.getValue(pokemon.positionX + offset, pokemon.positionY);
          if (value) {
            value.handleShield(30, pokemon);
          }
        });
      }
      if (pokemon.items.has(ITEM.DELTA_ORB)) {
        [-1, 0, 1].forEach( (offset)=>{
          const value = this.board.getValue(pokemon.positionX + offset, pokemon.positionY);
          if (value) {
            value.addSpellDamage(30);
          }
        });
      }
      if (pokemon.items.has(ITEM.RUNE_PROTECT)) {
        const cells = this.board.getAdjacentCells(pokemon.positionX, pokemon.positionY);
        pokemon.status.triggerRuneProtect();
        cells.forEach((cell) => {
          if (cell.value && pokemon.team == cell.value.team) {
            cell.value.status.triggerRuneProtect();
          }
        });
      }
      if (pokemon.items.has(ITEM.FLUFFY_TAIL)) {
        this.board.forEach((x: number, y: number, value: PokemonEntity) => {
          if (value && pokemon.team != value.team && value.positionX == pokemon.positionX) {
            value.maxMana = Math.ceil(value.maxMana * 1.3);
          }
        });
      }
      if (pokemon.items.has(ITEM.SHINY_CHARM)) {
        this.board.forEach((x: number, y: number, value: PokemonEntity) => {
          if (value && pokemon.team != value.team && value.positionX == pokemon.positionX) {
            value.status.triggerSleep(3000);
          }
        });
      }
      if (pokemon.items.has(ITEM.FOCUS_BAND)) {
        [-1, 0, 1].forEach( (offset)=>{
          const value = this.board.getValue(pokemon.positionX + offset, pokemon.positionY);
          if (value) {
            value.handleAttackSpeed(30);
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
        pokemon.handleShield(shieldBonus, pokemon);
        const cells = this.board.getAdjacentCells(pokemon.positionX, pokemon.positionY);

        cells.forEach((cell) => {
          if (cell.value && pokemon.team == cell.value.team) {
            cell.value.handleShield(shieldBonus, pokemon);
          }
        });
      }
      if (pokemon.items.has(ITEM.LUCKY_EGG)) {
        [-2, -1, 0, 1, 2].forEach( (offset)=>{
          const value = this.board.getValue(pokemon.positionX + offset, pokemon.positionY);
          if (value) {
            value.handleShield(30, pokemon);
          }
        });
      }
      if (pokemon.items.has(ITEM.DELTA_ORB)) {
        [-2, -1, 0, 1, 2].forEach( (offset)=>{
          const value = this.board.getValue(pokemon.positionX + offset, pokemon.positionY);
          if (value) {
            value.addSpellDamage(30);
          }
        });
      }
      if (pokemon.items.has(ITEM.RUNE_PROTECT)) {
        const cells = this.board.getAdjacentCells(pokemon.positionX, pokemon.positionY);
        pokemon.status.triggerRuneProtect();
        cells.forEach((cell) => {
          if (cell.value && pokemon.team == cell.value.team) {
            cell.value.status.triggerRuneProtect();
          }
        });
      }
      if (pokemon.items.has(ITEM.FLUFFY_TAIL)) {
        this.board.forEach((x: number, y: number, value: PokemonEntity) => {
          if (value && pokemon.team != value.team && value.positionX == pokemon.positionX) {
            value.maxMana = Math.ceil(value.maxMana * 1.3);
          }
        });
      }
      if (pokemon.items.has(ITEM.SHINY_CHARM)) {
        this.board.forEach((x: number, y: number, value: PokemonEntity) => {
          if (value && pokemon.team != value.team && value.positionX == pokemon.positionX) {
            value.status.triggerSleep(3000);
          }
        });
      }
      if (pokemon.items.has(ITEM.FOCUS_BAND)) {
        [-1, 0, 1].forEach( (offset)=>{
          const value = this.board.getValue(pokemon.positionX + offset, pokemon.positionY);
          if (value) {
            value.handleAttackSpeed(30);
          }
        });
      }
    });
  }

  applyEffects(pokemon: PokemonEntity, types: string[], allyEffects: string[]) {
    allyEffects.forEach((effect) => {
      switch (effect) {
        case EFFECTS.HONE_CLAWS:
          if (types.includes(TYPE.DARK) && pokemon.items.size != 0) {
            pokemon.atk += 4 * pokemon.items.size;
            pokemon.handleShield(20 * pokemon.items.size, pokemon);
            pokemon.effects.push(EFFECTS.HONE_CLAWS);
          }
          break;

        case EFFECTS.ASSURANCE:
          if (types.includes(TYPE.DARK) && pokemon.items.size != 0) {
            pokemon.atk += 7 * pokemon.items.size;
            pokemon.handleShield(30 * pokemon.items.size, pokemon);
            pokemon.effects.push(EFFECTS.ASSURANCE);
          }
          break;

        case EFFECTS.BEAT_UP:
          if (types.includes(TYPE.DARK) && pokemon.items.size != 0) {
            pokemon.atk += 10 * pokemon.items.size;
            pokemon.handleShield(50 * pokemon.items.size, pokemon);
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
            pokemon.addDodgeChance(0.25);
            pokemon.effects.push(EFFECTS.DRIZZLE);
          }
          break;

        case EFFECTS.RAIN_DANCE:
          if (types.includes(TYPE.WATER)) {
            pokemon.addDodgeChance(0.5);
            pokemon.effects.push(EFFECTS.RAIN_DANCE);
          }
          break;

        case EFFECTS.PRIMORDIAL_SEA:
          if (types.includes(TYPE.WATER)) {
            pokemon.addDodgeChance(0.75);
            pokemon.effects.push(EFFECTS.PRIMORDIAL_SEA);
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

        case EFFECTS.EERIE_IMPULSE:
          if (types.includes(TYPE.ELECTRIC)) {
            pokemon.effects.push(EFFECTS.EERIE_IMPULSE);
          }
          break;

        case EFFECTS.RISING_VOLTAGE:
          if (types.includes(TYPE.ELECTRIC)) {
            pokemon.effects.push(EFFECTS.RISING_VOLTAGE);
          }
          break;

        case EFFECTS.OVERDRIVE:
          if (types.includes(TYPE.ELECTRIC)) {
            pokemon.effects.push(EFFECTS.OVERDRIVE);
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

        case EFFECTS.BULK_UP:
          if (types.includes(TYPE.FIELD)) {
            pokemon.effects.push(EFFECTS.BULK_UP);
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
          pokemon.effects.push(EFFECTS.MEDITATE);
          break;

        case EFFECTS.FOCUS_ENERGY:
          pokemon.effects.push(EFFECTS.FOCUS_ENERGY);
          break;

        case EFFECTS.CALM_MIND:
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
            pokemon.handleShield(70, pokemon);
            pokemon.effects.push(EFFECTS.BATTLE_ARMOR);
          }
          break;

        case EFFECTS.MOUTAIN_RESISTANCE:
          if (types.includes(TYPE.MINERAL)) {
            pokemon.handleShield(140, pokemon);
            pokemon.effects.push(EFFECTS.MOUTAIN_RESISTANCE);
          }
          break;

        case EFFECTS.DIAMOND_STORM:
          if (types.includes(TYPE.MINERAL)) {
            pokemon.handleShield(280, pokemon);
            pokemon.effects.push(EFFECTS.DIAMOND_STORM);
          }
          break;

        case EFFECTS.PHANTOM_FORCE:
          if (types.includes(TYPE.GHOST)) {
            pokemon.effects.push(EFFECTS.PHANTOM_FORCE);
          }
          break;

        case EFFECTS.CURSE:
          if (types.includes(TYPE.GHOST)) {
            pokemon.attackType = ATTACK_TYPE.TRUE;
            pokemon.effects.push(EFFECTS.CURSE);
          }
          break;

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

        case EFFECTS.SHORE_UP:
          if (types.includes(TYPE.GROUND)) {
            pokemon.effects.push(EFFECTS.SHORE_UP);
          }
          break;

        case EFFECTS.ROTOTILLER:
          if (types.includes(TYPE.GROUND)) {
            pokemon.effects.push(EFFECTS.ROTOTILLER);
          }
          break;

        case EFFECTS.SANDSTORM:
          if (types.includes(TYPE.GROUND)) {
            pokemon.effects.push(EFFECTS.SANDSTORM);
          }
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

  update(dt: number) {
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
        this.blueDpsMeter.get(key).changeDamage(pkm.physicalDamage, pkm.specialDamage, pkm.trueDamage);
        this.blueHealDpsMeter.get(key).changeHeal(pkm.healDone, pkm.shieldDone);
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
        this.redDpsMeter.get(key).changeDamage(pkm.physicalDamage, pkm.specialDamage, pkm.trueDamage);
        this.redHealDpsMeter.get(key).changeHeal(pkm.healDone, pkm.shieldDone);
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

    this.climate = CLIMATE.NEUTRAL;
  }
}