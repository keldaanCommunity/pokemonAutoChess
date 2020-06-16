const STATE_TYPE = require('../models/enum').STATE_TYPE;
const PokemonState = require('./pokemon-state');

class AttackingState extends PokemonState {
    constructor() {
        super();
    }

    update(pokemon, dt, board) {
        if(pokemon.cooldown <= 0){
            pokemon.cooldown = 1000;
            let targetCoordinate = this.getNearestTargetCoordinate(pokemon,board);
            // no target case
            if(targetCoordinate[0] === undefined || targetCoordinate[1] === undefined){
                pokemon.toMovingState();
            }
            else if(board.distance(pokemon.positionX,pokemon.positionY,targetCoordinate[0], targetCoordinate[1]) > pokemon.range){
                pokemon.toMovingState();
            }
            else{
                this.attack(pokemon, board, targetCoordinate);
            }
        }
        else{
            pokemon.cooldown = Math.max(0, pokemon.cooldown - dt); 
        }
    }

    attack(pokemon, board, coordinates){
        let target = board.getValue(coordinates[0], coordinates[1]);
        if(target){
            pokemon.orientation = board.orientation(pokemon.positionX, pokemon.positionY, target.positionX, target.positionY);
            target.handleDamage(pokemon.atk, board);
        }
        else{
            console.log("warning, to target detected at given coordinates");
        }
    }

    onEnter(pokemon) {
        super.onEnter(pokemon);
        pokemon.action = STATE_TYPE.ATTACKING;
    }

    onExit(pokemon) {
        super.onExit(pokemon);
    }
}

module.exports = AttackingState;