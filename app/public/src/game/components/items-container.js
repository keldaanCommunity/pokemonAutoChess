import {GameObjects} from 'phaser';
import ItemContainer from './item-container';
export default class ItemsContainer extends GameObjects.Container {
  constructor(scene, inventory, x, y, dragable) {
    super(scene, x, y);
    this.itemSize = dragable ? 80: 30;
    this.dragable = dragable;
    scene.add.existing(this);

    inventory.forEach((item) => {
      this.addItem(item);
    });
  }

  addItem(value) {
    if (!this.findItem(value)) {
      this.add(new ItemContainer(this.scene, 0, 0, value, this.dragable));
    }
    this.updateItems();
  }

  removeItem(item) {
    const target = this.findItem(item);
    if (target) {
      this.remove(target, true);
      target.destroy();

      this.updateItems();
    } else {
      console.warn('no item found looking for', item);
    }
  }

  updateItems() {
    for (let i = 0; i < this.list.length; i++) {
      this.list[i].x = 0;
      this.list[i].y = i * this.itemSize;
    }
  }

  findItem(item) {
    return this.getFirst('name', item);
  }
}
