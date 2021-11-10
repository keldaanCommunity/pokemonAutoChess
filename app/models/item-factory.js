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

  static createSpecificItems(array){
    return array[Math.floor(Math.random() * array.length)];
  }

  static createRandomItems(){
    let keys = Object.keys(ITEMS);
    ItemFactory.shuffleArray(keys);
    let items = [];
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
