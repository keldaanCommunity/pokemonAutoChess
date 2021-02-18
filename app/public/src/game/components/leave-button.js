import {GameObjects} from 'phaser';
import Button from './button';
import {WORDS} from '../../../../models/enum';

export default class LeaveButton extends Button {
  constructor(scene, x, y) {
    super(scene, x, y, 480, 100);
    this.textStyle = {
      fontSize: '25px',
      fontFamily: '"Press Start 2P"',
      color: 'white',
      align: 'center',
      strokeThickness:'3',
      stroke: '#000',
    };
    this.add(new GameObjects.Text(scene, -200, 0, WORDS.LEAVE[window.langage], this.textStyle));
  }

  enterButtonHoverState() {
  }

  enterButtonRestState() {
  }

  enterButtonActiveState() {
    document.getElementById('game').dispatchEvent(new CustomEvent('leave-game'));
  }
}
