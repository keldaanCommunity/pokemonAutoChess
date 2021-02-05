import {GameObjects} from 'phaser';
import Button from './button';
import {WORDS} from '../../../../models/enum';

export default class RefreshButton extends Button {
  constructor(scene, x, y) {
    super(scene, x, y, 200, 50);
    this.textStyle = {
      fontSize: '15px',
      fontFamily: "Verdana",
      color: 'white',
      align: 'center'
    };

    const graphics = new GameObjects.Graphics(scene);
    const color = 0xffffff;
    const thickness = 1;
    const alpha = 1;
    graphics.lineStyle(thickness, color, alpha);
    graphics.strokeRect(-100, -25, 200, 50);

    this.add(new GameObjects.Rectangle(scene, 0, 0, 200, 50, 0x293942));
    this.add(graphics);
    this.add(new GameObjects.Text(scene, -60, -10, WORDS.REFRESH[window.langage], this.textStyle));
    this.add(new GameObjects.Text(scene, 55, -20, '2', this.textStyle));
    this.add(new GameObjects.Image(scene, 85, -15, 'money').setScale(0.5, 0.5));
  }

  enterButtonHoverState() {
  }

  enterButtonRestState() {
  }

  enterButtonActiveState() {
    window.dispatchEvent(new CustomEvent('refresh-click'));
  }
}
