import Button from './button';
import {GameObjects} from 'phaser';
import ItemDetail from './item-detail';

export default class ItemContainer extends Button {
  constructor(scene, x, y, item, dragable, place) {
    super(scene, x, y, dragable ? 70: 15, dragable ? 70: 15);
    this.objType = 'item';
    if (dragable) {
      this.add(new GameObjects.Ellipse(scene, 0, 0, 70, 70, 0xffffff, 0.7).setStrokeStyle(3, 0x000000, 1));
    } else {
      this.add(new GameObjects.Ellipse(scene, 0, 0, 30, 30, 0xffffff, 0.7).setStrokeStyle(1, 0x000000, 1));
    }
    this.sprite = new GameObjects.Image(scene, 0, 0, 'items', item).setScale(dragable ? 2:1, dragable? 2:1);
    this.detail = new ItemDetail(scene, 15, 0, item);
    this.name = item;
    this.place = place;
    this.add(this.sprite);
    this.add(this.detail);
    if (dragable) {
      scene.input.setDraggable(this);
    }
  }

  enterButtonHoverState() {
    this.detail.setScale(1, 1);
  }

  enterButtonRestState() {
    this.detail.setScale(0, 0);
  }
}
