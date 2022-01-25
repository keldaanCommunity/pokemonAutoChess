import {GameObjects} from 'phaser';
import ItemContainer from './item-container';

export default class ItemsContainer extends GameObjects.Container {
  ITEM_SIZE = 80

  constructor(scene, inventory, x, y) {
    super(scene, x, y);
    scene.add.existing(this);

    inventory.forEach((item) => {
      this.addItem(item)
    })
  }

  addItem(value)
  {
    this.add(new ItemContainer(this.scene, 0, 0, value, true));

    this.updateItems()
  }

  removeItem(item) {
    const target = this.findItem(item)
    if(target)
    {
      this.remove(target, true);
      target.destroy();

      this.updateItems()
      
    }
    else
    {
      console.warn('no item found looking for', item)
    }
  }

  updateItems()
  {    
    for(let i = 0; i < this.list.length; i++){
      this.list[i].x = 0;
      this.list[i].y = i * this.ITEM_SIZE
    }
  }

  findItem(item) {
    return this.getFirst('name', item);
  }

}
