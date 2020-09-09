import {GameObjects} from 'phaser';
import {ITEM_NAME, ITEM_DESCRIPTION} from '../../../../models/enum';

export default class ItemDetail extends GameObjects.Container {
  constructor(scene, x, y, name) {
    super(scene, x, y);
    this.textStyle = {
        fontSize: '20px',
        fontFamily: 'Verdana',
        color: 'white',
        align: 'center',
        wordWrap: { width: 200, useAdvancedWrap: true }
      };
    this.descriptionTextStyle={
        fontSize: '12px',
        fontFamily: 'Verdana',
        color: 'white',
        align: 'center',
        wordWrap: { width: 200, useAdvancedWrap: true }   
    }
    this.add(new GameObjects.Rectangle(scene, 100, 80, 200, 120, 0x686d7d));
    this.add(new GameObjects.Text(scene,50,30,ITEM_NAME[name],this.textStyle));
    this.add(new GameObjects.Text(scene,0,70,ITEM_DESCRIPTION[name],this.descriptionTextStyle));
    this.add(new GameObjects.Image(scene,30,40,'items',name));
    this.setScale(0, 0);
    scene.add.existing(this);
  }
}
