const STATE_TYPE = require('../models/enum').STATE_TYPE;
const PokemonState = require('./pokemon-state');

class AttackingState extends PokemonState {
  constructor() {
    super();
  }

  update(pokemon, dt, board, climate) {
    super.update(pokemon, dt, board, climate);
    if (pokemon.cooldown <= 0) {
      pokemon.cooldown = 1000;
      const targetCoordinate = this.getNearestTargetCoordinate(pokemon, board);
      // no target case
      if (targetCoordinate[0] === undefined || targetCoordinate[1] === undefined) {
        pokemon.toMovingState();
      } else if (board.distance(pokemon.positionX, pokemon.positionY, targetCoordinate[0], targetCoordinate[1]) > pokemon.range) {
        pokemon.toMovingState();
      } else {
        this.attack(pokemon, board, targetCoordinate);
      }
    } else {
      pokemon.cooldown = Math.max(0, pokemon.cooldown - dt);
    }
  }

  attack(pokemon, board, coordinates) {
    pokemon.targetX = coordinates[0];
    pokemon.targetY = coordinates[1];
    const target = board.getValue(coordinates[0], coordinates[1]);
    if (target) {
      pokemon.orientation = board.orientation(pokemon.positionX, pokemon.positionY, target.positionX, target.positionY);
      // console.log(`pokemon attack from (${pokemon.positionX},${pokemon.positionY}) to (${pokemon.targetX},${pokemon.targetY}), orientation: ${pokemon.orientation}`);
      target.handleDamage(pokemon.atk, board);
    } else {
      console.log('warning, no target detected at given coordinates');
    }
  }

  onEnter(pokemon) {
    super.onEnter(pokemon);
    pokemon.action = STATE_TYPE.ATTACKING;
  }

  onExit(pokemon) {
    pokemon.targetX = -1;
    pokemon.targetY = -1;
    super.onExit(pokemon);
  }
}

module.exports = AttackingState;
