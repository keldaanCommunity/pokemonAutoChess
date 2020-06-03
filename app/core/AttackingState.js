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
}

module.exports = AttackingState;