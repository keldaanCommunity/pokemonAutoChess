const schema = require('@colyseus/schema');
const Schema = schema.Schema;

class Items extends Schema {
  constructor(items) {
    super();
    this.length = 0;
    this.assign({
      item0: '',
      item1: '',
      item2: ''
    });

    if (items) {
      this.add(items.item0);
      this.add(items.item1);
      this.add(items.item2);
    }
  }

  getAllItems() {
    const stuffs = [];
    if (this.item0 != '') {
      stuffs.push(this.item0);
    }
    if (this.item1 != '') {
      stuffs.push(this.item1);
    }
    if (this.item2 != '') {
      stuffs.push(this.item2);
    }
    return stuffs;
  }

  add(itemToAdd) {
    if (this.item0 == '') {
      this.item0 = itemToAdd;
      this.length ++;
    } else if (this.item1 == '') {
      this.item1 = itemToAdd;
      this.length ++;
    } else if (this.item2 == '') {
      this.item2 = itemToAdd;
      this.length ++;
    }
  }

  count(itemToCount) {
    let c = 0;
    if (this.item1 == itemToCount) {
      c++;
    }
    if (this.item2 == itemToCount) {
      c++;
    }
    if (this.item0 == itemToCount) {
      c++;
    }
    return c;
  }

  remove(itemToRemove) {
    if (this.item1 == itemToRemove) {
      this.item1 = '';
      this.length --;
    } else if (this.item2 == itemToRemove) {
      this.item2 = '';
      this.length --;
    } else if (this.item0 == itemToRemove) {
      this.item0 = '';
      this.length --;
    }
  }
}

schema.defineTypes(Items, {
  item1: 'string',
  item2: 'string',
  item0: 'string'
});

module.exports = Items;
