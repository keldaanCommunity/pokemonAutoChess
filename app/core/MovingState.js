const STATE_TYPE = require('../models/enum').STATE_TYPE;
const PokemonState = require('./PokemonState');

class MovingState extends PokemonState
{
    constructor() {
        super();
    }

    handleDamage(pokemon, damage){
        super.handleDamage(pokemon, damage);
    }

    update(pokemon){
        super.update(pokemon);
    }

    onEnter(pokemon){
        super.onEnter(pokemon);
        pokemon.action = STATE_TYPE.MOVING;
    }

    onExit(pokemon){
        super.onExit(pokemon);
    }
}

module.exports = MovingState;