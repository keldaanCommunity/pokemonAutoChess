import {GameObjects} from 'phaser';
import ItemContainer from './item-container';

export default class ItemsContainer extends GameObjects.Container {
  ITEM_SIZE = 80

  constructor(scene, stuff, x, y) {
    super(scene, x, y);

    console.log(stuff.length)
    scene.add.existing(this);
  }

  changeStuff(place, value) {
    if (value == '') {
      this.removeItem(place);
    } 
    else{
      this.addAtPlace(place, value)
    }
    
  }

  addAtPlace(place, value)
  {

    if(!value)
    {
      console.warn('adding empty value at', place)
      return
    }

    const placeInt = this.convertPlaceToInt(place)

    this.add(new ItemContainer(this.scene, 0, placeInt * this.ITEM_SIZE, value, true, place));
  }

  convertPlaceToInt(place)
  {
    switch (place) {
      case 'item0':
        return 0;
      case 'item1':
        return 1;
      case 'item2':
        return 2;
      case 'item3':
        return 3;
      case 'item4':
        return 4;
      case 'item5':
        return 5;
      case 'item6':
        return 6;
      case 'item7':
        return 7;
      case 'item8':
        return 8;
    }
  }

  findItem(place) {
    return this.getFirst('place', place);
  }

  removeItem(place) {
    const item = this.findItem(place)
    if(item)
    {
      this.remove(item, true);
    }
    else
    {
      console.warn('no item found at', place)
    }
  }

  updateItem(place) {
    const item = this.findItem(place)
    if(item)
    {
      let y = this.convertPlaceToInt(place) * this.ITEM_SIZE
      item.x = 0;
      item.y = y;
    }
  }
}
