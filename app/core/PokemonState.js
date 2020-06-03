class PokemonState
{
    constructor() {
    }

    handleDamage(pokemon, damage){
        pokemon.life -= damage;
        if(pokemon.life < 0){
            delete pokemon;
        }
    }

    update(pokemon){

    }
};