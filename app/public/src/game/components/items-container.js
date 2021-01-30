import {GameObjects} from 'phaser';
import ItemContainer from './item-container';

export default class ItemsContainer extends GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);
    scene.add.existing(this);
    this.placement = {
      'item0': {
        x: 0,
        y: 0
      },
      'item1': {
        x: 48,
        y: 0
      },
      'item2': {
        x: 96,
        y: 0
      },
      'item3': {
        x: 0,
        y: 48
      },
      'item4': {
        x: 48,
        y: 48
      },
      'item5': {
        x: 96,
        y: 48
      },
      'item6': {
        x: 0,
        y: 96
      },
      'item7': {
        x: 48,
        y: 96
      },
      'item8': {
        x: 96,
        y: 96
      }
    };
  }

  changeStuff(field, value) {
    if (value == '') {
      this.removeItem(field);
    } else {
      switch (field) {
        case 'item0':
          this.add(new ItemContainer(this.scene, this.placement[field].x, this.placement[field].y, value, true, 'item0'));
          break;
        case 'item1':
          this.add(new ItemContainer(this.scene, this.placement[field].x, this.placement[field].y, value, true, 'item1'));
          break;
        case 'item2':
          this.add(new ItemContainer(this.scene, this.placement[field].x, this.placement[field].y, value, true, 'item2'));
          break;
        case 'item3':
          this.add(new ItemContainer(this.scene, this.placement[field].x, this.placement[field].y, value, true, 'item3'));
          break;
        case 'item4':
          this.add(new ItemContainer(this.scene, this.placement[field].x, this.placement[field].y, value, true, 'item4'));
          break;
        case 'item5':
          this.add(new ItemContainer(this.scene, this.placement[field].x, this.placement[field].y, value, true, 'item5'));
          break;
        case 'item6':
          this.add(new ItemContainer(this.scene, this.placement[field].x, this.placement[field].y, value, true, 'item6'));
          break;
        case 'item7':
          this.add(new ItemContainer(this.scene, this.placement[field].x, this.placement[field].y, value, true, 'item7'));
          break;
        case 'item8':
          this.add(new ItemContainer(this.scene, this.placement[field].x, this.placement[field].y, value, true, 'item8'));
          break;
      }
    }
  }

  removeItem(field) {
    const itemContainer = this.getFirst('place', field);
    this.remove(itemContainer);
  }

  updateItem(field) {
    const name = this.getFirst('place', field).name;
    this.removeItem(field);
    this.add(new ItemContainer(this.scene, this.placement[field].x, this.placement[field].y, name, true, field));
  }
}
