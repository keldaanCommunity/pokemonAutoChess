import Button from './button';
import {GameObjects} from 'phaser';

export default class SpecialCellContainer extends Button {
  constructor(scene, x, y, mapType) {
    super(scene, x, y, 50, 50);
    this.sprite = new GameObjects.Sprite(scene, 0, 0, 'attacks', `${mapType}/cell/000`);
    this.add(this.sprite);
    scene.add.existing(this);
  }

  enterButtonHoverState() {
    // this.detail.setScale(1,1);
  }

  enterButtonRestState() {
    // this.detail.setScale(0,0);
  }
}
