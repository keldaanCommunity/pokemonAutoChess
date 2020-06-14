const STATE_TYPE = require('../models/enum').STATE_TYPE;
const PokemonState = require('./pokemon-state');

class AttackingState extends PokemonState {
    constructor() {
        super();
    }

    update(pokemon, dt, board) {
        if(pokemon.cooldown <= 0){
            pokemon.cooldown = 1000;
            if(!this.isTargetInRange(pokemon, board)){
                pokemon.toMovingState();
            }
            else{
                this.attack(pokemon, board);
            }
        }
        else{
            pokemon.cooldown = Math.max(0, pokemon.cooldown - dt); 
        }
    }

    attack(pokemon, board){
        let target = this.getTargetInRange(pokemon, board);
        pokemon.orientation = board.orientation(pokemon.positionX, pokemon.positionY, target.positionX, target.positionY);
        target.handleDamage(pokemon.atk, board);
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