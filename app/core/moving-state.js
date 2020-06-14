const STATE_TYPE = require('../models/enum').STATE_TYPE;
const PokemonState = require('./pokemon-state');
const AttackingState = require('./attacking-state');

class MovingState extends PokemonState {
    constructor() {
        super();
    }

    update(pokemon, dt, board) {
        super.update(pokemon, dt, board);
        if(pokemon.cooldown <= 0){
            pokemon.cooldown = 1000;
            if(this.isTargetInRange(pokemon, board)){
                pokemon.toAttackingState();
            }
            else{
                if(this.isTarget(pokemon, board)){
                    let coordinates = this.getNearestTargetCoordinate(pokemon, board);
                    this.move(pokemon, board, coordinates);
                }
            }
        }
        else{
            pokemon.cooldown = Math.max(0, pokemon.cooldown - dt); 
        }
    }

    move(pokemon, board, coordinates){
        //.console.log('move attempt');
        let cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY);
        let distance = 999;
        let x;
        let y;
        cells.forEach(cell => {
            if(cell.value === undefined){
                let candidateDistance = board.distanceM(coordinates[0],coordinates[1], cell.row, cell.column);
                //console.log(`Candidate (${cell.row},${cell.column}) to ${coordinates}, distance: ${candidateDistance}`);
                if(candidateDistance < distance){
                    distance = candidateDistance;
                    x = cell.row;
                    y = cell.column;
                }
            }
        });
        if(x !== undefined && y !== undefined){
            //console.log(`pokemon moved from (${pokemon.positionX},${pokemon.positionY}) to (${x},${y}), (desired direction (${coordinates[0]}, ${coordinates[1]}))`);
            board.moveValue(pokemon.positionX, pokemon.positionY, x, y);
            pokemon.orientation = board.orientation(pokemon.positionX, pokemon.positionY, x, y);
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