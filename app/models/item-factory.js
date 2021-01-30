const ITEMS = require('./enum').ITEMS;

class ItemFactory {
  static createRandomItem() {
    const keys = Object.keys(ITEMS);
    return keys[Math.floor(Math.random() * keys.length)];
  }

  static createRandomStone() {
    const keys = [
      ITEMS.ICY_ROCK,
      ITEMS.WATER_STONE,
      ITEMS.THUNDER_STONE,
      ITEMS.LEAF_STONE,
      ITEMS.MOON_STONE,
      ITEMS.NIGHT_STONE,
      ITEMS.DAWN_STONE,
      ITEMS.FIRE_STONE
    ];
    return keys[Math.floor(Math.random() * keys.length)];
  }
}

module.exports = ItemFactory;
