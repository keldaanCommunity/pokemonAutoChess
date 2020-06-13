const STATE_TYPE = require('../models/enum').STATE_TYPE;
const PokemonState = require('./pokemon-state');

class AttackingState extends PokemonState {
    constructor() {
        super();
    }

    handleDamage(pokemon, damage) {
        super.handleDamage(pokemon, damage);
    }

    update(pokemon, dt, board) {
        super.update(pokemon, dt, board);
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