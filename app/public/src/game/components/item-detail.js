import {GameObjects} from 'phaser';
import {ITEM_NAME, ITEM_DESCRIPTION} from '../../../../models/enum';

export default class ItemDetail extends GameObjects.Container {
  constructor(scene, x, y, name) {
    super(scene, x, y);
    this.textStyle = {
      fontSize: '35px',
      fontFamily: '\'Press Start 2P\'',
      color: 'black',
      wordWrap: {width: 600, useAdvancedWrap: true}
    };
    this.descriptionTextStyle={
      fontSize: '20px',
      fontFamily: '\'Press Start 2P\'',
      color: 'black',
      wordWrap: {width: 600, useAdvancedWrap: true}
    };
    this.add(new GameObjects.Rectangle(scene, 300, 160, 600, 240, 0xffffff).setAlpha(0.7).setStrokeStyle(3, 0x000000, 1));
    this.add(new GameObjects.Text(scene, 60, 60, ITEM_NAME[name], this.textStyle));
    this.add(new GameObjects.Text(scene, 10, 140, ITEM_DESCRIPTION[name], this.descriptionTextStyle));
    this.add(new GameObjects.Image(scene, 30, 70, 'items', name).setScale(2, 2));
    this.setScale(0, 0);
    scene.add.existing(this);
  }
}
