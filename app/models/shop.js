const PokemonFactory = require("./pokemon-factory");

class Shop {
  detachShop(player) {
    for (let id in player.shop) {
      delete player.shop[id];
    }
  }

  assignShop(player) {
    let potentialPokemons = ["bulbasaur", "charmander", "squirtle"];
    for (let i = 0; i < 5; i++) {
      let pokemon = PokemonFactory.createPokemonFromName(potentialPokemons[Math.round(Math.random() * (potentialPokemons.length - 1))]);
      player.shop[pokemon.id] = pokemon;
    }
  }
}

module.exports = Shop;