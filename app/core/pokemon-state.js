const TYPE = require('../models/enum').TYPE;
const CLIMATE = require('../models/enum').CLIMATE;

class PokemonState {
  constructor() {

  }

  handleDamage(pokemon, damage, board) {
    pokemon.life -= damage;
    // console.log(`${pokemon.id} took ${damage} and has now ${pokemon.life} life`);
    if (pokemon.life <= 0) {
      board.setValue(pokemon.positionX, pokemon.positionY, undefined);
    }
  }

  update(pokemon, dt, board, climate) {
    if (pokemon.cooldown <= 0) {
      if(climate == CLIMATE.SANDSTORM && (!pokemon.types.includes(TYPE.GROUND) || !pokemon.types.includes(TYPE.METAL))){
        this.handleDamage(pokemon,Math.round(pokemon.life/10), board);
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
