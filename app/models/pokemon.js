const TYPE = require("./enum").TYPE;
const RARITY = require("./enum").RARITY;
const COST = require("./enum").COST;
const schema = require("@colyseus/schema");
const Schema = schema.Schema;
const uniqid = require("uniqid");

class Pokemon extends Schema {
  constructor(name, type, rarity, index, evolution, hp, atk, range, attackSprite) {
    super();
    this.id = uniqid();
    this.name = name;
    this.type = type;
    this.rarity = rarity;
    this.index = index;
    this.evolution = evolution;
    this.positionX = -1;
    this.positionY = -1;
    this.cost = COST[rarity];
    this.hp = hp;
    this.atk = atk;
    this.range = range;
    this.attackSprite = attackSprite;
  }

  setPosition(x, y) {
    this.positionX = x;
    this.positionY = y;
  }

  toString() {
    return `Pokemon (Name: ${this.name}, (x: ${this.positionX}, y: ${this.positionY}))`
  }
}

class Riolu extends Pokemon {
  constructor() {
    super("riolu", TYPE.FIGHTING, RARITY.LEGENDARY, 447, "lucario", 10, 1, 3, "FIGHTING/range");
  }
}

class Lucario extends Pokemon {
  constructor() {
    super("lucario", TYPE.FIGHTING, RARITY.LEGENDARY, 448, "", 20, 2, 3, "FIGHTING/range");
  }
}

class Scyther extends Pokemon {
  constructor() {
    super("scyther", TYPE.BUG, RARITY.LEGENDARY, 123, "scizor", 10, 1, 1, "NORMAL/melee");
  }
}

class Scizor extends Pokemon {
  constructor() {
    super("scizor", TYPE.BUG, RARITY.LEGENDARY, 212, "", 20, 2, 1, "NORMAL/melee");
  }
}

class Onix extends Pokemon {
  constructor() {
    super("onix", TYPE.ROCK, RARITY.LEGENDARY, 95, "steelix", 10, 1, 1, "ROCK/melee");
  }
}

class Steelix extends Pokemon {
  constructor() {
    super("steelix", TYPE.ROCK, RARITY.LEGENDARY, 208, "", 20, 2, 1, "ROCK/melee");
  }
}

class Growlithe extends Pokemon {
  constructor() {
    super("growlithe", TYPE.FIRE, RARITY.LEGENDARY, 58, "arcanine", 10, 1, 1, "FIRE/melee");
  }
}

class Arcanine  extends Pokemon {
  constructor() {
    super("arcanine", TYPE.FIRE, RARITY.LEGENDARY, 59, "", 20, 2, 1, "FIRE/melee");
  }
}

class Munchlax  extends Pokemon {
  constructor() {
    super("munchlax", TYPE.NORMAL, RARITY.LEGENDARY, 446, "snorlax", 10, 1, 1, "NORMAL/melee");
  }
}

class Snorlax  extends Pokemon {
  constructor() {
    super("snorlax", TYPE.NORMAL, RARITY.LEGENDARY, 143, "", 20, 2, 1, "NORMAL/melee");
  }
}

class Magby extends Pokemon {
  constructor() {
    super("magby", TYPE.FIRE, RARITY.EPIC, 240, "magmar", 10, 1, 3, "FIRE/range");
  }
}

class Magmar extends Pokemon {
  constructor() {
    super("magmar", TYPE.FIRE, RARITY.EPIC, 126, "magmortar", 20, 2, 3, "FIRE/range");
  }
}

class Magmortar extends Pokemon {
  constructor() {
    super("magmortar", TYPE.FIRE, RARITY.EPIC, 467, "", 30, 3, 3, "FIRE/range");
  }
}

class Elekid  extends Pokemon {
  constructor() {
    super("elekid", TYPE.ELECTRIC, RARITY.EPIC, 239, "electabuzz", 10, 1, 1, "ELECTRIC/melee");
  }
}

class Electabuzz  extends Pokemon {
  constructor() {
    super("electabuzz", TYPE.ELECTRIC, RARITY.EPIC, 125, "electivire", 20, 2, 1, "ELECTRIC/melee");
  }
}

class Electivire   extends Pokemon {
  constructor() {
    super("electivire", TYPE.ELECTRIC, RARITY.EPIC, 466, "", 30, 3, 1, "ELECTRIC/melee");
  }
}

class Gible extends Pokemon {
  constructor() {
    super("gible", TYPE.DRAGON, RARITY.EPIC, 443, "gabite", 10, 1, 1, "DRAGON/melee");
  }
}

class Gabite extends Pokemon {
  constructor() {
    super("gabite", TYPE.DRAGON, RARITY.EPIC, 444, "garchomp", 20, 2, 1, "DRAGON/melee");
  }
}

class Garchomp  extends Pokemon {
  constructor() {
    super("garchomp", TYPE.DRAGON, RARITY.EPIC, 445, "", 30, 3, 1, "DRAGON/melee");
  }
}

class Beldum  extends Pokemon {
  constructor() {
    super("bagon", TYPE.STEEL, RARITY.EPIC, 374, "shelgon", 10, 1, 1, "DRAGON/melee");
  }
}

class Metang  extends Pokemon {
  constructor() {
    super("shelgon", TYPE.STEEL, RARITY.EPIC, 375, "salamence", 20, 2, 1, "DRAGON/melee");
  }
}

class Metagross  extends Pokemon {
  constructor() {
    super("salamence", TYPE.STEEL, RARITY.EPIC, 376, "", 30, 3, 1, "DRAGON/melee");
  }
}

class Bagon extends Pokemon {
  constructor() {
    super("bagon", TYPE.DRAGON, RARITY.EPIC, 371, "shelgon", 10, 1, 3, "FIRE/range");
  }
}

class Shelgon extends Pokemon {
  constructor() {
    super("shelgon", TYPE.DRAGON, RARITY.EPIC, 372, "salamence", 20, 2, 3, "FIRE/range");
  }
}

class Salamence extends Pokemon {
  constructor() {
    super("salamence", TYPE.DRAGON, RARITY.EPIC, 373, "", 30, 3, 3, "FIRE/range");
  }
}

class Ralts  extends Pokemon {
  constructor() {
    super("ralts", TYPE.PSYCHIC, RARITY.EPIC, 280, "kirlia", 10, 1, 3, "PSYCHIC/range");
  }
}

class Kirlia  extends Pokemon {
  constructor() {
    super("kirlia", TYPE.PSYCHIC, RARITY.EPIC, 281, "gardevoir", 20, 2, 3, "PSYCHIC/range");
  }
}

class Gardevoir  extends Pokemon {
  constructor() {
    super("gardevoir", TYPE.PSYCHIC, RARITY.EPIC, 282, "", 30, 3, 3, "PSYCHIC/range");
  }
}

class Slakoth extends Pokemon {
  constructor() {
    super("slakoth", TYPE.NORMAL, RARITY.EPIC, 287, "vigoroth", 10, 1, 1, "NORMAL/melee");
  }
}

class Vigoroth extends Pokemon {
  constructor() {
    super("vigoroth", TYPE.NORMAL, RARITY.EPIC, 288, "slaking", 20, 2, 1, "NORMAL/melee");
  }
}

class Slaking extends Pokemon {
  constructor() {
    super("slaking", TYPE.NORMAL, RARITY.EPIC, 289, "", 30, 3, 1, "NORMAL/melee");
  }
}

class Larvitar extends Pokemon {
  constructor() {
    super("larvitar", TYPE.ROCK, RARITY.EPIC, 246, "pupitar", 10, 1, 1, "ROCK/melee");
  }
}

class Pupitar extends Pokemon {
  constructor() {
    super("pupitar", TYPE.ROCK, RARITY.EPIC, 247, "tyranitar", 20, 2, 1, "ROCK/melee");
  }
}

class Tyranitar extends Pokemon {
  constructor() {
    super("tyranitar", TYPE.ROCK, RARITY.EPIC, 248, "", 30, 3, 1, "ROCK/melee");
  }
}

class Dratini extends Pokemon {
  constructor() {
    super("dratini", TYPE.DRAGON, RARITY.EPIC, 147, "dragonair", 10, 1, 1, "DRAGON/melee");
  }
}

class Dragonair  extends Pokemon {
  constructor() {
    super("dragonair", TYPE.DRAGON, RARITY.EPIC, 148, "dragonite", 20, 2, 1, "DRAGON/melee");
  }
}

class Dragonite  extends Pokemon {
  constructor() {
    super("dragonite", TYPE.DRAGON, RARITY.EPIC, 149, "", 30, 3, 1, "DRAGON/melee");
  }
}

class Gastly  extends Pokemon {
  constructor() {
    super("gastly", TYPE.GHOST, RARITY.EPIC, 92, "haunter", 10, 1, 3, "GHOST/range");
  }
}

class Haunter extends Pokemon {
  constructor() {
    super("haunter", TYPE.GHOST, RARITY.EPIC, 93, "gengar", 20, 2, 3, "GHOST/range");
  }
}

class Gengar extends Pokemon {
  constructor() {
    super("gengar", TYPE.GHOST, RARITY.EPIC, 94, "", 30, 3, 3, "GHOST/range");
  }
}

class Abra  extends Pokemon {
  constructor() {
    super("abra", TYPE.PSYCHIC, RARITY.EPIC, 63, "kadabra", 10, 1, 4, "PSYCHIC/range");
  }
}

class Kadabra extends Pokemon {
  constructor() {
    super("kadabra", TYPE.PSYCHIC, RARITY.EPIC, 64, "alakazam", 20, 2, 4, "PSYCHIC/range");
  }
}

class Alakazam extends Pokemon {
  constructor() {
    super("alakazam", TYPE.PSYCHIC, RARITY.EPIC, 65, "", 30, 3, 4, "PSYCHIC/range");
  }
}

class Poliwag extends Pokemon {
  constructor() {
    super("poliwag", TYPE.WATER, RARITY.RARE, 60, "poliwhirl", 10, 1, 3, "WATER/range");
  }
}

class Poliwhirl extends Pokemon {
  constructor() {
    super("poliwhirl", TYPE.WATER, RARITY.RARE, 61, "politoed", 20, 2, 3, "WATER/range");
  }
}

class Politoed extends Pokemon {
  constructor() {
    super("politoed", TYPE.WATER, RARITY.RARE, 186, "", 30, 3, 3, "WATER/range");
  }
}

class Shinx  extends Pokemon {
  constructor() {
    super("shinx", TYPE.ELECTRIC, RARITY.RARE, 403, "luxio", 10, 1, 1, "ELECTRIC/melee");
  }
}

class Luxio  extends Pokemon {
  constructor() {
    super("luxio", TYPE.ELECTRIC, RARITY.RARE, 404, "luxray", 20, 2, 1, "ELECTRIC/melee");
  }
}

class Luxray  extends Pokemon {
  constructor() {
    super("luxray", TYPE.ELECTRIC, RARITY.RARE, 405, "", 30, 3, 1, "ELECTRIC/melee");
  }
}

class Lotad extends Pokemon {
  constructor() {
    super("lotad", TYPE.GRASS, RARITY.RARE, 270, "lombre", 10, 1, 3, "GRASS/range");
  }
}

class Lombre extends Pokemon {
  constructor() {
    super("lombre", TYPE.GRASS, RARITY.RARE, 271, "ludicolo", 20, 2, 3, "GRASS/range");
  }
}

class Ludicolo extends Pokemon {
  constructor() {
    super("ludicolo", TYPE.GRASS, RARITY.RARE, 272, "", 30, 3, 3, "GRASS/range");
  }
}

class Duskull  extends Pokemon {
  constructor() {
    super("duskull", TYPE.GHOST, RARITY.RARE, 355, "dusclops", 10, 1, 3, "GHOST/range");
  }
}

class Dusclops  extends Pokemon {
  constructor() {
    super("dusclops", TYPE.GHOST, RARITY.RARE, 356, "dusknoir", 20, 2, 3, "GHOST/range");
  }
}

class Dusknoir  extends Pokemon {
  constructor() {
    super("dusknoir", TYPE.GHOST, RARITY.RARE, 477, "", 30, 3, 3, "GHOST/range");
  }
}

class Togepi extends Pokemon {
  constructor() {
    super("togepi", TYPE.FLYING, RARITY.RARE, 175, "togetic", 10, 1, 3, "FLYING/range");
  }
}

class Togetic extends Pokemon {
  constructor() {
    super("togetic", TYPE.FLYING, RARITY.RARE, 176, "togekiss", 20, 2, 3, "FLYING/range");
  }
}

class Togekiss extends Pokemon {
  constructor() {
    super("togekiss", TYPE.FLYING, RARITY.RARE, 468, "", 30, 3, 3, "FLYING/range");
  }
}

class Rhyhorn  extends Pokemon {
  constructor() {
    super("rhyhorn", TYPE.ROCK, RARITY.RARE, 111, "rhydon", 10, 1, 1, "ROCK/melee");
  }
}

class Rhydon  extends Pokemon {
  constructor() {
    super("rhydon", TYPE.ROCK, RARITY.RARE, 112, "rhyperior", 20, 2, 1, "ROCK/melee");
  }
}

class Rhyperior  extends Pokemon {
  constructor() {
    super("rhyperior", TYPE.ROCK, RARITY.RARE, 464, "", 30, 3, 1, "ROCK/melee");
  }
}

class Magnemite extends Pokemon {
  constructor() {
    super("magnemite", TYPE.ELECTRIC, RARITY.RARE, 81, "magneton", 10, 1, 3, "ELECTRIC/range");
  }
}

class Magneton extends Pokemon {
  constructor() {
    super("magneton", TYPE.ELECTRIC, RARITY.RARE, 82, "magnezone", 20, 2, 3, "ELECTRIC/range");
  }
}

class Magnezone extends Pokemon {
  constructor() {
    super("magnezone", TYPE.ELECTRIC, RARITY.RARE, 462, "", 30, 3, 3, "ELECTRIC/range");
  }
}

class Aron extends Pokemon {
  constructor() {
    super("aron", TYPE.ROCK, RARITY.RARE, 304, "lairon", 10, 1, 1, "ROCK/melee");
  }
}

class Lairon extends Pokemon {
  constructor() {
    super("lairon", TYPE.ROCK, RARITY.RARE, 305, "aggron", 20, 2, 1, "ROCK/melee");
  }
}

class Aggron extends Pokemon {
  constructor() {
    super("aggron", TYPE.ROCK, RARITY.RARE, 306, "", 30, 3, 1, "ROCK/melee");
  }
}

class Spheal  extends Pokemon {
  constructor() {
    super("spheal", TYPE.ICE, RARITY.RARE, 363, "sealeo", 10, 1, 1, "ICE/melee");
  }
}

class Sealeo  extends Pokemon {
  constructor() {
    super("sealeo", TYPE.ICE, RARITY.RARE, 364, "walrein", 20, 2, 1, "ICE/melee");
  }
}

class Walrein  extends Pokemon {
  constructor() {
    super("walrein", TYPE.ICE, RARITY.RARE, 365, "", 30, 3, 1, "ICE/melee");
  }
}

class Trapinch extends Pokemon {
  constructor() {
    super("trapinch", TYPE.DRAGON, RARITY.RARE, 328, "vibrava", 10, 1, 1, "DRAGON/melee");
  }
}

class Vibrava extends Pokemon {
  constructor() {
    super("vibrava", TYPE.DRAGON, RARITY.RARE, 329, "flygon", 20, 2, 1, "DRAGON/melee");
  }
}

class Flygon extends Pokemon {
  constructor() {
    super("flygon", TYPE.DRAGON, RARITY.RARE, 330, "", 30, 3, 1, "DRAGON/melee");
  }
}

class Horsea  extends Pokemon {
  constructor() {
    super("horsea", TYPE.WATER, RARITY.RARE, 116, "seadra", 10, 1, 3, "WATER/range");
  }
}

class Seadra extends Pokemon {
  constructor() {
    super("seadra", TYPE.WATER, RARITY.RARE, 117, "kingdra", 20, 2, 3, "WATER/range");
  }
}

class Kingdra  extends Pokemon {
  constructor() {
    super("kingdra", TYPE.WATER, RARITY.RARE, 230, "", 30, 3, 3, "WATER/range");
  }
}

class Machop extends Pokemon {
  constructor() {
    super("machop", TYPE.FIGHTING, RARITY.RARE, 66, "machoke", 10, 1, 1, "FIGHTING/melee");
  }
}

class Machoke   extends Pokemon {
  constructor() {
    super("machoke", TYPE.FIGHTING, RARITY.RARE, 67, "machamp", 20, 2, 1, "FIGHTING/melee");
  }
}

class Machamp   extends Pokemon {
  constructor() {
    super("machamp", TYPE.FIGHTING, RARITY.RARE, 68, "", 30, 3, 1, "FIGHTING/melee");
  }
}

class Pichu extends Pokemon {
  constructor() {
    super("pichu", TYPE.ELECTRIC, RARITY.RARE, 172, "pikachu", 10, 1, 3, "ELECTRIC/range");
  }
}

class Pikachu  extends Pokemon {
  constructor() {
    super("pikachu", TYPE.ELECTRIC, RARITY.RARE, 25, "raichu", 20, 2, 3, "ELECTRIC/range");
  }
}

class Raichu  extends Pokemon {
  constructor() {
    super("raichu", TYPE.ELECTRIC, RARITY.RARE, 26, "", 30, 3, 3, "ELECTRIC/range");
  }
}

class Bulbasaur extends Pokemon {
  constructor() {
    super("bulbasaur", TYPE.GRASS, RARITY.UNCOMMON, 1, "ivysaur", 10, 1, 3, "GRASS/range");
  }
}

class Ivysaur extends Pokemon {
  constructor() {
    super("ivysaur", TYPE.GRASS, RARITY.UNCOMMON, 2, "venusaur", 20, 2, 3, "GRASS/range");
  }
}

class Venusaur extends Pokemon {
  constructor() {
    super("venusaur", TYPE.GRASS, RARITY.UNCOMMON, 3, "", 30, 3, 3, "GRASS/range");
  }
}

class Chikorita extends Pokemon {
  constructor() {
    super("chikorita", TYPE.GRASS, RARITY.UNCOMMON, 152, "bayleef", 10, 1, 3, "GRASS/range");
  }
}

class Bayleef extends Pokemon {
  constructor() {
    super("bayleef", TYPE.GRASS, RARITY.UNCOMMON, 153, "meganium", 20, 2, 3, "GRASS/range");
  }
}

class Meganium extends Pokemon {
  constructor() {
    super("meganium", TYPE.GRASS, RARITY.UNCOMMON, 154, "", 30, 3, 3, "GRASS/range");
  }
}

class NidoranF extends Pokemon {
  constructor() {
    super("nidoranF", TYPE.POISON, RARITY.UNCOMMON, 29, "nidorina", 10, 1, 1, "POISON/melee");
  }
}

class Nidorina extends Pokemon {
  constructor() {
    super("nidorina", TYPE.POISON, RARITY.UNCOMMON, 30, "nidoqueen", 20, 2, 1, "POISON/melee");
  }
}

class Nidoqueen extends Pokemon {
  constructor() {
    super("nidoqueen", TYPE.POISON, RARITY.UNCOMMON, 31, "", 30, 3, 1, "POISON/melee");
  }
}

class NidoranM extends Pokemon {
  constructor() {
    super("nidoranM", TYPE.POISON, RARITY.UNCOMMON, 32, "nidorino", 10, 1, 1, "POISON/melee");
  }
}

class Nidorino extends Pokemon {
  constructor() {
    super("nidorino", TYPE.POISON, RARITY.UNCOMMON, 33, "nidoking", 20, 2, 1, "POISON/melee");
  }
}

class Nidoking extends Pokemon {
  constructor() {
    super("nidoking", TYPE.POISON, RARITY.UNCOMMON, 34, "", 30, 3, 1, "POISON/melee");
  }
}

class Piplup extends Pokemon {
  constructor() {
    super("piplup", TYPE.WATER, RARITY.UNCOMMON, 393, "prinplup", 10, 1, 1, "WATER/melee");
  }
}

class Prinplup  extends Pokemon {
  constructor() {
    super("prinplup", TYPE.WATER, RARITY.UNCOMMON, 394, "empoleon", 20, 2, 1, "WATER/melee");
  }
}

class Empoleon  extends Pokemon {
  constructor() {
    super("empoleon", TYPE.WATER, RARITY.UNCOMMON, 395, "", 30, 3, 1, "WATER/melee");
  }
}

class Chimchar  extends Pokemon {
  constructor() {
    super("chimchar", TYPE.FIRE, RARITY.UNCOMMON, 390, "monferno", 10, 1, 1, "FIRE/melee");
  }
}

class Monferno  extends Pokemon {
  constructor() {
    super("monferno", TYPE.FIRE, RARITY.UNCOMMON, 391, "infernape", 20, 2, 1, "FIRE/melee");
  }
}

class Infernape  extends Pokemon {
  constructor() {
    super("infernape", TYPE.FIRE, RARITY.UNCOMMON, 392, "", 30, 3, 1, "FIRE/melee");
  }
}

class Turtwig  extends Pokemon {
  constructor() {
    super("turtwig", TYPE.GRASS, RARITY.UNCOMMON, 387, "grotle", 10, 1, 1, "GRASS/melee");
  }
}

class Grotle  extends Pokemon {
  constructor() {
    super("grotle", TYPE.GRASS, RARITY.UNCOMMON, 388, "torterra", 20, 2, 1, "GRASS/melee");
  }
}

class Torterra  extends Pokemon {
  constructor() {
    super("torterra", TYPE.GRASS, RARITY.UNCOMMON, 389, "", 30, 3, 1, "GRASS/melee");
  }
}

class Mudkip extends Pokemon {
  constructor() {
    super("mudkip", TYPE.WATER, RARITY.UNCOMMON, 258, "marshtomp", 10, 1, 1, "WATER/melee");
  }
}

class Marshtomp extends Pokemon {
  constructor() {
    super("marshtomp", TYPE.WATER, RARITY.UNCOMMON, 259, "swampert", 20, 2, 1, "WATER/melee");
  }
}

class Swampert extends Pokemon {
  constructor() {
    super("swampert", TYPE.WATER, RARITY.UNCOMMON, 260, "", 30, 3, 1, "WATER/melee");
  }
}

class Torchic extends Pokemon {
  constructor() {
    super("torchic", TYPE.FIRE, RARITY.UNCOMMON, 255, "combusken", 10, 1, 1, "FIRE/melee");
  }
}

class Combusken extends Pokemon {
  constructor() {
    super("combusken", TYPE.FIRE, RARITY.UNCOMMON, 256, "blaziken", 20, 2, 1, "FIRE/melee");
  }
}

class Blaziken extends Pokemon {
  constructor() {
    super("blaziken", TYPE.FIRE, RARITY.UNCOMMON, 257, "", 30, 3, 1, "FIRE/melee");
  }
}

class Treecko extends Pokemon {
  constructor() {
    super("treecko", TYPE.GRASS, RARITY.UNCOMMON, 252, "grovyle", 10, 1, 1, "GRASS/melee");
  }
}

class Grovyle extends Pokemon {
  constructor() {
    super("grovyle", TYPE.GRASS, RARITY.UNCOMMON, 253, "sceptile", 20, 2, 1, "GRASS/melee");
  }
}

class Sceptile extends Pokemon {
  constructor() {
    super("sceptile", TYPE.GRASS, RARITY.UNCOMMON, 254, "", 30, 3, 1, "GRASS/melee");
  }
}

class Totodile extends Pokemon {
  constructor() {
    super("totodile", TYPE.WATER, RARITY.UNCOMMON, 158, "croconaw", 10, 1, 1, "WATER/melee");
  }
}

class Croconaw extends Pokemon {
  constructor() {
    super("croconaw", TYPE.WATER, RARITY.UNCOMMON, 159, "feraligatr", 20, 2, 1, "WATER/melee");
  }
}

class Feraligatr extends Pokemon {
  constructor() {
    super("feraligatr", TYPE.WATER, RARITY.UNCOMMON, 160, "", 30, 3, 1, "WATER/melee");
  }
}

class Cyndaquil extends Pokemon {
  constructor() {
    super("cyndaquil", TYPE.FIRE, RARITY.UNCOMMON, 155, "quilava", 10, 1, 3, "FIRE/range");
  }
}

class Quilava extends Pokemon {
  constructor() {
    super("quilava", TYPE.FIRE, RARITY.UNCOMMON, 156, "typhlosion", 20, 2, 3, "FIRE/range");
  }
}

class Typhlosion extends Pokemon {
  constructor() {
    super("typhlosion", TYPE.FIRE, RARITY.UNCOMMON, 157, "", 30, 3, 3, "FIRE/range");
  }
}

class Charmander extends Pokemon {
  constructor() {
    super("charmander", TYPE.FIRE, RARITY.COMMON, 4, "charmeleon", 10, 1, 1, "FIRE/melee");
  }
}

class Charmeleon extends Pokemon {
  constructor() {
    super("charmeleon", TYPE.FIRE, RARITY.COMMON, 5, "charizard", 20, 2, 1, "FIRE/melee");
  }
}

class Charizard extends Pokemon {
  constructor() {
    super("charizard", TYPE.FIRE, RARITY.COMMON, 6, "", 30, 3, 1, "FIRE/melee");
  }
}

class Squirtle extends Pokemon {
  constructor() {
    super("squirtle", TYPE.WATER, RARITY.COMMON, 7, "wartortle", 10, 1, 2, "WATER/range");
  }
}

class Wartortle extends Pokemon {
  constructor() {
    super("charmeleon", TYPE.WATER, RARITY.COMMON, 8, "blastoise", 20 ,2, 2, "WATER/range");
  }
}

class Blastoise extends Pokemon {
  constructor() {
    super("charizard", TYPE.WATER, RARITY.COMMON, 9, "", 30, 3, 2, "WATER/range");
  }
}

class Geodude extends Pokemon {
  constructor() {
    super("geodude", TYPE.ROCK, RARITY.COMMON, 74, "graveler", 10, 1, 1, "ROCK/melee");
  }
}

class Graveler extends Pokemon {
  constructor() {
    super("graveler", TYPE.ROCK, RARITY.COMMON, 75, "golem", 20 ,2, 1, "ROCK/melee");
  }
}

class Golem extends Pokemon {
  constructor() {
    super("golem", TYPE.ROCK, RARITY.COMMON, 76, "", 30, 3, 1, "ROCK/melee");
  }
}

class Azurill extends Pokemon {
  constructor() {
    super("azurill", TYPE.WATER, RARITY.COMMON, 298, "marill", 10, 1, 2, "WATER/range");
  }
}

class Marill extends Pokemon {
  constructor() {
    super("marill", TYPE.WATER, RARITY.COMMON, 183, "azumarill", 20 ,2, 2, "WATER/range");
  }
}

class Azumarill extends Pokemon {
  constructor() {
    super("azumarill", TYPE.WATER, RARITY.COMMON, 184, "", 30, 3, 2, "WATER/range");
  }
}

class Zubat extends Pokemon {
  constructor() {
    super("zubat", TYPE.POISON, RARITY.COMMON, 41, "golbat", 10, 1, 4, "PSYCHIC/range");
  }
}

class Golbat extends Pokemon {
  constructor() {
    super("golbat", TYPE.POISON, RARITY.COMMON, 42, "crobat", 20 ,2, 4, "PSYCHIC/range");
  }
}

class Crobat extends Pokemon {
  constructor() {
    super("crobat", TYPE.POISON, RARITY.COMMON, 169, "", 30, 3, 4, "PSYCHIC/range");
  }
}

class Mareep extends Pokemon {
  constructor() {
    super("mareep", TYPE.ELECTRIC, RARITY.COMMON, 179, "flaffy", 10, 1, 2, "ELECTRIC/range");
  }
}

class Flaffy extends Pokemon {
  constructor() {
    super("flaffy", TYPE.ELECTRIC, RARITY.COMMON, 180, "ampharos", 20 ,2, 2, "ELECTRIC/range");
  }
}

class Ampharos extends Pokemon {
  constructor() {
    super("ampharos", TYPE.ELECTRIC, RARITY.COMMON, 181, "", 30, 3, 2, "ELECTRIC/range");
  }
}

class Cleffa extends Pokemon {
  constructor() {
    super("cleffa", TYPE.FAIRY, RARITY.COMMON, 173, "clefairy", 10, 1, 1, "FAIRY/melee");
  }
}

class Clefairy extends Pokemon {
  constructor() {
    super("clefairy", TYPE.FAIRY, RARITY.COMMON, 35, "clefable", 20 ,2, 1, "FAIRY/melee");
  }
}

class Clefable extends Pokemon {
  constructor() {
    super("clefable", TYPE.FAIRY, RARITY.COMMON, 36, "", 30, 3, 1, "FAIRY/melee");
  }
}

class Igglybuff extends Pokemon {
  constructor() {
    super("igglybuff", TYPE.FAIRY, RARITY.COMMON, 174, "jigglypuff", 10, 1, 3, "FAIRY/range");
  }
}

class Jigglypuff extends Pokemon {
  constructor() {
    super("jigglypuff", TYPE.FAIRY, RARITY.COMMON, 39, "wigglytuff", 20 ,2, 3, "FAIRY/range");
  }
}

class Wigglytuff extends Pokemon {
  constructor() {
    super("wigglytuff", TYPE.FAIRY, RARITY.COMMON, 40, "", 30, 3, 3, "FAIRY/range");
  }
}

class Caterpie extends Pokemon {
  constructor() {
    super("caterpie", TYPE.BUG, RARITY.COMMON, 10, "metapod", 10 ,2, 2, "POISON/range");
  }
}

class Metapod extends Pokemon {
  constructor() {
    super("metapod", TYPE.BUG, RARITY.COMMON, 11, "butterfree", 20, 3, 2, "POISON/range");
  }
}

class Butterfree extends Pokemon {
  constructor() {
    super("butterfree", TYPE.BUG, RARITY.COMMON, 12, "", 30, 3, 2, "POISON/range");
  }
}

class Weedle extends Pokemon {
  constructor() {
    super("weedle", TYPE.BUG, RARITY.COMMON, 13, "kakuna", 10 ,2, 1, "BUG/melee");
  }
}

class Kakuna extends Pokemon {
  constructor() {
    super("kakuna", TYPE.BUG, RARITY.COMMON, 14, "beedrill", 20, 3, 1, "BUG/melee");
  }
}

class Beedrill extends Pokemon {
  constructor() {
    super("beedrill", TYPE.BUG, RARITY.COMMON, 15, "", 30, 3, 1, "BUG/melee");
  }
}


class Pidgey extends Pokemon {
  constructor() {
    super("pidgey", TYPE.FLYING, RARITY.COMMON, 16, "pidgeotto", 10 ,2, 3, "FLYING/range");
  }
}

class Pidgeotto extends Pokemon {
  constructor() {
    super("pidgeotto", TYPE.FLYING, RARITY.COMMON, 17, "pidgeot", 20, 3, 3, "FLYING/range");
  }
}

class Pidgeot extends Pokemon {
  constructor() {
    super("pidgeot", TYPE.FLYING, RARITY.COMMON, 18, "", 30, 3, 3, "FLYING/range");
  }
}

class Hoppip extends Pokemon {
  constructor() {
    super("hoppip", TYPE.GRASS, RARITY.COMMON, 187, "skiploom", 10 ,2, 3, "FLYING/range");
  }
}

class Skiploom extends Pokemon {
  constructor() {
    super("skiploom", TYPE.GRASS, RARITY.COMMON, 188, "jumpluff", 20, 3, 3, "FLYING/range");
  }
}

class Jumpluff extends Pokemon {
  constructor() {
    super("jumpluff", TYPE.GRASS, RARITY.COMMON, 189, "", 30, 3, 3, "FLYING/range");
  }
}

class Seedot extends Pokemon {
  constructor() {
    super("seedot", TYPE.GRASS, RARITY.COMMON, 273, "nuzleaf", 10 ,2, 1, "GRASS/melee");
  }
}

class Nuzleaf extends Pokemon {
  constructor() {
    super("nuzleaf", TYPE.GRASS, RARITY.COMMON, 274, "shiftry", 20, 3, 1, "GRASS/melee");
  }
}

class Shiftry extends Pokemon {
  constructor() {
    super("shiftry", TYPE.GRASS, RARITY.COMMON, 275, "", 30, 3, 1, "GRASS/melee");
  }
}

class Starly extends Pokemon {
  constructor() {
    super("starly", TYPE.FLYING, RARITY.COMMON, 396, "staravia", 10 ,2, 1, "FLYING/melee");
  }
}

class Staravia extends Pokemon {
  constructor() {
    super("staravia", TYPE.FLYING, RARITY.COMMON, 397, "staraptor", 20, 3, 1, "FLYING/melee");
  }
}

class Staraptor extends Pokemon {
  constructor() {
    super("staraptor", TYPE.FLYING, RARITY.COMMON, 398, "", 30, 3, 1, "FLYING/melee");
  }
}
schema.defineTypes(Pokemon, {
  id: "string",
  name: "string",
  type: "string",
  rarity: "string",
  index: "number",
  evolution: "string",
  positionX: "number",
  positionY: "number",
  cost: "number",
  attackSprite: "string"
});

module.exports = {
  Pokemon
   , Bulbasaur
   , Ivysaur
   , Venusaur
   , Charmander
   , Charmeleon
   , Charizard
   , Squirtle
   , Wartortle
   , Blastoise
   , Geodude
   , Graveler
   , Golem
   , Azurill
   , Marill
   , Azumarill
   , Zubat
   , Golbat
   , Crobat
   , Mareep
   , Flaffy
   , Ampharos
   , Cleffa
   , Clefairy
   , Clefable
   , Igglybuff
   , Wigglytuff
   , Jigglypuff
   , Caterpie
   , Metapod
   , Butterfree
   , Weedle
   , Kakuna
   , Beedrill
   , Pidgey
   , Pidgeotto
   , Pidgeot
   , Hoppip
   , Skiploom
   , Jumpluff
   , Seedot
   , Nuzleaf
   , Shiftry
   , Starly
   , Staravia
   , Staraptor
   , Chikorita
   , Bayleef
   , Meganium
   , Cyndaquil
   , Quilava
   , Typhlosion
   , Totodile
   , Croconaw
   , Feraligatr
   , Treecko
   , Grovyle
   , Sceptile
   , Torchic
   , Combusken
   , Blaziken
   , Mudkip
   , Marshtomp
   , Swampert
   , Turtwig
   , Grotle
   , Torterra
   , Chimchar
   , Monferno
   , Infernape
   , Piplup
   , Prinplup
   , Empoleon
   , NidoranF
   , Nidorina
   , Nidoqueen
   , NidoranM
   , Nidorino
   , Nidoking
   , Pichu
   , Pikachu
   , Raichu
   , Machop
   , Machoke
   , Machamp
   , Horsea
   , Seadra
   , Kingdra
   , Trapinch
   , Vibrava
   , Flygon
   , Spheal
   , Sealeo
   , Walrein
   , Aron
   , Lairon
   , Aggron
   , Magnemite
   , Magneton
   , Magnezone
   , Rhyhorn
   , Rhydon
   , Rhyperior
   , Togepi
   , Togetic
   , Togekiss
   , Duskull
   , Dusclops
   , Dusknoir
   , Lotad
   , Lombre
   , Ludicolo
   , Shinx
   , Luxio
   , Luxray
   , Poliwag
   , Poliwhirl
   , Politoed
   , Abra
   , Kadabra
   , Alakazam
   , Gastly
   , Haunter
   , Gengar
   , Dratini
   , Dragonair
   , Dragonite
   , Larvitar
   , Pupitar
   , Tyranitar
   , Slakoth
   , Vigoroth
   , Slaking
   , Ralts
   , Kirlia
   , Gardevoir
   , Bagon
   , Shelgon
   , Salamence
   , Beldum
   , Metang
   , Metagross
   , Gible
   , Gabite
   , Garchomp
   , Elekid
   , Electabuzz
   , Electivire
   , Magby
   , Magmar
   , Magmortar
   , Munchlax
   , Snorlax
   , Growlithe
   , Arcanine
   , Onix
   , Steelix
   , Scyther
   , Scizor
   , Riolu
   , Lucario
   };