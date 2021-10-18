import {GameObjects} from 'phaser';
import ItemContainer from './item-container';

export default class ItemsContainer extends GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);
    scene.add.existing(this);
  }

  changeStuff(field, value) {
    if (value == '') {
      this.removeItem(field);
    } else {
      switch (field) {
        case 'item0':
          this.add(new ItemContainer(this.scene, 0, 0, value, true, 'item0'));
          break;
        case 'item1':
          this.add(new ItemContainer(this.scene, 0, 30, value, true, 'item1'));
          break;
        case 'item2':
          this.add(new ItemContainer(this.scene, 0, 60, value, true, 'item2'));
          break;
        case 'item3':
          this.add(new ItemContainer(this.scene, 0, 90, value, true, 'item3'));
          break;
        case 'item4':
          this.add(new ItemContainer(this.scene, 0, 120, value, true, 'item4'));
          break;
        case 'item5':
          this.add(new ItemContainer(this.scene, 0, 150, value, true, 'item5'));
          break;
        case 'item6':
          this.add(new ItemContainer(this.scene, 0, 180, value, true, 'item6'));
          break;
        case 'item7':
          this.add(new ItemContainer(this.scene, 0, 210, value, true, 'item7'));
          break;
        case 'item8':
          this.add(new ItemContainer(this.scene, 0, 240, value, true, 'item8'));
          break;
      }
    }
  }

  removeItem(field) {
    const itemContainer = this.getFirst('place', field);
    this.remove(itemContainer, true);
  }

  updateItem(field) {
    const name = this.getFirst('place', field).name;
    this.removeItem(field);
    this.add(new ItemContainer(this.scene, 0, 0, name, true, field));
  }
}
