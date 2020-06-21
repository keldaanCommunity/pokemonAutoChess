const PokemonFactory = require("./pokemon-factory");

class Shop {

  static common = ["geodude", "azurill", "zubat","mareep","cleffa","igglybuff","caterpie","weedle","pidgey","hoppip","seedot","starly"];
  static uncommon = ["bulbasaur", "charmander", "squirtle"];
  detachShop(player) {
    for (let id in player.shop) {
      delete player.shop[id];
    }
  }
  // TODO pokemon shop in corelation with player level
  assignShop(player) {
    let potentialPokemons = Shop.common;
    for (let i = 0; i < 5; i++) {
      let pokemon = PokemonFactory.createPokemonFromName(potentialPokemons[Math.round(Math.random() * (potentialPokemons.length - 1))]);
      player.shop[pokemon.id] = pokemon;
    }
  }
}

module.exports = Shop;