import {Item, BasicItem} from '../types/enum/Item';

export default class ItemFactory {
  static createRandomItem() {
    const keys = Object.keys(Item);
    return keys[Math.floor(Math.random() * keys.length)];
  }

  static createBasicRandomItem() {
    const keys = Object.keys(BasicItem);
    return keys[Math.floor(Math.random() * keys.length)];
  }

  static createRandomItems() {
    const keys = Object.keys(BasicItem);
    ItemFactory.shuffleArray(keys);
    const items = [];
    items.push(keys.pop());
    items.push(keys.pop());
    items.push(keys.pop());
    return items;
  }

  static createSpecificItems(array: string[]) {
    return array[Math.floor(Math.random() * array.length)];
  }

  static shuffleArray(array: string[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}
