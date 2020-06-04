class PokemonState
{
    constructor() {}

    handleDamage(pokemon, damage){
        pokemon.life -= damage;
        if(pokemon.life < 0){
            pokemon = null;
        }
    }

    update(pokemon){}

    onEnter(pokemon){}

    onExit(pokemon){}
};

module.exports = PokemonState;