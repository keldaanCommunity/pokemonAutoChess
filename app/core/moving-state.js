const STATE_TYPE = require('../models/enum').STATE_TYPE;
const PokemonState = require('./pokemon-state');
const AttackingState = require('./attacking-state');

class MovingState extends PokemonState {
    constructor() {
        super();
    }

    handleDamage(pokemon, damage) {
        super.handleDamage(pokemon, damage);
    }

    update(pokemon, dt, board) {
        super.update(pokemon, dt, board);
        if(pokemon.cooldown <= 0){
            pokemon.cooldown = 1000;
            if(this.isTargetInRange(pokemon, board)){
                pokemon.changeState(new AttackingState());
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

    isTarget(pokemon, board){
        let target = false;
        board.forEach((x,y,value) => {
            if(value && value.team != pokemon.team){
                target = true;
            }
        });
        return target;
    }

    isTargetInRange(pokemon, board){
        let targetInRange = false;
        let cellsInRange = board.getAdjacentCells(pokemon.positionX, pokemon.positionY);
        cellsInRange.forEach((cell) => {
            if(cell.value && cell.value.team != pokemon.team)
            {
                targetInRange = true;
            }
        });
        return targetInRange;
    }

    getNearestTargetCoordinate(pokemon, board){
        let x;
        let y;
        let distance = 999;
        board.forEach((r,c,value) => {
            if(value && value.team != pokemon.team){
                let candidateDistance = board.distanceM(pokemon.positionX,pokemon.positionY,r,c);
                if(candidateDistance < distance){
                    distance = candidateDistance;
                    x = r;
                    y = c;
                }      
            }
        });
        return [x,y];
    }

    move(pokemon, board, coordinates){
        console.log('move attempt');
        let cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY);
        let distance = 999;
        let x;
        let y;
        cells.forEach(cell => {
            if(cell.value === undefined){
                let candidateDistance = board.distanceM(coordinates[0],coordinates[1], cell.row, cell.column);
                console.log(`Candidate (${cell.row},${cell.column}) to ${coordinates}, distance: ${candidateDistance}`);
                if(candidateDistance < distance){
                    distance = candidateDistance;
                    x = cell.row;
                    y = cell.column;
                }
            }
        });
        if(x && y){
            console.log(`pokemon moved from (${pokemon.positionX},${pokemon.positionY}) to (${x},${y}), (desired direction (${coordinates[0]}, ${coordinates[1]}))`);
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