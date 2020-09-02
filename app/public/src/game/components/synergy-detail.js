/* eslint-disable max-len */

import {GameObjects} from 'phaser';

export default class SynergyDetail extends GameObjects.Container {
  constructor(scene, x, y, type) {
    super(scene, x, y);

    this.add(new GameObjects.Image(scene, 0, 0, 'type-details', type));
    this.setScale(0, 0);
    scene.add.existing(this);
  }
}
