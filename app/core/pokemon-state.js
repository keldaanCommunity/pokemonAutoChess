const {EFFECTS, ATTACK_TYPE, TYPE, CLIMATE, ITEMS} = require('../models/enum');


class PokemonState {
  constructor() {

  }

  handleDamage(pokemon, damage, board, attackType) {
    let death = false;
    let reducedDamage = damage;
    if (attackType == ATTACK_TYPE.PHYSICAL) {
      reducedDamage = Math.max(0, damage - pokemon.def);
    }
    if (attackType == ATTACK_TYPE.SPECIAL) {
      reducedDamage = Math.max(0, damage - pokemon.speDef);
    }

    pokemon.life -= reducedDamage;
    // console.log(`${pokemon.id} took ${damage} and has now ${pokemon.life} life`);
    if (pokemon.effects.includes(EFFECTS.RAGE)) {
      pokemon.attack += Math.ceil(pokemon.baseAtk * 0.05);
    }
    if (pokemon.effects.includes(EFFECTS.PURSUIT) && pokemon.life/pokemon.hp < 0.25) {
      pokemon.life = 0;
      death = true;
    }
    if (pokemon.life <= 0) {
      board.setValue(pokemon.positionX, pokemon.positionY, undefined);
      death = true;
    }
    return death;
  }

  update(pokemon, dt, board, climate) {
    if (pokemon.cooldown <= 0) {
      if (climate == CLIMATE.SANDSTORM) {
        if (!pokemon.types.includes(TYPE.GROUND) && !pokemon.types.includes(TYPE.METAL)) {
          this.handleDamage(pokemon, Math.ceil(pokemon.hp / 10), board, ATTACK_TYPE.SPECIAL);
        }
      }
      if (pokemon.life <= pokemon.hp / 2 && pokemon.effects.includes(EFFECTS.BLAZE)) {
        pokemon.atk = pokemon.atk * 1.1;
      }

      if (pokemon.effects.includes(EFFECTS.INGRAIN)) {
        pokemon.life = Math.min(pokemon.hp, pokemon.life + Math.ceil(pokemon.hp / 20));
      }

      for (let key in pokemon.items){
        let item = pokemon.items[key];

        if(item.name == ITEMS.METRONOME){
          pokemon.atk = pokemon.atk * 1.05;
        }
  
        else if(item.name == ITEMS.SALAC_BERRY){
          if(pokemon.life <= pokemon.hp / 2){
            pokemon.atkSpeed = pokemon.atkSpeed * 0.5;
            delete pokemon.items[key];
          }
        }
  
        else if(item.name == ITEMS.LIECHI_BERRY){
          if(pokemon.life <= pokemon.hp / 2  && pokemon.attackType == ATTACK_TYPE.PHYSICAL){
            pokemon.atk = pokemon.atk * 1.5;
            delete pokemon.items[key];
          }
        }
  
        else if(item.name == ITEMS.GANLON_BERRY){
          if(pokemon.life <= pokemon.hp / 2){
            pokemon.def = pokemon.def * 1.5;
            delete pokemon.items[key];
          }
        }
  
        else if(item.name == ITEMS.PETAYA_BERRY){
          if(pokemon.life <= pokemon.hp / 2 && pokemon.attackType == ATTACK_TYPE.SPECIAL){
            pokemon.atk = pokemon.atk * 1.5;
            delete pokemon.items[key];
          }
        }
  
        else if(item.name == ITEMS.APRICOT_BERRY){
          if(pokemon.life <= pokemon.hp / 2){
            pokemon.speDef = pokemon.speDef * 1.5;
            delete pokemon.items[key];
          }
        }
        
        else if(item.name == ITEMS.ORAN_BERRY){
          if(pokemon.life <= pokemon.hp / 4){
            pokemon.life += Math.ceil(pokemon.hp / 4);
            delete pokemon.items[key];
          }
        }
  
        else if(item.name == ITEMS.BIG_ROOT){
          pokemon.life = Math.min(pokemon.hp, pokemon.life + Math.ceil(pokemon.hp / 20));
        }
      }

      if (pokemon.effects.includes(EFFECTS.RAIN_DISH)) {
        pokemon.life = Math.min(pokemon.hp, pokemon.life + Math.ceil(pokemon.hp / 10));
      }

      if (pokemon.effects.includes(EFFECTS.POISON_GAS)) {
        this.handleDamage(pokemon, Math.ceil(pokemon.hp / 20), board, ATTACK_TYPE.SPECIAL);
      }

      if (pokemon.effects.includes(EFFECTS.TOXIC)) {
        this.handleDamage(pokemon, Math.ceil(pokemon.hp / 10), board, ATTACK_TYPE.SPECIAL);
      }
    }
  }

  onEnter(pokemon) {
  }

  onExit(pokemon) {
  }

  isTarget(pokemon, board) {
    let target = false;
    board.forEach((x, y, value) => {
      if (value && value.team != pokemon.team) {
        target = true;
      }
    });
    return target;
  }

  getNearestTargetCoordinate(pokemon, board) {
    let x = undefined;
    let y = undefined;
    let distance = 999;
    board.forEach((r, c, value) => {
      if (value !== undefined && value.team != pokemon.team) {
        const candidateDistance = board.distance(pokemon.positionX, pokemon.positionY, r, c);
        if (candidateDistance < distance) {
          distance = candidateDistance;
          x = r;
          y = c;
        }
      }
    });
    return [x, y];
  }
};

module.exports = PokemonState;
