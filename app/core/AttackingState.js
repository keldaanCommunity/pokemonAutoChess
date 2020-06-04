const STATE_TYPE = require('../models/enum').STATE_TYPE;

class AttackingState extends PokemonState
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
        pokemon.action = STATE_TYPE.ATTACKING;
    }

    onExit(pokemon){
        super.onExit(pokemon);
    }
}

module.exports = AttackingState;