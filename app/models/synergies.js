const schema = require('@colyseus/schema');
const PokemonFactory = require('./pokemon-factory');

class Synergies extends schema.Schema {
  constructor() {
    super();
    this.setToZero();
  }

  update(board) {
    const pokemonNames = [];
    this.setToZero();
    for (const id in board) {
      const family = PokemonFactory.getPokemonFamily(board[id].name);
      if (!pokemonNames.includes(family) && board[id].positionY != 0) {
        pokemonNames.push(family);
        board[id].types.forEach( (type) => {
          this[type] += 1;
        });
      }
    }
  }

  setToZero() {
    this.NORMAL = 0;
    this.GRASS = 0;
    this.NORMAL= 0;
    this.GRASS = 0;
    this.FIRE = 0;
    this.WATER = 0;
    this.ELECTRIC = 0;
    this.FIGHTING = 0;
    this.PSYCHIC = 0;
    this.DARK = 0;
    this.METAL = 0;
    this.GROUND = 0;
    this.POISON = 0;
    this.DRAGON = 0;
    this.FIELD = 0;
    this.MONSTER = 0;
    this.HUMAN = 0;
    this.AQUATIC = 0;
    this.BUG = 0;
    this.FLYING = 0;
    this.FLORA = 0;
    this.MINERAL = 0;
    this.AMORPH = 0;
    this.FAIRY= 0;
  }
}

schema.defineTypes(Synergies, {
  NORMAL: 'uint8',
  GRASS: 'uint8',
  NORMAL: 'uint8',
  GRASS: 'uint8',
  FIRE: 'uint8',
  WATER: 'uint8',
  ELECTRIC: 'uint8',
  FIGHTING: 'uint8',
  PSYCHIC: 'uint8',
  DARK: 'uint8',
  METAL: 'uint8',
  GROUND: 'uint8',
  POISON: 'uint8',
  DRAGON: 'uint8',
  FIELD: 'uint8',
  MONSTER: 'uint8',
  HUMAN: 'uint8',
  AQUATIC: 'uint8',
  BUG: 'uint8',
  FLYING: 'uint8',
  FLORA: 'uint8',
  MINERAL: 'uint8',
  AMORPH: 'uint8',
  FAIRY: 'uint8'
});

module.exports = Synergies;
