import {TYPE} from '../models/enum';
import { Orientation } from '../types/enum/Game';
import Board from './board';
import PokemonEntity from './pokemon-entity';
import PokemonState from './pokemon-state';
import { PokemonActionState } from '../types/enum/Game';

export default class MovingState extends PokemonState {

  update(pokemon: PokemonEntity, dt: number, board: Board, climate: string) :boolean{
    super.update(pokemon, dt, board, climate);
    if (pokemon.cooldown <= 0) {
      pokemon.cooldown = 500;
      const targetCoordinate = this.getNearestTargetCoordinate(pokemon, board);
      // no target case
      if (targetCoordinate[0] === undefined || targetCoordinate[1] === undefined) {
      } else if (board.distance(pokemon.positionX, pokemon.positionY, targetCoordinate[0], targetCoordinate[1]) <= pokemon.range && !pokemon.status.confusion) {
        pokemon.toAttackingState();
      } else {
        if (!pokemon.status.sleep && !pokemon.status.freeze) {
          this.move(pokemon, board, targetCoordinate);
        }
      }
    } else {
      pokemon.cooldown = Math.max(0, pokemon.cooldown - dt);
    }
    return false;
  }

  move(pokemon: PokemonEntity, board: Board, coordinates: number[]) {
    // console.log('move attempt');

    let x: number;
    let y: number;
    if (pokemon.types.includes(TYPE.FOSSIL)) {
      const farthestCoordinate = this.getFarthestTargetCoordinateAvailablePlace(pokemon, board);
      x = farthestCoordinate[0];
      y = farthestCoordinate[1];
    } else {
      const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY);
      let distance = 999;

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
    }
    if (x !== undefined && y !== undefined) {
      pokemon.orientation = board.orientation(pokemon.positionX, pokemon.positionY, x, y);
      if (pokemon.orientation == Orientation.UNCLEAR) {
        console.log(`error orientation, was moving, name ${pokemon.name}`);
        pokemon.orientation = Orientation.DOWNLEFT;
      }
      // console.log(`pokemon moved from (${pokemon.positionX},${pokemon.positionY}) to (${x},${y}), (desired direction (${coordinates[0]}, ${coordinates[1]})), orientation: ${pokemon.orientation}`);
      board.swapValue(pokemon.positionX, pokemon.positionY, x, y);
      pokemon.positionX = x;
      pokemon.positionY = y;
    }
  }

  onEnter(pokemon: PokemonEntity) {
    super.onEnter(pokemon);
    pokemon.action = PokemonActionState.MOVING;
  }

  onExit(pokemon: PokemonEntity) {
    super.onExit(pokemon);
  }
}

module.exports = MovingState;
