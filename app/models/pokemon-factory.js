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
      case "azumarill":
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
        return new Pokemon.Flaffy();
      case "cleffa":
        return new Pokemon.Cleffa();
      case "clefairy":
        return new Pokemon.Clefairy();
      case "clefable":
        return new Pokemon.Clefable();
      case "igglybuff":
        return new Pokemon.Igglybuff();
      case "jigglypuff":
        return new Pokemon.Jigglypuff();
      case "wigglytuff":
        return new Pokemon.Wigglytuff();
      case "caterpie":
        return new Pokemon.Caterpie();
      case "metapod":
        return new Pokemon.Metapod();
      case "butterfree":
        return new Pokemon.Butterfree();
      case "weedle":
        return new Pokemon.Weedle();
      case "kakuna":
        return new Pokemon.Kakuna();
      case "beedrill":
        return new Pokemon.Beedrill();
      case "pidgey":
        return new Pokemon.Pidgey();
      case "pidgeotto":
        return new Pokemon.Pidgeotto();
      case "pidgeot":
        return new Pokemon.Pidgeot();
      case "hoppip":
        return new Pokemon.Hoppip();
      case "skiploom":
        return new Pokemon.Skiploom();
      case "jumpluff":
        return new Pokemon.Jumpluff();
      case "seedot":
        return new Pokemon.Seedot();
      case "nuzleaf":
        return new Pokemon.Nuzleaf();
      case "shiftry":
        return new Pokemon.Shiftry();
      case "starly":
        return new Pokemon.Starly();
      case "staravia":
        return new Pokemon.Staravia();
      case "staraptor":
        return new Pokemon.Staraptor();
      default:
        break;
    }
  }
}

module.exports = PokemonFactory;