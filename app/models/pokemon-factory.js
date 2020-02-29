const Pokemon = require("./pokemon");

class PokemonFactory {
  static createPokemonFromName(name) {
    switch (name) {
      case "bulbasaur":
        return new Pokemon.Bulbasaur();
      case "ivysaur":
        return new Pokemon.Ivysaur();
      case "venusaur":
        return new Pokemon.Venusaur();
      case "charmander":
        return new Pokemon.Charmander();
      case "charmeleon":
        return new Pokemon.Charmeleon();
      case "charizard":
        return new Pokemon.Charizard();
      case "squirtle":
        return new Pokemon.Squirtle();
      case "wartortle":
        return new Pokemon.Wartortle();
      case "blastoise":
        return new Pokemon.Blastoise();
      default:
        break;
    }
  }
}

module.exports = PokemonFactory;