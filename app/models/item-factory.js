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

  static getFossils() {
    return [
      ITEMS.DOME_FOSSIL,
      ITEMS.HELIX_FOSSIL,
      ITEMS.OLD_AMBER,
      ITEMS.ROOT_FOSSIL,
      ITEMS.CLAW_FOSSIL,
      ITEMS.SAIL_FOSSIL,
      ITEMS.JAW_FOSSIL,
      ITEMS.PLUME_FOSSIL,
      ITEMS.ARMOR_FOSSIL,
      ITEMS.COVER_FOSSIL,
      ITEMS.SKULL_FOSSIL
    ];
  }

  static createSpecificItems(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  static createRandomItems() {
    const keys = Object.keys(ITEMS);
    ItemFactory.shuffleArray(keys);
    const items = [];
    items.push(keys.pop());
    items.push(keys.pop());
    items.push(keys.pop());
    return items;
  }

  static createRandomFossils() {
    const keys = ItemFactory.getFossils();
    ItemFactory.shuffleArray(keys);
    const items = [];
    items.push(keys.pop());
    items.push(keys.pop());
    items.push(keys.pop());
    return items;
  }


  static shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}

module.exports = ItemFactory;
