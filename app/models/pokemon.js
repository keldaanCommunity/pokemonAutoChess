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
    this.stats = {
      level: 1,
      HP: 45,
      attack: 49,
      defense: 49,
      spAtk: 65,
      spDef: 65,
      speed: 45
    }
    this.baseMove = {
      type: "normal",
      power: 40,
      accuracy: 100
    };
    this.skillMove = {
      type: "normal",
      power: 40,
      accuracy: 100
    };
    this.group = -1;
    this.target = null;
  }

  setPosition(x, y) {
    this.positionX = x;
    this.positionY = y;
  }

  toString() {
    return `Pokemon (Name: ${this.name}, HP:${this.stats.HP}, (x: ${this.positionX}, y: ${this.positionY}))`
  }

  getModifiers(/* ??? */) {
    var m = 1;
    // if multiple targets -> *0.75
    // if weather type == pkmn type -> *1.5 | if weather type != pkmn type -> *0.5
    // critical hit -> *2 (gen 2-5) | *1.5 (gen 6+)
    // random factor -> *[0.85, 1]
    // if move type == pkmn type (STAB) -> *1.5
    // type effectiveness -> *0, *0.25, *0.5, *1, *2, *4
    // if status == burn && physical move -> *0.5
    return m;
  }

  /**
   * https://www.pokepedia.fr/Calcul_des_d%C3%A9g%C3%A2ts
   * @param {*} level level of attacking pokemon
   * @param {*} attack attack stat of attacking pokemon
   * @param {*} def def of attacked pokemon
   * @param {*} power base power of the attack move
   * @param {*} cm coeff multiplicateur (stab * efficacité * random between 0.85 and 1 * others possibles)
   */
  getBaseDamage(level, attack, def, power, cm) {
    let value = level * 0.4 + 2;
    value = value * attack;
    value = value * power;
    value = value / (def * 50);
    value = value + 2;
    value = Math.floor(value);
    value = value * cm;
    return value;
  }

  setPosition(x, y) {
    this.positionX = x;
    this.positionY = y;
  }

  // choose the current target, return true if not null
  chooseTarget(board) {
    if (this.target != null) {
      // reset target if dead
      if (this.target.stats.HP <= 0) {
        this.target = null;
      }
    }
    if (this.target == null) {
      var newTarget = null;
      // find all opponents
      var pokemons = [];
      var self = this;
      board.forEach(function (cell) {
        if (cell != null && cell.group != self.group) {
          pokemons.push(cell);
        }
      });
      // for each opponent
      var unavailable = true, distance = 0, min = 999;
      for (var i = 0; i < pokemons.length; i++) {
        var pkmn = pokemons[i];
        // get cells adjacent to opponent
        var cells = board.getAdjacentCells(pkmn.positionX, pkmn.positionY);
        // if at least one cell is available, pokemon can be targeted
        unavailable = true;
        for (var j = 0; j < cells.length; j++) {
          if (cells[j].value == null) unavailable = false;
        }
        if (unavailable) continue;
        // test distance to choose closest pokemon as target
        distance = board.distance(this.positionX, this.positionX, pkmn.positionX, pkmn.positionY);
        if (distance < min) {
          newTarget = pkmn;
        }
      }
      this.target = newTarget;
    }
    return this.target != null;
  }

  isTargetInRange(board) {
    if (this.target == null) return false;
    var distance = board.distance(this.positionX, this.positionY, this.target.positionX, this.target.positionY);
    var range = 1; // set range = attack move range
    return distance <= range;
  }

  moveTowardTarget(board) {
    var range = 1; // set range = pkmn movement distance
    var cells = board.getCellsInRange(this.positionX, this.positionY, range);
    // filter cells to keep only empty cell
    var availableCells = [];
    for (var i = 0; i < cells.length; i++) {
      if (cells[i].value == null) availableCells.push(cells[i]);
    }
    // move to the best cell to go to target
    var cell = board.getNearestCell(this.target.positionX, this.target.positionY, availableCells);
    if (cell != null) {
      board.moveValue(this.positionX, this.positionY, cell.x, cell.y);
      this.setPosition(cell.x, cell.y);
    }
  }

  chooseAttackMove() {
    var move = {};
    if (this.energy < 100) {
      return this.baseMove;
    }
    else {
      this.energy = 0;
      return this.skillMove;
    }
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