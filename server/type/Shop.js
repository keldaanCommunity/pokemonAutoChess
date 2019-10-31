const PokemonFactory = require('./PokemonFactory');

class Shop
{
    constructor()
    {
        this.pool = new Map();
        let potentialPokemons = ['bulbasaur', 'charmander', 'squirtle'];
        for (let i = 0; i < 40; i++) 
        {
            let pokemon = PokemonFactory.createPokemonFromName(potentialPokemons[Math.round(Math.random() * (potentialPokemons.length -1))]);
            this.pool.set(pokemon.id, pokemon);
        }
    }

    detachShop(player)
    {
        for (let id in player.shop) 
        {
            this.pool.set(id, player.shop[id]);
        }

        for (let id in player.shop) 
        {
            delete player.shop[id];
        }
    }

    assignShop(player)  
    {
        for (let i = 0; i < 5; i++) 
        {
            let index = Math.round(Math.random() * (this.pool.size - 1));
            
            let entries = this.pool.entries();
            let element;
            
            while(index >= 0)
            {
                element = entries.next();
                index-= 1;
            }
            player.shop[element.value[0]] = element.value[1];
            this.pool.delete(element.value[0]);
        }   
    }
}

module.exports = Shop;