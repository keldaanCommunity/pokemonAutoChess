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

class Bulbasaur extends Pokemon {
  constructor() {
    super("bulbasaur", TYPE.GRASS, RARITY.COMMON, 1, "ivysaur", 10, 1, 3, "GRASS/range");
  }
}

class Ivysaur extends Pokemon {
  constructor() {
    super("ivysaur", TYPE.GRASS, RARITY.COMMON, 2, "venusaur", 20, 2, 3, "GRASS/range");
  }
}

class Venusaur extends Pokemon {
  constructor() {
    super("venusaur", TYPE.GRASS, RARITY.COMMON, 3, "", 30, 3, 3, "GRASS/range");
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
    super("zubat", TYPE.POISON, RARITY.COMMON, 41, "golbat", 10, 1, 4, "POISON/range");
  }
}

class Golbat extends Pokemon {
  constructor() {
    super("golbat", TYPE.POISON, RARITY.COMMON, 42, "Crobat", 20 ,2, 4, "POISON/range");
  }
}

class Crobat extends Pokemon {
  constructor() {
    super("crobat", TYPE.POISON, RARITY.COMMON, 169, "", 30, 3, 4, "POISON/range");
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
   };