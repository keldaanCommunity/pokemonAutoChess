import {GameObjects} from 'phaser';
import {ITEM_NAME, ITEM_DESCRIPTION} from '../../../../models/enum';

export default class ItemDetail extends GameObjects.Container {
  constructor(scene, x, y, name) {
    super(scene, x, y);
    this.textStyle = {
      fontSize: '35px',
      fontFamily: "Verdana",
      color: 'white',
      align: 'center',
      wordWrap: {width: 400, useAdvancedWrap: true}
    };
    this.descriptionTextStyle={
      fontSize: '15px',
      fontFamily: "Verdana",
      color: 'white',
      align: 'center',
      wordWrap: {width: 400, useAdvancedWrap: true}
    };
    this.add(new GameObjects.Rectangle(scene, 200, 160, 400, 240, 0x1a3e5b));
    this.add(new GameObjects.Text(scene, 50, 60, ITEM_NAME[name][window.langage], this.textStyle));
    this.add(new GameObjects.Text(scene, 10, 140, ITEM_DESCRIPTION[name][window.langage], this.descriptionTextStyle));
    this.add(new GameObjects.Image(scene, 30, 60, 'items', name));
    this.setScale(0, 0);
    scene.add.existing(this);
  }
}
