const PokemonFactory = require('./PokemonFactory');

class Shop
{
    constructor()
    {
        this.pool = [];
        for (let i = 0; i < 20; i++) 
        {
            this.pool.push(PokemonFactory.createPokemonFromName('bulbasaur'));
        }
    }

    detachShop(player)
    {
        if(player.shop != [])
        {
            this.pool = this.pool.concat(player.shop);
            player.shop = [];
        }
    }

    assignShop(player)
    { 
        for (let i = 0; i < 5; i++) 
        {
            player.shop.push(this.pool.pop());
        }
    }
}

module.exports = Shop;