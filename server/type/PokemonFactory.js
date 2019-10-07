const Pokemon = require('./Pokemon');

class PokemonFactory{
    static createPokemonFromName(name){
        switch (name) {
            case 'bulbasaur':
                return new Pokemon.Bulbasaur();
            
            case 'ivysaur':
                return new Pokemon.Ivysaur();
        
            case 'venusaur':
                return new Pokemon.Venusaur();

            default:
                break;
        }
    }
}

module.exports = PokemonFactory;