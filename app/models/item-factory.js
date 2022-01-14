const ITEMS = require('./enum').ITEMS;

class ItemFactory {
  static createRandomItem() {
    const keys = Object.keys(ITEMS);
    return keys[Math.floor(Math.random() * keys.length)];
  }

  static stones = [
    ITEMS.ICY_ROCK,
    ITEMS.WATER_STONE,
    ITEMS.THUNDER_STONE,
    ITEMS.LEAF_STONE,
    ITEMS.MOON_STONE,
    ITEMS.NIGHT_STONE,
    ITEMS.DAWN_STONE,
    ITEMS.FIRE_STONE
  ];

  static fossils = [
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

  static wonderBoxPool = [
    ITEMS.WHITE_GLASSES,
    ITEMS.MUSCLE_BAND,
    ITEMS.LIFE_ORB,
    ITEMS.COIN_AMULET,
    ITEMS.ROCKY_HELMET,
    ITEMS.SHELL_BELL,
    ITEMS.BIG_ROOT,
    ITEMS.APRICOT_BERRY,
    ITEMS.LIECHI_BERRY,
    ITEMS.GANLON_BERRY,
    ITEMS.PETAYA_BERRY,
    ITEMS.SALAC_BERRY,
    ITEMS.ORAN_BERRY,
    ITEMS.SOFT_SAND,
    ITEMS.MOON_STONE,
    ITEMS.NIGHT_STONE,
    ITEMS.POISON_BARB,
    ITEMS.DRAGON_FANG,
    ITEMS.THUNDER_STONE,
    ITEMS.METAL_SKIN,
    ITEMS.METRONOME,
    ITEMS.WATER_STONE,
    ITEMS.FIRE_STONE,
    ITEMS.LEAF_STONE,
    ITEMS.BLACK_BELT,
    ITEMS.SILK_SCARF,
    ITEMS.DAWN_STONE,
    ITEMS.ICY_ROCK,
    ITEMS.RAZOR_FANG,
    ITEMS.RAZOR_CLAW,
    ITEMS.SCOPE_LENS,
    ITEMS.REVIVER_SEED,
    ITEMS.ASSAULT_VEST,
    ITEMS.BLUE_ORB,
    ITEMS.RED_ORB,
    ITEMS.DELTA_ORB
  ];
  

  static createRandomStone() {
    return this.stones[Math.floor(Math.random() * stones.length)];
  }

  static getFossils() {
    return this.fossils;
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

  static createRandomWonderBoxItem() {
    return this.wonderBoxPool[Math.floor(Math.random() * this.wonderBoxPool.length)];
  }

  static createRandomFossils() {
    ItemFactory.shuffleArray(fossils);
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
