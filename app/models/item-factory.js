const ITEMS = require('./enum').ITEMS;

class ItemFactory{

    static createRandomItem(){
        let keys = Object.keys(ITEMS);
        return keys[Math.floor(Math.random() * keys.length)];
    }

}

module.exports = ItemFactory;