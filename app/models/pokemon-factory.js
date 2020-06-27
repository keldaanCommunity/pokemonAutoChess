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
      case "chikorita":
        return new Pokemon.Chikorita();
      case "bayleef":
        return new Pokemon.Bayleef();
      case "meganium":
        return new Pokemon.Meganium();
      case "cyndaquil":
        return new Pokemon.Cyndaquil();
      case "quilava":
        return new Pokemon.Quilava();
      case "typhlosion":
        return new Pokemon.Typhlosion();
      case "totodile":
        return new Pokemon.Totodile();
      case "croconaw":
        return new Pokemon.Croconaw();
      case "feraligatr":
        return new Pokemon.Feraligatr();
      case "treecko":
        return new Pokemon.Treecko();
      case "grovyle":
        return new Pokemon.Grovyle();
      case "sceptile":
        return new Pokemon.Sceptile();
      case "torchic":
        return new Pokemon.Torchic();
      case "combusken":
        return new Pokemon.Combusken();
      case "blaziken":
        return new Pokemon.Blaziken();
      case "mudkip":
        return new Pokemon.Mudkip();
      case "marshtomp":
        return new Pokemon.Marshtomp();
      case "swampert":
        return new Pokemon.Swampert();    
      case "turtwig":
        return new Pokemon.Turtwig();
      case "grotle":
        return new Pokemon.Grotle();
      case "torterra":
        return new Pokemon.Torterra();
      case "chimchar":
        return new Pokemon.Chimchar();
      case "monferno":
        return new Pokemon.Monferno();
      case "infernape":
        return new Pokemon.Infernape();   
      case "piplup":
        return new Pokemon.Piplup();
      case "prinplup":
        return new Pokemon.Prinplup();
      case "empoleon":
        return new Pokemon.Empoleon();
      case "nidoranF":
        return new Pokemon.NidoranF();
      case "nidorina":
        return new Pokemon.Nidorina();
      case "nidoqueen":
        return new Pokemon.Nidoqueen();
      case "nidoranM":
        return new Pokemon.NidoranM();
      case "nidorino":
        return new Pokemon.Nidorino();
      case "nidoking":
        return new Pokemon.Nidoking();
      case "pichu":
        return new Pokemon.Pichu();
      case "pikachu":
        return new Pokemon.Pikachu();
      case "raichu":
        return new Pokemon.Raichu();
      case "machop":
        return new Pokemon.Machop();
      case "machoke":
        return new Pokemon.Machoke();
      case "machamp":
        return new Pokemon.Machamp();
      case "horsea":
        return new Pokemon.Horsea();
      case "seadra":
        return new Pokemon.Seadra();
      case "kingdra":
        return new Pokemon.Kingdra();
      case "trapinch":
        return new Pokemon.Trapinch();
      case "vibrava":
        return new Pokemon.Vibrava();
      case "flygon":
        return new Pokemon.Flygon();
      case "spheal":
        return new Pokemon.Spheal();
      case "sealeo":
        return new Pokemon.Sealeo();
      case "walrein":
        return new Pokemon.Walrein();
      case "aron":
        return new Pokemon.Aron();
      case "lairon":
        return new Pokemon.Lairon();
      case "aggron":
        return new Pokemon.Aggron();
      case "magnemite":
        return new Pokemon.Magnemite();
      case "magneton":
        return new Pokemon.Magneton();
      case "magnezone":
        return new Pokemon.Magnezone();
      case "rhyhorn":
        return new Pokemon.Rhyhorn();
      case "rhydon":
        return new Pokemon.Rhydon();
      case "rhyperior":
        return new Pokemon.Rhyperior();
      case "togepi":
        return new Pokemon.Togepi();
      case "togetic":
        return new Pokemon.Togetic();
      case "togekiss":
        return new Pokemon.Togekiss();
      case "duskull":
        return new Pokemon.Duskull();
      case "dusclops":
        return new Pokemon.Dusclops();
      case "dusknoir":
        return new Pokemon.Dusknoir();
      case "lotad":
        return new Pokemon.Lotad();
      case "lombre":
        return new Pokemon.Lombre();
      case "ludicolo":
        return new Pokemon.Ludicolo();
      case "shinx":
        return new Pokemon.Shinx();
      case "luxio":
        return new Pokemon.Luxio();
      case "luxray":
        return new Pokemon.Luxray();
      case "poliwag":
        return new Pokemon.Poliwag();
      case "poliwhirl":
        return new Pokemon.Poliwhirl();
      case "politoed":
        return new Pokemon.Politoed();
      case "abra":
        return new Pokemon.Abra();
      case "kadabra":
        return new Pokemon.Kadabra();
      case "alakazam":
        return new Pokemon.Alakazam();
      case "gastly":
        return new Pokemon.Gastly();
      case "haunter":
        return new Pokemon.Haunter();
      case "gengar":
        return new Pokemon.Gengar();
      case "dratini":
        return new Pokemon.Dratini();
      case "dragonair":
        return new Pokemon.Dragonair();
      case "dragonite":
        return new Pokemon.Dragonite();
      case "larvitar":
        return new Pokemon.Larvitar();
      case "pupitar":
        return new Pokemon.Pupitar();
      case "tyranitar":
        return new Pokemon.Tyranitar();
      case "slakoth":
        return new Pokemon.Slakoth();
      case "vigoroth":
        return new Pokemon.Vigoroth();
      case "slaking":
        return new Pokemon.Slaking();
      case "ralts":
        return new Pokemon.Ralts();
      case "kirlia":
        return new Pokemon.Kirlia();
      case "gardevoir":
        return new Pokemon.Gardevoir();
      case "bagon":
        return new Pokemon.Bagon();
      case "shelgon":
        return new Pokemon.Shelgon();
      case "salamence":
        return new Pokemon.Salamence();
      case "beldum":
        return new Pokemon.Beldum();
      case "metang":
        return new Pokemon.Metang();
      case "metagross":
        return new Pokemon.Metagross();
      case "gible":
        return new Pokemon.Gible();
      case "gabite":
        return new Pokemon.Gabite();
      case "garchomp":
        return new Pokemon.Garchomp();
      case "elekid":
        return new Pokemon.Elekid();
      case "electabuzz":
        return new Pokemon.Electabuzz();
      case "electivire":
        return new Pokemon.Electivire();
      case "magby":
        return new Pokemon.Magby();
      case "magmar":
        return new Pokemon.Magmar();
      case "magmortar":
        return new Pokemon.Magmortar();
      case "munchlax":
        return new Pokemon.Munchlax();
      case "snorlax":
        return new Pokemon.Snorlax();
      case "growlithe":
        return new Pokemon.Growlithe();
      case "arcanine":
        return new Pokemon.Arcanine();
      case "onix":
        return new Pokemon.Onix();
      case "steelix":
        return new Pokemon.Steelix();
      case "scyther":
        return new Pokemon.Scyther();
      case "scizor":
        return new Pokemon.Scizor();
      case "riolu":
        return new Pokemon.Riolu();
      case "lucario":
        return new Pokemon.Lucario();
      default:
        console.log(`No pokemon with name "${name}" found`);
        break;
    }
  }
}

module.exports = PokemonFactory;