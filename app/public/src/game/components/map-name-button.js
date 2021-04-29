import {GameObjects} from 'phaser';
import Button from './button';
import {MAP_TYPE_NAME} from '../../../../models/enum';
import MapNameDetail from './map-name-detail';

export default class MapNameButton extends Button {
  constructor(scene, x, y, mapType, langage) {
    super(scene, x, y, 230, 50);
    this.textStyle = {
      fontSize: '30px',
      fontFamily: 'Verdana',
      color: 'white',
      strokeThickness:'2',
      stroke: '#000',
    };

    this.add(new GameObjects.Text(scene, -115, -20, MAP_TYPE_NAME[mapType][langage], this.textStyle));
    this.detail = new MapNameDetail(scene, 280, 165, mapType, langage);
  }

  enterButtonHoverState() {
    this.detail.setScale(1, 1);
  }

  enterButtonRestState() {
    this.detail.setScale(0, 0);
  }

  enterButtonActiveState() {
  }
}
