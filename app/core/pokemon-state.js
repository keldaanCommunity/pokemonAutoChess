const { EFFECTS } = require('../models/enum');

const TYPE = require('../models/enum').TYPE;
const CLIMATE = require('../models/enum').CLIMATE;

class PokemonState {
  constructor() {

  }

  handleDamage(pokemon, damage, board) {
    let death = false;
    const reducedDamage = Math.max(0, damage - pokemon.def);
    pokemon.life -= reducedDamage;
    // console.log(`${pokemon.id} took ${damage} and has now ${pokemon.life} life`);
    if(pokemon.effects.includes(EFFECTS.RAGE)){
      pokemon.attack += Math.round(pokemon.baseAtk * 0.05);
    }
    if(pokemon.effects.includes(EFFECTS.PURSUIT) && pokemon.life/pokemon.hp < 0.25){
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
      if(climate == CLIMATE.SANDSTORM && (!pokemon.types.includes(TYPE.GROUND) || !pokemon.types.includes(TYPE.METAL))){
        this.handleDamage(pokemon, Math.round(pokemon.hp / 10), board);
      }
      if(pokemon.life <= pokemon.hp / 2 && pokemon.effects.includes(EFFECTS.BLAZE)){
        pokemon.atk = pokemon.atk * 1.5;
      }

      if(pokemon.effects.includes(EFFECTS.INGRAIN)){
        pokemon.life = Math.min(pokemon.hp, pokemon.life + Math.round(pokemon.hp / 20));
      }

      if(pokemon.effects.includes(EFFECTS.RAIN_DISH)){
        pokemon.life = Math.min(pokemon.hp, pokemon.life + Math.round(pokemon.hp / 10));
      }

      if(pokemon.effects.includes(EFFECTS.POISON_GAS)){
        this.handleDamage(pokemon, Math.round(pokemon.hp / 20), board);
      }

      if(pokemon.effects.includes(EFFECTS.TOXIC)){
        this.handleDamage(pokemon, Math.round(pokemon.hp / 10), board);
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
