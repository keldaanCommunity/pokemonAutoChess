import {Item, BasicItems} from '../types/enum/Item'

export default class ItemFactory {
  static createRandomItem() {
    const keys = Object.keys(Item) as Item[]
    return keys[Math.floor(Math.random() * keys.length)]
  }

  static createBasicRandomItem() {
    return BasicItems[Math.floor(Math.random() * BasicItems.length)]
  }

  static createRandomItems() {
    const b = BasicItems.slice()
    ItemFactory.shuffleArray(b)
    const items = new Array<Item>()
    for (let i = 0; i < 3; i++) {
      const p = b.pop()
      if(p){
        items.push(p)
      }
    }
    return items
  }

  static createSpecificItems(array: Item[]) {
    return array[Math.floor(Math.random() * array.length)]
  }

  static shuffleArray(array: Item[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]
    }
  }
}
