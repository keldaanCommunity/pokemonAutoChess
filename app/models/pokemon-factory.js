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
      case "geodude":
        return new Pokemon.Geodude();
      case "graveler":
        return new Pokemon.Graveler();
      case "golem":
        return new Pokemon.Golem();
      case "azurill":
        return new Pokemon.Azurill();
      case "marill":
        return new Pokemon.Marill();
      case "Azumarill":
        return new Pokemon.Azumarill();
      case "zubat":
        return new Pokemon.Zubat();
      case "golbat":
        return new Pokemon.Golbat();
      case "crobat":
        return new Pokemon.Crobat();
      case "ampharos":
        return new Pokemon.Ampharos();
      case "mareep":
        return new Pokemon.Mareep();
      case "flaffy":
        return new Pokemon.Flaffy;
      default:
        break;
    }
  }
}

module.exports = PokemonFactory;