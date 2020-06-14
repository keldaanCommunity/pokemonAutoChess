const TYPE = require("./enum").TYPE;
const RARITY = require("./enum").RARITY;
const COST = require("./enum").COST;
const schema = require("@colyseus/schema");
const Schema = schema.Schema;
const uniqid = require("uniqid");

class Pokemon extends schema.Schema {
  constructor(name, type, rarity, index, evolution, hp, atk) {
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
    this.hp = hp;
    this.atk = atk;
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
    super("bulbasaur", TYPE.GRASS, RARITY.COMMON, 1, "ivysaur", 10, 1);
  }
}

class Ivysaur extends Pokemon {
  constructor() {
    super("ivysaur", TYPE.GRASS, RARITY.COMMON, 2, "venusaur", 20, 2);
  }
}

class Venusaur extends Pokemon {
  constructor() {
    super("venusaur", TYPE.GRASS, RARITY.COMMON, 3, "", 30, 3);
  }
}

class Charmander extends Pokemon {
  constructor() {
    super("charmander", TYPE.FIRE, RARITY.COMMON, 4, "charmeleon", 10, 1);
  }
}

class Charmeleon extends Pokemon {
  constructor() {
    super("charmeleon", TYPE.FIRE, RARITY.COMMON, 5, "charizard", 20, 2);
  }
}

class Charizard extends Pokemon {
  constructor() {
    super("charizard", TYPE.FIRE, RARITY.COMMON, 6, "", 30, 3);
  }
}

class Squirtle extends Pokemon {
  constructor() {
    super("squirtle", TYPE.WATER, RARITY.COMMON, 7, "wartortle", 10, 1);
  }
}

class Wartortle extends Pokemon {
  constructor() {
    super("charmeleon", TYPE.WATER, RARITY.COMMON, 8, "blastoise", 20 ,2);
  }
}

class Blastoise extends Pokemon {
  constructor() {
    super("charizard", TYPE.WATER, RARITY.COMMON, 9, "", 30, 3);
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