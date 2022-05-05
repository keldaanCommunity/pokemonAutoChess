import Board from './board';
import {Schema, MapSchema, type} from '@colyseus/schema';
import PokemonEntity from './pokemon-entity';
import PokemonFactory from '../models/pokemon-factory';
import { Item } from '../types/enum/Item';
import { Effect } from '../types/enum/Effect';
import { AttackType, Climate, PokemonActionState } from '../types/enum/Game';
import Dps from'./dps';
import DpsHeal from './dps-heal';
import ItemFactory from '../models/item-factory';
import { ISimulation, IPokemonEntity, IPokemon } from '../types';
import { Synergy } from '../types/enum/Synergy';

export default class Simulation extends Schema implements ISimulation{
  @type('string') climate: string;
  @type(['uint8']) blueEffects: Effect[];
  @type(['uint8']) redEffects: Effect[];
  @type({map: PokemonEntity}) blueTeam = new MapSchema<IPokemonEntity>();
  @type({map: PokemonEntity}) redTeam = new MapSchema<IPokemonEntity>();
  @type({map: Dps}) blueDpsMeter = new MapSchema<Dps>();
  @type({map: Dps}) redDpsMeter = new MapSchema<Dps>();
  @type({map: DpsHeal}) blueHealDpsMeter = new MapSchema<DpsHeal>();
  @type({map: DpsHeal}) redHealDpsMeter = new MapSchema<DpsHeal>();
  board: Board = new Board(8,6);
  finished: boolean;
  flowerSpawn: boolean[];

  initialize(blueTeam: MapSchema<IPokemon>, redTeam: MapSchema<IPokemon>, blueEffects: number[], redEffects: number[]) {
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

    if (blueEffects && blueEffects.includes(Effect.SWARM)) {
      const bugTeam = [];
      blueTeam.forEach((pkm)=>{
        if (pkm.types.includes(Synergy.BUG) && pkm.positionY != 0) {
          bugTeam.push(pkm.name);
        }
      });
      const randomBug = bugTeam[Math.floor(Math.random() * bugTeam.length)];
      const bug = PokemonFactory.createPokemonFromName(randomBug);
      const coord = this.getFirstAvailablePlaceOnBoard(true);
      this.addPokemon(bug, coord.x, coord.y, 0);
    }

    if (blueEffects && blueEffects.includes(Effect.STICKY_WEB)) {
      const bugTeam = [];
      blueTeam.forEach((pkm)=>{
        if (pkm.types.includes(Synergy.BUG) && pkm.positionY != 0) {
          bugTeam.push(pkm.name);
        }
      });
      bugTeam.forEach((b)=>{
        const bug = PokemonFactory.createPokemonFromName(b);
        const coord = this.getFirstAvailablePlaceOnBoard(true);
        this.addPokemon(bug, coord.x, coord.y, 0);
      });
    }

    if (redEffects && redEffects.includes(Effect.SWARM)) {
      const bugTeam = [];
      redTeam.forEach((pkm)=>{
        if (pkm.types.includes(Synergy.BUG) && pkm.positionY != 0) {
          bugTeam.push(pkm.name);
        }
      });
      const randomBug = bugTeam[Math.floor(Math.random() * bugTeam.length)];
      const bug = PokemonFactory.createPokemonFromName(randomBug);
      const coord = this.getFirstAvailablePlaceOnBoard(false);
      this.addPokemon(bug, coord.x, coord.y, 1);
    }

    if (redEffects && redEffects.includes(Effect.STICKY_WEB)) {
      const bugTeam = [];
      redTeam.forEach((pkm)=>{
        if (pkm.types.includes(Synergy.BUG) && pkm.positionY != 0) {
          bugTeam.push(pkm.name);
        }
      });
      bugTeam.forEach((b)=>{
        const bug = PokemonFactory.createPokemonFromName(b);
        const coord = this.getFirstAvailablePlaceOnBoard(false);
        this.addPokemon(bug, coord.x, coord.y, 1);
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
    return {x: row, y: column};
  }

  applyItemsEffects(pokemon: PokemonEntity) {
    if (pokemon.items.has(Item.TWISTED_SPOON)) {
      pokemon.addSpellDamage(10);
    }
    if (pokemon.items.has(Item.MYSTIC_WATER)) {
      pokemon.mana += 15;
    }
    if (pokemon.items.has(Item.MAGNET)) {
      pokemon.handleAttackSpeed(15);
    }
    if (pokemon.items.has(Item.BLACK_GLASSES)) {
      pokemon.addCritChance(5);
    }
    if (pokemon.items.has(Item.MIRACLE_SEED)) {
      pokemon.handleShield(15, pokemon);
    }
    if (pokemon.items.has(Item.NEVER_MELT_ICE)) {
      pokemon.speDef += 2;
    }
    if (pokemon.items.has(Item.CHARCOAL)) {
      pokemon.atk += 1;
    }
    if (pokemon.items.has(Item.HEART_SCALE)) {
      pokemon.def += 1;
    }
    if (pokemon.items.has(Item.CHOICE_SPECS)) {
      pokemon.addSpellDamage(75);
    }
    if (pokemon.items.has(Item.SOUL_DEW)) {
      pokemon.status.triggerSoulDew(5000);
    }
    if (pokemon.items.has(Item.WONDER_BOX)) {
      pokemon.items.delete(Item.WONDER_BOX);
      for (let i = 0; i <2; i++) {
        if (pokemon.items.size < 3) {
          pokemon.items.add(ItemFactory.createRandomItem());
        }
      }
    }
    if (pokemon.items.has(Item.AQUA_EGG)) {
      pokemon.setMana(pokemon.mana + 50);
    }
    if (pokemon.items.has(Item.BLUE_ORB)) {
      pokemon.handleAttackSpeed(10);
    }
    if (pokemon.items.has(Item.ZOOM_LENS)) {
      pokemon.atk += 4;
      pokemon.addSpellDamage(40);
    }
    if (pokemon.items.has(Item.BRIGHT_POWDER)) {
      pokemon.status.triggerBrightPowder(5000);
    }
    if (pokemon.items.has(Item.XRAY_VISION)) {
      pokemon.range += 1;
      pokemon.handleAttackSpeed(55);
    }
    if (pokemon.items.has(Item.WIDE_LENS)) {
      pokemon.handleAttackSpeed(20);
    }
    if (pokemon.items.has(Item.RAZOR_CLAW)) {
      pokemon.critDamage += 0.1;
      pokemon.addCritChance(75);
    }
    if (pokemon.items.has(Item.ORAN_BERRY)) {
      pokemon.handleShield(100, pokemon);
    }
    if (pokemon.items.has(Item.FLAME_ORB)) {
      pokemon.status.triggerFlameOrb(2000);
    }
    if (pokemon.items.has(Item.ASSAULT_VEST)) {
      pokemon.speDef += 30;
    }
    if (pokemon.items.has(Item.POKE_DOLL)) {
      pokemon.def += 5;
      pokemon.speDef += 5;
    }
    if (pokemon.items.has(Item.RED_ORB)) {
      pokemon.atk += 8;
    }
    if (pokemon.items.has(Item.ROCKY_HELMET)) {
      pokemon.def += 10;
    }
  }

  applyPostEffects() {
    let blueImperialCount = 1;
    let blueVoidCount = 1;
    this.blueTeam.forEach((pokemon) =>{
      if (pokemon.effects.includes(Effect.IRON_DEFENSE)) {
        if (blueImperialCount > 0) {
          pokemon.atk = pokemon.atk * 2;
          blueImperialCount --;
        } else {
          pokemon.effects.splice(pokemon.effects.findIndex((e) => e === Effect.IRON_DEFENSE), 1);
        }
      }
      if (pokemon.effects.includes(Effect.PHANTOM_FORCE)) {
        if (blueVoidCount > 0) {
          pokemon.attackType = AttackType.TRUE;
          blueVoidCount --;
        } else {
          pokemon.effects.splice(pokemon.effects.findIndex((e) => e === Effect.PHANTOM_FORCE), 1);
        }
      }
      if (pokemon.effects.includes(Effect.AUTOTOMIZE)) {
        pokemon.atk = pokemon.atk * 2;
      }
      let shieldBonus = 0;
      if (pokemon.effects.includes(Effect.STAMINA)) {
        shieldBonus = 20;
      }
      if (pokemon.effects.includes(Effect.STRENGTH)) {
        shieldBonus += 40;
      }
      if (pokemon.effects.includes(Effect.PURE_POWER)) {
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
      if (pokemon.items.has(Item.LUCKY_EGG)) {
        [-2, -1, 0, 1, 2].forEach( (offset)=>{
          const value = this.board.getValue(pokemon.positionX + offset, pokemon.positionY);
          if (value) {
            value.handleShield(30, pokemon);
          }
        });
      }
      if (pokemon.items.has(Item.DELTA_ORB)) {
        [-1, 0, 1].forEach( (offset)=>{
          const value = this.board.getValue(pokemon.positionX + offset, pokemon.positionY);
          if (value) {
            value.addSpellDamage(30);
          }
        });
      }
      if (pokemon.items.has(Item.RUNE_PROTECT)) {
        const cells = this.board.getAdjacentCells(pokemon.positionX, pokemon.positionY);
        pokemon.status.triggerRuneProtect();
        cells.forEach((cell) => {
          if (cell.value && pokemon.team == cell.value.team) {
            cell.value.status.triggerRuneProtect();
          }
        });
      }
      if (pokemon.items.has(Item.FLUFFY_TAIL)) {
        this.board.forEach((x: number, y: number, value: PokemonEntity) => {
          if (value && pokemon.team != value.team && value.positionX == pokemon.positionX) {
            value.maxMana = Math.ceil(value.maxMana * 1.3);
          }
        });
      }
      if (pokemon.items.has(Item.SHINY_CHARM)) {
        this.board.forEach((x: number, y: number, value: PokemonEntity) => {
          if (value && pokemon.team != value.team && value.positionX == pokemon.positionX) {
            value.status.triggerSleep(3000);
          }
        });
      }
      if (pokemon.items.has(Item.FOCUS_BAND)) {
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
      if (pokemon.effects.includes(Effect.IRON_DEFENSE)) {
        if (redImperialCount > 0) {
          pokemon.atk = pokemon.atk * 2;
          redImperialCount --;
        } else {
          pokemon.effects.splice(pokemon.effects.findIndex((e) => e === Effect.IRON_DEFENSE), 1);
        }
      }
      if (pokemon.effects.includes(Effect.AUTOTOMIZE)) {
        pokemon.atk = pokemon.atk * 2;
      }
      let shieldBonus = 0;
      if (pokemon.effects.includes(Effect.STAMINA)) {
        shieldBonus = 20;
      }
      if (pokemon.effects.includes(Effect.STRENGTH)) {
        shieldBonus += 30;
      }
      if (pokemon.effects.includes(Effect.PURE_POWER)) {
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
      if (pokemon.items.has(Item.LUCKY_EGG)) {
        [-2, -1, 0, 1, 2].forEach( (offset)=>{
          const value = this.board.getValue(pokemon.positionX + offset, pokemon.positionY);
          if (value) {
            value.handleShield(30, pokemon);
          }
        });
      }
      if (pokemon.items.has(Item.DELTA_ORB)) {
        [-2, -1, 0, 1, 2].forEach( (offset)=>{
          const value = this.board.getValue(pokemon.positionX + offset, pokemon.positionY);
          if (value) {
            value.addSpellDamage(30);
          }
        });
      }
      if (pokemon.items.has(Item.RUNE_PROTECT)) {
        const cells = this.board.getAdjacentCells(pokemon.positionX, pokemon.positionY);
        pokemon.status.triggerRuneProtect();
        cells.forEach((cell) => {
          if (cell.value && pokemon.team == cell.value.team) {
            cell.value.status.triggerRuneProtect();
          }
        });
      }
      if (pokemon.items.has(Item.FLUFFY_TAIL)) {
        this.board.forEach((x: number, y: number, value: PokemonEntity) => {
          if (value && pokemon.team != value.team && value.positionX == pokemon.positionX) {
            value.maxMana = Math.ceil(value.maxMana * 1.3);
          }
        });
      }
      if (pokemon.items.has(Item.SHINY_CHARM)) {
        this.board.forEach((x: number, y: number, value: PokemonEntity) => {
          if (value && pokemon.team != value.team && value.positionX == pokemon.positionX) {
            value.status.triggerSleep(3000);
          }
        });
      }
      if (pokemon.items.has(Item.FOCUS_BAND)) {
        [-1, 0, 1].forEach( (offset)=>{
          const value = this.board.getValue(pokemon.positionX + offset, pokemon.positionY);
          if (value) {
            value.handleAttackSpeed(30);
          }
        });
      }
    });
  }

  applyEffects(pokemon: PokemonEntity, types: string[], allyEffects: Effect[]) {
    allyEffects.forEach((effect) => {
      switch (effect) {
        case Effect.HONE_CLAWS:
          if (types.includes(Synergy.DARK) && pokemon.items.size != 0) {
            pokemon.atk += 4 * pokemon.items.size;
            pokemon.handleShield(20 * pokemon.items.size, pokemon);
            pokemon.effects.push(Effect.HONE_CLAWS);
          }
          break;

        case Effect.ASSURANCE:
          if (types.includes(Synergy.DARK) && pokemon.items.size != 0) {
            pokemon.atk += 7 * pokemon.items.size;
            pokemon.handleShield(30 * pokemon.items.size, pokemon);
            pokemon.effects.push(Effect.ASSURANCE);
          }
          break;

        case Effect.BEAT_UP:
          if (types.includes(Synergy.DARK) && pokemon.items.size != 0) {
            pokemon.atk += 10 * pokemon.items.size;
            pokemon.handleShield(50 * pokemon.items.size, pokemon);
            pokemon.effects.push(Effect.BEAT_UP);
          }
          break;

        case Effect.ANCIENT_POWER:
          if (types.includes(Synergy.FOSSIL)) {
            pokemon.addCritChance(40);
            pokemon.critDamage += 0.8;
            pokemon.effects.push(Effect.ANCIENT_POWER);
          }
          break;

        case Effect.ELDER_POWER:
          if (types.includes(Synergy.FOSSIL)) {
            pokemon.addCritChance(70);
            pokemon.critDamage += 1.4;
            pokemon.effects.push(Effect.ELDER_POWER);
          }
          break;

        case Effect.UNOWN_GATHERINGS:
          if (types.includes(Synergy.FOSSIL)) {
            pokemon.addCritChance(100);
            pokemon.critDamage += 2.5;
            pokemon.effects.push(Effect.UNOWN_GATHERINGS);
          }
          break;

        case Effect.BLAZE:
          if (types.includes(Synergy.FIRE)) {
            pokemon.effects.push(Effect.BLAZE);
          }
          break;

        case Effect.DROUGHT:
          if (types.includes(Synergy.FIRE)) {
            pokemon.effects.push(Effect.DROUGHT);
          }
          break;

        case Effect.DESOLATE_LAND:
          if (types.includes(Synergy.FIRE)) {
            pokemon.effects.push(Effect.DESOLATE_LAND);
          }
          break;

        case Effect.INGRAIN:
          if (types.includes(Synergy.GRASS)) {
            pokemon.effects.push(Effect.INGRAIN);
          }
          break;

        case Effect.GROWTH:
          if (types.includes(Synergy.GRASS)) {
            pokemon.effects.push(Effect.GROWTH);
          }
          break;

        case Effect.SPORE:
          if (types.includes(Synergy.GRASS)) {
            pokemon.effects.push(Effect.SPORE);
          }
          break;

        case Effect.DRIZZLE:
          if (types.includes(Synergy.WATER)) {
            pokemon.addDodgeChance(0.25);
            pokemon.effects.push(Effect.DRIZZLE);
          }
          break;

        case Effect.RAIN_DANCE:
          if (types.includes(Synergy.WATER)) {
            pokemon.addDodgeChance(0.5);
            pokemon.effects.push(Effect.RAIN_DANCE);
          }
          break;

        case Effect.PRIMORDIAL_SEA:
          if (types.includes(Synergy.WATER)) {
            pokemon.addDodgeChance(0.75);
            pokemon.effects.push(Effect.PRIMORDIAL_SEA);
          }
          break;

        case Effect.STAMINA:
          if (types.includes(Synergy.NORMAL)) {
            pokemon.effects.push(Effect.STAMINA);
          }
          break;

        case Effect.STRENGTH:
          if (types.includes(Synergy.NORMAL)) {
            pokemon.effects.push(Effect.STRENGTH);
          }
          break;

        case Effect.PURE_POWER:
          if (types.includes(Synergy.NORMAL)) {
            pokemon.effects.push(Effect.PURE_POWER);
          }
          break;

        case Effect.EERIE_IMPULSE:
          if (types.includes(Synergy.ELECTRIC)) {
            pokemon.effects.push(Effect.EERIE_IMPULSE);
          }
          break;

        case Effect.RISING_VOLTAGE:
          if (types.includes(Synergy.ELECTRIC)) {
            pokemon.effects.push(Effect.RISING_VOLTAGE);
          }
          break;

        case Effect.OVERDRIVE:
          if (types.includes(Synergy.ELECTRIC)) {
            pokemon.effects.push(Effect.OVERDRIVE);
          }
          break;

        case Effect.REVENGE:
          pokemon.effects.push(Effect.REVENGE);
          break;

        case Effect.PUNISHMENT:
          pokemon.effects.push(Effect.PUNISHMENT);
          break;

        case Effect.IRON_DEFENSE:
          if (types.includes(Synergy.METAL)) {
            pokemon.effects.push(Effect.IRON_DEFENSE);
          }
          break;

        case Effect.AUTOTOMIZE:
          if (types.includes(Synergy.METAL)) {
            pokemon.effects.push(Effect.AUTOTOMIZE);
          }
          break;

        case Effect.BULK_UP:
          if (types.includes(Synergy.FIELD)) {
            pokemon.effects.push(Effect.BULK_UP);
          }
          break;

        case Effect.RAGE:
          if (types.includes(Synergy.FIELD)) {
            pokemon.effects.push(Effect.RAGE);
          }
          break;

        case Effect.ANGER_POINT:
          if (types.includes(Synergy.FIELD)) {
            pokemon.effects.push(Effect.ANGER_POINT);
          }
          break;

        case Effect.PURSUIT:
          if (types.includes(Synergy.MONSTER)) {
            pokemon.effects.push(Effect.PURSUIT);
          }
          break;

        case Effect.BRUTAL_SWING:
          if (types.includes(Synergy.MONSTER)) {
            pokemon.effects.push(Effect.BRUTAL_SWING);
          }
          break;

        case Effect.POWER_TRIP:
          if (types.includes(Synergy.MONSTER)) {
            pokemon.effects.push(Effect.POWER_TRIP);
          }
          break;

        case Effect.AMNESIA:
          pokemon.effects.push(Effect.AMNESIA);
          pokemon.speDef += 5;
          break;

        case Effect.LIGHT_SCREEN:
          pokemon.effects.push(Effect.LIGHT_SCREEN);
          pokemon.speDef += 10;
          break;

        case Effect.EERIE_SPELL:
          pokemon.effects.push(Effect.EERIE_SPELL);
          pokemon.speDef += 20;
          break;

        case Effect.MEDITATE:
          pokemon.effects.push(Effect.MEDITATE);
          break;

        case Effect.FOCUS_ENERGY:
          pokemon.effects.push(Effect.FOCUS_ENERGY);
          break;

        case Effect.CALM_MIND:
          pokemon.effects.push(Effect.CALM_MIND);
          break;

        case Effect.TAILWIND:
          if (types.includes(Synergy.FLYING)) {
            pokemon.flyingProtection = true;
            pokemon.effects.push(Effect.TAILWIND);
          }
          break;

        case Effect.FEATHER_DANCE:
          if (types.includes(Synergy.FLYING)) {
            pokemon.flyingProtection = true;
            pokemon.effects.push(Effect.FEATHER_DANCE);
          }
          break;

        case Effect.MAX_AIRSTREAM:
          if (types.includes(Synergy.FLYING)) {
            pokemon.flyingProtection = true;
            pokemon.effects.push(Effect.MAX_AIRSTREAM);
          }
          break;

        case Effect.MAX_GUARD:
          if (types.includes(Synergy.FLYING)) {
            pokemon.flyingProtection = true;
            pokemon.effects.push(Effect.MAX_GUARD);
          }
          break;

        case Effect.SWIFT_SWIM:
          if (types.includes(Synergy.AQUATIC)) {
            pokemon.effects.push(Effect.SWIFT_SWIM);
          }
          break;

        case Effect.HYDRO_CANNON:
          if (types.includes(Synergy.AQUATIC)) {
            pokemon.effects.push(Effect.HYDRO_CANNON);
          }
          break;

        case Effect.ODD_FLOWER:
          if (types.includes(Synergy.FLORA)) {
            pokemon.effects.push(Effect.ODD_FLOWER);
          }
          break;

        case Effect.GLOOM_FLOWER:
          if (types.includes(Synergy.FLORA)) {
            pokemon.effects.push(Effect.GLOOM_FLOWER);
          }
          break;

        case Effect.VILE_FLOWER:
          if (types.includes(Synergy.FLORA)) {
            pokemon.effects.push(Effect.VILE_FLOWER);
          }
          break;

        case Effect.SUN_FLOWER:
          if (types.includes(Synergy.FLORA)) {
            pokemon.effects.push(Effect.SUN_FLOWER);
          }
          break;

        case Effect.BATTLE_ARMOR:
          if (types.includes(Synergy.MINERAL)) {
            pokemon.handleShield(60, pokemon);
            pokemon.effects.push(Effect.BATTLE_ARMOR);
          }
          break;

        case Effect.MOUTAIN_RESISTANCE:
          if (types.includes(Synergy.MINERAL)) {
            pokemon.handleShield(130, pokemon);
            pokemon.effects.push(Effect.MOUTAIN_RESISTANCE);
          }
          break;

        case Effect.DIAMOND_STORM:
          if (types.includes(Synergy.MINERAL)) {
            pokemon.handleShield(240, pokemon);
            pokemon.effects.push(Effect.DIAMOND_STORM);
          }
          break;

        case Effect.PHANTOM_FORCE:
          if (types.includes(Synergy.GHOST)) {
            pokemon.effects.push(Effect.PHANTOM_FORCE);
          }
          break;

        case Effect.CURSE:
          if (types.includes(Synergy.GHOST)) {
            pokemon.attackType = AttackType.TRUE;
            pokemon.effects.push(Effect.CURSE);
          }
          break;

        case Effect.AROMATIC_MIST:
          if (types.includes(Synergy.FAIRY)) {
            pokemon.effects.push(Effect.AROMATIC_MIST);
          }
          break;

        case Effect.FAIRY_WIND:
          if (types.includes(Synergy.FAIRY)) {
            pokemon.effects.push(Effect.FAIRY_WIND);
          }
          break;

        case Effect.STRANGE_STEAM:
          if (types.includes(Synergy.FAIRY)) {
            pokemon.effects.push(Effect.STRANGE_STEAM);
          }
          break;

        case Effect.DRAGON_ENERGY:
          if (types.includes(Synergy.DRAGON)) {
            pokemon.effects.push(Effect.DRAGON_ENERGY);
          }
          break;

        case Effect.DRAGON_DANCE:
          if (types.includes(Synergy.DRAGON)) {
            pokemon.effects.push(Effect.DRAGON_DANCE);
          }
          break;

        case Effect.SNOW:
          pokemon.effects.push(Effect.SNOW);
          break;

        case Effect.SHEER_COLD:
          pokemon.effects.push(Effect.SHEER_COLD);
          break;

        case Effect.POISON_GAS:
          if (types.includes(Synergy.POISON)) {
            pokemon.effects.push(Effect.POISON_GAS);
          }
          break;

        case Effect.TOXIC:
          if (types.includes(Synergy.POISON)) {
            pokemon.effects.push(Effect.TOXIC);
          }
          break;

        case Effect.LARGO:
          if (types.includes(Synergy.SOUND)) {
            pokemon.effects.push(Effect.LARGO);
          }
          break;

        case Effect.ALLEGRO:
          if (types.includes(Synergy.SOUND)) {
            pokemon.effects.push(Effect.ALLEGRO);
          }
          break;

        case Effect.PRESTO:
          if (types.includes(Synergy.SOUND)) {
            pokemon.effects.push(Effect.PRESTO);
          }
          break;

        case Effect.SWARM:
          if (types.includes(Synergy.BUG)) {
            pokemon.effects.push(Effect.SWARM);
          }
          break;

        case Effect.STICKY_WEB:
          if (types.includes(Synergy.BUG)) {
            pokemon.effects.push(Effect.STICKY_WEB);
          }
          break;

        case Effect.SHORE_UP:
          if (types.includes(Synergy.GROUND)) {
            pokemon.effects.push(Effect.SHORE_UP);
          }
          break;

        case Effect.ROTOTILLER:
          if (types.includes(Synergy.GROUND)) {
            pokemon.effects.push(Effect.ROTOTILLER);
          }
          break;

        case Effect.SANDSTORM:
          if (types.includes(Synergy.GROUND)) {
            pokemon.effects.push(Effect.SANDSTORM);
          }
          break;

        default:
          break;
      }
    });
  }

  getClimate() {
    let climate = Climate.NEUTRAL;
    if (this.blueEffects.includes(Effect.SNOW) || this.redEffects.includes(Effect.SNOW)) {
      climate = Climate.SNOW;
    }
    if (this.blueEffects.includes(Effect.DRIZZLE) || this.redEffects.includes(Effect.DRIZZLE)) {
      climate = Climate.RAIN;
    }
    if (this.blueEffects.includes(Effect.SHEER_COLD) || this.redEffects.includes(Effect.SHEER_COLD)) {
      climate = Climate.SNOW;
    }
    if (this.blueEffects.includes(Effect.RAIN_DANCE) || this.redEffects.includes(Effect.RAIN_DANCE)) {
      climate = Climate.RAIN;
    }
    if (this.blueEffects.includes(Effect.SANDSTORM) || this.redEffects.includes(Effect.SANDSTORM)) {
      climate = Climate.SANDSTORM;
    }
    if (this.blueEffects.includes(Effect.DROUGHT) || this.redEffects.includes(Effect.DROUGHT)) {
      climate = Climate.SUN;
    }
    if (this.blueEffects.includes(Effect.PRIMORDIAL_SEA) || this.redEffects.includes(Effect.PRIMORDIAL_SEA)) {
      climate = Climate.RAIN;
    }
    return climate;
  }

  update(dt: number) {
    if (this.blueTeam.size == 0 || this.redTeam.size == 0) {
      this.finished = true;
      if(this.blueTeam.size == 0){
        this.redTeam.forEach(p=>{
          p.action = PokemonActionState.HOP;
        });
      }
      else{
        this.blueTeam.forEach(p=>{
          p.action = PokemonActionState.HOP;
        });
      }
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

    this.climate = Climate.NEUTRAL;
  }
}