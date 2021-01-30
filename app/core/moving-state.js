const STATE_TYPE = require('../models/enum').STATE_TYPE;
const PokemonState = require('./pokemon-state');

class MovingState extends PokemonState {
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
      } else if (board.distance(pokemon.positionX, pokemon.positionY, targetCoordinate[0], targetCoordinate[1]) <= pokemon.range && !pokemon.confusion) {
        pokemon.toAttackingState();
      } else {
        if (!pokemon.sleep && !pokemon.freeze) {
          this.move(pokemon, board, targetCoordinate);
        }
      }
    } else {
      pokemon.cooldown = Math.max(0, pokemon.cooldown - dt);
    }
  }

  move(pokemon, board, coordinates) {
    // console.log('move attempt');
    const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY);
    let distance = 999;
    let x;
    let y;
    cells.forEach((cell) => {
      if (cell.value === undefined) {
        const candidateDistance = board.distance(coordinates[0], coordinates[1], cell.row, cell.column);
        // console.log(`Candidate (${cell.row},${cell.column}) to ${coordinates}, distance: ${candidateDistance}`);
        if (candidateDistance < distance) {
          distance = candidateDistance;
          x = cell.row;
          y = cell.column;
        }
      }
    });
    if (x !== undefined && y !== undefined) {
      pokemon.orientation = board.orientation(pokemon.positionX, pokemon.positionY, x, y);
      // console.log(`pokemon moved from (${pokemon.positionX},${pokemon.positionY}) to (${x},${y}), (desired direction (${coordinates[0]}, ${coordinates[1]})), orientation: ${pokemon.orientation}`);
      board.moveValue(pokemon.positionX, pokemon.positionY, x, y);
      pokemon.positionX = x;
      pokemon.positionY = y;
    }
  }

  onEnter(pokemon) {
    super.onEnter(pokemon);
    pokemon.action = STATE_TYPE.MOVING;
  }

  onExit(pokemon) {
    super.onExit(pokemon);
  }
}

module.exports = MovingState;
