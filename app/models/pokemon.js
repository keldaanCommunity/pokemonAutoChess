const TYPE = require("./enum").TYPE;
const RARITY = require("./enum").RARITY;
const COST = require("./enum").COST;
const schema = require("@colyseus/schema");
const Schema = schema.Schema;
const uniqid = require("uniqid");

class Pokemon extends schema.Schema {
  constructor(name, type, rarity, index, evolution) {
    super();
    this.id = uniqid();
    this.name = name;
    this.type = type;
    this.rarity = rarity;
    this.index = index;
    this.evolution = evolution;
    this.positionX = 0;
    this.positionY = 0;
    this.cost = COST[rarity];
  }

  setPosition(x, y) {
    this.positionX = x;
    this.positionY = y;
  }

  toString() {
    return `Pokemon (Name: ${this.name}, HP:${this.stats.HP}, (x: ${this.positionX}, y: ${this.positionY}))`
  }
}

class Bulbasaur extends Pokemon {
  constructor() {
    super("bulbasaur", TYPE.GRASS, RARITY.COMMON, 1, "ivysaur");
  }
}

class Ivysaur extends Pokemon {
  constructor() {
    super("ivysaur", TYPE.GRASS, RARITY.COMMON, 2, "venusaur");
  }
}

class Venusaur extends Pokemon {
  constructor() {
    super("venusaur", TYPE.GRASS, RARITY.COMMON, 3, "");
  }
}

class Charmander extends Pokemon {
  constructor() {
    super("charmander", TYPE.FIRE, RARITY.COMMON, 4, "charmeleon");
  }
}

class Charmeleon extends Pokemon {
  constructor() {
    super("charmeleon", TYPE.FIRE, RARITY.COMMON, 5, "charizard");
  }
}

class Charizard extends Pokemon {
  constructor() {
    super("charizard", TYPE.FIRE, RARITY.COMMON, 6, "");
  }
}

class Squirtle extends Pokemon {
  constructor() {
    super("squirtle", TYPE.WATER, RARITY.COMMON, 7, "wartortle");
  }
}

class Wartortle extends Pokemon {
  constructor() {
    super("charmeleon", TYPE.WATER, RARITY.COMMON, 8, "blastoise");
  }
}

class Blastoise extends Pokemon {
  constructor() {
    super("charizard", TYPE.WATER, RARITY.COMMON, 9, "");
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
  cost: "number"
});

module.exports = { Bulbasaur, Ivysaur, Venusaur, Charmander, Charmeleon, Charizard, Squirtle, Wartortle, Blastoise, Pokemon };