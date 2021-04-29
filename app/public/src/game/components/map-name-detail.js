import {GameObjects} from 'phaser';
import {MAP_TYPE_NAME, MAP_TYPE_NAME_DESCRIPTION} from '../../../../models/enum';

export default class MapNameDetail extends GameObjects.Container {
  constructor(scene, x, y, mapType, langage) {
    super(scene, x, y);
    this.textStyle = {
      fontSize: '35px',
      fontFamily: "Verdana",
      color: 'white',
      align: 'center',
      wordWrap: {width: 400, useAdvancedWrap: true}
    };
    this.descriptionTextStyle={
      fontSize: '20px',
      fontFamily: "Verdana",
      color: 'white',
      align: 'center',
      wordWrap: {width: 400, useAdvancedWrap: true}
    };
    this.add(new GameObjects.Image(scene, 200, 160, 'littleDetail'));
    this.add(new GameObjects.Text(scene, 50, 60, MAP_TYPE_NAME[mapType][langage], this.textStyle));
    this.add(new GameObjects.Text(scene, 50, 140, MAP_TYPE_NAME_DESCRIPTION[mapType][langage], this.descriptionTextStyle));
    this.setScale(0, 0);
    scene.add.existing(this);
  }
}
