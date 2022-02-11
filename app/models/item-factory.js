const ITEM = require('./enum').ITEM;

class ItemFactory {
  static createRandomItem() {
    const keys = Object.keys(ITEM);
    return keys[Math.floor(Math.random() * keys.length)];
  }

  static createSpecificItems(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  static createRandomItems() {
    const keys = Object.keys(ITEM);
    ItemFactory.shuffleArray(keys);
    const items = [];
    items.push(keys.pop());
    items.push(keys.pop());
    let item = keys.pop();
    while (this.fossils.includes(item)) {
      item = keys.pop();
    }
    items.push(item);
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
